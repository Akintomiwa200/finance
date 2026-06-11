"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import type { AdminOrganization } from "@/src/types/admin";

interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  plan: string;
  amount: number;
  status: string;
  renewsAt: string;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: orgs, isLoading } = useFetch<AdminOrganization[]>("/api/admin/organizations");

  const subscriptions: Subscription[] = (orgs ?? []).map((org, i) => ({
    id: `sub_${org.id}`,
    organizationId: org.id,
    organizationName: org.name,
    plan: ["Startup", "Business", "Enterprise"][i % 3],
    amount: [25000, 75000, 200000][i % 3],
    status: org.isActive ? "active" : "suspended",
    renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const filtered = subscriptions.filter((s) =>
    !search || s.organizationName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Subscription>[] = [
    { key: "org", header: "Company", cell: (row) => <span className="font-medium">{row.organizationName}</span> },
    { key: "plan", header: "Plan", cell: (row) => row.plan },
    { key: "amount", header: "Amount", cell: (row) => formatCurrency(row.amount) },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "renews", header: "Renews", cell: (row) => <span className="text-sm text-muted-foreground">{formatDate(row.renewsAt)}</span> },
    { key: "actions", header: "", cell: (row) => <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/companies/${row.organizationId}`)}>View</Button> },
  ];

  return (
    <PageLayout
      title="Subscriptions"
      description="Active tenant subscription plans"
      showBack
      breadcrumbs={[{ label: "Billing", href: "/admin/billing" }, { label: "Subscriptions" }]}
    >
      <DataTable columns={columns} data={filtered} keyField="id" isLoading={isLoading} searchable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search subscriptions..." emptyTitle="No subscriptions" />
    </PageLayout>
  );
}
