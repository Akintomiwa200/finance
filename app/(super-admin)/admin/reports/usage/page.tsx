"use client";

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageLayout } from "@/src/components/layout/page-layout";
import { ChartCard } from "@/src/components/charts/chart-card";
import { CHART_COLORS, getChartTooltipStyle, getChartGridColor, getChartAxisColor } from "@/src/components/charts/chart-theme";

const moduleUsage = [
  { module: "Payroll", usage: 89 },
  { module: "Ledger", usage: 76 },
  { module: "Payables", usage: 65 },
  { module: "Receivables", usage: 58 },
  { module: "Reports", usage: 92 },
  { module: "Tax", usage: 45 },
];

const apiCalls = [
  { day: "Mon", calls: 12400 },
  { day: "Tue", calls: 15200 },
  { day: "Wed", calls: 13800 },
  { day: "Thu", calls: 16100 },
  { day: "Fri", calls: 14500 },
  { day: "Sat", calls: 4200 },
  { day: "Sun", calls: 3100 },
];

export default function UsageReportPage() {
  return (
    <PageLayout title="Usage Analytics" description="Module adoption and API usage across the platform" showBack breadcrumbs={[{ label: "Reports", href: "/admin/reports/revenue" }, { label: "Usage" }]}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Module Adoption (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
              <XAxis type="number" domain={[0, 100]} stroke={getChartAxisColor()} fontSize={12} />
              <YAxis type="category" dataKey="module" stroke={getChartAxisColor()} fontSize={12} width={80} />
              <Tooltip contentStyle={getChartTooltipStyle()} />
              <Bar dataKey="usage" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Daily API Calls">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={apiCalls} dataKey="calls" nameKey="day" cx="50%" cy="50%" outerRadius={100} label>
                {apiCalls.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={getChartTooltipStyle()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </PageLayout>
  );
}
