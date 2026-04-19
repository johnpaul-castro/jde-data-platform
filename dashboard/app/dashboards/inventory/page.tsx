"use client"
import { useEffect, useState } from "react"

const API = "https://jde-data-platform-production.up.railway.app"

interface InventoryRow {
  item_id: number
  item_number: string
  item_description: string
  unit_of_measure: string
  gl_class: string
  product_group: string
  business_unit: string
  quantity_on_hand: string
  quantity_on_order: string
  cost_average: string
  price_list: string
  inventory_value: string
}

export default function Inventory() {
  const [data, setData] = useState<InventoryRow[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/inventory`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2 })
  const totalValue = data.reduce((a, r) => a + Number(r.inventory_value), 0)
  const totalOnHand = data.reduce((a, r) => a + Number(r.quantity_on_hand), 0)
  const totalOnOrder = data.reduce((a, r) => a + Number(r.quantity_on_order), 0)

  const filtered = data.filter(r =>
    r.item_number?.toLowerCase().includes(search.toLowerCase()) ||
    r.item_description?.toLowerCase().includes(search.toLowerCase())
  )

  const stockColor = (qty: number) => {
    if (qty === 0) return "text-red-400"
    if (qty < 10) return "text-amber-400"
    return "text-emerald-400"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-400">Inventory Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Stock levels and inventory value from JDE Gold layer</p>
        </div>
        <input type="text" placeholder="Search items..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Total Inventory Value</p>
            <p className="text-3xl font-bold text-white">{fmt(totalValue)}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Units On Hand</p>
            <p className="text-3xl font-bold text-emerald-400">{totalOnHand.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Units On Order</p>
            <p className="text-3xl font-bold text-blue-400">{totalOnOrder.toLocaleString()}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 py-20 text-center">Loading inventory data...</div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          </div><div className="overflow-x-auto"><table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Item</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Group</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">BU</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">UOM</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">On Hand</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">On Order</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Avg Cost</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">List Price</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.item_id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-200 text-xs">{row.item_number}</div>
                    <div className="text-slate-500 text-xs truncate max-w-[180px]">{row.item_description}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{row.product_group}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{row.business_unit}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{row.unit_of_measure}</td>
                  <td className={"px-4 py-3 text-right font-semibold " + stockColor(Number(row.quantity_on_hand))}>
                    {Number(row.quantity_on_hand).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-400">{Number(row.quantity_on_order).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{fmt(Number(row.cost_average))}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{fmt(Number(row.price_list))}</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-400">{fmt(Number(row.inventory_value))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
