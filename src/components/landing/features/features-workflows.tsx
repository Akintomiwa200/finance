const workflows = [
  {
    title: "Close books faster",
    description: "Automate reconciliations and journal entries at month-end.",
  },
  {
    title: "Approve with confidence",
    description: "Route bills and expenses through customizable approval chains.",
  },
  {
    title: "Report in real time",
    description: "Share live dashboards with leadership and stakeholders.",
  },
  {
    title: "Scale globally",
    description: "Manage multi-entity, multi-currency operations from one hub.",
  },
];

export function FeaturesWorkflows() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
            Built for <span className="font-bold">modern</span> finance teams.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            Whether you are a startup controller or an enterprise CFO, Audpay
            adapts to how your team works — not the other way around.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {workflows.map((item) => (
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
            alt="Finance team reviewing reports together"
            className="h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
