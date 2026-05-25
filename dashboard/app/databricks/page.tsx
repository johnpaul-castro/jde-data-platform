"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DB = "/databricks";

interface Screenshot { src: string; caption: string; }
interface Section {
  id: string; num: string; title: string; accent: string;
  description: string; screenshots: Screenshot[];
}

const SECTIONS: Section[] = [
  {
    id: "setup", num: "01", title: "Setup & Catalog Configuration",
    accent: "border-sky-500",
    description: "Fresh Databricks trial workspace. jde_demo catalog created with bronze/silver/gold schemas. Unity Catalog Volume stores source CSVs at /Volumes/jde_demo/bronze/raw_files/. 6 JDE ERP tables uploaded for ingestion.",
    screenshots: [
      { src: `${DB}/01-welcome-databricks.png`, caption: "Fresh Databricks workspace with Welcome page and starter cards" },
      { src: `${DB}/02-catalog-hierarchy.png`, caption: "Unity Catalog: jde_demo with bronze, default, gold, information_schema, silver schemas" },
      { src: `${DB}/03-catalog-volume-empty.png`, caption: "Volume at /Volumes/jde_demo/bronze/raw_files/ before upload (empty state)" },
      { src: `${DB}/04-catalog-volume-uploaded.png`, caption: "6 CSVs uploaded: F0101 (25KB), F0116 (192KB), F03B11 (142KB), F4101 (174KB), F4201 (159KB), F4211 (196KB)" },
      { src: `${DB}/05-schema-setup-csv-validation.png`, caption: "CREATE SCHEMA, CREATE VOLUME, SELECT from CSV via read_files() with raw JDE columns" },
      { src: `${DB}/06-workspace-files.png`, caption: "Workspace: notebooks, dashboards, queries, DQ files, Genie Space" },
    ],
  },
  {
    id: "bronze", num: "02", title: "Bronze Layer: Raw Ingestion",
    accent: "border-amber-600",
    description: "6 streaming tables ingest CSVs from Unity Catalog Volume using CREATE OR REFRESH STREAMING TABLE with STREAM read_files(). Metadata columns added. Raw JDE column names preserved.",
    screenshots: [
      { src: `${DB}/07-bronze-notebook.png`, caption: "Bronze notebook: 6 streaming tables with CSV format, header detection, type inference" },
      { src: `${DB}/08-bronze-raw-f4211.png`, caption: "Raw JDE data: SDDOCO, SDDCTO, SDKCOO, SDSHAN, SDITM preserved from JD Edwards" },
    ],
  },
  {
    id: "silver", num: "03", title: "Silver Layer: Cleansed + Validated",
    accent: "border-slate-400",
    description: "DLT Expectations enforce quality (DROP ROW vs WARN). JDE codes transformed to business names. Column sensitivity tags (PII, highly_confidential) applied.",
    screenshots: [
      { src: `${DB}/09-silver-expectations.png`, caption: "DLT Expectations: COMPLETENESS, VALIDITY, CONSISTENCY constraints with ON VIOLATION actions" },
      { src: `${DB}/10-silver-cleansed-f4211.png`, caption: "Cleansed: SDDOCO to order_number, SDSHAN to customer_id, SDITM to item_id" },
      { src: `${DB}/11-silver-table-detail.png`, caption: "f0101_cleansed: sensitivity tags (customer_name: pii, tax_id: highly_confidential), top joins, related assets" },
    ],
  },
  {
    id: "gold", num: "04", title: "Gold Layer: Business Models",
    accent: "border-yellow-500",
    description: "Denormalized sales orders (4-table join), AR aging with DATEDIFF buckets, SCD Type 2 customer dimension with AUTO CDC, daily summaries, and DQ views.",
    screenshots: [
      { src: `${DB}/12-gold-notebook.png`, caption: "Gold notebook: sales_orders_enriched (4-table join), daily_sales_summary" },
      { src: `${DB}/13-gold-ar-aging-sql.png`, caption: "ar_aging_analysis: DATEDIFF buckets (Current through 90+ Days) with aging_bucket_sort" },
      { src: `${DB}/14-gold-sales-enriched.png`, caption: "Results: Pilatus Aircraft, Bell Textron, Airbus, GE Aerospace with product groups" },
      { src: `${DB}/15-gold-ar-aging-results.png`, caption: "Boeing AR: payment_status (H/O), days_past_due, aging bucket assignments" },
      { src: `${DB}/16-gold-scd2-results.png`, caption: "dim_customer_scd2: surrogate keys, _START_AT/_END_AT for SCD Type 2 history" },
      { src: `${DB}/17-gold-scd2-code.png`, caption: "CREATE FLOW AUTO CDC, KEYS(address_id), STORED AS SCD TYPE 2" },
    ],
  },
  {
    id: "pipeline", num: "05", title: "Lakeflow Declarative Pipeline",
    accent: "border-green-500",
    description: "jde-medallion-pipeline: ETL on Serverless, Triggered mode. Up to 22 tables across Bronze/Silver/Gold.",
    screenshots: [
      { src: `${DB}/18-pipeline-dag-full.png`, caption: "Complete DAG (May 18, 46s): Bronze streaming > Silver views > Gold models" },
      { src: `${DB}/20-pipeline-table-list.png`, caption: "Full table list with Expectations, durations, Incremental/Full modes" },
      { src: `${DB}/19-pipeline-dag-may21.png`, caption: "May 21: Refresh All in 1m 12s, 22 tables, Serverless compute" },
      { src: `${DB}/22-pipeline-f4211-selected.png`, caption: "f4211_cleansed: 11 met | 4 unmet Expectations, 1K warnings, 0 dropped" },
      { src: `${DB}/23-pipeline-empty-state.png`, caption: "Before first run: empty pipeline state with Run pipeline button" },
    ],
  },
  {
    id: "workflow", num: "06", title: "Workflow Orchestration",
    accent: "border-blue-500",
    description: "jde-daily-pipeline: 3-task DAG with cascade failure handling.",
    screenshots: [
      { src: `${DB}/24-workflow-overview.png`, caption: "3-task DAG with performance optimized ON" },
      { src: `${DB}/25-workflow-task1.png`, caption: "Task 1: validate_source_file (SQL)" },
      { src: `${DB}/26-workflow-task2.png`, caption: "Task 2: run_pipeline (Pipeline trigger)" },
      { src: `${DB}/27-workflow-task3.png`, caption: "Task 3: run_dq_checks (SQL)" },
      { src: `${DB}/28-workflow-lineage.png`, caption: "7 upstream tables from 30-day lineage" },
      { src: `${DB}/29-workflow-failed-run.png`, caption: "Failed run: cascade failure demonstration" },
    ],
  },
  {
    id: "rbac", num: "07", title: "Unity Catalog RBAC & Governance",
    accent: "border-violet-500",
    description: "4 role-based groups with progressive schema permissions. Column sensitivity tags. Predictive optimization.",
    screenshots: [
      { src: `${DB}/30-rbac-grants-script.png`, caption: "21 GRANT statements establishing full RBAC" },
      { src: `${DB}/31-rbac-catalog.png`, caption: "SHOW GRANTS ON CATALOG: 4 groups" },
      { src: `${DB}/32-rbac-bronze.png`, caption: "Bronze schema grants" },
      { src: `${DB}/33-rbac-silver.png`, caption: "Silver schema grants" },
      { src: `${DB}/34-rbac-gold.png`, caption: "Gold schema grants" },
      { src: `${DB}/35-rbac-group.png`, caption: "data_platform_admin group membership" },
      { src: `${DB}/36-rbac-sensitivity-tags.png`, caption: "Sensitivity tags + DESCRIBE DETAIL with S3 location" },
    ],
  },
  {
    id: "dq", num: "08", title: "Data Quality Framework",
    accent: "border-emerald-500",
    description: "Multi-layer: 53 DLT Expectations, Gold-layer checks, DQ Monitor dashboard via Genie Code.",
    screenshots: [
      { src: `${DB}/37-dq-event-log-53.png`, caption: "53 DLT Expectations with pass rates from 0% to 100%" },
      { src: `${DB}/38-dq-summary.png`, caption: "dq_summary_dashboard: 9 checks all PASS" },
      { src: `${DB}/39-dq-uniqueness.png`, caption: "4 composite key uniqueness checks, 0 duplicates" },
      { src: `${DB}/40-dq-referential.png`, caption: "5 FK referential integrity checks, 0 orphans" },
      { src: `${DB}/41-dq-row-count.png`, caption: "Row count reconciliation: Bronze = Silver" },
      { src: `${DB}/42-dq-monitor-dashboard.png`, caption: "JDE DQ Monitor dashboard built with Genie Code" },
    ],
  },
  {
    id: "dashboards", num: "09", title: "AI/BI Dashboards",
    accent: "border-cyan-500",
    description: "JDE Sales Analytics: 4-tab dashboard built with Genie Code (159 steps).",
    screenshots: [
      { src: `${DB}/43-dash-revenue-overview.png`, caption: "Revenue Overview: $3.36M, Monthly Trend, Revenue by Status, Top Customers" },
      { src: `${DB}/44-dash-customer.png`, caption: "Customer Analysis: 50 customers, Leaderboard, scatter plot" },
      { src: `${DB}/45-dash-product.png`, caption: "Product Performance: Revenue by Group donut, Product Leaderboard" },
      { src: `${DB}/46-dash-ar-aging.png`, caption: "AR Aging: $450K open, aging buckets, Open Invoice Detail" },
      { src: `${DB}/47-dashboards-list.png`, caption: "Dashboards list with Genie Code 159-step plan" },
    ],
  },
  {
    id: "lineage", num: "10", title: "Lineage & Genie Spaces",
    accent: "border-pink-500",
    description: "Visual lineage graphs and natural language queries with role-based sharing.",
    screenshots: [
      { src: `${DB}/48-lineage-graph.png`, caption: "Visual lineage: Silver sources > sales_orders_enriched > Gold consumers" },
      { src: `${DB}/49-lineage-table.png`, caption: "Lineage tab: upstream/downstream with asset types" },
      { src: `${DB}/50-genie-query.png`, caption: "Natural language: 'Which products have the most orders?'" },
      { src: `${DB}/51-genie-sharing.png`, caption: "Role-based sharing: View/Edit/Manage by group" },
    ],
  },
  {
    id: "delta", num: "11", title: "Delta Lake & Query Performance",
    accent: "border-orange-500",
    description: "Delta Lake time travel, VACUUM, DESCRIBE HISTORY. Photon engine query profiling.",
    screenshots: [
      { src: `${DB}/52-delta-history.png`, caption: "DESCRIBE HISTORY: CREATE TABLE > DLT SETUP > STREAMING UPDATE" },
      { src: `${DB}/53-delta-describe-extended.png`, caption: "Column statistics: min/max/distinct_count, ANALYZE TABLE" },
      { src: `${DB}/54-query-profile.png`, caption: "18.4s, 96% Photon, execution plan with scan/join/aggregate" },
      { src: `${DB}/55-query-history.png`, caption: "Query History: 100+ pipeline queries with profiles" },
    ],
  },
  {
    id: "connectors", num: "12", title: "Data Ingestion Connectors",
    accent: "border-red-500",
    description: "Native connectors to SQL Server, Salesforce, Oracle, PostgreSQL, SAP, Snowflake.",
    screenshots: [
      { src: `${DB}/56-connectors.png`, caption: "Databricks + Fivetran connectors for enterprise data sources" },
    ],
  },
];

