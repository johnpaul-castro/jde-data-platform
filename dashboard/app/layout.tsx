import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JDE Data Platform",
  description: "JDE Operations Dashboard — Built by JP Castro",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className + " min-h-screen bg-slate-950 text-white"}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-10 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
