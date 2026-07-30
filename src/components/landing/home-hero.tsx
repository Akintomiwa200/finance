import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";
import { DeviceMockup } from "@/src/components/landing/device-mockup";

export function HeroRibbon() {
  return (
    <div
      className="pointer-events-none hidden lg:block"
      style={{
        position: "relative",
        width: 560,
        height: 200,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          width: 400,
          height: 48,
          background: "#000",
          borderRadius: "0 8px 0 0",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 18px 0 24px",
          color: "#fff",
          zIndex: 3,
          transform: "rotate(-5deg)",
          transformOrigin: "top left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1px solid #ff5555",
              color: "#ff5555",
              flexShrink: 0,
            }}
          >
            <Trophy style={{ width: 13, height: 13 }} />
          </span>
          <div>
            <small
              style={{
                display: "block",
                fontSize: "0.43rem",
                color: "rgba(255,255,255,0.7)",
                marginBottom: 1,
                whiteSpace: "nowrap",
              }}
            >
              Achievements
            </small>
            <strong
              style={{
                display: "block",
                fontSize: "0.5rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Best Finance Platform
            </strong>
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 30,
            background: "rgba(255,255,255,0.22)",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1px solid #ff5555",
              color: "#ff5555",
              fontSize: "0.75rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            $
          </span>
          <div>
            <small
              style={{
                display: "block",
                fontSize: "0.43rem",
                color: "rgba(255,255,255,0.7)",
                marginBottom: 1,
                whiteSpace: "nowrap",
              }}
            >
              Finance
            </small>
            <strong
              style={{
                display: "block",
                fontSize: "0.5rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Most Trusted Accounting Platform
            </strong>
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 560 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <polygon points="414,-5 418,28 215,185 220,124" fill="#ff5555" />
        <text
          x="317"
          y="82"
          fontSize="8"
          fontWeight="800"
          fill="#000"
          textAnchor="middle"
          transform="rotate(-35 317 82)"
          letterSpacing="0.05em"
        >
          Make The Best Financial Decisions
        </text>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 220,
          bottom: 12,
          width: 200,
          height: 64,
          paddingLeft: "80px",
          background: "#ff5555",
          borderRadius: "0 0 8px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          zIndex: 1,
          transform: "rotate(5deg)",
          transformOrigin: "top left",
        }}
      >
        <div
          style={{
            width: 1,
            height: 36,
            background: "rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <LandingSpark size={24} />
          <div>
            <strong
              style={{
                display: "block",
                fontSize: "0.52rem",
                fontWeight: 800,
                color: "#000",
                whiteSpace: "nowrap",
              }}
            >
              Audpay Premium
            </strong>
            <small
              style={{
                display: "block",
                fontSize: "0.48rem",
                color: "#000",
                marginTop: 2,
              }}
            >
              Free Trial
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden bg-[var(--lp-bg)] pt-[76px] md:pt-[88px] lg:pt-[104px]">
      <SplashBlob className="left-[236px] top-1" />

      <LandingSpark className="absolute left-[78px] top-[22px] z-[2] text-white/30" />
      <LandingSpark className="absolute left-[266px] top-[304px] z-[2] scale-[0.78] text-white/20" />
      <LandingSpark className="absolute right-[377px] top-[398px] z-[2] scale-[0.84] text-white/20" />
      <LandingSpark className="absolute left-[20px] top-[480px] z-[2] scale-[0.5] opacity-30 text-white/20" />
      <LandingSpark className="absolute right-[50px] top-[80px] z-[2] scale-[0.6] opacity-40 text-white/20" />
      <LandingSpark className="absolute left-[160px] top-[180px] z-[2] scale-[0.35] opacity-20 text-white/10" />
      <LandingSpark className="absolute right-[180px] top-[520px] z-[2] scale-[0.7] opacity-50 text-white/20" />
      <LandingSpark className="absolute left-[50%] top-[600px] z-[2] scale-[0.4] opacity-25 text-white/10" />
      <LandingSpark className="absolute left-[400px] top-[60px] z-[2] scale-[0.55] opacity-35 text-white/20" />

      <div className="relative z-[1] mx-auto max-w-7xl flex min-h-[inherit] flex-col lg:flex-row lg:items-center">
        <div className="relative z-[4] flex w-full max-w-[565px] shrink-0 flex-col px-5 pt-10 lg:w-[565px] lg:pr-0 lg:pt-[62px]">
          <h1 className="mb-5 max-w-[555px] text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--lp-text)] sm:text-[3.2rem] lg:mb-5 lg:text-[3.6rem]">
            Make The Best
            <br />
            Financial Decisions
          </h1>
          <p className="max-w-[400px] text-[0.9rem] font-normal leading-[1.7] text-[var(--lp-text-muted)]">
            Audpay streamlines your accounting, invoicing, and financial
            reporting in one powerful platform. Track every transaction, manage
            budgets, and gain real-time insights to make smarter business
            decisions.
          </p>

          <div className="h-8 shrink-0" aria-hidden="true" />

          <div className="mb-10 flex flex-wrap items-center gap-6">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff5555] px-7 text-[0.9rem] font-semibold text-white no-underline transition-all hover:brightness-110"
            >
              Get Started
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <a
              href="/features"
              className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-white/80 transition-colors hover:text-white no-underline"
            >
              Explore Features
            </a>
          </div>

          <HeroRibbon />
        </div>

        <div className="relative z-[3] flex-1">
          <div className="relative hidden lg:block h-[650px] w-full">
            <div className="absolute left-[50%] top-[50%] z-10 -translate-x-[55%] -translate-y-[50%] origin-top-left scale-[1.05]">
              <DeviceMockup device="laptop" />
            </div>

            <div className="absolute right-[0%] bottom-[12%] z-20 translate-x-[10px] scale-[0.88]">
              <DeviceMockup device="tablet" />
            </div>

            <div className="absolute right-[5%] bottom-[2%] z-30 translate-x-[80px] translate-y-[60px] scale-[0.85]">
              <DeviceMockup device="phone" />
            </div>
          </div>

          <div className="lg:hidden relative flex justify-center items-center min-h-[500px] md:min-h-[550px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.9] md:scale-[1.1] z-10">
              <DeviceMockup device="laptop" />
            </div>
            <div className="absolute right-[2%] md:right-[5%] top-[42%] -translate-y-1/2 scale-[0.55] md:scale-[0.62] z-20">
              <DeviceMockup device="tablet" />
            </div>
            <div className="absolute left-[5%] md:left-[10%] bottom-[10%] scale-[0.42] md:scale-[0.48] z-30">
              <DeviceMockup device="phone" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
