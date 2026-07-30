type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalBodySection({
  lastUpdated,
  intro,
  sections,
}: {
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm text-[var(--lp-text-muted)]">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-6 text-[15px] leading-[1.8] text-[var(--lp-text-muted)] md:text-base">
            {intro}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 shadow-[var(--lp-team-card-shadow)] sm:px-6 sm:py-6"
            >
              <h2 className="text-base font-semibold text-[var(--lp-text)] md:text-lg">
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-relaxed text-[var(--lp-text-muted)] md:text-[15px] md:leading-[1.8]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
