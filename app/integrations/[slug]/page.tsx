import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { getIntegrationBySlug } from "@/src/services/marketing.service";

type PageProps = { params: Promise<{ slug: string }> };

export default async function IntegrationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const integration = await getIntegrationBySlug(slug);
  if (!integration) notFound();

  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <section className="bg-[var(--lp-bg)] pb-20 pt-[120px] md:pb-28 md:pt-[148px]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Link
            href="/integrations"
            className="text-sm font-medium text-[#ff5555] no-underline hover:underline"
          >
            ← Back to integrations
          </Link>

          <span className="mt-6 block text-xs font-bold uppercase tracking-[0.12em] text-[#ff5555]">
            {integration.category}
          </span>
          <h1 className="mt-3 text-[2rem] font-semibold leading-tight text-[var(--lp-text)] md:text-[2.75rem]">
            {integration.name}
          </h1>
          <p className="mt-4 text-[15px] leading-[1.85] text-[var(--lp-text-muted)] md:text-base">
            {integration.description}
          </p>

          {integration.content ? (
            <div className="mt-8 rounded-2xl border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] p-6 shadow-[var(--lp-team-card-shadow)]">
              <p className="text-[15px] leading-[1.85] text-[var(--lp-text-muted)]">
                {integration.content}
              </p>
            </div>
          ) : null}

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff5555] px-7 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
            >
              Request setup help
            </Link>
          </div>
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}
