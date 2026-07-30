import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { getBlogPostBySlug } from "@/src/services/marketing.service";

type PageProps = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <article className="bg-[var(--lp-bg)] pb-20 pt-[120px] md:pb-28 md:pt-[148px]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="text-sm font-medium text-[#ff5555] no-underline hover:underline"
          >
            ← Back to blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
              {post.category}
            </span>
            <time className="text-sm text-[var(--lp-text-muted)]">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="mt-4 text-[2rem] font-semibold leading-tight tracking-tight text-[var(--lp-text)] md:text-[2.75rem]">
            {post.title}
          </h1>

          {post.imageUrl ? (
            <div className="mt-8 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-[280px] w-full object-cover md:h-[420px]"
              />
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[15px] leading-[1.85] text-[var(--lp-text-muted)] md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
      <HomeFooter />
    </div>
  );
}
