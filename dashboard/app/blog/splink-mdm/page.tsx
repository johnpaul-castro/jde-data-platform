import Link from "next/link";

export default function SplinkMdm() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 mb-6 inline-block">← Back to Blog</Link>

        <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
          <span>July 2026</span><span>·</span><span>8 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">How I Unified 5 ERPs into Golden Customer Records with Splink</h1>
        <div className="flex flex-wrap gap-2 mb-10">
          {["MDM","Splink","Python","Record Linkage","PostgreSQL"].map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{t}</span>
          ))}
        </div>

        <article className="prose-custom text-slate-300 text-sm leading-relaxed space-y-5">
          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Problem</h2>
          <p>
            When a company acquires other companies, it inherits their ERP systems. Each system has its own customer
            table with its own naming conventions, address formats, and identifiers. The same real-world customer
            appears in multiple systems under different names. Boeing might be &quot;Boeing Co.&quot; in JD Edwards,
            &quot;THE BOEING COMPANY&quot; in GEAC, and &quot;Boeing Defence UK Ltd&quot; in tcmIS.
          </p>
          <p>
            For this project, I simulated exactly this scenario: five separate ERP systems, each with their own
            customer records, schemas, and data quality issues. The goal was to build a Master Data Management (MDM)
            layer that could take 333 source records and resolve them into golden customer entities, with full
            cross-reference traceability.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Why Splink</h2>
          <p>
            The traditional approach to customer matching is deterministic: exact match on tax ID, or a series of
            business rules comparing name, city, and state. This works when your data is clean. It fails when
            &quot;Boeing Co.&quot; and &quot;THE BOEING COMPANY&quot; need to match, or when addresses are formatted
            differently across systems.
          </p>
          <p>
            Splink is an open-source Python library from the UK Ministry of Justice that implements the
            Fellegi-Sunter model for probabilistic record linkage. Instead of hard-coding rules, you define
            comparison columns and let the model calculate match probabilities using techniques like Jaro-Winkler
            string similarity. Each potential pair gets a match weight. You set a threshold, and pairs above it
            become linked entities.
          </p>
          <p>
            I chose Splink over alternatives like RecordLinkage or dedupe because it scales well on Spark (important
            for the Databricks version), has excellent documentation, and produces transparent match weights that
            are auditable. In MDM, auditability matters: you need to explain why two records were linked.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Pipeline</h2>
          <p>
            The architecture follows the same medallion pattern as the rest of the platform:
          </p>
          <p>
            <span className="text-amber-400 font-semibold">Bronze:</span> Node.js extractors pull raw customer
            records from each of the five simulated ERPs into PostgreSQL. Each record retains its source_system
            identifier and original primary key.
          </p>
          <p>
            <span className="text-slate-200 font-semibold">Silver:</span> dbt Core models normalize the records:
            standardize name casing, strip punctuation, parse addresses into components, and create a clean
            name_clean column for comparison. This is where &quot;THE BOEING COMPANY&quot; becomes &quot;boeing company&quot;
            and &quot;Boeing Co.&quot; becomes &quot;boeing co&quot;.
          </p>
          <p>
            <span className="text-yellow-400 font-semibold">Splink Matching:</span> A Python script runs Splink
            against the normalized Silver records. Comparison columns include name_clean (Jaro-Winkler),
            city, state_province, postal_code, and tax_id (exact match where available). The model produces
            cluster IDs grouping records that refer to the same entity.
          </p>
          <p>
            <span className="text-teal-400 font-semibold">Golden Records:</span> A final step selects the
            &quot;best&quot; record from each cluster as the golden record, using a priority ranking by source system.
            The cross-reference table maps every source record to its golden ID, enabling consolidated sales
            queries across all five ERPs.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Results</h2>
          <p>
            From 333 source customer records across five ERPs, Splink identified 82 duplicate clusters and
            produced 251 golden customer entities. The cross-reference table provides full traceability: for any
            golden record, you can see exactly which source records contributed and from which ERP system.
          </p>
          <p>
            The consolidated sales view joins order data from all five ERPs through the golden customer ID,
            giving a single revenue picture per real-world customer. This is the foundation that any quoting,
            pricing, or credit system would need to sit on.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Databricks Serverless Version</h2>
          <p>
            I later rebuilt this on Databricks Serverless with a DuckDB backend. DuckDB is compatible with
            Serverless compute (which does not support Spark), so Splink runs in single-node mode with DuckDB
            as the execution engine. The synthetic dataset uses the same five-company aerospace scenario. This
            version demonstrates that probabilistic record linkage works on Databricks even without a Spark
            cluster.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">What I Learned</h2>
          <p>
            The hardest part of MDM is not the matching algorithm. It is the normalization. If your Silver layer
            does not standardize names, addresses, and identifiers consistently, even the best probabilistic
            model will miss matches or produce false positives. I spent more time on the dbt normalization
            models than on the Splink configuration.
          </p>
          <p>
            The second lesson: match weights need to be visible. Stakeholders want to know why &quot;Boeing Co.&quot;
            and &quot;THE BOEING COMPANY&quot; were linked. Splink produces a match probability for every pair, broken
            down by comparison column. That transparency is what separates a trustworthy golden record from a
            black-box dedup.
          </p>
        </article>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/mdm" className="text-blue-400 text-sm hover:text-blue-300">→ See the MDM demo live</Link>
        </div>
      </div>
    </main>
  );
}
