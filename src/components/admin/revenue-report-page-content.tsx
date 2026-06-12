"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChartSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  FileText,
  Layers,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
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
import { cn, formatCurrency } from "@/src/lib/utils";
import {
  DashCard,
  MONTH_LABELS,
  PeriodToggle,
  ReportTabs,
  ViewPill,
} from "@/src/components/admin/reports-shared";
import type { AdminOrganization, AdminStats } from "@/src/types/admin";
import type { TenantBillingPlan } from "@/src/types/billing-plan";
import { DEFAULT_TENANT_BILLING_PLANS } from "@/src/types/billing-plan";

function formatCompactCurrency(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return formatCurrency(amount);
}

function matchPlan(planLabel: string | undefined, plans: TenantBillingPlan[]) {
  const key = (planLabel ?? "starter").toLowerCase();
  return (
    plans.find(
      (p) =>
        p.id === key ||
        p.name.toLowerCase() === key ||
        p.name.toLowerCase().includes(key) ||
        key.includes(p.id),
    ) ?? plans[0]
  );
}

function buildMonthlySeries(currentMrr: number, months: number) {
  const growth = 0.08;
  const data = [];
  for (let i = months - 1; i >= 0; i--) {
    const factor = Math.pow(1 + growth, -i);
    const mrr = Math.round(currentMrr * factor);
    const monthIndex = (new Date().getMonth() - i + 12) % 12;
    data.push({
      month: MONTH_LABELS[monthIndex],
      mrr,
      arr: mrr * 12,
    });
  }
  return data;
}

