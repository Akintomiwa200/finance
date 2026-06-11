"use client";

import { use, useState } from "react";
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
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { useFetch } from "@/src/hooks/use-fetch";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket, SupportComment } from "@/src/types/admin";
import { Clock, User, AlertCircle, CheckCircle2, Radio, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketDetail {
  ticket: SupportTicket;
  comments: SupportComment[];
}

export default function CrmTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [showLiveFix, setShowLiveFix] = useState(false);

  const { data, isLoading, refetch } = useFetch<TicketDetail>(
    `/api/support/tickets/${id}`,
  );
  useSupportRealtime(refetch);

  const { mutate: postComment, isPending: isCommenting } = useMutation({
    mutationFn: (comment: string) =>
      api.post(`/api/support/tickets/${id}/comments`, { content: comment }),
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

  const { ticket, comments } = data;

  return (
    <PageLayout
      title={ticket.title}
      description={`Created ${formatDate(ticket.createdAt, "relative")}`}
      showBack
      breadcrumbs={[
        { label: "Support", href: "/support" },
        { label: ticket.title },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge status={ticket.status.toLowerCase()} />
          {ticket.status !== "CLOSED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLiveFix(true)}
            >
              <Radio className="h-4 w-4 mr-2" /> Request Live Fix
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Description</CardTitle>
              <span className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                {formatDate(ticket.createdAt, "long")}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Conversation ({comments.length}{" "}
                {comments.length === 1 ? "reply" : "replies"})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No replies yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Our team will respond shortly
                  </p>
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
                        <span className="text-sm font-medium">
                          {c.authorName}
                        </span>
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

              {/* Comment Input */}
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
                      placeholder="Add a reply..."
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
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Status</span>
                <StatusBadge status={ticket.status.toLowerCase()} />
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">
                  Priority
                </span>
                <StatusBadge status={ticket.priority.toLowerCase()} />
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">
                  Ticket ID
                </span>
                <p className="font-mono text-xs">{ticket.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">
                  Last Updated
                </span>
                <p>{formatDate(ticket.updatedAt, "relative")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {ticket.status !== "CLOSED" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
                  Close Ticket
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Resolution */}
          {ticket.status === "CLOSED" && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Ticket Closed</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Closed {formatDate(ticket.updatedAt, "relative")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Live Fix Request Dialog */}
      {showLiveFix && (
        <LiveFixRequestDialog
          onClose={() => setShowLiveFix(false)}
          onConfirm={() => requestLiveFix(undefined)}
          isPending={isRequesting}
        />
      )}
    </PageLayout>
  );
}

function LiveFixRequestDialog({
  onClose,
  onConfirm,
  isPending,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 animate-in fade-in zoom-in">
        <CardHeader>
          <CardTitle>Request Remote Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-info/10 rounded-lg">
            <Radio className="h-5 w-5 text-info mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Live Fix Session</p>
              <p className="text-muted-foreground mt-1">
                A support agent will connect to your screen to help resolve the
                issue in real-time. You'll receive a session code to share.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} loading={isPending}>
              Request Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
