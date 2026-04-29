"use client"

const sourceColors: Record<string, string> = {
  erp1: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  erp2: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  erp3: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  erp4: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  erp5: "border-rose-500/30 bg-rose-500/10 text-rose-400",
}

const layers = [
  {
    title: "Source Systems",
    color: "border-red-500/20",
    bg: "bg-slate-900",
    accent: "text-red-400",
    label: "SQL Server",
    items: [
      { name: "ERP 1 — UK Distributor", detail: "erp1.customer, erp1.sales", style: sourceColors.erp1 },
      { name: "ERP 2 — US East Coast", detail: "erp2.customer, erp2.sales", style: sourceColors.erp2 },
      { name: "ERP 3 — US West / Govt", detail: "erp3.customer, erp3.sales", style: sourceColors.erp3 },
      { name: "ERP 4 — Canada / Mixed", detail: "erp4.customer, erp4.sales", style: sourceColors.erp4 },
      { name: "ERP 5 — US Southeast MRO", detail: "erp5.customer, erp5.sales", style: sourceColors.erp5 },
    ],
    tech: "SQL Server 2022 Express · 5 schemas · Different column naming per ERP",
  },
  {
    title: "Extract",
    color: "border-orange-500/20",
    bg: "bg-slate-900",
    accent: "text-orange-400",
    label: "Node.js",
    items: [
      { name: "extract_erp.js", detail: "Pulls customer + sales from all 5 ERP schemas", style: "border-orange-500/30 bg-orange-500/10 text-orange-400" },
    ],
    tech: "Node.js · mssql + pg drivers · Full extract, drop & recreate",
  },
  {
    title: "Bronze Layer",
    color: "border-yellow-500/20",
    bg: "bg-slate-900",
    accent: "text-yellow-400",
    label: "PostgreSQL",
    items: [
      { name: "bronze_erp1", detail: "customer, sales — raw column names preserved", style: sourceColors.erp1 },
      { name: "bronze_erp2", detail: "customer, sales — CustNum, OrdId, etc.", style: sourceColors.erp2 },
      { name: "bronze_erp3", detail: "customer, sales — customer_number, order_id", style: sourceColors.erp3 },
      { name: "bronze_erp4", detail: "customer, sales — cust_key, so_num", style: sourceColors.erp4 },
      { name: "bronze_erp5", detail: "customer, sales — CUST_ID, ORD_NUM", style: sourceColors.erp5 },
    ],
    tech: "PostgreSQL · 5 schemas · 10 tables · Raw data, no transformations",
  },
  {
    title: "Silver Layer",
    color: "border-slate-500/20",
    bg: "bg-slate-900",
    accent: "text-slate-300",
    label: "dbt Core",
    items: [
      { name: "silver_erp.erp1_customer → erp5_customer", detail: "All normalized to: source_system, customer_name, city, state_province, postal_code, tax_id, email", style: "border-slate-500/30 bg-slate-800/50 text-slate-300" },
      { name: "silver_erp.erp1_sales → erp5_sales", detail: "All normalized to: source_system, order_id, source_customer_id, order_date, order_amount", style: "border-slate-500/30 bg-slate-800/50 text-slate-300" },
    ],
    tech: "dbt Core · 10 SQL models · Column name normalization · NULL handling for missing fields",
  },
  {
    title: "Splink Matching",
    color: "border-cyan-500/20",
    bg: "bg-slate-900",
    accent: "text-cyan-400",
    label: "Python + Splink",
    items: [
      { name: "Probabilistic Record Linkage", detail: "Jaro-Winkler on customer names · Exact match on tax_id · Levenshtein on postal_code · Blocking on name, tax_id, city+state", style: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400" },
      { name: "EM Training", detail: "Expectation-maximization estimates match/non-match probabilities from the data itself", style: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400" },
      { name: "Clustering", detail: "Pairwise predictions clustered at 70% match probability threshold", style: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400" },
    ],
    tech: "Python · Splink · DuckDB backend · Fellegi-Sunter model · 333 records → 251 golden",
  },
  {
    title: "MDM Layer",
    color: "border-emerald-500/20",
    bg: "bg-slate-900",
    accent: "text-emerald-400",
    label: "Golden Records",
    items: [
      { name: "mdm.customer_golden", detail: "251 unified customer records — one canonical name, address, tax ID per entity", style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
      { name: "mdm.customer_xref", detail: "333 rows mapping every source record to its golden customer ID", style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
      { name: "mdm.customer_clusters", detail: "Raw Splink cluster assignments with match metadata", style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
    ],
    tech: "PostgreSQL mdm schema · Best-record selection by name completeness · 82 duplicates resolved (24.6%)",
  },
]

const examples = [
  {
    golden: "THE BOEING COMPANY",
    matches: [
      { src: "erp2", name: "Boeing Co." },
      { src: "erp2", name: "BOEING CO." },
      { src: "erp3", name: "BOEING COMPANY" },
      { src: "erp4", name: "Boeing" },
      { src: "erp4", name: "BOEING COMPANY" },
      { src: "erp5", name: "THE BOEING COMPANY" },
      { src: "erp5", name: "Boeing Co" },
      { src: "erp3", name: "THE BOEING COMPANY" },
    ],
  },
  {
    golden: "RAYTHEON TECHNOLOGIES CORP",
    matches: [
      { src: "erp2", name: "RTX Corporation" },
      { src: "erp2", name: "RTX Corp" },
      { src: "erp3", name: "RAYTHEON TECHNOLOGIES CORP" },
      { src: "erp4", name: "Raytheon Technologies" },
      { src: "erp4", name: "Raytheon" },
      { src: "erp5", name: "Raytheon Tech" },
    ],
  },
  {
    golden: "Lockheed Martin Corporation",
    matches: [
      { src: "erp2", name: "Lockheed Martin Corporation" },
      { src: "erp3", name: "Lockheed Martin" },
      { src: "erp3", name: "LOCKHEED MARTIN CORP" },
      { src: "erp4", name: "Lockheed Martin" },
      { src: "erp5", name: "Lockheed Martin Corp" },
    ],
  },
]

export default function MDMArchitecture() {
  return (
    <div>
      {/* Demo banner */}
      <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-3 mb-0 text-sm text-amber-900 font-medium flex items-center gap-3 shadow-md">
        <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-1 rounded tracking-wider shrink-0">DEMO DATA</span>
        <span>Architecture overview of the MDM pipeline. All data is synthetic.</span>
      </div>

      {/* Header */}
      <div className="mb-8 mt-2">
        <h1 className="text-2xl font-bold text-white mb-1">MDM Pipeline Architecture</h1>
        <p className="text-slate-400 text-lg">
          How 5 separate ERP systems become one unified customer view
        </p>
      </div>

      {/* Pipeline flow */}
      <div className="space-y-1 mb-12">
        {layers.map((layer, i) => (
          <div key={layer.title}>
            <div className={`border rounded-xl p-5 ${layer.color} ${layer.bg}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-widest w-6 ${layer.accent}`}>{i + 1}</span>
                  <h2 className={`text-lg font-bold ${layer.accent}`}>{layer.title}</h2>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{layer.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                {layer.items.map((item, j) => (
                  <div key={j} className={`border rounded-lg p-3 ${item.style}`}>
                    <p className="font-medium text-sm mb-1">{item.name}</p>
                    <p className="text-xs opacity-70">{item.detail}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-2">{layer.tech}</p>
            </div>

            {i < layers.length - 1 && (
              <div className="flex justify-center py-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-600">
                  <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Match examples */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-2">Match Examples</h2>
        <p className="text-slate-400 text-sm mb-6">
          How Splink resolved different name variations into a single golden record
        </p>

        <div className="space-y-4">
          {examples.map((ex) => (
            <div key={ex.golden} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">→</span>
                  <span className="text-white font-semibold">{ex.golden}</span>
                  <span className="text-xs text-slate-500">Golden Record</span>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                  {ex.matches.length} records matched
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {ex.matches.map((m, i) => (
                    <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${sourceColors[m.src]}`}>
                      <span className="font-medium">{m.src}</span>
                      <span className="opacity-60 mx-1">·</span>
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "SQL Server 2022", role: "Source ERP databases", color: "text-red-400" },
            { name: "Node.js", role: "Data extraction layer", color: "text-orange-400" },
            { name: "PostgreSQL", role: "Data warehouse (Bronze → MDM)", color: "text-blue-400" },
            { name: "dbt Core", role: "Silver normalization models", color: "text-slate-300" },
            { name: "Python + Splink", role: "Probabilistic record linkage", color: "text-cyan-400" },
            { name: "DuckDB", role: "Splink compute backend", color: "text-yellow-400" },
            { name: "Fastify", role: "REST API serving MDM data", color: "text-emerald-400" },
            { name: "Next.js", role: "Dashboard & visualization", color: "text-white" },
          ].map((t) => (
            <div key={t.name} className="text-center">
              <p className={`font-semibold text-sm ${t.color}`}>{t.name}</p>
              <p className="text-slate-500 text-xs mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Pipeline Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Source ERPs", value: "5", sub: "SQL Server schemas" },
            { label: "Source Records", value: "333", sub: "Customer records extracted" },
            { label: "Golden Records", value: "251", sub: "Unique entities identified" },
            { label: "Dedup Rate", value: "24.6%", sub: "82 duplicates resolved" },
            { label: "dbt Models", value: "10", sub: "Silver normalization layer" },
            { label: "Blocking Rules", value: "4", sub: "name, tax_id, postal, city+state" },
            { label: "Match Threshold", value: "70%", sub: "Cluster probability cutoff" },
            { label: "Sales Orders", value: "922", sub: "Linked to golden customers" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-2xl font-bold text-white">{m.value}</p>
              <p className="text-slate-400 text-xs font-medium mt-1">{m.label}</p>
              <p className="text-slate-600 text-xs mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
