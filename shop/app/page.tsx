'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const TEST_CARD = '4242 4242 4242 4242'

type Product = {
  item_number: string
  item_description: string
  unit_of_measure: string
  gl_class: string
  product_group: string
  price_list: string
  quantity_on_hand: string
  quantity_on_order: string
}

type CartItem = { item_number: string; quantity: number }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/shop/products`)
      .then(r => r.json())
      .then(setProducts)
  }, [])

  const cartMap = Object.fromEntries(cart.map(c => [c.item_number, c.quantity]))
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)
  const cartTotal = cart.reduce((s, c) => {
    const p = products.find(p => p.item_number === c.item_number)
    return s + (p ? Number(p.price_list) * c.quantity : 0)
  }, 0)

  const addToCart = (item_number: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.item_number === item_number)
      if (existing) return prev.map(c => c.item_number === item_number ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { item_number, quantity: 1 }]
    })
  }

  const removeFromCart = (item_number: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.item_number === item_number)
      if (!existing) return prev
      if (existing.quantity <= 1) return prev.filter(c => c.item_number !== item_number)
      return prev.map(c => c.item_number === item_number ? { ...c, quantity: c.quantity - 1 } : c)
    })
  }

  const copyTestCard = async () => {
    try {
      await navigator.clipboard.writeText(TEST_CARD.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea')
      textarea.value = TEST_CARD.replace(/\s/g, '')
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const checkout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    // Auto-copy the test card before redirecting so it's ready to paste
    try {
      await navigator.clipboard.writeText(TEST_CARD.replace(/\s/g, ''))
    } catch { /* ignore — banner button is still available */ }

    try {
      const res = await fetch(`${API_URL}/api/shop/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout error: ' + (data.error || 'unknown'))
    } catch (err) {
      alert('Checkout failed: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p =>
    !filter ||
    p.item_number.toLowerCase().includes(filter.toLowerCase()) ||
    p.item_description.toLowerCase().includes(filter.toLowerCase()) ||
    p.product_group?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <main className="min-h-screen">
      {showBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded">DEMO</span>
              <span>No real payments. Test card:</span>
              <button
                onClick={copyTestCard}
                className="bg-slate-900/60 hover:bg-slate-900 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-amber-100 transition"
                title="Click to copy"
              >
                {copied ? '✓ Copied — paste into Stripe' : `${TEST_CARD}  📋`}
              </button>
              <span className="text-xs text-amber-300/70">· any future date · any CVC · any ZIP</span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-amber-300 hover:text-amber-100 text-lg leading-none ml-4"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">JDE Parts Shop</h1>
            <p className="text-xs text-slate-400">Live inventory from gold.inventory_status</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search parts..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-blue-500"
            />
            <div className="text-sm">
              <span className="text-slate-400">Cart:</span>{' '}
              <span className="font-semibold">{cartCount}</span>{' '}
              <span className="text-slate-400">
                ({cartTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})
              </span>
            </div>
            <button
              onClick={checkout}
              disabled={cart.length === 0 || loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-1.5 rounded text-sm font-medium"
            >
              {loading ? 'Redirecting...' : 'Checkout'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-sm text-slate-400 mb-4">
          {filtered.length} parts available{filter ? ` matching "${filter}"` : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const qtyInCart = cartMap[p.item_number] || 0
            const available = Number(p.quantity_on_hand)
            return (
              <div key={p.item_number} className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-mono text-xs text-blue-400">{p.item_number}</div>
                    <div className="font-medium mt-0.5">{p.item_description}</div>
                  </div>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded">{p.unit_of_measure}</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <span className="text-xs text-slate-400">{p.product_group}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-400">{available.toLocaleString()} in stock</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    ${Number(p.price_list).toFixed(2)}
                  </div>
                  {qtyInCart === 0 ? (
                    <button
                      onClick={() => addToCart(p.item_number)}
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-sm"
                    >
                      Add to cart
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(p.item_number)} className="bg-slate-800 hover:bg-slate-700 w-7 h-7 rounded">−</button>
                      <span className="text-sm font-medium w-6 text-center">{qtyInCart}</span>
                      <button onClick={() => addToCart(p.item_number)} className="bg-slate-800 hover:bg-slate-700 w-7 h-7 rounded">+</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
