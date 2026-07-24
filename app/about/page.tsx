"use client";

import Link from "next/link";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Eye, Lightbulb, Shield } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We believe every business deserves complete visibility into their financial health. Our tools are built to provide clear, real-time insights without complexity.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously push the boundaries of financial technology, leveraging AI and automation to eliminate manual work and reduce errors.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Your financial data is sacred. We employ bank-grade encryption, SOC 2 compliance, and rigorous security practices to protect every transaction.",
  },
];

export default function AboutPage() {
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
            About <span style={{ color: "#ff5555" }}>Audpay</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed md:text-xl"
            style={{ color: "var(--lp-text-muted)" }}
          >
            We&apos;re on a mission to make financial management accessible,
            accurate, and effortless for every business.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section
        className="py-24"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--lp-text)" }}
          >
            Our Mission
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ background: "#ff5555" }}
          />
          <p
            className="mx-auto mt-10 max-w-3xl text-lg leading-relaxed md:text-xl"
            style={{ color: "var(--lp-text-muted)" }}
          >
            To empower businesses of all sizes with intelligent financial tools
            that simplify accounting, accelerate growth, and provide the clarity
            needed to make confident financial decisions.
          </p>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-24"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2
            className="text-center text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--lp-text)" }}
          >
            Our Values
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border border-[var(--lp-border)] bg-[var(--lp-nav-bg)] text-center"
              >
                <CardContent className="flex flex-col items-center px-8 py-10">
                  <div
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,85,85,0.15)" }}
                  >
                    <value.icon
                      className="h-7 w-7"
                      style={{ color: "#ff5555" }}
                    />
                  </div>
                  <h3
                    className="mb-4 text-xl font-bold"
                    style={{ color: "var(--lp-text)" }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: "var(--lp-text-muted)" }}
                  >
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="py-24"
        style={{ background: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--lp-text)" }}
          >
            Built by Finance People,
            <br />
            For Finance People
          </h2>
          <p
            className="mx-auto mt-10 max-w-3xl text-lg leading-relaxed md:text-xl"
            style={{ color: "var(--lp-text-muted)" }}
          >
            Audpay was founded by a team of accountants, financial analysts, and
            software engineers who experienced firsthand the frustrations of
            outdated financial tools. We built the platform we wished existed.
          </p>
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
            Ready to transform your finances?
          </h2>
          <div className="mt-10">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full bg-[#ff5555] px-10 py-5 text-base font-semibold text-white hover:brightness-110"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
