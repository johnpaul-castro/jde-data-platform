'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Customer { address_id: number; address_name: string }
interface Item { item_id: number; item_name: string; description: string }

function RFQForm() {
  const params = useSearchParams()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customer_id: params.get('customer_id') || '',
    item_id: '',
    quantity: '',
    notes: ''
  })

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers)
    fetch('/api/items').then(r => r.json()).then(setItems)
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    await fetch('/api/rfq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">RFQ Submitted Successfully</h3>
        <p className="text-green-600 mb-6">Your request has been received and routed to the appropriate team.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => { setSubmitted(false); setForm({ customer_id: '', item_id: '', quantity: '', notes: '' }) }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Submit Another RFQ
          </button>
          <Link href="/dashboard" className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300">
            View Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-8 max-w-2xl">
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Customer</label>
        <select
          value={form.customer_id}
          onChange={e => setForm({ ...form, customer_id: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a customer...</option>
          {customers.map(c => (
            <option key={c.address_id} value={c.address_id}>{c.address_name}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Part / Item</label>
        <select
          value={form.item_id}
          onChange={e => setForm({ ...form, item_id: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a part...</option>
          {items.map(i => (
            <option key={i.item_id} value={i.item_id}>{i.item_name} — {i.description}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
        <input
          type="number"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
          placeholder="Enter quantity..."
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Any additional requirements or notes..."
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !form.customer_id || !form.item_id || !form.quantity}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? 'Submitting...' : 'Submit RFQ'}
      </button>
    </div>
  )
}

export default function RFQPage() {
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

      <div className="max-w-6xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Submit RFQ</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <RFQForm />
        </Suspense>
      </div>
    </main>
  )
}