"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Database,
  HeartPulse,
  Loader2,
  Mail,
  Radio,
  Server,
  Settings,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Button } from "@/src/components/ui/button";
import { StatusBadge } from "@/src/components/ui/status-badge";
import {
  CHART_COLORS,
  getChartAxisColor,
  getChartGridColor,
  getChartTooltipStyle,
} from "@/src/components/charts/chart-theme";
import { DashCard, ReportTabs, ViewPill } from "@/src/components/admin/reports-shared";
import { cn, formatDate } from "@/src/lib/utils";
import type { AdminAuditLog, AdminStats } from "@/src/types/admin";

const UPTIME_WEEKLY = [
  { day: "Mon", uptime: 99.98, errors: 2 },
  { day: "Tue", uptime: 99.95, errors: 5 },
  { day: "Wed", uptime: 99.99, errors: 1 },
  { day: "Thu", uptime: 99.97, errors: 3 },
  { day: "Fri", uptime: 99.96, errors: 4 },
  { day: "Sat", uptime: 100, errors: 0 },
  { day: "Sun", uptime: 100, errors: 0 },
];

const SYSTEM_SERVICES = [
  { id: "api", label: "API Gateway", icon: Server, status: "healthy" as const, latency: "48ms" },
  { id: "db", label: "Database", icon: Database, status: "healthy" as const, latency: "12ms" },
  { id: "mail", label: "Email (SMTP)", icon: Mail, status: "healthy" as const, latency: "—" },
  { id: "rt", label: "Realtime bus", icon: Radio, status: "healthy" as const, latency: "8ms" },
];

export function PlatformHealthReportPageContent() {
  const router = useRouter();

  const { data: stats, refetch: refetchStats, isLoading: statsLoading } =
    useFetch<AdminStats>("/api/admin/stats");
  const { data: auditLogs, refetch: refetchLogs, isLoading: logsLoading } =
    useFetch<AdminAuditLog[]>("/api/admin/audit-logs");

  useAdminRealtime(() => {
    refetchStats();
    refetchLogs();
  });

  const avgUptime = useMemo(
    () => UPTIME_WEEKLY.reduce((s, d) => s + d.uptime, 0) / UPTIME_WEEKLY.length,
    [],
  );

  const totalErrors = UPTIME_WEEKLY.reduce((s, d) => s + d.errors, 0);

  const recentEvents = useMemo(
    () => (auditLogs ?? []).slice(0, 6),
    [auditLogs],
  );

  const isLoading = statsLoading || logsLoading;

  return (
    <div className="space-y-5">
      <ReportTabs activeHref="/admin/reports/platform-health" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <HeartPulse className="absolute -left-1 top-2 h-8 w-8 text-emerald-500 opacity-90" />
                <Activity className="absolute bottom-0 right-0 h-10 w-10 text-brand-600 opacity-90" />
                <div className="h-12 w-12 rounded-full bg-emerald-500/15" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Platform health
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Monitor uptime, error rates, service status, and recent platform events.
                Use this view to catch issues before tenants are affected.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm" onClick={() => router.push("/admin/settings/performance")}>
                  <Settings className="h-4 w-4" />
                  Performance settings
                </Button>
                <span className="text-xs text-muted-foreground">
                  {avgUptime.toFixed(2)}% uptime · 7 days
                </span>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Uptime trend</p>
            <HeartPulse className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="h-[140px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={UPTIME_WEEKLY}>
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: getChartAxisColor(), fontSize: 11 }} />
                  <YAxis hide domain={[99.9, 100.05]} />
                  <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [`${Number(v).toFixed(2)}%`, "Uptime"]} />
                  <Line type="monotone" dataKey="uptime" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Uptime (7d)</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{avgUptime.toFixed(2)}%</p>
          <p className="mt-1 text-xs text-muted-foreground">All services</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Avg response</p>
          <p className="mt-1 text-2xl font-semibold">142ms</p>
          <p className="mt-1 text-xs text-muted-foreground">API p95</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Errors (7d)</p>
          <p className="mt-1 text-2xl font-semibold">{totalErrors}</p>
          <p className="mt-1 text-xs text-muted-foreground">Logged incidents</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Active tenants</p>
          <p className="mt-1 text-2xl font-semibold">{stats?.activeOrganizations ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Currently online</p>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Daily uptime</p>
              <p className="text-xs text-muted-foreground">Service availability by day</p>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={UPTIME_WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
                <XAxis dataKey="day" stroke={getChartAxisColor()} fontSize={12} />
                <YAxis domain={[99.9, 100.05]} stroke={getChartAxisColor()} fontSize={12} tickFormatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [`${Number(v).toFixed(3)}%`, "Uptime"]} />
                <Line type="monotone" dataKey="uptime" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Error count</p>
              <p className="text-xs text-muted-foreground">Daily errors (7d)</p>
            </div>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UPTIME_WEEKLY} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                <XAxis dataKey="day" stroke={getChartAxisColor()} fontSize={12} />
                <YAxis stroke={getChartAxisColor()} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [v, "Errors"]} />
                <Bar dataKey="errors" fill={CHART_COLORS[3]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-5">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">Service status</p>
            <p className="text-xs text-muted-foreground">Core platform components</p>
          </div>
          <ul className="space-y-2">
            {SYSTEM_SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <li
                  key={svc.id}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{svc.label}</p>
                    <p className="text-xs text-muted-foreground">Latency {svc.latency}</p>
                  </div>
                  <StatusBadge status={svc.status} />
                </li>
              );
            })}
          </ul>
        </DashCard>

        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Recent platform events</p>
              <p className="text-xs text-muted-foreground">From audit logs</p>
            </div>
            <ViewPill href="/admin/audit-logs" />
          </div>
          <ul className="divide-y divide-border">
            {recentEvents.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">No events logged yet</li>
            ) : (
              recentEvents.map((log) => (
                <li key={log.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    log.action === "DELETE" ? "bg-red-500/10 text-red-600" : "bg-muted text-muted-foreground",
                  )}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {log.action} · {log.entity}
                      {log.entityId && <span className="font-normal text-muted-foreground"> ({log.entityId.slice(0, 8)}…)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.userName ?? "System"}
                      {log.organizationName ? ` · ${log.organizationName}` : ""}
                      {" · "}
                      {formatDate(log.createdAt, "relative")}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/admin/audit-logs" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Audit logs</p>
              <p className="text-xs text-muted-foreground">Full event history</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/support/live-fix" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Live fix queue</p>
              <p className="text-xs text-muted-foreground">Active support sessions</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/settings/security" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Security</p>
              <p className="text-xs text-muted-foreground">Platform security settings</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
      </div>
    </div>
  );
}
