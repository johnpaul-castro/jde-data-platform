"use client"
import { useEffect, useState } from "react"

const API = "https://jde-data-platform-production.up.railway.app"
//const API = "http://localhost:3001"

interface GoldenCustomer {
  golden_customer_id: string
  golden_name: string
  golden_city: string
  golden_state: string
  golden_postal_code: string
  golden_tax_id: string
  golden_email: string
  primary_source: string
  primary_source_id: number
}

interface XrefRecord {
  cluster_id: string
  source_system: string
  source_customer_id: number
  customer_name: string
  name_clean: string
  city: string
  state_province: string
  postal_code: string
  tax_id: string
  email: string
}

interface Stats {
  total_source_records: number
  golden_records: number
  duplicates_resolved: number
  by_source: { source_system: string; count: string }[]
  top_duplicate_clusters: { cluster_id: string; match_count: string }[]
}

interface GoldenSales {
  cluster_id: string
  total_orders: string
  total_revenue: string
  erp_count: string
  first_order: string
  last_order: string
}

const sourceColors: Record<string, string> = {
  erp1: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  erp2: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  erp3: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  erp4: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  erp5: "bg-rose-500/20 text-rose-400 border-rose-500/30",
}

const sourceLabels: Record<string, string> = {
  erp1: "ERP 1 — UK Distributor",
  erp2: "ERP 2 — US East Coast",
  erp3: "ERP 3 — US West / Govt",
  erp4: "ERP 4 — Canada / Mixed",
  erp5: "ERP 5 — US Southeast MRO",
}

function formatCurrency(val: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(val))
}

