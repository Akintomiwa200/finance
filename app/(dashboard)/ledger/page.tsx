"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { ListTree, NotebookPen, Scale, FileText } from "lucide-react";

export default function LedgerPage() {
  return (
    <SectionPage
      title="General Ledger"
      description="Core accounting ledger — manage your chart of accounts, journal entries, and financial reports."
      links={[
        { label: "Chart of Accounts", href: "/ledger/chart-of-accounts", description: "View and manage your chart of accounts hierarchy", icon: ListTree },
        { label: "Journal Entries", href: "/ledger/journal-entries", description: "Record and review journal entries for all transactions", icon: NotebookPen },
        { label: "Trial Balance", href: "/ledger/trial-balance", description: "Run trial balance reports to verify accounting accuracy", icon: Scale },
        { label: "General Ledger Report", href: "/ledger/report", description: "Generate detailed general ledger reports", icon: FileText },
      ]}
    />
  );
}
