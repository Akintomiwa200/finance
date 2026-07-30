import { LandingImageHero } from "@/src/components/landing/shared/landing-image-hero";

const heroImages = {
  main: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=680&h=440&fit=crop&q=80",
};

export function ChangelogHero() {
  return (
    <LandingImageHero
      title="What's new in"
      highlight="Audpay."
      subtitle="Follow the latest features, improvements, and fixes as we ship updates to the platform."
      images={heroImages}
      alt={{
        main: "Product update on financial dashboard",
        top: "Developer shipping new features",
        bottom: "Team reviewing release notes",
      }}
    />
  );
}

export const changelogStats = [
  { value: "Weekly", label: "Product releases" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "Zero", label: "Downtime deploys" },
  { value: "Public", label: "Release notes" },
];

export const changelogFaq = [
  {
    question: "How often does Audpay ship updates?",
    category: "Releases",
    preview: "Continuous delivery with weekly highlights",
    answer:
      "We deploy improvements continuously and publish summarized release notes weekly for major features and fixes.",
  },
  {
    question: "Will updates disrupt my workflow?",
    category: "Stability",
    preview: "Zero-downtime deployments",
    answer:
      "Audpay uses zero-downtime deployments. Critical fixes roll out without interrupting your day-to-day accounting work.",
  },
  {
    question: "Can I request a feature?",
    category: "Feedback",
    preview: "Share ideas via contact or support",
    answer:
      "Absolutely. Use the contact page or in-app support to submit feature requests. Popular requests are prioritized on our public roadmap.",
  },
];

const releases = [
  {
    version: "v2.8.0",
    date: "Mar 10, 2026",
    title: "Real-time bank reconciliation",
    items: [
      "Automatic transaction matching with smart rules",
      "Improved bank feed reliability and error handling",
      "New reconciliation dashboard for finance teams",
    ],
  },
  {
    version: "v2.7.2",
    date: "Feb 22, 2026",
    title: "Reporting improvements",
    items: [
      "Export P&L and balance sheet to Excel and PDF",
      "Custom date ranges saved per report",
      "Faster load times on large datasets",
    ],
  },
  {
    version: "v2.7.0",
    date: "Feb 3, 2026",
    title: "Multi-currency support",
    items: [
      "Invoice and bill in multiple currencies",
      "Automatic exchange rate updates",
      "Currency gain/loss tracking in ledger",
    ],
  },
  {
    version: "v2.6.1",
    date: "Jan 15, 2026",
    title: "Approval workflows",
    items: [
      "Configurable approval chains for expenses and bills",
      "Email and in-app notifications for pending items",
      "Audit trail for every approval action",
    ],
  },
];

export function ChangelogTimelineSection() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
            Recent <span className="font-bold">releases</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            A running log of what we have shipped — from major features to
            performance improvements.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {releases.map((release) => (
            <article
              key={release.version}
              className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 shadow-[var(--lp-team-card-shadow)] sm:px-6 sm:py-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[rgba(255,85,85,0.1)] px-3 py-1 text-xs font-bold text-[#ff5555]">
                  {release.version}
                </span>
                <time className="text-sm text-[var(--lp-text-muted)]">
                  {release.date}
                </time>
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--lp-text)] md:text-lg">
                {release.title}
              </h3>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-[var(--lp-text-muted)] md:text-[15px]">
                {release.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
