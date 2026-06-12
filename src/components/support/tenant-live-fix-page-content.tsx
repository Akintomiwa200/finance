"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { DashCard } from "@/src/components/admin/reports-shared";
import { useFetch } from "@/src/hooks/use-fetch";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { formatDate } from "@/src/lib/utils";
import type { LiveFixSession } from "@/src/types/admin";
import { Radio, Monitor, Plus } from "lucide-react";

export function TenantLiveFixPageContent() {
  const router = useRouter();
  const { data, isLoading, refetch } = useFetch<LiveFixSession[]>(
    "/api/support/live-fix",
  );
  useSupportRealtime(refetch);

  const activeCount = data?.filter((s) => s.status === "active").length ?? 0;
  const waitingCount = data?.filter((s) => s.status === "waiting").length ?? 0;

  const columns: Column<LiveFixSession>[] = [
    {
      key: "code",
      header: "Session Code",
      cell: (row) => <span className="font-mono font-medium">{row.sessionCode}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "ticket",
      header: "Ticket",
      cell: (row) =>
        row.ticketId ? (
          <Link
            href={`/support/${row.ticketId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-brand-600 hover:underline"
          >
            View issue
          </Link>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      key: "created",
      header: "Requested",
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/support/live/${row.id}`)}
        >
          {row.status === "active" ? (
            <>
              <Monitor className="h-3.5 w-3.5 mr-1" /> Join
            </>
          ) : (
            "Open"
          )}
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Live Fix Sessions"
      description="Remote assistance — share your screen so our platform team can help in real time"
      breadcrumbs={[
        { label: "Support", href: "/support" },
        { label: "Live Fix" },
      ]}
      actions={
        <Link href="/support">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Request from Issue
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <DashCard className="!p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Waiting for agent</p>
            <p className="mt-1 text-2xl font-semibold">{waitingCount}</p>
          </div>
          <Radio className="h-8 w-8 text-warning opacity-50" />
        </DashCard>
        <DashCard className="!p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Active sessions</p>
            <p className="mt-1 text-2xl font-semibold">{activeCount}</p>
          </div>
          <Monitor className="h-8 w-8 text-success opacity-50" />
        </DashCard>
      </div>

      <DashCard className="mb-6 text-sm">
        <p className="font-medium mb-2">How live fix works</p>
        <ol className="list-decimal list-inside text-muted-foreground space-y-1">
          <li>Open a support issue and click &quot;Request Live Help&quot;</li>
          <li>Share the session code with your assigned agent if needed</li>
          <li>Grant screen access when prompted — fully in-browser, no desktop app</li>
        </ol>
      </DashCard>

      <DataTable
        columns={columns}
        data={data ?? []}
        keyField="id"
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/support/live/${row.id}`)}
        emptyTitle="No live sessions yet"
        emptyDescription="Request a remote session from any open support issue."
      />
    </PageLayout>
  );
}
