"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";

export const REPORT_TABS = [
  { label: "Revenue", href: "/admin/reports/revenue" },
  { label: "Growth", href: "/admin/reports/growth" },
  { label: "Usage", href: "/admin/reports/usage" },
  { label: "Platform Health", href: "/admin/reports/platform-health" },
] as const;

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  const [, m] = key.split("-");
  return MONTH_LABELS[Number(m) - 1] ?? key;
}

export function DashCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ViewPill({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
    >
      View
    </Link>
  );
}

export function ReportTabs({ activeHref }: { activeHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {REPORT_TABS.map((tab) => (
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

export function PeriodToggle({
  value,
  onChange,
}: {
  value: "6m" | "12m";
  onChange: (v: "6m" | "12m") => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
      {(["6m", "12m"] as const).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
            value === p
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {p.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function buildScaledTimeline(
  current: number,
  months: number,
  growthRate = 0.08,
  key: string,
) {
  const data = [];
  for (let i = months - 1; i >= 0; i--) {
    const factor = Math.pow(1 + growthRate, -i);
    const monthIndex = (new Date().getMonth() - i + 12) % 12;
    data.push({
      month: MONTH_LABELS[monthIndex],
      [key]: Math.max(0, Math.round(current * factor)),
    });
  }
  return data;
}
