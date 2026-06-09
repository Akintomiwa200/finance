import React from "react";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";

const faqItems = [
  {
    num: "01",
    q: "The Best Financial Accounting App Ever!",
    a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris.",
  },
  {
    num: "02",
    q: "The Best Financial Accounting App Ever!",
    a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris.",
  },
  {
    num: "03",
    q: "The Best Financial Accounting App Ever!",
    a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris.",
  },
  {
    num: "04",
    q: "The Best Financial Accounting App Ever!",
    a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris.",
  },
  {
    num: "05",
    q: "The Best Financial Accounting App Ever!",
    a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris.",
  },
  {
    num: "06",
    q: "The Best Financial Accounting App Ever!",
    a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris.",
  },
];

export function HomeFaq() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--lp-bg)] font-sans">
      <SplashBlob className="top-10 left-8 scale-75 -rotate-12 opacity-50" />
      <SplashBlob className="bottom-16 right-8 scale-50 rotate-45 opacity-35" />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-20 lg:px-20 lg:py-24">
        {/* Stars scattered */}
        <LandingSpark className="absolute top-10 left-[8%] z-[2] hidden md:block text-white/20" size={32} />
        <LandingSpark className="absolute top-24 right-[35%] z-[2] scale-[0.4] opacity-25 hidden md:block text-white/10" size={40} />
        <LandingSpark className="absolute bottom-28 left-[5%] z-[2] scale-[0.5] opacity-35 hidden md:block text-white/20" size={28} />
        <LandingSpark className="absolute bottom-12 right-[8%] z-[2] scale-[0.35] opacity-20 hidden md:block text-white/10" size={36} />
        <LandingSpark
          className="absolute top-36 right-[12%] z-[2] hidden md:block [&_path]:fill-[var(--lp-red)]"
          size={44}
        />
        <LandingSpark
          className="absolute bottom-36 left-[22%] z-[2] scale-[0.7] hidden md:block [&_path]:fill-[var(--lp-red)]"
          size={40}
        />

        {/* Header */}
        <div className="mb-12 relative z-10">
          <p className="text-sm md:text-base font-bold tracking-[2.5px] uppercase mb-3.5 text-[#ff5555]">
            FAQ
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-[var(--lp-text)]"
            style={{ letterSpacing: "-1.5px" }}>
            Frequently Asked
            <br />
            Questions
          </h2>
        </div>

        {/* FAQ Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-7 rounded-2xl bg-[var(--lp-faq-card-bg)] border border-[var(--lp-border)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--lp-faq-number-bg)] text-sm font-extrabold text-[var(--lp-red-dark)]">
                  {item.num}
                </span>
                <h3 className="text-[17px] font-extrabold leading-snug tracking-tight text-[var(--lp-text)]"
                  style={{ letterSpacing: "-0.3px" }}>
                  {item.q}
                </h3>
              </div>
              <p className="text-[13px] font-normal leading-relaxed text-[var(--lp-text-muted)]">
                &ldquo;{item.a}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
