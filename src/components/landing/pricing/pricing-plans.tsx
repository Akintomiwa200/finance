"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  monthlyPrice: number | null;
  description: string;
  popular: boolean;
  features: string[];
  cta: string;
  href: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 29,
    description: "Perfect for small businesses and freelancers getting started.",
    popular: false,
    features: [
      "Up to 100 invoices/month",
      "Basic financial reports",
      "1 user",
      "Email support",
      "Bank reconciliation",
      "Expense tracking",
    ],
    cta: "Start free trial",
    href: "/register",
  },
  {
    name: "Professional",
    monthlyPrice: 79,
    description: "For growing businesses that need more power and flexibility.",
    popular: true,
    features: [
      "Unlimited invoices",
      "Advanced analytics & reports",
      "Up to 10 users",
      "Priority support",
      "Multi-currency support",
      "Custom chart of accounts",
      "Approval workflows",
      "API access",
    ],
    cta: "Start free trial",
    href: "/register",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    description: "For organizations with complex needs and custom requirements.",
    popular: false,
    features: [
      "Everything in Professional",
      "Unlimited users",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    cta: "Contact sales",
    href: "/register",
  },
];

function formatPrice(monthlyPrice: number | null, annual: boolean) {
  if (monthlyPrice === null) return "Custom";
  const price = annual ? Math.round(monthlyPrice * 0.8) : monthlyPrice;
  return `$${price}`;
}

export function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="bg-[var(--lp-team-section-bg)] py-16 transition-colors duration-300 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="text-[1.625rem] font-normal tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem]">
            Choose your <span className="font-bold">plan</span>
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
            Every plan includes a 14-day free trial. Switch or cancel anytime.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] p-1.5 shadow-[var(--lp-team-card-shadow)]">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !annual
                  ? "bg-[var(--lp-text)] text-[var(--lp-bg)]"
                  : "text-[var(--lp-text-muted)] hover:text-[var(--lp-text)]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                annual
                  ? "bg-[var(--lp-text)] text-[var(--lp-bg)]"
                  : "text-[var(--lp-text-muted)] hover:text-[var(--lp-text)]"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs font-semibold text-[#ff5555]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-[var(--lp-team-card-bg)] px-5 py-6 shadow-[var(--lp-team-card-shadow)] transition-colors duration-300 sm:px-6 sm:py-7 ${
                plan.popular
                  ? "border-[#ff5555] ring-1 ring-[#ff5555]/20"
                  : "border-[var(--lp-team-card-border)]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ff5555] px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}

              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--lp-text)]">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                  {plan.description}
                </p>
              </div>

              <div className="mt-6 text-left">
                <span className="text-[2.5rem] font-bold leading-none tracking-tight text-[var(--lp-text)] md:text-[2.75rem]">
                  {formatPrice(plan.monthlyPrice, annual)}
                </span>
                {plan.monthlyPrice !== null && (
                  <span className="ml-1 text-base font-medium text-[var(--lp-text-muted)]">
                    /month
                  </span>
                )}
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3 text-left">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-snug text-[var(--lp-text-muted)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5555]"
                      strokeWidth={2.5}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold no-underline transition-all ${
                  plan.popular
                    ? "bg-[#ff5555] text-white hover:brightness-110"
                    : "border border-[var(--lp-text)] text-[var(--lp-text)] hover:bg-[var(--lp-text)] hover:text-[var(--lp-bg)]"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