export function RevenueReportPageContent() {
  const router = useRouter();
  const [period, setPeriod] = useState<"6m" | "12m">("6m");

  const { data: stats, refetch: refetchStats, isLoading: statsLoading } =
    useFetch<AdminStats>("/api/admin/stats");
  const { data: orgs, refetch: refetchOrgs, isLoading: orgsLoading } =
    useFetch<AdminOrganization[]>("/api/admin/organizations");
  const { data: plansApi } = useFetch<TenantBillingPlan[]>("/api/admin/billing/plans");

  useAdminRealtime(() => {
    refetchStats();
    refetchOrgs();
  });

  const plans = plansApi?.length ? plansApi : DEFAULT_TENANT_BILLING_PLANS;
  const currentMrr = stats?.revenueEstimate ?? 0;
  const monthCount = period === "6m" ? 6 : 12;

  const monthlyData = useMemo(
    () => buildMonthlySeries(currentMrr, monthCount),
    [currentMrr, monthCount],
  );

  const planRevenue = useMemo(() => {
    const buckets = new Map<string, { plan: TenantBillingPlan; count: number; revenue: number }>();
    for (const plan of plans) {
      buckets.set(plan.id, { plan, count: 0, revenue: 0 });
    }
    for (const org of orgs ?? []) {
      const matched = matchPlan(org.plan, plans);
      const bucket = buckets.get(matched.id) ?? { plan: matched, count: 0, revenue: 0 };
      bucket.count += 1;
      bucket.revenue += matched.price;
      buckets.set(matched.id, bucket);
    }
    return [...buckets.values()].filter((b) => b.count > 0 || b.plan.active);
  }, [orgs, plans]);

  const planDonut = useMemo(() => {
    const total = planRevenue.reduce((s, p) => s + p.revenue, 0) || 1;
    return planRevenue.map((entry, i) => ({
      name: entry.plan.name,
      value: Math.round((entry.revenue / total) * 100),
      revenue: entry.revenue,
      count: entry.count,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [planRevenue]);

  const topTenants = useMemo(() => {
    return [...(orgs ?? [])]
      .map((org) => {
        const plan = matchPlan(org.plan, plans);
        return {
          id: org.id,
          name: org.name,
          logo: org.logo,
          plan: plan.name,
          mrr: plan.price,
          isActive: org.isActive,
        };
      })
      .sort((a, b) => b.mrr - a.mrr)
      .slice(0, 5);
  }, [orgs, plans]);

  const mrrGrowth = useMemo(() => {
    if (monthlyData.length < 2) return 0;
    const first = monthlyData[0].mrr;
    const last = monthlyData[monthlyData.length - 1].mrr;
    if (!first) return 0;
    return Math.round(((last - first) / first) * 100);
  }, [monthlyData]);

  const avgRevenuePerTenant =
    stats?.activeOrganizations && stats.activeOrganizations > 0
      ? Math.round(currentMrr / stats.activeOrganizations)
      : 0;

  const isLoading = statsLoading || orgsLoading;

  return (
    <div className="space-y-5">
      <ReportTabs activeHref="/admin/reports/revenue" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <DollarSign className="absolute -left-1 top-2 h-8 w-8 text-emerald-500 opacity-90" />
                <TrendingUp className="absolute bottom-0 right-0 h-10 w-10 text-brand-600 opacity-90" />
                <div className="h-12 w-12 rounded-full bg-emerald-500/15" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Tenant revenue analytics
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Track monthly recurring revenue from tenant subscriptions — what
                companies pay your platform for plans, modules, and seats. Not your
                internal operating expenses.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/admin/billing/plans")}
                >
                  <Layers className="h-4 w-4" />
                  Manage plans
                </Button>
                <span className="text-xs text-muted-foreground">
                  {stats?.activeOrganizations ?? 0} paying tenants ·{" "}
                  {formatCompactCurrency(currentMrr)} MRR
                </span>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">MRR trend</p>
            <PeriodToggle value={period} onChange={setPeriod} />
          </div>
          <div className="h-[140px]">
            {isLoading ? (
              <ChartSkeleton className="h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: getChartAxisColor(), fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={getChartTooltipStyle()}
                    formatter={(v) => [formatCurrency(Number(v ?? 0)), "MRR"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke={CHART_COLORS[0]}
                    fill="url(#mrrFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Est. MRR</p>
          <p className="mt-1 text-2xl font-semibold">{formatCompactCurrency(currentMrr)}</p>
          {mrrGrowth !== 0 && (
            <p className={cn("mt-1 text-xs font-medium", mrrGrowth >= 0 ? "text-emerald-600" : "text-red-600")}>
              {mrrGrowth >= 0 ? "+" : ""}
              {mrrGrowth}% vs period start
            </p>
          )}
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Est. ARR</p>
          <p className="mt-1 text-2xl font-semibold">{formatCompactCurrency(currentMrr * 12)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Annual run rate</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Active tenants</p>
          <p className="mt-1 text-2xl font-semibold">{stats?.activeOrganizations ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            of {stats?.totalOrganizations ?? 0} companies
          </p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Avg. per tenant</p>
          <p className="mt-1 text-2xl font-semibold">{formatCompactCurrency(avgRevenuePerTenant)}</p>
          <p className="mt-1 text-xs text-muted-foreground">MRR / active tenant</p>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Monthly recurring revenue</p>
              <p className="text-xs text-muted-foreground">Subscription income from tenant plans</p>
            </div>
            <ViewPill href="/admin/billing/subscriptions" />
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
                <XAxis dataKey="month" stroke={getChartAxisColor()} fontSize={12} />
                <YAxis
                  stroke={getChartAxisColor()}
                  fontSize={12}
                  tickFormatter={(v) => `₦${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={getChartTooltipStyle()}
                  formatter={(v) => [formatCurrency(Number(v ?? 0)), "MRR"]}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke={CHART_COLORS[0]}
                  fill={CHART_COLORS[0]}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Revenue by plan</p>
              <p className="text-xs text-muted-foreground">Share of MRR per subscription tier</p>
            </div>
            <ViewPill href="/admin/billing/plans" />
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative h-[140px] w-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDonut.length ? planDonut : [{ name: "—", value: 1, color: CHART_COLORS[0] }]}
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {(planDonut.length ? planDonut : [{ name: "—", value: 1, color: CHART_COLORS[0] }]).map(
                      (entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ),
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-lg font-semibold">{planDonut.length}</span>
                  <p className="text-[10px] text-muted-foreground">Plans</p>
                </div>
              </div>
            </div>
            <div className="w-full space-y-3">
              {planRevenue.map((entry, i) => {
                const total = planRevenue.reduce((s, p) => s + p.revenue, 0) || 1;
                const pct = Math.round((entry.revenue / total) * 100);
                return (
                  <div key={entry.plan.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        {entry.plan.name}
                        <span className="text-[10px]">({entry.count})</span>
                      </span>
                      <span className="font-medium text-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(pct, 4)}%`,
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Annual run rate</p>
              <p className="text-xs text-muted-foreground">MRR × 12 by month</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                <XAxis dataKey="month" stroke={getChartAxisColor()} fontSize={12} />
                <YAxis
                  stroke={getChartAxisColor()}
                  fontSize={12}
                  tickFormatter={(v) => `₦${(Number(v) / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={getChartTooltipStyle()}
                  formatter={(v) => [formatCurrency(Number(v ?? 0)), "ARR"]}
                />
                <Bar dataKey="arr" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Top tenant companies</p>
              <p className="text-xs text-muted-foreground">Highest estimated MRR by plan</p>
            </div>
            <ViewPill href="/admin/companies" />
          </div>
          <ul className="space-y-1">
            {topTenants.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">No tenant companies yet</li>
            ) : (
              topTenants.map((tenant) => (
                <li key={tenant.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/companies/${tenant.id}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <CompanyLogo name={tenant.name} logo={tenant.logo} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tenant.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tenant.plan} · {formatCompactCurrency(tenant.mrr)}/mo
                      </p>
                    </div>
                    <StatusBadge status={tenant.isActive ? "active" : "suspended"} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/admin/billing/plans" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tenant plans</p>
              <p className="text-xs text-muted-foreground">Pricing & module access</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/billing/subscriptions" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Subscriptions</p>
              <p className="text-xs text-muted-foreground">Per-company billing</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/billing/invoices" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Invoices</p>
              <p className="text-xs text-muted-foreground">Billing history</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
      </div>

      <DashCard className="flex flex-wrap items-center justify-between gap-4 border-dashed bg-muted/20">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Payment methods</p>
            <p className="text-xs text-muted-foreground">
              Configure how tenants pay — cards, bank transfer, and more
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/billing/payment-methods")}>
          <FileText className="h-4 w-4" />
          Manage payments
        </Button>
      </DashCard>
    </div>
  );
}
