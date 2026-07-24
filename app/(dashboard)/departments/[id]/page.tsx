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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
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
  Building2,
  Users,
  DollarSign,
  AlertCircle,
  FileText,
  Target,
} from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { employees, departments, loading, fetchEmployees, fetchDepartments, getDepartmentById, deleteDepartment } = useEmployeeStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!departments.length) fetchDepartments();
    if (!employees.length) fetchEmployees();
  }, [departments.length, employees.length, fetchDepartments, fetchEmployees]);

  const department = getDepartmentById(id);
  const deptEmployees = employees.filter((e) => e.departmentId === id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteDepartment(id);
    setDeleting(false);
    router.push("/departments");
  };

  if (loading && !department) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/departments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Departments
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Department not found</p>
              <p className="text-muted-foreground">The department you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Departments</span>
        <span>/</span>
        <span className="text-foreground">{department.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/departments")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{department.name}</h1>
              <Badge variant="outline" className="font-mono">{department.code}</Badge>
            </div>
            {department.description && (
              <p className="text-muted-foreground mt-1">{department.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/departments/${id}/edit`)} className="gap-2">
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
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(department.budgetAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{department.employeeCount}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Center</p>
                <p className="text-2xl font-bold">{department.costCenter || "—"}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Department Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Department Head</p>
              <p>{department.head || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p>{new Date(department.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          {department.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{department.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Department Employees ({deptEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">No employees in this department</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  deptEmployees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-xs">{e.employeeCode}</TableCell>
                      <TableCell className="font-medium">{e.firstName} {e.lastName}</TableCell>
                      <TableCell className="text-sm">{e.position || "—"}</TableCell>
                      <TableCell><Badge variant="outline">{e.role}</Badge></TableCell>
                      <TableCell>
                        <Badge className={e.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {e.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{department.name}&quot;? This action cannot be undone.
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
