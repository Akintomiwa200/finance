"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Shield,
  Users,
  Layers,
  Trash2,
} from "lucide-react";
import { ListRowsSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { useDelete } from "@/src/hooks/use-mutation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";
import { DashCard, ViewPill } from "@/src/components/admin/reports-shared";
import {
  RoleTabs,
  StatCard,
  PlatformTeamBanner,
} from "@/src/components/admin/roles-shared";
import { useToast } from "@/src/components/ui/use-toast";
import { cn, formatDate } from "@/src/lib/utils";
import type { PermissionGroup } from "@/src/types/admin";

export function RolesGroupsPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "system" | "custom">("all");

  const { data, isLoading, refetch } = useFetch<PermissionGroup[]>(
    "/api/admin/groups",
  );
  const { data: stats } = useFetch<{ platformTeamCount: number }>(
    "/api/admin/stats",
  );
  useAdminRealtime(refetch);

  const { mutate: deleteGroup, isPending: isDeleting } = useDelete(
    "/api/admin/groups",
  );

  const groups = data ?? [];

  const filtered = useMemo(() => {
    let rows = groups;
    if (filter === "system") rows = rows.filter((g) => g.isSystem);
    if (filter === "custom") rows = rows.filter((g) => !g.isSystem);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [groups, filter, search]);

  const kpis = useMemo(() => {
    const system = groups.filter((g) => g.isSystem).length;
    const custom = groups.filter((g) => !g.isSystem).length;
    const assigned = groups.reduce((s, g) => s + g.assignmentCount, 0);
    return { total: groups.length, system, custom, assigned };
  }, [groups]);

  const handleDelete = async (group: PermissionGroup) => {
    if (group.isSystem) return;
    if (!confirm(`Delete "${group.name}"? This cannot be undone.`)) return;
    const result = await deleteGroup(group.id);
    if (result.success) {
      toast({ title: "Group deleted" });
      refetch();
    } else {
      toast({
        title: "Could not delete group",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <PlatformTeamBanner
          title="Platform team privilege groups"
          description="Define what your internal staff — support, IT, billing ops, developers — can access in the admin console. Tenant company users manage their own roles separately under each organization."
          icon={
            <div className="relative flex h-20 w-20 items-center justify-center">
              <Shield className="absolute -left-1 top-2 h-8 w-8 text-brand-600 opacity-90" />
              <Users className="absolute bottom-0 right-0 h-10 w-10 text-violet-500 opacity-90" />
              <div className="h-12 w-12 rounded-full bg-brand-600/10" />
            </div>
          }
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/admin/roles/groups/new")}
            >
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          }
          meta={
            <span className="text-xs text-muted-foreground">
              {stats?.platformTeamCount ?? 0} platform team members · not tenant users
            </span>
          }
        />

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <p className="mb-3 text-sm text-muted-foreground">Quick navigation</p>
          <RoleTabs activeHref="/admin/roles/groups" />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Groups bundle admin console permissions. Assign them to team members
            under Assignments — Super Admin is excluded and has full access by default.
          </p>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total groups" value={kpis.total} hint="System + custom" />
        <StatCard label="System templates" value={kpis.system} hint="Built-in, read-only" />
        <StatCard label="Custom groups" value={kpis.custom} hint="You can edit these" />
        <StatCard label="Active assignments" value={kpis.assigned} hint="Team members linked" />
      </div>

      <DashCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">All privilege groups</p>
            <p className="text-xs text-muted-foreground">
              Click a row to view or edit permissions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
              {(["all", "system", "custom"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                    filter === f
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups..."
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <ListRowsSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No privilege groups"
            description="Create a custom group or use a system template as a starting point."
            action={
              <Button onClick={() => router.push("/admin/roles/groups/new")}>
                Create Group
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((group) => {
              const permCount = Object.values(group.permissions).filter(
                (l) => l !== "none",
              ).length;
              return (
                <div
                  key={group.id}
                  className="flex cursor-pointer flex-col gap-3 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:px-2 first:pt-0"
                  onClick={() => router.push(`/admin/roles/groups/${group.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(`/admin/roles/groups/${group.id}`);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10">
                      <Layers className="h-5 w-5 text-brand-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{group.name}</p>
                        {group.isSystem && <Badge variant="info">System</Badge>}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {group.description ?? "No description"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {permCount} areas · {group.assignmentCount} assigned ·{" "}
                        {formatDate(group.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex shrink-0 items-center gap-2 sm:pl-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ViewPill href={`/admin/roles/groups/${group.id}`} />
                    {!group.isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => handleDelete(group)}
                        aria-label={`Delete ${group.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashCard>
    </div>
  );
}
