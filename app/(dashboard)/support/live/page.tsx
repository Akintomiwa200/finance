"use client";

import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { useFetch } from "@/src/hooks/use-fetch";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { formatDate } from "@/src/lib/utils";
import type { LiveFixSession } from "@/src/types/admin";
import { Radio, Monitor, Plus } from "lucide-react";
import Link from "next/link";

export default function CustomerLiveFixPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useFetch<LiveFixSession[]>("/api/support/live-fix");
  useSupportRealtime(refetch);

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
            "View"
          )}
        </Button>
      ),
    },
  ];

  const activeCount = data?.filter((s) => s.status === "active").length ?? 0;
  const waitingCount = data?.filter((s) => s.status === "waiting").length ?? 0;

  return (
    <PageLayout
      title="Live Fix Sessions"
      description="Remote assistance — share your screen so our team can help in real time"
      breadcrumbs={[
        { label: "Support", href: "/support" },
        { label: "Live Fix" },
      ]}
      actions={
        <Link href="/support">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Request from Ticket
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Waiting for agent</p>
              <p className="text-2xl font-bold">{waitingCount}</p>
            </div>
            <Radio className="h-8 w-8 text-warning opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active sessions</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <Monitor className="h-8 w-8 text-success opacity-50" />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 bg-info/5 border-info/20">
        <CardContent className="p-4 text-sm">
          <p className="font-medium mb-1">How Live Fix works</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-1">
            <li>Open a support ticket and click &quot;Request Live Fix&quot;</li>
            <li>Share the session code with your assigned agent</li>
            <li>Grant screen access when prompted — similar to TeamViewer or AnyDesk</li>
          </ol>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={data ?? []}
        keyField="id"
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/support/live/${row.id}`)}
        emptyTitle="No live sessions yet"
        emptyDescription="Request a remote session from any open support ticket."
      />
    </PageLayout>
  );
}
