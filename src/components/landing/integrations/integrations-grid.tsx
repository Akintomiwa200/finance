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

export function IntegrationsGrid() {
  return (
    <section className="bg-[var(--lp-bg)] pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="rounded-[18px] border border-[var(--lp-border)] bg-[var(--lp-card-bg)] p-5"
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
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
          Need a custom integration?{" "}
          <a href="/contact" className="font-medium text-[#ff5555] hover:underline">
            Contact our team
          </a>{" "}
          and we&apos;ll help you connect your stack.
        </p>
      </div>
    </section>
  );
}
