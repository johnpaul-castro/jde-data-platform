"use client"
import { useEffect, useState } from "react"

const API = "http://localhost:3001"

interface PurchasingRow {
  vendor_id: number
  vendor_name: string
  total_orders: string
  total_received: string
  total_spend: string
  avg_unit_cost: string
  last_order_date: string
}

export default function Purchasing() {
  const [data, setData] = useState<PurchasingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/purchasing`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2 })
  const totalSpend = data.reduce((a, r) => a + Number(r.total_spend), 0)
  const totalOrders = data.reduce((a, r) => a + Number(r.total_orders), 0)
  const maxSpend = Math.max(...data.map(r => Number(r.total_spend)))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Purchasing Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">Vendor spend analysis from JDE Gold layer</p>
      </div>

      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Spend</p>
            <p className="text-3xl font-bold text-white">{fmt(totalSpend)}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-white">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Top Vendor</p>
            <p className="text-lg font-bold text-white truncate">{data[0]?.vendor_name || "—"}</p>
            <p className="text-purple-400 text-sm mt-1">{data[0] ? fmt(Number(data[0].total_spend)) : "—"}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-20 text-center">Loading purchasing data...</div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Vendor</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Orders</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Received</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Total Spend</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Avg Unit Cost</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Last Order</th>
                <th className="px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider w-32">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const pct = (Number(row.total_spend) / maxSpend) * 100
                return (
                  <tr key={row.vendor_id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 text-xs w-5">{i + 1}</span>
                        <span className="font-medium text-slate-200">{row.vendor_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">{row.total_orders}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{Number(row.total_received).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-purple-400">{fmt(Number(row.total_spend))}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{fmt(Number(row.avg_unit_cost))}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.last_order_date}</td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: pct + "%" }} />
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
  )
}
