const heroImages = {
  main: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=680&h=440&fit=crop&q=80",
};

export function AboutHero() {
  return (
    <section className="bg-[var(--lp-bg)] pt-[120px] md:pt-[148px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <h1 className="mx-auto max-w-[720px] text-center text-[2.125rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--lp-text)] sm:text-[2.625rem] md:text-[3rem]">
          You can always{" "}
          <span className="font-bold">count on us</span> during your journey.
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.12fr_1fr] md:grid-rows-1 md:gap-[18px]">
          <div className="h-full min-h-[320px] overflow-hidden rounded-[18px] md:min-h-[548px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages.main}
              alt="Audpay team collaborating"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex h-full min-h-[320px] flex-col gap-4 md:min-h-0 md:gap-[18px]">
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.top}
                alt="Finance professionals at work"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.bottom}
                alt="Team member reviewing financial data"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
