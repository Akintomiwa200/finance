import { LandingImageHero } from "@/src/components/landing/shared/landing-image-hero";

const heroImages = {
  main: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1563013547-824ae1b704d3?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=680&h=440&fit=crop&q=80",
};

export function IntegrationsHero() {
  return (
    <LandingImageHero
      title="Connect Audpay to"
      highlight="your entire stack."
      subtitle="Sync accounting, banking, payments, and productivity tools so your financial data stays in one place."
      images={heroImages}
      alt={{
        main: "Financial dashboard with integrations",
        top: "Payment processing on screen",
        bottom: "Analytics and reporting tools",
      }}
    />
  );
}

export const integrationsStats = [
  { value: "50+", label: "Native integrations" },
  { value: "2-way", label: "Data sync" },
  { value: "API", label: "For custom builds" },
  { value: "Zapier", label: "Automation ready" },
];

export const integrationsFaq = [
  {
    question: "How do integrations sync data?",
    category: "Sync",
    preview: "Real-time and scheduled sync options",
    answer:
      "Most integrations support real-time webhooks. Others sync on a schedule you configure. All sync activity is logged for audit purposes.",
  },
  {
    question: "Can I build a custom integration?",
    category: "Developers",
    preview: "REST API and webhooks available",
    answer:
      "Yes. Audpay offers a full REST API and webhook system. Visit our API settings or contact sales for enterprise integration support.",
  },
  {
    question: "Are integrations included in all plans?",
    category: "Pricing",
    preview: "Core integrations on every plan",
    answer:
      "Standard integrations are included on all paid plans. Premium connectors and custom integrations may require Professional or Enterprise tiers.",
  },
];

const integrations = [
  {
    name: "QuickBooks",
    category: "Accounting",
    description: "Sync invoices, expenses, and chart of accounts in both directions.",
  },
  {
    name: "Stripe",
    category: "Payments",
    description: "Reconcile online payments automatically with your ledger entries.",
  },
  {
    name: "Plaid",
    category: "Banking",
    description: "Connect bank accounts securely for real-time transaction feeds.",
  },
  {
    name: "Slack",
    category: "Collaboration",
    description: "Get alerts for approvals, overdue invoices, and budget thresholds.",
  },
  {
    name: "Google Workspace",
    category: "Productivity",
    description: "Export reports and share financial summaries with your team.",
  },
  {
    name: "Xero",
    category: "Accounting",
    description: "Migrate and sync data for teams switching or running dual systems.",
  },
  {
    name: "PayPal",
    category: "Payments",
    description: "Track PayPal payouts alongside card and bank transactions.",
  },
  {
    name: "Zapier",
    category: "Automation",
    description: "Build custom workflows between Audpay and thousands of other apps.",
  },
];

export function IntegrationsGridSection() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
            Works with the tools you <span className="font-bold">already use</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            Connect your accounting, banking, and productivity stack without
            manual exports or duplicate data entry.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {integrations.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 shadow-[var(--lp-team-card-shadow)] sm:px-6 sm:py-6"
            >
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
                {item.category}
              </span>
              <h3 className="mt-3 text-base font-semibold text-[var(--lp-text)]">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[18px] md:mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80"
            alt="Integration dashboard overview"
            className="h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
