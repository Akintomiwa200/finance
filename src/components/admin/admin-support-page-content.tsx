"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { DashCard } from "@/src/components/admin/reports-shared";
import {
  AdminSupportTabs,
  SupportBoardView,
  SupportKpiRow,
  TicketLabelBadge,
  TicketStatusPills,
  ViewModeToggle,
} from "@/src/components/admin/support-shared";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket } from "@/src/types/admin";
import {
  MessageSquare,
  Building2,
  Radio,
  Headphones,
  Search,
} from "lucide-react";

export function AdminSupportPageContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const { data, isLoading, refetch } = useFetch<SupportTicket[]>(
    "/api/admin/support/tickets",
  );
  useAdminRealtime(refetch);

  const organizations = useMemo(
    () => [...new Set((data ?? []).map((t) => t.organizationName))],
    [data],
  );

  const filtered = useMemo(() => {
    return (data ?? [])
      .filter((t) => {
        if (filter === "all") return true;
        return t.status.toLowerCase() === filter.toLowerCase();
      })
      .filter((t) => {
        if (orgFilter === "all") return true;
        return t.organizationName === orgFilter;
      })
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.organizationName.toLowerCase().includes(q) ||
          t.createdByName?.toLowerCase().includes(q) ||
          t.labels.some((l) => l.includes(q))
        );
      });
  }, [data, filter, orgFilter, search]);

  const columns: Column<SupportTicket>[] = [
    {
      key: "title",
      header: "Ticket",
      cell: (row) => (
        <div>
          <span className="font-medium block">{row.title}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {row.labels.slice(0, 2).map((l) => (
              <TicketLabelBadge key={l} label={l} />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "org",
      header: "Tenant",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm">{row.organizationName}</span>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (row) => <StatusBadge status={row.priority.toLowerCase()} />,
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "assigned",
      header: "Assignee",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.assignedToName ?? "Unassigned"}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "comments",
      header: "Replies",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.commentCount}</span>
        </div>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "updated",
      header: "Updated",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.updatedAt, "relative")}
        </span>
      ),
      className: "hidden xl:table-cell",
    },
  ];

  return (
    <PageLayout
      title="Support Inbox"
      description="Jira-style queue across all tenant companies — assign, triage, and respond"
      breadcrumbs={[{ label: "Support", href: "/admin/support" }, { label: "Inbox" }]}
      actions={
        <Link href="/admin/support/live-fix">
          <Button variant="outline" size="sm">
            <Radio className="h-4 w-4 mr-2" /> Live Fix Queue
          </Button>
        </Link>
      }
    >
      <AdminSupportTabs activeHref="/admin/support" />

      <DashCard className="mt-6 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-5">
          <Headphones className="h-10 w-10 text-brand-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold">Platform support operations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            CRM context per tenant, Jira workflow states, and GitHub-style threads — all in one inbox.
          </p>
        </div>
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </DashCard>

      <div className="mb-6">
        <SupportKpiRow tickets={data ?? []} />
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <TicketStatusPills value={filter} onChange={setFilter} />
        <Select value={orgFilter} onValueChange={setOrgFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="All companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All companies</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org} value={org}>
                {org}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative lg:ml-auto lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="pl-9"
          />
        </div>
      </div>

      {viewMode === "board" ? (
        <SupportBoardView
          tickets={filtered}
          onTicketClick={(t) => router.push(`/admin/support/${t.id}`)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
          emptyTitle="No support tickets"
          emptyDescription="Tickets from tenant companies will appear here."
        />
      )}
    </PageLayout>
  );
}
