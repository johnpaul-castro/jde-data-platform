import Link from "next/link";

export default function Home() {
  const cards = [
    {
      label: "Medallion Architecture",
      desc: "Bronze → Silver → Gold data platform built on open source",
      href: "/architecture",
      emoji: "🏗️",
      color: "hover:border-blue-500",
      badge: null,
    },
    {
      label: "My Resume",
      desc: "Senior Data Architect — JP Castro",
      href: "/resume",
      emoji: "👤",
      color: "hover:border-cyan-500",
      badge: null,
    },
    {
      label: "Open Source Stack",
      desc: "PostgreSQL · dbt Core · Airflow · Node.js · Next.js",
      href: "/open-source",
      emoji: "⚙️",
      color: "hover:border-emerald-500",
      badge: null,
    },
    {
      label: "Submit RFQ",
      desc: "Route requests for quotation to the right team",
      href: "/rfq",
      emoji: "📋",
      color: "hover:border-purple-500",
      badge: null,
    },
    {
      label: "Customer Portal",
      desc: "Self-service portal for customers",
      href: "#",
      emoji: "🏢",
      color: "hover:border-amber-500",
      badge: "Coming Soon",
    },
    {
      label: "E-Commerce",
      desc: "Online ordering and catalog",
      href: "#",
      emoji: "🛒",
      color: "hover:border-rose-500",
      badge: "Coming Soon",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">
            ● Live JDE Data — Gold Layer
          </span>
        </div>
        <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
          Unified RFQ<br />Intelligence Platform
        </h2>
        <p className="text-lg text-slate-400 mb-2 max-w-2xl">
          Real-time visibility across all entities. Submit RFQs, detect conflicts,
          and route requests to the right team — powered by live JDE data through
          a Bronze / Silver / Gold medallion architecture.
        </p>
        <p className="text-slate-500 text-sm mb-12">
          Built by <a href="mailto:johnpaulcastro@gmail.com" className="text-blue-400 hover:text-blue-300">JP Castro</a> · Senior Data Architect · <a href="mailto:johnpaulcastro@gmail.com" className="text-blue-400 hover:text-blue-300">johnpaulcastro@gmail.com</a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href}
              className={"bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all group relative " + card.color + " hover:bg-slate-800" + (card.badge ? " cursor-default" : "")}>
              {card.badge && (
                <span className="absolute top-3 right-3 text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              )}
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

        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
          <p className="text-slate-600 text-xs">
            Powered by PostgreSQL · dbt Core · Apache Airflow · Node.js · Next.js
          </p>
          <a href="mailto:johnpaulcastro@gmail.com" className="text-slate-500 text-xs hover:text-blue-400 transition-colors">
            johnpaulcastro@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
