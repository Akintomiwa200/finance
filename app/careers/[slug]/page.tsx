import Link from "next/link";
import { notFound } from "next/navigation";
import { CareerApplyForm } from "@/src/components/landing/careers/career-apply-form";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { getJobListingBySlug } from "@/src/services/marketing.service";

type PageProps = { params: Promise<{ slug: string }> };

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobListingBySlug(slug);
  if (!job) notFound();

  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <section className="bg-[var(--lp-bg)] pb-20 pt-[120px] md:pb-28 md:pt-[148px]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Link
              href="/careers"
              className="text-sm font-medium text-[#ff5555] no-underline hover:underline"
            >
              ← Back to careers
            </Link>
            <h1 className="mt-6 text-[2rem] font-semibold leading-tight text-[var(--lp-text)] md:text-[2.75rem]">
              {job.title}
            </h1>
            <p className="mt-3 text-[15px] text-[var(--lp-text-muted)]">
              {job.type} · {job.location}
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--lp-text)]">About the role</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.85] text-[var(--lp-text-muted)]">
                  {job.description}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--lp-text)]">Requirements</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.85] text-[var(--lp-text-muted)]">
                  {job.requirements}
                </p>
              </div>
            </div>
          </div>

          <CareerApplyForm slug={slug} />
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}
