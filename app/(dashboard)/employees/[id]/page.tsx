"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  Building2,
  CreditCard,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";
import { EMPLOYEE_ROLE_OPTIONS } from "@/src/types/employee";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { employees, departments, loading, fetchEmployees, fetchDepartments, getEmployeeById, deleteEmployee } = useEmployeeStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!employees.length) fetchEmployees();
    if (!departments.length) fetchDepartments();
  }, [employees.length, departments.length, fetchEmployees, fetchDepartments]);

  const employee = getEmployeeById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteEmployee(id);
    setDeleting(false);
    router.push("/employees");
  };

  if (loading && !employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/employees")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Employee not found</p>
              <p className="text-muted-foreground">The employee you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deptName = departments.find((d) => d.id === employee.departmentId)?.name || employee.departmentName;
  const roleLabel = EMPLOYEE_ROLE_OPTIONS.find((r) => r.value === employee.role)?.label ?? employee.role;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Employees</span>
        <span>/</span>
        <span className="text-foreground">{employee.firstName} {employee.lastName}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/employees")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{employee.firstName} {employee.lastName}</h1>
              <Badge className={employee.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground font-mono text-sm">{employee.employeeCode}</span>
              <Badge variant="outline">{roleLabel}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/employees/${id}/edit`)} className="gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" onClick={() => setShowDelete(true)} className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Base Salary</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(employee.baseSalary)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-2xl font-bold">{deptName || "—"}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="text-2xl font-bold">{employee.position || "—"}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Email" value={employee.email} />
            <InfoRow label="Phone" value={employee.phone} />
            <InfoRow label="Hire Date" value={employee.hireDate ? new Date(employee.hireDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null} />
            <InfoRow label="Role" value={roleLabel} />
          </div>
        </CardContent>
      </Card>

      {(employee.bankName || employee.bankAccount || employee.bankCode || employee.taxId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Bank & Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Bank Name" value={employee.bankName} />
              <InfoRow label="Bank Account" value={employee.bankAccount} />
              <InfoRow label="Bank Code" value={employee.bankCode} />
              <InfoRow label="Tax ID" value={employee.taxId} />
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{employee.firstName} {employee.lastName}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
