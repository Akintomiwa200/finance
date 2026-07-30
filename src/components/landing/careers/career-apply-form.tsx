"use client";

import { useState } from "react";

export function CareerApplyForm({ slug }: { slug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="rounded-[18px] border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] p-6 shadow-[var(--lp-team-card-shadow)] md:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const form = e.currentTarget;
        const fd = new FormData(form);

        try {
          const res = await fetch(`/api/marketing/careers/${slug}/apply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: fd.get("firstName"),
              lastName: fd.get("lastName"),
              email: fd.get("email"),
              phone: fd.get("phone"),
              coverLetter: fd.get("coverLetter"),
            }),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error ?? "Failed to submit application");
          }
          setSubmitted(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to submit");
        } finally {
          setLoading(false);
        }
      }}
    >
      {submitted ? (
        <p className="py-6 text-center text-[15px] leading-relaxed text-[var(--lp-text-muted)]">
          Application submitted. Our team will review it and get back to you soon.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-semibold text-[var(--lp-text)]">Apply for this role</h3>
          {error ? <p className="text-sm text-[#ff5555]">{error}</p> : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
              First name
              <input
                name="firstName"
                required
                className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] outline-none focus:border-[#ff5555]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
              Last name
              <input
                name="lastName"
                required
                className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] outline-none focus:border-[#ff5555]"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
            Email
            <input
              name="email"
              type="email"
              required
              className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] outline-none focus:border-[#ff5555]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
            Phone (optional)
            <input
              name="phone"
              className="h-12 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 text-[15px] outline-none focus:border-[#ff5555]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--lp-text)]">
            Cover letter
            <textarea
              name="coverLetter"
              required
              rows={5}
              className="rounded-xl border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-[15px] outline-none focus:border-[#ff5555]"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-full bg-[#ff5555] text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit application"}
          </button>
        </div>
      )}
    </form>
  );
}
