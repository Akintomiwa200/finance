"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

function PartnerLogo({
  name,
  icon,
}: {
  name: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 text-[var(--lp-text)] opacity-70">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight md:text-base">
        {name}
      </span>
    </div>
  );
}

const partners = [
  {
    name: "QuickBooks",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
  {
    name: "Stripe",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M13.5 6.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-11zM4.5 9.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5v8c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-8z" />
      </svg>
    ),
  },
  {
    name: "Plaid",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm-5 12.5a5 5 0 0110 0v1.5H7v-1.5z" />
      </svg>
    ),
  },
  {
    name: "Xero",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M4 4h6l2 3 2-3h6l-5 7 5 9h-6l-2-3.5L9 20H3l5-9-4-7z" />
      </svg>
    ),
  },
  {
    name: "Sage",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.2L6.5 8.3v7.4L12 18.8l5.5-3.1V8.3L12 5.2z" />
      </svg>
    ),
  },
  {
    name: "FreshBooks",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
];

function PartnerTrack({
  trackId,
  ariaHidden = false,
}: {
  trackId: string;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {partners.map((partner) => (
        <PartnerLogo
          key={`${trackId}-${partner.name}`}
          name={partner.name}
          icon={partner.icon}
        />
      ))}
    </div>
  );
}

export function AboutPartners() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="text-center text-base text-[var(--lp-text-muted)] md:text-lg">
          We partner with the best.
        </p>

        <div className="relative mt-10 w-full overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--lp-bg)] to-transparent sm:w-16 md:w-20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--lp-bg)] to-transparent sm:w-16 md:w-20"
            aria-hidden="true"
          />

          <motion.div
            className="flex w-max items-center"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 32,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <PartnerTrack trackId="a" />
            <PartnerTrack trackId="b" ariaHidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
