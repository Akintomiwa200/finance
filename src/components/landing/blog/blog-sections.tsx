import { LandingImageHero } from "@/src/components/landing/shared/landing-image-hero";

const heroImages = {
  main: "https://images.unsplash.com/photo-1456324504439-367ceeef855f?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1499750310107-5fef28fd660f?w=680&h=440&fit=crop&q=80",
};

export function BlogHero() {
  return (
    <LandingImageHero
      title="Insights for"
      highlight="modern finance teams."
      subtitle="Product updates, accounting tips, and guides to help you run a healthier business."
      images={heroImages}
      alt={{
        main: "Person reading finance articles on laptop",
        top: "Notebook and coffee on desk",
        bottom: "Team reviewing business metrics",
      }}
    />
  );
}

export const blogStats = [
  { value: "120+", label: "Published articles" },
  { value: "Weekly", label: "New content" },
  { value: "6", label: "Expert categories" },
  { value: "50K+", label: "Monthly readers" },
];

export const blogFaq = [
  {
    question: "How often do you publish?",
    category: "Content",
    preview: "New articles every week",
    answer:
      "We publish new articles weekly covering product updates, finance operations, tax tips, and growth strategies for SMBs.",
  },
  {
    question: "Can I subscribe to the blog?",
    category: "Newsletter",
    preview: "Get posts in your inbox",
    answer:
      "Yes. Subscribe via the footer newsletter to receive highlights and new posts directly in your inbox.",
  },
  {
    question: "Do you accept guest contributions?",
    category: "Community",
    preview: "Pitch us your finance story",
    answer:
      "We occasionally feature guest authors from the finance and accounting community. Reach out via our contact page with your pitch.",
  },
];

const posts = [
  {
    title: "5 Cash Flow Metrics Every SMB Should Track",
    category: "Finance Tips",
    date: "Mar 12, 2026",
    excerpt:
      "Learn the key indicators that help growing businesses stay liquid and make smarter spending decisions.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=420&fit=crop&q=80",
  },
  {
    title: "How to Close Your Books Faster Each Month",
    category: "Accounting",
    date: "Feb 28, 2026",
    excerpt:
      "A practical checklist for finance teams who want cleaner month-end closes without adding headcount.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&h=420&fit=crop&q=80",
  },
  {
    title: "Introducing Real-Time Bank Reconciliation",
    category: "Product",
    date: "Feb 14, 2026",
    excerpt:
      "Audpay now matches transactions automatically so your team spends less time on manual reconciliation.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=420&fit=crop&q=80",
  },
  {
    title: "Building a Finance Stack That Scales",
    category: "Guides",
    date: "Jan 30, 2026",
    excerpt:
      "From invoicing to reporting — how to choose tools that grow with your business instead of slowing it down.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=420&fit=crop&q=80",
  },
  {
    title: "Tax Season Prep: A 30-Day Countdown Plan",
    category: "Tax",
    date: "Jan 18, 2026",
    excerpt:
      "Stay organized before deadlines hit with this step-by-step plan for founders and finance leads.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d0423c7c4e2?w=640&h=420&fit=crop&q=80",
  },
  {
    title: "Why We Built Audpay for Modern Finance Teams",
    category: "Company",
    date: "Jan 5, 2026",
    excerpt:
      "Our founding story and the problems we set out to solve for businesses tired of fragmented financial tools.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=640&h=420&fit=crop&q=80",
  },
];

export function BlogPostsSection() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="overflow-hidden rounded-[18px] border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] shadow-[var(--lp-team-card-shadow)]"
            >
              <div className="h-[180px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
                    {post.category}
                  </span>
                  <time className="text-xs text-[var(--lp-text-muted)]">
                    {post.date}
                  </time>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug text-[var(--lp-text)]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
