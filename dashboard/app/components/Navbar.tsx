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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggle = (label: string) => setOpen(open === label ? null : label);
  const closeAll = () => { setOpen(null); setMobileOpen(false); };

  return (
    <>
      {(open || mobileOpen) && <div className="fixed inset-0 z-40" onClick={closeAll} />}

      <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 h-14 flex items-center relative z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6" onClick={closeAll}>
          <span className="text-blue-400 font-bold text-lg tracking-tight">JDE</span>
          <span className="text-slate-400 text-sm hidden sm:inline">Platform</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
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
                      <Link key={item.href} href={item.href} onClick={closeAll}
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
          <Link href="/architecture" onClick={closeAll}
            className={"px-3 py-4 text-sm font-medium transition-colors " +
              (pathname === "/architecture" ? "text-blue-400" : "text-slate-400 hover:text-slate-100")}>
            Architecture
          </Link>
          <Link href="/resume" onClick={closeAll}
            className={"px-3 py-4 text-sm font-medium transition-colors " +
              (pathname === "/resume" ? "text-blue-400" : "text-slate-400 hover:text-slate-100")}>
            Resume
          </Link>
          <div className="ml-auto">
            <Link href="/rfq" onClick={closeAll}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors">
              Submit RFQ
            </Link>
          </div>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden ml-auto flex items-center gap-3">
          <Link href="/rfq" onClick={closeAll}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            RFQ
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 z-50 relative">
          {navItems.map((group) => (
            <div key={group.label} className="border-b border-slate-800">
              <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-widest">{group.label}</p>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeAll}
                  className={"block px-6 py-2.5 text-sm transition-colors " +
                    (pathname === item.href ? "text-blue-400 bg-slate-800" : "text-slate-300 hover:bg-slate-800")}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="border-b border-slate-800">
            <Link href="/architecture" onClick={closeAll} className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-800">Architecture</Link>
            <Link href="/resume" onClick={closeAll} className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-800">Resume</Link>
          </div>
        </div>
      )}
    </>
  );
}
