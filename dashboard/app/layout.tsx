import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JP Castro | Senior Data Architect Portfolio",
  description: "Live data platform portfolio by JP Castro. Medallion architecture, Azure Databricks, Lakeflow DLT, Unity Catalog, Kimball dimensional modeling, Splink MDM, and AI-powered pipelines. 25+ years in aerospace, entertainment, and enterprise data engineering.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "JP Castro | Senior Data Architect & Engineer",
    description: "25+ years building enterprise data systems. Azure Databricks, Kimball, dbt, Airflow. Live portfolio with running dashboards, MDM, and AI-powered pipelines.",
    url: "https://jpcenterprises.com",
    siteName: "JP Castro Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JP Castro | Senior Data Architect & Engineer",
    description: "25+ years building enterprise data systems. Live portfolio with Azure Databricks, Kimball dimensional modeling, and AI-powered pipelines.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try { if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light'); } catch(e) {}
        `}} />
      </head>
      <body className={geist.className + " min-h-screen bg-slate-950 text-white"}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-10 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
