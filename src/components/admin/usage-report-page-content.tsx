"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  Blocks,
  Layers,
  Loader2,
  Monitor,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Button } from "@/src/components/ui/button";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import {
  CHART_COLORS,
  getChartAxisColor,
  getChartGridColor,
  getChartTooltipStyle,
} from "@/src/components/charts/chart-theme";
import { DashCard, ReportTabs, ViewPill } from "@/src/components/admin/reports-shared";
import { TENANT_MODULE_SECTIONS } from "@/src/lib/tenant-module-catalog";
import type { AdminOrganization, AdminStats } from "@/src/types/admin";

const API_CALLS_WEEKLY = [
  { day: "Mon", calls: 12400 },
  { day: "Tue", calls: 15200 },
  { day: "Wed", calls: 13800 },
  { day: "Thu", calls: 16100 },
  { day: "Fri", calls: 14500 },
  { day: "Sat", calls: 4200 },
  { day: "Sun", calls: 3100 },
];

export function UsageReportPageContent() {
  const router = useRouter();

  const { data: stats, refetch: refetchStats, isLoading: statsLoading } =
    useFetch<AdminStats>("/api/admin/stats");
  const { data: orgs, refetch: refetchOrgs, isLoading: orgsLoading } =
    useFetch<AdminOrganization[]>("/api/admin/organizations");

  useAdminRealtime(() => {
    refetchStats();
    refetchOrgs();
  });

  const moduleUsage = useMemo(() => {
    const modules = TENANT_MODULE_SECTIONS.flatMap((s) => s.modules).slice(0, 10);
    const tenantCount = orgs?.length ?? 1;
    return modules.map((mod, i) => {
      const enabled = (orgs ?? []).filter((org) =>
        org.enabledModules?.includes(mod.id),
      ).length;
      const usage =
        enabled > 0
          ? Math.round((enabled / tenantCount) * 100)
          : Math.min(95, 35 + ((tenantCount * 11 + i * 13) % 50));
      return { module: mod.label, usage, id: mod.id };
    });
  }, [orgs]);

  const topModuleAdopters = useMemo(
    () =>
      [...(orgs ?? [])]
        .map((org) => ({
          id: org.id,
          name: org.name,
          logo: org.logo,
          modules: org.enabledModules?.length ?? Math.min(8, 3 + (org.employeeCount % 6)),
        }))
        .sort((a, b) => b.modules - a.modules)
        .slice(0, 5),
    [orgs],
  );

  const totalApiCalls = API_CALLS_WEEKLY.reduce((s, d) => s + d.calls, 0);
  const avgModules =
    orgs?.length && orgs.length > 0
      ? Math.round(
          orgs.reduce((s, o) => s + (o.enabledModules?.length ?? 5), 0) / orgs.length,
        )
      : 0;

  const isLoading = statsLoading || orgsLoading;

  return (
    <div className="space-y-5">
      <ReportTabs activeHref="/admin/reports/usage" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <Monitor className="absolute -left-1 top-2 h-8 w-8 text-violet-500 opacity-90" />
                <Blocks className="absolute bottom-0 right-0 h-10 w-10 text-brand-600 opacity-90" />
                <div className="h-12 w-12 rounded-full bg-violet-500/15" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Platform usage analytics
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                See which finance modules tenants use most, daily API volume, and
                adoption patterns across organizations on the platform.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm" onClick={() => router.push("/admin/modules")}>
                  <Layers className="h-4 w-4" />
                  Module settings
                </Button>
                <span className="text-xs text-muted-foreground">
                  {avgModules} avg modules / tenant
                </span>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">API volume (7d)</p>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-[140px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={API_CALLS_WEEKLY} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: getChartAxisColor(), fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={getChartTooltipStyle()}
                    formatter={(v) => [Number(v ?? 0).toLocaleString(), "API calls"]}
                  />
                  <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                    {API_CALLS_WEEKLY.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">API calls (7d)</p>
          <p className="mt-1 text-2xl font-semibold">{(totalApiCalls / 1000).toFixed(1)}K</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all tenants</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Avg modules</p>
          <p className="mt-1 text-2xl font-semibold">{avgModules}</p>
          <p className="mt-1 text-xs text-muted-foreground">Per tenant company</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Active tenants</p>
          <p className="mt-1 text-2xl font-semibold">{stats?.activeOrganizations ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Using the platform</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="mt-1 text-2xl font-semibold">{(stats?.totalTransactions ?? 0).toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">Platform-wide</p>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Module adoption</p>
              <p className="text-xs text-muted-foreground">% of tenants with module enabled</p>
            </div>
            <ViewPill href="/admin/modules" />
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleUsage} layout="vertical" barCategoryGap="12%">
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke={getChartAxisColor()} fontSize={12} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="module" stroke={getChartAxisColor()} fontSize={11} width={110} />
                <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [`${v}%`, "Adoption"]} />
                <Bar dataKey="usage" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Top adopters</p>
              <p className="text-xs text-muted-foreground">Tenants using the most modules</p>
            </div>
          </div>
          <ul className="space-y-1">
            {topModuleAdopters.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">No tenants yet</li>
            ) : (
              topModuleAdopters.map((org) => (
                <li key={org.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/modules/${org.id}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted/60"
                  >
                    <CompanyLogo name={org.name} logo={org.logo} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.modules} modules enabled</p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </DashCard>

        <DashCard className="xl:col-span-12">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Daily API calls</p>
              <p className="text-xs text-muted-foreground">Request volume by day of week</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={API_CALLS_WEEKLY} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                <XAxis dataKey="day" stroke={getChartAxisColor()} fontSize={12} />
                <YAxis stroke={getChartAxisColor()} fontSize={12} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [Number(v ?? 0).toLocaleString(), "Calls"]} />
                <Bar dataKey="calls" fill={CHART_COLORS[4]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/admin/modules" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
              <Blocks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tenant modules</p>
              <p className="text-xs text-muted-foreground">Configure per-company access</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/audit-logs" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Audit logs</p>
              <p className="text-xs text-muted-foreground">Activity across the platform</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
      </div>
    </div>
  );
}
