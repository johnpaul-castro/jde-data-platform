import Link from "next/link";

const posts = [
  {
    slug: "splink-mdm",
    title: "How I Unified 5 ERPs into Golden Customer Records with Splink",
    excerpt: "When five separate ERP systems each have their own version of \"Boeing,\" you need more than a VLOOKUP. Here is how I used probabilistic record linkage to resolve 82 duplicates from 333 source records into 251 golden customer entities.",
    date: "July 2026",
    tags: ["MDM", "Splink", "Python", "Record Linkage"],
    readTime: "8 min read",
  },
  {
    slug: "databricks-lakehouse",
    title: "Re-engineering 50 Notebooks into a 2-Minute DAB Pipeline on Databricks",
    excerpt: "A financial data startup had a production pipeline built from approximately 50 sequential notebooks running for over 90 minutes. I rebuilt it as a modular DAB project with Lakeflow DLT, cutting runtime to under 2 minutes with zero accounting differences.",
    date: "June 2026",
    tags: ["Databricks", "DAB", "Lakeflow DLT", "Unity Catalog"],
    readTime: "10 min read",
  },
  {
    slug: "dbt-core-vs-cloud",
    title: "Why I Chose dbt Core over dbt Cloud for This Project",
    excerpt: "dbt Cloud is excellent, but it was not the right fit for a self-hosted data platform on Railway with PostgreSQL. Here is how I evaluated both options, what tipped the decision, and what I would choose differently for a Databricks-native stack.",
    date: "May 2026",
    tags: ["dbt", "Architecture", "Open Source", "Decision Record"],
    readTime: "6 min read",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Case Studies</p>
          <h1 className="text-3xl font-bold text-white mb-3">Engineering Blog</h1>
          <p className="text-slate-400">
            Technical write-ups from real projects. Each post covers a decision I made, why I made it,
            and what the outcome looked like in production.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/70 transition-all group">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{post.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
