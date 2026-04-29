export default function Resume() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">John Paul Castro</h1>
            <p className="text-blue-400 text-lg font-medium mb-3">Senior Data Platform & BI Architect | Modern Data Stack · Azure · dbt · Airflow · Kimball</p>
            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
              <span>📞 (818) 943-5159</span>
              <a href="mailto:johnpaulcastro@gmail.com" className="hover:text-blue-400 transition-colors">✉ johnpaulcastro@gmail.com</a>
              <a href="https://linkedin.com/in/johnpaul-castro" className="hover:text-blue-400 transition-colors">🔗 linkedin.com/in/johnpaul-castro</a>
              <span>📍 Cleveland, TN · Open to remote (US)</span>
            </div>
          </div>
          <div className="text-right">
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
            Data platform architect with 20+ years building enterprise-grade data systems in aerospace, entertainment, and
            telecommunications. I design the infrastructure that turns ERP chaos into clean, governed, decision-ready data — from legacy
            ETL pipelines to cloud-native Lakehouse architectures on Azure Databricks. Deep expertise in Kimball dimensional modeling,
            medallion architecture (Bronze/Silver/Gold), open-source data engineering (dbt Core, Apache Airflow, PostgreSQL), and
            end-to-end ERP integration (JD Edwards, GEAC, tcmIS). Dual master's degrees (MBA & MS Computer Science). Hands-on
            engineer who builds it, owns it, and delivers it. Bilingual: English and Spanish.
          </p>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Core Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Cloud & Data Platforms</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Azure Databricks","Delta Lake","Unity Catalog","DLT","Azure Data Factory","Azure Synapse Analytics","Azure App Services"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Data Architecture</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Kimball Dimensional Modeling","Medallion Architecture","Lakehouse Design","Data Governance","Data Mart & Warehouse Design"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Data Engineering</p>
              <div className="flex flex-wrap gap-2">
                {["dbt Core","Apache Airflow","SSIS 2016/2022","Databricks Workflows","Qlik Replicate","Cognos Data Manager"].map(s => (
                  <span key={s} className="bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Databases & Query Languages</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["PostgreSQL","MS SQL Server","DB2","Oracle PL/SQL","T-SQL","Spark SQL","PySpark"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">BI & Reporting</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Qlik Sense","QlikView","Power BI (Embedded)","Cognos"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Software Development</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Python","JavaScript","Node.js","React","Next.js","Clerk","Stripe","C#",".NET","HTML/CSS"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">ERP & Integration</p>
              <div className="flex flex-wrap gap-2">
                {["JD Edwards (EnterpriseOne)","GEAC","tcmIS"].map(s => (
                  <span key={s} className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-6">Experience</h2>
          <div className="space-y-8">

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Senior Data Architect — Independent / Consulting</h3>
                  <p className="text-blue-400 text-sm">Self-Employed</p>
                </div>
                <span className="text-slate-500 text-sm">2026 — Present</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Designed and built full medallion architecture platform for JDE Edwards data — Bronze extraction, Silver transformation, Gold aggregation</li>
                <li>→ Built Node.js extractors pulling from JDE SQL Server into PostgreSQL via Apache Airflow orchestration</li>
                <li>→ Implemented dbt Core models with proper naming standards, surrogate keys, and Kimball dimensional modeling</li>
                <li>→ Built an MDM (Master Data Management) layer that unifies customer records across 5 separate ERP systems using Splink probabilistic record linkage — resolving 82 duplicates from 333 source records into 251 golden customer entities</li>
                <li>→ Designed the full MDM pipeline: Node.js extraction → PostgreSQL Bronze → dbt Silver normalization → Python/Splink matching → golden record output with cross-reference mapping and consolidated sales visibility</li>
                <li>→ Deployed full stack to Railway cloud: Fastify API + Next.js dashboard + PostgreSQL</li>
              </ul>

            </div>

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Senior Data Warehouse & BI Architect</h3>
                  <p className="text-blue-400 text-sm">Incora (formerly Wesco Aircraft) · Valencia, CA</p>
                </div>
                <span className="text-slate-500 text-sm">August 2006 — March 2026</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Served as Chief Data Architect for a global aerospace distributor with 3 ERP systems (JD Edwards, tcmIS, GEAC) across multiple continents — unifying all systems into a cloud-native Azure Databricks Lakehouse with Delta Lake and Unity Catalog, supporting Finance, SIOP, and compliance reporting at enterprise scale</li>
                <li>→ Re-engineered a legacy Cognos ETL pipeline running 8+ hours daily into an optimized SSIS solution completing in under 30 minutes (94% reduction) — then migrated to Azure Databricks for real-time, scalable processing serving thousands of daily transactions</li>
                <li>→ Led a full Kimball dimensional model redesign during the 2014 Haas merger migration from Cognos to QlikView; established snake_case naming standards and a layered data architecture (gdl, jdl, tdl) that remains the backbone of Finance and SIOP reporting more than a decade later</li>
                <li>→ Recovered millions of zeroed F4211 pricing records in approximately two hours by reconstructing correct values from F42199 history — restoring critical data integrity under high-pressure conditions where all prior recovery attempts had failed</li>
                <li>→ Designed and built a mission-critical .NET C# / JavaScript web application for Boeing's 787 Dreamliner tooling program, replacing disparate booth interfaces with a unified JDE DB2-integrated system supporting tool checkout, check-in, and billing across multiple manufacturing sites</li>
                <li>→ Engineered a real-time warehouse StatusBoard application — still deployed across multiple distribution facilities — using .NET C#, JavaScript, and a Windows service polling JDE; delivers live visibility into picker performance, aisle status, and priority orders</li>
                <li>→ Established enterprise data governance standards and authored complex T-SQL, DB2, Oracle PL/SQL, and PySpark/Spark SQL transformations processing billions of rows in high-transaction, real-time workloads</li>
                <li>→ Built and maintained bidirectional JDE integrations for post-acquisition systems; developed custom compliance-reporting automation for Bombardier and a multi-customer web portal delivering real-time inventory and consignment visibility</li>
                <li>→ Served as primary SQL expert across MS SQL, DB2, and Oracle; lead data resource for PwC and external audit/consulting engagements; owned JDE PY and DEV environment refreshes</li>
              </ul>
            </div>

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Data & Application Consultant</h3>
                  <p className="text-blue-400 text-sm">The Walt Disney Company</p>
                </div>
                <span className="text-slate-500 text-sm">2005 — 2006</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Contributed to a $50M+ enterprise PowerBuilder/Sybase-to-Java/DB2 migration; responsible for data transformation logic using T-SQL and ADO.NET, and development of views and stored procedures</li>
              </ul>
            </div>

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Software Developer — Consultant</h3>
                  <p className="text-blue-400 text-sm">Jaguar Consulting</p>
                </div>
                <span className="text-slate-500 text-sm">2002 — 2005</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Built a multi-tenant Rights Management platform serving NBA, WNBA, MLB, Hallmark, National Geographic, NBC Enterprises, MGM, Lionsgate, and others — handling inventory, royalties, and accounting via a robust 3-tier VB.NET/ASP/Sybase/T-SQL architecture</li>
              </ul>
            </div>

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">Information Technology Instructor</h3>
                  <p className="text-blue-400 text-sm">Learning Tree University · Chatsworth, CA</p>
                </div>
                <span className="text-slate-500 text-sm">2000 — 2002</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Taught Microsoft Visual C++, C Programming (Basics and Advanced), and software engineering principles at the collegiate level</li>
              </ul>
            </div>

            <div className="relative pl-6 border-l border-slate-700">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-500 rounded-full"></div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">IT Manager</h3>
                  <p className="text-blue-400 text-sm">800 Direct, Inc. / CyberRep.com</p>
                </div>
                <span className="text-slate-500 text-sm">1999 — 2002</span>
              </div>
              <ul className="text-slate-400 text-sm space-y-1.5">
                <li>→ Managed IT operations across two California telecenters (400+ workstations, team of 12), overseeing mission-critical applications for 30+ clients and modernizing legacy Clipper systems to Visual Basic 6.0, SQL Server, and web-based architectures</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Education */}
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

        {/* Certifications */}
        <div className="mb-10">
          <h2 className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Certifications & Training</h2>
          <ul className="text-slate-400 text-sm space-y-2">
            <li>→ <span className="text-slate-300">dbt Fundamentals Certification</span> — dbt Labs <span className="text-slate-500"></span></li>
            <li>→ <span className="text-slate-300">IBM Cognos Data Manager Certification</span></li>
            <li>→ <span className="text-slate-300">Qlik Data Modeling for Qlik Sense</span> — 2021</li>
            <li>→ <span className="text-slate-300">Cognos Report Studio & Data Manager Training</span> — 2013–2015</li>
          </ul>
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
