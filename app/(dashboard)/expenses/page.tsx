"use client";
import { SectionPage } from "@/src/components/templates/section-page";
import { FileText, Banknote, BarChart3 } from "lucide-react";

export default function ExpensesPage() {
  return (
    <SectionPage
      title="Expenses"
      description="Manage employee expense reports, approvals, and reimbursements."
      links={[
        { label: "Expense Reports", href: "/expenses/reports", description: "Create and manage employee expense reports", icon: FileText },
        { label: "Reimbursements", href: "/expenses/reimbursements", description: "Track and process employee reimbursements", icon: Banknote },
        { label: "Expense Analytics", href: "/reports/expenses", description: "View expense analytics and trends", icon: BarChart3 },
      ]}
    />
  );
}
