"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePayableStore } from "@/src/store/payable-store";
import type { BillPayment } from "@/src/types/payable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  Landmark,
} from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-3 w-3 mr-1" /> },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: <Clock className="h-3 w-3 mr-1" /> },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3 mr-1" /> },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-700", icon: <XCircle className="h-3 w-3 mr-1" /> },
};

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  cheque: "Cheque",
  credit_card: "Credit Card",
  online: "Online",
};

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getPaymentById, fetchPayments, updatePayment, deletePayment } = usePayableStore();

  const [payment, setPayment] = useState<BillPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<"approve" | "confirm" | "cancel" | "delete" | null>(null);

  useEffect(() => {
    const load = async () => {
      await fetchPayments();
      const p = getPaymentById(id);
      setPayment(p ?? null);
      setLoading(false);
    };
    load();
  }, [id, fetchPayments, getPaymentById]);

  const handleAction = async () => {
    if (!payment || !confirmAction) return;

    if (confirmAction === "delete") {
      const ok = await deletePayment(payment.id);
      if (ok) router.push("/payables/bill-payments");
    } else {
      const updates: Record<string, unknown> = { status: confirmAction === "approve" ? "processing" : confirmAction === "confirm" ? "completed" : "cancelled" };
      if (confirmAction === "approve") { updates.approvedBy = "Current User"; updates.approvedAt = new Date().toISOString(); }
      if (confirmAction === "confirm") { updates.processedBy = "Current User"; updates.processedAt = new Date().toISOString(); updates.confirmedBy = "Current User"; updates.confirmedAt = new Date().toISOString(); }
      const result = await updatePayment(payment.id, updates);
      if (result) setPayment(result);
    }
    setConfirmAction(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <Button variant="ghost" onClick={() => router.push("/payables/bill-payments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-center py-12 text-muted-foreground">Payment not found</div>
      </div>
    );
  }

  const cfg = PAYMENT_STATUS_CONFIG[payment.status] || PAYMENT_STATUS_CONFIG.pending;
  const timeline = [
    { label: "Created", date: payment.createdAt, who: "System", icon: <FileText className="h-4 w-4 text-muted-foreground" />, done: true },
    { label: "Approved", date: payment.approvedAt, who: payment.approvedBy, icon: <CheckCircle className="h-4 w-4 text-green-600" />, done: !!payment.approvedAt },
    { label: "Processed", date: payment.processedAt, who: payment.processedBy, icon: <Send className="h-4 w-4 text-blue-600" />, done: !!payment.processedAt },
    { label: "Confirmed", date: payment.confirmedAt, who: payment.confirmedBy, icon: <CheckCircle className="h-4 w-4 text-green-600" />, done: !!payment.confirmedAt },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/payables/bill-payments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex-1">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/payables/payables")}>Payables</span>
            <span>/</span>
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/payables/bill-payments")}>Bill Payments</span>
            <span>/</span>
            <span className="text-foreground">{payment.paymentNumber}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              {payment.paymentNumber}
            </h1>
            <Badge className={`${cfg.color} flex items-center`}>
              {cfg.icon}{cfg.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Amount</p><p className="text-xl font-bold text-green-600">{formatCurrency(payment.amount)}</p></div>
                <div><p className="text-muted-foreground">Payment Method</p><p className="font-medium">{METHOD_LABELS[payment.paymentMethod] ?? payment.paymentMethod}</p></div>
                <div><p className="text-muted-foreground">Payment Date</p><p>{formatDate(payment.paymentDate)}</p></div>
                {payment.reference && <div><p className="text-muted-foreground">Reference</p><p className="font-mono text-sm">{payment.reference}</p></div>}
                {payment.notes && <div className="sm:col-span-2"><p className="text-muted-foreground">Notes</p><p>{payment.notes}</p></div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bill Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Bill Number</p>
                  <p className="font-mono font-medium hover:underline cursor-pointer" onClick={() => router.push(`/payables/vendor-bills`)}>
                    {payment.billNumber}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vendor</p>
                  <p className="font-medium">{payment.vendorName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {(payment.bankName || payment.bankAccountNumber || payment.chequeNumber || payment.cardLast4 || payment.onlineReference) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {payment.paymentMethod === "bank_transfer" && <Landmark className="h-4 w-4" />}
                  {payment.paymentMethod === "credit_card" && <CreditCard className="h-4 w-4" />}
                  {payment.paymentMethod === "cheque" && <FileText className="h-4 w-4" />}
                  {payment.paymentMethod === "online" && <Send className="h-4 w-4" />}
                  {METHOD_LABELS[payment.paymentMethod]} Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {payment.bankName && <div><p className="text-muted-foreground">Bank Name</p><p>{payment.bankName}</p></div>}
                  {payment.bankAccountNumber && <div><p className="text-muted-foreground">Account Number</p><p className="font-mono">{payment.bankAccountNumber}</p></div>}
                  {payment.chequeNumber && <div><p className="text-muted-foreground">Cheque Number</p><p className="font-mono">{payment.chequeNumber}</p></div>}
                  {payment.cardLast4 && <div><p className="text-muted-foreground">Card Last 4</p><p className="font-mono">****{payment.cardLast4}</p></div>}
                  {payment.onlineReference && <div><p className="text-muted-foreground">Online Reference</p><p className="font-mono">{payment.onlineReference}</p></div>}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {timeline.map((step, i) => (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step.done ? "bg-green-100" : "bg-gray-100"}`}>
                        {step.icon}
                      </div>
                      {i < timeline.length - 1 && <div className={`w-px flex-1 mt-1 ${step.done ? "bg-green-200" : "bg-gray-200"}`} />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${step.done ? "" : "text-muted-foreground"}`}>{step.label}</p>
                      {step.done && step.date && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.who && `${step.who} · `}{formatDateTime(step.date)}
                        </p>
                      )}
                      {!step.done && <p className="text-xs text-muted-foreground mt-0.5">Pending</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment.status === "pending" && (
                <>
                  <Button className="w-full gap-2" onClick={() => setConfirmAction("approve")}>
                    <CheckCircle className="h-4 w-4" />
                    Approve (Move to Processing)
                  </Button>
                  <Button variant="destructive" className="w-full gap-2" onClick={() => setConfirmAction("cancel")}>
                    <XCircle className="h-4 w-4" />
                    Cancel Payment
                  </Button>
                  <Button variant="outline" className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setConfirmAction("delete")}>
                    <XCircle className="h-4 w-4" />
                    Delete Payment
                  </Button>
                </>
              )}
              {payment.status === "processing" && (
                <Button className="w-full gap-2" onClick={() => setConfirmAction("confirm")}>
                  <CheckCircle className="h-4 w-4" />
                  Confirm (Mark Completed)
                </Button>
              )}
              {(payment.status === "completed" || payment.status === "cancelled" || payment.status === "failed") && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {payment.status === "completed" && "This payment has been completed."}
                  {payment.status === "cancelled" && "This payment was cancelled."}
                  {payment.status === "failed" && "This payment has failed."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "approve" && "Approve Payment"}
              {confirmAction === "confirm" && "Confirm Payment"}
              {confirmAction === "cancel" && "Cancel Payment"}
              {confirmAction === "delete" && "Delete Payment"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "approve" && "This will move the payment to processing status."}
              {confirmAction === "confirm" && "This will mark the payment as completed."}
              {confirmAction === "cancel" && "Are you sure you want to cancel this payment? This action cannot be undone."}
              {confirmAction === "delete" && "Are you sure you want to delete this payment? This action cannot be undone."}
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="font-medium">{payment.paymentNumber}</p>
                <p>Amount: {formatCurrency(payment.amount)}</p>
                <p>Vendor: {payment.vendorName}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={confirmAction === "cancel" || confirmAction === "delete" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {confirmAction === "approve" && "Approve"}
              {confirmAction === "confirm" && "Confirm"}
              {confirmAction === "cancel" && "Cancel Payment"}
              {confirmAction === "delete" && "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
