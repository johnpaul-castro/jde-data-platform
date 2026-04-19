"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const API = "https://jde-data-platform-production.up.railway.app"

interface Customer { address_id: number; address_name: string }
interface Item { item_id: number; item_name: string; description: string }

function RFQForm() {
  const params = useSearchParams()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customer_id: params.get("customer_id") || "",
    item_id: "",
    quantity: "",
    notes: ""
  })

  useEffect(() => {
    fetch(`${API}/api/customers`).then(r => r.json()).then(setCustomers)
    fetch(`${API}/api/items`).then(r => r.json()).then(setItems)
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    await fetch(`${API}/api/rfq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-slate-900 border border-green-800 rounded-xl p-10 text-center max-w-2xl">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">RFQ Submitted Successfully</h3>
        <p className="text-slate-400 mb-8">Your request has been received and routed to the appropriate team.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setSubmitted(false); setForm({ customer_id: "", item_id: "", quantity: "", notes: "" }) }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
            Submit Another RFQ
          </button>
          <Link href="/dashboards/sales"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-lg font-semibold transition-colors">
            View Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl w-full">
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Customer</label>
        <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a customer...</option>
          {customers.map(c => (
            <option key={c.address_id} value={c.address_id}>{c.address_name}</option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Part / Item</label>
        <select value={form.item_id} onChange={e => setForm({ ...form, item_id: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a part...</option>
          {items.map(i => (
            <option key={i.item_id} value={i.item_id}>{i.item_name} — {i.description}</option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
        <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
          placeholder="Enter quantity..."
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="mb-8">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Any additional requirements or notes..." rows={3}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button onClick={handleSubmit}
        disabled={submitting || !form.customer_id || !form.item_id || !form.quantity}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        {submitting ? "Submitting..." : "Submit RFQ"}
      </button>
    </div>
  )
}

export default function RFQPage() {
  return (
    <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-400">Submit RFQ</h2>
          <p className="text-slate-500 text-sm mt-1">Select a customer and part to route your request for quotation</p>
        </div>
        <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
          <RFQForm />
        </Suspense>
      </div>
  )
}
