const blobStyles = [
  "bg-[#3b82f6]/85 rounded-[45%_55%_70%_30%/40%_50%_50%_60%]",
  "bg-[#8b5cf6]/85 rounded-[60%_40%_30%_70%/50%_60%_40%_50%]",
  "bg-[#f59e0b]/85 rounded-[50%_50%_40%_60%/60%_40%_60%_40%]",
  "bg-[#ec4899]/85 rounded-[40%_60%_55%_45%/55%_45%_55%_45%]",
];

const team = [
  {
    name: "James Wilson",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&q=80",
  },
  {
    name: "Sarah Chen",
    role: "Head of Finance",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&q=80",
  },
  {
    name: "Marcus Adeyemi",
    role: "Lead Engineer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&q=80",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Success",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=750&fit=crop&q=80",
  },
];

function SocialLinks() {
  const links = [
    {
      label: "Facebook",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "Twitter",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center gap-2.5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] text-[var(--lp-text-muted)] transition-all duration-200 hover:border-[var(--lp-text)] hover:text-[var(--lp-text)]"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

export function AboutTeam() {
  return (
    <section className="bg-[var(--lp-team-section-bg)] py-20 transition-colors duration-300 md:py-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="text-[2rem] font-normal tracking-tight text-[var(--lp-text)] md:text-[2.75rem] lg:text-[3rem]">
            The <span className="font-bold">Audpay</span> team.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
            We have spent years scaling startups, building financial products, and
            working at big tech — including Google, Amazon, Deloitte, Stripe,
            Intuit, and Goldman Sachs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {team.map((member, i) => (
            <article
              key={member.name}
              className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] shadow-[var(--lp-team-card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--lp-team-image-bg)]">
                <div
                  className={`absolute bottom-6 left-1/2 h-[120px] w-[120px] -translate-x-1/2 ${blobStyles[i % blobStyles.length]}`}
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt=""
                  className="relative z-10 h-full w-full object-cover object-[center_15%] grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[var(--lp-team-card-bg)] via-[var(--lp-team-card-bg)]/60 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col px-5 pb-6 pt-4 text-center">
                <h3 className="text-[17px] font-semibold tracking-tight text-[var(--lp-text)]">
                  {member.name}
                </h3>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--lp-text-muted)]">
                  {member.role}
                </p>
                <div className="my-5 h-px w-full bg-[var(--lp-team-card-border)]" />
                <SocialLinks />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
