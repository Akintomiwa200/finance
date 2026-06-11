"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { ExternalLink, Link2, Unlink } from "lucide-react";

interface JiraIssueLinkProps {
  ticketId: string;
  jiraIssueKey?: string | null;
  onUpdate: () => void;
}

export function JiraIssueLink({
  ticketId,
  jiraIssueKey,
  onUpdate,
}: JiraIssueLinkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [key, setKey] = useState(jiraIssueKey || "");

  const { mutate: linkIssue, isPending } = useMutation({
    mutationFn: (issueKey: string) =>
      api.patch(`/api/admin/support/tickets/${ticketId}`, {
        jiraIssueKey: issueKey,
      }),
    onSuccess: () => {
      setIsEditing(false);
      onUpdate();
    },
  });

  const { mutate: unlinkIssue, isPending: isUnlinking } = useMutation({
    mutationFn: () =>
      api.patch(`/api/admin/support/tickets/${ticketId}`, {
        jiraIssueKey: null,
      }),
    onSuccess: onUpdate,
  });

  if (jiraIssueKey && !isEditing) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          J
        </div>
        <a
          href={`https://faas.atlassian.net/browse/${jiraIssueKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-700 hover:underline flex items-center gap-1 font-medium"
        >
          {jiraIssueKey}
          <ExternalLink className="h-3 w-3" />
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => unlinkIssue(undefined)}
          loading={isUnlinking}
          className="ml-auto"
        >
          <Unlink className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          placeholder="FAAS-123"
          className="h-8 text-sm font-mono"
        />
        <Button size="sm" onClick={() => linkIssue(key)} loading={isPending}>
          Link
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
      <Link2 className="h-3.5 w-3.5 mr-2" />
      Link Jira Issue
    </Button>
  );
}
