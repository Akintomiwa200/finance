"use client";
import { SectionPage } from "@/src/components/templates/section-page";
import { Calendar, Users, FileText } from "lucide-react";

export default function PayrollPage() {
  return (
    <SectionPage
      title="Payroll"
      description="Manage payroll runs, compute salaries, and process payments."
      links={[
        { label: "Payroll Runs", href: "/payroll/runs", description: "Create and manage payroll processing runs", icon: Calendar },
        { label: "Employees", href: "/employees", description: "View employee roster", icon: Users },
      ]}
    />
  );
}
