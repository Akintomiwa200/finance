const positions = [
  {
    title: "Product Designer",
    type: "Full Time",
    location: "San Francisco, CA",
  },
  {
    title: "Senior Accountant",
    type: "Full Time",
    location: "New York, NY",
  },
  {
    title: "Full Stack Engineer",
    type: "Full Time",
    location: "Remote",
  },
  {
    title: "Customer Success Manager",
    type: "Part Time",
    location: "Ontario, Canada",
  },
  {
    title: "Financial Analyst",
    type: "Full Time",
    location: "London, UK",
  },
];

export function AboutCareers() {
  return (
    <section className="bg-[var(--lp-bg)] pb-28 pt-4 md:pb-36">
      <div className="mx-auto max-w-[720px] px-6">
        <h2 className="text-center text-[2rem] font-normal tracking-tight text-[var(--lp-text)] md:text-[2.75rem]">
          Currently open positions.
        </h2>

        <div className="mt-12 flex flex-col gap-3">
          {positions.map((job) => (
            <div
              key={job.title}
              className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#f5f5f5] px-5 py-4 md:flex-row md:items-center md:px-6 md:py-5"
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
  );
}
