import { LandingSpark } from "@/src/components/landing/landing-spark";

const navItems: { label: string; href: string; active?: boolean }[] = [
  { label: "Home", href: "#", active: true },
  { label: "About Us", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Features", href: "#" },
];

function UifryLogo() {
  return (
    <span className="relative inline-flex h-7 w-[22px] shrink-0" aria-hidden="true">
      <span className="absolute inset-0 rotate-[18deg] rounded-[50%_50%_42%_42%] bg-[#ff5555]" />
      <span className="absolute -top-0.5 left-[3px] h-4 w-3 -rotate-[8deg] rounded-[50%_50%_8%_50%] bg-[#ff5555]" />
      <span className="absolute bottom-[5px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-white" />
    </span>
  );
}

export function HomeNavbar() {
  return (
    <nav
      className="flex min-h-[76px] items-center justify-between bg-white px-5 py-4 md:min-h-[88px] md:px-8 lg:min-h-[104px] lg:px-20 lg:py-[18px]"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-6 md:gap-10 lg:gap-14">
        <a
          href="#"
          className="flex items-center gap-2 text-[1.35rem] font-extrabold tracking-[-0.04em] text-black no-underline lg:text-[1.58rem]"
          aria-label="Uifry home"
        >
          <UifryLogo />
          <span className="leading-none">uifry</span>
          <sup className="ml-0.5 mt-1 text-[0.45rem] font-bold leading-none text-black">™</sup>
        </a>

        <div className="relative hidden md:block">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,85,85,0.22)_0%,transparent_72%)] blur-2xl"
            aria-hidden="true"
          />
          <ul className="relative flex list-none items-center gap-8 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={
                    item.active
                      ? "text-[0.94rem] font-semibold text-[#ff5555] no-underline"
                      : "text-[0.94rem] font-medium text-black no-underline transition-colors hover:text-[#ff5555]"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-8 lg:gap-12">
        <button
          type="button"
          className="rounded-md bg-black px-7 py-3 text-[0.9rem] font-semibold text-white transition-colors hover:bg-neutral-800 lg:h-[49px] lg:min-w-[145px]"
        >
          Download
        </button>
        <LandingSpark className="hidden lg:block" size={52} />
      </div>
    </nav>
  );
}
