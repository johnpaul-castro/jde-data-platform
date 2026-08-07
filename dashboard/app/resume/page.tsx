export default function Resume() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">John Paul Castro</h1>
            <p className="text-blue-400 text-lg font-medium mb-3">Senior Data Platform Architect/Engineer | Azure Databricks · MS SQL Server · Spark SQL · PySpark · Kimball · DAB</p>
            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
              <span>📞 (818) 943-5159</span>
              <a href="mailto:johnpaulcastro@gmail.com" className="hover:text-blue-400 transition-colors">✉ johnpaulcastro@gmail.com</a>
              <a href="https://linkedin.com/in/johnpaul-castro" className="hover:text-blue-400 transition-colors">🔗 linkedin.com/in/johnpaul-castro</a>
              <a href="https://github.com/johnpaul-castro" className="hover:text-blue-400 transition-colors">💻 github.com/johnpaul-castro</a>
              <a href="https://jpcenterprises.com" className="hover:text-blue-400 transition-colors">🌐 jpcenterprises.com</a>
              <span>📍 Cleveland, TN · Open to remote (US)</span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="bg-green-900/30 border border-green-800 rounded-xl px-4 py-3 text-center">
              <p className="text-green-400 text-xs uppercase tracking-wide mb-1">Featured Project</p>
              <p className="text-white font-semibold text-sm">JDE Data Platform</p>
              <p className="text-slate-400 text-xs mt-1">Live — Railway Cloud</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Professional Summary</h2>
          <p className="text-slate-300 leading-relaxed">
            Data platform architect and engineer with 25+ years building enterprise-grade data systems in aerospace, entertainment,
            financial data, and telecommunications. Deep expertise in Azure Databricks (Delta Lake, Unity Catalog, DAB, Lakeflow/DLT,
            Structured Streaming), full MS SQL Server development and administration, and Kimball dimensional modeling. Currently
            consulting for a financial data startup where he re-engineered a production accounting pipeline from approximately 50
            sequential notebooks into a modular DAB/DLT architecture, reducing end-to-end runtime from 1 hour 38 minutes to
            approximately 2 minutes. Dual master&apos;s degrees (MBA and MS Computer Science). Bilingual: English and Spanish.
          </p>
        </div>

        {/* ═══ Experience ═══ */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-6">Professional Experience</h2>
          <div className="space-y-10">

            {/* ── Self-Employed / Zavvis ── */}
            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Senior Data Platform Architect/Engineer</h3>
                  <p className="text-blue-400 text-sm">Financial Data Startup (Founding Technical Equity Partner) &amp; Independent Portfolio Projects</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">April 2026 — Present</span>
              </div>

              <p className="text-slate-500 text-xs uppercase tracking-wide mt-5 mb-2 font-semibold">Production Azure Databricks Pipeline — Financial Accounting Data (GL, AR, AP)</p>
              <ul className="text-slate-400 text-sm space-y-1.5 mb-5">
                <li>→ Re-engineered approximately 50 sequential production notebooks into a modular, source-controlled DAB project with parameterized dev/prod deployment targets across separate Unity Catalog catalogs, reducing end-to-end pipeline runtime from 1 hour 38 minutes to approximately 2 minutes</li>
                <li>→ Built the full Bronze/Silver/Gold medallion architecture using Lakeflow Declarative Pipelines (DLT) with Auto Loader ingestion from ADLS Gen2 and declarative data quality enforcement, processing GL, AR, and AP financial transaction data</li>
                <li>→ Designed and implemented a 26-column Gold-layer Metric Mart (materialized view) computing revenue, expense, vendor cost, AR/AP balances, aging buckets, DSO, DPO, and cash metrics with inline enrichment: trailing 8-week baselines, deviation scoring (delta_abs, delta_pct), and materiality calculations, all computed within the DLT pipeline refresh</li>
                <li>→ Built a Silver-layer Class B evidence framework: 14 event, profile, and baseline views providing audit-grade traceability for every financial transformation, plus a mapping stability tracker detecting account classification drift across pipeline runs</li>
                <li>→ Implemented a pytest-based validation suite automating full legacy-versus-new equivalence checks across all 223 shared reporting keys, asserting zero accounting-logic differences as a repeatable regression gate prior to production cutover</li>
                <li>→ Diagnosed and resolved Unity Catalog storage infrastructure gaps blocking all pipeline execution: provisioned an Azure Databricks access connector with managed identity, created storage credentials, and repointed external locations, restoring ADLS Gen2 ingestion</li>
                <li>→ Conducted a comprehensive legacy codebase audit, remediating critical defects including silent data corruption in shared null-handling utilities, GROUP BY aggregation errors, canonical account mapping defects, and revenue/expense sign-convention bugs</li>
                <li>→ Built a State Memory baseline engine computing statistical baselines (mean, median, std dev, percentiles, trend slope, seasonality, cadence, structural stability) from the Metric Mart for anomaly scoring</li>
              </ul>

              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">Independent Portfolio Projects — jpcenterprises.com</p>
              <ul className="text-slate-400 text-sm space-y-1.5 mb-5">
                <li>→ Built an end-to-end Databricks data lakehouse for JDE Aerospace ERP data using DLT with a full medallion architecture, SCD Type 2 change data capture via APPLY CHANGES INTO, DLT Expectations for data quality enforcement, and Unity Catalog governance with role-based access control; achieved 96% Photon engine execution with zero disk spill</li>
                <li>→ Architected and deployed a full open-source data platform: Python/Node.js extraction into PostgreSQL, dbt Core modeling with Kimball dimensional techniques, Apache Airflow orchestration, and a Next.js/Fastify reporting stack, live in production</li>
                <li>→ Built LLM-powered data pipelines using n8n and PostgreSQL for automated SEC EDGAR filing analysis and an AI-driven RFQ intake system with master data validation</li>
                <li>→ Engineered an MDM foundation using Splink probabilistic record linkage in Python, resolving cross-ERP customer entities into golden records with API endpoints and dashboard pages</li>
              </ul>
            </div>

            {/* ── Incora ── */}
            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Chief Data Architect/Engineer</h3>
                  <p className="text-blue-400 text-sm">Incora (formerly Wesco Aircraft) · Valencia, CA</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">August 2006 — March 2026</span>
              </div>

              <p className="text-slate-500 text-xs uppercase tracking-wide mt-5 mb-2 font-semibold">Azure Databricks &amp; Cloud Platform</p>
              <ul className="text-slate-400 text-sm space-y-1.5 mb-5">
                <li>→ Served as Chief Data Architect for a global aerospace distributor with 3 ERP systems (JD Edwards/DB2, tcmIS/Oracle, GEAC/DB2), leading cloud migration of heterogeneous financial transaction data (GL, AR, AP, sales orders, inventory) into a unified Azure Databricks data lakehouse with Delta Lake</li>
                <li>→ Authored Spark SQL transformations migrating legacy SSIS and Cognos ETL into Databricks medallion pipelines, processing billions of financial transaction rows into canonical Bronze/Silver/Gold schemas</li>
                <li>→ Designed medallion architecture data pipelines using Spark SQL and Databricks Workflows, transforming raw ERP financial objects into canonical schemas supporting Finance, SIOP, and compliance reporting at enterprise scale</li>
              </ul>

              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">Data Architecture, Financial Normalization &amp; Governance</p>
              <ul className="text-slate-400 text-sm space-y-1.5 mb-5">
                <li>→ Led a full Kimball dimensional model redesign during the 2014 Haas merger migration from Cognos to QlikView, normalizing financial data from acquired ERP systems into a unified data warehouse schema that remains the backbone of Finance and SIOP reporting more than a decade later</li>
                <li>→ Built cross-system reconciliation frameworks validating transactional integrity between ERP sources: row count reconciliation, referential integrity checks, primary key uniqueness validation, and GL-to-subledger balancing across JDE and tcmIS</li>
                <li>→ Established enterprise data governance standards including data dictionaries, process/data flow documentation, and naming conventions</li>
              </ul>

              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">MS SQL Server, ETL &amp; Pipeline Engineering</p>
              <ul className="text-slate-400 text-sm space-y-1.5 mb-5">
                <li>→ Hands-on SQL Server developer and administrator across a 20-year tenure, managing multiple production instances through five major version migrations (2005 through 2022); authored thousands of stored procedures, functions, and complex T-SQL transformations</li>
                <li>→ Re-engineered a legacy Cognos ETL pipeline running 8+ hours daily into an optimized SSIS solution completing in under 30 minutes (94% reduction), then migrated to Azure Databricks for scalable processing</li>
                <li>→ Lead technical resource for PwC and external audit/consulting engagements, delivering audit-grade financial data with full traceability and provenance</li>
              </ul>

              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">BI, Reporting &amp; Applications</p>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Led enterprise migration from Cognos to QlikView/Qlik Sense, designing underlying dimensional models and establishing self-service reporting standards for Finance, SIOP, and executive leadership</li>
                <li>→ Designed and built a mission-critical .NET C# / JavaScript web application for Boeing&apos;s 787 Dreamliner tooling program, replacing disparate booth interfaces with a unified JDE DB2-integrated system</li>
                <li>→ Engineered real-time warehouse StatusBoard applications deployed across worldwide distribution facilities; developed a multi-customer web portal providing real-time visibility into order status, inventory, and consignment data</li>
                <li>→ Recovered millions of zeroed F4211 pricing records in approximately two hours by reconstructing correct values from F42199 history; built bidirectional JDE integrations for post-acquisition systems</li>
              </ul>
            </div>

            {/* ── Disney ── */}
            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Data &amp; Application Consultant</h3>
                  <p className="text-blue-400 text-sm">The Walt Disney Company · Burbank, CA</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">2005 — 2006</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Contributed to a $50M+ enterprise PowerBuilder/Sybase-to-Java/DB2 migration, responsible for data transformation logic using T-SQL and VB.NET, and development of views and stored procedures supporting re-platforming of mission-critical business systems</li>
              </ul>
            </div>

            {/* ── Jaguar ── */}
            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Software Developer, Consultant</h3>
                  <p className="text-blue-400 text-sm">Jaguar Consulting</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">2002 — 2005</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Built a multi-tenant Rights Management platform serving NBA, WNBA, MLB, Hallmark, National Geographic, NBC Enterprises, MGM, Lionsgate, and others, handling inventory, royalties, and accounting via a robust 3-tier architecture using VB.NET and T-SQL</li>
              </ul>
            </div>

            {/* ── Learning Tree ── */}
            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Information Technology Instructor</h3>
                  <p className="text-blue-400 text-sm">Learning Tree University · Chatsworth, CA</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">2000 — 2002</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Taught Microsoft Visual C++, C Programming (Basics and Advanced), and software engineering principles at the collegiate level</li>
              </ul>
            </div>

            {/* ── 800 Direct ── */}
            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">IT Manager</h3>
                  <p className="text-blue-400 text-sm">800 Direct, Inc. / CyberRep.com</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">1999 — 2002</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Managed IT operations across two California telecenters (400+ workstations, team of 12), overseeing mission-critical applications for 30+ clients and modernizing legacy Clipper systems to Visual Basic 6.0, SQL Server, and web-based architectures</li>
              </ul>
            </div>

          </div>
        </div>

        {/* ═══ Core Competencies ═══ */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Core Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Cloud &amp; Data</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Azure Databricks","Delta Lake","Unity Catalog","DAB","Lakeflow/DLT","Structured Streaming","Photon","Auto Loader","CDF","Schema Evolution","Serverless","ADF","Synapse","ADLS Gen2"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Languages &amp; Pipelines</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Python","PySpark","Spark SQL","T-SQL","pytest","DAB CI/CD","Lakeflow DLT","dbt Core","Apache Airflow","SSIS","n8n"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">MS SQL Server</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["SQL Server 2005-2022","SSIS/SSISDB","SSRS","T-SQL (SPs, CTEs, window functions, MERGE)","Execution Plan Analysis","Agent Scheduling"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Architecture</p>
              <div className="flex flex-wrap gap-2">
                {["Kimball Dimensional Modeling","Medallion (Bronze/Silver/Gold)","Data Lakehouse","Data Governance","Lineage","Evidence/Audit Layer","MDM","Star Schema","SCD Type 2","CDC"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Financial / ERP</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["GL, AR, AP, Sales Orders","Multi-ERP Normalization","JDE, GEAC, tcmIS, QuickBooks","Cross-System Reconciliation","Audit-Grade Pipelines","PwC Compliance"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">AI / LLM</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["LLM-Powered Data Pipelines","SEC EDGAR Filing Analysis","AI-Driven Email Parsing","RFQ Classification"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Databases</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["PostgreSQL","MS SQL Server","DB2","Oracle PL/SQL","Spark SQL"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">BI &amp; Reporting</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Databricks AI/BI Dashboards","Genie Spaces","SSRS","Qlik Sense","QlikView","Power BI","Cognos"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Application Development</p>
              <div className="flex flex-wrap gap-2">
                {["C# .NET","ASP.NET","Next.js","React","Node.js","Git","Azure DevOps","CI/CD","Docker"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Education ═══ */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-6">Education</h2>
          <div className="space-y-4">
            {[
              { degree: "Master of Business Administration (MBA)", school: "California State University, Northridge" },
              { degree: "Master of Science, Computer Science", school: "California State University, Northridge" },
              { degree: "Bachelor of Science, Biology", school: "California State University, Northridge" },
            ].map(e => (
              <div key={e.degree} className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{e.degree}</p>
                  <p className="text-blue-400 text-sm">{e.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Certifications ═══ */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Certifications &amp; Training</h2>
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-semibold">Databricks</p>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ <span className="text-orange-300 font-semibold">Certified Data Engineer Associate</span> — July 2026</li>
                <li>→ <span className="text-orange-300">Academy Accreditations:</span> Databricks Fundamentals, Data Governance Fundamentals</li>
                <li>→ <span className="text-orange-300">Knowledge Badges (8):</span> Lakeflow Spark Declarative Pipelines, DAB, Lakeflow Jobs, Lakeflow Connect, Performance Optimization, Data Privacy, DevOps Essentials, Data Preparation for ML</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-semibold">Other</p>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ <span className="text-slate-300">dbt Fundamentals Certification</span> — dbt Labs, 2026</li>
                <li>→ <span className="text-slate-300">IBM Cognos Data Manager Certification</span></li>
                <li>→ <span className="text-slate-300">Qlik Data Modeling for Qlik Sense</span> — 2021</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm mb-2">Interested in working together?</p>
          <a href="mailto:johnpaulcastro@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Contact JP — johnpaulcastro@gmail.com
          </a>
        </div>

      </div>
    </main>
  );
}
