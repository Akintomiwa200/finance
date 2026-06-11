"use client";

import { useState } from "react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { useFetch } from "@/src/hooks/use-fetch";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { tenantPlanByIndex } from "@/src/lib/tenant-billing-plans";
import type { AdminOrganization } from "@/src/types/admin";

interface Invoice {
  id: string;
  number: string;
  organizationName: string;
  amount: number;
  status: string;
  issuedAt: string;
}

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const { data: orgs, isLoading } = useFetch<AdminOrganization[]>("/api/admin/organizations");

  const invoices: Invoice[] = (orgs ?? []).flatMap((org, i) => {
    const plan = tenantPlanByIndex(i);
    return [
      {
        id: `inv_${org.id}_1`,
        number: `INV-${String(i + 1).padStart(4, "0")}`,
        organizationName: org.name,
        amount: plan.price,
        status: i % 4 === 0 ? "pending" : "approved",
        issuedAt: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  });

  const filtered = invoices.filter((inv) =>
    !search || inv.organizationName.toLowerCase().includes(search.toLowerCase()) || inv.number.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Invoice>[] = [
    { key: "number", header: "Invoice #", cell: (row) => <span className="font-mono text-sm">{row.number}</span> },
    { key: "org", header: "Company", cell: (row) => row.organizationName },
    { key: "amount", header: "Amount", cell: (row) => formatCurrency(row.amount) },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status === "approved" ? "approved" : "pending"} /> },
    { key: "issued", header: "Issued", cell: (row) => <span className="text-sm text-muted-foreground">{formatDate(row.issuedAt)}</span> },
  ];

  return (
    <PageLayout
      title="Tenant Invoices"
      description="Subscription invoices billed to companies using your software"
      showBack
      breadcrumbs={[{ label: "Billing", href: "/admin/billing/plans" }, { label: "Invoices" }]}
    >
      <DataTable columns={columns} data={filtered} keyField="id" isLoading={isLoading} searchable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search invoices..." emptyTitle="No invoices" />
    </PageLayout>
  );
}
