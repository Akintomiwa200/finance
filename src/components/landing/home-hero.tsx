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
            <span className="font-semibold text-[#111]">{isMiddle ? "22 May" : ""}</span>
          )}
          <MiniAvatar />
        </div>

        {isMiddle && (
          <>
            <div className="-mt-1 self-end text-slate-900">
              <BarChart3 size={16} />
            </div>
            <svg viewBox="0 0 168 72" className="h-[72px] w-full" aria-hidden="true">
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
          <p className="mb-2 text-[0.55rem] tracking-[0.14em] text-[#f7f7f7]">0000 8888 2222 3333</p>
          <small className="text-[0.46rem] text-white/60">VALID THRU&nbsp;&nbsp; 07/24</small>
        </div>

        {isMiddle ? (
          <div className="pr-2 text-right">
            <span className="block text-[0.86rem] font-extrabold text-[#111]">$1000</span>
            <small className="text-[0.48rem] text-[#999]">per day</small>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div className="min-h-[39px] rounded-[9px] bg-[#f6f8fa] px-[9px] py-[7px]">
              <small className="flex items-center gap-[3px] text-[0.48rem] text-[#9aa0a6]">
                <ArrowUp size={10} className="text-emerald-500" />
                Expense
              </small>
              <strong className="mt-0.5 block text-[0.72rem] text-[#111]">$4,264</strong>
            </div>
            <div className="min-h-[39px] rounded-[9px] bg-[#f6f8fa] px-[9px] py-[7px]">
              <small className="flex items-center gap-[3px] text-[0.48rem] text-[#9aa0a6]">
                <ArrowDown size={10} className="text-[#ff5555]" />
                Income
              </small>
              <strong className="mt-0.5 block text-[0.72rem] text-[#111]">$3,897</strong>
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
          <Home size={12} className={isFront || !isMiddle ? "text-[#ff5555]" : ""} />
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

function HeroRibbon() {
  return (
    <div
      className="pointer-events-none absolute bottom-[25px] left-[163px] z-[8] hidden h-44 w-[438px] origin-bottom-left -rotate-[29deg] lg:block"
      aria-hidden="true"
    >
      <div className="absolute -left-[34px] top-[82px] z-[4] h-0 w-0 border-b-[23px] border-l-[23px] border-t-[23px] border-b-transparent border-l-white border-t-transparent" />

      <div className="absolute left-0 top-10 flex h-[66px] w-[424px] items-center gap-[15px] bg-black py-3 pl-[46px] pr-5 text-white [clip-path:polygon(0_0,100%_0,100%_62%,11%_100%,0_80%)]">
        <div className="flex items-center gap-2.5">
          <Trophy className="h-6 w-6 shrink-0 rounded-full border border-[#ff5555] p-1 text-[#ff5555]" />
          <div>
            <small className="mb-[3px] block text-[0.46rem] text-white/80">Achievements</small>
            <strong className="block text-[0.5rem] font-bold">Best Finance App On Playstore</strong>
          </div>
        </div>
        <div className="h-[34px] w-px shrink-0 bg-white/25" />
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#ff5555] text-xs text-[#ff5555]">
            $
          </span>
          <div>
            <small className="mb-[3px] block text-[0.46rem] text-white/80">Finance</small>
            <strong className="block text-[0.5rem] font-bold">Most Popular Accounting App</strong>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-px block h-[85px] w-[221px] rounded-md bg-[#ff5555] text-black [clip-path:polygon(0_12%,27%_0,27%_100%,100%_100%,100%_43%,0_43%)]">
        <span className="absolute left-[15px] top-[29px] w-[100px] -rotate-45 text-[0.5rem] font-extrabold leading-tight">
          Make The Best Financial Decisions
        </span>
        <div className="absolute bottom-0 right-0 flex h-14 w-24 items-center gap-3.5 border-l border-black/45 pl-[11px]">
          <LandingSpark size={25} inline />
          <div>
            <strong className="block text-[0.54rem] font-extrabold">Uifry Premium</strong>
            <small className="mt-0.5 block text-[0.5rem]">Free Trial</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative min-h-[calc(100vh-104px)] overflow-hidden bg-white">
      {/* Glow behind headline */}
      <div
        className="pointer-events-none absolute left-[236px] top-1 z-0 h-[205px] w-[330px] bg-[radial-gradient(circle_at_50%_38%,rgba(255,85,85,0.52)_0_18%,rgba(255,85,85,0.26)_28%,transparent_62%),radial-gradient(circle_at_50%_82%,rgba(255,205,77,0.5)_0_12%,transparent_36%)] blur-[18px]"
        aria-hidden="true"
      />

      <LandingSpark className="left-[78px] top-[22px] z-[2]" />
      <LandingSpark className="left-[266px] top-[304px] z-[2] scale-[0.78]" />
      <LandingSpark className="right-[377px] top-[398px] z-[2] scale-[0.84]" />

      <div className="relative z-[1] flex min-h-[inherit] flex-col lg:flex-row lg:items-center">
        {/* Left column */}
        <div className="relative z-[4] w-full max-w-[565px] shrink-0 px-5 pb-16 pt-10 md:px-8 lg:w-[565px] lg:pl-[142px] lg:pr-0 lg:pt-[62px] lg:pb-[80px]">
          <h1 className="mb-5 max-w-[555px] text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#111] sm:text-[3.2rem] lg:mb-5 lg:text-[3.6rem] lg:font-extrabold">
            Make The Best
            <br />
            Financial Decisions
          </h1>
          <p className="mb-9 max-w-[400px] text-[0.9rem] font-normal leading-[1.7] text-[#888]">
            Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu
            Adipiscing Sociis Arcu Lorem Porttitor.
          </p>
          <div className="flex flex-wrap items-center gap-6">
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
        </div>

        {/* Right column — phones */}
        <div className="relative z-[3] hidden min-h-[520px] flex-1 lg:block">
          <div className="absolute right-[35px] top-[-11px] z-[1] h-[476px] w-[476px] rotate-[17deg] rounded-full border border-black/70" />
          <div className="absolute right-[71px] top-[26px] z-[1] h-[403px] w-[403px] rotate-[17deg] rounded-full border border-black/70" />
          <div className="absolute right-[110px] top-[65px] z-[1] h-[326px] w-[326px] rotate-[17deg] rounded-full border border-black/70" />
          <div className="pointer-events-none absolute bottom-6 right-[190px] z-[1] h-[246px] w-[286px] rounded-full bg-[radial-gradient(circle,rgba(255,85,85,0.46)_0_18%,rgba(255,85,85,0.28)_28%,transparent_68%)] blur-[17px]" />
          <PhoneMockup variant="back" />
          <PhoneMockup variant="middle" />
          <PhoneMockup variant="front" />
        </div>
      </div>

      <HeroRibbon />
    </section>
  );
}
