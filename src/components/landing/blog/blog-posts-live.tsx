"use client";

import Link from "next/link";
import { useMarketingLive } from "@/src/hooks/use-marketing-live";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string | null;
  publishedAt: string;
};

export function BlogPostsLive() {
  const { data, loading, error } = useMarketingLive<BlogPost[]>("/api/marketing/blog");

  if (loading) {
    return (
      <section className="bg-[var(--lp-bg)] py-16 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-[var(--lp-text-muted)]">Loading articles…</p>
        </div>
      </section>
    );
  }

  if (error || !data?.length) {
    return (
      <section className="bg-[var(--lp-bg)] py-16 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-[var(--lp-text-muted)]">
            {error ?? "No articles published yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--lp-bg)] py-16 transition-colors duration-300 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-[18px] border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] shadow-[var(--lp-team-card-shadow)] transition-shadow hover:shadow-lg"
            >
              {post.imageUrl ? (
                <div className="h-[180px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
                    {post.category}
                  </span>
                  <time className="text-xs text-[var(--lp-text-muted)]">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug text-[var(--lp-text)]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-block text-sm font-medium text-[#ff5555]">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
