export default function OpenSourceStack() {
  const tools = [
    {
      name: "PostgreSQL",
      category: "Database",
      color: "border-blue-500/30 bg-blue-950/20",
      badge: "bg-blue-900/50 text-blue-300",
      desc: "The world\'s most advanced open source relational database. Powers all three layers of the medallion architecture — Bronze, Silver, and Gold.",
      role: "Primary data store for all extracted, transformed, and aggregated JDE data.",
      facts: ["ACID compliant", "Schemas for layer isolation", "Indexing for query performance", "Full SQL support"],
    },
    {
      name: "dbt Core",
      category: "Transformation",
      color: "border-orange-500/30 bg-orange-950/20",
      badge: "bg-orange-900/50 text-orange-300",
      desc: "Data build tool — transforms raw data in the warehouse using SQL and Jinja templating. The T in ELT.",
      role: "Builds all Silver and Gold models from Bronze raw data. Handles typing, deduplication, and business aggregations.",
      facts: ["SQL-based transformations", "Dependency management", "Incremental models", "Built-in testing"],
    },
    {
      name: "Apache Airflow",
      category: "Orchestration",
      color: "border-green-500/30 bg-green-950/20",
      badge: "bg-green-900/50 text-green-300",
      desc: "Platform to programmatically author, schedule, and monitor workflows. The brain of the pipeline.",
      role: "Orchestrates the full nightly pipeline — Bronze extraction → Silver dbt → Gold dbt — with dependency management and alerting.",
      facts: ["DAG-based workflows", "Scheduled execution", "Failure alerting", "Visual monitoring UI"],
    },
    {
      name: "Node.js",
      category: "Extraction",
      color: "border-lime-500/30 bg-lime-950/20",
      badge: "bg-lime-900/50 text-lime-300",
      desc: "JavaScript runtime for building fast, scalable server-side applications. Powers the Bronze extraction layer.",
      role: "Extracts all 10 JDE tables from SQL Server and loads them into PostgreSQL Bronze schema.",
      facts: ["Async extraction", "mssql + pg drivers", "Batch processing", "Progress tracking"],
    },
    {
      name: "Fastify",
      category: "API",
      color: "border-yellow-500/30 bg-yellow-950/20",
      badge: "bg-yellow-900/50 text-yellow-300",
      desc: "Fast and low overhead web framework for Node.js. Powers the REST API that connects the Gold layer to the dashboard.",
      role: "Serves all dashboard data — customers, sales, AR aging, inventory, purchasing, statusboards, and RFQ submission.",
      facts: ["REST API", "PostgreSQL connection pool", "CORS enabled", "Deployed on Railway"],
    },
    {
      name: "Next.js",
      category: "Frontend",
      color: "border-slate-400/30 bg-slate-800/20",
      badge: "bg-slate-700/50 text-slate-300",
      desc: "The React framework for production. Powers the full dashboard with server-side rendering and TypeScript support.",
      role: "Renders the entire dashboard — statusboards, dashboards, master data, RFQ portal, architecture page, and this page.",
      facts: ["React + TypeScript", "App Router", "Tailwind CSS", "Deployed on Railway"],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Open Source Stack</h1>
          <p className="text-slate-400">The technology powering this platform — 100% open source, zero vendor lock-in.</p>
        </div>

        {/* Pipeline flow */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Pipeline Flow</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "JDE SQL Server", color: "bg-red-900/50 text-red-300 border-red-800/50" },
              { label: "→", color: "bg-transparent text-slate-500 border-transparent" },
              { label: "Node.js Extractor", color: "bg-lime-900/50 text-lime-300 border-lime-800/50" },
              { label: "→", color: "bg-transparent text-slate-500 border-transparent" },
              { label: "Bronze (PostgreSQL)", color: "bg-amber-900/50 text-amber-300 border-amber-800/50" },
              { label: "→", color: "bg-transparent text-slate-500 border-transparent" },
              { label: "dbt Silver", color: "bg-slate-700/50 text-slate-300 border-slate-600/50" },
              { label: "→", color: "bg-transparent text-slate-500 border-transparent" },
              { label: "dbt Gold", color: "bg-yellow-900/50 text-yellow-300 border-yellow-800/50" },
              { label: "→", color: "bg-transparent text-slate-500 border-transparent" },
              { label: "Fastify API", color: "bg-blue-900/50 text-blue-300 border-blue-800/50" },
              { label: "→", color: "bg-transparent text-slate-500 border-transparent" },
              { label: "Next.js Dashboard", color: "bg-purple-900/50 text-purple-300 border-purple-800/50" },
            ].map((s, i) => (
              <span key={i} className={"px-3 py-1.5 rounded-lg text-sm font-medium border " + s.color}>{s.label}</span>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-4">Orchestrated nightly by Apache Airflow · Deployed on Railway Cloud</p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div key={tool.name} className={"border rounded-xl p-6 " + tool.color}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white text-lg">{tool.name}</h3>
                <span className={"text-xs px-2 py-1 rounded-full font-medium " + tool.badge}>{tool.category}</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">{tool.desc}</p>
              <p className="text-slate-300 text-xs mb-4 italic">"{tool.role}"</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.facts.map(f => (
                  <span key={f} className="bg-slate-800/50 text-slate-400 text-xs px-2 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">Built by <a href="mailto:johnpaulcastro@gmail.com" className="text-blue-400 hover:text-blue-300">JP Castro</a> · johnpaulcastro@gmail.com</p>
        </div>
      </div>
    </main>
  );
}
