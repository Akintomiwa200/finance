"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { formatDate } from "@/src/lib/utils";
import type { AdminAuditLog } from "@/src/types/admin";

export default function AuditLogsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useFetch<AdminAuditLog[]>("/api/admin/audit-logs");
  useAdminRealtime(refetch);

  const filtered = (data ?? []).filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return log.action.toLowerCase().includes(q) || log.entity.toLowerCase().includes(q) || log.userName?.toLowerCase().includes(q) || log.organizationName?.toLowerCase().includes(q);
  });

  const columns: Column<AdminAuditLog>[] = [
    { key: "action", header: "Action", cell: (row) => <span className="font-medium">{row.action}</span> },
    { key: "entity", header: "Entity", cell: (row) => <span className="font-mono text-xs">{row.entity}</span> },
    { key: "user", header: "User", cell: (row) => row.userName ?? "—" },
    { key: "org", header: "Company", cell: (row) => row.organizationName ?? "—" },
    { key: "time", header: "Time", cell: (row) => <span className="text-sm text-muted-foreground">{formatDate(row.createdAt, "relative")}</span> },
    { key: "actions", header: "", cell: (row) => <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/audit-logs/${row.id}`)}>Details</Button> },
  ];

  return (
    <PageLayout title="Audit Logs" description="Platform-wide activity and change history">
      <DataTable columns={columns} data={filtered} keyField="id" isLoading={isLoading} searchable searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search logs..." onRowClick={(row) => router.push(`/admin/audit-logs/${row.id}`)} emptyTitle="No audit logs yet" />
    </PageLayout>
  );
}
