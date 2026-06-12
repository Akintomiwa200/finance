"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { DashCard } from "@/src/components/admin/reports-shared";
import { AdminSupportTabs, SupportStatCard } from "@/src/components/admin/support-shared";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { LiveFixSession } from "@/src/types/admin";
import { Radio, Monitor, Clock, Building2 } from "lucide-react";

export function AdminLiveFixPageContent() {
  const router = useRouter();
  const { data, isLoading, refetch } = useFetch<LiveFixSession[]>(
    "/api/admin/support/live-fix",
  );
  useAdminRealtime(refetch);

  const { mutate, isPending } = useMutation({
    mutationFn: (sessionId: string) =>
      api.post("/api/admin/support/live-fix", { action: "start", sessionId }),
  });

  const stats = useMemo(() => {
    const sessions = data ?? [];
    return {
      waiting: sessions.filter((s) => s.status === "waiting").length,
      active: sessions.filter((s) => s.status === "active").length,
      ended: sessions.filter((s) => s.status === "ended").length,
    };
  }, [data]);

  const columns: Column<LiveFixSession>[] = [
    {
      key: "code",
      header: "Session",
      cell: (row) => (
        <div>
          <span className="font-mono font-medium">{row.sessionCode}</span>
          {row.ticketId && (
            <Link
              href={`/admin/support/${row.ticketId}`}
              onClick={(e) => e.stopPropagation()}
              className="block text-xs text-brand-600 hover:underline mt-0.5"
            >
              Linked ticket
            </Link>
          )}
        </div>
      ),
    },
    {
      key: "org",
      header: "Tenant",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.organizationName}</span>
        </div>
      ),
    },
    { key: "requested", header: "Requested by", cell: (row) => row.requestedBy },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: "created",
      header: "Queued",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.createdAt, "relative")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex gap-1">
          {row.status === "waiting" && (
            <Button
              variant="primary"
              size="sm"
              loading={isPending}
              onClick={async (e) => {
                e.stopPropagation();
                await mutate(row.id);
                refetch();
              }}
            >
              Join
            </Button>
          )}
          {row.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/support/live-fix/${row.id}`);
              }}
            >
              <Monitor className="h-3.5 w-3.5 mr-1" /> Connect
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Live Fix Queue"
      description="Remote desktop sessions — join waiting customers and assist in-browser"
      showBack
      breadcrumbs={[
        { label: "Support", href: "/admin/support" },
        { label: "Live Fix" },
      ]}
      actions={
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Radio className="h-4 w-4 text-success animate-pulse" />
          Listening for requests
        </div>
      }
    >
      <AdminSupportTabs activeHref="/admin/support/live-fix" />

      <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
        <SupportStatCard
          label="Waiting"
          value={stats.waiting}
          icon={<Clock className="h-8 w-8 text-warning" />}
        />
        <SupportStatCard
          label="Active"
          value={stats.active}
          icon={<Monitor className="h-8 w-8 text-success" />}
        />
        <SupportStatCard
          label="Ended today"
          value={stats.ended}
          icon={<Radio className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <DashCard className="mb-6 text-sm text-muted-foreground">
        Customers request live help from their ticket. Join a waiting session to start WebRTC remote desktop and chat.
      </DashCard>

      <DataTable
        columns={columns}
        data={data ?? []}
        keyField="id"
        isLoading={isLoading}
        onRowClick={(row) => {
          if (row.status !== "ended") {
            router.push(`/admin/support/live-fix/${row.id}`);
          }
        }}
        emptyTitle="No live-fix sessions"
        emptyDescription="Sessions appear when tenants request remote assistance."
      />
    </PageLayout>
  );
}
