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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import { INVOICE_TYPE_OPTIONS } from "@/src/types/receivable";

interface LineItem {
  key: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

const emptyLine = (key: number): LineItem => ({
  key,
  description: "",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  tax: 7.5,
});

const calcLineAmount = (l: LineItem) => {
  const sub = l.quantity * l.unitPrice;
  const disc = sub * (l.discount / 100);
  const taxAmt = (sub - disc) * (l.tax / 100);
  return sub - disc + taxAmt;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const { customers, fetchCustomers, addInvoice } = useReceivableStore();
  const [submitting, setSubmitting] = useState(false);
  const [nextKey, setNextKey] = useState(1);

  const [form, setForm] = useState({
    customerId: "",
    type: "standard",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    description: "",
    notes: "",
    terms: "",
    currency: "NGN",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLine(1)]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const setLine = (key: number, field: keyof LineItem, value: unknown) => {
    setLineItems((prev) => prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
  };

  const addLine = () => {
    const k = nextKey + 1;
    setNextKey(k);
    setLineItems((prev) => [...prev, emptyLine(k)]);
  };

  const removeLine = (key: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((l) => l.key !== key));
  };

  const subtotal = lineItems.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const discountAmount = lineItems.reduce((s, l) => s + l.quantity * l.unitPrice * (l.discount / 100), 0);
  const taxAmount = lineItems.reduce((s, l) => {
    const sub = l.quantity * l.unitPrice;
    return s + (sub - sub * (l.discount / 100)) * (l.tax / 100);
  }, 0);
  const totalAmount = subtotal - discountAmount + taxAmount;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = "Customer is required";
    if (!form.invoiceDate) e.invoiceDate = "Invoice date is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    if (lineItems.length === 0 || lineItems.every((l) => !l.description.trim())) e.lineItems = "At least one line item is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addInvoice({
      customerId: form.customerId,
      type: form.type,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      description: form.description || null,
      notes: form.notes || null,
      terms: form.terms || null,
      currency: form.currency,
      lines: lineItems
        .filter((l) => l.description.trim())
        .map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          discount: l.discount,
          tax: l.tax,
          amount: calcLineAmount(l),
        })),
    });
    setSubmitting(false);
    if (result) router.push("/receivables/sales-invoices");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Receivables</span>
        <span>/</span>
        <button onClick={() => router.push("/receivables/sales-invoices")} className="hover:text-foreground">Sales Invoices</button>
        <span>/</span>
        <span className="text-foreground">New Invoice</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/receivables/sales-invoices")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Invoice</h1>
          <p className="text-muted-foreground mt-1">Create a new sales invoice for your customer</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Basic invoice information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Select value={form.customerId} onValueChange={(v) => set("customerId", v)}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Invoice Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INVOICE_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Invoice Date *</Label>
              <Input type="date" value={form.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} />
              {errors.invoiceDate && <p className="text-sm text-destructive">{errors.invoiceDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} placeholder="NGN" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
          <CardDescription>Add products or services to this invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lineItems.map((line, idx) => (
            <div key={line.key} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Item {idx + 1}</span>
                {lineItems.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeLine(line.key)} className="text-destructive h-8 px-2">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input value={line.description} onChange={(e) => setLine(line.key, "description", e.target.value)} placeholder="Item description" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" min={1} value={line.quantity} onChange={(e) => setLine(line.key, "quantity", parseFloat(e.target.value) || 1)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unit Price</Label>
                    <Input type="number" min={0} value={line.unitPrice || ""} onChange={(e) => setLine(line.key, "unitPrice", parseFloat(e.target.value) || 0)} placeholder="0" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <Input readOnly value={new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(calcLineAmount(line))} className="bg-muted" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Discount (%)</Label>
                  <Input type="number" min={0} max={100} value={line.discount || ""} onChange={(e) => setLine(line.key, "discount", parseFloat(e.target.value) || 0)} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tax (%)</Label>
                  <Input type="number" min={0} value={line.tax || ""} onChange={(e) => setLine(line.key, "tax", parseFloat(e.target.value) || 0)} placeholder="7.5" />
                </div>
              </div>
            </div>
          ))}
          {errors.lineItems && <p className="text-sm text-destructive">{errors.lineItems}</p>}
          <Button type="button" variant="outline" onClick={addLine} className="gap-2">
            <Plus className="h-4 w-4" /> Add Line Item
          </Button>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-red-600">-{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(discountAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Total</span>
              <span>{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Notes and terms for this invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Thank you for your business..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Terms & Conditions</Label>
            <Textarea value={form.terms} onChange={(e) => set("terms", e.target.value)} placeholder="Payment terms, delivery terms, etc..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/receivables/sales-invoices")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </div>
  );
}
