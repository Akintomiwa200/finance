"use client";

import { useState, useEffect, useCallback } from "react";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";

const testimonials = [
  {
    id: 1,
    name: "Nick Jonas",
    text: "Arcu at dictum sapien, mollis. Vulputate sit id accumsan, ultricies. In ultrices malesuada elit mauris etiam odio. Duis tristique lacus, et blandit viverra nisl velit. Sed mattis rhoncus, diam suspendisse sit nunc, gravida eu. Lectus eget eget ac dolor neque lorem sapien, suspendisse aliquam.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    miniAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    text: "This app transformed how I manage my finances. The intuitive interface and powerful analytics make budgeting actually enjoyable. I've recommended it to all my colleagues.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    miniAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    name: "Michael Chen",
    text: "Finally, an accounting app that doesn't feel like work. The automatic categorization and real-time insights save me hours every week. Game changer for small business owners.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    miniAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    text: "The budgeting tools are incredibly detailed yet easy to use. I've finally been able to stick to a savings plan thanks to the visual progress tracking. Highly recommend!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    miniAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 5,
    name: "David Kim",
    text: "Switched from a competitor and wish I'd done it sooner. The customer support is phenomenal and the feature set is unmatched. Five stars all around!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    miniAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
];

const orbitPositions = [
  { top: "6%", left: "18%", width: 64, height: 64 },
  { top: "7%", right: "15%", width: 70, height: 70 },
  { bottom: "9%", left: "12%", width: 72, height: 72 },
  { bottom: "11%", right: "12%", width: 66, height: 66 },
];

export default function HomeTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = setInterval(goNext, 10000);
    return () => clearInterval(id);
  }, [goNext]);

  const active = testimonials[activeIndex];
  const otherTestimonials = testimonials.filter((_, i) => i !== activeIndex);

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-[var(--lp-bg)]"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <SplashBlob className="top-8 left-8 scale-75 -rotate-12 opacity-50" />
        <SplashBlob className="bottom-12 right-6 scale-50 rotate-45 opacity-35" />
        <LandingSpark
          className="absolute left-[8%] top-[4%] z-[2] hidden sm:block text-white/30"
          size={24}
        />
        <LandingSpark
          className="absolute right-[12%] top-[8%] z-[2] scale-[0.6] opacity-40 hidden sm:block text-white/20"
          size={24}
        />
        <LandingSpark
          className="absolute bottom-[6%] left-[5%] z-[2] scale-[0.5] opacity-30 hidden sm:block text-white/20"
          size={24}
        />
        <LandingSpark
          className="absolute bottom-[10%] right-[8%] z-[2] hidden sm:block text-white/30"
          size={20}
        />
        <LandingSpark
          className="absolute left-[50%] top-[50%] z-[2] scale-[0.35] opacity-20 hidden sm:block text-white/10"
          size={24}
        />

        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20 lg:px-20 lg:py-24">
          <div className="text-center mb-8 md:mb-14">
            <div
              className="text-[1rem] md:text-[1.4rem] lg:text-[2rem] font-semibold tracking-[0.18em] uppercase text-[var(--lp-red)] mb-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Testimonial
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--lp-text)] leading-[1.1] m-0 px-2 sm:px-0"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              What Our Users
              <br />
              Say About Us?
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] shrink-0">
              <div
                className="absolute inset-0 m-auto w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] lg:w-[220px] lg:h-[220px] rounded-full blur-[24px] sm:blur-[30px] md:blur-[38px] z-0"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,85,85,0.55) 0%, rgba(204,0,0,0.22) 45%, transparent 70%)",
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--lp-border)] z-[1] pointer-events-none hidden sm:block"
                style={{
                  width: "88%",
                  height: "88%",
                  maxWidth: 380,
                  maxHeight: 380,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--lp-border)] z-[1] pointer-events-none hidden md:block"
                style={{
                  width: "65%",
                  height: "65%",
                  maxWidth: 280,
                  maxHeight: 280,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--lp-border)] z-[1] pointer-events-none hidden lg:block"
                style={{
                  width: "43%",
                  height: "43%",
                  maxWidth: 188,
                  maxHeight: 188,
                }}
              />

              <div
                key={active.id}
                className="absolute rounded-full overflow-hidden z-[2] border-[3px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] lg:w-[136px] lg:h-[136px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[4px] transition-all duration-500"
              >
                <img
                  className="w-full h-full object-cover block"
                  src={active.avatar}
                  alt={active.name}
                />
                <div className="absolute bottom-[4px] -right-[4px] sm:bottom-[6px] sm:-right-[6px] bg-[#ff5555] text-white w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm sm:text-base md:text-2xl font-extrabold leading-none shadow-[0_4px_14px_rgba(255,85,85,0.45)] pb-[2px] sm:pb-1">
                  "
                </div>
              </div>

              {orbitPositions.map((pos, i) => {
                const t = otherTestimonials[i % otherTestimonials.length];
                return (
                  <div
                    key={t.id}
                    className="absolute rounded-full overflow-hidden z-[2] border-[3px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-500 hidden sm:block"
                    style={{
                      ...pos,
                      width: `clamp(40px, ${(pos.width / 440) * 100}%, ${pos.width}px)`,
                      height: `clamp(40px, ${(pos.height / 440) * 100}%, ${pos.height}px)`,
                    }}
                  >
                    <img
                      className="w-full h-full object-cover block"
                      src={t.avatar}
                      alt={t.name}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex-1 min-w-0 text-center md:text-left w-full">
              <h3
                key={active.id + "-title"}
                className="text-[1.2rem] sm:text-[1.35rem] md:text-[1.45rem] lg:text-[1.55rem] font-extrabold text-[var(--lp-text)] m-0 mb-3 md:mb-4 leading-[1.25] transition-all duration-500"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                {active.name}
              </h3>

              {/* Mobile card redesign */}
              <div className="block md:hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-4 shadow-lg min-h-[50vh] flex items-center gap-4">
                <svg className="w-10 h-10 shrink-0 self-start mt-1 text-[var(--lp-red)]" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                </svg>
                <p
                  key={active.id + "-text-mobile"}
                  className="text-[1.35rem] leading-[1.8] text-[var(--lp-text)] m-0 font-normal transition-all duration-500 text-left flex-1"
                >
                  {active.text}
                </p>
              </div>

              {/* Desktop text - unchanged */}
              <div className="hidden md:flex items-start gap-3 mb-5 md:mb-7">
                <svg className="w-8 h-8 shrink-0 mt-1 text-[var(--lp-red)]" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                </svg>
                <p
                  key={active.id + "-text-desktop"}
                  className="text-[0.95rem] sm:text-[1.1rem] md:text-[1.3rem] lg:text-[1.5rem] leading-[1.6] sm:leading-[1.7] md:leading-[1.75] text-[var(--lp-text)] m-0 font-normal transition-all duration-500 text-justify md:text-left"
                >
                  {active.text}
                </p>
              </div>

              <div className="flex gap-2 mb-3 justify-center md:justify-start">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 md:w-[42px] md:h-[42px] rounded-full overflow-hidden border-2 shrink-0 transition-all duration-300 ${
                      i === activeIndex
                        ? "border-[#ff5555] shadow-[0_2px_8px_rgba(255,85,85,0.35)]"
                        : "border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover block"
                      src={t.miniAvatar}
                      alt={t.name}
                    />
                    {i !== activeIndex && (
                      <div className="absolute inset-0 bg-white/60 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <div
                className="text-sm sm:text-base font-bold text-[var(--lp-text)]"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                {active.name}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
