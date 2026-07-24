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
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CREDIT_NOTE_REASON_OPTIONS,
  type CreditNoteReasonType,
} from "@/src/types/receivable";

export default function EditCreditNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { creditNotes, loading, fetchCreditNotes, getCreditNoteById, updateCreditNote } = useReceivableStore();
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cn = getCreditNoteById(id);

  const [form, setForm] = useState({
    reason: "other" as CreditNoteReasonType,
    reasonDescription: "",
    issueDate: "",
    expiryDate: "",
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 0,
    notes: "",
  });

  useEffect(() => {
    if (!creditNotes.length) fetchCreditNotes();
  }, [creditNotes.length, fetchCreditNotes]);

  useEffect(() => {
    if (cn && !initialized) {
      setForm({
        reason: cn.reason,
        reasonDescription: cn.reasonDescription ?? "",
        issueDate: cn.issueDate ? cn.issueDate.split("T")[0] : "",
        expiryDate: cn.expiryDate ? cn.expiryDate.split("T")[0] : "",
        subtotal: cn.subtotal,
        taxRate: cn.taxRate ?? 0,
        taxAmount: cn.taxAmount,
        totalAmount: cn.totalAmount,
        notes: cn.notes ?? "",
      });
      setInitialized(true);
    }
  }, [cn, initialized]);

  const set = (field: string, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "subtotal" || field === "taxRate") {
        const subtotal = field === "subtotal" ? (Number(value) || 0) : next.subtotal;
        const taxRate = field === "taxRate" ? (Number(value) || 0) : next.taxRate;
        next.taxAmount = Math.round(subtotal * taxRate) / 100;
        next.totalAmount = subtotal + next.taxAmount;
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.issueDate) e.issueDate = "Issue date is required";
    if (form.subtotal <= 0) e.subtotal = "Amount must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await updateCreditNote(id, {
      reason: form.reason,
      reasonDescription: form.reasonDescription || null,
      issueDate: form.issueDate,
      expiryDate: form.expiryDate || null,
      subtotal: form.subtotal,
      taxRate: form.taxRate || null,
      taxAmount: form.taxAmount,
      totalAmount: form.totalAmount,
      remainingAmount: form.totalAmount,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (result) router.push(`/receivables/credit-notes/${id}`);
  };

  if (loading && !cn) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <p className="text-muted-foreground">The credit note you are trying to edit does not exist.</p>
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
        <button onClick={() => router.push(`/receivables/credit-notes/${id}`)} className="hover:text-foreground">{cn.creditNoteNumber}</button>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/receivables/credit-notes/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Credit Note</h1>
          <p className="text-muted-foreground mt-1">Update {cn.creditNoteNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Note Details</CardTitle>
          <CardDescription>Basic credit note information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Input disabled value={cn.customerName} />
            </div>
            <div className="space-y-2">
              <Label>Linked Invoice</Label>
              <Input disabled value={cn.invoiceNumber ?? "None"} />
            </div>
            <div className="space-y-2">
              <Label>Reason *</Label>
              <Select value={form.reason} onValueChange={(v) => set("reason", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CREDIT_NOTE_REASON_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Input type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)} />
              {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason Description</Label>
            <Textarea
              value={form.reasonDescription}
              onChange={(e) => set("reasonDescription", e.target.value)}
              placeholder="Provide additional details..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amounts</CardTitle>
          <CardDescription>Credit note financial details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Subtotal *</Label>
              <Input type="number" min={0} step={0.01} value={form.subtotal || ""} onChange={(e) => set("subtotal", parseFloat(e.target.value) || 0)} />
              {errors.subtotal && <p className="text-sm text-destructive">{errors.subtotal}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input type="number" min={0} max={100} step={0.01} value={form.taxRate || ""} onChange={(e) => set("taxRate", parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Tax Amount</Label>
              <Input type="number" disabled value={form.taxAmount.toFixed(2)} />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${form.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Additional notes</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push(`/receivables/credit-notes/${id}`)} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
