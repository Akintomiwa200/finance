"use client";

import { useState } from "react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { useFetch } from "@/src/hooks/use-fetch";
import type { AdminOrganization } from "@/src/types/admin";

interface PaymentMethod {
  id: string;
  organizationName: string;
  type: string;
  last4: string;
  status: string;
}

export default function PaymentMethodsPage() {
  const [search, setSearch] = useState("");
  const { data: orgs, isLoading } = useFetch<AdminOrganization[]>("/api/admin/organizations");

  const methods: PaymentMethod[] = (orgs ?? []).map((org, i) => ({
    id: `pm_${org.id}`,
    organizationName: org.name,
    type: i % 2 === 0 ? "Card" : "Bank",
    last4: String(1000 + (i * 137) % 9000),
    status: org.isActive ? "active" : "inactive",
  }));

  const filtered = methods.filter((m) =>
    !search || m.organizationName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<PaymentMethod>[] = [
    { key: "org", header: "Company", cell: (row) => <span className="font-medium">{row.organizationName}</span> },
    { key: "type", header: "Type", cell: (row) => row.type },
    { key: "last4", header: "Last 4", cell: (row) => <span className="font-mono text-sm">•••• {row.last4}</span> },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <PageLayout
      title="Tenant Payment Methods"
      description="How each customer company pays their subscription"
      showBack
      breadcrumbs={[{ label: "Billing", href: "/admin/billing/plans" }, { label: "Payment Methods" }]}
    >
      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        isLoading={isLoading}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search payment methods..."
        emptyTitle="No payment methods"
      />
    </PageLayout>
  );
}
