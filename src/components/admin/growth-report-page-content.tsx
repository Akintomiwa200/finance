"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, TrendingUp, UserPlus, Users } from "lucide-react";
import { ChartSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Button } from "@/src/components/ui/button";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { StatusBadge } from "@/src/components/ui/status-badge";
import {
  CHART_COLORS,
  getChartAxisColor,
  getChartGridColor,
  getChartTooltipStyle,
} from "@/src/components/charts/chart-theme";
import {
  DashCard,
  PeriodToggle,
  ReportTabs,
  ViewPill,
  buildScaledTimeline,
  monthKey,
  monthLabel,
} from "@/src/components/admin/reports-shared";
import { cn, formatDate } from "@/src/lib/utils";
import type { AdminOrganization, AdminStats } from "@/src/types/admin";

export function GrowthReportPageContent() {
  const router = useRouter();
  const [period, setPeriod] = useState<"6m" | "12m">("6m");
  const monthCount = period === "6m" ? 6 : 12;

  const { data: stats, refetch: refetchStats, isLoading: statsLoading } =
    useFetch<AdminStats>("/api/admin/stats");
  const { data: orgs, refetch: refetchOrgs, isLoading: orgsLoading } =
    useFetch<AdminOrganization[]>("/api/admin/organizations");

  useAdminRealtime(() => {
    refetchStats();
    refetchOrgs();
  });

  const tenantUsers = stats?.tenantUserCount ?? stats?.totalEmployees ?? 0;
  const companies = stats?.totalOrganizations ?? 0;

  const growthTimeline = useMemo(() => {
    const companiesSeries = buildScaledTimeline(companies, monthCount, 0.1, "companies");
    const usersSeries = buildScaledTimeline(tenantUsers, monthCount, 0.12, "users");
    return companiesSeries.map((row, i) => ({
      month: row.month,
      companies: row.companies as number,
      users: usersSeries[i]?.users as number ?? 0,
    }));
  }, [companies, tenantUsers, monthCount]);

  const signupTrend = useMemo(() => {
    const counts = new Map<string, number>();
    for (const org of orgs ?? []) {
      const key = monthKey(org.createdAt);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const keys = [...counts.keys()].sort().slice(-monthCount);
    if (keys.length === 0) {
      return growthTimeline.map((g) => ({ month: g.month, signups: 0 }));
    }
    let running = 0;
    return keys.map((key) => {
      running += counts.get(key) ?? 0;
      return { month: monthLabel(key), signups: running };
    });
  }, [orgs, monthCount, growthTimeline]);

  const recentTenants = useMemo(
    () =>
      [...(orgs ?? [])]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [orgs],
  );

  const topByUsers = useMemo(
    () => [...(orgs ?? [])].sort((a, b) => b.employeeCount - a.employeeCount).slice(0, 5),
    [orgs],
  );

  const userPerCompany =
    companies > 0 ? (tenantUsers / companies).toFixed(1) : "0";

  const isLoading = statsLoading || orgsLoading;

  return (
    <div className="space-y-5">
      <ReportTabs activeHref="/admin/reports/growth" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <Building2 className="absolute -left-1 top-2 h-8 w-8 text-accent-500 opacity-90" />
                <Users className="absolute bottom-0 right-0 h-10 w-10 text-brand-600 opacity-90" />
                <div className="h-12 w-12 rounded-full bg-accent-500/20" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Tenant growth analytics
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Track how tenant companies and their users adopt the platform over time.
                Platform team size is shown separately — not mixed with tenant users.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm" onClick={() => router.push("/admin/companies/new")}>
                  <UserPlus className="h-4 w-4" />
                  Add company
                </Button>
                <span className="text-xs text-muted-foreground">
                  {stats?.recentSignups ?? 0} new tenants · last 30 days
                </span>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Signup momentum</p>
            <PeriodToggle value={period} onChange={setPeriod} />
          </div>
          <div className="h-[140px]">
            {isLoading ? (
              <ChartSkeleton className="h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupTrend}>
                  <defs>
                    <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: getChartAxisColor(), fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={getChartTooltipStyle()} />
                  <Area type="monotone" dataKey="signups" stroke={CHART_COLORS[2]} fill="url(#signupFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Tenant companies</p>
          <p className="mt-1 text-2xl font-semibold">{companies}</p>
          {(stats?.growthRate ?? 0) > 0 && (
            <p className="mt-1 text-xs font-medium text-emerald-600">+{stats?.growthRate}% growth</p>
          )}
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Tenant users</p>
          <p className="mt-1 text-2xl font-semibold">{tenantUsers.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">{userPerCompany} avg / company</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">New tenants (30d)</p>
          <p className="mt-1 text-2xl font-semibold">{stats?.recentSignups ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Recent signups</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Platform team</p>
          <p className="mt-1 text-2xl font-semibold">{stats?.platformTeamCount ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Internal staff only</p>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
        <DashCard className="xl:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Growth over time</p>
              <p className="text-xs text-muted-foreground">Tenant companies vs tenant users</p>
            </div>
            <ViewPill href="/admin/companies" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
                <XAxis dataKey="month" stroke={getChartAxisColor()} fontSize={12} />
                <YAxis stroke={getChartAxisColor()} fontSize={12} />
                <Tooltip contentStyle={getChartTooltipStyle()} />
                <Line type="monotone" dataKey="companies" stroke={CHART_COLORS[0]} strokeWidth={2} name="Companies" dot={false} />
                <Line type="monotone" dataKey="users" stroke={CHART_COLORS[2]} strokeWidth={2} name="Tenant users" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Growth highlights</p>
              <p className="text-xs text-muted-foreground">Key adoption signals</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between rounded-xl bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Active tenants</span>
              <span className="font-semibold">{stats?.activeOrganizations ?? 0}</span>
            </li>
            <li className="flex justify-between rounded-xl bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Departments</span>
              <span className="font-semibold">{stats?.totalDepartments ?? 0}</span>
            </li>
            <li className="flex justify-between rounded-xl bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Transactions</span>
              <span className="font-semibold">{(stats?.totalTransactions ?? 0).toLocaleString()}</span>
            </li>
            <li className="flex justify-between rounded-xl bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Growth rate</span>
              <span className={cn("font-semibold", (stats?.growthRate ?? 0) >= 0 ? "text-emerald-600" : "text-red-600")}>
                {stats?.growthRate ?? 0}%
              </span>
            </li>
          </ul>
        </DashCard>

        <DashCard className="xl:col-span-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Recently joined</p>
              <p className="text-xs text-muted-foreground">Newest tenant companies</p>
            </div>
            <ViewPill href="/admin/companies" />
          </div>
          <ul className="space-y-1">
            {recentTenants.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">No companies yet</li>
            ) : (
              recentTenants.map((org) => (
                <li key={org.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/companies/${org.id}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted/60"
                  >
                    <CompanyLogo name={org.name} logo={org.logo} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">Joined {formatDate(org.createdAt, "long")}</p>
                    </div>
                    <StatusBadge status={org.isActive ? "active" : "suspended"} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </DashCard>

        <DashCard className="xl:col-span-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Largest tenants</p>
              <p className="text-xs text-muted-foreground">By tenant user count</p>
            </div>
          </div>
          <ul className="space-y-1">
            {topByUsers.map((org) => (
              <li key={org.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/companies/${org.id}`)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted/60"
                >
                  <CompanyLogo name={org.name} logo={org.logo} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.employeeCount} users · {org.plan ?? "Starter"}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </DashCard>
      </div>
    </div>
  );
}
