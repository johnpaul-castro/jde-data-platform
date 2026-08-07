import Link from "next/link";

export default function DbtCoreVsCloud() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 mb-6 inline-block">← Back to Blog</Link>

        <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
          <span>May 2026</span><span>·</span><span>6 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Why I Chose dbt Core over dbt Cloud for This Project</h1>
        <div className="flex flex-wrap gap-2 mb-10">
          {["dbt","Architecture","Open Source","Decision Record"].map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{t}</span>
          ))}
        </div>

        <article className="prose-custom text-slate-300 text-sm leading-relaxed space-y-5">
          <h2 className="text-xl font-bold text-white mt-8 mb-3">Context</h2>
          <p>
            The JDE Data Platform is a self-hosted portfolio project running on Railway with PostgreSQL as
            the data warehouse. The transformation layer needed to take 10 raw Bronze tables and produce
            10 Silver models and 6 Gold aggregations using Kimball dimensional modeling. I needed a tool
            that handled SQL-based transformations, dependency resolution, incremental processing,
            and documentation.
          </p>
          <p>
            dbt was the obvious choice. The question was which flavor: dbt Core (open-source, self-hosted)
            or dbt Cloud (managed SaaS with a browser IDE, scheduling, and CI/CD).
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Decision Criteria</h2>
          <p>
            I evaluated both options against five criteria: hosting model, cost, orchestration integration,
            database compatibility, and learning value.
          </p>
          <p>
            <span className="text-blue-400 font-semibold">Hosting model:</span> The entire platform runs on
            Railway. dbt Core runs as a CLI tool inside a Docker container that Apache Airflow triggers
            nightly. It fits the self-hosted model perfectly. dbt Cloud is a separate SaaS platform that
            would need its own scheduling, its own connection to the Railway PostgreSQL instance, and its
            own authentication layer. For a platform designed to demonstrate full-stack ownership, adding a
            managed service for one layer felt like the wrong signal.
          </p>
          <p>
            <span className="text-blue-400 font-semibold">Cost:</span> dbt Core is free. dbt Cloud has a
            free tier but limits seats, environments, and run frequency. For a portfolio project that might
            run for years, the free tier constraints would eventually become a problem. More importantly,
            the paid tier would be an ongoing cost for a demo project that generates no revenue.
          </p>
          <p>
            <span className="text-blue-400 font-semibold">Orchestration integration:</span> Apache Airflow
            already orchestrates the extractors and controls the pipeline DAG. Running dbt Core via the
            BashOperator means dbt is just another step in the same DAG, with the same retry logic,
            alerting, and dependency management. dbt Cloud has its own scheduler that would run independently,
            creating two sources of truth for pipeline scheduling.
          </p>
          <p>
            <span className="text-blue-400 font-semibold">Database compatibility:</span> Both support
            PostgreSQL. No difference here.
          </p>
          <p>
            <span className="text-blue-400 font-semibold">Learning value:</span> Running dbt Core means
            understanding profiles.yml, the CLI flags, the compilation process, and the adapter layer. These
            are the same concepts that transfer to dbt on Databricks or Snowflake. dbt Cloud abstracts some
            of this away, which is a feature for teams but a loss for someone building portfolio depth.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Decision</h2>
          <p>
            dbt Core won on four of five criteria. The only advantage dbt Cloud offered was the browser IDE
            and built-in documentation hosting, neither of which mattered for a project where I am the sole
            developer and the documentation is generated via <code className="text-blue-300 bg-slate-800 px-1 rounded">dbt docs generate</code> anyway.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">What I Would Choose Differently</h2>
          <p>
            For the Databricks lakehouse work I do now, I do not use dbt at all. Lakeflow Declarative Pipelines
            (DLT) handles the same job: dependency resolution, incremental processing, data quality enforcement,
            and schema management. DLT is native to Databricks, runs on the same compute, and integrates with
            Unity Catalog lineage automatically.
          </p>
          <p>
            The decision between dbt and DLT is really a decision about where your warehouse lives. If you are
            on PostgreSQL, Snowflake, or BigQuery, dbt Core is the right answer. If you are on Databricks, DLT
            gives you the same transformation semantics with tighter platform integration and no additional
            tool to manage.
          </p>
          <p>
            dbt Cloud makes sense when you have a team of analysts who need a collaborative IDE and you want
            managed CI/CD without building it yourself. For a solo engineer or a small team that already has
            Airflow or Databricks Workflows, dbt Core or DLT are the better fits.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Implementation Notes</h2>
          <p>
            The dbt project uses a custom macro for JDE Julian date conversion (JDE stores dates as integers
            in the format CYYDDD). Surrogate keys use the _key suffix convention. All models follow entity-first
            naming: <code className="text-blue-300 bg-slate-800 px-1 rounded">sales_order_header</code> rather
            than <code className="text-blue-300 bg-slate-800 px-1 rounded">header_sales_order</code>. Gold models
            are materialized as tables for query performance. Silver models are views to minimize storage on
            the Railway PostgreSQL instance.
          </p>
          <p>
            The Airflow DAG runs the extractors first, then triggers <code className="text-blue-300 bg-slate-800 px-1 rounded">dbt run</code> followed
            by <code className="text-blue-300 bg-slate-800 px-1 rounded">dbt test</code>. If any test fails, the
            DAG stops and alerts. The Gold layer only refreshes if Silver passes all tests. This is the same
            pattern you would implement with DLT Expectations on Databricks, just using different tooling.
          </p>
        </article>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/architecture" className="text-blue-400 text-sm hover:text-blue-300">→ See the full architecture</Link>
        </div>
      </div>
    </main>
  );
}
