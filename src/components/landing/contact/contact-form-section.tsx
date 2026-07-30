"use client";

import { useState } from "react";

export function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem]">
            Get in <span className="font-bold">touch</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
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
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            const form = e.currentTarget;
            const fd = new FormData(form);
            try {
              const res = await fetch("/api/marketing/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  firstName: fd.get("firstName"),
                  lastName: fd.get("lastName"),
                  email: fd.get("email"),
                  message: fd.get("message"),
                }),
              });
              const json = await res.json();
              if (!res.ok || !json.success) {
                throw new Error(json.error ?? "Failed to send message");
              }
              setSubmitted(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to send");
            } finally {
              setLoading(false);
            }
          }}
          className="rounded-[18px] border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] p-6 shadow-[var(--lp-team-card-shadow)] md:p-8"
        >
          {submitted ? (
            <p className="py-8 text-center text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
              Thanks for reaching out. We&apos;ll get back to you within one
              business day.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {error ? <p className="text-sm text-[#ff5555]">{error}</p> : null}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                  First name
                  <input
                    name="firstName"
                    required
                    className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                  Last name
                  <input
                    name="lastName"
                    required
                    className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                Work email
                <input
                  name="email"
                  type="email"
                  required
                  className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
                Message
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-[15px] text-[var(--lp-text)] outline-none focus:border-[#ff5555]"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-full bg-[#ff5555] text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send message"}
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
