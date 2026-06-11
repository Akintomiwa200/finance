// components/support/github-issue-link.tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useMutation } from "@/src/hooks/use-mutation";
import { api } from "@/src/lib/api";
import { ExternalLink, Link2, Unlink } from "lucide-react";
import { GitHubMark } from "@/src/components/support/github-mark";

interface GitHubIssueLinkProps {
  ticketId: string;
  githubIssueUrl?: string | null;
  onUpdate: () => void;
}

export function GitHubIssueLink({
  ticketId,
  githubIssueUrl,
  onUpdate,
}: GitHubIssueLinkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(githubIssueUrl || "");

  const { mutate: linkIssue, isPending } = useMutation({
    mutationFn: (githubUrl: string) =>
      api.patch(`/api/admin/support/tickets/${ticketId}`, {
        githubIssueUrl: githubUrl,
      }),
    onSuccess: () => {
      setIsEditing(false);
      onUpdate();
    },
  });

  const { mutate: unlinkIssue, isPending: isUnlinking } = useMutation({
    mutationFn: () =>
      api.patch(`/api/admin/support/tickets/${ticketId}`, {
        githubIssueUrl: null,
      }),
    onSuccess: onUpdate,
  });

  if (githubIssueUrl && !isEditing) {
    return (
      <div className="flex items-center gap-2">
        <GitHubMark className="h-4 w-4" />
        <a
          href={githubIssueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand-600 hover:underline flex items-center gap-1"
        >
          View GitHub Issue
          <ExternalLink className="h-3 w-3" />
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => unlinkIssue(undefined)}
          loading={isUnlinking}
        >
          <Unlink className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <GitHubMark className="h-4 w-4" />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/issues/123"
          className="h-8 text-sm"
        />
        <Button size="sm" onClick={() => linkIssue(url)} loading={isPending}>
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
      Link GitHub Issue
    </Button>
  );
}
