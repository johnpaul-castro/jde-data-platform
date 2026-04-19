"use client"
import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

const API = "http://localhost:3001"
const COLORS = ["#3b82f6","#60a5fa","#93c5fd","#2563eb","#1d4ed8","#1e40af","#bfdbfe","#dbeafe","#eff6ff","#0f3460"]

export default function Statusboard() {
  const [sales, setSales] = useState<any[]>([])
  const [arAging, setArAging] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [purchasing, setPurchasing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/sales`).then(r => r.json()),
      fetch(`${API}/api/ar-aging`).then(r => r.json()),
      fetch(`${API}/api/inventory`).then(r => r.json()),
      fetch(`${API}/api/purchasing`).then(r => r.json()),
    ]).then(([s, ar, inv, pur]) => {
      setSales(s.slice(0,10).map((r: any) => ({
        name: r.customer_name.substring(0,20),
        revenue: Number(r.total_revenue),
        orders: Number(r.total_orders),
      })))
      setArAging(ar.slice(0,8).map((r: any) => ({
        name: r.customer_name.substring(0,15),
        invoiced: Number(r.total_invoiced),
        open: Number(r.total_open),
      })))
      setInventory(inv.slice(0,10).map((r: any) => ({
        name: (r.item_number || r.item_description || "").substring(0,15),
        on_hand: Number(r.quantity_on_hand),
        on_order: Number(r.quantity_on_order),
      })))
      setPurchasing(pur.slice(0,8).map((r: any) => ({
        name: r.vendor_name.substring(0,18),
        spend: Number(r.total_spend),
        orders: Number(r.total_orders),
      })))
      setLoading(false)
    })
  }, [])

  const fmtK = (v: number) => v >= 1000 ? "$" + (v/1000).toFixed(0) + "K" : "$" + v
  const fmtFull = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 0 })

  if (loading) return <main className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-slate-500 text-lg">Loading live JDE data...</p></main>

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Operations Statusboard</h2>
            <p className="text-slate-500 text-sm mt-1">Live data from JDE Gold layer</p>
          </div>
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">● Live</span>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: fmtFull(sales.reduce((a,r)=>a+r.revenue,0)), sub: "Top 10 customers", color: "border-t-blue-500" },
            { label: "Total AR Open", value: fmtFull(arAging.reduce((a,r)=>a+r.open,0)), sub: "Across all customers", color: "border-t-green-500" },
            { label: "Inventory Units", value: inventory.reduce((a,r)=>a+r.on_hand,0).toLocaleString(), sub: "Units on hand", color: "border-t-amber-500" },
            { label: "Total Spend", value: fmtFull(purchasing.reduce((a,r)=>a+r.spend,0)), sub: "Top 10 vendors", color: "border-t-purple-500" },
          ].map(k => (
            <div key={k.label} className={"bg-slate-900 rounded-xl border border-slate-800 border-t-4 p-5 " + k.color}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{k.label}</p>
              <p className="text-2xl font-bold text-white">{k.value}</p>
              <p className="text-xs text-slate-500 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">Top 10 Customers by Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sales} margin={{ top:5, right:10, left:10, bottom:60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize:10, fill:"#94a3b8" }} />
                <YAxis tickFormatter={fmtK} tick={{ fontSize:10, fill:"#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor:"#0f172a", border:"1px solid #1e293b", borderRadius:"8px" }}
                  labelStyle={{ color:"#e2e8f0" }} itemStyle={{ color:"#60a5fa" }} formatter={(v:any) => fmtFull(v)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">AR Aging — Invoiced vs Open</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={arAging} margin={{ top:5, right:10, left:10, bottom:60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize:10, fill:"#94a3b8" }} />
                <YAxis tickFormatter={fmtK} tick={{ fontSize:10, fill:"#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor:"#0f172a", border:"1px solid #1e293b", borderRadius:"8px" }}
                  formatter={(v:any) => fmtFull(v)} />
                <Legend wrapperStyle={{ color:"#94a3b8" }} />
                <Bar dataKey="invoiced" name="Total Invoiced" fill="#3b82f6" radius={[4,4,0,0]} />
                <Bar dataKey="open" name="Open Balance" fill="#f59e0b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">Inventory — On Hand vs On Order</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={inventory} layout="vertical" margin={{ top:5, right:30, left:60, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize:10, fill:"#94a3b8" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize:10, fill:"#94a3b8" }} width={60} />
                <Tooltip contentStyle={{ backgroundColor:"#0f172a", border:"1px solid #1e293b", borderRadius:"8px" }} />
                <Legend wrapperStyle={{ color:"#94a3b8" }} />
                <Bar dataKey="on_hand" name="On Hand" fill="#f59e0b" radius={[0,4,4,0]} />
                <Bar dataKey="on_order" name="On Order" fill="#475569" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="font-bold text-white mb-4">Purchasing Spend by Vendor</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={purchasing} dataKey="spend" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                  label={({ name, percent }) => name + " " + (percent*100).toFixed(0) + "%"}
                  labelLine={{ stroke:"#475569" }}>
                  {purchasing.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor:"#0f172a", border:"1px solid #1e293b", borderRadius:"8px" }}
                  formatter={(v:any) => fmtFull(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  )
}
