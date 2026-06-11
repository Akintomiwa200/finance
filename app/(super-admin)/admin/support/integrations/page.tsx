"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Badge } from "@/src/components/ui/badge";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { formatDate } from "@/src/lib/utils";
import type { SupportTicket } from "@/src/types/admin";
import { Plug, ExternalLink } from "lucide-react";
import { GitHubMark } from "@/src/components/support/github-mark";

interface IntegrationsData {
  linkedGithub: SupportTicket[];
  linkedJira: SupportTicket[];
}

export default function SupportIntegrationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"github" | "jira">("github");

  const { data, isLoading } = useFetch<IntegrationsData>(
    "/api/admin/support/integrations",
  );
  useAdminRealtime(() => {});

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
      title="Issue Tracker Integrations"
      description="UI view of GitHub and Jira issues linked to support tickets (no live API sync)"
      showBack
      breadcrumbs={[
        { label: "Support", href: "/admin/support" },
        { label: "Integrations" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GitHubMark className="h-5 w-5" /> GitHub Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.linkedGithub.length ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Tickets linked to GitHub</p>
            <p className="text-xs text-muted-foreground mt-3">
              Link issues from ticket detail pages. OAuth sync can be configured under Settings → Integrations.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                J
              </span>
              Jira Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.linkedJira.length ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Tickets linked to Jira</p>
            <p className="text-xs text-muted-foreground mt-3">
              Track engineering work with Jira keys. Connect your Jira workspace in Settings when ready.
            </p>
          </CardContent>
        </Card>
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
        <Link href="/admin/settings/integrations">
          <Button variant="outline" size="sm" className="ml-auto">
            Configure Integrations
          </Button>
        </Link>
      </div>

      {tab === "github" ? (
        <DataTable
          columns={githubColumns}
          data={data?.linkedGithub ?? []}
          keyField="id"
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
          emptyTitle="No GitHub issues linked"
          emptyDescription="Open a ticket and use Link GitHub Issue to connect one."
        />
      ) : (
        <DataTable
          columns={jiraColumns}
          data={data?.linkedJira ?? []}
          keyField="id"
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
          emptyTitle="No Jira issues linked"
          emptyDescription="Open a ticket and use Link Jira Issue to connect one."
        />
      )}
    </PageLayout>
  );
}
