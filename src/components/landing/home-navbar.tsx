"use client";

// src/components/landing/home-navbar.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingSpark } from "@/src/components/landing/landing-spark";
import { SplashBlob } from "@/src/components/landing/splash-blob";

const navItems: { label: string; href: string; active?: boolean }[] = [
  { label: "Home", href: "#", active: true },
  { label: "About Us", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Features", href: "#" },
];

function UifryLogo() {
  return (
    <span
      className="relative inline-flex h-7 w-[22px] shrink-0"
      aria-hidden="true"
    >
      <span className="absolute inset-0 rotate-[18deg] rounded-[50%_50%_42%_42%] bg-[#ff5555]" />
      <span className="absolute -top-0.5 left-[3px] h-4 w-3 -rotate-[8deg] rounded-[50%_50%_8%_50%] bg-[#ff5555]" />
      <span className="absolute bottom-[5px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-white" />
    </span>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="flex h-5 flex-col items-center justify-center gap-[5px] w-5">
      <span
        className={`block h-[2px] rounded-sm bg-white transition-all duration-300 w-full ${
          open ? "translate-y-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`block h-[2px] rounded-sm bg-white transition-all duration-300 w-3/4 self-end ${
          open ? "scale-x-0 opacity-0" : ""
        }`}
      />
      <span
        className={`block h-[2px] rounded-sm bg-white transition-all duration-300 w-full ${
          open ? "-translate-y-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--lp-nav-bg)]" aria-label="Main navigation">
      {/* Splash glow that connects navbar to hero */}
      <SplashBlob className="left-[236px] top-0" />
      {/* ── Main bar ── */}
      <div className="mx-auto max-w-7xl flex min-h-[76px] items-center justify-between px-5 py-4 md:min-h-[88px] md:px-8 lg:min-h-[104px] lg:px-20 lg:py-[18px]">
        {/* LEFT: logo + nav links */}
        <div className="flex items-center">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 text-[1.35rem] font-extrabold tracking-[-0.04em] text-[var(--lp-nav-text)] no-underline lg:text-[1.58rem]"
            aria-label="Uifry home"
          >
            <UifryLogo />
            <span className="leading-none">uifry</span>
            <sup className="ml-0.5 mt-1 text-[0.45rem] font-bold leading-none text-[var(--lp-nav-text-muted)]">
              ™
            </sup>
          </a>

          {/* Desktop nav links */}
          <div className="relative ml-14 hidden md:block lg:ml-[56px]">
            {/* Red radial glow behind active link */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,85,85,0.22)_0%,transparent_72%)] blur-2xl"
              aria-hidden="true"
            />
            <ul className="relative flex list-none items-center gap-8 p-0">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={
                      item.active
                        ? "text-[0.94rem] font-semibold text-[var(--lp-red)] no-underline"
                        : "text-[0.94rem] font-medium text-[var(--lp-nav-text-muted)] no-underline transition-colors hover:text-[var(--lp-red)]"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: download button + star + hamburger */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Get Started button — hidden on mobile, shown md+ */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="hidden rounded-full bg-[#ff5555] px-7 py-3 text-[0.9rem] font-semibold text-white transition-all hover:brightness-110 md:block lg:h-[49px] lg:min-w-[145px]"
          >
            Get Started
          </button>

          {/* Real Figma star — desktop only */}
          <LandingSpark className="hidden lg:block text-gray-300" size={52} />

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="block md:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 flex flex-col border-t border-[var(--lp-border)] bg-[var(--lp-nav-bg)] px-6 pb-8 pt-4 shadow-[0_8px_32px_rgba(0,0,0,0.10)] md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {/* Mobile nav links */}
          <ul className="mb-5 flex list-none flex-col p-0">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`block border-b border-[var(--lp-border)] py-4 text-[1.05rem] no-underline transition-colors last:border-none ${
                      item.active
                        ? "font-semibold text-[var(--lp-red)]"
                        : "font-medium text-[var(--lp-nav-text-muted)] hover:text-[var(--lp-red)]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
          </ul>

          {/* Mobile Get Started button */}
          <button
            type="button"
            onClick={() => { router.push("/login"); setMobileOpen(false); }}
            className="w-full rounded-full bg-[#ff5555] py-3 text-[1rem] font-semibold text-white transition-all hover:brightness-110"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
