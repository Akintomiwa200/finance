"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket } from "@/src/types/admin";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Radio,
} from "lucide-react";

export default function AdminSupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");

  const { data, isLoading, refetch } = useFetch<SupportTicket[]>(
    "/api/admin/support/tickets",
  );
  useAdminRealtime(refetch);

  const organizations = [...new Set((data ?? []).map((t) => t.organizationName))];

  const filtered = (data ?? [])
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
        t.createdByName?.toLowerCase().includes(q)
      );
    });

  const columns: Column<SupportTicket>[] = [
    {
      key: "title",
      header: "Ticket",
      cell: (row) => (
        <div>
          <span className="font-medium block">{row.title}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.id.slice(0, 10)}</span>
        </div>
      ),
    },
    {
      key: "org",
      header: "Company",
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
      header: "Assigned",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.assignedToName ?? "Unassigned"}</span>
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
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/support/${row.id}`)}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Support Inbox"
      description="Manage tickets from all tenant companies"
      breadcrumbs={[{ label: "Support", href: "/admin/support" }, { label: "Tickets" }]}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/support/live-fix">
            <Button variant="outline" size="sm">
              <Radio className="h-4 w-4 mr-2" /> Live Fix Queue
            </Button>
          </Link>
          <Link href="/admin/support/integrations">
            <Button variant="outline" size="sm">Integrations</Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">
                  {data?.filter((t) => t.status === "OPEN").length ?? 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {data?.filter((t) => t.status === "IN_PROGRESS").length ?? 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-info opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">
                  {data?.filter((t) => t.priority === "URGENT").length ?? 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">
                  {data?.filter((t) => t.status === "RESOLVED").length ?? 0}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {["all", "open", "in_progress", "resolved", "closed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "all"
                ? "All"
                : status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Button>
          ))}
        </div>
        <Select value={orgFilter} onValueChange={setOrgFilter}>
          <SelectTrigger className="w-full sm:w-48">
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
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        isLoading={isLoading}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tickets, companies..."
        onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
        emptyTitle="No support tickets"
        emptyDescription="Tickets from tenant companies will appear here."
      />
    </PageLayout>
  );
}
