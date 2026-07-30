const benefits = [
  {
    title: "Start free, upgrade when ready",
    description:
      "Every plan begins with a full-featured trial. Explore Audpay with no credit card required.",
  },
  {
    title: "Core accounting on every plan",
    description:
      "Invoicing, ledger, reconciliation, and reporting are included from day one.",
  },
  {
    title: "Scale users as you grow",
    description:
      "Add team members, roles, and permissions without switching platforms.",
  },
  {
    title: "Enterprise when you need it",
    description:
      "Custom integrations, SSO, dedicated support, and SLA options for larger teams.",
  },
];

export function PricingBenefits() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
            Built to <span className="font-bold">scale</span> with you.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            Whether you are a solo founder or a finance team of fifty, Audpay
            pricing grows with your business — not against it.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 shadow-[var(--lp-team-card-shadow)] transition-colors duration-300 sm:px-6 sm:py-6"
            >
              <h3 className="text-base font-semibold text-[var(--lp-text)]">
                {item.title}
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
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop&q=80"
            alt="Team collaborating on financial planning"
            className="h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
