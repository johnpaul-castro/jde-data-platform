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
      label: "Databricks Lakehouse",
      desc: "Lakeflow DLT pipeline, Unity Catalog RBAC, AI/BI dashboards on JDE aerospace data",
      href: "/databricks",
      emoji: "🔶",
      color: "hover:border-orange-500",
      badge: "NEW",
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
      desc: "PostgreSQL · dbt Core · Airflow · Node.js · Next.js · Splink",
      href: "/open-source",
      emoji: "⚙️",
      color: "hover:border-emerald-500",
      badge: null,
    },
    {
      label: "Operations Overview",
      desc: "Live KPIs across revenue, AR, inventory, and purchasing",
      href: "/dashboards/sales-overview",
      emoji: "📋",
      color: "hover:border-purple-500",
      badge: null,
    },
    {
      label: "Customer Portal",
      desc: "Self-service portal for customers",
      href: "https://portal.jpcenterprises.com",
      emoji: "🏢",
      color: "hover:border-amber-500",
      badge: null,
    },
    {
      label: "E-Commerce",
      desc: "Online ordering and catalog",
      href: "https://shop.jpcenterprises.com",
      emoji: "🛒",
      color: "hover:border-rose-500",
      badge: null,
    },
    {
      label: "MDM Entity Resolution",
      desc: "Probabilistic customer matching across 5 ERPs using Splink",
      href: "/mdm",
      emoji: "🔗",
      color: "hover:border-teal-500",
      badge: null,
    },
    {
      label: "MDM Consolidated Sales",
      desc: "Unified sales view linked to golden customer records",
      href: "/mdm/sales",
      emoji: "💰",
      color: "hover:border-green-500",
      badge: null,
    },
    {
      label: "MDM Architecture",
      desc: "Extract → Bronze → Silver → Splink → Golden Record pipeline",
      href: "/mdm/architecture",
      emoji: "🧬",
      color: "hover:border-indigo-500",
      badge: null,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full border border-green-800">
            ● Live JDE Data — Gold Layer
          </span>
        </div>
        <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
          Unified RFQ<br />Intelligence Platform
        </h2>
        <p className="text-lg text-slate-400 mb-2 max-w-4xl">
          Real-time visibility across all entities. Submit RFQs, detect conflicts,
          and route requests to the right team — powered by live JDE data through
          a Bronze / Silver / Gold medallion architecture.
        </p>
        <p className="text-slate-500 text-sm mb-12">
          Built by <a href="mailto:johnpaulcastro@gmail.com" className="text-blue-400 hover:text-blue-300">JP Castro</a> · Senior Data Architect · <a href="mailto:johnpaulcastro@gmail.com" className="text-blue-400 hover:text-blue-300">johnpaulcastro@gmail.com</a>
        </p>

        {/* What is this? */}
        <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-6 group">
          <summary className="cursor-pointer text-slate-300 font-medium text-sm hover:text-white list-none flex items-center justify-between">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">What is this?</span>
            <span className="text-slate-400 text-2xl group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="mt-4">
            <p className="text-slate-300 text-base leading-relaxed mb-3">
              A live, working demo of a modern data platform — the kind of system I design and build for companies that have critical data locked in legacy ERP systems.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              This one pulls data from a simulated JD Edwards ERP, transforms it through a three-layer architecture (raw → cleaned → business-ready), and serves it to live dashboards, a customer self-service portal, and an e-commerce storefront. Everything you see is running in production on open-source tools.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              The platform also includes a Master Data Management (MDM) layer that demonstrates what happens when multiple ERP systems coexist across a portfolio of companies. Five separate ERPs — each with their own schemas, naming conventions, and customer records — are extracted, normalized, and then matched using Splink, a probabilistic record linkage engine. The result is a set of golden customer records that unify duplicates like &quot;Boeing Co.&quot;, &quot;THE BOEING COMPANY&quot;, and &quot;Boeing Defence UK Ltd&quot; into a single entity, with consolidated sales visibility across all systems. This is the foundation any RFQ or pricing system would need to sit on top of.
            </p>
          </div>
        </details>

        {/* Terminology */}
        <details className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 mb-12 group">
          <summary className="cursor-pointer text-slate-300 font-medium text-sm hover:text-white list-none flex items-center justify-between">
            <span>📖 Quick terminology (if you&apos;re new to modern data stacks)</span>
            <span className="text-slate-400 text-2xl group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="text-blue-400 font-semibold">ERP / JD Edwards</span>
              <p className="text-slate-400 mt-0.5">Enterprise software companies use to run operations — sales orders, inventory, purchasing, AR/AP. JD Edwards (JDE) is Oracle&apos;s ERP for mid-to-large manufacturers and distributors.</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">Medallion Architecture</span>
              <p className="text-slate-400 mt-0.5">A three-layer pattern for cleaning and organizing data: <strong>Bronze</strong> (raw copy from source), <strong>Silver</strong> (cleaned and typed), <strong>Gold</strong> (business-ready aggregations).</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">dbt (data build tool)</span>
              <p className="text-slate-400 mt-0.5">Open-source tool that transforms raw data into analytics-ready tables using SQL and version control. Runs the Silver and Gold layers.</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">Apache Airflow</span>
              <p className="text-slate-400 mt-0.5">Open-source workflow scheduler. Runs the full data pipeline on a nightly schedule and handles retries and alerting.</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">RFQ</span>
              <p className="text-slate-400 mt-0.5">Request For Quote — a customer asking for pricing on parts. Distributors deal with these constantly.</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">Railway</span>
              <p className="text-slate-400 mt-0.5">Cloud platform hosting everything you see — the Postgres database, the API, the dashboard, the portal, and the shop.</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">MDM (Master Data Management)</span>
              <p className="text-slate-400 mt-0.5">The practice of creating a single, trusted view of key business entities (customers, vendors, items) across multiple source systems that may store the same data differently.</p>
            </div>
            <div>
              <span className="text-blue-400 font-semibold">Splink</span>
              <p className="text-slate-400 mt-0.5">Open-source Python library for probabilistic record linkage. Uses techniques like Jaro-Winkler similarity and Fellegi-Sunter models to match records that refer to the same entity but have different names, formats, or typos.</p>
            </div>
          </div>
        </details>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href}
              className={"bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all group relative " + card.color + " hover:bg-slate-800"}>
              {card.badge && (
                <span className="absolute top-3 right-3 text-xs bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full border border-orange-700">
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
            Powered by PostgreSQL · dbt Core · Apache Airflow · Node.js · Next.js · Splink
          </p>
          <a href="mailto:johnpaulcastro@gmail.com" className="text-slate-500 text-xs hover:text-blue-400 transition-colors">
            johnpaulcastro@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}