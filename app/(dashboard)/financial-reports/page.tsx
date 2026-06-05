"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { TrendingUp, Scale, FileText, Clock, Percent } from "lucide-react";

export default function FinancialReports() {
  return (
    <SectionPage
      title="Financial Reports"
      description="Access key financial statements and analysis reports."
      links={[
        { label: "Profit & Loss", href: "/reports/pnl", description: "View profit and loss statements", icon: TrendingUp },
        { label: "Balance Sheet", href: "/reports/balance-sheet", description: "View balance sheet reports", icon: Scale },
        { label: "Trial Balance", href: "/reports/trial-balance", description: "Run trial balance reports", icon: FileText },
        { label: "Aging Reports", href: "/reports/aging", description: "View receivable and payable aging", icon: Clock },
        { label: "Financial Ratios", href: "/reports/ratios", description: "Calculate and analyze financial ratios", icon: Percent },
      ]}
    />
  );
}
