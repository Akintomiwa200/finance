"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  MoreHorizontal,
  Headphones,
  Video,
  X,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import {
  CHART_COLORS,
  getChartTooltipStyle,
  getChartAxisColor,
} from "@/src/components/charts/chart-theme";
import type { AdminOrganization, AdminStats } from "@/src/types/admin";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { cn } from "@/src/lib/utils";

const tenantActivityData = [
  { day: "Mon", value: 12 },
  { day: "Tue", value: 18 },
  { day: "Wed", value: 15 },
  { day: "Thu", value: 24 },
  { day: "Fri", value: 20 },
  { day: "Sat", value: 11 },
  { day: "Sun", value: 9 },
];

const weeklyRevenueData = [
  { day: "Mon", value: 180, active: false },
  { day: "Tue", value: 220, active: false },
  { day: "Wed", value: 195, active: false },
  { day: "Thu", value: 320, active: true },
  { day: "Fri", value: 210, active: false },
  { day: "Sat", value: 160, active: false },
  { day: "Sun", value: 140, active: false },
];

const planColors = [CHART_COLORS[0], CHART_COLORS[2], CHART_COLORS[4]];

const opsTimeline = [
  { label: "Tenant onboarding", color: CHART_COLORS[4], width: "22%" },
  { label: "Support tickets", color: CHART_COLORS[3], width: "28%" },
  { label: "Live-fix sessions", color: CHART_COLORS[5], width: "18%" },
  { label: "Billing review", color: CHART_COLORS[0], width: "32%" },
];

