"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import type { PermissionGroup } from "@/src/types/admin";

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: group, isLoading } = useFetch<PermissionGroup>(`/api/admin/groups/${id}`);

  if (isLoading || !group) return <PageLayout title={isLoading ? "Loading..." : "Not found"} showBack />;

  return (
    <PageLayout
      title={group.name}
      description={group.description ?? undefined}
      showBack
      breadcrumbs={[{ label: "Roles", href: "/admin/roles" }, { label: "Groups", href: "/admin/roles/groups" }, { label: group.name }]}
      actions={group.isSystem ? <Badge variant="info">System Group</Badge> : <Button variant="outline" onClick={() => router.push(`/admin/roles/assignments?group=${id}`)}>View Assignments</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 mb-6 text-sm">
        <div><span className="text-muted-foreground">Assigned employees:</span> {group.assignmentCount}</div>
        <div><span className="text-muted-foreground">Modules configured:</span> {Object.keys(group.permissions).length}</div>
      </div>
      <Card>
        <CardHeader><CardTitle>Permissions</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {Object.entries(group.permissions).map(([mod, level]) => (
              <div key={mod} className="flex items-center justify-between py-3 text-sm">
                <span className="capitalize">{mod.replace(/-/g, " ")}</span>
                <Badge variant={level === "full" ? "success" : level === "none" ? "default" : "info"}>{level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
