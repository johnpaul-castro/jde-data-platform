"use client"
import { useEffect, useState, useMemo } from "react"

const API = "https://jde-data-platform-production.up.railway.app"
//const API = "http://localhost:3001"

interface SalesRecord {
  order_id: string
  source_system: string
  source_customer_id: number
  order_date: string
  order_amount: string
  currency_code: string
  golden_customer_id: string
  source_customer_name: string
  golden_name: string
}

const sourceColors: Record<string, string> = {
  erp1: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  erp2: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  erp3: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  erp4: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  erp5: "bg-rose-500/20 text-rose-400 border-rose-500/30",
}

const sourceLabels: Record<string, string> = {
  erp1: "ERP 1",
  erp2: "ERP 2",
  erp3: "ERP 3",
  erp4: "ERP 4",
  erp5: "ERP 5",
}

function formatCurrency(val: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(val))
}

function formatDate(val: string) {
  if (!val) return "—"
  return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function MDMSales() {
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [customerFilter, setCustomerFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<"order_date" | "order_amount" | "golden_name">("order_date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetch(`${API}/api/mdm/sales-detail`)
      .then(r => r.json())
      .then(data => { setSales(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Unique golden customers for filter dropdown
  const goldenCustomers = useMemo(() => {
    const names = new Set<string>()
    sales.forEach(s => { if (s.golden_name) names.add(s.golden_name) })
    return Array.from(names).sort()
  }, [sales])

  // Unique sources
  const sources = useMemo(() => {
    const s = new Set<string>()
    sales.forEach(r => s.add(r.source_system))
    return Array.from(s).sort()
  }, [sales])

  // Filter and sort
  const filtered = useMemo(() => {
    let result = sales

    if (sourceFilter !== "all") {
      result = result.filter(s => s.source_system === sourceFilter)
    }

    if (customerFilter !== "all") {
      result = result.filter(s => s.golden_name === customerFilter)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.golden_name?.toLowerCase().includes(q) ||
        s.source_customer_name?.toLowerCase().includes(q) ||
        s.order_id?.toLowerCase().includes(q)
      )
    }

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === "order_date") {
        cmp = new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
      } else if (sortField === "order_amount") {
        cmp = Number(a.order_amount) - Number(b.order_amount)
      } else if (sortField === "golden_name") {
        cmp = (a.golden_name || "").localeCompare(b.golden_name || "")
      }
      return sortDir === "desc" ? -cmp : cmp
    })

    return result
  }, [sales, sourceFilter, customerFilter, search, sortField, sortDir])

  // Stats
  const totalRevenue = filtered.reduce((sum, s) => sum + Number(s.order_amount), 0)
  const totalOrders = filtered.length
  const uniqueCustomers = new Set(filtered.map(s => s.golden_customer_id)).size

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const sortIcon = (field: typeof sortField) => {
    if (sortField !== field) return "↕"
    return sortDir === "desc" ? "↓" : "↑"
  }

  if (loading) return <div className="text-slate-400 py-20 text-center">Loading sales data...</div>

  return (
    <div>
      {/* Demo banner */}
      <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-3 mb-0 text-sm text-amber-900 font-medium flex items-center gap-3 shadow-md">
        <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-1 rounded tracking-wider shrink-0">DEMO DATA</span>
        <span>Synthetic sales records generated for demonstration. Not real transaction data.</span>
      </div>

      {/* Header */}
      <div className="mb-8 mt-2">
        <h1 className="text-2xl font-bold text-white mb-1">Consolidated Sales</h1>
        <p className="text-slate-400 text-lg">
          All sales orders across 5 ERP systems, linked to unified golden customer records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-white">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Unique Customers</p>
          <p className="text-2xl font-bold text-blue-400">{uniqueCustomers}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalOrders ? totalRevenue / totalOrders : 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text" placeholder="Search orders, customers..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
          <option value="all">All Sources</option>
          {sources.map(s => <option key={s} value={s}>{sourceLabels[s] || s}</option>)}
        </select>
        <select value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 max-w-xs">
          <option value="all">All Customers</option>
          {goldenCustomers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(sourceFilter !== "all" || customerFilter !== "all" || search) && (
          <button onClick={() => { setSourceFilter("all"); setCustomerFilter("all"); setSearch("") }}
            className="px-3 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:border-slate-500 transition-colors">
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3 cursor-pointer hover:text-slate-300" onClick={() => handleSort("golden_name")}>
                  Golden Customer {sortIcon("golden_name")}
                </th>
                <th className="text-left px-4 py-3">Source Name</th>
                <th className="text-left px-4 py-3 cursor-pointer hover:text-slate-300" onClick={() => handleSort("order_date")}>
                  Order Date {sortIcon("order_date")}
                </th>
                <th className="text-right px-4 py-3 cursor-pointer hover:text-slate-300" onClick={() => handleSort("order_amount")}>
                  Amount {sortIcon("order_amount")}
                </th>
                <th className="text-left px-4 py-3">Currency</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={`${s.source_system}-${s.order_id}-${i}`}
                  className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-300 font-mono text-xs">{s.order_id}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${sourceColors[s.source_system]}`}>
                      {sourceLabels[s.source_system] || s.source_system}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{s.golden_name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{s.source_customer_name}</td>
                  <td className="px-4 py-3 text-slate-300">{formatDate(s.order_date)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-mono">{formatCurrency(s.order_amount)}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{s.currency_code || "USD"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-800 text-slate-500 text-xs">
          Showing {filtered.length} of {sales.length} orders
        </div>
      </div>
    </div>
  )
}
