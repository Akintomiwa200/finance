"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Receipt, Settings } from "lucide-react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { StatsGrid } from "@/src/components/charts/stats-grid";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { useFetch } from "@/src/hooks/use-fetch";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { formatDate } from "@/src/lib/utils";
import { AdminDetailPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  email: string | null;
  phone: string | null;
  isPlatform: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { employees: number; departments: number; transactions: number };
  departments: { id: string; name: string; code: string; _count: { employees: number } }[];
  employees: { id: string; firstName: string; lastName: string; email: string; role: string }[];
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: org, isLoading } = useFetch<OrgDetail>(`/api/admin/organizations/${id}`);

  const deptColumns: Column<OrgDetail["departments"][0]>[] = [
    { key: "name", header: "Department", cell: (row) => <span className="font-medium">{row.name}</span> },
    { key: "code", header: "Code", cell: (row) => <span className="font-mono text-xs">{row.code}</span> },
    { key: "employees", header: "Employees", cell: (row) => row._count.employees },
    {
      key: "actions",
      header: "",
      cell: (row) => <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/departments/${row.id}`)}>View</Button>,
    },
  ];

  if (isLoading) {
    return (
      <PageLayout title="Loading..." showBack>
        <AdminDetailPageSkeleton />
      </PageLayout>
    );
  }

  if (!org) {
    return <PageLayout title="Company not found" showBack />;
  }

  return (
    <PageLayout
      title={org.name}
      description={`@${org.slug} · Joined ${formatDate(org.createdAt, "long")}`}
      showBack
      breadcrumbs={[
        { label: "Companies", href: "/admin/companies" },
        { label: org.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge status={org.isActive ? "active" : "suspended"} />
          <Button variant="outline" onClick={() => router.push(`/admin/companies/${id}/edit`)}>Edit</Button>
        </div>
      }
    >
      <div className="flex items-center gap-4 rounded-[22px] border border-border bg-card p-5 shadow-sm">
        <CompanyLogo name={org.name} logo={org.logo} size={64} />
        <div>
          <p className="text-lg font-semibold text-foreground">{org.name}</p>
          <p className="text-sm text-muted-foreground">@{org.slug}</p>
          {org.email && (
            <p className="mt-1 text-sm text-muted-foreground">{org.email}</p>
          )}
        </div>
      </div>

      <StatsGrid
        stats={[
          { label: "Employees", value: String(org._count.employees), icon: <Users className="h-4 w-4" /> },
          { label: "Departments", value: String(org._count.departments), icon: <Briefcase className="h-4 w-4" /> },
          { label: "Transactions", value: String(org._count.transactions), icon: <Receipt className="h-4 w-4" /> },
        ]}
        columns={3}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Link href={`/admin/billing/subscriptions?org=${id}`} className="no-underline">
          <Card className="hover:border-accent-200 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Tenant Billing</CardTitle></CardHeader>
            <CardContent><p className="text-xs text-muted-foreground">Subscription plan, invoices & payment</p></CardContent>
          </Card>
        </Link>
        <Link href={`/admin/modules/${id}`} className="no-underline">
          <Card className="hover:border-accent-200 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Modules</CardTitle></CardHeader>
            <CardContent><p className="text-xs text-muted-foreground">Configure enabled modules</p></CardContent>
          </Card>
        </Link>
        <Link href={`/admin/settings/general?org=${id}`} className="no-underline">
          <Card className="hover:border-accent-200 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</CardTitle></CardHeader>
            <CardContent><p className="text-xs text-muted-foreground">Organization preferences</p></CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Departments</h2>
        <DataTable columns={deptColumns} data={org.departments} keyField="id" onRowClick={(row) => router.push(`/admin/departments/${row.id}`)} emptyTitle="No departments" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tenant Users</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {org.employees.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                <p className="text-xs text-muted-foreground">{emp.email}</p>
              </div>
              <span className="text-xs text-muted-foreground">{emp.role.replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
