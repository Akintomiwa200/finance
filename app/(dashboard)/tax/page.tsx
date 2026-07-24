"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { Percent, FileCheck, Calendar, FileSpreadsheet } from "lucide-react";

export default function TaxPage() {
  return (
    <SectionPage
      title="Tax Management"
      description="Manage tax configurations, returns, and stay on top of deadlines."
      links={[
        { label: "Tax Configurations", href: "/tax/configurations", description: "Configure tax rates, thresholds, and rules", icon: Percent },
        { label: "Tax Returns", href: "/tax/returns", description: "File and manage tax returns", icon: FileCheck },
        { label: "VAT/GST Reports", href: "/tax/vat-reports", description: "Generate VAT and GST reports", icon: FileSpreadsheet },
        { label: "Tax Calendar", href: "/tax/calendar", description: "View upcoming tax filing deadlines and events", icon: Calendar },
      ]}
    />
  );
}
