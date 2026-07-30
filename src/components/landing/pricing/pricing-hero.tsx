const heroImages = {
  main: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=680&h=440&fit=crop&q=80",
};

export function PricingHero() {
  return (
    <section className="bg-[var(--lp-bg)] pt-[120px] md:pt-[148px]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h1 className="mx-auto max-w-[720px] text-center text-[2.125rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--lp-text)] sm:text-[2.625rem] md:text-[3rem]">
          Simple, transparent{" "}
          <span className="font-bold">pricing</span> for every stage.
        </h1>
        <p className="mx-auto mt-5 max-w-[560px] text-center text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
          No hidden fees. No surprises. Choose the plan that fits your business
          and scale as you grow.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.12fr_1fr] md:grid-rows-1 md:gap-[18px]">
          <div className="h-full min-h-[320px] overflow-hidden rounded-[18px] md:min-h-[548px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages.main}
              alt="Finance team reviewing subscription plans"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex h-full min-h-[320px] flex-col gap-4 md:min-h-0 md:gap-[18px]">
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.top}
                alt="Financial dashboard analytics"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.bottom}
                alt="Business growth metrics on screen"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
