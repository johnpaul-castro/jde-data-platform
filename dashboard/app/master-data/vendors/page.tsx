"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

const API = "https://jde-data-platform-production.up.railway.app"

interface Vendor {
  address_id: number
  address_name: string
  address_type: string
  tax_id: string
}

interface VendorDetail {
  address_id: number
  address_name: string
  address_type: string
  tax_id: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_code: string
  phone: string
  country: string
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Vendor | null>(null)
  const [detail, setDetail] = useState<VendorDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/vendors`)
      .then(r => r.json())
      .then(data => { setVendors(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleRowClick = async (vendor: Vendor) => {
    if (selected?.address_id === vendor.address_id) {
      setSelected(null); setDetail(null); return
    }
    setSelected(vendor); setDetail(null); setDetailLoading(true)
    const res = await fetch(`${API}/api/customers/${vendor.address_id}`)
    const data = await res.json()
    setDetail(data); setDetailLoading(false)
  }

  const filtered = vendors.filter(v =>
    v.address_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-400">Vendor Master</h2>
          <p className="text-slate-400 text-sm mt-1">All vendors — click any row for details</p>
        </div>
        <input type="text" placeholder="Search vendors..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-6">
        <div className={selected ? "w-3/5" : "w-full"}>
          {loading ? (
            <div className="text-slate-500 py-20 text-center">Loading vendor master...</div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Vendor Name</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Tax ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.address_id} onClick={() => handleRowClick(v)}
                      className={"cursor-pointer border-b border-slate-800/50 transition-all " +
                        (selected?.address_id === v.address_id
                          ? "bg-blue-950 border-l-2 border-l-blue-500"
                          : "hover:bg-slate-800/50")}>
                      <td className="px-4 py-3 text-slate-500 text-xs">{v.address_id}</td>
                      <td className="px-4 py-3 font-medium text-slate-200">{v.address_name}</td>
                      <td className="px-4 py-3 text-slate-400">{v.address_type}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{v.tax_id || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="w-2/5 bg-slate-900 rounded-xl border border-slate-800 p-6 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Vendor Detail</h3>
              <button onClick={() => { setSelected(null); setDetail(null) }}
                className="text-slate-500 hover:text-white text-xl">×</button>
            </div>
            <div className="mb-4 pb-4 border-b border-slate-800">
              <p className="font-semibold text-white">{selected.address_name}</p>
              <p className="text-slate-500 text-sm">ID: {selected.address_id}</p>
            </div>
            {detailLoading ? (
              <p className="text-slate-500 text-sm">Loading...</p>
            ) : detail ? (
              <div className="space-y-4">
                {detail.address_line_1 && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-slate-300 text-sm">{detail.address_line_1}</p>
                    {detail.address_line_2 && <p className="text-slate-300 text-sm">{detail.address_line_2}</p>}
                    <p className="text-slate-300 text-sm">{[detail.city, detail.state, detail.zip_code].filter(Boolean).join(", ")}</p>
                    {detail.country && <p className="text-slate-500 text-sm">{detail.country}</p>}
                  </div>
                )}
                {detail.phone && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-slate-300 text-sm">{detail.phone}</p>
                  </div>
                )}
                {detail.tax_id && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Tax ID</p>
                    <p className="text-slate-300 text-sm">{detail.tax_id}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
