"use client";

import { useState } from "react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-[var(--lp-bg)] pb-24 md:pb-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="text-xl font-semibold text-[var(--lp-text)] md:text-2xl">
            Get in touch
          </h2>
          <div className="h-4 shrink-0" aria-hidden="true" />
          <p className="text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
            Whether you have a product question, need a demo, or want to discuss
            enterprise plans — our team is here to help.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <a
              href="mailto:support@audpay.com"
              className="text-[15px] font-medium text-[var(--lp-text)] hover:text-[#ff5555]"
            >
              support@audpay.com
            </a>
            <a
              href="tel:+15551234567"
              className="text-[15px] font-medium text-[var(--lp-text)] hover:text-[#ff5555]"
            >
              +1 (555) 123-4567
            </a>
            <p className="text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
              100 Market Street, Suite 400
              <br />
              San Francisco, CA 94105
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="rounded-[24px] border border-[var(--lp-border)] bg-[var(--lp-card-bg)] p-6 md:p-8"
        >
          {submitted ? (
            <p className="py-8 text-center text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
              Thanks for reaching out. We&apos;ll get back to you within one
              business day.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                  First name
                  <input
                    required
                    type="text"
                    className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                  Last name
                  <input
                    required
                    type="text"
                    className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                Work email
                <input
                  required
                  type="email"
                  className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                Message
                <textarea
                  required
                  rows={5}
                  className="rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                />
              </label>
              <button
                type="submit"
                className="h-12 rounded-full bg-[#ff5555] text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                Send message
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
