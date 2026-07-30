"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";
import { DeviceMockup } from "@/src/components/landing/device-mockup";

const advantages = [
  {
    id: "notifications",
    icon: "🔔",
    title: "Clever Notifications",
    description:
      "Never miss a critical financial event. Audpay sends intelligent alerts for overdue invoices, budget thresholds, unusual transactions, and compliance deadlines — so you stay ahead of every deadline.",
    device: "laptop" as const,
  },
  {
    id: "customizable",
    icon: "✦",
    title: "Fully Customizable",
    description:
      "Configure Audpay to match your business workflow. Custom chart of accounts, branded invoices, automated approval chains, and role-based access — everything adapts to how your team works.",
    device: "tablet" as const,
  },
  {
    id: "analytics",
    icon: "📊",
    title: "Real-Time Analytics",
    description:
      "Monitor revenue, expenses, and cash flow with live dashboards that update as transactions post. Drill into any account, period, or department without waiting for month-end reports.",
    device: "laptop" as const,
  },
  {
    id: "security",
    icon: "🔒",
    title: "Bank-Grade Security",
    description:
      "Your financial data is protected with encryption at rest and in transit, role-based access controls, audit logs, and automatic backups — so you can focus on running your business.",
    device: "phone" as const,
  },
];

const AUTO_ROTATE_MS = 7000;

export function HomeAdvantages() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeMonth, setActiveMonth] = useState(0);

  const active = advantages[activeIndex];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % advantages.length);
      setActiveMonth(0);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const selectAdvantage = (index: number) => {
    setActiveIndex(index);
    setActiveMonth(0);
    setPaused(true);
  };

  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[var(--lp-bg)] px-4 py-12 md:px-8 md:py-20 lg:px-20 lg:py-24">
      <SplashBlob className="top-12 left-8 scale-75 -rotate-12 opacity-50" />
      <SplashBlob className="bottom-16 right-8 scale-50 rotate-45 opacity-35" />
      <LandingSpark
        className="absolute right-[10%] top-[12%] z-[2] hidden text-white/20 md:block"
        size={28}
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 text-center md:mb-14">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#ff5555]">
            Advantages
          </div>
          <h2 className="mt-2 text-[2.2rem] font-extrabold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-[2.6rem] md:text-[3rem]">
            Why Choose Audpay?
          </h2>
        </div>

        <div
          className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative flex w-full flex-1 justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative"
              >
                <DeviceMockup
                  device={active.device}
                  activeMonth={activeMonth}
                  onMonthChange={setActiveMonth}
                  interactive={active.device === "tablet"}
                  variant={active.id === "security" ? "security" : "dashboard"}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full max-w-lg flex-1 lg:max-w-xl">
            <div className="flex flex-col gap-3">
              {advantages.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAdvantage(index)}
                    className={`group w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300 sm:px-5 sm:py-5 ${
                      isActive
                        ? "border-[#ff5555]/40 bg-[var(--lp-team-card-bg)] shadow-[var(--lp-team-card-shadow)]"
                        : "border-transparent bg-[var(--lp-faq-row-bg)] hover:border-[var(--lp-team-card-border)] hover:bg-[var(--lp-team-card-bg)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-[0_4px_12px_rgba(255,85,85,0.3)] transition-transform duration-300 ${
                          isActive
                            ? "scale-110 bg-[#ff5555]"
                            : "bg-[#ff5555]/80 group-hover:scale-105"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-base font-bold text-[var(--lp-text)] sm:text-lg">
                            {item.title}
                          </span>
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full bg-[#ff5555] transition-opacity duration-300 ${
                              isActive ? "opacity-100" : "opacity-0"
                            }`}
                            aria-hidden="true"
                          />
                        </div>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              key="desc"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="mt-3 overflow-hidden text-[0.85rem] leading-[1.8] text-[var(--lp-text-muted)]"
                            >
                              {item.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 lg:justify-start">
              {advantages.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  onClick={() => selectAdvantage(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-[#ff5555]"
                      : "w-1.5 bg-[var(--lp-text-muted)]/30 hover:bg-[var(--lp-text-muted)]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
