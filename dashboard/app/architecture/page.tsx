export default function Architecture() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Medallion Architecture</h2>
          <p className="text-slate-400">A layered data platform built on open-source tools. Data flows from ERP source systems through extraction, transformation, and aggregation into live applications.</p>
        </div>

        {/* ── Interactive flow diagram ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 overflow-x-auto">
          <svg viewBox="0 0 960 520" className="w-full min-w-[700px]" xmlns="http://www.w3.org/2000/svg">
            {/* Defs */}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="#475569" />
              </marker>
              <marker id="arrow-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="#60a5fa" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* ── Source ── */}
            <rect x="20" y="200" width="130" height="70" rx="12" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" opacity="0.8" />
            <text x="85" y="228" textAnchor="middle" className="fill-red-300 text-xs font-bold">JDE SQL Server</text>
            <text x="85" y="248" textAnchor="middle" className="fill-red-400/60 text-[10px]">F0101, F4201, F4211...</text>

            {/* Arrow: Source → Extractor */}
            <line x1="150" y1="235" x2="190" y2="235" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* ── Extractor ── */}
            <rect x="195" y="205" width="100" height="60" rx="10" fill="#14532d" stroke="#22c55e" strokeWidth="1" opacity="0.8" />
            <text x="245" y="232" textAnchor="middle" className="fill-green-300 text-xs font-bold">Node.js</text>
            <text x="245" y="248" textAnchor="middle" className="fill-green-400/60 text-[10px]">Extractors</text>

            {/* Arrow: Extractor → Bronze */}
            <line x1="295" y1="235" x2="335" y2="235" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* ── Bronze ── */}
            <rect x="340" y="190" width="120" height="90" rx="12" fill="#451a03" stroke="#f59e0b" strokeWidth="1" opacity="0.8" />
            <text x="400" y="218" textAnchor="middle" className="fill-amber-300 text-xs font-bold">Bronze</text>
            <text x="400" y="236" textAnchor="middle" className="fill-amber-400/60 text-[10px]">PostgreSQL</text>
            <text x="400" y="252" textAnchor="middle" className="fill-amber-400/40 text-[10px]">Raw 1:1 copy</text>
            <text x="400" y="268" textAnchor="middle" className="fill-amber-400/40 text-[10px]">10 JDE tables</text>

            {/* Arrow: Bronze → Silver */}
            <line x1="460" y1="235" x2="500" y2="235" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* ── Silver ── */}
            <rect x="505" y="190" width="120" height="90" rx="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" opacity="0.8" />
            <text x="565" y="218" textAnchor="middle" className="fill-slate-200 text-xs font-bold">Silver</text>
            <text x="565" y="236" textAnchor="middle" className="fill-slate-400/80 text-[10px]">dbt Core</text>
            <text x="565" y="252" textAnchor="middle" className="fill-slate-400/60 text-[10px]">Cleaned, typed</text>
            <text x="565" y="268" textAnchor="middle" className="fill-slate-400/60 text-[10px]">Business vocabulary</text>

            {/* Arrow: Silver → Gold */}
            <line x1="625" y1="235" x2="665" y2="235" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* ── Gold ── */}
            <rect x="670" y="190" width="120" height="90" rx="12" fill="#422006" stroke="#eab308" strokeWidth="1" opacity="0.8" />
            <text x="730" y="218" textAnchor="middle" className="fill-yellow-300 text-xs font-bold">Gold</text>
            <text x="730" y="236" textAnchor="middle" className="fill-yellow-400/80 text-[10px]">dbt Core</text>
            <text x="730" y="252" textAnchor="middle" className="fill-yellow-400/60 text-[10px]">Kimball star schema</text>
            <text x="730" y="268" textAnchor="middle" className="fill-yellow-400/60 text-[10px]">6 Gold models</text>

            {/* Arrow: Gold → API */}
            <line x1="790" y1="235" x2="830" y2="235" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* ── API ── */}
            <rect x="835" y="205" width="100" height="60" rx="10" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" opacity="0.8" />
            <text x="885" y="232" textAnchor="middle" className="fill-blue-300 text-xs font-bold">Fastify API</text>
            <text x="885" y="248" textAnchor="middle" className="fill-blue-400/60 text-[10px]">REST endpoints</text>

            {/* ── Downstream applications (branching from API) ── */}
            {/* Arrow: API → Dashboard */}
            <line x1="885" y1="205" x2="885" y2="100" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrow-blue)" />
            <rect x="825" y="40" width="120" height="50" rx="10" fill="#312e81" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
            <text x="885" y="62" textAnchor="middle" className="fill-indigo-300 text-[11px] font-bold">Dashboard</text>
            <text x="885" y="78" textAnchor="middle" className="fill-indigo-400/60 text-[10px]">Next.js</text>

            {/* Arrow: API → Status Boards */}
            <line x1="885" y1="265" x2="885" y2="350" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrow-blue)" />
            <rect x="825" y="355" width="120" height="50" rx="10" fill="#312e81" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
            <text x="885" y="377" textAnchor="middle" className="fill-indigo-300 text-[11px] font-bold">Status Boards</text>
            <text x="885" y="393" textAnchor="middle" className="fill-indigo-400/60 text-[10px]">Ship / Receive</text>

            {/* Arrow: API → Portal */}
            <line x1="835" y1="240" x2="780" y2="420" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />
            <rect x="700" y="425" width="110" height="50" rx="10" fill="#312e81" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
            <text x="755" y="447" textAnchor="middle" className="fill-indigo-300 text-[11px] font-bold">Customer Portal</text>
            <text x="755" y="463" textAnchor="middle" className="fill-indigo-400/60 text-[10px]">Self-service</text>

            {/* Arrow: API → Shop */}
            <line x1="885" y1="265" x2="885" y2="435" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />
            <rect x="830" y="440" width="110" height="50" rx="10" fill="#312e81" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
            <text x="885" y="462" textAnchor="middle" className="fill-indigo-300 text-[11px] font-bold">E-Commerce</text>
            <text x="885" y="478" textAnchor="middle" className="fill-indigo-400/60 text-[10px]">Stripe + Clerk</text>

            {/* ── Airflow orchestrator (below main flow) ── */}
            <rect x="300" y="330" width="360" height="45" rx="10" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="1" opacity="0.6" />
            <text x="480" y="352" textAnchor="middle" className="fill-sky-300 text-[11px] font-bold">Apache Airflow</text>
            <text x="480" y="366" textAnchor="middle" className="fill-sky-400/60 text-[10px]">Nightly orchestration (Mon-Sat 2AM) · Full refresh Sunday</text>
            {/* Dashed lines from Airflow to layers */}
            <line x1="400" y1="330" x2="400" y2="280" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
            <line x1="565" y1="330" x2="565" y2="280" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
            <line x1="620" y1="330" x2="730" y2="280" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

            {/* ── MDM branch (below source) ── */}
            <rect x="20" y="420" width="250" height="80" rx="12" fill="#134e4a" stroke="#14b8a6" strokeWidth="1" opacity="0.7" />
            <text x="145" y="445" textAnchor="middle" className="fill-teal-300 text-[11px] font-bold">MDM — Splink Record Linkage</text>
            <text x="145" y="462" textAnchor="middle" className="fill-teal-400/60 text-[10px]">5 ERPs → Bronze → Silver → Splink matching</text>
            <text x="145" y="478" textAnchor="middle" className="fill-teal-400/60 text-[10px]">→ 251 golden customer records</text>
            <text x="145" y="492" textAnchor="middle" className="fill-teal-400/40 text-[9px]">82 duplicates resolved from 333 sources</text>

            {/* Dashed line from Source down to MDM */}
            <line x1="85" y1="270" x2="85" y2="420" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

            {/* Label: "Open Source" */}
            <text x="480" y="16" textAnchor="middle" className="fill-slate-600 text-[10px] uppercase tracking-widest">Open-source · No vendor lock-in · All code on GitHub</text>
          </svg>
        </div>

        {/* ── Layer details ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-amber-950/40 border border-amber-800/50 rounded-2xl p-6">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-xl mb-4">🥉</div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Bronze Layer</h3>
            <p className="text-slate-400 text-sm mb-4">Raw data extracted directly from JDE SQL Server. No transformations — exact copy of source.</p>
            <div className="space-y-1.5">
              {["F0101 — Address Book","F0116 — Address by Date","F03B11 — AR Invoices","F4101 — Item Master","F4102 — Item Branch","F41021 — Item Location","F4201 — SO Header","F4211 — SO Detail","F4301 — PO Header","F4311 — PO Detail"].map(t => (
                <div key={t} className="text-xs text-amber-300/70 font-mono bg-amber-900/20 px-2 py-1 rounded">{t}</div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-600/50 rounded-2xl p-6">
            <div className="w-10 h-10 bg-slate-400 rounded-xl flex items-center justify-center text-xl mb-4">🥈</div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">Silver Layer</h3>
            <p className="text-slate-400 text-sm mb-4">Cleaned, typed, and deduplicated. JDE Julian dates converted, columns renamed to business vocabulary.</p>
            <div className="space-y-1.5">
              {["address_book","address_by_date","ar_invoices","item_master","item_branch","item_location","sales_order_header","sales_order_detail","purchase_order_header","purchase_order_detail"].map(t => (
                <div key={t} className="text-xs text-slate-300/70 font-mono bg-slate-700/30 px-2 py-1 rounded">{t}</div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-950/40 border border-yellow-700/50 rounded-2xl p-6">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-xl mb-4">🥇</div>
            <h3 className="text-lg font-bold text-yellow-400 mb-2">Gold Layer</h3>
            <p className="text-slate-400 text-sm mb-4">Business-ready aggregations for dashboards, reports, and the RFQ portal. Optimized for query performance.</p>
            <div className="space-y-1.5">
              {["sales_by_customer","ar_aging","inventory_status","purchasing_by_vendor","shipment_status","receiving_status"].map(t => (
                <div key={t} className="text-xs text-yellow-300/70 font-mono bg-yellow-900/20 px-2 py-1 rounded">{t}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3">Scheduling</h4>
            <p className="text-slate-400 text-sm">Apache Airflow orchestrates the full pipeline nightly (Mon–Sat at 2AM) and a full refresh every Sunday. Each layer only runs if the previous succeeds.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3">Design Principles</h4>
            <p className="text-slate-400 text-sm">Open-source only. No vendor lock-in. Entity-first naming conventions. Surrogate keys with _key suffix. Kimball dimensional modeling in Gold.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
