import { LandingImageHero } from "@/src/components/landing/shared/landing-image-hero";

const heroImages = {
  main: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=680&h=440&fit=crop&q=80",
};

export function CareersHero() {
  return (
    <LandingImageHero
      title="Build the future of"
      highlight="business finance."
      subtitle="Join a remote-first team helping companies make smarter financial decisions every day."
      images={heroImages}
      alt={{
        main: "Audpay team collaborating",
        top: "Team meeting in modern office",
        bottom: "Developers working together",
      }}
    />
  );
}

export const careersStats = [
  { value: "40+", label: "Team members worldwide" },
  { value: "12", label: "Countries represented" },
  { value: "Remote", label: "First culture" },
  { value: "4.8★", label: "Employee satisfaction" },
];

export const careersFaq = [
  {
    question: "Where is Audpay hiring?",
    category: "Locations",
    preview: "Remote roles across multiple time zones",
    answer:
      "Most roles are fully remote. We also have hubs in San Francisco, New York, and London for team members who prefer hybrid work.",
  },
  {
    question: "What is the interview process?",
    category: "Hiring",
    preview: "Intro call, skills review, team chat",
    answer:
      "Our process typically includes a recruiter intro, a role-specific exercise or portfolio review, and final conversations with the hiring manager and teammates.",
  },
  {
    question: "Do you offer equity?",
    category: "Benefits",
    preview: "Equity for full-time employees",
    answer:
      "Yes. Full-time employees receive competitive equity grants as part of their compensation package.",
  },
];

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

const positions = [
  { title: "Product Designer", type: "Full Time", location: "Remote" },
  { title: "Senior Accountant", type: "Full Time", location: "New York, NY" },
  { title: "Full Stack Engineer", type: "Full Time", location: "Remote" },
  {
    title: "Customer Success Manager",
    type: "Part Time",
    location: "Ontario, Canada",
  },
  { title: "Financial Analyst", type: "Full Time", location: "London, UK" },
];

export function CareersContent() {
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

          <div className="mt-10 flex flex-col gap-3">
            {positions.map((job) => (
              <div
                key={job.title}
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
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-[var(--lp-text)] bg-transparent px-5 py-2 text-sm font-medium text-[var(--lp-text)] transition-colors hover:bg-[var(--lp-text)] hover:text-white"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
