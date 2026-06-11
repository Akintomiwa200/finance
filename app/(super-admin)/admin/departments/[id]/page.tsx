"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatsGrid } from "@/src/components/charts/stats-grid";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { Users } from "lucide-react";

interface DeptDetail {
  id: string;
  name: string;
  code: string;
  description: string | null;
  head: string | null;
  costCenter: string | null;
  organization: { id: string; name: string };
  employees: { id: string; firstName: string; lastName: string; email: string; role: string }[];
  _count: { employees: number };
}

export default function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: dept, isLoading } = useFetch<DeptDetail>(`/api/admin/departments/${id}`);

  const columns: Column<DeptDetail["employees"][0]>[] = [
    { key: "name", header: "Employee", cell: (row) => <span className="font-medium">{row.firstName} {row.lastName}</span> },
    { key: "email", header: "Email", cell: (row) => <span className="text-muted-foreground">{row.email}</span> },
    { key: "role", header: "Role", cell: (row) => row.role.replace(/_/g, " ") },
  ];

  if (isLoading || !dept) return <PageLayout title={isLoading ? "Loading..." : "Not found"} showBack />;

  return (
    <PageLayout
      title={dept.name}
      description={`${dept.code} · ${dept.organization.name}`}
      showBack
      breadcrumbs={[
        { label: "Departments", href: "/admin/departments" },
        { label: dept.name },
      ]}
      actions={<Button variant="outline" onClick={() => router.push(`/admin/companies/${dept.organization.id}`)}>View Company</Button>}
    >
      <StatsGrid stats={[{ label: "Employees", value: String(dept._count.employees), icon: <Users className="h-4 w-4" /> }]} columns={1} />
      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        <div><span className="text-muted-foreground">Head:</span> {dept.head ?? "—"}</div>
        <div><span className="text-muted-foreground">Cost Center:</span> {dept.costCenter ?? "—"}</div>
        <div className="sm:col-span-2"><span className="text-muted-foreground">Description:</span> {dept.description ?? "—"}</div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Employees</h2>
        <DataTable columns={columns} data={dept.employees} keyField="id" emptyTitle="No employees in this department" />
      </div>
    </PageLayout>
  );
}
