const perks = [
  "Competitive salary and equity options",
  "Remote-first culture with flexible hours",
  "Health, dental, and vision coverage",
  "Learning budget for courses and conferences",
  "Generous paid time off and parental leave",
];

export function CareersPerks() {
  return (
    <section className="border-t border-[var(--lp-border)] bg-[var(--lp-bg)] pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-xl font-semibold text-[var(--lp-text)] md:text-2xl">
          Why work at Audpay
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {perks.map((perk) => (
            <li
              key={perk}
              className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card-bg)] px-5 py-4 text-[15px] leading-relaxed text-[var(--lp-text-muted)]"
            >
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
