"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { DashCard } from "@/src/components/admin/reports-shared";
import {
  TicketLabelBadge,
  TicketStatusPills,
  TICKET_LABELS,
} from "@/src/components/admin/support-shared";
import { useFetch } from "@/src/hooks/use-fetch";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket, SupportTicketLabel } from "@/src/types/admin";
import {
  Plus,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  Radio,
  LifeBuoy,
  Search,
} from "lucide-react";

export function TenantSupportPageContent() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data, isLoading, refetch } = useFetch<SupportTicket[]>(
    "/api/support/tickets",
  );
  useSupportRealtime(refetch);

  const filtered = useMemo(() => {
    return (data ?? [])
      .filter((t) => {
        if (filter === "all") return true;
        return t.status.toLowerCase() === filter.toLowerCase();
      })
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.labels.some((l) => l.includes(q))
        );
      });
  }, [data, filter, search]);

  const columns: Column<SupportTicket>[] = [
    {
      key: "title",
      header: "Issue",
      cell: (row) => (
        <div>
          <span className="font-medium block">{row.title}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {row.labels.map((l) => (
              <TicketLabelBadge key={l} label={l} />
            ))}
          </div>
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
      className: "hidden lg:table-cell",
    },
  ];

  const stats = data ?? [];

  return (
    <PageLayout
      title="Support"
      description="Open issues, track replies, and request live help from our platform team"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/support/live">
            <Button variant="outline" size="sm">
              <Radio className="h-4 w-4 mr-2" /> Live Sessions
            </Button>
          </Link>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Issue
          </Button>
        </div>
      }
    >
      <DashCard className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-5">
          <LifeBuoy className="h-10 w-10 text-brand-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold">GitHub-style issue tracking</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe your problem, follow the thread, and request a live remote session when you need hands-on help.
          </p>
        </div>
      </DashCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Open</p>
          <p className="mt-1 text-2xl font-semibold">
            {stats.filter((t) => t.status === "OPEN").length}
          </p>
          <AlertCircle className="h-6 w-6 text-warning opacity-40 mt-2" />
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="mt-1 text-2xl font-semibold">
            {stats.filter((t) => t.status === "IN_PROGRESS").length}
          </p>
          <Clock className="h-6 w-6 text-info opacity-40 mt-2" />
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="mt-1 text-2xl font-semibold">
            {stats.filter((t) => t.status === "RESOLVED").length}
          </p>
          <CheckCircle2 className="h-6 w-6 text-success opacity-40 mt-2" />
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 text-2xl font-semibold">{stats.length}</p>
          <MessageSquare className="h-6 w-6 text-brand-600 opacity-40 mt-2" />
        </DashCard>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <TicketStatusPills value={filter} onChange={setFilter} />
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/support/${row.id}`)}
        emptyTitle="No issues yet"
        emptyDescription="Create your first support issue to get help from our team."
      />

      {showCreate && (
        <CreateTicketDialog
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            refetch();
          }}
        />
      )}
    </PageLayout>
  );
}

function CreateTicketDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [label, setLabel] = useState<SupportTicketLabel>("bug");

  const { mutate, isPending } = useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      priority: string;
      label: SupportTicketLabel;
    }) => api.post("/api/support/tickets", body),
    onSuccess,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <DashCard className="w-full max-w-lg mx-4 animate-in fade-in zoom-in">
        <h3 className="text-lg font-semibold mb-4">Open a new issue</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the problem"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce, expected vs actual behavior..."
              rows={5}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <Select value={label} onValueChange={(v) => setLabel(v as SupportTicketLabel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_LABELS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => mutate({ title, description, priority, label })}
              loading={isPending}
              disabled={!title || !description}
            >
              Submit Issue
            </Button>
          </div>
        </div>
      </DashCard>
    </div>
  );
}
