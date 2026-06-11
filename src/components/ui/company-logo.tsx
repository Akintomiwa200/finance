"use client";

import { cn } from "@/src/lib/utils";

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CompanyLogo({
  name,
  logo,
  size = 40,
  className,
}: {
  name: string;
  logo?: string | null;
  size?: number;
  className?: string;
}) {
  const style = { width: size, height: size };

  if (logo) {
    return (
      <img
        src={logo}
        alt={`${name} logo`}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={style}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-xs font-semibold text-accent-600",
        className,
      )}
      style={style}
      aria-hidden
    >
      {initialsFromName(name || "?")}
    </div>
  );
}
