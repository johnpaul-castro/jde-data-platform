import Link from "next/link";

export default function DatabricksLakehouse() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 mb-6 inline-block">← Back to Blog</Link>

        <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
          <span>June 2026</span><span>·</span><span>10 min read</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Re-engineering 50 Notebooks into a 2-Minute DAB Pipeline on Databricks</h1>
        <div className="flex flex-wrap gap-2 mb-10">
          {["Databricks","DAB","Lakeflow DLT","Unity Catalog","PySpark"].map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{t}</span>
          ))}
        </div>

        <article className="prose-custom text-slate-300 text-sm leading-relaxed space-y-5">
          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Starting Point</h2>
          <p>
            When I joined an early-stage financial data startup as a Founding Technical Equity Partner, the
            production pipeline was built from approximately 50 sequential Databricks notebooks. Each notebook
            ran one step of the transformation, chained together with notebook workflow calls. End-to-end
            runtime was 1 hour and 38 minutes. There was no dev/test/prod separation: everything ran against
            a single catalog with hardcoded references.
          </p>
          <p>
            My first task was a codebase audit. I found several categories of issues: a plaintext Azure
            storage key committed to the GitHub repository, silent data corruption in shared null-handling
            utilities (an abs() call was stripping the sign from financial values that needed to remain
            negative), a tautological balance check that could never fail, hardcoded catalog names that
            prevented any environment separation, and infinite timeouts in the orchestrator that masked
            failures.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Rebuild</h2>
          <p>
            The goal was to replace the sequential notebook chain with a proper software engineering approach:
            source-controlled, parameterized, testable, and fast.
          </p>
          <p>
            <span className="text-orange-400 font-semibold">Declarative Automation Bundles (DAB):</span> The
            entire project structure lives in a DAB configuration with separate deployment targets for dev and
            prod. Each target points to its own Unity Catalog catalog. A single <code className="text-orange-300 bg-slate-800 px-1 rounded">databricks bundle deploy</code> promotes
            code from dev to prod without manual notebook copying.
          </p>
          <p>
            <span className="text-orange-400 font-semibold">Lakeflow Declarative Pipelines (DLT):</span> The
            transformation logic moved from imperative notebook code into declarative DLT pipeline definitions.
            Bronze uses Auto Loader to ingest from ADLS Gen2. Silver applies cleaning, typing, and business
            rules. Gold produces Kimball dimensional models. DLT handles dependency resolution, incremental
            processing, and data quality enforcement through Expectations.
          </p>
          <p>
            <span className="text-orange-400 font-semibold">Unity Catalog Governance:</span> Every table is
            registered in Unity Catalog with proper schema organization (bronze, silver, gold). Access controls
            are defined at the catalog level. Lineage is automatic. The dev catalog is isolated from prod so
            engineers can experiment without risking production data.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">The Metric Mart</h2>
          <p>
            The Gold layer includes a 26-column Metric Mart implemented as a materialized view. It computes
            revenue, expense, vendor cost, AR/AP balances, aging buckets, DSO, DPO, and cash metrics. But it
            also computes inline enrichment: trailing 8-week baselines, deviation scoring (delta_abs,
            delta_pct), and materiality calculations. All of this runs within the DLT pipeline refresh, so the
            Metric Mart is always current when the pipeline completes.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Validation</h2>
          <p>
            You cannot re-engineer a financial pipeline and just hope the numbers match. I built a pytest-based
            validation suite that runs full legacy-versus-new equivalence checks across all 223 shared reporting
            keys. The test asserts zero accounting-logic differences. It runs as a repeatable regression gate
            before any production cutover.
          </p>
          <p>
            I also built a Silver-layer Class B evidence framework: 14 event, profile, and baseline views that
            provide audit-grade traceability for every financial transformation. A mapping stability tracker
            detects account classification drift across pipeline runs. When an account that was classified as
            &quot;revenue&quot; suddenly maps to &quot;expense,&quot; the evidence layer flags it before it reaches Gold.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Infrastructure Recovery</h2>
          <p>
            Before any of the transformation work could begin, I had to diagnose and resolve Unity Catalog
            storage infrastructure gaps that were blocking all pipeline execution. The workspace had an ADLS
            Gen2 container but no storage credential binding. I provisioned an Azure Databricks access connector
            with managed identity, created storage credentials, and repointed external locations. Only then
            could Auto Loader ingest from the landing zone.
          </p>
          <p>
            During development, a <code className="text-orange-300 bg-slate-800 px-1 rounded">bundle destroy</code> command
            accidentally removed the dev catalog. I recovered it via deep-clone from the production catalog.
            Lesson learned: DAB destroy is permanent. I added guardrails to prevent accidental catalog deletion
            in subsequent deployments.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">Results</h2>
          <p>
            The rebuilt pipeline runs end-to-end in under 2 minutes, down from 1 hour 38 minutes. The pytest
            validation suite confirms zero accounting differences across 223 reporting keys. The codebase went
            from 50 sequential notebooks with no version control to a source-controlled DAB project with
            parameterized environments, declarative pipelines, and automated testing.
          </p>
          <p>
            More importantly, a new engineer can clone the repo, run <code className="text-orange-300 bg-slate-800 px-1 rounded">bundle deploy -t dev</code>,
            and have a working dev environment in minutes. That was not possible before.
          </p>
        </article>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/databricks" className="text-blue-400 text-sm hover:text-blue-300">→ See the Databricks Lakehouse demo</Link>
        </div>
      </div>
    </main>
  );
}
