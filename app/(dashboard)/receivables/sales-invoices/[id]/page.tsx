"use client";

import { useEffect, useMemo, useState } from "react";
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
  Clock,
  CheckCircle,
  Send,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  INVOICE_TYPE_OPTIONS,
  type SalesInvoiceStatusType,
} from "@/src/types/receivable";

const STATUS_COLORS: Record<SalesInvoiceStatusType, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  partially_paid: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount: number, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { invoices, loading, fetchInvoices, deleteInvoice, updateInvoice } = useReceivableStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const invoice = invoices.find((i) => i.id === id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteInvoice(id);
    setDeleting(false);
    router.push("/receivables/sales-invoices");
  };

  const handleSend = async () => {
    if (!invoice) return;
    await updateInvoice(id, { status: "sent", sentAt: new Date().toISOString() });
  };

  const handleMarkPaid = async () => {
    if (!invoice) return;
    await updateInvoice(id, { status: "paid", amountPaid: invoice.totalAmount, balanceDue: 0 });
  };

  if (loading && !invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/receivables/sales-invoices")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Invoice not found</p>
              <p className="text-muted-foreground">The invoice you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Receivables</span>
        <span>/</span>
        <button onClick={() => router.push("/receivables/sales-invoices")} className="hover:text-foreground">Sales Invoices</button>
        <span>/</span>
        <span className="text-foreground">{invoice.invoiceNumber}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/receivables/sales-invoices")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
              <Badge className={STATUS_COLORS[invoice.status]}>
                {invoice.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {invoice.customerName} &middot; {INVOICE_TYPE_OPTIONS.find((t) => t.value === invoice.type)?.label ?? invoice.type}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <Button variant="outline" onClick={handleSend} className="gap-2">
              <Send className="h-4 w-4" /> Send
            </Button>
          )}
          {(invoice.status === "sent" || invoice.status === "partially_paid" || invoice.status === "overdue") && (
            <Button variant="outline" onClick={handleMarkPaid} className="gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" /> Mark Paid
            </Button>
          )}
          {invoice.status === "draft" && (
            <Button variant="outline" onClick={() => router.push(`/receivables/sales-invoices/${id}/edit`)} className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          )}
          {invoice.status === "draft" && (
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
                <p className="text-2xl font-bold">{formatCurrency(invoice.totalAmount, invoice.currency)}</p>
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
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(invoice.amountPaid, invoice.currency)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Balance Due</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(invoice.balanceDue, invoice.currency)}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Line Items</p>
                <p className="text-2xl font-bold">{invoice.lines.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" /> Invoice Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Invoice Number" value={invoice.invoiceNumber} />
            <InfoRow label="Customer" value={invoice.customerName} />
            <InfoRow label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
            <InfoRow label="Due Date" value={formatDate(invoice.dueDate)} />
            <InfoRow label="Currency" value={invoice.currency} />
            <InfoRow label="Description" value={invoice.description} />
          </div>
          {invoice.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Terms & Conditions</p>
              <p className="mt-1">{invoice.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">{line.description}</TableCell>
                    <TableCell className="text-right">{line.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(line.unitPrice, invoice.currency)}</TableCell>
                    <TableCell className="text-right">{line.discount}%</TableCell>
                    <TableCell className="text-right">{line.tax}%</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(line.amount, invoice.currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-red-600">-{formatCurrency(invoice.discountAmount, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="text-green-600">{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Balance Due</span>
              <span className="text-orange-600">{formatCurrency(invoice.balanceDue, invoice.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{invoice.invoiceNumber}&quot;? This action cannot be undone.
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
