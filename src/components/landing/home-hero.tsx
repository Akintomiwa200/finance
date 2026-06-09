import { ArrowRight, Play, Trophy } from "lucide-react";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";
import { DeviceMockup } from "@/src/components/landing/device-mockup";

/**
 * HeroRibbon — Z-shaped ribbon that lives inside the left column.
 *
 * PLACEMENT: render this as the last child of the left column div.
 * The left column must be `flex flex-col` so the ribbon naturally
 * sits at the bottom. Do NOT make the ribbon `absolute` — it is
 * a normal in-flow element that pushes the column height.
 *
 * SHAPE: three pieces form the Z
 *   1. Black arm  — top horizontal bar (left-aligned, arrow notch on the left)
 *   2. SVG diagonal — polygon that precisely bridges top-right of the black
 *      arm to the bottom-left of the red arm (no skew distortion)
 *   3. Red arm   — bottom horizontal bar (right-aligned)
 */
export function HeroRibbon() {
  /**
   * Coordinate system (viewBox 560 × 200)
   *
   * Black arm occupies: x 16→316, y 16→64   (left=16, width=300, height=48, top=16)
   * Red arm occupies:   x 196→556, y 124→188 (left=196, width=360, height=64, bottom=12)
   *
   * Diagonal polygon corners — bridges right edge of black arm to left edge of red arm:
   *   A = (316,  16)  top-right of black arm (top edge)
   *   B = (356,  64)  bottom-right of black arm (overlap into diagonal)
   *   C = (236, 188)  bottom-left of red arm (bottom edge)
   *   D = (196, 140)  top-left of red arm (overlap into diagonal)
   *
   * This creates a solid connected Z with no gap between the three pieces.
   */
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
      {/* ── Top arm: black bar ── */}
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
        {/* Achievement badge */}
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
              Best Finance App On Playstore
            </strong>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 30,
            background: "rgba(255,255,255,0.22)",
            flexShrink: 0,
          }}
        />

        {/* Finance badge */}
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
              Most Popular Accounting App
            </strong>
          </div>
        </div>
      </div>

      {/* ── SVG diagonal (Z cross-stroke) ── */}
      {/*
       * Polygon bridges the rotated black arm to the rotated red arm.
       *
       * Black arm (-5° around 16,16):  right edge ~414→419, top ~-19→29
       * Red arm   (+5° around 220,124): left edge ~220→214, bottom ~124→188
       *
       *   A (414, -5)  — near top-right of rotated black arm
       *   B (418, 28)  — near bottom-right of rotated black arm
       *   C (215, 185) — near bottom-left of rotated red arm
       *   D (220, 124) — top-left of rotated red arm
       */}
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
        {/* Label rotated along the diagonal axis */}
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

      {/* ── Bottom arm: red bar ── */}
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
              Uifry Premium
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
      {/* Glow behind headline */}
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
        {/*
         * Left column — flex-col so HeroRibbon naturally anchors to the bottom.
         * pb-0 instead of pb-16 so the ribbon sits flush at the column's bottom edge.
         */}
        <div className="relative z-[4] flex w-full max-w-[565px] shrink-0 flex-col px-5 pt-10 lg:w-[565px] lg:pr-0 lg:pt-[62px]">
          <h1 className="mb-5 max-w-[555px] text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--lp-text)] sm:text-[3.2rem] lg:mb-5 lg:text-[3.6rem]">
            Make The Best
            <br />
            Financial Decisions
          </h1>
          <p className="mb-9 max-w-[400px] text-[0.9rem] font-normal leading-[1.7] text-[var(--lp-text-muted)]">
            Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet
            Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor.
          </p>
          <div className="mb-10 flex flex-wrap items-center gap-6">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff5555] px-7 text-[0.9rem] font-semibold text-white transition-all hover:brightness-110"
            >
              Get Started
              <ArrowRight size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-white/80 transition-colors hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/60">
                <Play size={12} fill="currentColor" className="ml-0.5" />
              </span>
              Watch Video
            </button>
          </div>

          {/*
           * HeroRibbon is an in-flow child of the left column.
           * It is NOT absolutely positioned relative to the section —
           * it sits naturally after the buttons and anchors the column bottom.
           */}
          <HeroRibbon />
        </div>

        {/* Right column — responsive device composition */}
        <div className="relative z-[3] flex-1">
          {/* Desktop Layout */}
          <div className="relative hidden lg:block h-[650px] w-full">
            {/* Laptop — way bigger, main hero device */}
            <div className="absolute left-[50%] top-[50%] -translate-x-[56%] -translate-y-[48%] z-10 scale-[1.65] origin-top-left">
              <DeviceMockup device="laptop" />
            </div>

            {/* Tablet — 4th compartment (bottom-right) of desktop */}
            <div className="absolute right-[1%] bottom-[8%] z-20 translate-x-[40px]">
              <DeviceMockup device="tablet" />
            </div>

            {/* Phone — 4th compartment (bottom-right) of tablet */}
            <div className="absolute right-[5%] bottom-[3%] z-30 translate-x-[100px] translate-y-[80px]">
              <DeviceMockup device="phone" />
            </div>
          </div>

          {/* Tablet & Mobile: Single cohesive layout */}
          <div className="lg:hidden relative flex justify-center items-center min-h-[500px] md:min-h-[550px]">
            {/* Laptop (largest, back) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.9] md:scale-[1.1] z-10">
              <DeviceMockup device="laptop" />
            </div>
            {/* Tablet (middle) */}
            <div className="absolute right-[5%] md:right-[10%] top-[40%] -translate-y-1/2 scale-[0.65] md:scale-[0.75] z-20">
              <DeviceMockup device="tablet" />
            </div>
            {/* Phone (smallest, front) */}
            <div className="absolute left-[5%] md:left-[10%] bottom-[15%] scale-[0.5] md:scale-[0.6] z-30">
              <DeviceMockup device="phone" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
