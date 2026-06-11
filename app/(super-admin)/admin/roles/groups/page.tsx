"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import type { PermissionGroup } from "@/src/types/admin";

export default function GroupsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useFetch<PermissionGroup[]>("/api/admin/groups");
  useAdminRealtime(refetch);

  const filtered = (data ?? []).filter((g) =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<PermissionGroup>[] = [
    { key: "name", header: "Group", cell: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.name}</span>
        {row.isSystem && <Badge variant="info">System</Badge>}
      </div>
    )},
    { key: "desc", header: "Description", cell: (row) => <span className="text-muted-foreground text-sm">{row.description ?? "—"}</span> },
    { key: "perms", header: "Modules", cell: (row) => Object.keys(row.permissions).length },
    { key: "assigned", header: "Assigned", cell: (row) => row.assignmentCount },
    { key: "actions", header: "", cell: (row) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/roles/groups/${row.id}`)}>View</Button>
    )},
  ];

  return (
    <PageLayout
      title="Privilege Groups"
      description="Only super admin can create groups. Companies assign staff to these groups."
      showBack
      breadcrumbs={[{ label: "Roles", href: "/admin/roles/groups" }, { label: "Groups" }]}
      actions={
        <Button variant="primary" onClick={() => router.push("/admin/roles/groups/new")}>
          <Plus className="h-4 w-4" /> Create Group
        </Button>
      }
    >
      <DataTable columns={columns} data={filtered} keyField="id" isLoading={isLoading} searchable searchValue={search} onSearchChange={setSearch} onRowClick={(row) => router.push(`/admin/roles/groups/${row.id}`)} emptyTitle="No groups yet" emptyAction={<Button onClick={() => router.push("/admin/roles/groups/new")}>Create Group</Button>} />
    </PageLayout>
  );
}
