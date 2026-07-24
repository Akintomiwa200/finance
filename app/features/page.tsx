"use client";

import Link from "next/link";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { Button } from "@/src/components/ui/button";
import {
  FileText,
  BookOpen,
  CreditCard,
  BarChart3,
  Target,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Invoicing",
    description:
      "Create professional invoices in seconds. Automate recurring bills, set payment reminders, and track payment status in real-time. Supports multiple currencies and tax configurations.",
  },
  {
    icon: BookOpen,
    title: "General Ledger",
    description:
      "Maintain a complete, auditable record of every financial transaction. Our double-entry bookkeeping system ensures accuracy with automatic journal entries and real-time balance updates.",
  },
  {
    icon: CreditCard,
    title: "Accounts Payable",
    description:
      "Manage vendors, track bills, process payments, and maintain healthy vendor relationships. Automated 3-way matching and approval workflows keep your payables process efficient.",
  },
  {
    icon: BarChart3,
    title: "Financial Reporting",
    description:
      "Generate balance sheets, profit & loss statements, trial balances, and custom reports with a single click. Schedule automated reports and share them with stakeholders.",
  },
  {
    icon: Target,
    title: "Budget Management",
    description:
      "Set departmental budgets, track variances in real-time, and forecast future spending. Get alerts before you exceed thresholds and make data-driven budget decisions.",
  },
  {
    icon: Globe,
    title: "Multi-Currency & Compliance",
    description:
      "Operate globally with support for 150+ currencies, automatic exchange rates, and built-in tax compliance reporting for multiple jurisdictions.",
  },
];

export default function FeaturesPage() {
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
            Powerful <span style={{ color: "#ff5555" }}>Features</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed md:text-xl"
            style={{ color: "var(--lp-text-muted)" }}
          >
            Everything you need to manage your finances in one platform.
          </p>
        </div>
      </section>

      {/* Features List */}
      <section
        className="py-24"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-20">
            {features.map((feature, i) => {
              const isReversed = i % 2 !== 0;
              return (
                <div
                  key={feature.title}
                  className={`flex flex-col items-center gap-12 md:flex-row md:items-center ${
                    isReversed ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon block */}
                  <div className="flex w-full justify-center md:w-1/2">
                    <div
                      className="flex h-48 w-48 items-center justify-center rounded-3xl"
                      style={{ background: "rgba(255,85,85,0.1)" }}
                    >
                      <feature.icon
                        className="h-20 w-20"
                        style={{ color: "#ff5555" }}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-1/2">
                    <h2
                      className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl"
                      style={{ color: "var(--lp-text)" }}
                    >
                      {feature.title}
                    </h2>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ color: "var(--lp-text-muted)" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 text-center"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <h2
            className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--lp-text)" }}
          >
            Ready to get started?
          </h2>
          <div className="mt-10">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full bg-[#ff5555] px-10 py-5 text-base font-semibold text-white hover:brightness-110"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
