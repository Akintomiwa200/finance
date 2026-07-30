"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Users,
  Search,
  Mail,
  Shield,
  Building2,
  UserCheck,
  UserX,
  ArrowUpDown,
} from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";
import { EMPLOYEE_ROLE_OPTIONS } from "@/src/types/employee";
import { formatProfileDate } from "@/src/lib/profile-utils";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import type { EmployeeRole } from "@/src/types/employee";

const ROLE_MAP: Record<string, string> = Object.fromEntries(
  EMPLOYEE_ROLE_OPTIONS.map((r) => [r.value, r.label]),
);

const ROLE_BADGE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  HR: "bg-pink-100 text-pink-700",
  FINANCE: "bg-blue-100 text-blue-700",
  MANAGER: "bg-purple-100 text-purple-700",
  EMPLOYEE: "bg-gray-100 text-gray-600",
};

type SortField = "name" | "email" | "role";
type SortDir = "asc" | "desc";

export default function UsersPage() {
  const { employees, loading, startPolling, stopPolling } = useEmployeeStore();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const isLoading = loading && employees.length === 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = [...employees];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q) ||
          e.departmentName.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") {
        cmp = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );
      } else if (sortField === "email") {
        cmp = a.email.localeCompare(b.email);
      } else if (sortField === "role") {
        cmp = a.role.localeCompare(b.role);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [employees, search, sortField, sortDir]);

  const activeCount = employees.filter((e) => e.isActive).length;
  const roleCount = new Set(employees.map((e) => e.role)).size;

  const SortableHead = ({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {children}
        <ArrowUpDown
          className={`h-3 w-3 ${sortField === field ? "text-foreground" : "text-muted-foreground"}`}
        />
      </button>
    </TableHead>
  );

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <span className="text-2xl font-bold tracking-tight">Users</span>
        </div>
        <p className="text-sm text-muted-foreground">
          All employees in your organization and their assigned roles
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Roles</p>
                <p className="text-2xl font-bold">{roleCount}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User List</CardTitle>
              <CardDescription>
                {filtered.length} of {employees.length} user
                {employees.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, code, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-3 opacity-30" />
              <p>
                {search
                  ? "No employees match your search"
                  : "No employees yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead field="name">Name</SortableHead>
                  <SortableHead field="email">Email</SortableHead>
                  <SortableHead field="role">Role</SortableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {emp.firstName[0]}
                            {emp.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {emp.employeeCode}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {emp.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`font-normal ${ROLE_BADGE_COLORS[emp.role] || ""}`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {ROLE_MAP[emp.role] || emp.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3" />
                        {emp.departmentName || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.isActive ? "default" : "secondary"}
                        className={
                          emp.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {emp.isActive ? (
                          <UserCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        {emp.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatProfileDate(emp.hireDate ?? emp.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
