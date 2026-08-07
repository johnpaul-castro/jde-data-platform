import Link from "next/link";

const projects = [
  {
    title: "Azure Databricks Lakehouse",
    subtitle: "JDE Aerospace ERP on Databricks",
    description: "End-to-end data lakehouse for JD Edwards aerospace data. Full medallion architecture with Lakeflow Declarative Pipelines (DLT), SCD Type 2 via APPLY CHANGES INTO, DLT Expectations for data quality, and Unity Catalog governance with role-based access control. Achieved 96% Photon engine execution with zero disk spill. Includes AI/BI Dashboards, Genie Spaces, and a multi-task Workflow DAG.",
    stack: ["Azure Databricks", "Lakeflow DLT", "Unity Catalog", "Delta Lake", "Spark SQL", "PySpark", "Photon", "AI/BI Dashboards"],
    href: "/databricks",
    color: "border-orange-500/30 hover:border-orange-500",
    accentBg: "bg-orange-500/10",
    accentText: "text-orange-400",
    badge: "DATABRICKS",
  },
  {
    title: "JDE Data Platform",
    subtitle: "Open-source medallion architecture",
    description: "Full production data platform built on open-source tools. Data flows from a simulated JD Edwards ERP through Bronze/Silver/Gold layers into live dashboards, status boards, a customer self-service portal, and an e-commerce storefront. Node.js extractors pull from JDE SQL Server into PostgreSQL via Apache Airflow orchestration. dbt Core handles transformation with Kimball dimensional modeling.",
    stack: ["PostgreSQL", "dbt Core", "Apache Airflow", "Node.js", "Next.js", "Fastify", "Railway"],
    href: "/architecture",
    color: "border-blue-500/30 hover:border-blue-500",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    badge: "LIVE",
  },
  {
    title: "MDM Entity Resolution",
    subtitle: "Cross-ERP golden records with Splink",
    description: "Master Data Management layer that unifies customer records across five separate ERP systems, each with their own schemas, naming conventions, and duplicates. Uses Splink probabilistic record linkage to resolve entities like \"Boeing Co.\", \"THE BOEING COMPANY\", and \"Boeing Defence UK Ltd\" into golden records. Resolved 82 duplicates from 333 source records into 251 golden customer entities with consolidated sales visibility.",
    stack: ["Python", "Splink", "PostgreSQL", "DuckDB", "Databricks Serverless", "Jaro-Winkler", "Fellegi-Sunter"],
    href: "/mdm",
    color: "border-teal-500/30 hover:border-teal-500",
    accentBg: "bg-teal-500/10",
    accentText: "text-teal-400",
    badge: "MDM",
  },
  {
    title: "SEC Filing Analyzer",
    subtitle: "LLM-powered financial document analysis",
    description: "Automated pipeline that pulls SEC EDGAR filings, processes them through Claude API for intelligent summarization and structuring, and stores results in PostgreSQL. Orchestrated with n8n for scheduled pulls and event-driven processing. Designed for analysts who need rapid, structured insight from public company filings without manual review.",
    stack: ["n8n", "Claude API", "PostgreSQL", "SEC EDGAR", "LLM", "Python"],
    href: "https://github.com/johnpaul-castro/sec-filing-analyzer",
    color: "border-violet-500/30 hover:border-violet-500",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
    badge: "AI",
  },
  {
    title: "SCD2 Change Tracker",
    subtitle: "Intelligent change detection and alerting",
    description: "SCD Type 2 change detection system for JDE master data. PostgreSQL triggers capture every change to critical business entities, n8n orchestrates the alerting workflow, and Claude AI generates intelligent summaries of what changed and why it matters. Designed for data stewards who need to know when master data shifts without watching it manually.",
    stack: ["PostgreSQL", "n8n", "Claude AI", "PL/pgSQL", "SCD Type 2", "Webhooks"],
    href: "https://github.com/johnpaul-castro/scd2-change-tracker",
    color: "border-pink-500/30 hover:border-pink-500",
    accentBg: "bg-pink-500/10",
    accentText: "text-pink-400",
    badge: "AI",
  },
  {
    title: "SAP Medallion Engine",
    subtitle: "Code generator for Databricks/Kimball pipelines",
    description: "Python/Jinja2/YAML code generator that produces Databricks pipeline code from YAML configuration files. Encodes Kimball dimensional modeling standards, entity-first naming conventions, and current Databricks best practices including CLUSTER BY AUTO, Lakeflow Declarative Pipelines, and AUTO CDC. Built to accelerate pipeline development for ERP data migrations.",
    stack: ["Python", "Jinja2", "YAML", "Databricks", "Lakeflow DLT", "Kimball", "DAB"],
    href: "#",
    color: "border-emerald-500/30 hover:border-emerald-500",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    badge: "TOOL",
  },
];

export default function Projects() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-3xl font-bold text-white mb-3">Projects</h1>
          <p className="text-slate-400 max-w-3xl">
            Each project below is something I designed and built. They cover the full spectrum of modern data
            engineering: cloud lakehouses, open-source pipelines, entity resolution, AI-powered automation,
            and developer tooling. Most are live and running in production.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((p) => (
            <Link key={p.title} href={p.href}
              className={"block bg-slate-900 border rounded-2xl p-8 transition-all group " + p.color + " hover:bg-slate-800/70"}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{p.title}</h2>
                    <span className={"text-xs font-semibold px-2.5 py-0.5 rounded-full " + p.accentBg + " " + p.accentText}>
                      {p.badge}
                    </span>
                  </div>
                  <p className={"text-sm font-medium " + p.accentText}>{p.subtitle}</p>
                </div>
                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
