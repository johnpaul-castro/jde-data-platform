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
  credit_message: string
  sic_code: string
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
      setSelected(null)
      setDetail(null)
      return
    }
    setSelected(customer)
    setDetail(null)
    setDetailLoading(true)
    const res = await fetch(`/api/customers/${customer.address_id}`)
    const data = await res.json()
    setDetail(data)
    setDetailLoading(false)
  }

  const filtered = customers.filter(c =>
    c.address_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Customer Master</h2>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-6">
          {/* Customer Table */}
          <div className={`${selected ? 'w-3/5' : 'w-full'} transition-all duration-300`}>
            {loading ? (
              <div className="text-slate-500">Loading customer master...</div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="text-left px-4 py-3">ID</th>
                      <th className="text-left px-4 py-3">Customer Name</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Tax ID</th>
                      <th className="text-left px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr
                        key={c.address_id}
                        onClick={() => handleRowClick(c)}
                        className={`cursor-pointer transition-colors ${
                          selected?.address_id === c.address_id
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'
                        }`}>
                        <td className="px-4 py-3 text-slate-500">{c.address_id}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{c.address_name}</td>
                        <td className="px-4 py-3 text-slate-600">{c.address_type}</td>
                        <td className="px-4 py-3 text-slate-600">{c.tax_id || '—'}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/rfq?customer_id=${c.address_id}&customer_name=${encodeURIComponent(c.address_name)}`}
                            onClick={e => e.stopPropagation()}
                            className="text-blue-600 hover:underline text-xs font-medium">
                            Submit RFQ
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Customer Detail Panel */}
          {selected && (
            <div className="w-2/5 bg-white rounded-xl shadow p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Customer Detail</h3>
                <button onClick={() => { setSelected(null); setDetail(null) }}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
              </div>

              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800 text-base">{selected.address_name}</p>
                <p className="text-slate-500 text-sm">Customer ID: {selected.address_id}</p>
              </div>

              {detailLoading ? (
                <div className="text-slate-500 text-sm">Loading details...</div>
              ) : detail ? (
                <div className="space-y-3">
                  {detail.address_line_1 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Address</p>
                      <p className="text-slate-700 text-sm">{detail.address_line_1}</p>
                      {detail.address_line_2 && <p className="text-slate-700 text-sm">{detail.address_line_2}</p>}
                      <p className="text-slate-700 text-sm">
                        {[detail.city, detail.state, detail.zip_code].filter(Boolean).join(', ')}
                      </p>
                      {detail.country && <p className="text-slate-500 text-sm">{detail.country}</p>}
                    </div>
                  )}
                  {detail.phone && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Phone</p>
                      <p className="text-slate-700 text-sm">{detail.phone}</p>
                    </div>
                  )}
                  {detail.tax_id && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tax ID</p>
                      <p className="text-slate-700 text-sm">{detail.tax_id}</p>
                    </div>
                  )}
                  {detail.credit_message && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Credit Message</p>
                      <p className="text-slate-700 text-sm">{detail.credit_message}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={`/rfq?customer_id=${selected.address_id}&customer_name=${encodeURIComponent(selected.address_name)}`}
                      className="w-full block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
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