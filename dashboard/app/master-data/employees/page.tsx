"use client"
import { useEffect, useState } from "react"

const API = "https://jde-data-platform-production.up.railway.app"

interface Employee {
  address_id: number
  address_name: string
  address_type: string
  tax_id: string
}

interface EmployeeDetail {
  address_id: number
  address_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_code: string
  phone: string
  country: string
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Employee | null>(null)
  const [detail, setDetail] = useState<EmployeeDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/employees`)
      .then(r => r.json())
      .then(data => { setEmployees(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleRowClick = async (emp: Employee) => {
    if (selected?.address_id === emp.address_id) {
      setSelected(null); setDetail(null); return
    }
    setSelected(emp); setDetail(null); setDetailLoading(true)
    const res = await fetch(`${API}/api/customers/${emp.address_id}`)
    const data = await res.json()
    setDetail(data); setDetailLoading(false)
  }

  const filtered = employees.filter(e =>
    e.address_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-400">Employee Master</h2>
          <p className="text-slate-400 text-sm mt-1">All employees — click any row for details</p>
        </div>
        <input type="text" placeholder="Search employees..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-6">
        <div className={selected ? "w-3/5" : "w-full"}>
          {loading ? (
            <div className="text-slate-500 py-20 text-center">Loading employee master...</div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider">Tax ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.address_id} onClick={() => handleRowClick(e)}
                      className={"cursor-pointer border-b border-slate-800/50 transition-all " +
                        (selected?.address_id === e.address_id
                          ? "bg-blue-950 border-l-2 border-l-blue-500"
                          : "hover:bg-slate-800/50")}>
                      <td className="px-4 py-3 text-slate-500 text-xs">{e.address_id}</td>
                      <td className="px-4 py-3 font-medium text-slate-200">{e.address_name}</td>
                      <td className="px-4 py-3 text-slate-400">{e.address_type}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{e.tax_id || "—"}</td>
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
              <h3 className="font-bold text-white">Employee Detail</h3>
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
                    <p className="text-slate-300 text-sm">{[detail.city, detail.state, detail.zip_code].filter(Boolean).join(", ")}</p>
                  </div>
                )}
                {detail.phone && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-slate-300 text-sm">{detail.phone}</p>
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
