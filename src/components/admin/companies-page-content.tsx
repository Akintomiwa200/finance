"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Plus,
  Search,
  Building2,
  Users,
  Loader2,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { EmptyState } from "@/src/components/ui/empty-state";
import {
  CHART_COLORS,
  getChartTooltipStyle,
  getChartAxisColor,
  getChartGridColor,
} from "@/src/components/charts/chart-theme";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { cn, formatDate } from "@/src/lib/utils";
import type { AdminOrganization, AdminStats } from "@/src/types/admin";

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

function CircularGauge({
  value,
  label,
  accentIndex = 0,
}: {
  value: number;
  label: string;
  accentIndex?: number;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const accent = CHART_COLORS[accentIndex % CHART_COLORS.length];
  const secondary = CHART_COLORS[(accentIndex + 2) % CHART_COLORS.length];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[88px] w-[88px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          {clamped < 100 && clamped > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={secondary}
              strokeWidth="10"
              strokeDasharray={`${circumference * 0.08} ${circumference}`}
              strokeDashoffset={offset - circumference * 0.04}
              strokeLinecap="round"
              opacity={0.85}
            />
          )}
        </svg>
        <div
          className="absolute inset-[14px] flex items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: "#5b21b6" }}
        >
          {clamped}%
        </div>
      </div>
      <p className="max-w-[90px] text-center text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function monthKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${y.slice(2)}`;
}

export function CompaniesPageContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: orgs, isLoading, refetch } = useFetch<AdminOrganization[]>(
    "/api/admin/organizations",
  );
  const { data: stats } = useFetch<AdminStats>("/api/admin/stats");

  useAdminRealtime(refetch);

  const filtered = useMemo(() => {
    if (!orgs) return [];
    if (!search) return orgs;
    const q = search.toLowerCase();
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q),
    );
  }, [orgs, search]);

  const activeRate = useMemo(() => {
    if (!orgs?.length) return 0;
    const active = orgs.filter((o) => o.isActive && !o.isPlatform).length;
    const total = orgs.filter((o) => !o.isPlatform).length || orgs.length;
    return Math.round((active / total) * 100);
  }, [orgs]);

  const enterpriseRate = useMemo(() => {
    if (!orgs?.length) return 0;
    const enterprise = orgs.filter((o) =>
      (o.plan ?? "Enterprise").toLowerCase().includes("enterprise"),
    ).length;
    return Math.round((enterprise / orgs.length) * 100);
  }, [orgs]);

  const avgTeamFill = useMemo(() => {
    if (!orgs?.length) return 0;
    const avg = orgs.reduce((s, o) => s + o.employeeCount, 0) / orgs.length;
    return Math.min(100, Math.round((avg / 50) * 100));
  }, [orgs]);

  const moduleAdoption = useMemo(() => {
    if (!orgs?.length) return 0;
    const withModules = orgs.filter((o) => (o.enabledModules?.length ?? 0) > 0).length;
    return Math.round((withModules / orgs.length) * 100);
  }, [orgs]);

  const employeeBarData = useMemo(() => {
    return [...(orgs ?? [])]
      .sort((a, b) => b.employeeCount - a.employeeCount)
      .slice(0, 7)
      .map((o) => ({
        name: o.name.split(" ")[0],
        value: o.employeeCount,
      }));
  }, [orgs]);

  const signupLineData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const org of orgs ?? []) {
      const key = monthKey(org.createdAt);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const keys = [...counts.keys()].sort();
    const lastSix = keys.slice(-6);
    if (lastSix.length === 0) {
      return [
        { month: "Jan", value: 0 },
        { month: "Feb", value: 0 },
        { month: "Mar", value: 0 },
        { month: "Apr", value: 0 },
        { month: "May", value: 0 },
        { month: "Jun", value: 0 },
      ];
    }
    let running = 0;
    return lastSix.map((key) => {
      running += counts.get(key) ?? 0;
      return { month: monthLabel(key), value: running };
    });
  }, [orgs]);

  const highlightPoint = signupLineData[signupLineData.length - 1];

  return (
    <div className="space-y-5">
      {/* Top row: banner + bar chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <Building2 className="absolute -left-1 top-2 h-8 w-8 text-accent-500 opacity-80" />
                <Users className="absolute bottom-0 right-0 h-10 w-10 text-brand-600 opacity-90" />
                <div className="h-12 w-12 rounded-full bg-accent-500/20" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Manage tenant organizations
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Work on collaborative tenant tasks across the platform. Onboard
                companies, monitor usage, and keep every organization healthy from
                one place.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/admin/companies/new")}
                >
                  <Plus className="h-4 w-4" />
                  Add Company
                </Button>
                <span className="text-xs text-muted-foreground">
                  {stats?.totalOrganizations ?? orgs?.length ?? 0} tenant companies
                  · {stats?.tenantUserCount ?? stats?.totalEmployees ?? 0} tenant users
                </span>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <p className="mb-3 text-sm text-muted-foreground">Tenant users by company</p>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeBarData} barSize={22}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={getChartGridColor()}
                />
                <YAxis hide />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: getChartAxisColor(), fontSize: 10 }}
                  dy={6}
                />
                <Tooltip
                  contentStyle={getChartTooltipStyle()}
                  formatter={(v) => [v, "Employees"]}
                />
                <Bar
                  dataKey="value"
                  fill={CHART_COLORS[0]}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>
      </div>

      {/* Middle row: gauges + line chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="lg:col-span-6 xl:col-span-5">
          <p className="mb-4 text-sm text-muted-foreground">Platform health</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <CircularGauge value={activeRate} label="Active tenants" accentIndex={0} />
            <CircularGauge value={enterpriseRate} label="Enterprise plans" accentIndex={2} />
            <CircularGauge value={avgTeamFill} label="Avg team size" accentIndex={3} />
            <CircularGauge value={moduleAdoption} label="Module adoption" accentIndex={1} />
          </div>
        </DashCard>

        <DashCard className="lg:col-span-6 xl:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Cumulative signups</p>
            {stats?.growthRate ? (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                +{stats.growthRate}%
              </span>
            ) : null}
          </div>
          <div className="relative h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupLineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={getChartGridColor()}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: getChartAxisColor(), fontSize: 11 }}
                  dy={8}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={getChartTooltipStyle()}
                  formatter={(v) => [v, "Tenants"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: CHART_COLORS[0] }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {highlightPoint && highlightPoint.value > 0 && (
              <div className="pointer-events-none absolute right-[12%] top-[18%] rounded-md bg-danger px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                {highlightPoint.value}
              </div>
            )}
          </div>
        </DashCard>
      </div>

      {/* Companies table */}
      <DashCard className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">All companies</h2>
            <p className="text-xs text-muted-foreground">
              Manage all organizations using the FaaS platform
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/companies/new")}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading companies…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-8">
            <EmptyState
              title="No companies found"
              action={
                <Button onClick={() => router.push("/admin/companies/new")}>
                  Add Company
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 pt-2 text-sm font-semibold text-foreground">
                    Company
                  </th>
                  <th className="pb-4 pt-2 text-sm font-semibold text-foreground">
                    Plan
                  </th>
                  <th className="pb-4 pt-2 text-sm font-semibold text-foreground">
                    Team size
                  </th>
                  <th className="pb-4 pt-2 text-sm font-semibold text-foreground">
                    Joined
                  </th>
                  <th className="pb-4 pt-2 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="pb-4 pt-2 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/admin/companies/${row.id}`)}
                    className="group cursor-pointer border-t border-border/60 transition-colors hover:bg-muted/30"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          name={row.name}
                          logo={row.logo}
                          size={40}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{row.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {row.slug}
                          </p>
                          {row.email && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {row.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-foreground">
                      {row.plan ?? "Enterprise"}
                    </td>
                    <td className="py-4 pr-4 text-sm text-muted-foreground">
                      {row.employeeCount} emp · {row.departmentCount} dept
                    </td>
                    <td className="py-4 pr-4 text-sm text-muted-foreground">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusBadge
                        status={
                          row.isPlatform
                            ? "system"
                            : row.isActive
                              ? "active"
                              : "suspended"
                        }
                      />
                    </td>
                    <td className="py-4 text-right">
                      <div
                        className="inline-flex gap-1 opacity-80 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/companies/${row.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/companies/${row.id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>
    </div>
  );
}
