"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageLayout } from "@/src/components/layout/page-layout";
import { ChartCard } from "@/src/components/charts/chart-card";
import { StatsGrid } from "@/src/components/charts/stats-grid";
import { useFetch } from "@/src/hooks/use-fetch";
import { CHART_COLORS, getChartTooltipStyle, getChartGridColor, getChartAxisColor } from "@/src/components/charts/chart-theme";
import type { AdminStats } from "@/src/types/admin";
import { Building2, Users } from "lucide-react";

const growthData = [
  { month: "Jan", companies: 2, employees: 45 },
  { month: "Feb", companies: 2, employees: 62 },
  { month: "Mar", companies: 3, employees: 89 },
  { month: "Apr", companies: 3, employees: 124 },
  { month: "May", companies: 4, employees: 178 },
  { month: "Jun", companies: 4, employees: 234 },
];

export default function GrowthReportPage() {
  const { data: stats } = useFetch<AdminStats>("/api/admin/stats");

  return (
    <PageLayout title="Growth Metrics" description="Platform adoption and user growth" showBack breadcrumbs={[{ label: "Reports", href: "/admin/reports/revenue" }, { label: "Growth" }]}>
      {stats && (
        <StatsGrid stats={[
          { label: "Total Companies", value: String(stats.totalOrganizations), change: stats.growthRate, icon: <Building2 className="h-4 w-4" /> },
          { label: "New (30 days)", value: String(stats.recentSignups) },
          { label: "Total Employees", value: stats.totalEmployees.toLocaleString(), icon: <Users className="h-4 w-4" /> },
        ]} columns={3} />
      )}
      <ChartCard title="Growth Over Time">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
            <XAxis dataKey="month" stroke={getChartAxisColor()} fontSize={12} />
            <YAxis stroke={getChartAxisColor()} fontSize={12} />
            <Tooltip contentStyle={getChartTooltipStyle()} />
            <Line type="monotone" dataKey="companies" stroke={CHART_COLORS[0]} strokeWidth={2} name="Companies" />
            <Line type="monotone" dataKey="employees" stroke={CHART_COLORS[2]} strokeWidth={2} name="Employees" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </PageLayout>
  );
}
