"use client";

import Link from "next/link";
import { useState } from "react";

export function HomeFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[var(--lp-bg)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0">
        <span className="text-[12vw] font-extrabold text-white/[0.03] leading-none tracking-tight whitespace-nowrap">
          Audpay
        </span>
      </div>
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-[30px] relative z-10">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr] lg:gap-8 mb-14">
          {/* Brand + Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-8">
              <svg width="34" height="34" viewBox="0 0 22 26" fill="none">
                <path d="M11 0C11 0 14 5 14 9C14 9 17 7 17 4C17 4 22 8 22 14C22 20.627 17.075 26 11 26C4.925 26 0 20.627 0 14C0 8 5 3 5 3C5 3 5 8 8 9C8 9 8 4 11 0Z" fill="#FF5555" />
                <path d="M11 14C11 14 13 16 13 18.5C13 20.433 12.105 22 11 22C9.895 22 9 20.433 9 18.5C9 16 11 14 11 14Z" fill="white" opacity="0.6" />
              </svg>
              <span className="text-[28px] font-extrabold text-[var(--lp-text)] leading-none tracking-tight">
                Audpay<sup className="text-[9px] font-bold ml-0.5 align-super">™</sup>
              </span>
            </div>

            <div className="space-y-4">
              <a href="mailto:support@audpay.com" className="flex items-center gap-3 text-base font-medium text-[var(--lp-text-muted)] hover:text-[#ff5555] transition-colors">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff5555]">
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
                    <path d="M1.5 1.5L8.5 7L15.5 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="0.75" y="0.75" width="15.5" height="11.5" rx="1.5" stroke="white" strokeWidth="1.5" />
                  </svg>
                </span>
                support@audpay.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-3 text-base font-medium text-[var(--lp-text-muted)] hover:text-[#ff5555] transition-colors">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff5555]">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 1.5C3 1.5 4.2 1.5 4.8 2.9C5.4 4.3 4.5 5 5 5.8C5.6 6.7 7.1 8.1 8.1 8.7C9.1 9.3 9.7 8.4 11.1 9C12.5 9.6 12.5 11.3 12.5 11.3C12.5 11.3 10.5 13.3 7.3 10.1C4.1 6.9 1 3.8 3 1.5Z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-[var(--lp-text)] mb-5">Company</h3>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-[var(--lp-text-muted)] hover:text-[#ff5555] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-[var(--lp-text)] mb-5">Product</h3>
            <ul className="space-y-4">
              {[
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Integrations", href: "/integrations" },
                { label: "Changelog", href: "/changelog" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-[var(--lp-text-muted)] hover:text-[#ff5555] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-[var(--lp-text)] mb-5">Legal</h3>
            <ul className="space-y-4">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "GDPR", href: "/gdpr" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-[var(--lp-text-muted)] hover:text-[#ff5555] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base font-bold uppercase tracking-wider text-[var(--lp-text)] mb-5">Stay Updated</h3>
            <p className="text-base leading-relaxed text-[var(--lp-text-muted)]">
              Get the latest on product updates, finance tips, and industry insights.
            </p>

            <div className="h-8 shrink-0" aria-hidden="true" />

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email.trim()) return;
                try {
                  const res = await fetch("/api/marketing/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.trim() }),
                  });
                  const json = await res.json();
                  if (json.success) setEmail("");
                } catch {
                  // silent fail for footer UX
                }
              }}
              className="flex"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full min-w-0 rounded-l-lg border border-r-0 border-[var(--lp-border)] bg-transparent px-4 text-base text-[var(--lp-text)] placeholder:text-[var(--lp-text-muted)] outline-none focus:border-[#ff5555] transition-colors"
              />
              <button type="submit" className="h-12 px-4 rounded-r-lg bg-[#ff5555] text-sm font-semibold text-white hover:brightness-110 transition-all shrink-0 border-none cursor-pointer whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ── Divider ── */}
        <hr className="border-none h-px bg-white/10 mb-7" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-base text-[var(--lp-text-muted)]">
            &copy; {new Date().getFullYear()} Audpay. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Twitter", "LinkedIn", "GitHub"].map((platform) => (
              <a key={platform} href="#" className="text-base text-[var(--lp-text-muted)] hover:text-[#ff5555] transition-colors">
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
