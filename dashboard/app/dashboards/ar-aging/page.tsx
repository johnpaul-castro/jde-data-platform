"use client"
import { useEffect, useState } from "react"

const API = "https://jde-data-platform-production.up.railway.app"

interface ARRow {
  customer_id: number
  customer_name: string
  invoice_count: string
  total_invoiced: string
  total_open: string
  total_discount: string
  amount_current: string
  amount_past_due: string
  currency_code: string
}

export default function ARaging() {
  const [data, setData] = useState<ARRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/ar-aging`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2 })
  const totalOpen = data.reduce((a, r) => a + Number(r.total_open), 0)
  const totalInvoiced = data.reduce((a, r) => a + Number(r.total_invoiced), 0)
  const totalPastDue = data.reduce((a, r) => a + Number(r.amount_past_due), 0)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400">AR Aging</h2>
        <p className="text-slate-400 text-sm mt-1">Accounts receivable — invoiced vs open balances</p>
      </div>

      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Invoiced</p>
            <p className="text-3xl font-bold text-white">{fmt(totalInvoiced)}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Open</p>
            <p className="text-3xl font-bold text-amber-400">{fmt(totalOpen)}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Past Due</p>
            <p className="text-3xl font-bold text-red-400">{fmt(totalPastDue)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-20 text-center">Loading AR data...</div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Customer</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Invoices</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Total Invoiced</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Open Balance</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Discount</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Past Due</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Currency</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.customer_id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">{row.customer_name}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{row.invoice_count}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{fmt(Number(row.total_invoiced))}</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-400">{fmt(Number(row.total_open))}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{fmt(Number(row.total_discount))}</td>
                  <td className={"px-4 py-3 text-right font-semibold " + (Number(row.amount_past_due) > 0 ? "text-red-400" : "text-emerald-400")}>
                    {fmt(Number(row.amount_past_due))}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{row.currency_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
