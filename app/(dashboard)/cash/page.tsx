"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { Landmark, RefreshCw, TrendingUp, ArrowLeftRight } from "lucide-react";

export default function CashPage() {
  return (
    <SectionPage
      title="Cash Management"
      description="Manage bank accounts, reconcile transactions, and monitor cash flow."
      links={[
        { label: "Bank Accounts", href: "/cash/bank-accounts", description: "Manage your organization's bank accounts", icon: Landmark },
        { label: "Bank Reconciliation", href: "/cash/bank-reconciliation", description: "Reconcile bank statements with your records", icon: RefreshCw },
        { label: "Cash Flow Statement", href: "/cash/cash-flow", description: "View and analyze cash flow over time", icon: TrendingUp },
        { label: "Deposits & Withdrawals", href: "/cash/transactions", description: "Record deposits, withdrawals, and transfers", icon: ArrowLeftRight },
      ]}
    />
  );
}
