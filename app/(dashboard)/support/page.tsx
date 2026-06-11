"use client";

import { useState } from "react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { useFetch } from "@/src/hooks/use-fetch";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket } from "@/src/types/admin";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CrmSupportPage() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data, isLoading, refetch } = useFetch<SupportTicket[]>(
    "/api/support/tickets",
  );
  useSupportRealtime(refetch);

  const filtered = (data ?? [])
    .filter((t) => {
      if (filter === "all") return true;
      return t.status.toLowerCase() === filter.toLowerCase();
    })
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });

  const columns: Column<SupportTicket>[] = [
    {
      key: "title",
      header: "Ticket",
      cell: (row) => (
        <div>
          <span className="font-medium block">{row.title}</span>
          <span className="text-xs text-muted-foreground">
            {row.id.slice(0, 8)}
          </span>
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
      header: "Last Update",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.updatedAt, "relative")}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/support/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Support Tickets"
      description="Track and manage your support requests"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/support/live">
            <Button variant="outline" size="sm">
              <Radio className="h-4 w-4 mr-2" /> Live Fix Sessions
            </Button>
          </Link>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Ticket
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">
                  {data?.filter((t) => t.status === "OPEN").length || 0}
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
                  {data?.filter((t) => t.status === "IN_PROGRESS").length || 0}
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
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">
                  {data?.filter((t) => t.status === "RESOLVED").length || 0}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{data?.length || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-brand-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "open", "in_progress", "resolved", "closed"].map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === "all"
                  ? "All"
                  : status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Button>
            ),
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        isLoading={isLoading}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={(row) => router.push(`/support/${row.id}`)}
        emptyTitle="No tickets found"
        emptyDescription="Create a new ticket to get help from our support team."
      />

      {/* Create Ticket Dialog */}
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

  const { mutate, isPending } = useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      priority: string;
    }) => api.post("/api/support/tickets", body),
    onSuccess,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 animate-in fade-in zoom-in">
        <CardHeader>
          <CardTitle>Create Support Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your issue"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of what you're experiencing..."
              rows={5}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Priority</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General question</SelectItem>
                <SelectItem value="medium">
                  Medium - Feature not working
                </SelectItem>
                <SelectItem value="high">High - Critical impact</SelectItem>
                <SelectItem value="urgent">Urgent - System down</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => mutate({ title, description, priority })}
              loading={isPending}
              disabled={!title || !description}
            >
              Create Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
