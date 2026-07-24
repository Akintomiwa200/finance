"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CREDIT_NOTE_REASON_OPTIONS,
  type CreditNoteReasonType,
} from "@/src/types/receivable";

export default function NewCreditNotePage() {
  const router = useRouter();
  const { customers, invoices, fetchCustomers, fetchInvoices, addCreditNote } = useReceivableStore();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    invoiceId: "",
    reason: "other" as CreditNoteReasonType,
    reasonDescription: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 0,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCustomers();
    fetchInvoices();
  }, [fetchCustomers, fetchInvoices]);

  const filteredInvoices = form.customerId
    ? invoices.filter((i) => i.customerId === form.customerId)
    : invoices;

  const selectedInvoice = form.invoiceId
    ? invoices.find((i) => i.id === form.invoiceId)
    : null;

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
    if (!form.customerId) e.customerId = "Customer is required";
    if (!form.issueDate) e.issueDate = "Issue date is required";
    if (form.subtotal <= 0) e.subtotal = "Amount must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addCreditNote({
      customerId: form.customerId,
      invoiceId: form.invoiceId || null,
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
    if (result) router.push("/receivables/credit-notes");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Receivables</span>
        <span>/</span>
        <button onClick={() => router.push("/receivables/credit-notes")} className="hover:text-foreground">Credit Notes</button>
        <span>/</span>
        <span className="text-foreground">New Credit Note</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/receivables/credit-notes")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Credit Note</h1>
          <p className="text-muted-foreground mt-1">Issue a credit note to a customer</p>
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
              <Label>Customer *</Label>
              <Select value={form.customerId} onValueChange={(v) => set("customerId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Linked Invoice (optional)</Label>
              <Select value={form.invoiceId} onValueChange={(v) => set("invoiceId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {filteredInvoices.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.invoiceNumber} — ${i.balanceDue.toFixed(2)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label>Expiry Date (optional)</Label>
              <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason Description (optional)</Label>
            <Textarea
              value={form.reasonDescription}
              onChange={(e) => set("reasonDescription", e.target.value)}
              placeholder="Provide additional details about the reason..."
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
              <Input type="number" min={0} step={0.01} value={form.subtotal || ""} onChange={(e) => set("subtotal", parseFloat(e.target.value) || 0)} placeholder="0.00" />
              {errors.subtotal && <p className="text-sm text-destructive">{errors.subtotal}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input type="number" min={0} max={100} step={0.01} value={form.taxRate || ""} onChange={(e) => set("taxRate", parseFloat(e.target.value) || 0)} placeholder="0" />
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
          <CardDescription>Additional notes (optional)</CardDescription>
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
        <Button variant="outline" onClick={() => router.push("/receivables/credit-notes")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Credit Note"}
        </Button>
      </div>
    </div>
  );
}
