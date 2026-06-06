import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  CreditCard,
  Flame,
  Home,
  Play,
  Settings,
  Trophy,
  Zap,
} from "lucide-react";
import { LandingSpark } from "@/src/components/landing/landing-spark";

const CORAL = "#ff5555";

function MiniAvatar() {
  return (
    <div className="relative h-6 w-[39px] shrink-0">
      <span className="absolute left-0 top-px h-[22px] w-[22px] rounded-full border-2 border-white bg-gradient-to-br from-teal-500 to-orange-500" />
      <span className="absolute right-0 top-px h-[22px] w-[22px] rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-rose-500" />
    </div>
  );
}

type PhoneVariant = "front" | "middle" | "back";

function PhoneMockup({ variant }: { variant: PhoneVariant }) {
  const isFront = variant === "front";
  const isMiddle = variant === "middle";

  const position =
    variant === "front"
      ? "right-[292px] top-[-19px] z-[6] -rotate-[14deg]"
      : variant === "middle"
        ? "right-[163px] top-[71px] z-[5] -rotate-[6deg]"
        : "right-[11px] top-[127px] z-[4] -rotate-[13deg]";

  return (
    <div
      className={`absolute h-[426px] w-[214px] overflow-hidden rounded-[31px] border-[6px] border-[#070707] bg-white shadow-[14px_18px_30px_rgba(0,0,0,0.24)] ${position}`}
      aria-hidden="true"
    >
      <div className="absolute -top-px left-1/2 z-10 h-[21px] w-[74px] -translate-x-1/2 rounded-b-[14px] bg-[#050505]" />
      <div className="absolute left-1/2 top-2 z-[11] h-[9px] w-[9px] translate-x-6 rounded-full bg-[#171717]" />

      <div className="flex h-full flex-col gap-[9px] bg-white px-[13px] pb-2.5 pt-[33px]">
        <div className="flex min-h-12 items-center justify-between rounded-[15px] bg-[#f3f7fa] px-[13px] py-[11px] text-xs text-[#5f646b]">
          {isFront ? (
            <p>
              Hello <strong className="font-bold text-[#111]">Sami</strong>
            </p>
          ) : (
            <span className="font-semibold text-[#111]">
              {isMiddle ? "22 May" : ""}
            </span>
          )}
          <MiniAvatar />
        </div>

        {isMiddle && (
          <>
            <div className="-mt-1 self-end text-slate-900">
              <BarChart3 size={16} />
            </div>
            <svg
              viewBox="0 0 168 72"
              className="h-[72px] w-full"
              aria-hidden="true"
            >
              <path
                d="M4 52 C28 48 36 18 58 24 S92 8 118 16 S148 28 164 22"
                fill="none"
                stroke="#3b6ff5"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M4 58 C30 54 44 62 68 48 S108 56 132 40 S156 50 164 44"
                fill="none"
                stroke={CORAL}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="118" cy="16" r="4.5" fill={CORAL} />
            </svg>
          </>
        )}

        <div className="min-h-[103px] rounded-[7px] bg-[#030303] px-[13px] py-3.5 text-white">
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-[3px] text-[0.58rem] font-extrabold">
              <Flame size={10} fill="currentColor" className="text-[#ff5555]" />
              uifry
            </span>
            <strong className="text-[0.82rem] italic">VISA</strong>
          </div>
          <p className="mb-2 text-[0.55rem] tracking-[0.14em] text-[#f7f7f7]">
            0000 8888 2222 3333
          </p>
          <small className="text-[0.46rem] text-white/60">
            VALID THRU&nbsp;&nbsp; 07/24
          </small>
        </div>

        {isMiddle ? (
          <div className="pr-2 text-right">
            <span className="block text-[0.86rem] font-extrabold text-[#111]">
              $1000
            </span>
            <small className="text-[0.48rem] text-[#999]">per day</small>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div className="min-h-[39px] rounded-[9px] bg-[#f6f8fa] px-[9px] py-[7px]">
              <small className="flex items-center gap-[3px] text-[0.48rem] text-[#9aa0a6]">
                <ArrowUp size={10} className="text-emerald-500" />
                Expense
              </small>
              <strong className="mt-0.5 block text-[0.72rem] text-[#111]">
                $4,264
              </strong>
            </div>
            <div className="min-h-[39px] rounded-[9px] bg-[#f6f8fa] px-[9px] py-[7px]">
              <small className="flex items-center gap-[3px] text-[0.48rem] text-[#9aa0a6]">
                <ArrowDown size={10} className="text-[#ff5555]" />
                Income
              </small>
              <strong className="mt-0.5 block text-[0.72rem] text-[#111]">
                $3,897
              </strong>
            </div>
          </div>
        )}

        <div className="flex min-h-[55px] items-center gap-[9px] rounded-[11px] bg-[#fff0f0] p-2">
          {!isMiddle && (
            <div className="h-9 w-9 shrink-0 rounded-[11px] bg-gradient-to-br from-green-500 via-amber-500 to-red-500" />
          )}
          <div className="flex-1">
            <strong className="block text-[0.77rem] text-[#111]">
              {isMiddle ? "$3,897" : "$560.00"}
            </strong>
            <small className="text-[0.47rem] text-[#9b9b9b]">
              {isMiddle ? "Income" : "From Adam"}
            </small>
          </div>
          {!isMiddle && (
            <span className="whitespace-nowrap rounded bg-[#ff5555] px-1.5 py-0.5 text-[0.44rem] font-semibold not-italic text-white">
              On Hold
            </span>
          )}
        </div>

        <div className="mt-[3px] text-[0.62rem] text-[#222]">Transaction</div>

        <div className="mt-auto flex items-center justify-between border-t border-[#f0f0f0] pt-[9px] text-[#b7bdc4]">
          <Home
            size={12}
            className={isFront || !isMiddle ? "text-[#ff5555]" : ""}
          />
          <CreditCard size={12} />
          <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-slate-900 text-white">
            <Zap size={12} fill="currentColor" />
          </span>
          <BarChart3 size={12} className={isMiddle ? "text-[#ff5555]" : ""} />
          <Settings size={12} />
        </div>
      </div>
    </div>
  );
}

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
    <section className="relative w-full min-h-[85vh] overflow-hidden bg-white pt-[76px] md:pt-[88px] lg:pt-[104px]">
      {/* Glow behind headline */}
      <div
        className="pointer-events-none absolute left-[236px] top-1 z-0 h-[205px] w-[330px] bg-[radial-gradient(circle_at_50%_38%,rgba(255,85,85,0.52)_0_18%,rgba(255,85,85,0.26)_28%,transparent_62%),radial-gradient(circle_at_50%_82%,rgba(255,205,77,0.5)_0_12%,transparent_36%)] blur-[18px]"
        aria-hidden="true"
      />

      <LandingSpark className="absolute left-[78px] top-[22px] z-[2]" />
      <LandingSpark className="absolute left-[266px] top-[304px] z-[2] scale-[0.78]" />
      <LandingSpark className="absolute right-[377px] top-[398px] z-[2] scale-[0.84]" />
      <LandingSpark className="absolute left-[20px] top-[480px] z-[2] scale-[0.5] opacity-30" />
      <LandingSpark className="absolute right-[50px] top-[80px] z-[2] scale-[0.6] opacity-40" />
      <LandingSpark className="absolute left-[160px] top-[180px] z-[2] scale-[0.35] opacity-20" />
      <LandingSpark className="absolute right-[180px] top-[520px] z-[2] scale-[0.7] opacity-50" />
      <LandingSpark className="absolute left-[50%] top-[600px] z-[2] scale-[0.4] opacity-25" />
      <LandingSpark className="absolute left-[400px] top-[60px] z-[2] scale-[0.55] opacity-35" />

      <div className="relative z-[1] mx-auto max-w-7xl flex min-h-[inherit] flex-col lg:flex-row lg:items-center">
        {/*
         * Left column — flex-col so HeroRibbon naturally anchors to the bottom.
         * pb-0 instead of pb-16 so the ribbon sits flush at the column's bottom edge.
         */}
        <div className="relative z-[4] flex w-full max-w-[565px] shrink-0 flex-col px-5 pt-10 lg:w-[565px] lg:pr-0 lg:pt-[62px]">
          <h1 className="mb-5 max-w-[555px] text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#111] sm:text-[3.2rem] lg:mb-5 lg:text-[3.6rem] lg:font-extrabold">
            Make The Best
            <br />
            Financial Decisions
          </h1>
          <p className="mb-9 max-w-[400px] text-[0.9rem] font-normal leading-[1.7] text-[#888]">
            Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet
            Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor.
          </p>
          <div className="mb-10 flex flex-wrap items-center gap-6">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#111] px-7 text-[0.9rem] font-semibold text-white transition-colors hover:bg-[#333]"
            >
              Get Started
              <ArrowRight size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-[#333] transition-colors hover:text-[#ff5555]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111]">
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

        {/* Right column — phones */}
        <div className="relative z-[3] hidden min-h-[520px] flex-1 lg:block">
          <div className="absolute right-[35px] top-[-11px] z-[1] h-[476px] w-[476px] rotate-[17deg] rounded-full border border-black/70" />
          <div className="absolute right-[71px] top-[40px] z-[1] h-[403px] w-[403px] rotate-[17deg] rounded-full border border-black/70" />
          <div className="absolute right-[110px] top-[65px] z-[1] h-[326px] w-[326px] rotate-[17deg] rounded-full border border-black/70" />
          <div className="pointer-events-none absolute bottom-6 right-[190px] z-[1] h-[246px] w-[286px] rounded-full bg-[radial-gradient(circle,rgba(255,85,85,0.46)_0_18%,rgba(255,85,85,0.28)_28%,transparent_68%)] blur-[17px]" />
          <PhoneMockup variant="back" />
          <PhoneMockup variant="middle" />
          <PhoneMockup variant="front" />
        </div>
      </div>
    </section>
  );
}
