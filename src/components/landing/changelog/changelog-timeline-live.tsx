"use client";

import { useMarketingLive } from "@/src/hooks/use-marketing-live";

type ChangelogEntry = {
  id: string;
  version: string;
  title: string;
  items: string[];
  publishedAt: string;
};

export function ChangelogTimelineLive() {
  const { data, loading, error } = useMarketingLive<ChangelogEntry[]>(
    "/api/marketing/changelog",
  );

  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl text-left">
          <h2 className="text-[1.625rem] font-normal leading-[1.15] tracking-tight text-[var(--lp-text)] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]">
            Recent <span className="font-bold">releases</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            A running log of what we have shipped — updated in real time as new
            releases go live.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-[var(--lp-text-muted)]">Loading changelog…</p>
        ) : error ? (
          <p className="mt-10 text-[var(--lp-text-muted)]">{error}</p>
        ) : (
          <div className="mt-10 flex flex-col gap-4">
            {data?.map((release) => (
              <article
                key={release.id}
                className="rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] px-5 py-5 shadow-[var(--lp-team-card-shadow)] sm:px-6 sm:py-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[rgba(255,85,85,0.1)] px-3 py-1 text-xs font-bold text-[#ff5555]">
                    {release.version}
                  </span>
                  <time className="text-sm text-[var(--lp-text-muted)]">
                    {new Date(release.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--lp-text)] md:text-lg">
                  {release.title}
                </h3>
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-[var(--lp-text-muted)] md:text-[15px]">
                  {(release.items as string[]).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
