"""
mdm_splink_match.py — Probabilistic customer matching using Splink
Reads from silver_erp.erp*_customer, writes to mdm.customer_clusters and mdm.customer_xref
"""

import pandas as pd
from sqlalchemy import create_engine, text
from splink import Linker, SettingsCreator, DuckDBAPI, block_on
import splink.comparison_library as cl

PG_URL = "postgresql://jp:jp@localhost:5432/jde_dw"
engine = create_engine(PG_URL)

# 1. Load all silver_erp customer tables into one DataFrame
query = """
SELECT * FROM silver_erp.erp1_customer
UNION ALL SELECT * FROM silver_erp.erp2_customer
UNION ALL SELECT * FROM silver_erp.erp3_customer
UNION ALL SELECT * FROM silver_erp.erp4_customer
UNION ALL SELECT * FROM silver_erp.erp5_customer
"""

df = pd.read_sql(query, engine)

# Create a unique_id for Splink
df["unique_id"] = df["source_system"] + "_" + df["source_customer_id"].astype(str)

print(f"Loaded {len(df)} customer records across 5 ERPs")

# 2. Normalize for matching
df["name_clean"] = (
    df["customer_name"]
    .str.upper()
    .str.strip()
    .str.replace(r"\s+(INC\.?|LLC|LTD|PLC|CORP\.?|COMPANY|CO\.?|THE)\s*$", "", regex=True)
    .str.replace(r"^\s*THE\s+", "", regex=True)
    .str.strip()
)

# 3. Configure Splink
settings = SettingsCreator(
    link_type="dedupe_only",
    comparisons=[
        cl.JaroWinklerAtThresholds("name_clean", [0.95, 0.88, 0.7]),
        cl.LevenshteinAtThresholds("postal_code", [1, 2]),
        cl.ExactMatch("tax_id").configure(term_frequency_adjustments=True),
        cl.ExactMatch("city"),
        cl.ExactMatch("state_province"),
    ],
    blocking_rules_to_generate_predictions=[
        block_on("name_clean"),
        block_on("tax_id"),
        block_on("postal_code"),
        block_on("city", "state_province"),
    ],
)

# 4. Run Splink
db_api = DuckDBAPI()
linker = Linker(df, settings, db_api=db_api)

linker.training.estimate_u_using_random_sampling(max_pairs=1e5)

try:
    linker.training.estimate_parameters_using_expectation_maximisation(
        block_on("name_clean"), fix_u_probabilities=True
    )
except Exception as e:
    print(f"EM training warning (name_clean): {e}")

try:
    linker.training.estimate_parameters_using_expectation_maximisation(
        block_on("tax_id"), fix_u_probabilities=True
    )
except Exception as e:
    print(f"EM training warning (tax_id): {e}")

# 5. Predict and cluster
predictions = linker.inference.predict(threshold_match_probability=0.5)
clusters = linker.clustering.cluster_pairwise_predictions_at_threshold(
    predictions, threshold_match_probability=0.7
)

clusters_df = clusters.as_pandas_dataframe()
print(f"Found {clusters_df['cluster_id'].nunique()} unique customer clusters from {len(clusters_df)} records")

# 6. Write results to PostgreSQL mdm schema
with engine.begin() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS mdm"))
    conn.execute(text("DROP TABLE IF EXISTS mdm.customer_clusters"))
    conn.execute(text("DROP TABLE IF EXISTS mdm.customer_xref"))

# Write clusters
clusters_df.to_sql("customer_clusters", engine, schema="mdm", index=False, if_exists="replace")

# 7. Build xref: merge cluster assignments back to original data
xref = df.merge(
    clusters_df[["unique_id", "cluster_id"]],
    on="unique_id",
    how="left"
)
# Records with no cluster get their own ID
xref.loc[xref["cluster_id"].isna(), "cluster_id"] = (
    xref.loc[xref["cluster_id"].isna(), "unique_id"].apply(hash).abs()
)
xref["cluster_id"] = xref["cluster_id"].astype(str)

xref[["cluster_id", "source_system", "source_customer_id", "customer_name", "name_clean",
      "city", "state_province", "postal_code", "tax_id", "email"]].to_sql(
    "customer_xref", engine, schema="mdm", index=False, if_exists="replace"
)

# 8. Build golden record: pick best name per cluster (longest = most complete)
golden = (
    xref.sort_values("customer_name", key=lambda s: s.str.len(), ascending=False)
    .groupby("cluster_id")
    .first()
    .reset_index()
)

golden = golden[["cluster_id", "customer_name", "city", "state_province",
                  "postal_code", "tax_id", "email", "source_system", "source_customer_id"]]
golden.columns = ["golden_customer_id", "golden_name", "golden_city", "golden_state",
                   "golden_postal_code", "golden_tax_id", "golden_email",
                   "primary_source", "primary_source_id"]

with engine.begin() as conn:
    conn.execute(text("DROP TABLE IF EXISTS mdm.customer_golden"))

golden.to_sql("customer_golden", engine, schema="mdm", index=False, if_exists="replace")

print(f"\nMDM complete:")
print(f"  mdm.customer_clusters — {len(clusters_df)} rows")
print(f"  mdm.customer_xref    — {len(xref)} rows")
print(f"  mdm.customer_golden  — {len(golden)} golden records")
