import { LandingSpark } from "@/src/components/landing/landing-spark";
import { DeviceMockup } from "@/src/components/landing/device-mockup";
import { SplashBlob } from "@/src/components/landing/splash-blob";

export function HomeAdvantages() {
  return (
    <>
      {/* ── ADVANTAGES SECTION ── */}
      <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[var(--lp-bg)] px-4 py-12 md:px-8 md:py-20 lg:px-20 lg:py-24">
        <SplashBlob className="top-12 left-8 scale-75 -rotate-12 opacity-50" />
        <SplashBlob className="bottom-16 right-8 scale-50 rotate-45 opacity-35" />
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 md:flex-row md:items-center md:justify-center md:gap-16 lg:gap-24">
          {/* LEFT LAPTOP */}
          <div className="relative flex flex-1 justify-center md:justify-start">
            <DeviceMockup device="laptop" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full max-w-lg flex-1 md:w-auto">
            <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#ff5555]">
              Advantages
            </div>
            <h2 className="mb-6 text-[2.2rem] font-extrabold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-[2.6rem]">
              Why Choose Uifry?
            </h2>

            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff5555] text-sm text-white shadow-[0_4px_12px_rgba(255,85,85,0.3)]">
                🔔
              </div>
              <span className="text-lg font-bold text-[var(--lp-text)] sm:text-[1.15rem]">
                Clever Notifications
              </span>
            </div>

            <p className="max-w-md text-[0.85rem] leading-[1.8] text-[var(--lp-text-muted)]">
              Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan,
              Ultricies. In Ultrices Malesuada Elit Mauris Etiam Odio. Duis
              Tristique Lacus, Et Blandit Viverra Nisl Velit. Sed Mattis
              Rhoncus, Diam Suspendisse Sit Nunc, Gravida Eu. Lectus Eget Eget
              Ac Dolor Neque Lorem Sapien, Suspendisse Aliquam.
            </p>
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZABLE SECTION ── */}
      <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[var(--lp-bg)] px-4 py-12 md:px-8 md:py-20 lg:px-20 lg:py-24">
        <SplashBlob className="top-8 right-12 scale-50 rotate-12 opacity-45" />
        <SplashBlob className="bottom-12 left-10 scale-75 -rotate-45 opacity-30" />
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 md:flex-row md:items-center md:justify-center md:gap-16 lg:gap-24">
          {/* LEFT CONTENT */}
          <div className="w-full max-w-lg flex-1 md:w-auto">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff5555] text-sm text-white shadow-[0_4px_12px_rgba(255,85,85,0.3)]">
                ✦
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-[var(--lp-text)] sm:text-2xl">
                Fully Customizable
              </h3>
            </div>

            <p className="max-w-md text-[0.85rem] leading-[1.8] text-[var(--lp-text-muted)]">
              Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan,
              Ultricies. In Ultrices Malesuada Elit Mauris Etiam Odio. Duis
              Tristique Lacus, Et Blandit Viverra Nisl Velit. Sed Mattis
              Rhoncus, Diam Suspendisse Sit Nunc, Gravida Eu. Lectus Eget Eget
              Ac Dolor Neque Lorem Sapien, Suspendisse Aliquam.
            </p>
          </div>

          {/* RIGHT TABLET */}
          <div className="relative flex flex-1 justify-center md:justify-end">
            <DeviceMockup device="tablet" />
          </div>
        </div>
      </section>
    </>
  );
}
