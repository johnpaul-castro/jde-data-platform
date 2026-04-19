export default function Resume() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">John Paul Castro</h1>
            <p className="text-blue-400 text-lg font-medium mb-3">Senior Data Architect</p>
            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
              <a href="mailto:johnpaulcastro@gmail.com" className="hover:text-blue-400 transition-colors">
                ✉ johnpaulcastro@gmail.com
              </a>
              <span>📍 Cleveland, Tennessee</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-green-900/30 border border-green-800 rounded-xl px-4 py-3 text-center">
              <p className="text-green-400 text-xs uppercase tracking-wide mb-1">Featured Project</p>
              <p className="text-white font-semibold text-sm">JDE Data Platform</p>
              <p className="text-slate-400 text-xs mt-1">Live — Railway Cloud</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Professional Summary</h2>
          <p className="text-slate-300 leading-relaxed">
            Senior Data Architect with deep expertise in medallion architecture platforms, 
            ERP data integration, and open-source data engineering. Proven track record of 
            designing and delivering Bronze → Silver → Gold data pipelines for aerospace 
            distribution and manufacturing environments. Passionate about replacing vendor 
            lock-in with elegant, maintainable open-source solutions.
          </p>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Core Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Data Architecture</p>
              <div className="flex flex-wrap gap-2">
                {["Medallion Architecture","dbt Core","PostgreSQL","Apache Airflow","ETL/ELT Design","Data Modeling","Kimball Methodology"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Engineering & ERP</p>
              <div className="flex flex-wrap gap-2">
                {["Node.js","React","Next.js","JD Edwards","Pentagon 2000","SQL Server","WSL2/Ubuntu","Docker"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-6">Experience</h2>
          <div className="space-y-8">

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Senior Data Architect</h3>
                  <p className="text-blue-400 text-sm">Independent / Consulting</p>
                </div>
                <span className="text-slate-500 text-sm">2024 — Present</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5 list-none">
                <li>→ Designed and built full medallion architecture platform for JDE Edwards data — Bronze extraction, Silver transformation, Gold aggregation</li>
                <li>→ Built Node.js extractors pulling from JDE SQL Server into PostgreSQL via Apache Airflow orchestration</li>
                <li>→ Implemented dbt Core models with proper naming standards, surrogate keys, and Kimball dimensional modeling</li>
                <li>→ Deployed full stack to Railway cloud: Fastify API + Next.js dashboard + PostgreSQL</li>
              </ul>
            </div>

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Data Architect</h3>
                  <p className="text-blue-400 text-sm">Wesco Aircraft / Incora</p>
                </div>
                <span className="text-slate-500 text-sm">Previous</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Led data architecture initiatives for large aerospace distributor</li>
                <li>→ Worked with Pentagon 2000 ERP and aerospace data standards (AS9100, DFARS, FAR)</li>
                <li>→ Designed data models for inventory, purchasing, and order management</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Featured Project */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Featured Project</h2>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white text-lg">JDE Data Platform</h3>
                <p className="text-slate-400 text-sm">Full-stack data platform for JD Edwards ERP</p>
              </div>
              <span className="bg-green-900/30 border border-green-800 text-green-400 text-xs px-3 py-1 rounded-full">Live</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              End-to-end medallion architecture platform extracting JDE data through Bronze → Silver → Gold layers, 
              with a React dashboard, RFQ portal, and real-time operational statusboards for shipments and receiving.
            </p>
            <div className="flex flex-wrap gap-2">
              {["PostgreSQL","dbt Core","Apache Airflow","Node.js","Next.js","Fastify","Railway"].map(t => (
                <span key={t} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm mb-2">Interested in working together?</p>
          <a href="mailto:johnpaulcastro@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Contact JP — johnpaulcastro@gmail.com
          </a>
        </div>

      </div>
    </main>
  );
}
