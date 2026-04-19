import Link from "next/link";

export default function Home() {
  const cards = [
    { label: "Shipment Status", desc: "Shipped vs needs to ship", href: "/statusboards/shipments", emoji: "🚚", color: "hover:border-blue-500" },
    { label: "Receiving Status", desc: "Received vs not put away", href: "/statusboards/receiving", emoji: "📦", color: "hover:border-blue-500" },
    { label: "Sales Dashboard", desc: "Top customers by revenue", href: "/dashboards/sales", emoji: "💰", color: "hover:border-green-500" },
    { label: "AR Aging", desc: "Invoiced vs open balances", href: "/dashboards/ar-aging", emoji: "📊", color: "hover:border-green-500" },
    { label: "Customer Master", desc: "Search and browse customers", href: "/master-data/customers", emoji: "🏢", color: "hover:border-amber-500" },
    { label: "Submit RFQ", desc: "Route requests for quotation", href: "/rfq", emoji: "📋", color: "hover:border-purple-500" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="mb-4">
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">
            ● Live JDE Data — Gold Layer
          </span>
        </div>
        <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
          Unified RFQ<br />Intelligence Platform
        </h2>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">
          Real-time visibility across all entities. Submit RFQs, detect conflicts,
          and route requests to the right team — powered by live JDE data through
          a Bronze / Silver / Gold medallion architecture.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href}
              className={"bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all group " + card.color + " hover:bg-slate-800"}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm group-hover:bg-slate-700">
                  {card.emoji}
                </div>
                <h3 className="font-bold text-white">{card.label}</h3>
              </div>
              <p className="text-slate-400 text-sm">{card.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/architecture" className="text-slate-600 text-xs hover:text-slate-400 transition-colors">
            Powered by PostgreSQL · dbt Core · Apache Airflow · Node.js · Next.js — Medallion Architecture →
          </Link>
        </div>
      </div>
    </main>
  );
}
