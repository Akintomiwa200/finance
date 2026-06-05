"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { Users, FileSpreadsheet, CreditCard, FileMinus } from "lucide-react";

export default function AccountsReceivable() {
  return (
    <SectionPage
      title="Accounts Receivable"
      description="Manage customers, sales invoices, and incoming payments."
      links={[
        { label: "Customers", href: "/receivables/customers", description: "Manage your customer list", icon: Users },
        { label: "Sales Invoices", href: "/receivables/sales-invoices", description: "Create and send sales invoices", icon: FileSpreadsheet },
        { label: "Customer Payments", href: "/receivables/customer-payments", description: "Track incoming customer payments", icon: CreditCard },
        { label: "Credit Notes", href: "/receivables/credit-notes", description: "Issue credit notes to customers", icon: FileMinus },
      ]}
    />
  );
}
