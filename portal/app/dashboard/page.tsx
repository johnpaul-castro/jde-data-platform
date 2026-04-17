'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface SalesRow {
  customer_id: number
  customer_name: string
  total_orders: string
  total_quantity: string
  total_revenue: string
  avg_unit_price: string
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

export default function Dashboard() {
  const [sales, setSales] = useState<SalesRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SalesRow | null>(null)
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(data => { setSales(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleRowClick = async (row: SalesRow) => {
    if (selected?.customer_id === row.customer_id) {
      setSelected(null)
      setDetail(null)
      return
    }
    setSelected(row)
    setDetail(null)
    setDetailLoading(true)
    const res = await fetch(`/api/customers/${row.customer_id}`)
    const data = await res.json()
    setDetail(data)
    setDetailLoading(false)
  }

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
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Sales Dashboard</h2>

        <div className="flex gap-6">
          <div className={`${selected ? 'w-3/5' : 'w-full'} transition-all duration-300`}>
            {loading ? (
              <div className="text-slate-500">Loading live JDE data...</div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="text-left px-4 py-3">Customer</th>
                      <th className="text-right px-4 py-3">Orders</th>
                      <th className="text-right px-4 py-3">Qty</th>
                      <th className="text-right px-4 py-3">Revenue</th>
                      <th className="text-right px-4 py-3">Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((row, i) => (
                      <tr
                        key={row.customer_id}
                        onClick={() => handleRowClick(row)}
                        className={`cursor-pointer transition-colors ${
                          selected?.customer_id === row.customer_id
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'
                        }`}>
                        <td className="px-4 py-3 font-medium text-slate-800">{row.customer_name}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{row.total_orders}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{Number(row.total_quantity).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-700">
                          ${Number(row.total_revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          ${Number(row.avg_unit_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="w-2/5 bg-white rounded-xl shadow p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Customer Detail</h3>
                <button onClick={() => { setSelected(null); setDetail(null) }}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
              </div>

              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800 text-base">{selected.customer_name}</p>
                <p className="text-slate-500 text-sm">Customer ID: {selected.customer_id}</p>
              </div>

              {detailLoading ? (
                <div className="text-slate-500 text-sm">Loading details...</div>
              ) : detail ? (
                <>
                  <div className="space-y-3 mb-6">
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
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Sales Summary</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-green-700 font-bold text-lg">
                          ${Number(selected.total_revenue).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </p>
                        <p className="text-green-600 text-xs">Total Revenue</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-blue-700 font-bold text-lg">{selected.total_orders}</p>
                        <p className="text-blue-600 text-xs">Total Orders</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-slate-700 font-bold text-lg">
                          {Number(selected.total_quantity).toLocaleString()}
                        </p>
                        <p className="text-slate-500 text-xs">Units Ordered</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <p className="text-amber-700 font-bold text-lg">
                          ${Number(selected.avg_unit_price).toFixed(2)}
                        </p>
                        <p className="text-amber-600 text-xs">Avg Unit Price</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link
                      href={`/rfq?customer_id=${selected.customer_id}&customer_name=${encodeURIComponent(selected.customer_name)}`}
                      className="w-full block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                      Submit RFQ for this Customer
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}