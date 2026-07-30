const heroImages = {
  main: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=680&h=440&fit=crop&q=80",
};

export function FeaturesHero() {
  return (
    <section className="bg-[var(--lp-bg)] pt-[120px] md:pt-[148px]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h1 className="mx-auto max-w-[720px] text-center text-[2.125rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--lp-text)] sm:text-[2.625rem] md:text-[3rem]">
          Everything you need to{" "}
          <span className="font-bold">run your finances</span> in one place.
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.12fr_1fr] md:grid-rows-1 md:gap-[18px]">
          <div className="h-full min-h-[320px] overflow-hidden rounded-[18px] md:min-h-[548px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages.main}
              alt="Financial analytics dashboard"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex h-full min-h-[320px] flex-col gap-4 md:min-h-0 md:gap-[18px]">
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.top}
                alt="Business performance reports"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.bottom}
                alt="Accounting workflow on laptop"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
