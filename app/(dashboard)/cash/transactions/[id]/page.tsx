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
  Wallet,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTransactionStore } from "@/src/store/transaction-store";
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  type TransactionTypeValue,
  type TransactionStatusValue,
} from "@/src/types/transaction";

const TYPE_COLORS: Record<TransactionTypeValue, string> = {
  INCOME: "bg-green-100 text-green-700",
  EXPENSE: "bg-red-100 text-red-700",
  TRANSFER: "bg-blue-100 text-blue-700",
};

const STATUS_COLORS: Record<TransactionStatusValue, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<TransactionStatusValue, React.ReactNode> = {
  PENDING: <Clock className="h-3 w-3" />,
  COMPLETED: <CheckCircle className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { transactions, loading, fetchTransactions, getTransactionById, deleteTransaction } = useTransactionStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { if (!transactions.length) fetchTransactions(); }, [transactions.length, fetchTransactions]);

  const transaction = getTransactionById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteTransaction(id);
    setDeleting(false);
    router.push("/cash/transactions");
  };

  if (loading && !transaction) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/cash/transactions")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Transactions
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Transaction not found</p>
              <p className="text-muted-foreground">The transaction you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Cash</span>
        <span>/</span>
        <button onClick={() => router.push("/cash/transactions")} className="hover:text-foreground">Transactions</button>
        <span>/</span>
        <span className="text-foreground">{transaction.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/cash/transactions")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{transaction.title}</h1>
              <Badge className={`${STATUS_COLORS[transaction.status]} flex items-center gap-1`}>
                {STATUS_ICONS[transaction.status]}
                {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={TYPE_COLORS[transaction.type]}>{transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}</Badge>
              <span className="text-muted-foreground">{formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/cash/transactions/${id}/edit`)} className="gap-2">
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
                <p className={`text-2xl font-bold ${transaction.type === "INCOME" ? "text-green-600" : transaction.type === "EXPENSE" ? "text-red-600" : "text-blue-600"}`}>
                  {transaction.type === "EXPENSE" ? "-" : transaction.type === "INCOME" ? "+" : ""}{formatCurrency(transaction.amount)}
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
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-lg font-semibold capitalize">{TRANSACTION_CATEGORY_OPTIONS.find((c) => c.value === transaction.category)?.label ?? transaction.category}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Wallet className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">{formatDate(transaction.date)}</p>
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
            <FileText className="h-5 w-5" /> Transaction Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Description" value={transaction.description} />
            <InfoRow label="Reference" value={transaction.reference} />
            <InfoRow label="Account" value={transaction.account} />
            <InfoRow label="Merchant / Payee" value={transaction.merchant} />
            <InfoRow label="Receipt" value={transaction.receipt} />
          </div>
          {transaction.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{transaction.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Created on {formatDateTime(transaction.createdAt)}</span>
            </div>
            {transaction.updatedAt !== transaction.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <Edit className="h-4 w-4 text-blue-600" />
                <span>Last updated on {formatDateTime(transaction.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{transaction.title}&quot;? This action cannot be undone.
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
