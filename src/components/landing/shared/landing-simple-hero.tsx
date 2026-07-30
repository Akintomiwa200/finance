type LandingSimpleHeroProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
};

export function LandingSimpleHero({
  title,
  highlight,
  subtitle,
}: LandingSimpleHeroProps) {
  return (
    <section className="bg-[var(--lp-bg)] pt-[120px] md:pt-[148px]">
      <div className="mx-auto max-w-3xl px-6 pb-12 text-center md:pb-16">
        <h1 className="text-[2.125rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--lp-text)] sm:text-[2.625rem] md:text-[3rem]">
          {title}{" "}
          {highlight ? <span className="font-bold">{highlight}</span> : null}
        </h1>
        {subtitle ? (
          <>
            <div className="h-5 shrink-0" aria-hidden="true" />
            <p className="mx-auto max-w-2xl text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
              {subtitle}
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}
