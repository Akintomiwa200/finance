"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqItems = [
  {
    question: "Can I try Audpay before committing?",
    category: "Getting started",
    preview: "Free trial with full feature access",
    answer:
      "Yes. Start with a free trial that includes access to all core modules — invoicing, ledger, payables, reporting, and more. No credit card required to explore the platform.",
  },
  {
    question: "Do features work together automatically?",
    category: "Platform",
    preview: "Unified data across every module",
    answer:
      "Absolutely. When you record a payment, create an invoice, or post a journal entry, Audpay updates related modules automatically. Your ledger, reports, and dashboards stay in sync without manual exports.",
  },
  {
    question: "Can I customize reports and workflows?",
    category: "Customization",
    preview: "Flexible templates and approval rules",
    answer:
      "Yes. Build custom report templates, configure approval chains, set budget thresholds, and tailor chart of accounts structures to match your business needs.",
  },
  {
    question: "Is there an API for integrations?",
    category: "Integrations",
    preview: "Connect banks, ERPs, and custom tools",
    answer:
      "Audpay offers API access and native integrations with leading accounting tools, banks, and payment providers so you can connect Audpay to your existing stack.",
  },
  {
    question: "How often are new features released?",
    category: "Product",
    preview: "Continuous improvements and updates",
    answer:
      "We ship product updates regularly based on customer feedback. New features and improvements are rolled out seamlessly — your team always has access to the latest tools.",
  },
];

export function FeaturesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[var(--lp-bg)] pb-20 pt-4 transition-colors duration-300 sm:pb-28 md:pb-36">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="text-left text-[1.625rem] font-normal leading-tight tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem]">
          Frequently asked questions.
        </h2>

        <div className="mt-8 flex flex-col gap-2.5 sm:mt-12 sm:gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `features-faq-answer-${index}`;

            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-2xl bg-[var(--lp-faq-row-bg)] transition-colors duration-300"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5 md:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-snug text-[var(--lp-text)] sm:text-[15px] md:text-base">
                      {item.question}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--lp-text-muted)] sm:text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span className="mx-1.5 hidden sm:inline">·</span>
                      <span className="block sm:inline">{item.preview}</span>
                    </p>
                  </div>

                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--lp-text)] text-[var(--lp-text)] sm:h-10 sm:w-10"
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                    ) : (
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    className="border-t border-[var(--lp-faq-row-border)] px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4 md:px-6 md:pb-6"
                  >
                    <p className="text-[13px] leading-relaxed text-[var(--lp-text-muted)] sm:text-sm md:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
