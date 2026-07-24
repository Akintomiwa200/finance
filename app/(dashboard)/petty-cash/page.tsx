"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { ClipboardList, Banknote, FileCheck, Calculator, RefreshCw } from "lucide-react";

export default function PettyCashPage() {
  return (
    <SectionPage
      title="Petty Cash"
      description="Manage petty cash operations — requests, reimbursements, register, and reconciliation."
      links={[
        { label: "Petty Cash Requests", href: "/petty-cash/requests", description: "Submit and manage petty cash requests", icon: ClipboardList },
        { label: "Petty Cash Register", href: "/petty-cash/register", description: "Track all petty cash transactions", icon: Banknote },
        { label: "Reimbursements", href: "/petty-cash/reimbursements", description: "Process and track employee reimbursements", icon: FileCheck },
        { label: "Reconciliation", href: "/petty-cash/reconcile", description: "Reconcile petty cash records with bank statements", icon: Calculator },
      ]}
    />
  );
}
