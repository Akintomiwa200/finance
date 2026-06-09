import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";

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

          {/* Phone */}
          <div className="relative z-[3] flex h-[420px] w-[200px] flex-col overflow-hidden rounded-[36px] bg-[#1a1a1a] shadow-[0_32px_80px_rgba(0,0,0,0.35),0_0_0_1.5px_#333,inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:w-[210px] md:h-[440px] md:w-[220px] lg:h-[460px] lg:w-[230px]">
            <div className="relative z-10 mx-auto h-[22px] w-[72px] shrink-0 rounded-b-[14px] bg-[#1a1a1a]" />

            <div className="mx-[4px] mb-[4px] flex flex-1 flex-col gap-2 overflow-hidden rounded-[28px] bg-[#f5f5f7] px-3 py-[10px]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-normal text-[#222] sm:text-[11px]">
                  Hello <strong className="font-extrabold">Sami</strong>
                </span>
                <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-[10px] sm:h-[26px] sm:w-[26px] sm:text-[11px]">
                  👤
                </div>
              </div>

              {/* Card */}
              <div className="shrink-0 rounded-[12px] bg-[#1a1a1a] px-3 py-[8px] pb-2 text-white sm:py-[10px]">
                <div className="mb-[6px] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[8px] font-bold text-white sm:text-[9px]">
                    <div className="h-[12px] w-[12px] rounded-full bg-[#FF3B30] sm:h-[14px] sm:w-[14px]" />
                    <span>uifry</span>
                  </div>
                  <span className="text-[9px] font-extrabold italic tracking-[0.5px] text-white sm:text-[11px]">
                    VISA
                  </span>
                </div>
                <div className="mb-[4px] text-[7px] tracking-[1.5px] text-white/85 sm:text-[8.5px]">
                  0000 8888 2222 3333
                </div>
                <div className="flex justify-between text-[6.5px] text-white/50 sm:text-[7.5px]">
                  <span>———</span>
                  <span>07/24</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-2">
                {[
                  {
                    arrow: "↑",
                    arrowColor: "text-emerald-500",
                    label: "Expense",
                    val: "$4,264",
                  },
                  {
                    arrow: "↓",
                    arrowColor: "text-[#FF5555]",
                    label: "Income",
                    val: "$3,897",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[10px] bg-white px-2 py-[5px] sm:py-[6px]"
                  >
                    <div className="mb-0.5 flex items-center gap-[2px] text-[6.5px] text-[#888] sm:gap-[3px] sm:text-[7.5px]">
                      <span
                        className={`text-[7px] ${s.arrowColor} sm:text-[8px]`}
                      >
                        {s.arrow}
                      </span>{" "}
                      {s.label}
                    </div>
                    <div className="text-[10px] font-extrabold text-[#1a1a1a] sm:text-[11px]">
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction row */}
              <div className="flex items-center gap-2 rounded-[10px] bg-white px-[7px] py-[6px] sm:px-[9px] sm:py-[7px]">
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f7971e] to-[#ffd200] text-[11px] sm:h-[26px] sm:w-[26px] sm:text-[13px]">
                  🧑
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-extrabold text-[#1a1a1a] sm:text-[10px]">
                    $560.00
                  </div>
                  <div className="text-[6.5px] text-[#aaa] sm:text-[7.5px]">
                    From Adam
                  </div>
                </div>
                <span className="rounded-full bg-[#FFE8E8] px-[4px] py-[2px] text-[6px] font-bold text-[#FF3B30] sm:px-[6px] sm:py-[3px] sm:text-[7px]">
                  On Hold
                </span>
              </div>

              <div className="text-[8px] font-bold text-[#1a1a1a] sm:text-[9px]">
                Transaction
              </div>

              {/* Nav */}
              <div className="mt-auto flex items-center justify-around border-t border-black/6 pt-1 pb-0.5">
                {["🏠", "💳", null, "📊", "⚙️"].map((icon, i) =>
                  icon ? (
                    <span
                      key={i}
                      className={`cursor-pointer p-0.5 text-[12px] sm:text-[13px] ${i === 0 ? "opacity-100" : "opacity-40"}`}
                    >
                      {icon}
                    </span>
                  ) : (
                    <div
                      key={i}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF3B30] text-[13px] font-light leading-none text-white sm:h-6 sm:w-6 sm:text-[15px]"
                    >
                      +
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Features Content (no shrinking on mobile) ── */}
        <div className="w-full ">
          <div className="mb-3 text-[11px] font-bold tracking-[2.5px] text-[#ff5555] uppercase md:text-[12px]">
            Features
          </div>
          <h2 className="mb-6 text-[32px] font-black leading-[1.2] tracking-[-0.5px] text-[var(--lp-text)] sm:text-[36px] md:mb-8 md:text-[40px] lg:text-[44px]">
            Uifry Premium
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
                title: "Budgeting Intervals",
                desc: "Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor.",
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
                title: "Budgeting Intervals",
                desc: "Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor.",
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
                title: "Budgeting Intervals",
                desc: "Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor.",
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
