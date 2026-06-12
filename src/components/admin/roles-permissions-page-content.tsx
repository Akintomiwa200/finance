"use client";

import { useMemo, useState } from "react";
import { Key, Search, Loader2 } from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { DashCard } from "@/src/components/admin/reports-shared";
import {
  RoleTabs,
  StatCard,
  PlatformTeamBanner,
  formatAreaLabel,
  permissionLevelVariant,
} from "@/src/components/admin/roles-shared";
import { cn } from "@/src/lib/utils";
import type { PermissionGroup, PlatformPermission } from "@/src/types/admin";

export function RolesPermissionsPageContent() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: catalog, isLoading: catalogLoading } = useFetch<PlatformPermission[]>(
    "/api/admin/roles/permissions",
  );
  const { data: groups, isLoading: groupsLoading, refetch } = useFetch<PermissionGroup[]>(
    "/api/admin/groups",
  );
  useAdminRealtime(refetch);

  const isLoading = catalogLoading || groupsLoading;
  const allGroups = groups ?? [];
  const permissions = catalog ?? [];

  const categories = useMemo(() => {
    const set = new Set(permissions.map((p) => p.category));
    return ["all", ...Array.from(set).sort()];
  }, [permissions]);

  const filteredCatalog = useMemo(() => {
    let rows = permissions;
    if (categoryFilter !== "all") {
      rows = rows.filter((p) => p.category === categoryFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.key.toLowerCase().includes(q) ||
          p.label.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [permissions, categoryFilter, search]);

  const kpis = useMemo(() => {
    const areas = permissions.length;
    const groupsWithPerms = allGroups.filter((g) =>
      Object.values(g.permissions).some((l) => l !== "none"),
    ).length;
    const fullAccess = allGroups.filter((g) =>
      Object.values(g.permissions).some((l) => l === "full"),
    ).length;
    return { areas, groups: allGroups.length, groupsWithPerms, fullAccess };
  }, [permissions, allGroups]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <PlatformTeamBanner
          title="Permission matrix"
          description="See what each platform team privilege group can access in the admin console. These permissions apply to internal staff only — tenant company users have separate role-based access within their organization."
          icon={
            <div className="relative flex h-20 w-20 items-center justify-center">
              <Key className="h-10 w-10 text-brand-600 opacity-90" />
              <div className="absolute inset-0 rounded-full bg-brand-600/10" />
            </div>
          }
        />
        <DashCard className="lg:col-span-5 xl:col-span-4">
          <p className="mb-3 text-sm text-muted-foreground">Roles section</p>
          <RoleTabs activeHref="/admin/roles/permissions" />
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Admin areas" value={kpis.areas} hint="Console sections" />
        <StatCard label="Privilege groups" value={kpis.groups} />
        <StatCard label="Groups with access" value={kpis.groupsWithPerms} />
        <StatCard label="Full-access groups" value={kpis.fullAccess} />
      </div>

      <DashCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Permission catalog</p>
            <p className="text-xs text-muted-foreground">
              Areas and levels granted per privilege group
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                    categoryFilter === cat
                      ? "bg-foreground text-background"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {cat === "all" ? "All" : formatAreaLabel(cat)}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 font-medium text-muted-foreground">Area</th>
                  <th className="p-3 font-medium text-muted-foreground">Description</th>
                  {allGroups.map((g) => (
                    <th
                      key={g.id}
                      className="p-3 text-center font-medium text-muted-foreground whitespace-nowrap"
                    >
                      <span className="block max-w-[100px] truncate" title={g.name}>
                        {g.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCatalog.map((perm) => (
                  <tr
                    key={perm.key}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="p-3 font-medium">{perm.label}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px]">
                      <span className="line-clamp-2 text-xs">{perm.description}</span>
                    </td>
                    {allGroups.map((g) => {
                      const level = g.permissions[perm.key] ?? "none";
                      return (
                        <td key={g.id} className="p-3 text-center">
                          <Badge
                            variant={permissionLevelVariant(level)}
                            className="text-[10px]"
                          >
                            {level}
                          </Badge>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>
    </div>
  );
}