function formatDate(val: string) {
  if (!val) return "—"
  return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function MDMDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [goldenCustomers, setGoldenCustomers] = useState<GoldenCustomer[]>([])
  const [xref, setXref] = useState<XrefRecord[]>([])
  const [sales, setSales] = useState<GoldenSales[]>([])
  const [search, setSearch] = useState("")
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [view, setView] = useState<"overview" | "golden" | "duplicates">("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/mdm/stats`).then(r => r.json()),
      fetch(`${API}/api/mdm/golden-customers`).then(r => r.json()),
      fetch(`${API}/api/mdm/customer-xref`).then(r => r.json()),
      fetch(`${API}/api/mdm/golden-sales`).then(r => r.json()).catch(() => []),
    ]).then(([s, g, x, sl]) => {
      setStats(s)
      setGoldenCustomers(g)
      setXref(x)
      setSales(sl)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-slate-400 py-20 text-center">Loading MDM data...</div>
  if (!stats) return <div className="text-red-400 py-20 text-center">Failed to load MDM data</div>

  // Build maps
  const clusterMap = new Map<string, XrefRecord[]>()
  xref.forEach(r => {
    if (!clusterMap.has(r.cluster_id)) clusterMap.set(r.cluster_id, [])
    clusterMap.get(r.cluster_id)!.push(r)
  })

  const salesMap = new Map<string, GoldenSales>()
  ;(Array.isArray(sales) ? sales : []).forEach(s => salesMap.set(s.cluster_id, s))

  const duplicateGroups = Array.from(clusterMap.entries())
    .filter(([, records]) => records.length > 1)
    .sort((a, b) => b[1].length - a[1].length)

  const filteredGolden = goldenCustomers.filter(c =>
    c.golden_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.golden_city?.toLowerCase().includes(search.toLowerCase()) ||
    c.golden_tax_id?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDuplicates = duplicateGroups.filter(([, records]) =>
    records.some(r =>
      r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.name_clean?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const selectedSources = selectedCluster ? clusterMap.get(selectedCluster) || [] : []
  const selectedSales = selectedCluster ? salesMap.get(selectedCluster) : null

  // Totals for overview
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_revenue), 0)
  const totalOrders = sales.reduce((sum, s) => sum + Number(s.total_orders), 0)

  return (
    <div>
      {/* Demo data disclaimer */}
      <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-3 mb-0 text-sm text-amber-900 font-medium flex items-center gap-3 shadow-md">
        <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-1 rounded tracking-wider shrink-0">DEMO DATA</span>
        <span>Synthetic customer records generated for demonstration. Not real customer data.</span>
      </div>

      {/* Header */}
      <div className="mb-8 mt-2">
        <h1 className="text-2xl font-bold text-white mb-1">Master Data Management</h1>
        <p className="text-slate-400 text-lg">
          Probabilistic entity resolution across 5 ERP systems using Splink
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Source Records</p>
          <p className="text-2xl font-bold text-white">{stats.total_source_records}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Golden Records</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.golden_records}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Duplicates Resolved</p>
          <p className="text-2xl font-bold text-amber-400">{stats.duplicates_resolved}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Dedup Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {((stats.duplicates_resolved / stats.total_source_records) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Sales stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Consolidated Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</p>
          <p className="text-slate-600 text-xs mt-1">Across all ERP systems</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-white">{totalOrders.toLocaleString()}</p>
          <p className="text-slate-600 text-xs mt-1">Unified order count</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avg Revenue / Customer</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalRevenue / (stats.golden_records || 1))}</p>
          <p className="text-slate-600 text-xs mt-1">Per golden record</p>
        </div>
      </div>

      {/* Source breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-8">
        <p className="text-slate-400 text-sm font-medium mb-3">Records by Source System</p>
        <div className="flex flex-wrap gap-3">
          {stats.by_source.map(s => (
            <div key={s.source_system}
              className={`px-3 py-2 rounded-lg border text-sm ${sourceColors[s.source_system] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
              <span className="font-medium">{sourceLabels[s.source_system] || s.source_system}</span>
              <span className="ml-2 opacity-75">{s.count} records</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 border-b border-slate-800">
        {[
          { key: "overview", label: "Overview" },
          { key: "golden", label: "Golden Records" },
          { key: "duplicates", label: "Resolved Duplicates" },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => { setView(tab.key as typeof view); setSelectedCluster(null) }}
            className={`px-4 py-2.5 text-lg font-medium border-b-2 transition-colors -mb-px ${
              view === tab.key
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      {view !== "overview" && (
        <input
          type="text" placeholder="Search customers..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 mb-4 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      )}

      {/* Overview tab */}
      {view === "overview" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: "1", title: "Extract", desc: "Node.js pulls customer & sales data from 5 separate ERP databases (SQL Server)" },
                { step: "2", title: "Bronze", desc: "Raw data lands in PostgreSQL — one schema per ERP, preserving original column names" },
                { step: "3", title: "Silver", desc: "dbt normalizes all 5 schemas to a common structure (customer_name, city, tax_id, etc.)" },
                { step: "4", title: "Splink Match", desc: "Probabilistic record linkage using Jaro-Winkler on names + exact match on tax_id, city" },
                { step: "5", title: "Golden Record", desc: "Each cluster gets one canonical record — the most complete version wins" },
              ].map(s => (
                <div key={s.step} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center mx-auto mb-2">
                    {s.step}
                  </div>
                  <p className="text-white text-sm font-medium mb-1">{s.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Matched Clusters</h2>
            <p className="text-slate-500 text-sm mb-4">
              These clusters had the most duplicate records resolved across ERP systems
            </p>
            <div className="space-y-3">
              {duplicateGroups.slice(0, 10).map(([clusterId, records]) => {
                const goldenRecord = goldenCustomers.find(g => g.golden_customer_id === clusterId)
                const clusterSales = salesMap.get(clusterId)
                return (
                  <div key={clusterId}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 cursor-pointer hover:border-blue-500/30 transition-colors"
                    onClick={() => { setView("duplicates"); setSelectedCluster(clusterId) }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{goldenRecord?.golden_name || clusterId}</p>
                        {clusterSales && (
                          <p className="text-slate-500 text-xs mt-0.5">
                            {clusterSales.total_orders} orders · {formatCurrency(clusterSales.total_revenue)} total · {clusterSales.erp_count} ERPs
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                        {records.length} records matched
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {records.map((r, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded border ${sourceColors[r.source_system]}`}>
                          {r.source_system}: {r.customer_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Golden Records tab */}
      {view === "golden" && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Golden Name</th>
                  <th className="text-left px-4 py-3">City</th>
                  <th className="text-left px-4 py-3">State</th>
                  <th className="text-right px-4 py-3">Orders</th>
                  <th className="text-right px-4 py-3">Revenue</th>
                  <th className="text-center px-4 py-3">ERPs</th>
                  <th className="text-center px-4 py-3">Sources</th>
                </tr>
              </thead>
              <tbody>
                {filteredGolden.map(c => {
                  const sources = clusterMap.get(c.golden_customer_id) || []
                  const isMulti = sources.length > 1
                  const cSales = salesMap.get(c.golden_customer_id)
                  return (
                    <tr key={c.golden_customer_id}
                      className={`border-b border-slate-800/50 transition-colors cursor-pointer ${
                        selectedCluster === c.golden_customer_id ? "bg-slate-800" : "hover:bg-slate-800/50"
                      }`}
                      onClick={() => setSelectedCluster(
                        selectedCluster === c.golden_customer_id ? null : c.golden_customer_id
                      )}>
                      <td className="px-4 py-3 text-white font-medium">{c.golden_name}</td>
                      <td className="px-4 py-3 text-slate-400">{c.golden_city}</td>
                      <td className="px-4 py-3 text-slate-400">{c.golden_state}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{cSales ? cSales.total_orders : "—"}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-mono text-xs">
                        {cSales ? formatCurrency(cSales.total_revenue) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {cSales ? (
                          <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                            {cSales.erp_count}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isMulti ? (
                          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                            {sources.length} matched
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">unique</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resolved Duplicates tab */}
      {view === "duplicates" && (
        <div className="space-y-4">
          {(selectedCluster ? [[selectedCluster, clusterMap.get(selectedCluster) || []]] as [string, XrefRecord[]][] : filteredDuplicates).map(([clusterId, records]) => {
            const goldenRecord = goldenCustomers.find(g => g.golden_customer_id === clusterId)
            const clusterSales = salesMap.get(clusterId)
            return (
              <div key={clusterId} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">{goldenRecord?.golden_name || clusterId}</span>
                    <span className="text-slate-500 text-xs ml-3">Golden Record</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {clusterSales && (
                      <span className="text-xs text-slate-400">
                        {clusterSales.total_orders} orders · {formatCurrency(clusterSales.total_revenue)}
                      </span>
                    )}
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {records.length} source records → 1 golden
                    </span>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800/50">
                      <th className="text-left px-4 py-2">Source</th>
                      <th className="text-left px-4 py-2">Original Name</th>
                      <th className="text-left px-4 py-2">Normalized</th>
                      <th className="text-left px-4 py-2">City</th>
                      <th className="text-left px-4 py-2">State</th>
                      <th className="text-left px-4 py-2">Tax ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} className="border-b border-slate-800/30">
                        <td className="px-4 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded border ${sourceColors[r.source_system]}`}>
                            {r.source_system}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-white">{r.customer_name}</td>
                        <td className="px-4 py-2 text-slate-400 font-mono text-xs">{r.name_clean}</td>
                        <td className="px-4 py-2 text-slate-400">{r.city}</td>
                        <td className="px-4 py-2 text-slate-400">{r.state_province}</td>
                        <td className="px-4 py-2 text-slate-400 font-mono text-xs">{r.tax_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      )}

      {/* Source detail drawer when clicking a golden record */}
      {selectedCluster && view === "golden" && selectedSources.length > 0 && (
        <div className="mt-4 bg-slate-900 border border-blue-500/30 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">
                Source Records for: {goldenCustomers.find(g => g.golden_customer_id === selectedCluster)?.golden_name}
              </p>
              {selectedSales && (
                <p className="text-slate-500 text-xs mt-1">
                  {selectedSales.total_orders} orders · {formatCurrency(selectedSales.total_revenue)} total revenue · {formatDate(selectedSales.first_order)} to {formatDate(selectedSales.last_order)}
                </p>
              )}
            </div>
            <button onClick={() => setSelectedCluster(null)} className="text-slate-500 hover:text-white text-xs">
              Close
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800/50">
                <th className="text-left px-4 py-2">Source</th>
                <th className="text-left px-4 py-2">Original Name</th>
                <th className="text-left px-4 py-2">City</th>
                <th className="text-left px-4 py-2">Tax ID</th>
                <th className="text-left px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {selectedSources.map((r, i) => (
                <tr key={i} className="border-b border-slate-800/30">
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${sourceColors[r.source_system]}`}>
                      {r.source_system}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-white">{r.customer_name}</td>
                  <td className="px-4 py-2 text-slate-400">{r.city}</td>
                  <td className="px-4 py-2 text-slate-400 font-mono text-xs">{r.tax_id}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{r.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
