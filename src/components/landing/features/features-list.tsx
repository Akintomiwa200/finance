const features = [
  {
    title: "Smart Invoicing",
    category: "Receivables",
    preview: "Automate bills and track payments",
    description:
      "Create professional invoices in seconds. Automate recurring bills, set payment reminders, and track payment status in real-time. Supports multiple currencies and tax configurations.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=760&fit=crop&q=80",
  },
  {
    title: "General Ledger",
    category: "Accounting",
    preview: "Double-entry books with audit trails",
    description:
      "Maintain a complete, auditable record of every financial transaction. Our double-entry bookkeeping system ensures accuracy with automatic journal entries and real-time balance updates.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&h=760&fit=crop&q=80",
  },
  {
    title: "Accounts Payable",
    category: "Payables",
    preview: "Vendor bills and approval workflows",
    description:
      "Manage vendors, track bills, process payments, and maintain healthy vendor relationships. Automated 3-way matching and approval workflows keep your payables process efficient.",
    image:
      "https://images.unsplash.com/photo-1563013547-824ae1b704d3?w=640&h=760&fit=crop&q=80",
  },
  {
    title: "Financial Reporting",
    category: "Reporting",
    preview: "P&L, balance sheet, and custom reports",
    description:
      "Generate balance sheets, profit & loss statements, trial balances, and custom reports with a single click. Schedule automated reports and share them with stakeholders.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=760&fit=crop&q=80",
  },
  {
    title: "Budget Management",
    category: "Planning",
    preview: "Track variances and forecast spend",
    description:
      "Set departmental budgets, track variances in real-time, and forecast future spending. Get alerts before you exceed thresholds and make data-driven budget decisions.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=760&fit=crop&q=80",
  },
  {
    title: "Multi-Currency & Compliance",
    category: "Global",
    preview: "150+ currencies and tax compliance",
    description:
      "Operate globally with support for 150+ currencies, automatic exchange rates, and built-in tax compliance reporting for multiple jurisdictions.",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=640&h=760&fit=crop&q=80",
  },
];

function FeatureCard({
  feature,
  reverse = false,
}: {
  feature: (typeof features)[number];
  reverse?: boolean;
}) {
  const textBlock = (
    <div className="flex flex-col justify-between px-6 py-7 sm:px-8 sm:py-8 md:min-h-[320px] md:px-10 md:py-10 lg:min-h-[360px]">
      <div>
        <p className="text-base font-bold text-[var(--lp-text)] sm:text-lg">
          {feature.category}
        </p>
        <p className="mt-4 text-[14px] leading-[1.75] text-[var(--lp-text-muted)] sm:text-[15px] md:text-base md:leading-[1.8]">
          {feature.description}
        </p>
      </div>

      <div className="relative mt-8 border-t border-[var(--lp-faq-row-border)] pt-5 sm:mt-10 sm:pt-6">
        <p className="text-[15px] font-bold text-[var(--lp-text)] sm:text-base">
          {feature.title}
        </p>
        <p className="mt-1 text-sm text-[var(--lp-text-muted)]">
          {feature.preview}
        </p>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative min-h-[240px] sm:min-h-[280px] md:min-h-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={feature.image}
        alt={feature.title}
        className={`h-full w-full object-cover rounded-b-[18px] md:rounded-b-none ${
          reverse
            ? "md:rounded-l-[18px] md:rounded-r-none"
            : "md:rounded-r-[18px] md:rounded-l-none"
        }`}
      />
    </div>
  );

  return (
    <article className="overflow-hidden rounded-[18px] bg-[var(--lp-faq-row-bg)] transition-colors duration-300">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {textBlock}
        {imageBlock}
      </div>
    </article>
  );
}

export function FeaturesList() {
  return (
    <section className="bg-[var(--lp-team-section-bg)] py-16 transition-colors duration-300 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff5555] md:text-xs">
            Platform
          </p>
          <h2 className="mt-3 text-[1.625rem] font-normal tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem]">
            Powerful <span className="font-bold">features</span> built in.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
            From invoicing to reporting, Audpay gives finance teams every tool
            they need without switching between apps.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:gap-5">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
