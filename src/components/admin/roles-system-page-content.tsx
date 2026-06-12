"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
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
import type { SystemRole } from "@/src/types/admin";

export function RolesSystemPageContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useFetch<SystemRole[]>("/api/admin/roles/system");
  const roles = data ?? [];

  const filtered = useMemo(() => {
    if (!search) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.key.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [roles, search]);

  const kpis = useMemo(() => {
    const builtIn = roles.filter((r) => r.isBuiltIn).length;
    const withGroup = roles.filter((r) => r.privilegeGroupId).length;
    const members = roles.reduce((s, r) => s + r.memberCount, 0);
    return { total: roles.length, builtIn, withGroup, members };
  }, [roles]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <PlatformTeamBanner
          title="System roles"
          description="Built-in role templates for your platform team. Each role maps to a privilege group except Super Admin, who has unrestricted access and is not managed through group assignment. Tenant company roles (Admin, Finance Manager, etc.) are configured per organization."
          icon={
            <div className="relative flex h-20 w-20 items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-brand-600 opacity-90" />
              <div className="absolute inset-0 rounded-full bg-emerald-500/10" />
            </div>
          }
        />
        <DashCard className="lg:col-span-5 xl:col-span-4">
          <RoleTabs activeHref="/admin/roles/system" />
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="System roles" value={kpis.total} />
        <StatCard label="Built-in" value={kpis.builtIn} />
        <StatCard label="Linked to groups" value={kpis.withGroup} />
        <StatCard label="Team members" value={kpis.members} hint="Across all roles" />
      </div>

      <DashCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Role catalog</p>
            <p className="text-xs text-muted-foreground">
              Platform team only — not tenant user roles
            </p>
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No system roles found" description="Try a different search." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((role) => (
              <div
                key={role.id}
                className="rounded-2xl border border-border/80 p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{role.name}</p>
                      <Badge variant="info">{role.key}</Badge>
                      {role.key === "SUPER_ADMIN" && (
                        <Badge variant="success">Platform owner</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                  <Badge variant="outline">{role.memberCount} members</Badge>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {role.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {cap}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {role.privilegeGroupId ? (
                    <>
                      <ViewPill href={`/admin/roles/groups/${role.privilegeGroupId}`} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/roles/assignments?group=${role.privilegeGroupId}`,
                          )
                        }
                      >
                        View assignments
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Not tied to a privilege group — full platform access
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashCard>
    </div>
  );
}
