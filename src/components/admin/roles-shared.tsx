"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { DashCard } from "@/src/components/admin/reports-shared";

export const ROLE_TABS = [
  { label: "Privilege Groups", href: "/admin/roles/groups" },
  { label: "Permissions", href: "/admin/roles/permissions" },
  { label: "Assignments", href: "/admin/roles/assignments" },
  { label: "System Roles", href: "/admin/roles/system" },
] as const;

export function RoleTabs({ activeHref }: { activeHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLE_TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium no-underline transition-colors",
            tab.href === activeHref
              ? "bg-foreground text-background"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <DashCard className={cn("!p-4", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </DashCard>
  );
}

export function PlatformTeamBanner({
  title,
  description,
  icon,
  action,
  meta,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
          {icon}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          {(action || meta) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {action}
              {meta}
            </div>
          )}
        </div>
      </div>
    </DashCard>
  );
}

export function formatAreaLabel(area: string) {
  return area
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function permissionLevelVariant(level: string) {
  if (level === "full") return "success" as const;
  if (level === "none") return "default" as const;
  return "info" as const;
}
