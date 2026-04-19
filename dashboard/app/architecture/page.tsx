export default function Architecture() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Medallion Architecture</h2>
          <p className="text-slate-400">A layered data platform built on open-source tools — no vendor lock-in.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-6">Pipeline Orchestration</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: "JDE SQL Server", color: "bg-red-900 text-red-300 border-red-700" },
              { label: "→", color: "text-slate-500 bg-transparent border-transparent" },
              { label: "Node.js Extractor", color: "bg-green-900 text-green-300 border-green-700" },
              { label: "→", color: "text-slate-500 bg-transparent border-transparent" },
              { label: "Bronze (PostgreSQL)", color: "bg-amber-900 text-amber-300 border-amber-700" },
              { label: "→", color: "text-slate-500 bg-transparent border-transparent" },
              { label: "dbt Core (Silver)", color: "bg-slate-700 text-slate-200 border-slate-600" },
              { label: "→", color: "text-slate-500 bg-transparent border-transparent" },
              { label: "dbt Core (Gold)", color: "bg-yellow-900 text-yellow-300 border-yellow-700" },
              { label: "→", color: "text-slate-500 bg-transparent border-transparent" },
              { label: "Fastify API", color: "bg-blue-900 text-blue-300 border-blue-700" },
              { label: "→", color: "text-slate-500 bg-transparent border-transparent" },
              { label: "Next.js Dashboard", color: "bg-purple-900 text-purple-300 border-purple-700" },
            ].map((step, i) => (
              <span key={i} className={"px-3 py-1.5 rounded-lg text-sm font-medium border " + step.color}>
                {step.label}
              </span>
            ))}
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
