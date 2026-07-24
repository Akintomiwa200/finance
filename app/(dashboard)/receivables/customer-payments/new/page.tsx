"use client";

import { useEffect, useState, useMemo } from "react";
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
import { ArrowLeft, Save } from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CUSTOMER_PAYMENT_METHOD_OPTIONS,
  type CustomerPaymentMethodType,
} from "@/src/types/receivable";

export default function NewPaymentPage() {
  const router = useRouter();
  const { customers, invoices, fetchCustomers, fetchInvoices, addPayment } = useReceivableStore();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    invoiceId: "",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "bank_transfer" as CustomerPaymentMethodType,
    reference: "",
    notes: "",
    bankName: "",
    bankAccountNumber: "",
    chequeNumber: "",
    cardLast4: "",
    onlineReference: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCustomers();
    fetchInvoices();
  }, [fetchCustomers, fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    if (!form.customerId) return invoices.filter((i) => i.balanceDue > 0);
    return invoices.filter((i) => i.customerId === form.customerId && i.balanceDue > 0);
  }, [invoices, form.customerId]);

  const selectedInvoice = useMemo(
    () => invoices.find((i) => i.id === form.invoiceId),
    [invoices, form.invoiceId]
  );

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = "Please select a customer";
    if (!form.invoiceId) e.invoiceId = "Please select an invoice";
    if (form.amount <= 0) e.amount = "Amount must be greater than 0";
    if (!form.paymentDate) e.paymentDate = "Payment date is required";
    if (selectedInvoice && form.amount > selectedInvoice.balanceDue) {
      e.amount = `Amount cannot exceed outstanding balance (${selectedInvoice.balanceDue})`;
    }
    if (form.paymentMethod === "bank_transfer") {
      if (!form.bankName) e.bankName = "Bank name is required";
      if (!form.bankAccountNumber) e.bankAccountNumber = "Account number is required";
    }
    if (form.paymentMethod === "cheque" && !form.chequeNumber) {
      e.chequeNumber = "Cheque number is required";
    }
    if (form.paymentMethod === "credit_card" && !form.cardLast4) {
      e.cardLast4 = "Last 4 digits are required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addPayment({
      customerId: form.customerId,
      invoiceId: form.invoiceId,
      amount: form.amount,
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      reference: form.reference || null,
      notes: form.notes || null,
      bankName: form.bankName || null,
      bankAccountNumber: form.bankAccountNumber || null,
      chequeNumber: form.chequeNumber || null,
      cardLast4: form.cardLast4 || null,
      onlineReference: form.onlineReference || null,
    });
    setSubmitting(false);
    if (result) router.push("/receivables/customer-payments");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Receivables</span>
        <span>/</span>
        <button onClick={() => router.push("/receivables/customer-payments")} className="hover:text-foreground">Customer Payments</button>
        <span>/</span>
        <span className="text-foreground">New Payment</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/receivables/customer-payments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Payment</h1>
          <p className="text-muted-foreground mt-1">Record a customer payment</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Select the customer and invoice for this payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Select value={form.customerId} onValueChange={(v) => { set("customerId", v); set("invoiceId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Invoice *</Label>
              <Select value={form.invoiceId} onValueChange={(v) => {
                const inv = invoices.find((i) => i.id === v);
                set("invoiceId", v);
                if (inv) set("amount", inv.balanceDue);
              }}>
                <SelectTrigger><SelectValue placeholder="Select an invoice" /></SelectTrigger>
                <SelectContent>
                  {filteredInvoices.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.invoiceNumber} - Balance: {i.balanceDue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.invoiceId && <p className="text-sm text-destructive">{errors.invoiceId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input id="amount" type="number" min={0} value={form.amount || ""} onChange={(e) => set("amount", parseFloat(e.target.value) || 0)} placeholder="0" />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input id="paymentDate" type="date" value={form.paymentDate} onChange={(e) => set("paymentDate", e.target.value)} />
              {errors.paymentDate && <p className="text-sm text-destructive">{errors.paymentDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={form.paymentMethod} onValueChange={(v) => set("paymentMethod", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CUSTOMER_PAYMENT_METHOD_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="Transaction reference" />
            </div>
          </div>
          {selectedInvoice && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Invoice Balance</p>
              <p className="text-lg font-bold">{selectedInvoice.balanceDue}</p>
              <p className="text-sm text-muted-foreground mt-1">Total: {selectedInvoice.totalAmount} | Paid: {selectedInvoice.amountPaid}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {form.paymentMethod === "bank_transfer" && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input id="bankName" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="Bank name" />
                {errors.bankName && <p className="text-sm text-destructive">{errors.bankName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
                <Input id="bankAccountNumber" value={form.bankAccountNumber} onChange={(e) => set("bankAccountNumber", e.target.value)} placeholder="Account number" />
                {errors.bankAccountNumber && <p className="text-sm text-destructive">{errors.bankAccountNumber}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {form.paymentMethod === "cheque" && (
        <Card>
          <CardHeader>
            <CardTitle>Cheque Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="chequeNumber">Cheque Number *</Label>
              <Input id="chequeNumber" value={form.chequeNumber} onChange={(e) => set("chequeNumber", e.target.value)} placeholder="Cheque number" />
              {errors.chequeNumber && <p className="text-sm text-destructive">{errors.chequeNumber}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {form.paymentMethod === "credit_card" && (
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="cardLast4">Last 4 Digits *</Label>
              <Input id="cardLast4" value={form.cardLast4} onChange={(e) => set("cardLast4", e.target.value)} placeholder="1234" maxLength={4} />
              {errors.cardLast4 && <p className="text-sm text-destructive">{errors.cardLast4}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {form.paymentMethod === "online" && (
        <Card>
          <CardHeader>
            <CardTitle>Online Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="onlineReference">Online Reference</Label>
              <Input id="onlineReference" value={form.onlineReference} onChange={(e) => set("onlineReference", e.target.value)} placeholder="Transaction ID" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Payment notes..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/receivables/customer-payments")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Recording..." : "Record Payment"}
        </Button>
      </div>
    </div>
  );
}
