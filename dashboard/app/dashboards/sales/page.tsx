"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

const API = "http://localhost:3001"

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
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_code: string
  phone: string
  country: string
  tax_id: string
}

export default function SalesDashboard() {
  const [sales, setSales] = useState<SalesRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SalesRow | null>(null)
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/sales`)
      .then(r => r.json())
      .then(data => { setSales(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const maxRevenue = Math.max(...sales.map(r => Number(r.total_revenue)))
  const totalRevenue = sales.reduce((a, r) => a + Number(r.total_revenue), 0)
  const totalOrders = sales.reduce((a, r) => a + Number(r.total_orders), 0)

  const handleRowClick = async (row: SalesRow) => {
    if (selected?.customer_id === row.customer_id) { setSelected(null); setDetail(null); return }
    setSelected(row); setDetail(null); setDetailLoading(true)
    const res = await fetch(`${API}/api/customers/${row.customer_id}`)
    const data = await res.json()
    setDetail(data); setDetailLoading(false)
  }

  const fmt = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2 })
  const fmtK = (v: number) => "$" + (v / 1000).toFixed(1) + "K"

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Sales Dashboard</h2>
            <p className="text-slate-500 text-sm mt-1">Live data from JDE Gold layer — click any row for details</p>
          </div>
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">● Live</span>
        </div>

        {!loading && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-white">{fmtK(totalRevenue)}</p>
              <p className="text-slate-600 text-xs mt-1">Across {sales.length} customers</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-white">{totalOrders.toLocaleString()}</p>
              <p className="text-slate-600 text-xs mt-1">All time</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Top Customer</p>
              <p className="text-lg font-bold text-white truncate">{sales[0]?.customer_name || "—"}</p>
              <p className="text-green-400 text-sm mt-1">{sales[0] ? fmtK(Number(sales[0].total_revenue)) : "—"}</p>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <div className={selected ? "w-3/5" : "w-full"}>
            {loading ? (
              <div className="text-slate-500 py-20 text-center">Loading live JDE data...</div>
            ) : (
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Orders</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Qty</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Revenue</th>
                      <th className="px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider w-32">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((row, i) => {
                      const pct = (Number(row.total_revenue) / maxRevenue) * 100
                      const isSelected = selected?.customer_id === row.customer_id
                      return (
                        <tr key={row.customer_id} onClick={() => handleRowClick(row)}
                          className={"cursor-pointer border-b border-slate-800/50 transition-all " +
                            (isSelected ? "bg-blue-950 border-l-2 border-l-blue-500" : "hover:bg-slate-800/50")}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-slate-600 text-xs w-5">{i + 1}</span>
                              <span className={"font-medium " + (isSelected ? "text-blue-300" : "text-slate-200")}>
                                {row.customer_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400">{row.total_orders}</td>
                          <td className="px-4 py-3 text-right text-slate-400">{Number(row.total_quantity).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-400">{fmt(Number(row.total_revenue))}</td>
                          <td className="px-4 py-3">
                            <div className="w-full bg-slate-800 rounded-full h-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: pct + "%" }} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="w-2/5 bg-slate-900 rounded-xl border border-slate-800 p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Customer Detail</h3>
                <button onClick={() => { setSelected(null); setDetail(null) }} className="text-slate-500 hover:text-white text-xl">×</button>
              </div>
              <div className="mb-4 pb-4 border-b border-slate-800">
                <p className="font-semibold text-white">{selected.customer_name}</p>
                <p className="text-slate-500 text-sm">ID: {selected.customer_id}</p>
              </div>
              {detailLoading ? <p className="text-slate-500 text-sm">Loading...</p> : detail ? (
                <>
                  <div className="space-y-3 mb-6">
                    {detail.address_line_1 && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Address</p>
                        <p className="text-slate-300 text-sm">{detail.address_line_1}</p>
                        <p className="text-slate-300 text-sm">{[detail.city, detail.state, detail.zip_code].filter(Boolean).join(", ")}</p>
                      </div>
                    )}
                    {detail.phone && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-slate-300 text-sm">{detail.phone}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-800 pt-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-green-400 font-bold text-lg">{fmtK(Number(selected.total_revenue))}</p>
                        <p className="text-slate-500 text-xs">Revenue</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-blue-400 font-bold text-lg">{selected.total_orders}</p>
                        <p className="text-slate-500 text-xs">Orders</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-white font-bold text-lg">{Number(selected.total_quantity).toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">Units</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-amber-400 font-bold text-lg">${Number(selected.avg_unit_price).toFixed(2)}</p>
                        <p className="text-slate-500 text-xs">Avg Price</p>
                      </div>
                    </div>
                  </div>
                  <Link href={"/rfq?customer_id=" + selected.customer_id + "&customer_name=" + encodeURIComponent(selected.customer_name)}
                    className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                    Submit RFQ for this Customer
                  </Link>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
  )
}
