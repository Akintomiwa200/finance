"use client";

import { useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Shield, Clock, UserPlus, Activity } from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";
import { EMPLOYEE_ROLE_OPTIONS } from "@/src/types/employee";
import { formatProfileDate } from "@/src/lib/profile-utils";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const ROLE_MAP: Record<string, string> = Object.fromEntries(
  EMPLOYEE_ROLE_OPTIONS.map((r) => [r.value, r.label]),
);

export default function AuditPage() {
  const { employees, loading, startPolling, stopPolling } = useEmployeeStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const isLoading = loading && employees.length === 0;

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 20);
  }, [employees]);

  const newThisMonth = useMemo(() => {
    const now = new Date();
    return employees.filter((e) => {
      const d = new Date(e.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [employees]);

  const updatedThisMonth = useMemo(() => {
    const now = new Date();
    return employees.filter((e) => {
      const d = new Date(e.updatedAt);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        e.updatedAt !== e.createdAt
      );
    }).length;
  }, [employees]);

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          <span className="text-2xl font-bold tracking-tight">Audit Trail</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Recent employee activity and account creation history
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Employees
                </p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Added This Month
                </p>
                <p className="text-2xl font-bold">{newThisMonth}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <UserPlus className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Updated This Month
                </p>
                <p className="text-2xl font-bold">{updatedThisMonth}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Most recent employee additions and changes, sorted by date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mb-3 opacity-30" />
              <p>No employee records found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEmployees.map((emp) => {
                  const wasUpdated =
                    new Date(emp.updatedAt).getTime() -
                      new Date(emp.createdAt).getTime() >
                    1000;
                  return (
                    <TableRow key={emp.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatProfileDate(emp.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {emp.firstName[0]}
                            {emp.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            wasUpdated
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }
                        >
                          {wasUpdated ? "Updated" : "Added"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {ROLE_MAP[emp.role] || emp.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {emp.departmentName || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