function Screenshot({ src, caption }: Screenshot) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="mb-5">
      <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
        {!loaded && (
          <div className="w-full h-48 bg-slate-800 animate-pulse flex items-center justify-center">
            <span className="text-slate-600 text-sm">Loading...</span>
          </div>
        )}
        <Image src={src} alt={caption} width={1920} height={1040}
          className={`w-full h-auto transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)} unoptimized />
      </div>
      <p className="text-slate-500 text-xs mt-2 leading-relaxed italic pl-1">{caption}</p>
    </div>
  );
}

function SectionBlock({ section, isOpen, onToggle }: { section: Section; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="mb-3">
      <button onClick={onToggle}
        className={`w-full text-left bg-slate-900 border ${isOpen ? section.accent : "border-slate-800"} rounded-xl p-5 transition-all hover:bg-slate-800`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-xs font-mono ${isOpen ? "text-orange-400" : "text-slate-600"} w-6`}>{section.num}</span>
            <h3 className="font-bold text-white text-base">{section.title}</h3>
            <span className="text-slate-600 text-xs hidden sm:inline">{section.screenshots.length} screenshot{section.screenshots.length !== 1 ? "s" : ""}</span>
          </div>
          <span className={`text-slate-400 text-xl transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>
      {isOpen && (
        <div className="bg-slate-900/50 border border-slate-800 border-t-0 rounded-b-xl p-6 -mt-2">
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{section.description}</p>
          {section.screenshots.map((ss, i) => <Screenshot key={i} {...ss} />)}
        </div>
      )}
    </div>
  );
}

export default function DatabricksPortfolio() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setOpenSections(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const stats = [
    { label: "Pipeline Tables", value: "22" },
    { label: "Source Tables", value: "6" },
    { label: "DLT Expectations", value: "53" },
    { label: "DQ Checks", value: "9 / 9 PASS" },
    { label: "RBAC Groups", value: "4" },
    { label: "Dashboard Tabs", value: "4" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-6">
          <Link href="/" className="text-slate-500 text-sm hover:text-blue-400 transition-colors">← Back to Home</Link>
        </div>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-xs bg-orange-900/60 text-orange-300 px-3 py-1 rounded-full border border-orange-800">🔶 Databricks 14-Day Trial</span>
          <span className="text-xs bg-green-900/60 text-green-400 px-3 py-1 rounded-full border border-green-800">● Hands-On Build</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
          Databricks Lakehouse<br /><span className="text-orange-400">Portfolio</span>
        </h1>
        <p className="text-lg text-slate-400 mb-2 max-w-4xl">
          End-to-end Lakeflow Declarative Pipeline on Azure Databricks with Unity Catalog,
          medallion architecture, RBAC governance, AI/BI dashboards, Genie Spaces, and Delta Lake management.
          Built on JDE aerospace distribution data.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Built by <a href="mailto:johnpaulcastro@gmail.com" className="text-blue-400 hover:text-blue-300">JP Castro</a> · May 2026
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["Unity Catalog","Lakeflow DLT","Delta Lake","Serverless SQL","Photon Engine","Databricks Workflows","DLT Expectations","AI/BI Dashboards","Genie Spaces","Genie Code","SCD Type 2","Spark SQL","Predictive Optimization"].map(t => (
              <span key={t} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">{t}</span>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">Architecture</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-4">
              <div className="text-amber-400 font-bold text-sm mb-1">Bronze</div>
              <div className="text-slate-400 text-xs leading-relaxed">6 streaming tables from Unity Catalog Volumes. Raw JDE columns preserved.</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-600/40 rounded-lg p-4">
              <div className="text-slate-300 font-bold text-sm mb-1">Silver</div>
              <div className="text-slate-400 text-xs leading-relaxed">6 materialized views, 53 DLT Expectations, sensitivity tags.</div>
            </div>
            <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-1">Gold</div>
              <div className="text-slate-400 text-xs leading-relaxed">10 views: sales, AR aging, SCD2 customers, DQ monitors.</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-slate-300 text-sm font-medium">Download full portfolio as PDF</p>
            <p className="text-slate-500 text-xs mt-0.5">36 pages with 56 screenshots and detailed captions</p>
          </div>
          <a href="/databricks/JP_Castro_Databricks_Portfolio.pdf" target="_blank"
            className="text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">Download PDF</a>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Sections (56 screenshots)</h2>
          <div className="flex gap-2">
            <button onClick={() => setOpenSections(new Set(SECTIONS.map(s => s.id)))}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 transition-all">Expand All</button>
            <button onClick={() => setOpenSections(new Set())}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 transition-all">Collapse All</button>
          </div>
        </div>
        {SECTIONS.map(s => <SectionBlock key={s.id} section={s} isOpen={openSections.has(s.id)} onToggle={() => toggle(s.id)} />)}
        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-300 font-bold text-sm">JP Castro</p>
          <p className="text-slate-500 text-xs mt-1">Senior Data Architect · 25+ years · jpcenterprises.com · github.com/johnpaul-castro</p>
          <p className="text-slate-600 text-xs mt-3">Built on Databricks 14-day trial workspace · May 2026</p>
        </div>
      </div>
    </main>
  );
}