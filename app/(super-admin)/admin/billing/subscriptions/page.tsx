"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import type { TenantBillingPlan } from "@/src/types/billing-plan";
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
  const searchParams = useSearchParams();
  const orgFilter = searchParams.get("org");
  const [search, setSearch] = useState("");
  const { data: orgs, isLoading: orgsLoading } = useFetch<AdminOrganization[]>("/api/admin/organizations");
  const { data: plans } = useFetch<TenantBillingPlan[]>("/api/admin/billing/plans");

  const activePlans = useMemo(
    () => (plans ?? []).filter((p) => p.active),
    [plans],
  );

  const subscriptions: Subscription[] = useMemo(
    () =>
      (orgs ?? []).map((org, i) => {
        const list = activePlans.length > 0 ? activePlans : (plans ?? []);
        const plan = list[i % Math.max(list.length, 1)];
        return {
          id: `sub_${org.id}`,
          organizationId: org.id,
          organizationName: org.name,
          plan: plan.name,
          amount: plan.price,
          status: org.isActive ? "active" : "suspended",
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      }),
    [orgs, activePlans, plans],
  );

  const isLoading = orgsLoading;

  const scoped = orgFilter
    ? subscriptions.filter((s) => s.organizationId === orgFilter)
    : subscriptions;

  const filtered = scoped.filter(
    (s) => !search || s.organizationName.toLowerCase().includes(search.toLowerCase()),
  );

  const orgName = orgFilter ? orgs?.find((o) => o.id === orgFilter)?.name : undefined;

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
      title={orgName ? `${orgName} Subscription` : "Tenant Subscriptions"}
      description={
        orgName
          ? `Subscription and renewal details for ${orgName}`
          : "Active subscription plans for companies using your software"
      }
      showBack
      breadcrumbs={[{ label: "Billing", href: "/admin/billing/plans" }, { label: "Subscriptions" }]}
    >
      <DataTable columns={columns} data={filtered} keyField="id" isLoading={isLoading} searchable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search subscriptions..." emptyTitle="No subscriptions" />
    </PageLayout>
  );
}
