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
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CREDIT_NOTE_REASON_OPTIONS,
  type CreditNoteStatusType,
  type CreditNoteReasonType,
} from "@/src/types/receivable";

const STATUS_COLORS: Record<CreditNoteStatusType, string> = {
  draft: "bg-gray-100 text-gray-700",
  issued: "bg-blue-100 text-blue-700",
  applied: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
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

export default function CreditNoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { creditNotes, loading, fetchCreditNotes, getCreditNoteById, deleteCreditNote } = useReceivableStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!creditNotes.length) fetchCreditNotes();
  }, [creditNotes.length, fetchCreditNotes]);

  const cn = getCreditNoteById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteCreditNote(id);
    setDeleting(false);
    router.push("/receivables/credit-notes");
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  if (loading && !cn) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!cn) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/receivables/credit-notes")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Credit Notes
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Credit note not found</p>
              <p className="text-muted-foreground">The credit note you are looking for does not exist.</p>
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
        <button onClick={() => router.push("/receivables/credit-notes")} className="hover:text-foreground">Credit Notes</button>
        <span>/</span>
        <span className="text-foreground">{cn.creditNoteNumber}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/receivables/credit-notes")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{cn.creditNoteNumber}</h1>
              <Badge className={STATUS_COLORS[cn.status]}>
                {cn.status.charAt(0).toUpperCase() + cn.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Credit Note for {cn.customerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {cn.status === "draft" && (
            <Button variant="outline" onClick={() => router.push(`/receivables/credit-notes/${id}/edit`)} className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          )}
          {cn.status === "draft" && (
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
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(cn.totalAmount)}</p>
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
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(cn.remainingAmount)}</p>
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
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="text-2xl font-bold">{formatCurrency(cn.totalAmount - cn.remainingAmount)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Credit Note Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Customer" value={cn.customerName} />
            <InfoRow label="Linked Invoice" value={cn.invoiceNumber} />
            <InfoRow
              label="Reason"
              value={CREDIT_NOTE_REASON_OPTIONS.find((r) => r.value === cn.reason)?.label}
            />
            <InfoRow label="Reason Description" value={cn.reasonDescription} />
            <InfoRow label="Issue Date" value={cn.issueDate ? new Date(cn.issueDate).toLocaleDateString() : null} />
            <InfoRow label="Expiry Date" value={cn.expiryDate ? new Date(cn.expiryDate).toLocaleDateString() : null} />
            <InfoRow label="Tax Rate" value={cn.taxRate != null ? `${cn.taxRate}%` : null} />
            <InfoRow label="Tax Amount" value={formatCurrency(cn.taxAmount)} />
          </div>
          {cn.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{cn.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Created At" value={cn.createdAt ? new Date(cn.createdAt).toLocaleString() : null} />
            <InfoRow label="Updated At" value={cn.updatedAt ? new Date(cn.updatedAt).toLocaleString() : null} />
            <InfoRow label="Approved By" value={cn.approvedBy} />
            <InfoRow label="Approved At" value={cn.approvedAt ? new Date(cn.approvedAt).toLocaleString() : null} />
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credit Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{cn.creditNoteNumber}&quot;? This action cannot be undone.
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
