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
  Trash2,
  Banknote,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Send,
} from "lucide-react";
import { useExpenseStore } from "@/src/store/expense-store";
import {
  REIMBURSEMENT_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  type ReimbursementStatusType,
} from "@/src/types/expense";

const STATUS_COLORS: Record<ReimbursementStatusType, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-purple-100 text-purple-700",
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

export default function ReimbursementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { reimbursements, loading, fetchReimbursements, getReimbursementById, deleteReimbursement, updateReimbursement } = useExpenseStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!reimbursements.length) fetchReimbursements();
  }, [reimbursements.length, fetchReimbursements]);

  const reimbursement = getReimbursementById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteReimbursement(id);
    setDeleting(false);
    router.push("/expenses/reimbursements");
  };

  const handleAction = async (action: "approved" | "rejected" | "paid") => {
    setActionLoading(true);
    const data: Record<string, unknown> = { status: action };
    if (action === "approved") data.approvedAt = new Date().toISOString();
    if (action === "paid") data.paidAt = new Date().toISOString();
    if (action === "rejected") data.rejectionReason = "Rejected by administrator";
    await updateReimbursement(id, data);
    setActionLoading(false);
  };

  if (loading && !reimbursement) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!reimbursement) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/expenses/reimbursements")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Reimbursements
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Reimbursement not found</p>
              <p className="text-muted-foreground">The reimbursement you are looking for does not exist.</p>
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
        <button onClick={() => router.push("/expenses/reimbursements")} className="hover:text-foreground">Reimbursements</button>
        <span>/</span>
        <span className="text-foreground">{reimbursement.employeeName} — {formatCurrency(reimbursement.amount)}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/expenses/reimbursements")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{reimbursement.employeeName}</h1>
              <Badge className={STATUS_COLORS[reimbursement.status]}>
                {reimbursement.status.charAt(0).toUpperCase() + reimbursement.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{reimbursement.department ?? "No department"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {reimbursement.status === "pending" && (
            <>
              <Button onClick={() => handleAction("approved")} disabled={actionLoading} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4" /> Approve
              </Button>
              <Button variant="outline" onClick={() => handleAction("rejected")} disabled={actionLoading} className="gap-2 text-destructive hover:text-destructive">
                <XCircle className="h-4 w-4" /> Reject
              </Button>
            </>
          )}
          {reimbursement.status === "approved" && (
            <Button onClick={() => handleAction("paid")} disabled={actionLoading} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" /> Mark as Paid
            </Button>
          )}
          {reimbursement.status === "pending" && (
            <Button variant="outline" onClick={() => setShowDelete(true)} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(reimbursement.amount)}</p>
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
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-bold capitalize">{reimbursement.status}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                {reimbursement.status === "approved" || reimbursement.status === "paid" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : reimbursement.status === "rejected" ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
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
                  {new Date(reimbursement.submittedAt).toLocaleDateString()}
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
            <Banknote className="h-5 w-5" /> Reimbursement Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Employee" value={reimbursement.employeeName} />
            <InfoRow label="Employee ID" value={reimbursement.employeeId} />
            <InfoRow label="Email" value={reimbursement.employeeEmail} />
            <InfoRow label="Department" value={reimbursement.department} />
            <InfoRow label="Category" value={reimbursement.category} />
            <InfoRow label="Payment Method" value={reimbursement.paymentMethod ? PAYMENT_METHOD_OPTIONS.find((m) => m.value === reimbursement.paymentMethod)?.label ?? reimbursement.paymentMethod : null} />
            <InfoRow label="Expense Report" value={reimbursement.expenseReportTitle || null} />
            <InfoRow label="Approved By" value={reimbursement.approvedBy} />
            <InfoRow label="Approved At" value={reimbursement.approvedAt ? new Date(reimbursement.approvedAt).toLocaleString() : null} />
            <InfoRow label="Paid At" value={reimbursement.paidAt ? new Date(reimbursement.paidAt).toLocaleString() : null} />
            <InfoRow label="Created" value={reimbursement.createdAt ? new Date(reimbursement.createdAt).toLocaleString() : null} />
          </div>
          {reimbursement.rejectionReason && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Rejection Reason</p>
              <p className="mt-1 text-destructive">{reimbursement.rejectionReason}</p>
            </div>
          )}
          {reimbursement.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{reimbursement.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reimbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reimbursement for {reimbursement.employeeName}? This action cannot be undone.
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
