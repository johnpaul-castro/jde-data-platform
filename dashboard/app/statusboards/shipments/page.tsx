"use client";
import { useEffect, useState } from "react";

const API = "https://jde-data-platform-production.up.railway.app";

type Summary = {
  shipment_status: string;
  status_color: string;
  line_count: string;
  total_ordered: string;
  total_shipped: string;
  total_remaining: string;
  overdue_count: string;
};

type Line = {
  order_id: number;
  customer_name: string;
  item_number: string;
  item_description: string;
  quantity_ordered: number;
  quantity_shipped: number;
  quantity_remaining: number;
  shipment_status: string;
  status_color: string;
  date_promised: string;
  days_past_promise: number;
  is_overdue: boolean;
};

const colorMap: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  info:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  default: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function ShipmentStatusBoard() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [lines, setLines]     = useState<Line[]>([]);
  const [filter, setFilter]   = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/statusboard/shipments/summary`).then(r => r.json()),
      fetch(`${API}/api/statusboard/shipments`).then(r => r.json()),
    ]).then(([s, l]) => {
      setSummary(s);
      setLines(l);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? lines : lines.filter(l => l.shipment_status === filter);

  if (loading) return <div className="text-zinc-500 text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-400">Shipment Status Board</h1>
        <p className="text-slate-400 text-sm mt-1">Shipped vs needs to ship — all open sales orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {summary.map((s) => (
          <button
            key={s.shipment_status}
            onClick={() => setFilter(filter === s.shipment_status ? "all" : s.shipment_status)}
            className={`rounded-xl border p-5 text-left transition-all hover:scale-[1.02]
              ${filter === s.shipment_status ? "ring-2 ring-blue-400" : ""}
              ${colorMap[s.status_color] || colorMap.default}`}
          >
            <div className="text-2xl font-bold">{parseInt(s.line_count).toLocaleString()}</div>
            <div className="text-sm font-medium mt-1">{s.shipment_status}</div>
            <div className="text-xs mt-2 opacity-70">
              {parseInt(s.total_remaining).toLocaleString()} units remaining
              {parseInt(s.overdue_count) > 0 && (
                <span className="ml-2 text-red-400">⚠ {s.overdue_count} overdue</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Detail table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">
            {filtered.length} lines {filter !== "all" && `— ${filter}`}
          </span>
          {filter !== "all" && (
            <button onClick={() => setFilter("all")} className="text-xs text-zinc-500 hover:text-zinc-300">
              Clear filter
            </button>
          )}
        </div>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-right">Ordered</th>
                <th className="px-4 py-3 text-right">Shipped</th>
                <th className="px-4 py-3 text-right">Remaining</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Promise Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((line, i) => (
                <tr
                  key={`${line.order_id}-${i}`}
                  className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors
                    ${line.is_overdue ? "bg-red-950/10" : ""}`}
                >
                  <td className="px-4 py-3 font-mono text-zinc-400">{line.order_id}</td>
                  <td className="px-4 py-3 text-zinc-200">{line.customer_name}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    <div className="font-medium text-zinc-300">{line.item_number}</div>
                    <div className="truncate max-w-[180px]">{line.item_description}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-300">{line.quantity_ordered}</td>
                  <td className="px-4 py-3 text-right text-zinc-300">{line.quantity_shipped}</td>
                  <td className={`px-4 py-3 text-right font-medium
                    ${line.quantity_remaining > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {line.quantity_remaining}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${colorMap[line.status_color]}`}>
                      {line.shipment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    <div>{line.date_promised ? new Date(line.date_promised).toLocaleDateString() : "—"}</div>
                    {line.is_overdue && (
                      <div className="text-red-400">{line.days_past_promise}d overdue</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
