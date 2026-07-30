type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LandingLegalDocumentProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export function LandingLegalDocument({
  title,
  lastUpdated,
  intro,
  sections,
}: LandingLegalDocumentProps) {
  return (
    <section className="bg-[var(--lp-bg)] pb-24 pt-[120px] md:pb-32 md:pt-[148px]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-[2rem] font-semibold tracking-tight text-[var(--lp-text)] md:text-[2.5rem]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[var(--lp-text-muted)]">
          Last updated: {lastUpdated}
        </p>

        <div className="h-8 shrink-0" aria-hidden="true" />

        <p className="text-[15px] leading-[1.8] text-[var(--lp-text-muted)] md:text-base">
          {intro}
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-[var(--lp-text)] md:text-xl">
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-[15px] leading-[1.8] text-[var(--lp-text-muted)] md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
