'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8', '#1e40af', '#bfdbfe', '#dbeafe', '#eff6ff', '#0f3460']

export default function Statusboard() {
  const [sales, setSales] = useState<any[]>([])
  const [arAging, setArAging] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [purchasing, setPurchasing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/sales').then(r => r.json()),
      fetch('/api/ar-aging').then(r => r.json()),
      fetch('/api/inventory').then(r => r.json()),
      fetch('/api/purchasing').then(r => r.json()),
    ]).then(([s, ar, inv, pur]) => {
      setSales(s.slice(0, 10).map((r: any) => ({
        name: r.customer_name.replace(/ \d+$/, '').substring(0, 20),
        revenue: Number(r.total_revenue),
        orders: Number(r.total_orders),
      })))
      setArAging(ar.slice(0, 8).map((r: any) => ({
        name: r.customer_name.replace(/ \d+$/, '').substring(0, 15),
        invoiced: Number(r.total_invoiced),
        open: Number(r.total_open),
        total: Number(r.total_open),
      })))
      setInventory(inv.slice(0, 10).map((r: any) => ({
        name: r.item_number?.substring(0, 15) || r.item_description?.substring(0, 15),
        on_hand: Number(r.quantity_on_hand),
        on_order: Number(r.quantity_on_order),
        value: Number(r.inventory_value),
      })))
      setPurchasing(pur.slice(0, 8).map((r: any) => ({
        name: r.vendor_name.replace(/ \d+$/, '').substring(0, 18),
        spend: Number(r.total_spend),
        orders: Number(r.total_orders),
      })))
      setLoading(false)
    })
  }, [])

  const formatCurrency = (value: number) =>
    '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const formatK = (value: number) =>
    value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading live JDE data...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div>
          <Link href="/">
            <h1 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">JDE Data Platform</h1>
          </Link>
          <p className="text-slate-500 text-sm">RFQ Intelligence Portal</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/statusboard" className="text-blue-400 font-semibold">Statusboard</Link>
          <Link href="/dashboard" className="text-slate-400 hover:text-blue-400">Dashboard</Link>
          <Link href="/customers" className="text-slate-400 hover:text-blue-400">Customers</Link>
          <Link href="/rfq" className="text-slate-400 hover:text-blue-400">Submit RFQ</Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Operations Statusboard</h2>
            <p className="text-slate-500 text-sm mt-1">Live data from JDE Gold layer</p>
          </div>
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">
            ● Live
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 border-t-4 border-t-blue-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(sales.reduce((a, r) => a + r.revenue, 0))}
            </p>
            <p className="text-xs text-slate-500 mt-1">Top 10 customers</p>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 border-t-4 border-t-green-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total AR Open</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(arAging.reduce((a, r) => a + r.total, 0))}
            </p>
            <p className="text-xs text-slate-500 mt-1">Across all customers</p>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 border-t-4 border-t-amber-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Inventory Units</p>
            <p className="text-2xl font-bold text-white">
              {inventory.reduce((a, r) => a + r.on_hand, 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">Units on hand</p>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 border-t-4 border-t-purple-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total Spend</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(purchasing.reduce((a, r) => a + r.spend, 0))}
            </p>
            <p className="text-xs text-slate-500 mt-1">Top 10 vendors</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">Top 10 Customers by Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sales} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tickFormatter={formatK} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#60a5fa' }}
                  formatter={(v: any) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">AR Aging — Invoiced vs Open</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={arAging} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tickFormatter={formatK} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(v: any) => formatCurrency(v)} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="invoiced" name="Total Invoiced" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="open" name="Open Balance" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">Inventory — On Hand vs On Order</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={inventory} layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="on_hand" name="On Hand" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="on_order" name="On Order" fill="#475569" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">Purchasing Spend by Vendor</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={purchasing}
                  dataKey="spend"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: '#475569' }}>
                  {purchasing.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(v: any) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  )
}