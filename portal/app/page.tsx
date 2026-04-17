import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">JDE Data Platform</h1>
          <p className="text-slate-400 text-sm">RFQ Intelligence Portal</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/rfq" className="hover:text-blue-400">Submit RFQ</Link>
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/customers" className="hover:text-blue-400">Customers</Link>
        </nav>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          Unified RFQ Intelligence
        </h2>
        <p className="text-lg text-slate-600 mb-10">
          Real-time visibility across all entities. Submit RFQs, detect conflicts,
          and route requests to the right team — powered by live JDE data.
        </p>

        <div className="grid grid-cols-3 gap-6">
          <Link href="/rfq" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition border-t-4 border-blue-500">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Submit RFQ</h3>
            <p className="text-slate-500 text-sm">Submit a new request for quotation and get instant routing recommendations.</p>
          </Link>
          <Link href="/dashboard" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition border-t-4 border-green-500">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Sales Dashboard</h3>
            <p className="text-slate-500 text-sm">View top customers, revenue trends, and order activity across all entities.</p>
          </Link>
          <Link href="/customers" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition border-t-4 border-amber-500">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Customer Lookup</h3>
            <p className="text-slate-500 text-sm">Search and browse the unified customer master across all six ERP systems.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}