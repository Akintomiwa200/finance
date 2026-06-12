"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { DashCard } from "@/src/components/admin/reports-shared";
import {
  ActivityTimeline,
  CommentThread,
  TicketLabelBadge,
} from "@/src/components/admin/support-shared";
import { useFetch } from "@/src/hooks/use-fetch";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type {
  LiveFixSession,
  SupportActivity,
  SupportComment,
  SupportTicket,
} from "@/src/types/admin";
import {
  Clock,
  User,
  CheckCircle2,
  Radio,
  Monitor,
} from "lucide-react";

interface TicketDetail {
  ticket: SupportTicket;
  comments: SupportComment[];
  activities: SupportActivity[];
  liveFixSessions: LiveFixSession[];
}

export function TenantSupportTicketDetailPageContent({ id }: { id: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [showLiveFix, setShowLiveFix] = useState(false);

  const { data, isLoading, refetch } = useFetch<TicketDetail>(
    `/api/support/tickets/${id}`,
  );
  useSupportRealtime(refetch);

  const { mutate: postComment, isPending: isCommenting } = useMutation({
    mutationFn: (text: string) =>
      api.post(`/api/support/tickets/${id}/comments`, { content: text }),
    onSuccess: () => {
      setComment("");
      refetch();
    },
  });

  const { mutate: closeTicket, isPending: isClosing } = useMutation({
    mutationFn: () =>
      api.patch(`/api/support/tickets/${id}`, { status: "CLOSED" }),
    onSuccess: () => refetch(),
  });

  const { mutate: requestLiveFix, isPending: isRequesting } = useMutation({
    mutationFn: () => api.post("/api/support/live-fix", { ticketId: id }),
    onSuccess: (session: { id: string }) => {
      setShowLiveFix(false);
      router.push(`/support/live/${session.id}`);
    },
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

  const { ticket, comments, activities, liveFixSessions } = data;

  return (
    <PageLayout
      title={ticket.title}
      description={`Opened ${formatDate(ticket.createdAt, "relative")} · ${ticket.id}`}
      showBack
      breadcrumbs={[
        { label: "Support", href: "/support" },
        { label: ticket.title },
      ]}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={ticket.status.toLowerCase()} />
          <StatusBadge status={ticket.priority.toLowerCase()} />
          {ticket.status !== "CLOSED" && (
            <Button variant="outline" size="sm" onClick={() => setShowLiveFix(true)}>
              <Radio className="h-4 w-4 mr-2" /> Request Live Help
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
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
            <h3 className="text-sm font-semibold mb-4">
              Conversation · {comments.length}{" "}
              {comments.length === 1 ? "reply" : "replies"}
            </h3>
            <CommentThread comments={comments} />
            {ticket.status !== "CLOSED" && (
              <div className="flex gap-3 pt-5 mt-5 border-t">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment..."
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Markdown supported
                    </span>
                    <Button
                      onClick={() => postComment(comment)}
                      loading={isCommenting}
                      disabled={!comment.trim()}
                      size="sm"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DashCard>

          <DashCard>
            <h3 className="text-sm font-semibold mb-4">Activity</h3>
            <ActivityTimeline activities={activities} />
          </DashCard>
        </div>

        <div className="space-y-4">
          <DashCard className="space-y-4 text-sm">
            <h3 className="font-semibold">Details</h3>
            <div>
              <span className="text-muted-foreground block mb-1">Status</span>
              <StatusBadge status={ticket.status.toLowerCase()} />
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Priority</span>
              <StatusBadge status={ticket.priority.toLowerCase()} />
            </div>
            {ticket.assignedToName && (
              <div>
                <span className="text-muted-foreground block mb-1">Assigned</span>
                <p>{ticket.assignedToName}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground block mb-1">Updated</span>
              <p>{formatDate(ticket.updatedAt, "relative")}</p>
            </div>
          </DashCard>

          {liveFixSessions.length > 0 && (
            <DashCard className="space-y-3">
              <h3 className="text-sm font-semibold">Linked live sessions</h3>
              {liveFixSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/support/live/${session.id}`}
                  className="flex items-center justify-between rounded-xl border border-border p-3 text-sm no-underline hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-mono font-medium">{session.sessionCode}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(session.createdAt, "relative")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={session.status} />
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </DashCard>
          )}

          {ticket.status !== "CLOSED" && (
            <DashCard className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowLiveFix(true)}
              >
                <Radio className="h-4 w-4 mr-2" />
                Request Remote Session
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-destructive"
                onClick={() => closeTicket(undefined)}
                loading={isClosing}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Close Issue
              </Button>
            </DashCard>
          )}

          {ticket.status === "CLOSED" && (
            <DashCard className="bg-muted/30">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium text-sm">Issue closed</span>
              </div>
            </DashCard>
          )}
        </div>
      </div>

      {showLiveFix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <DashCard className="w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-3">Request live help</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A platform support agent will join a secure browser session to help resolve this issue in real time.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowLiveFix(false)}>
                Cancel
              </Button>
              <Button onClick={() => requestLiveFix(undefined)} loading={isRequesting}>
                Start session
              </Button>
            </div>
          </DashCard>
        </div>
      )}
    </PageLayout>
  );
}
