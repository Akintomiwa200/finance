"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useFetch } from "@/src/hooks/use-fetch";
import { useMutation } from "@/src/hooks/use-mutation";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket, SupportComment } from "@/src/types/admin";
import { GitHubIssueLink } from "@/src/components/support/github-issue-link";
import { JiraIssueLink } from "@/src/components/support/jira-issue-link";
import {
  Clock,
  User,
  CheckCircle2,
  Radio,
  MessageSquare,
  Building2,
  UserCheck,
} from "lucide-react";

interface TicketDetail {
  ticket: SupportTicket;
  comments: SupportComment[];
}

const AGENTS = ["Support Team", "Tier 2 Engineering", "Billing Support", "Onboarding Team"];

export default function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [assignee, setAssignee] = useState("");

  const { data, isLoading, refetch } = useFetch<TicketDetail>(
    `/api/admin/support/tickets/${id}`,
  );
  useAdminRealtime(refetch);

  const { mutate: postComment, isPending: isCommenting } = useMutation({
    mutationFn: (text: string) =>
      api.patch(`/api/admin/support/tickets/${id}`, { comment: text }),
    onSuccess: () => {
      setComment("");
      refetch();
    },
  });

  const { mutate: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.patch(`/api/admin/support/tickets/${id}`, body),
    onSuccess: () => refetch(),
  });

  if (isLoading || !data) {
    return (
      <PageLayout title="Loading..." showBack>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </PageLayout>
    );
  }

  const { ticket, comments } = data;

  return (
    <PageLayout
      title={ticket.title}
      description={`${ticket.organizationName} · ${formatDate(ticket.createdAt, "relative")}`}
      showBack
      breadcrumbs={[
        { label: "Support", href: "/admin/support" },
        { label: ticket.title },
      ]}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={ticket.status.toLowerCase()} />
          <StatusBadge status={ticket.priority.toLowerCase()} />
          {ticket.status !== "CLOSED" && (
            <Link href="/admin/support/live-fix">
              <Button variant="outline" size="sm">
                <Radio className="h-4 w-4 mr-2" /> Live Fix
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Description</CardTitle>
              <span className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                {formatDate(ticket.createdAt, "long")}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Conversation ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No replies yet</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {c.authorName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{c.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(c.createdAt, "relative")}
                        </span>
                        {c.isStaff && (
                          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                            Support Team
                          </span>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                ))
              )}

              {ticket.status !== "CLOSED" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Reply as support agent..."
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => postComment(comment)}
                        loading={isCommenting}
                        disabled={!comment.trim()}
                        size="sm"
                      >
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1.5">Status</span>
                <Select
                  value={ticket.status}
                  onValueChange={(v) => updateTicket({ status: v })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1.5">Priority</span>
                <Select
                  value={ticket.priority}
                  onValueChange={(v) => updateTicket({ priority: v })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1.5">
                  <UserCheck className="h-3.5 w-3.5 inline mr-1" />
                  Assign To
                </span>
                <div className="flex gap-2">
                  <Select
                    value={assignee || ticket.assignedToName || ""}
                    onValueChange={setAssignee}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENTS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateTicket({ assignedToName: assignee || ticket.assignedToName })
                    }
                    disabled={!assignee && !ticket.assignedToName}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{ticket.organizationName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Reported by</span>
                <p>{ticket.createdByName ?? "Unknown"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ticket ID</span>
                <p className="font-mono text-xs mt-0.5">{ticket.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issue Trackers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <GitHubIssueLink
                ticketId={ticket.id}
                githubIssueUrl={ticket.githubIssueUrl}
                onUpdate={refetch}
              />
              <JiraIssueLink
                ticketId={ticket.id}
                jiraIssueKey={ticket.jiraIssueKey}
                onUpdate={refetch}
              />
            </CardContent>
          </Card>

          {ticket.status !== "CLOSED" && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateTicket({ status: "RESOLVED" })}
                  loading={isUpdating}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-destructive"
                  onClick={() => updateTicket({ status: "CLOSED" })}
                  loading={isUpdating}
                >
                  Close Ticket
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
