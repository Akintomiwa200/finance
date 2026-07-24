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
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { usePayrollStore } from "@/src/store/payroll-store";
import { PAYROLL_STATUS_OPTIONS, type PayrollStatus } from "@/src/types/payroll";

const STATUS_COLORS: Record<PayrollStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function PayrollRunDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { payrollRuns, loading, fetchPayrollRuns, getPayrollRunById, deletePayrollRun, processPayrollRun, completePayrollRun } = usePayrollStore();
  const [showDelete, setShowDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!payrollRuns.length) fetchPayrollRuns();
  }, [payrollRuns.length, fetchPayrollRuns]);

  const run = getPayrollRunById(id);

  const handleDelete = async () => {
    setActionLoading(true);
    await deletePayrollRun(id);
    setActionLoading(false);
    router.push("/payroll/runs");
  };

  const handleProcess = async () => {
    setActionLoading(true);
    await processPayrollRun(id);
    setActionLoading(false);
  };

  const handleComplete = async () => {
    setActionLoading(true);
    await completePayrollRun(id);
    setActionLoading(false);
  };

  if (loading && !run) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/payroll/runs")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Payroll Runs
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Payroll run not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalGross = run.items.reduce((s, i) => s + i.grossPay, 0);
  const totalDeductions = run.items.reduce((s, i) => s + i.deductions + i.taxAmount + i.loanDeduction, 0);
  const totalAdditions = run.items.reduce((s, i) => s + i.allowances + i.bonus + i.overtimePay, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Payroll</span>
        <span>/</span>
        <button onClick={() => router.push("/payroll/runs")} className="hover:text-foreground">Payroll Runs</button>
        <span>/</span>
        <span className="text-foreground">Run Detail</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/payroll/runs")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payroll Run</h1>
              <Badge className={STATUS_COLORS[run.status]}>
                {run.status.charAt(0) + run.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {formatDate(run.periodStart)} - {formatDate(run.periodEnd)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {run.status === "DRAFT" && (
            <Button onClick={handleProcess} disabled={actionLoading} className="gap-2">
              <RotateCcw className="h-4 w-4" /> {actionLoading ? "Processing..." : "Process"}
            </Button>
          )}
          {run.status === "PROCESSING" && (
            <Button onClick={handleComplete} disabled={actionLoading} className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4" /> {actionLoading ? "Completing..." : "Complete"}
            </Button>
          )}
          {run.status === "DRAFT" && (
            <Button variant="outline" onClick={() => setShowDelete(true)} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(run.totalAmount)}</p>
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
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{run.itemCount}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-lg font-bold">{run.processedAt ? formatDate(run.processedAt) : "Not yet"}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {run.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{run.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payroll Items ({run.items.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Additions</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {run.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No items in this payroll run
                    </TableCell>
                  </TableRow>
                ) : (
                  run.items.map((item) => {
                    const additions = item.allowances + item.bonus + item.overtimePay;
                    const deducts = item.deductions + item.taxAmount + item.loanDeduction;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{item.position}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.departmentName}</TableCell>
                        <TableCell>{formatCurrency(item.grossPay)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(additions)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(deducts)}</TableCell>
                        <TableCell className="font-bold">{formatCurrency(item.netPay)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payroll Run</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payroll run? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {actionLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
