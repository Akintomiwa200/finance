"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Key,
  Pencil,
  UserCheck,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { DashCard, ViewPill } from "@/src/components/admin/reports-shared";
import { AdminSettingsFormSkeleton } from "@/src/components/layout/dashboard-skeletons";
import {
  RoleTabs,
  StatCard,
  formatAreaLabel,
  permissionLevelVariant,
} from "@/src/components/admin/roles-shared";
import { RolesGroupForm } from "@/src/components/admin/roles-group-form";
import { useUpdate } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import { formatDate } from "@/src/lib/utils";
import type { GroupAssignment, PermissionGroup } from "@/src/types/admin";
import { useState } from "react";

export function RolesGroupDetailPageContent({ groupId }: { groupId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const { data: group, isLoading, refetch } = useFetch<PermissionGroup>(
    `/api/admin/groups/${groupId}`,
  );
  const { data: assignments } = useFetch<GroupAssignment[]>(
    `/api/admin/roles/assignments?groupId=${groupId}`,
  );
  useAdminRealtime(refetch);

  const { mutate: updateGroup, isPending } = useUpdate<
    PermissionGroup,
    { id: string; name: string; description: string; permissions: Record<string, string> }
  >("/api/admin/groups");

  if (isLoading) {
    return <AdminSettingsFormSkeleton cards={2} />;
  }

  if (!group) {
    return (
      <DashCard className="text-center">
        <p className="text-muted-foreground">Privilege group not found.</p>
        <Button className="mt-4" variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
      </DashCard>
    );
  }

  if (editing && !group.isSystem) {
    return (
      <RolesGroupForm
        mode="edit"
        initial={group}
        isPending={isPending}
        onSubmit={async (data) => {
          const result = await updateGroup({ id: groupId, ...data });
          if (result.success) {
            toast({ title: "Group updated" });
            setEditing(false);
            refetch();
            return true;
          }
          toast({
            title: "Update failed",
            description: result.error,
            variant: "destructive",
          });
          return false;
        }}
      />
    );
  }

  const permEntries = Object.entries(group.permissions).filter(([, l]) => l !== "none");
  const permCount = permEntries.length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="lg:col-span-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{group.name}</h1>
                {group.isSystem && <Badge variant="info">System template</Badge>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {group.description ?? "No description provided."}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Created {formatDate(group.createdAt)} · Platform team only — not tenant roles
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!group.isSystem && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/roles/assignments?group=${groupId}`)}
              >
                <UserCheck className="h-4 w-4" />
                Assignments
              </Button>
            </div>
          </div>
        </DashCard>
        <DashCard className="lg:col-span-4">
          <RoleTabs activeHref="/admin/roles/groups" />
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Areas enabled" value={permCount} />
        <StatCard label="Team members" value={group.assignmentCount} />
        <StatCard
          label="Type"
          value={group.isSystem ? "System" : "Custom"}
          hint={group.isSystem ? "Read-only template" : "Editable"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Admin console permissions</p>
          </div>
          {permEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No permissions granted.</p>
          ) : (
            <div className="divide-y divide-border">
              {permEntries.map(([area, level]) => (
                <div
                  key={area}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span>{formatAreaLabel(area)}</span>
                  <Badge variant={permissionLevelVariant(level)}>{level}</Badge>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        <DashCard className="xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Assigned team members</p>
            </div>
            <ViewPill href={`/admin/roles/assignments?group=${groupId}`} />
          </div>
          {(assignments ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No platform team members assigned yet.
            </p>
          ) : (
            <div className="space-y-3">
              {(assignments ?? []).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{a.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{a.employeeEmail}</p>
                  </div>
                  <Badge variant="outline">{a.employeeRole}</Badge>
                </div>
              ))}
            </div>
          )}
        </DashCard>
      </div>
    </div>
  );
}
