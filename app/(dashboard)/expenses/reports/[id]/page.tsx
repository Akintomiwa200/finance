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
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";
import { useExpenseStore } from "@/src/store/expense-store";
import {
  EXPENSE_STATUS_OPTIONS,
  EXPENSE_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  type ExpenseStatusType,
} from "@/src/types/expense";

const STATUS_COLORS: Record<ExpenseStatusType, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  reimbursed: "bg-purple-100 text-purple-700",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

export default function ExpenseReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { reports, loading, fetchReports, getReportById, deleteReport } = useExpenseStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!reports.length) fetchReports();
  }, [reports.length, fetchReports]);

  const report = getReportById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteReport(id);
    setDeleting(false);
    router.push("/expenses/reports");
  };

  if (loading && !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/expenses/reports")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Reports
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Report not found</p>
              <p className="text-muted-foreground">The expense report you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Expenses</span>
        <span>/</span>
        <button onClick={() => router.push("/expenses/reports")} className="hover:text-foreground">Expense Reports</button>
        <span>/</span>
        <span className="text-foreground">{report.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/expenses/reports")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{report.title}</h1>
              <Badge className={STATUS_COLORS[report.status]}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{report.employeeName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/expenses/reports/${id}/edit`)} className="gap-2">
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
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(report.totalAmount)}</p>
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
                <p className="text-sm text-muted-foreground">Line Items</p>
                <p className="text-2xl font-bold">{report.items.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-lg font-bold">
                  {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : "—"}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Report Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Employee" value={report.employeeName} />
            <InfoRow label="Email" value={report.employeeEmail} />
            <InfoRow label="Department" value={report.department} />
            <InfoRow label="Status" value={report.status.charAt(0).toUpperCase() + report.status.slice(1)} />
            <InfoRow label="Created" value={report.createdAt ? new Date(report.createdAt).toLocaleString() : null} />
            <InfoRow label="Approved By" value={report.approvedBy} />
            <InfoRow label="Approved At" value={report.approvedAt ? new Date(report.approvedAt).toLocaleString() : null} />
            <InfoRow label="Reimbursed At" value={report.reimbursedAt ? new Date(report.reimbursedAt).toLocaleString() : null} />
          </div>
          {report.rejectedReason && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Rejection Reason</p>
              <p className="mt-1 text-destructive">{report.rejectedReason}</p>
            </div>
          )}
          {report.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{report.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {report.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Reimbursable</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {EXPENSE_CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{new Date(item.expenseDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {PAYMENT_METHOD_OPTIONS.find((m) => m.value === item.paymentMethod)?.label ?? item.paymentMethod}
                      </TableCell>
                      <TableCell>{item.merchant ?? "—"}</TableCell>
                      <TableCell>{item.isReimbursable ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{report.title}&quot;? This action cannot be undone.
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
