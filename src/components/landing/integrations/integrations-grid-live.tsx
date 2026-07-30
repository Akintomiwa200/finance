"use client";

import Link from "next/link";
import { useMarketingLive } from "@/src/hooks/use-marketing-live";

type Integration = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
};

export function IntegrationsGridLive() {
  const { data, loading, error } = useMarketingLive<Integration[]>(
    "/api/marketing/integrations",
  );

  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
            Works with the tools you <span className="font-bold">already use</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            Connect your accounting, banking, and productivity stack without
            manual exports or duplicate data entry.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-[var(--lp-text-muted)]">Loading integrations…</p>
        ) : error ? (
          <p className="mt-10 text-[var(--lp-text-muted)]">{error}</p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {data?.map((item) => (
              <Link
                key={item.id}
                href={`/integrations/${item.slug}`}
                className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 no-underline shadow-[var(--lp-team-card-shadow)] transition-shadow hover:shadow-lg sm:px-6 sm:py-6"
              >
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
                  {item.category}
                </span>
                <h3 className="mt-3 text-base font-semibold text-[var(--lp-text)]">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                  {item.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-[#ff5555]">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-[18px] md:mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80"
            alt="Integration dashboard overview"
            className="h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
