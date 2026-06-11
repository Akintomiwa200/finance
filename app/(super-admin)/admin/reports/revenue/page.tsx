"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageLayout } from "@/src/components/layout/page-layout";
import { ChartCard } from "@/src/components/charts/chart-card";
import { StatsGrid } from "@/src/components/charts/stats-grid";
import { useFetch } from "@/src/hooks/use-fetch";
import { formatCurrency } from "@/src/lib/utils";
import { CHART_COLORS, getChartTooltipStyle, getChartGridColor, getChartAxisColor } from "@/src/components/charts/chart-theme";
import type { AdminStats } from "@/src/types/admin";
import { DollarSign } from "lucide-react";

const monthlyData = [
  { month: "Jan", mrr: 125000, arr: 1500000 },
  { month: "Feb", mrr: 145000, arr: 1740000 },
  { month: "Mar", mrr: 168000, arr: 2016000 },
  { month: "Apr", mrr: 192000, arr: 2304000 },
  { month: "May", mrr: 215000, arr: 2580000 },
  { month: "Jun", mrr: 245000, arr: 2940000 },
];

export default function RevenueReportPage() {
  const { data: stats } = useFetch<AdminStats>("/api/admin/stats");

  return (
    <PageLayout title="Revenue Analytics" description="Monthly recurring revenue and billing trends" showBack breadcrumbs={[{ label: "Reports", href: "/admin/reports/revenue" }, { label: "Revenue" }]}>
      {stats && (
        <StatsGrid stats={[
          { label: "Est. MRR", value: formatCurrency(stats.revenueEstimate), change: stats.growthRate, icon: <DollarSign className="h-4 w-4" /> },
          { label: "Active Orgs", value: String(stats.activeOrganizations) },
          { label: "ARR (Est.)", value: formatCurrency(stats.revenueEstimate * 12) },
        ]} columns={3} />
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Recurring Revenue">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
              <XAxis dataKey="month" stroke={getChartAxisColor()} fontSize={12} />
              <YAxis stroke={getChartAxisColor()} fontSize={12} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [formatCurrency(Number(v ?? 0)), "MRR"]} />
              <Area type="monotone" dataKey="mrr" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Annual Run Rate">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
              <XAxis dataKey="month" stroke={getChartAxisColor()} fontSize={12} />
              <YAxis stroke={getChartAxisColor()} fontSize={12} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [formatCurrency(Number(v ?? 0)), "ARR"]} />
              <Bar dataKey="arr" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </PageLayout>
  );
}
