"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import type { PermissionGroup } from "@/src/types/admin";

export default function SystemRolesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFetch<PermissionGroup[]>("/api/admin/groups");

  const systemGroups = (data ?? []).filter((g) => g.isSystem);
  const filtered = systemGroups.filter((g) =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<PermissionGroup>[] = [
    { key: "name", header: "Role", cell: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.name}</span>
        <Badge variant="info">System</Badge>
      </div>
    )},
    { key: "desc", header: "Description", cell: (row) => <span className="text-muted-foreground text-sm">{row.description ?? "—"}</span> },
    { key: "perms", header: "Modules", cell: (row) => Object.keys(row.permissions).length },
    { key: "actions", header: "", cell: (row) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/roles/groups/${row.id}`)}>View</Button>
    )},
  ];

  return (
    <PageLayout
      title="System Roles"
      description="Built-in role definitions and defaults"
      showBack
      breadcrumbs={[{ label: "Roles", href: "/admin/roles/groups" }, { label: "System Roles" }]}
    >
      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        isLoading={isLoading}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search system roles..."
        emptyTitle="No system roles"
      />
    </PageLayout>
  );
}
