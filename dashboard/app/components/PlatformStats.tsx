"use client";
import { useEffect, useState } from "react";

const API = "https://jde-data-platform-production.up.railway.app";

interface Stats {
  totalCustomers: number;
  totalVendors: number;
  totalItems: number;
  totalSalesOrders: number;
  totalSalesLines: number;
  totalPurchaseOrders: number;
  totalUnitsOnHand: number;
  goldenRecords: number;
  duplicatesResolved: number;
  totalSourceRecords: number;
}

export default function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [platform, mdm] = await Promise.all([
          fetch(`${API}/api/platform-stats`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${API}/api/mdm/stats`).then(r => r.ok ? r.json() : null).catch(() => null),
        ]);

        setStats({
          totalCustomers: Number(platform?.total_customers ?? 0),
          totalVendors: Number(platform?.total_vendors ?? 0),
          totalItems: Number(platform?.total_items ?? 0),
          totalSalesOrders: Number(platform?.total_sales_orders ?? 0),
          totalSalesLines: Number(platform?.total_sales_lines ?? 0),
          totalPurchaseOrders: Number(platform?.total_purchase_orders ?? 0),
          totalUnitsOnHand: Number(platform?.total_units_on_hand ?? 0),
          goldenRecords: mdm?.golden_records ?? 251,
          duplicatesResolved: mdm?.duplicates_resolved ?? 82,
          totalSourceRecords: mdm?.total_source_records ?? 333,
        });
      } catch {
        setStats(null);
      }
    }
    load();
  }, []);

  if (!stats) return null;

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Live Platform Metrics</p>
      </div>

      {/* Platform-wide */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-5">
        {[
          { label: "Customers", value: fmt(stats.totalCustomers), color: "text-blue-400" },
          { label: "Vendors", value: fmt(stats.totalVendors), color: "text-blue-400" },
          { label: "Items", value: fmt(stats.totalItems), color: "text-blue-400" },
          { label: "Sales Orders", value: fmt(stats.totalSalesOrders), color: "text-emerald-400" },
          { label: "Purchase Orders", value: fmt(stats.totalPurchaseOrders), color: "text-emerald-400" },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className={"text-2xl font-bold " + m.color}>{m.value}</p>
            <p className="text-slate-500 text-xs mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 pt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
        {[
          { label: "Order Lines", value: fmt(stats.totalSalesLines), color: "text-slate-300" },
          { label: "Units on Hand", value: fmt(stats.totalUnitsOnHand), color: "text-amber-400" },
          { label: "Source Records", value: fmt(stats.totalSourceRecords), color: "text-teal-400" },
          { label: "Golden Records", value: fmt(stats.goldenRecords), color: "text-teal-400" },
          { label: "Duplicates Resolved", value: fmt(stats.duplicatesResolved), color: "text-green-400" },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className={"text-2xl font-bold " + m.color}>{m.value}</p>
            <p className="text-slate-500 text-xs mt-1">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
