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

export function ChangelogTimeline() {
  return (
    <section className="bg-[var(--lp-bg)] pb-24 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col gap-8">
          {releases.map((release) => (
            <article
              key={release.version}
              className="rounded-[18px] border border-[var(--lp-border)] bg-[var(--lp-card-bg)] p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[rgba(255,85,85,0.1)] px-3 py-1 text-xs font-bold text-[#ff5555]">
                  {release.version}
                </span>
                <time className="text-sm text-[var(--lp-text-muted)]">
                  {release.date}
                </time>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-[var(--lp-text)] md:text-xl">
                {release.title}
              </h2>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
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
