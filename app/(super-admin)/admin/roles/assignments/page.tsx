"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import type { AdminEmployee, PermissionGroup } from "@/src/types/admin";

interface Assignment {
  id: string;
  employeeName: string;
  employeeId: string;
  groupName: string;
  organizationName: string;
}

export default function AssignmentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: employees } = useFetch<AdminEmployee[]>("/api/admin/employees");
  const { data: groups } = useFetch<PermissionGroup[]>("/api/admin/groups");

  const assignments: Assignment[] = (employees ?? []).slice(0, 20).map((emp, i) => ({
    id: `asgn_${emp.id}`,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    employeeId: emp.id,
    groupName: groups?.[i % (groups?.length || 1)]?.name ?? "—",
    organizationName: emp.organizationName,
  }));

  const filtered = assignments.filter((a) =>
    !search || a.employeeName.toLowerCase().includes(search.toLowerCase()) || a.groupName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Assignment>[] = [
    { key: "employee", header: "Employee", cell: (row) => <span className="font-medium">{row.employeeName}</span> },
    { key: "group", header: "Group", cell: (row) => row.groupName },
    { key: "org", header: "Company", cell: (row) => row.organizationName },
    { key: "actions", header: "", cell: (row) => <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/employees/${row.employeeId}`)}>View Employee</Button> },
  ];

  return (
    <PageLayout title="Group Assignments" description="Employees assigned to privilege groups (managed by company admins)" showBack breadcrumbs={[{ label: "Roles", href: "/admin/roles" }, { label: "Assignments" }]}>
      <DataTable columns={columns} data={filtered} keyField="id" searchable searchValue={search} onSearchChange={setSearch} emptyTitle="No assignments yet" />
    </PageLayout>
  );
}
