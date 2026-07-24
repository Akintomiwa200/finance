"use client";

import Link from "next/link";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small businesses and freelancers.",
    popular: false,
    features: [
      "Up to 100 invoices/month",
      "Basic financial reports",
      "1 user",
      "Email support",
      "Bank reconciliation",
      "Expense tracking",
    ],
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing businesses that need more power.",
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
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with complex needs.",
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
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Absolutely. Every plan comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, bank transfers, and PayPal. Enterprise customers can also pay via invoice.",
  },
];

export default function PricingPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />

      {/* Hero */}
      <section
        className="relative pt-[180px] pb-24 text-center"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <h1
            className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            style={{ color: "var(--lp-text)" }}
          >
            Simple, Transparent{" "}
            <span style={{ color: "#ff5555" }}>Pricing</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed md:text-xl"
            style={{ color: "var(--lp-text-muted)" }}
          >
            No hidden fees. No surprises. Choose the plan that fits your
            business.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section
        className="py-24"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col border bg-[var(--lp-nav-bg)] text-center ${
                  plan.popular
                    ? "border-[#ff5555] shadow-[0_0_40px_rgba(255,85,85,0.15)]"
                    : "border-[var(--lp-border)]"
                }`}
              >
                {plan.popular && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff5555] px-4 py-1 text-[11px] font-bold text-white"
                  >
                    Most Popular
                  </Badge>
                )}
                <CardContent className="flex flex-1 flex-col px-8 pt-10 pb-10">
                  <h3
                    className="mb-2 text-xl font-bold"
                    style={{ color: "var(--lp-text)" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="mb-6 text-sm"
                    style={{ color: "var(--lp-text-muted)" }}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span
                      className="text-5xl font-extrabold tracking-tight"
                      style={{ color: "var(--lp-text)" }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className="ml-1 text-lg font-medium"
                        style={{ color: "var(--lp-text-muted)" }}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="mb-8 flex flex-1 flex-col gap-3 text-left">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-snug"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: "#ff5555" }}
                        />
                        <span style={{ color: "var(--lp-text-muted)" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register">
                    <Button
                      className={`w-full rounded-full py-3 text-sm font-semibold ${
                        plan.popular
                          ? "bg-[#ff5555] text-white hover:brightness-110"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-24"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <h2
            className="mb-16 text-center text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--lp-text)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-[var(--lp-border)] bg-[var(--lp-nav-bg)] p-8"
              >
                <h3
                  className="mb-3 text-lg font-bold"
                  style={{ color: "var(--lp-text)" }}
                >
                  {faq.question}
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: "var(--lp-text-muted)" }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
