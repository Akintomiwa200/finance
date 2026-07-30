type LandingImageHeroProps = {
  title: string;
  highlight: string;
  subtitle?: string;
  images: {
    main: string;
    top: string;
    bottom: string;
  };
  alt: {
    main: string;
    top: string;
    bottom: string;
  };
};

export function LandingImageHero({
  title,
  highlight,
  subtitle,
  images,
  alt,
}: LandingImageHeroProps) {
  return (
    <section className="bg-[var(--lp-bg)] pt-[120px] md:pt-[148px]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h1 className="mx-auto max-w-[720px] text-center text-[2.125rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--lp-text)] sm:text-[2.625rem] md:text-[3rem]">
          {title} <span className="font-bold">{highlight}</span>
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-[560px] text-center text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.12fr_1fr] md:grid-rows-1 md:gap-[18px]">
          <div className="h-full min-h-[320px] overflow-hidden rounded-[18px] md:min-h-[548px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.main}
              alt={alt.main}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex h-full min-h-[320px] flex-col gap-4 md:min-h-0 md:gap-[18px]">
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.top}
                alt={alt.top}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.bottom}
                alt={alt.bottom}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
