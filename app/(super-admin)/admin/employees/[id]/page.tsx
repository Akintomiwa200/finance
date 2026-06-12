"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent } from "@/src/components/ui/card";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { useFetch } from "@/src/hooks/use-fetch";
import { formatDate } from "@/src/lib/utils";
import { AdminDetailPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

interface EmployeeDetail {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  organization: { id: string; name: string };
  department: { id: string; name: string } | null;
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: emp, isLoading } = useFetch<EmployeeDetail>(`/api/admin/employees/${id}`);

  if (isLoading) {
    return (
      <PageLayout title="Loading..." showBack>
        <AdminDetailPageSkeleton />
      </PageLayout>
    );
  }

  if (!emp) return <PageLayout title="Not found" showBack />;

  return (
    <PageLayout
      title={`${emp.firstName} ${emp.lastName}`}
      description={emp.email}
      showBack
      breadcrumbs={[
        { label: "Team", href: "/admin/employees" },
        { label: `${emp.firstName} ${emp.lastName}` },
      ]}
      actions={<StatusBadge status={emp.isActive ? "active" : "inactive"} />}
    >
      <Card>
        <CardContent className="pt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div><span className="text-muted-foreground block mb-1">Employee Code</span><span className="font-mono">{emp.employeeCode}</span></div>
          <div><span className="text-muted-foreground block mb-1">Role</span>{emp.role.replace(/_/g, " ")}</div>
          <div><span className="text-muted-foreground block mb-1">Team</span>{emp.organization.name}</div>
          <div><span className="text-muted-foreground block mb-1">Department</span>
            {emp.department ? (
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push(`/admin/departments/${emp.department!.id}`)}>{emp.department.name}</Button>
            ) : "—"}
          </div>
          <div><span className="text-muted-foreground block mb-1">Joined</span>{formatDate(emp.createdAt, "long")}</div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
