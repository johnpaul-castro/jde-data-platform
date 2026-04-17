import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">JDE Data Platform</h1>
          <p className="text-slate-500 text-sm">RFQ Intelligence Portal</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/statusboard" className="text-slate-400 hover:text-blue-400">Statusboard</Link>
          <Link href="/dashboard" className="text-slate-400 hover:text-blue-400">Dashboard</Link>
          <Link href="/customers" className="text-slate-400 hover:text-blue-400">Customers</Link>
          <Link href="/rfq" className="text-slate-400 hover:text-blue-400">Submit RFQ</Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="mb-4">
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">
            ● Live JDE Data — Gold Layer
          </span>
        </div>
        <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
          Unified RFQ<br />Intelligence Platform
        </h2>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">
          Real-time visibility across all entities. Submit RFQs, detect conflicts,
          and route requests to the right team — powered by live JDE data through
          a Bronze / Silver / Gold medallion architecture.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/statusboard"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:bg-slate-800 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">📊</div>
              <h3 className="font-bold text-white text-lg">Statusboard</h3>
            </div>
            <p className="text-slate-400 text-sm">Live charts — revenue, AR aging, inventory, and purchasing activity across all entities.</p>
            <p className="text-blue-400 text-xs mt-3 group-hover:text-blue-300">Open Statusboard →</p>
          </Link>

          <Link href="/dashboard"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-green-500 hover:bg-slate-800 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm">💰</div>
              <h3 className="font-bold text-white text-lg">Sales Dashboard</h3>
            </div>
            <p className="text-slate-400 text-sm">Top customers by revenue with full detail — address, phone, order history, and RFQ action.</p>
            <p className="text-green-400 text-xs mt-3 group-hover:text-green-300">Open Dashboard →</p>
          </Link>

          <Link href="/customers"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500 hover:bg-slate-800 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-sm">🏢</div>
              <h3 className="font-bold text-white text-lg">Customer Master</h3>
            </div>
            <p className="text-slate-400 text-sm">Search and browse the unified customer master across all six ERP systems with full detail.</p>
            <p className="text-amber-400 text-xs mt-3 group-hover:text-amber-300">Open Customers →</p>
          </Link>

          <Link href="/rfq"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500 hover:bg-slate-800 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm">📋</div>
              <h3 className="font-bold text-white text-lg">Submit RFQ</h3>
            </div>
            <p className="text-slate-400 text-sm">Submit a new request for quotation. Select customer, part, quantity and route to the right entity.</p>
            <p className="text-purple-400 text-xs mt-3 group-hover:text-purple-300">Submit RFQ →</p>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-600 text-xs text-center">
            Powered by PostgreSQL · dbt Core · Apache Airflow · Node.js · Next.js — Medallion Architecture
          </p>
        </div>
      </div>
    </main>
  )
}