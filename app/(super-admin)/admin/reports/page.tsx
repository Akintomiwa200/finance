"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { BarChart3, TrendingUp, Monitor, PieChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <SectionPage
      title="Reports & Analytics"
      description="Platform-wide analytics and performance insights"
      links={[
        { label: "Revenue Analytics", href: "/admin/reports/revenue", description: "Monthly revenue, MRR, and billing trends", icon: BarChart3 },
        { label: "Growth Metrics", href: "/admin/reports/growth", description: "Company signups, user growth, and churn", icon: TrendingUp },
        { label: "Usage Analytics", href: "/admin/reports/usage", description: "Module usage, API calls, and feature adoption", icon: Monitor },
        { label: "Platform Health", href: "/admin/reports/platform-health", description: "System uptime, errors, and performance", icon: PieChart },
      ]}
    />
  );
}
