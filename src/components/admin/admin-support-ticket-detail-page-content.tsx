"use client";

import { useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { DashCard } from "@/src/components/admin/reports-shared";
import { AdminSupportTicketDetailSkeleton } from "@/src/components/layout/dashboard-skeletons";
import {
  ActivityTimeline,
  AdminSupportTabs,
  CommentThread,
  TenantContextCard,
  TICKET_LABELS,
  TicketLabelBadge,
} from "@/src/components/admin/support-shared";
import { GitHubIssueLink } from "@/src/components/support/github-issue-link";
import { JiraIssueLink } from "@/src/components/support/jira-issue-link";
import { useFetch } from "@/src/hooks/use-fetch";
import { useMutation } from "@/src/hooks/use-mutation";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type {
  AdminEmployee,
  LiveFixSession,
  SupportActivity,
  SupportComment,
  SupportTicket,
  SupportTicketLabel,
} from "@/src/types/admin";
import {
  Clock,
  User,
  CheckCircle2,
  Radio,
  Monitor,
  Lock,
} from "lucide-react";

interface TicketDetail {
  ticket: SupportTicket;
  comments: SupportComment[];
  activities: SupportActivity[];
  liveFixSessions: LiveFixSession[];
}

export function AdminSupportTicketDetailPageContent({ id }: { id: string }) {
  const [publicReply, setPublicReply] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [replyMode, setReplyMode] = useState<"public" | "internal">("public");

  const { data, isLoading, refetch } = useFetch<TicketDetail>(
    `/api/admin/support/tickets/${id}`,
  );
  const { data: team } = useFetch<AdminEmployee[]>("/api/admin/team");
  useAdminRealtime(refetch);

  const { mutate: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.patch(`/api/admin/support/tickets/${id}`, body),
    onSuccess: () => {
      setPublicReply("");
      setInternalNote("");
      refetch();
    },
  });

  if (isLoading || !data) {
    return (
      <PageLayout title="Loading..." showBack>
        <AdminSupportTicketDetailSkeleton />
      </PageLayout>
    );
  }

  const { ticket, comments, activities, liveFixSessions } = data;
  const publicComments = comments.filter((c) => !c.isInternal);
  const internalComments = comments.filter((c) => c.isInternal);

  const toggleLabel = (label: SupportTicketLabel) => {
    const next = ticket.labels.includes(label)
      ? ticket.labels.filter((l) => l !== label)
      : [...ticket.labels, label];
    updateTicket({ labels: next });
  };

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
        </div>
      }
    >
      <AdminSupportTabs activeHref="/admin/support" />

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <DashCard>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex flex-wrap gap-1.5">
                {ticket.labels.map((l) => (
                  <TicketLabelBadge key={l} label={l} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3 inline mr-1" />
                {formatDate(ticket.createdAt, "long")}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </DashCard>

          <DashCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">
                Thread · {publicComments.length} public
              </h3>
              <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setReplyMode("public")}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    replyMode === "public"
                      ? "bg-card shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Public reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyMode("internal")}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium flex items-center gap-1 ${
                    replyMode === "internal"
                      ? "bg-card shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <Lock className="h-3 w-3" /> Internal
                </button>
              </div>
            </div>

            <CommentThread comments={publicComments} />

            {ticket.status !== "CLOSED" && (
              <div className="flex gap-3 pt-5 mt-5 border-t">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={replyMode === "public" ? publicReply : internalNote}
                    onChange={(e) =>
                      replyMode === "public"
                        ? setPublicReply(e.target.value)
                        : setInternalNote(e.target.value)
                    }
                    placeholder={
                      replyMode === "public"
                        ? "Reply visible to customer..."
                        : "Internal note — not visible to tenant..."
                    }
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        updateTicket(
                          replyMode === "public"
                            ? { comment: publicReply }
                            : { internalNote },
                        )
                      }
                      loading={isUpdating}
                      disabled={
                        !(replyMode === "public" ? publicReply : internalNote).trim()
                      }
                      size="sm"
                    >
                      {replyMode === "public" ? "Send reply" : "Add internal note"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DashCard>

          {internalComments.length > 0 && (
            <DashCard className="border-dashed border-amber-300/50 dark:border-amber-800">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4" /> Internal notes ({internalComments.length})
              </h3>
              <CommentThread comments={internalComments} showInternal />
            </DashCard>
          )}

          <DashCard>
            <h3 className="text-sm font-semibold mb-4">Activity log</h3>
            <ActivityTimeline activities={activities} />
          </DashCard>
        </div>

        <div className="space-y-4">
          <DashCard className="space-y-4 text-sm">
            <h3 className="font-semibold">Workflow</h3>
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
              <span className="text-muted-foreground block mb-1.5">Assignee</span>
              <Select
                value={ticket.assignedToName ?? "unassigned"}
                onValueChange={(v) =>
                  updateTicket({
                    assignedToName: v === "unassigned" ? null : v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {(team ?? []).map((member) => (
                    <SelectItem
                      key={member.id}
                      value={`${member.firstName} ${member.lastName}`}
                    >
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-muted-foreground block mb-2">Labels</span>
              <div className="flex flex-wrap gap-1.5">
                {TICKET_LABELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLabel(l.id)}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-opacity ${
                      ticket.labels.includes(l.id)
                        ? l.color
                        : "bg-muted text-muted-foreground opacity-60 hover:opacity-100"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </DashCard>

          <TenantContextCard ticket={ticket} />

          {liveFixSessions.length > 0 && (
            <DashCard className="space-y-3">
              <h3 className="text-sm font-semibold">Live fix sessions</h3>
              {liveFixSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/admin/support/live-fix/${session.id}`}
                  className="flex items-center justify-between rounded-xl border border-border p-3 text-sm no-underline hover:bg-muted/50"
                >
                  <div>
                    <p className="font-mono font-medium">{session.sessionCode}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(session.createdAt, "relative")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={session.status} />
                    <Monitor className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </DashCard>
          )}

          <DashCard className="space-y-3">
            <h3 className="text-sm font-semibold">Issue trackers</h3>
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
          </DashCard>

          <DashCard className="space-y-2">
            <Link href={`/admin/companies/${ticket.organizationId}`}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                View company profile
              </Button>
            </Link>
            {ticket.status !== "CLOSED" && (
              <>
                <Link href="/admin/support/live-fix" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Radio className="h-4 w-4 mr-2" /> Live fix queue
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => updateTicket({ status: "RESOLVED" })}
                  loading={isUpdating}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark resolved
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-destructive"
                  onClick={() => updateTicket({ status: "CLOSED" })}
                  loading={isUpdating}
                >
                  Close ticket
                </Button>
              </>
            )}
          </DashCard>
        </div>
      </div>
    </PageLayout>
  );
}
