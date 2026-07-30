import dynamic from "next/dynamic";

const AboutWorldMap = dynamic(
  () =>
    import("@/src/components/landing/about/about-world-map").then(
      (mod) => mod.AboutWorldMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[280px] animate-pulse rounded-[20px] bg-[var(--lp-card-alt)] md:h-[380px]"
        aria-hidden="true"
      />
    ),
  },
);

export function AboutGlobal() {
  return (
    <section className="bg-[var(--lp-bg)] py-20 transition-colors duration-300 md:py-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[2rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] md:text-[2.75rem] lg:text-[3rem]">
            We&apos;re <span className="font-bold">global</span> fully remote.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            Nowadays, the best teams are remote. Maximizing the productivity is
            very important for us.
          </p>
        </div>

        <div className="relative mt-12 md:mt-16">
          <AboutWorldMap />
        </div>
      </div>
    </section>
  );
}
