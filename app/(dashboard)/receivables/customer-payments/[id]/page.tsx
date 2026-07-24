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
  CreditCard,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CUSTOMER_PAYMENT_METHOD_OPTIONS,
  type CustomerPaymentStatusType,
} from "@/src/types/receivable";

const STATUS_COLORS: Record<CustomerPaymentStatusType, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const STATUS_ICONS: Record<CustomerPaymentStatusType, React.ReactNode> = {
  pending: <Clock className="h-3 w-3 mr-1" />,
  completed: <CheckCircle className="h-3 w-3 mr-1" />,
  failed: <XCircle className="h-3 w-3 mr-1" />,
  refunded: <RefreshCw className="h-3 w-3 mr-1" />,
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}

export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { payments, customers, invoices, loading, fetchPayments, fetchCustomers, fetchInvoices, getPaymentById, deletePayment } = useReceivableStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!payments.length) fetchPayments();
    if (!customers.length) fetchCustomers();
    if (!invoices.length) fetchInvoices();
  }, [payments.length, customers.length, invoices.length, fetchPayments, fetchCustomers, fetchInvoices]);

  const payment = getPaymentById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deletePayment(id);
    setDeleting(false);
    router.push("/receivables/customer-payments");
  };

  if (loading && !payment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/receivables/customer-payments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Payments
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Payment not found</p>
              <p className="text-muted-foreground">The payment you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invoice = invoices.find((i) => i.id === payment.invoiceId);
  const methodLabel = CUSTOMER_PAYMENT_METHOD_OPTIONS.find((m) => m.value === payment.paymentMethod)?.label ?? payment.paymentMethod;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Receivables</span>
        <span>/</span>
        <button onClick={() => router.push("/receivables/customer-payments")} className="hover:text-foreground">Customer Payments</button>
        <span>/</span>
        <span className="text-foreground">{payment.paymentNumber}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/receivables/customer-payments")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{payment.paymentNumber}</h1>
              <Badge className={STATUS_COLORS[payment.status] + " flex items-center w-fit"}>
                {STATUS_ICONS[payment.status]}
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{payment.customerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/receivables/customer-payments/${id}/edit`)} className="gap-2">
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
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-green-600">{payment.amount}</p>
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
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="text-2xl font-bold">{new Date(payment.paymentDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Method</p>
                <p className="text-2xl font-bold">{methodLabel}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Payment Number" value={payment.paymentNumber} />
            <InfoRow label="Amount" value={payment.amount} />
            <InfoRow label="Payment Date" value={new Date(payment.paymentDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} />
            <InfoRow label="Payment Method" value={methodLabel} />
            <InfoRow label="Reference" value={payment.reference} />
            <InfoRow label="Online Reference" value={payment.onlineReference} />
          </div>
          {payment.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{payment.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" /> Customer & Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Customer" value={payment.customerName} />
            <InfoRow label="Invoice Number" value={payment.invoiceNumber} />
            {invoice && (
              <>
                <InfoRow label="Invoice Total" value={invoice.totalAmount} />
                <InfoRow label="Balance Due" value={invoice.balanceDue} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {(payment.bankName || payment.chequeNumber || payment.cardLast4) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Bank Name" value={payment.bankName} />
              <InfoRow label="Bank Account Number" value={payment.bankAccountNumber} />
              <InfoRow label="Cheque Number" value={payment.chequeNumber} />
              <InfoRow label="Card Last 4 Digits" value={payment.cardLast4 ? `****${payment.cardLast4}` : null} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <InfoRow label="Created At" value={new Date(payment.createdAt).toLocaleString()} />
            <InfoRow label="Updated At" value={new Date(payment.updatedAt).toLocaleString()} />
            <InfoRow label="Approved By" value={payment.approvedBy} />
            <InfoRow label="Approved At" value={payment.approvedAt ? new Date(payment.approvedAt).toLocaleString() : null} />
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{payment.paymentNumber}&quot;? This action cannot be undone.
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
