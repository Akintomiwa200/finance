"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserCheck,
  Plus,
  Search,
  Loader2,
  Trash2,
  Users,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { useMutation } from "@/src/hooks/use-mutation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { DashCard, ViewPill } from "@/src/components/admin/reports-shared";
import {
  RoleTabs,
  StatCard,
  PlatformTeamBanner,
} from "@/src/components/admin/roles-shared";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type {
  AdminEmployee,
  GroupAssignment,
  PermissionGroup,
} from "@/src/types/admin";

export function RolesAssignmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupFilter = searchParams.get("group") ?? "all";
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [showAssign, setShowAssign] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(groupFilter !== "all" ? groupFilter : "");

  const { data: assignments, isLoading, refetch } = useFetch<GroupAssignment[]>(
    groupFilter !== "all"
      ? `/api/admin/roles/assignments?groupId=${groupFilter}`
      : "/api/admin/roles/assignments",
  );
  const { data: groups } = useFetch<PermissionGroup[]>("/api/admin/groups");
  const { data: team } = useFetch<AdminEmployee[]>("/api/admin/team");
  useAdminRealtime(refetch);

  const { mutate: createAssignment, isPending: isCreating } = useMutation({
    mutationFn: async (input: {
      employeeId: string;
      groupId: string;
      employeeName: string;
      employeeEmail: string;
      employeeRole: string;
    }) => {
      const res = await api.post("/api/admin/roles/assignments", input);
      return res.success
        ? { success: true, data: res.data as GroupAssignment }
        : { success: false, error: res.error ?? "Assignment failed" };
    },
  });

  const { mutate: removeAssignment, isPending: isRemoving } = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/roles/assignments/${id}`);
      return res.success
        ? { success: true, data: undefined }
        : { success: false, error: res.error ?? "Remove failed" };
    },
  });

  const assignableTeam = useMemo(
    () => (team ?? []).filter((m) => m.role !== "SUPER_ADMIN"),
    [team],
  );

  const filtered = useMemo(() => {
    let rows = assignments ?? [];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(q) ||
          a.groupName.toLowerCase().includes(q) ||
          a.employeeEmail.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [assignments, search]);

  const kpis = useMemo(() => {
    const all = assignments ?? [];
    const uniqueMembers = new Set(all.map((a) => a.employeeId)).size;
    const unassigned = assignableTeam.filter(
      (m) => !all.some((a) => a.employeeId === m.id),
    ).length;
    return {
      total: all.length,
      uniqueMembers,
      groupsUsed: new Set(all.map((a) => a.groupId)).size,
      unassigned,
    };
  }, [assignments, assignableTeam]);

  const handleAssign = async () => {
    const member = assignableTeam.find((m) => m.id === selectedEmployee);
    if (!member || !selectedGroup) return;

    const result = await createAssignment({
      employeeId: member.id,
      groupId: selectedGroup,
      employeeName: `${member.firstName} ${member.lastName}`,
      employeeEmail: member.email,
      employeeRole: member.role,
    });

    if (result.success) {
      toast({ title: "Assignment saved" });
      setShowAssign(false);
      setSelectedEmployee("");
      refetch();
    } else {
      toast({
        title: "Assignment failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (id: string) => {
    const result = await removeAssignment(id);
    if (result.success) {
      toast({ title: "Assignment removed" });
      refetch();
    } else {
      toast({
        title: "Could not remove",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <PlatformTeamBanner
          title="Group assignments"
          description="Link platform team members to privilege groups. Super Admin accounts have full access by default and are not listed here. Tenant company users are managed per-organization, not on this page."
          icon={
            <div className="relative flex h-20 w-20 items-center justify-center">
              <UserCheck className="h-10 w-10 text-brand-600 opacity-90" />
              <Users className="absolute -bottom-1 -right-1 h-8 w-8 text-violet-500 opacity-80" />
            </div>
          }
          action={
            <Button variant="primary" size="sm" onClick={() => setShowAssign(true)}>
              <Plus className="h-4 w-4" />
              Assign Group
            </Button>
          }
        />
        <DashCard className="lg:col-span-5 xl:col-span-4">
          <RoleTabs activeHref="/admin/roles/assignments" />
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Assignments" value={kpis.total} />
        <StatCard label="Team members" value={kpis.uniqueMembers} hint="With a group" />
        <StatCard label="Groups in use" value={kpis.groupsUsed} />
        <StatCard label="Unassigned" value={kpis.unassigned} hint="Excl. Super Admin" />
      </div>

      {showAssign && (
        <DashCard>
          <p className="mb-4 text-sm font-medium">Assign privilege group</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Platform team member</p>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {assignableTeam.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Privilege group</p>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {(groups ?? []).map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleAssign}
              loading={isCreating}
              disabled={!selectedEmployee || !selectedGroup}
            >
              Save Assignment
            </Button>
            <Button variant="outline" onClick={() => setShowAssign(false)}>
              Cancel
            </Button>
          </div>
        </DashCard>
      )}

      <DashCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">All assignments</p>
            {groupFilter !== "all" && (
              <p className="text-xs text-muted-foreground">
                Filtered by group ·{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => router.push("/admin/roles/assignments")}
                >
                  Clear filter
                </button>
              </p>
            )}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members or groups..."
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No assignments yet"
            description="Assign a privilege group to a platform team member to grant admin console access."
            action={
              <Button onClick={() => setShowAssign(true)}>Assign Group</Button>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{row.employeeName}</p>
                    <Badge variant="outline">{row.employeeRole}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{row.employeeEmail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Group: <span className="font-medium text-foreground">{row.groupName}</span>
                    {" · "}
                    Assigned {formatDate(row.assignedAt)}
                    {row.assignedBy ? ` by ${row.assignedBy}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ViewPill href={`/admin/roles/groups/${row.groupId}`} />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isRemoving}
                    onClick={() => handleRemove(row.id)}
                    aria-label="Remove assignment"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashCard>
    </div>
  );
}
