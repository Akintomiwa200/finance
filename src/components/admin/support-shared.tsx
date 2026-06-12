"use client";

import Link from "next/link";
import { cn, formatDate } from "@/src/lib/utils";
import { DashCard } from "@/src/components/admin/reports-shared";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import type {
  SupportActivity,
  SupportComment,
  SupportTicket,
  SupportTicketLabel,
} from "@/src/types/admin";
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Radio,
  Tag,
  User,
} from "lucide-react";

export const ADMIN_SUPPORT_TABS = [
  { label: "Inbox", href: "/admin/support" },
  { label: "Live Fix", href: "/admin/support/live-fix" },
  { label: "Integrations", href: "/admin/support/integrations" },
] as const;

export const TICKET_LABELS: {
  id: SupportTicketLabel;
  label: string;
  color: string;
}[] = [
  { id: "bug", label: "Bug", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  { id: "billing", label: "Billing", color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  { id: "feature_request", label: "Feature", color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  { id: "account", label: "Account", color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { id: "integration", label: "Integration", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "other", label: "Other", color: "bg-muted text-muted-foreground" },
];

export const STATUS_COLUMNS: {
  id: SupportTicket["status"];
  label: string;
}[] = [
  { id: "OPEN", label: "Open" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "CLOSED", label: "Closed" },
];

export function AdminSupportTabs({ activeHref }: { activeHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ADMIN_SUPPORT_TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium no-underline transition-colors",
            tab.href === activeHref
              ? "bg-foreground text-background"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export function SupportStatCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <DashCard className={cn("!p-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
    </DashCard>
  );
}

export function TicketLabelBadge({ label }: { label: SupportTicketLabel }) {
  const meta = TICKET_LABELS.find((l) => l.id === label);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        meta?.color ?? "bg-muted text-muted-foreground",
      )}
    >
      {meta?.label ?? label}
    </span>
  );
}

export function TicketStatusPills({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const pills = ["all", "open", "in_progress", "resolved", "closed"];
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === status
              ? "bg-foreground text-background"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {status === "all"
            ? "All"
            : status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </button>
      ))}
    </div>
  );
}

export function ViewModeToggle({
  value,
  onChange,
}: {
  value: "list" | "board";
  onChange: (v: "list" | "board") => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
      {(["list", "board"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
            value === mode
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

export function SupportBoardView({
  tickets,
  onTicketClick,
}: {
  tickets: SupportTicket[];
  onTicketClick: (ticket: SupportTicket) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUS_COLUMNS.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.id);
        return (
          <DashCard key={col.id} className="!p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{col.label}</h3>
              <Badge variant="secondary">{columnTickets.length}</Badge>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {columnTickets.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No tickets</p>
              ) : (
                columnTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => onTicketClick(ticket)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <p className="text-sm font-medium line-clamp-2">{ticket.title}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{ticket.organizationName}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={ticket.priority.toLowerCase()} />
                      {ticket.labels.slice(0, 2).map((l) => (
                        <TicketLabelBadge key={l} label={l} />
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {formatDate(ticket.updatedAt, "relative")}
                    </p>
                  </button>
                ))
              )}
            </div>
          </DashCard>
        );
      })}
    </div>
  );
}

function initials(name: string | null | undefined) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

export function CommentThread({
  comments,
  showInternal = false,
}: {
  comments: SupportComment[];
  showInternal?: boolean;
}) {
  const visible = showInternal
    ? comments
    : comments.filter((c) => !c.isInternal);

  if (visible.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">No replies yet</p>
        <p className="text-xs text-muted-foreground">Start the conversation below</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {visible.map((c) => (
        <div
          key={c.id}
          className={cn(
            "flex gap-3",
            c.isInternal && "rounded-xl border border-dashed border-amber-300/60 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20",
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">{initials(c.authorName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-medium">{c.authorName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(c.createdAt, "relative")}
              </span>
              {c.isStaff && !c.isInternal && (
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full dark:bg-brand-950 dark:text-brand-300">
                  Support Team
                </span>
              )}
              {c.isInternal && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-950 dark:text-amber-300">
                  Internal note
                </span>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const ACTIVITY_ICONS: Record<SupportActivity["type"], React.ElementType> = {
  created: MessageSquare,
  status_changed: CheckCircle2,
  priority_changed: AlertCircle,
  assigned: User,
  comment: MessageSquare,
  internal_note: Tag,
  label_changed: Tag,
  live_fix_linked: Radio,
  github_linked: Activity,
  jira_linked: Activity,
};

export function ActivityTimeline({ activities }: { activities: SupportActivity[] }) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((item, idx) => {
        const Icon = ACTIVITY_ICONS[item.type] ?? Activity;
        const isLast = idx === activities.length - 1;
        return (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              {!isLast && <div className="mt-1 w-px flex-1 bg-border min-h-4" />}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-sm">{item.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.actorName ? `${item.actorName} · ` : ""}
                {formatDate(item.createdAt, "relative")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TenantContextCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <DashCard className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{ticket.organizationName}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Reported by</span>
        <p>{ticket.createdByName ?? "Unknown"}</p>
      </div>
      {ticket.createdByEmail && (
        <div>
          <span className="text-muted-foreground">Contact</span>
          <p className="truncate">{ticket.createdByEmail}</p>
        </div>
      )}
      <div>
        <span className="text-muted-foreground">Ticket ID</span>
        <p className="font-mono text-xs mt-0.5">{ticket.id}</p>
      </div>
    </DashCard>
  );
}

export function SupportKpiRow({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SupportStatCard
        label="Open"
        value={tickets.filter((t) => t.status === "OPEN").length}
        icon={<AlertCircle className="h-8 w-8 text-warning" />}
      />
      <SupportStatCard
        label="In Progress"
        value={tickets.filter((t) => t.status === "IN_PROGRESS").length}
        icon={<Clock className="h-8 w-8 text-info" />}
      />
      <SupportStatCard
        label="Urgent"
        value={tickets.filter((t) => t.priority === "URGENT").length}
        icon={<AlertCircle className="h-8 w-8 text-destructive" />}
      />
      <SupportStatCard
        label="Resolved"
        value={tickets.filter((t) => t.status === "RESOLVED").length}
        icon={<CheckCircle2 className="h-8 w-8 text-success" />}
      />
    </div>
  );
}
