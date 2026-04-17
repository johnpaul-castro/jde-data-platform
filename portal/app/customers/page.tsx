'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Customer {
  address_id: number
  address_name: string
  address_type: string
  tax_id: string
}

interface CustomerDetail {
  address_id: number
  address_name: string
  address_type: string
  tax_id: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_code: string
  phone: string
  country: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch('/api/customers')
      .then(r => r.json())
      .then(data => { setCustomers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleRowClick = async (customer: Customer) => {
    if (selected?.address_id === customer.address_id) {
      setSelected(null); setDetail(null); return
    }
    setSelected(customer); setDetail(null); setDetailLoading(true)
    const res = await fetch(`/api/customers/${customer.address_id}`)
    const data = await res.json()
    setDetail(data); setDetailLoading(false)
  }

  const filtered = customers.filter(c =>
    c.address_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div>
          <Link href="/"><h1 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">JDE Data Platform</h1></Link>
          <p className="text-slate-500 text-sm">RFQ Intelligence Portal</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/statusboard" className="text-slate-400 hover:text-blue-400">Statusboard</Link>
          <Link href="/dashboard" className="text-slate-400 hover:text-blue-400">Dashboard</Link>
          <Link href="/customers" className="text-blue-400 font-semibold">Customers</Link>
          <Link href="/rfq" className="text-slate-400 hover:text-blue-400">Submit RFQ</Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Customer Master</h2>
            <p className="text-slate-500 text-sm mt-1">Unified across all ERP sources — click any row for details</p>
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-6">
          <div className={`${selected ? 'w-3/5' : 'w-full'} transition-all duration-300`}>
            {loading ? (
              <div className="text-slate-500 py-20 text-center">Loading customer master...</div>
            ) : (
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">ID</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Customer Name</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Type</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Tax ID</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr
                        key={c.address_id}
                        onClick={() => handleRowClick(c)}
                        className={`cursor-pointer border-b border-slate-800/50 transition-all ${
                          selected?.address_id === c.address_id
                            ? 'bg-blue-950 border-l-2 border-l-blue-500'
                            : 'hover:bg-slate-800/50'
                        }`}>
                        <td className="px-4 py-3 text-slate-500 text-xs">{c.address_id}</td>
                        <td className="px-4 py-3 font-medium text-slate-200">{c.address_name}</td>
                        <td className="px-4 py-3 text-slate-400">{c.address_type}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{c.tax_id || '—'}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/rfq?customer_id=${c.address_id}&customer_name=${encodeURIComponent(c.address_name)}`}
                            onClick={e => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                            Submit RFQ →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="w-2/5 bg-slate-900 rounded-xl border border-slate-800 p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Customer Detail</h3>
                <button onClick={() => { setSelected(null); setDetail(null) }}
                  className="text-slate-500 hover:text-white text-xl">×</button>
              </div>

              <div className="mb-4 pb-4 border-b border-slate-800">
                <p className="font-semibold text-white">{selected.address_name}</p>
                <p className="text-slate-500 text-sm">ID: {selected.address_id}</p>
              </div>

              {detailLoading ? (
                <p className="text-slate-500 text-sm">Loading...</p>
              ) : detail ? (
                <div className="space-y-4">
                  {detail.address_line_1 && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-slate-300 text-sm">{detail.address_line_1}</p>
                      {detail.address_line_2 && <p className="text-slate-300 text-sm">{detail.address_line_2}</p>}
                      <p className="text-slate-300 text-sm">{[detail.city, detail.state, detail.zip_code].filter(Boolean).join(', ')}</p>
                      {detail.country && <p className="text-slate-500 text-sm">{detail.country}</p>}
                    </div>
                  )}
                  {detail.phone && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-slate-300 text-sm">{detail.phone}</p>
                    </div>
                  )}
                  {detail.tax_id && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Tax ID</p>
                      <p className="text-slate-300 text-sm">{detail.tax_id}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-800">
                    <Link
                      href={`/rfq?customer_id=${selected.address_id}&customer_name=${encodeURIComponent(selected.address_name)}`}
                      className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                      Submit RFQ for this Customer
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}