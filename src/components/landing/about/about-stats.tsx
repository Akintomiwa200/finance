const stats = [
  { value: "2,400+", label: "Businesses served" },
  { value: "$48M+", label: "Transactions processed" },
  { value: "15,000+", label: "Invoices generated" },
  { value: "40+", label: "Countries supported" },
];

export function AboutStats() {
  return (
    <section className="bg-[var(--lp-bg)] pb-16 transition-colors duration-300 md:pb-24">
      <div className="relative mx-auto max-w-[1140px] px-6">
        <div
          className="pointer-events-none absolute inset-x-8 top-1/2 h-[120px] -translate-y-1/2 transition-opacity duration-300 md:inset-x-16 md:h-[140px]"
          aria-hidden="true"
        >
          <div
            className="absolute left-[8%] top-1/2 h-24 w-40 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-300 dark:opacity-90"
            style={{
              background:
                "radial-gradient(circle, var(--lp-stats-glow-pink) 0%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-300 dark:opacity-90"
            style={{
              background:
                "radial-gradient(circle, var(--lp-stats-glow-purple) 0%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />
          <div
            className="absolute right-[8%] top-1/2 h-24 w-40 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-300 dark:opacity-90"
            style={{
              background:
                "radial-gradient(circle, var(--lp-stats-glow-blue) 0%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />
        </div>

        <div
          className="relative overflow-hidden rounded-[20px] border py-8 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 md:py-10"
          style={{
            backgroundColor: "var(--lp-stats-glass-bg)",
            borderColor: "var(--lp-stats-glass-border)",
            boxShadow: "var(--lp-stats-glass-shadow)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 dark:from-white/[0.04] dark:to-white/[0.02]"
            aria-hidden="true"
          />

          <div className="about-stats-grid relative grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-4 py-3 text-center md:px-6"
              >
                <p className="text-[1.75rem] font-bold leading-none tracking-tight text-[var(--lp-text)] transition-colors duration-300 md:text-[2.5rem] lg:text-[2.75rem]">
                  {stat.value}
                </p>
                <p className="mt-2.5 text-xs text-[var(--lp-text-muted)] transition-colors duration-300 md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
