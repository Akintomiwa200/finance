import React from "react";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";

export function HomeCta() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--lp-bg)] min-h-[70vh] flex items-center">
      <SplashBlob className="top-10 left-10 scale-75 -rotate-12 opacity-50" />
      <SplashBlob className="bottom-20 right-8 scale-50 rotate-45 opacity-35" />
      {/* Background Decorative Elements */}
      <LandingSpark
        className="absolute top-[60px] right-[100px] z-[2] text-white/20"
        size={32}
      />
      <LandingSpark
        className="absolute bottom-[60px] left-[100px] z-[2] text-white/20 scale-[0.6]"
        size={28}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
        <div className="w-full bg-[var(--lp-cta-card-bg)] rounded-[40px] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden min-h-[500px] shadow-2xl border border-[var(--lp-border)]">
          {/* Decorative Orbiting Lines (Background) */}
          <div className="absolute bottom-[-120px] left-[20%] w-[400px] h-[400px] border border-[var(--lp-border)] rounded-full" />
          <div className="absolute bottom-[-80px] left-[22%] w-[300px] h-[300px] border border-[var(--lp-border)] rounded-full" />

          {/* Floating Stars */}
          <LandingSpark
            className="absolute top-[60px] left-[40%] z-[2] [&_path]:fill-white/30 rotate-45"
            size={28}
          />
          <LandingSpark
            className="absolute bottom-[60px] left-[60%] z-[2] [&_path]:fill-white/30 rotate-45 scale-[0.7]"
            size={24}
          />

          {/* Left Content */}
          <div className="relative z-10 w-full md:w-1/2 flex flex-col items-start space-y-6">
            <h2 className="text-[var(--lp-text)] text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Ready To Get Started?
            </h2>
            <p className="text-[var(--lp-text-muted)] text-sm md:text-base font-light leading-relaxed max-w-md">
              Risus Habitant Leo Egestas Mauris Diam Eget Morbi Tempus Vulputate.
            </p>
            <button className="bg-[#ff5555] text-white font-semibold text-sm py-3 px-8 rounded-full flex items-center gap-2 hover:brightness-110 transition-all shadow-lg mt-2">
              Download App
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          {/* Right Content - Phones Mockup */}
          <div className="relative z-20 w-full md:w-1/2 flex items-end justify-center md:justify-end mt-12 md:mt-0 h-full perspective-1000">
            {/* Phone 1 (Front Left) */}
            <div className="relative w-[180px] h-[380px] bg-black rounded-[30px] border-[4px] border-[var(--lp-border)] shadow-2xl transform rotate-[-5deg] z-30 overflow-hidden shrink-0">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-40" />

              {/* Screen Content */}
              <div className="w-full h-full bg-white p-4 pt-8 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">
                    Hello <span className="text-blue-600">Sami</span>
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex items-center justify-center text-white text-[10px]">
                    S
                  </div>
                </div>

                {/* Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 mb-3 text-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">Uifry</span>
                    <span className="text-[8px] italic">VISA</span>
                  </div>
                  <div className="text-[10px] tracking-widest opacity-70">
                    0000 8888 2222 3333
                  </div>
                </div>

                {/* Transactions */}
                <div className="text-[10px] text-[var(--lp-text-muted)] mb-1">Today</div>
                <div className="space-y-2 flex-1">
                  {[
                    {
                      icon: "🎬",
                      name: "Netflix",
                      amt: "-29.49",
                      color: "#E50914",
                    },
                    {
                      icon: "🌸",
                      name: "Adam Sha6",
                      amt: "+206.00",
                      color: "#ff9966",
                    },
                    {
                      icon: "☕",
                      name: "Starbucks",
                      amt: "-18.00",
                      color: "#00704A",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                          style={{ backgroundColor: item.color + "20" }}
                        >
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold ${item.amt.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {item.amt}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-[10px] text-gray-500">Transactions</span>
                  <div className="flex gap-3">
                    <span className="text-gray-800">🏠</span>
                    <span className="text-gray-800">💳</span>
                    <span className="text-red-500">⚡</span>
                    <span className="text-gray-800">⚙️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 (Middle Back) */}
            <div className="relative w-[160px] h-[340px] bg-black rounded-[30px] border-[4px] border-[var(--lp-border)] shadow-lg transform rotate-[6deg] z-20 overflow-hidden ml-[-25px] shrink-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-3 bg-black rounded-full z-40" />
              <div className="w-full h-full bg-gray-50 p-4 pt-8 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-[var(--lp-text-muted)]">
                    ← Card Details
                  </span>
                  <span className="font-bold text-[10px]">VISA</span>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 mb-2">
                  <div className="h-4 w-full bg-gray-700/30 rounded-sm"></div>
                  <div className="h-2 w-12 bg-gray-700/30 rounded-sm mt-1"></div>
                </div>
                <svg className="w-full h-10" viewBox="0 0 100 30">
                  <path
                    d="M0 20 Q 20 10 40 15 T 80 10 T 100 15"
                    fill="none"
                    stroke="#4F7EF7"
                    strokeWidth="2"
                  />
                  <circle cx="55" cy="11" r="3" fill="#ff5555" />
                </svg>
                <div className="mt-auto flex justify-between pt-1">
                  <span className="text-[10px] text-[var(--lp-text-muted)]">Transactions</span>
                  <div className="flex gap-3">
                    <span>🏠</span>
                    <span>📊</span>
                    <span>⚙️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 3 (Far Right Back) */}
            <div className="relative w-[140px] h-[300px] bg-black rounded-[30px] border-[4px] border-[var(--lp-border)] shadow-lg transform rotate-[12deg] z-10 overflow-hidden ml-[-20px] shrink-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-40" />
              <div className="w-full h-full bg-white p-4 pt-8 flex flex-col">
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] text-[var(--lp-text-muted)]">← Activity</span>
                  <div className="flex gap-2 text-[9px]">
                    <span className="font-bold text-black border-b-2 border-[#ff5555]">
                      Income
                    </span>
                    <span className="text-[var(--lp-text-muted)]">Expenses</span>
                  </div>
                </div>
                <svg className="w-full h-8" viewBox="0 0 100 25">
                  <path
                    d="M0 20 L 20 5 L 40 15 L 60 5 L 80 10 L 100 5"
                    fill="none"
                    stroke="#4F7EF7"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 22 L 20 12 L 40 18 L 60 15 L 80 20 L 100 18"
                    fill="none"
                    stroke="#ff5555"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[8px] text-gray-500">Transactions</span>
                  <span className="text-[8px] font-bold">$1,000</span>
                </div>
                <div className="mt-auto flex justify-between pt-1">
                  <span className="text-[10px]">🏠</span>
                  <span className="text-red-500 text-[12px]">📊</span>
                  <span className="text-[10px]">⚙️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
