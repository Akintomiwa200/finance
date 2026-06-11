"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageLayout } from "@/src/components/layout/page-layout";
import { ChartCard } from "@/src/components/charts/chart-card";
import { StatsGrid } from "@/src/components/charts/stats-grid";
import { CHART_COLORS, getChartTooltipStyle, getChartGridColor, getChartAxisColor } from "@/src/components/charts/chart-theme";
import { Activity, AlertTriangle, Clock } from "lucide-react";

const uptimeData = [
  { day: "Mon", uptime: 99.98, errors: 2 },
  { day: "Tue", uptime: 99.95, errors: 5 },
  { day: "Wed", uptime: 99.99, errors: 1 },
  { day: "Thu", uptime: 99.97, errors: 3 },
  { day: "Fri", uptime: 99.96, errors: 4 },
  { day: "Sat", uptime: 100, errors: 0 },
  { day: "Sun", uptime: 100, errors: 0 },
];

export default function PlatformHealthPage() {
  return (
    <PageLayout
      title="Platform Health"
      description="System uptime, errors, and performance"
      showBack
      breadcrumbs={[{ label: "Reports", href: "/admin/reports/revenue" }, { label: "Platform Health" }]}
    >
      <StatsGrid
        stats={[
          { label: "Uptime (7d)", value: "99.98%", icon: <Activity className="h-4 w-4" /> },
          { label: "Avg Response", value: "142ms", icon: <Clock className="h-4 w-4" /> },
          { label: "Errors (7d)", value: "15", icon: <AlertTriangle className="h-4 w-4" /> },
        ]}
        columns={3}
      />
      <ChartCard title="Daily Uptime (%)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={uptimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} />
            <XAxis dataKey="day" stroke={getChartAxisColor()} fontSize={12} />
            <YAxis domain={[99.9, 100]} stroke={getChartAxisColor()} fontSize={12} />
            <Tooltip contentStyle={getChartTooltipStyle()} />
            <Line type="monotone" dataKey="uptime" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </PageLayout>
  );
}
