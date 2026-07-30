const posts = [
  {
    title: "5 Cash Flow Metrics Every SMB Should Track",
    category: "Finance Tips",
    date: "Mar 12, 2026",
    excerpt:
      "Learn the key indicators that help growing businesses stay liquid and make smarter spending decisions.",
  },
  {
    title: "How to Close Your Books Faster Each Month",
    category: "Accounting",
    date: "Feb 28, 2026",
    excerpt:
      "A practical checklist for finance teams who want cleaner month-end closes without adding headcount.",
  },
  {
    title: "Introducing Real-Time Bank Reconciliation",
    category: "Product",
    date: "Feb 14, 2026",
    excerpt:
      "Audpay now matches transactions automatically so your team spends less time on manual reconciliation.",
  },
  {
    title: "Building a Finance Stack That Scales",
    category: "Guides",
    date: "Jan 30, 2026",
    excerpt:
      "From invoicing to reporting — how to choose tools that grow with your business instead of slowing it down.",
  },
  {
    title: "Tax Season Prep: A 30-Day Countdown Plan",
    category: "Tax",
    date: "Jan 18, 2026",
    excerpt:
      "Stay organized before deadlines hit with this step-by-step plan for founders and finance leads.",
  },
  {
    title: "Why We Built Audpay for Modern Finance Teams",
    category: "Company",
    date: "Jan 5, 2026",
    excerpt:
      "Our founding story and the problems we set out to solve for businesses tired of fragmented financial tools.",
  },
];

export function BlogPosts() {
  return (
    <section className="bg-[var(--lp-bg)] pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col rounded-[18px] border border-[var(--lp-border)] bg-[var(--lp-card-bg)] p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
                  {post.category}
                </span>
                <time className="text-xs text-[var(--lp-text-muted)]">
                  {post.date}
                </time>
              </div>
              <h2 className="mt-4 text-lg font-semibold leading-snug text-[var(--lp-text)]">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
                {post.excerpt}
              </p>
              <span className="mt-5 text-sm font-medium text-[#ff5555]">
                Read article →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
