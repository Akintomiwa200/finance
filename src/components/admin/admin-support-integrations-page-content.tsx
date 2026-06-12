"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { DashCard } from "@/src/components/admin/reports-shared";
import { AdminSupportTabs } from "@/src/components/admin/support-shared";
import { GitHubMark } from "@/src/components/support/github-mark";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket } from "@/src/types/admin";
import { ExternalLink, Plug } from "lucide-react";

interface IntegrationsData {
  linkedGithub: SupportTicket[];
  linkedJira: SupportTicket[];
}

const DEFAULTS = {
  github: {
    enabled: true,
    mode: "Manual link",
    note: "Paste issue URLs on ticket detail pages. OAuth sync is a future enhancement.",
  },
  jira: {
    enabled: true,
    mode: "Manual key",
    note: "Attach Jira keys (e.g. FAAS-128) to tickets for engineering traceability.",
  },
  email: {
    enabled: true,
    mode: "Built-in",
    note: "Ticket create, reply, assignment, and live-fix events use the platform email service.",
  },
};

export function AdminSupportIntegrationsPageContent() {
  const router = useRouter();
  const [tab, setTab] = useState<"github" | "jira">("github");

  const { data, isLoading, refetch } = useFetch<IntegrationsData>(
    "/api/admin/support/integrations",
  );
  useAdminRealtime(refetch);

  const githubColumns: Column<SupportTicket>[] = [
    {
      key: "title",
      header: "Ticket",
      cell: (row) => (
        <div>
          <span className="font-medium block">{row.title}</span>
          <span className="text-xs text-muted-foreground">{row.organizationName}</span>
        </div>
      ),
    },
    {
      key: "issue",
      header: "GitHub Issue",
      cell: (row) =>
        row.githubIssueUrl ? (
          <a
            href={row.githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:underline flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {row.githubIssueUrl.split("/").slice(-1)[0]}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          "—"
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "updated",
      header: "Updated",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.updatedAt, "relative")}
        </span>
      ),
    },
  ];

  const jiraColumns: Column<SupportTicket>[] = [
    {
      key: "title",
      header: "Ticket",
      cell: (row) => (
        <div>
          <span className="font-medium block">{row.title}</span>
          <span className="text-xs text-muted-foreground">{row.organizationName}</span>
        </div>
      ),
    },
    {
      key: "issue",
      header: "Jira Key",
      cell: (row) =>
        row.jiraIssueKey ? (
          <Badge variant="secondary" className="font-mono">
            {row.jiraIssueKey}
          </Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "priority",
      header: "Priority",
      cell: (row) => <StatusBadge status={row.priority.toLowerCase()} />,
    },
  ];

  return (
    <PageLayout
      title="Support Integrations"
      description="GitHub, Jira, and notification defaults for the inbuilt support workflow"
      showBack
      breadcrumbs={[
        { label: "Support", href: "/admin/support" },
        { label: "Integrations" },
      ]}
    >
      <AdminSupportTabs activeHref="/admin/support/integrations" />

      <div className="grid md:grid-cols-3 gap-4 mt-6 mb-6">
        <DashCard>
          <div className="flex items-center gap-2 mb-2">
            <GitHubMark className="h-5 w-5" />
            <h3 className="font-semibold text-sm">GitHub Issues</h3>
            <Badge variant="success" className="ml-auto text-[10px]">On</Badge>
          </div>
          <p className="text-2xl font-bold">{data?.linkedGithub.length ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-2">{DEFAULTS.github.note}</p>
        </DashCard>
        <DashCard>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              J
            </span>
            <h3 className="font-semibold text-sm">Jira</h3>
            <Badge variant="success" className="ml-auto text-[10px]">On</Badge>
          </div>
          <p className="text-2xl font-bold">{data?.linkedJira.length ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-2">{DEFAULTS.jira.note}</p>
        </DashCard>
        <DashCard>
          <div className="flex items-center gap-2 mb-2">
            <Plug className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Email alerts</h3>
            <Badge variant="success" className="ml-auto text-[10px]">On</Badge>
          </div>
          <p className="text-sm font-medium">Built-in notifications</p>
          <p className="text-xs text-muted-foreground mt-2">{DEFAULTS.email.note}</p>
        </DashCard>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={tab === "github" ? "primary" : "outline"}
          size="sm"
          onClick={() => setTab("github")}
        >
          <GitHubMark className="h-4 w-4 mr-2" /> GitHub
        </Button>
        <Button
          variant={tab === "jira" ? "primary" : "outline"}
          size="sm"
          onClick={() => setTab("jira")}
        >
          Jira
        </Button>
      </div>

      {tab === "github" ? (
        <DataTable
          columns={githubColumns}
          data={data?.linkedGithub ?? []}
          keyField="id"
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
          emptyTitle="No GitHub issues linked"
          emptyDescription="Open a ticket and use Link GitHub Issue on the detail page."
        />
      ) : (
        <DataTable
          columns={jiraColumns}
          data={data?.linkedJira ?? []}
          keyField="id"
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
          emptyTitle="No Jira issues linked"
          emptyDescription="Open a ticket and attach a Jira key on the detail page."
        />
      )}
    </PageLayout>
  );
}
