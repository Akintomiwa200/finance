"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Clock,
  Globe,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { Button } from "@/src/components/ui/button";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { DashCard, ViewPill } from "@/src/components/admin/reports-shared";
import { cn, formatDate } from "@/src/lib/utils";

interface AuditDetail {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: unknown;
  userName: string | null;
  ipAddress: string | null;
  organization: { name: string } | null;
  createdAt: string;
}

function actionStatus(action: string) {
  const upper = action.toUpperCase();
  if (upper === "CREATE") return "active" as const;
  if (upper === "UPDATE") return "in_progress" as const;
  if (upper === "DELETE") return "critical" as const;
  return "pending" as const;
}

export function AuditLogDetailPageContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: log, isLoading } = useFetch<AuditDetail>(`/api/admin/audit-logs/${id}`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading audit log…
      </div>
    );
  }

  if (!log) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/audit-logs")}>
          <ArrowLeft className="h-4 w-4" />
          Back to audit logs
        </Button>
        <DashCard className="py-12 text-center text-muted-foreground">Event not found.</DashCard>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => router.push("/admin/audit-logs")}
      >
        <ArrowLeft className="h-4 w-4" />
        Audit logs
      </Button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="lg:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-5">
              <Shield className="h-10 w-10 text-brand-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  {log.action} · {log.entity}
                </h1>
                <StatusBadge status={actionStatus(log.action)} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Recorded {formatDate(log.createdAt, "long")} ({formatDate(log.createdAt, "relative")})
              </p>
              {log.entityId && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Entity ID: {log.entityId}
                </p>
              )}
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-4">
          <p className="text-sm text-muted-foreground">Quick links</p>
          <div className="mt-3 space-y-2">
            <Link
              href="/admin/reports/platform-health"
              className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm no-underline transition-colors hover:bg-muted/50"
            >
              Platform health
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/admin/settings/security"
              className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm no-underline transition-colors hover:bg-muted/50"
            >
              Security settings
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard className="!p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <p className="text-xs">Actor</p>
          </div>
          <p className="mt-2 text-sm font-semibold">{log.userName ?? "System"}</p>
        </DashCard>
        <DashCard className="!p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <p className="text-xs">Organization</p>
          </div>
          <p className="mt-2 text-sm font-semibold">{log.organization?.name ?? "Platform"}</p>
        </DashCard>
        <DashCard className="!p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <p className="text-xs">IP address</p>
          </div>
          <p className="mt-2 font-mono text-sm font-semibold">{log.ipAddress ?? "—"}</p>
        </DashCard>
        <DashCard className="!p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <p className="text-xs">Timestamp</p>
          </div>
          <p className="mt-2 text-sm font-semibold">{formatDate(log.createdAt, "short")}</p>
        </DashCard>
      </div>

      <DashCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Event metadata</p>
            <p className="text-xs text-muted-foreground">Structured fields for this audit entry</p>
          </div>
          <ViewPill href="/admin/audit-logs" />
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["Action", log.action],
            ["Entity", log.entity],
            ["Entity ID", log.entityId ?? "—"],
            ["User", log.userName ?? "—"],
            ["Company", log.organization?.name ?? "—"],
            ["IP Address", log.ipAddress ?? "—"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className={cn("mt-1 text-sm font-medium", label === "Entity ID" && "font-mono text-xs")}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
        {log.details != null && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Details payload</p>
            <pre className="max-h-[360px] overflow-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          </div>
        )}
      </DashCard>
    </div>
  );
}
