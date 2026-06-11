"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import type { AdminEmployee } from "@/src/types/admin";

export default function EmployeesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useFetch<AdminEmployee[]>("/api/admin/employees");
  useAdminRealtime(refetch);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.organizationName.toLowerCase().includes(q),
    );
  }, [data, search]);

  const columns: Column<AdminEmployee>[] = [
    { key: "name", header: "Name", cell: (row) => <span className="font-medium">{row.firstName} {row.lastName}</span> },
    { key: "email", header: "Email", cell: (row) => <span className="text-muted-foreground">{row.email}</span> },
    { key: "code", header: "Code", cell: (row) => <span className="font-mono text-xs">{row.employeeCode}</span> },
    { key: "role", header: "Role", cell: (row) => row.role.replace(/_/g, " ") },
    { key: "org", header: "Company", cell: (row) => row.organizationName },
    { key: "dept", header: "Department", cell: (row) => row.departmentName ?? "—" },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} /> },
    { key: "actions", header: "", cell: (row) => <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/admin/employees/${row.id}`); }}>View</Button> },
  ];

  return (
    <PageLayout title="All Employees" description="Cross-tenant employee directory">
      <DataTable columns={columns} data={filtered} keyField="id" isLoading={isLoading} searchable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search employees..." onRowClick={(row) => router.push(`/admin/employees/${row.id}`)} emptyTitle="No employees found" />
    </PageLayout>
  );
}