function DashCard({
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

function ViewPill({ href }: { href?: string }) {
  const cls =
    "rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
  if (href) {
    return (
      <Link href={href} className={cn(cls, "no-underline")}>
        View
      </Link>
    );
  }
  return (
    <button type="button" className={cls}>
      View
    </button>
  );
}

function PeriodSelect() {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
    >
      Weekly
      <span className="text-[10px] opacity-60">▾</span>
    </button>
  );
}

function RetentionGauge({ value }: { value: number }) {
  const segments = 24;
  const filled = Math.round((value / 100) * segments);

  return (
    <div className="relative mx-auto flex h-[140px] w-full max-w-[220px] items-end justify-center">
      <svg viewBox="0 0 200 110" className="h-full w-full">
        {Array.from({ length: segments }).map((_, i) => {
          const angle = Math.PI + (i / (segments - 1)) * Math.PI;
          const x1 = 100 + 70 * Math.cos(angle);
          const y1 = 100 + 70 * Math.sin(angle);
          const x2 = 100 + 88 * Math.cos(angle);
          const y2 = 100 + 88 * Math.sin(angle);
          const isFilled = i < filled;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isFilled ? "var(--accent-500)" : "var(--border)"}
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute bottom-2 text-center">
        <p className="text-3xl font-semibold text-foreground">{value}%</p>
      </div>
    </div>
  );
}

function formatCompactCurrency(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return String(amount);
}

export function AdminPlatformDashboard() {
  const router = useRouter();
  const { data: stats, refetch: refetchStats } = useFetch<AdminStats>("/api/admin/stats");
  const { data: orgs, refetch: refetchOrgs } = useFetch<AdminOrganization[]>(
    "/api/admin/organizations",
  );

  useAdminRealtime(() => {
    refetchStats();
    refetchOrgs();
  });

  const retentionRate = useMemo(() => {
    if (!stats?.totalOrganizations) return 72;
    return Math.round(
      (stats.activeOrganizations / Math.max(stats.totalOrganizations, 1)) * 100,
    );
  }, [stats]);

  const planDistribution = useMemo(() => {
    const plans = { Enterprise: 0, Professional: 0, Starter: 0 };
    for (const org of orgs ?? []) {
      const plan = (org.plan ?? "Enterprise").toLowerCase();
      if (plan.includes("starter")) plans.Starter += 1;
      else if (plan.includes("pro")) plans.Professional += 1;
      else plans.Enterprise += 1;
    }
    const total = Object.values(plans).reduce((a, b) => a + b, 0) || 1;
    return [
      { name: "Enterprise", value: Math.round((plans.Enterprise / total) * 100), count: plans.Enterprise },
      { name: "Professional", value: Math.round((plans.Professional / total) * 100), count: plans.Professional },
      { name: "Starter", value: Math.round((plans.Starter / total) * 100), count: plans.Starter },
    ];
  }, [orgs]);

  const donutData = planDistribution.map((p, i) => ({
    name: p.name,
    value: p.value || 1,
    color: planColors[i % planColors.length],
  }));

  const topCompanies = useMemo(
    () =>
      [...(orgs ?? [])]
        .sort((a, b) => b.employeeCount - a.employeeCount)
        .slice(0, 3)
        .map((org, i) => ({
          id: org.id,
          name: org.name,
          logo: org.logo,
          channel: org.plan ?? "Enterprise",
          active: i === 1,
        })),
    [orgs],
  );

  const totalEmployees = stats?.totalEmployees ?? 0;
  const growth = stats?.growthRate ?? 0;
  const revenue = stats?.revenueEstimate ?? 0;

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:gap-5">
        {/* Platform revenue */}
        <DashCard className="flex flex-col justify-between xl:col-span-3">
          <div>
            <p className="text-sm text-muted-foreground">Platform revenue</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {formatCompactCurrency(revenue)}
              </p>
              {growth > 0 && (
                <span className="mb-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                  +{growth}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Estimated MRR across tenants</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/reports/revenue")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            View chart
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </DashCard>

        {/* Active tenants */}
        <DashCard className="xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Active tenants</p>
            <ViewPill href="/admin/companies" />
          </div>
          <div className="h-[130px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tenantActivityData}>
                <Tooltip
                  contentStyle={getChartTooltipStyle()}
                  formatter={(v) => [v, "Active"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: getChartAxisColor(), fontSize: 11 }}
                  dy={8}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* Plan distribution */}
        <DashCard className="xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Plan distribution</p>
            <ViewPill href="/admin/billing/plans" />
          </div>
          <div className="space-y-4">
            {planDistribution.map((plan, i) => (
              <div key={plan.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{plan.name}</span>
                  <span
                    className="rounded-md px-1.5 py-0.5 font-medium"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${planColors[i]} 15%, transparent)`,
                      color: planColors[i],
                    }}
                  >
                    {plan.value}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(plan.value, 4)}%`,
                      backgroundColor: planColors[i],
                    }}
                  />
                </div>
              </div>
            ))}
            <p className="text-right text-xs text-muted-foreground">
              {stats?.activeOrganizations ?? 0}/{stats?.totalOrganizations ?? 0} active tenants
            </p>
          </div>
        </DashCard>

        {/* Transaction volume */}
        <DashCard className="xl:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Transaction volume</p>
            <PeriodSelect />
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenueData} barCategoryGap="20%">
                <Tooltip
                  cursor={{ fill: "var(--bg-surface)" }}
                  contentStyle={getChartTooltipStyle()}
                  formatter={(v) => [v, "Volume"]}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  shape={(props: {
                    x?: number;
                    y?: number;
                    width?: number;
                    height?: number;
                    payload?: { active?: boolean };
                  }) => {
                    const { x = 0, y = 0, width = 0, height = 0, payload } = props;
                    const active = payload?.active;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={6}
                        fill={active ? CHART_COLORS[0] : "var(--border)"}
                        opacity={active ? 1 : 0.55}
                      />
                    );
                  }}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: getChartAxisColor(), fontSize: 11 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* Tenant retention */}
        <DashCard className="xl:col-span-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Tenant retention</p>
            <PeriodSelect />
          </div>
          <RetentionGauge value={retentionRate} />
        </DashCard>

        {/* Top companies */}
        <DashCard className="flex flex-col xl:col-span-5 xl:row-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Top companies</p>
            <ViewPill href="/admin/companies" />
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative h-[140px] w-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground">
                  {totalEmployees >= 1000
                    ? `${(totalEmployees / 1000).toFixed(0)}K`
                    : totalEmployees}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs sm:flex-col">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
          <ul className="mt-5 space-y-1">
            {topCompanies.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No companies yet
              </li>
            ) : (
              topCompanies.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/companies/${c.id}`)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      c.active ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    <CompanyLogo name={c.name} logo={c.logo} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.channel}</p>
                    </div>
                    {c.active ? (
                      <Headphones className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </DashCard>

        {/* Platform operations */}
        <DashCard className="xl:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-sm text-muted-foreground">Platform operations</p>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">7/10 tasks completed</p>
              <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[70%] rounded-full bg-brand-600" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-2xl font-semibold text-foreground">70%</p>
              <p className="text-xs text-muted-foreground">Ops tasks completed</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                +{stats?.recentSignups ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">New signups this month</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-foreground">
            Platform health is stable — {stats?.activeOrganizations ?? 0} tenants active
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                LF
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Live support session</p>
                <p className="text-xs text-muted-foreground">Now · Remote assist</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-danger/15 text-danger"
                aria-label="Decline"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/support/live-fix")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
                aria-label="Join session"
              >
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {opsTimeline.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-[11px] text-muted-foreground">
                  {item.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: item.width, background: item.color }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between pl-32 pt-1 text-[10px] text-muted-foreground/70">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </DashCard>
      </div>
    </div>
  );
}
