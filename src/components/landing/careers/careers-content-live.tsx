"use client";

import Link from "next/link";
import { useMarketingLive } from "@/src/hooks/use-marketing-live";

type Job = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string;
};

const perks = [
  {
    title: "Competitive compensation",
    description:
      "Salary and equity packages designed to reward impact at every stage of growth.",
  },
  {
    title: "Remote-first flexibility",
    description:
      "Work from anywhere with async-friendly collaboration and flexible hours.",
  },
  {
    title: "Health and wellness",
    description:
      "Medical, dental, and vision coverage plus a monthly wellness stipend.",
  },
  {
    title: "Learning budget",
    description:
      "Annual allowance for courses, books, and conferences to keep skills sharp.",
  },
];

export function CareersContentLive() {
  const { data: jobs, loading, error } = useMarketingLive<Job[]>("/api/marketing/careers");

  return (
    <>
      <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-xl text-left">
            <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
              Why work at <span className="font-bold">Audpay</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
              We are building tools finance teams actually enjoy using — and we
              invest in people who care about craft, clarity, and customer impact.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {perks.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 shadow-[var(--lp-team-card-shadow)] sm:px-6 sm:py-6"
              >
                <h3 className="text-base font-semibold text-[var(--lp-text)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--lp-bg)] pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-[1.625rem] font-normal tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem]">
            Currently open positions.
          </h2>

          {loading ? (
            <p className="mt-10 text-center text-[var(--lp-text-muted)]">Loading roles…</p>
          ) : error ? (
            <p className="mt-10 text-center text-[var(--lp-text-muted)]">{error}</p>
          ) : (
            <div className="mt-10 flex flex-col gap-3">
              {jobs?.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[var(--lp-faq-row-bg)] px-5 py-4 md:flex-row md:items-center md:px-6 md:py-5"
                >
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--lp-text)] md:text-base">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-[var(--lp-text-muted)]">
                      {job.type} · {job.location}
                    </p>
                  </div>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="shrink-0 rounded-full border border-[var(--lp-text)] bg-transparent px-5 py-2 text-sm font-medium text-[var(--lp-text)] no-underline transition-colors hover:bg-[var(--lp-text)] hover:text-white"
                  >
                    View & Apply
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
