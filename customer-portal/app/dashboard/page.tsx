'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [orders, setOrders] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderLines, setOrderLines] = useState<any[]>([])
  const [orderDetail, setOrderDetail] = useState<any>(null)
  const [loadingLines, setLoadingLines] = useState(false)
  const [loading, setLoading] = useState(true)

  const customerId = user?.publicMetadata?.customer_id as number | undefined

  useEffect(() => {
    if (!isLoaded || !customerId) return
    fetch(`${API_URL}/api/customers/${customerId}/sales`)
      .then(r => r.json())
      .then(data => { setOrders(data); setFiltered(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isLoaded, customerId])

  useEffect(() => {
    if (!search) { setFiltered(orders); return }
    setFiltered(orders.filter(o => String(o.order_id).includes(search)))
  }, [search, orders])

  const openOrder = async (order: any) => {
    setSelectedOrder(order)
    setLoadingLines(true)
    try {
      const res = await fetch(`${API_URL}/api/customers/${customerId}/orders/${order.order_id}`)
      const data = await res.json()
      setOrderLines(data.lines || [])
      setOrderDetail(data)
    } catch { setOrderLines([]) }
    setLoadingLines(false)
  }

  const handleDownloadPDF = async () => {
    if (!orderDetail) return
    const { downloadPackingSlip } = await import('../components/PackingSlipPDF')
    await downloadPackingSlip(orderDetail, orderDetail.customer)
  }

  if (!isLoaded || loading) return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading...</p>
    </main>
  )

  if (!customerId) return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400">Your account is not linked to a customer yet.</p>
        <p className="text-slate-500 text-sm mt-2">Please contact support.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">JDE Customer Portal</h1>
          <p className="text-slate-500 text-sm">Welcome, {user?.firstName} — Customer #{customerId}</p>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div>
                  <h3 className="text-white font-bold text-lg">Order #{selectedOrder.order_id}</h3>
                  <p className="text-slate-400 text-sm">
                    Ordered: {new Date(selectedOrder.date_transaction).toLocaleDateString()} · 
                    Requested: {new Date(selectedOrder.date_requested).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                    ⬇ Download Packing Slip
                  </button>
                  <button onClick={() => setSelectedOrder(null)}
                    className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
                </div>
              </div>
              <div className="p-6">
                {loadingLines ? (
                  <p className="text-slate-400 text-center py-8">Loading order lines...</p>
                ) : orderLines.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No line details found.</p>
                ) : (
                  <table className="w-full text-sm min-w-max">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 text-slate-400 font-medium">Line</th>
                        <th className="text-left py-3 text-slate-400 font-medium">Item ID</th>
                        <th className="text-left py-3 text-slate-400 font-medium">Description</th>
                        <th className="text-left py-3 text-slate-400 font-medium">Status</th>
                        <th className="text-right py-3 text-slate-400 font-medium">Qty Ordered</th>
                        <th className="text-right py-3 text-slate-400 font-medium">Qty Shipped</th>
                        <th className="text-right py-3 text-slate-400 font-medium">Unit Price</th>
                        <th className="text-right py-3 text-slate-400 font-medium">Extended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLines.map((line: any, i: number) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          <td className="py-3 text-slate-300">{line.line_number}</td>
                          <td className="py-3 text-blue-400 font-mono">{line.item_id}</td>
                          <td className="py-3 text-slate-300">{line.item_description}</td>
                          <td className="py-3 text-slate-400">{line.next_status}</td>
                          <td className="py-3 text-slate-300 text-right">{Number(line.quantity_ordered).toLocaleString()}</td>
                          <td className="py-3 text-slate-300 text-right">{Number(line.quantity_shipped).toLocaleString()}</td>
                          <td className="py-3 text-slate-300 text-right">${Number(line.unit_price).toFixed(2)}</td>
                          <td className="py-3 text-green-400 text-right font-semibold">${Number(line.extended_amount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-700">
                        <td colSpan={6} className="py-3 text-slate-400 text-right font-medium">Order Total:</td>
                        <td className="py-3 text-green-400 text-right font-bold">
                          ${Number(selectedOrder.order_total).toLocaleString(undefined, {minimumFractionDigits:2})}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Orders</h2>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} orders found</p>
          </div>
          <input
            type="text"
            placeholder="Search by Order #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400">No orders found.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">Order #</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">Order Date</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">Requested Date</th>
                  <th className="text-right px-6 py-4 text-slate-400 font-medium">Lines</th>
                  <th className="text-right px-6 py-4 text-slate-400 font-medium">Qty</th>
                  <th className="text-right px-6 py-4 text-slate-400 font-medium">Order Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order: any, i: number) => (
                  <tr key={i}
                    onClick={() => openOrder(order)}
                    className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-blue-400 font-mono font-semibold">{order.order_id}</td>
                    <td className="px-6 py-4 text-slate-300">{new Date(order.date_transaction).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-300">{new Date(order.date_requested).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-300 text-right">{order.line_count}</td>
                    <td className="px-6 py-4 text-slate-300 text-right">{Number(order.total_qty).toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-400 text-right font-semibold">${Number(order.order_total).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
