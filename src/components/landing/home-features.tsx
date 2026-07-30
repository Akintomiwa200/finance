import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";
import { DeviceMockup } from "@/src/components/landing/device-mockup";

export function HomeFeatures() {
  return (
    <section className="relative flex w-full min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--lp-bg)] px-5 py-16 md:px-8 md:py-20 lg:py-24">
      <SplashBlob className="top-10 left-10 scale-75 -rotate-12 opacity-60" />
      <SplashBlob className="bottom-20 right-10 scale-50 rotate-45 opacity-40" />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 md:flex-row md:gap-16 lg:gap-20">
        {/* ── LEFT: Phone Mockup ── */}
        <div className="relative flex h-[520px] w-full max-w-[340px] shrink-0 items-center justify-center sm:max-w-[380px] md:h-[480px] md:max-w-[400px] lg:h-[520px] lg:max-w-[440px]">
          {/* Blob */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.55] blur-[2px] md:h-[380px] md:w-[380px] lg:h-[400px] lg:w-[400px]"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, #ff5555 0%, #cc0000 30%, #333333 70%, transparent 100%)",
              }}
          />

          {/* Rings */}
          {[380, 290, 200].map((size, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--lp-border)]"
              style={{ width: size, height: size }}
            />
          ))}

          {/* Star */}
          <LandingSpark className="absolute left-[20px] top-[40px] z-[2] md:left-[32px] md:top-[60px]" size={22} />

          {/* Phone — real app dashboard preview */}
          <div className="relative z-[3] scale-[1.05] sm:scale-[1.1] md:scale-[1.15]">
            <DeviceMockup device="phone" />
          </div>
        </div>

        {/* ── RIGHT: Features Content (no shrinking on mobile) ── */}
        <div className="w-full ">
          <div className="mb-3 text-[11px] font-bold tracking-[2.5px] text-[#ff5555] uppercase md:text-[12px]">
            Features
          </div>
          <h2 className="mb-6 text-[32px] font-black leading-[1.2] tracking-[-0.5px] text-[var(--lp-text)] sm:text-[36px] md:mb-8 md:text-[40px] lg:text-[44px]">
            Audpay Premium
          </h2>

          <div className="flex flex-col gap-6 md:gap-7">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 1L11.5 8.5L19 10L11.5 11.5L10 19L8.5 11.5L1 10L8.5 8.5L10 1Z"
                      fill="#ff5555"
                    />
                  </svg>
                ),
                title: "Smart Invoicing",
                desc: "Create, send, and track professional invoices in seconds. Automate recurring billing, set up payment reminders, and get paid faster with integrated payment processing.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="8.5"
                      stroke="#ff5555"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="1.5"
                      y1="10"
                      x2="18.5"
                      y2="10"
                      stroke="#ff5555"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 1.5C7 4 5.5 7 5.5 10C5.5 13 7 16 10 18.5"
                      stroke="#ff5555"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 1.5C13 4 14.5 7 14.5 10C14.5 13 13 16 10 18.5"
                      stroke="#ff5555"
                      strokeWidth="1.5"
                    />
                  </svg>
                ),
                title: "Real-Time Analytics",
                desc: "Monitor your financial health with live dashboards and customizable reports. Track revenue, expenses, cash flow, and profitability across departments and time periods.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect
                      x="1.5"
                      y="1.5"
                      width="17"
                      height="17"
                      rx="3"
                      stroke="#ff5555"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="5"
                      y="5"
                      width="4.5"
                      height="4.5"
                      rx="0.5"
                      fill="#ff5555"
                    />
                    <rect
                      x="10.5"
                      y="5"
                      width="4.5"
                      height="4.5"
                      rx="0.5"
                      fill="#ff5555"
                    />
                    <rect
                      x="5"
                      y="10.5"
                      width="4.5"
                      height="4.5"
                      rx="0.5"
                      fill="#ff5555"
                    />
                    <rect
                      x="10.5"
                      y="10.5"
                      width="4.5"
                      height="4.5"
                      rx="0.5"
                      fill="#ff5555"
                    />
                  </svg>
                ),
                title: "Multi-Currency Support",
                desc: "Handle transactions in 150+ currencies with automatic exchange rate updates. Perfect for businesses operating across borders with built-in compliance reporting.",
              },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">
                    {f.icon}
                  </div>
                  <span className="text-[15px] font-extrabold text-[var(--lp-text)] sm:text-[16px]">
                    {f.title}
                  </span>
                </div>
                <p className="m-0 text-[14px] leading-relaxed text-[var(--lp-text-muted)] font-normal break-words sm:pl-8">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}
