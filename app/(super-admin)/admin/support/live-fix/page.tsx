"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { LiveFixSession } from "@/src/types/admin";
import { Radio, Monitor } from "lucide-react";

export default function LiveFixPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useFetch<LiveFixSession[]>("/api/admin/support/live-fix");
  useAdminRealtime(refetch);
  const { mutate, isPending } = useMutation({
    mutationFn: (sessionId: string) =>
      api.post("/api/admin/support/live-fix", { action: "start", sessionId }),
  });

  const columns: Column<LiveFixSession>[] = [
    { key: "code", header: "Session Code", cell: (row) => <span className="font-mono font-medium">{row.sessionCode}</span> },
    { key: "org", header: "Company", cell: (row) => row.organizationName },
    { key: "requested", header: "Requested By", cell: (row) => row.requestedBy },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "created", header: "Requested", cell: (row) => <span className="text-sm text-muted-foreground">{formatDate(row.createdAt, "relative")}</span> },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex gap-1">
          {row.status === "waiting" && (
            <Button variant="primary" size="sm" loading={isPending} onClick={async () => { await mutate(row.id); refetch(); }}>
              Join Session
            </Button>
          )}
          {row.status === "active" && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/support/live-fix/${row.id}`)}>
              <Monitor className="h-3.5 w-3.5" /> Connect
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Live Fix Sessions"
      description="Remote assistance sessions — like AnyDesk for tenant support"
      showBack
      breadcrumbs={[{ label: "Support", href: "/admin/support" }, { label: "Live Fix" }]}
      actions={
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Radio className="h-4 w-4 text-success animate-pulse" />
          Listening for session requests
        </div>
      }
    >
      <DataTable columns={columns} data={data ?? []} keyField="id" isLoading={isLoading} emptyTitle="No live-fix sessions" emptyDescription="Sessions appear when tenants request remote assistance." />
    </PageLayout>
  );
}
