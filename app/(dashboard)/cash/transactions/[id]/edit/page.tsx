"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useTransactionStore } from "@/src/store/transaction-store";
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  type TransactionTypeValue,
  type TransactionStatusValue,
} from "@/src/types/transaction";

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { transactions, loading, fetchTransactions, getTransactionById, updateTransaction } = useTransactionStore();
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (!transactions.length) fetchTransactions(); }, [transactions.length, fetchTransactions]);

  const transaction = getTransactionById(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: 0,
    type: "INCOME" as TransactionTypeValue,
    category: "",
    status: "PENDING" as TransactionStatusValue,
    date: "",
    account: "",
    merchant: "",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    if (transaction && !initialized) {
      setForm({
        title: transaction.title,
        description: transaction.description ?? "",
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        status: transaction.status,
        date: transaction.date,
        account: transaction.account ?? "",
        merchant: transaction.merchant ?? "",
        reference: transaction.reference ?? "",
        notes: transaction.notes ?? "",
      });
      setInitialized(true);
    }
  }, [transaction, initialized]);

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.amount <= 0) e.amount = "Amount must be greater than 0";
    if (!form.category) e.category = "Category is required";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await updateTransaction(id, {
      title: form.title,
      description: form.description || null,
      amount: form.amount,
      type: form.type,
      category: form.category,
      status: form.status,
      date: form.date,
      account: form.account || null,
      merchant: form.merchant || null,
      reference: form.reference || null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (result) router.push(`/cash/transactions/${id}`);
  };

  if (loading && !transaction) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <p className="text-muted-foreground">The transaction you are trying to edit does not exist.</p>
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
        <button onClick={() => router.push(`/cash/transactions/${id}`)} className="hover:text-foreground">{transaction.title}</button>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/cash/transactions/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Transaction</h1>
          <p className="text-muted-foreground mt-1">Update {transaction.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Update the transaction information below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Client Payment" />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input id="amount" type="number" min={0} value={form.amount || ""} onChange={(e) => set("amount", parseFloat(e.target.value) || 0)} placeholder="0.00" />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {TRANSACTION_CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TRANSACTION_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Input id="account" value={form.account} onChange={(e) => set("account", e.target.value)} placeholder="Bank account name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant / Payee</Label>
              <Input id="merchant" value={form.merchant} onChange={(e) => set("merchant", e.target.value)} placeholder="Who was paid or who paid" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="Transaction reference number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description of the transaction" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes..." rows={2} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push(`/cash/transactions/${id}`)} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
