"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { FileCheck, FileSpreadsheet, Percent, Calendar } from "lucide-react";

export default function TaxPage() {
  return (
    <SectionPage
      title="Tax Management"
      description="Manage tax returns, VAT/GST reports, withholding tax, and stay on top of deadlines."
      links={[
        { label: "Tax Returns", href: "/tax/returns", description: "File and manage tax returns", icon: FileCheck },
        { label: "VAT/GST Reports", href: "/tax/vat-reports", description: "Generate VAT and GST reports", icon: FileSpreadsheet },
        { label: "Withholding Tax", href: "/tax/withholding", description: "Manage withholding tax deductions and remittances", icon: Percent },
        { label: "Tax Calendar", href: "/tax/calendar", description: "View upcoming tax filing deadlines and events", icon: Calendar },
      ]}
    />
  );
}
