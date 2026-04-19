"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Status Boards",
    items: [
      { label: "Shipment Status", href: "/statusboards/shipments" },
      { label: "Receiving Status", href: "/statusboards/receiving" },
    ],
  },
  {
    label: "Dashboards",
    items: [
      { label: "Operations Overview", href: "/dashboards/sales-overview" },
      { label: "Sales by Customer", href: "/dashboards/sales" },
      { label: "AR Aging", href: "/dashboards/ar-aging" },
      { label: "Purchasing", href: "/dashboards/purchasing" },
      { label: "Inventory", href: "/dashboards/inventory" },
    ],
  },
  {
    label: "Master Data",
    items: [
      { label: "Customers", href: "/master-data/customers" },
      { label: "Vendors", href: "/master-data/vendors" },
      { label: "Employees", href: "/master-data/employees" },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const pathname = usePathname();

  const toggle = (label: string) => setOpen(open === label ? null : label);

  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />}
      <nav className="bg-slate-900 border-b border-slate-800 px-8 py-0 flex items-center gap-2 h-14 relative z-50">
        <Link href="/" className="flex items-center gap-2 mr-6" onClick={() => setOpen(null)}>
          <span className="text-blue-400 font-bold text-lg tracking-tight">JDE</span>
          <span className="text-slate-400 text-sm">Platform</span>
        </Link>

        {navItems.map((group) => {
          const isActive = group.items.some(i => pathname.startsWith(i.href));
          return (
            <div key={group.label} className="relative">
              <button onClick={() => toggle(group.label)}
                className={"flex items-center gap-1 px-3 py-4 text-sm font-medium transition-colors " +
                  (isActive || open === group.label ? "text-blue-400" : "text-slate-400 hover:text-slate-100")}>
                {group.label}
                <svg className={"w-3 h-3 mt-0.5 transition-transform " + (open === group.label ? "rotate-180" : "")}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === group.label && (
                <div className="absolute top-full left-0 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1 mt-0.5">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(null)}
                      className={"block px-4 py-2.5 text-sm transition-colors " +
                        (pathname === item.href ? "text-blue-400 bg-slate-700" : "text-slate-300 hover:text-slate-100 hover:bg-slate-700")}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <Link href="/architecture" onClick={() => setOpen(null)}
          className={"px-3 py-4 text-sm font-medium transition-colors block " +
            (pathname === "/architecture" ? "text-blue-400" : "text-slate-400 hover:text-slate-100")}>
          Architecture
        </Link>

        <Link href="/resume" onClick={() => setOpen(null)}
          className={"px-3 py-4 text-sm font-medium transition-colors block " +
            (pathname === "/resume" ? "text-blue-400" : "text-slate-400 hover:text-slate-100")}>
          Resume
        </Link>

        <div className="ml-auto">
          <Link href="/rfq" onClick={() => setOpen(null)}
            className={"px-4 py-1.5 rounded-lg text-sm font-medium transition-colors " +
              (pathname === "/rfq" ? "bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white")}>
            Submit RFQ
          </Link>
        </div>
      </nav>
    </>
  );
}
