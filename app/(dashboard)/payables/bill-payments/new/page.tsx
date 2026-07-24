"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePayableStore } from "@/src/store/payable-store";
import type { BillPaymentMethodType } from "@/src/types/payable";
import { PAYMENT_METHOD_OPTIONS } from "@/src/types/payable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
import { ArrowLeft, CreditCard, Receipt } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

export default function NewPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billIdParam = searchParams.get("billId");
  const { bills, loading, fetchBills, addPayment } = usePayableStore();

  const [form, setForm] = useState({
    billId: "",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "bank_transfer" as BillPaymentMethodType,
    reference: "",
    notes: "",
    bankName: "",
    bankAccountNumber: "",
    chequeNumber: "",
    cardLast4: "",
    onlineReference: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  useEffect(() => {
    if (billIdParam && bills.length > 0) {
      const bill = bills.find((b) => b.id === billIdParam);
      if (bill) {
        setForm((prev) => ({
          ...prev,
          billId: bill.id,
          amount: bill.balanceDue,
        }));
      }
    }
  }, [billIdParam, bills]);

  const unpaidBills = bills.filter((b) => b.balanceDue > 0);
  const selectedBill = bills.find((b) => b.id === form.billId);
  const remainingBalance = selectedBill ? selectedBill.balanceDue - form.amount : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.billId) e.billId = "Please select a bill";
    if (form.amount <= 0) e.amount = "Amount must be greater than 0";
    if (selectedBill && form.amount > selectedBill.balanceDue) e.amount = `Cannot exceed balance of ${formatCurrency(selectedBill.balanceDue)}`;
    if (!form.paymentDate) e.paymentDate = "Payment date is required";
    if (form.paymentMethod === "bank_transfer") {
      if (!form.bankName) e.bankName = "Bank name is required";
      if (!form.bankAccountNumber) e.bankAccountNumber = "Account number is required";
    }
    if (form.paymentMethod === "cheque" && !form.chequeNumber) e.chequeNumber = "Cheque number is required";
    if (form.paymentMethod === "credit_card" && !form.cardLast4) e.cardLast4 = "Last 4 digits are required";
    if (form.paymentMethod === "online" && !form.onlineReference) e.onlineReference = "Online reference is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedBill) return;
    setSubmitting(true);
    const result = await addPayment({
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
      billId: selectedBill.id,
      billNumber: selectedBill.billNumber,
      vendorName: selectedBill.vendorName,
      status: "pending",
    });
    setSubmitting(false);
    if (result) router.push("/payables/bill-payments");
  };

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/payables/bill-payments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/payables/payables")}>Payables</span>
            <span>/</span>
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/payables/bill-payments")}>Bill Payments</span>
            <span>/</span>
            <span className="text-foreground">New Payment</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            New Bill Payment
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Bill *</Label>
                <Select value={form.billId} onValueChange={(v) => updateField("billId", v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a bill to pay" />
                  </SelectTrigger>
                  <SelectContent>
                    {unpaidBills.map((bill) => (
                      <SelectItem key={bill.id} value={bill.id}>
                        {bill.billNumber} - {bill.vendorName} ({formatCurrency(bill.balanceDue)} due)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.billId && <p className="text-sm text-red-500 mt-1">{errors.billId}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    value={form.amount || ""}
                    onChange={(e) => updateField("amount", parseFloat(e.target.value) || 0)}
                    className="mt-1"
                    max={selectedBill?.balanceDue}
                    placeholder="0"
                  />
                  {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <Label>Payment Date *</Label>
                  <Input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => updateField("paymentDate", e.target.value)}
                    className="mt-1"
                  />
                  {errors.paymentDate && <p className="text-sm text-red-500 mt-1">{errors.paymentDate}</p>}
                </div>
              </div>

              <div>
                <Label>Payment Method *</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => updateField("paymentMethod", v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.paymentMethod === "bank_transfer" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Bank Name *</Label>
                    <Input value={form.bankName} onChange={(e) => updateField("bankName", e.target.value)} className="mt-1" placeholder="Bank name" />
                    {errors.bankName && <p className="text-sm text-red-500 mt-1">{errors.bankName}</p>}
                  </div>
                  <div>
                    <Label>Account Number *</Label>
                    <Input value={form.bankAccountNumber} onChange={(e) => updateField("bankAccountNumber", e.target.value)} className="mt-1" placeholder="Account number" />
                    {errors.bankAccountNumber && <p className="text-sm text-red-500 mt-1">{errors.bankAccountNumber}</p>}
                  </div>
                </div>
              )}

              {form.paymentMethod === "cheque" && (
                <div>
                  <Label>Cheque Number *</Label>
                  <Input value={form.chequeNumber} onChange={(e) => updateField("chequeNumber", e.target.value)} className="mt-1" placeholder="Cheque number" />
                  {errors.chequeNumber && <p className="text-sm text-red-500 mt-1">{errors.chequeNumber}</p>}
                </div>
              )}

              {form.paymentMethod === "credit_card" && (
                <div>
                  <Label>Last 4 Digits *</Label>
                  <Input value={form.cardLast4} onChange={(e) => updateField("cardLast4", e.target.value)} className="mt-1" placeholder="1234" maxLength={4} />
                  {errors.cardLast4 && <p className="text-sm text-red-500 mt-1">{errors.cardLast4}</p>}
                </div>
              )}

              {form.paymentMethod === "online" && (
                <div>
                  <Label>Online Reference *</Label>
                  <Input value={form.onlineReference} onChange={(e) => updateField("onlineReference", e.target.value)} className="mt-1" placeholder="Transaction reference" />
                  {errors.onlineReference && <p className="text-sm text-red-500 mt-1">{errors.onlineReference}</p>}
                </div>
              )}

              <div>
                <Label>Reference</Label>
                <Input value={form.reference} onChange={(e) => updateField("reference", e.target.value)} className="mt-1" placeholder="Optional reference" />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="mt-1" rows={3} placeholder="Payment notes..." />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push("/payables/bill-payments")}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Processing..." : "Create Payment"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Bill Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBill ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Bill #</span><span className="font-mono">{selectedBill.billNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span>{selectedBill.vendorName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span>{formatCurrency(selectedBill.totalAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Balance Due</span><span className="font-medium text-orange-600">{formatCurrency(selectedBill.balanceDue)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Due Date</span><span>{new Date(selectedBill.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span></div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Payment Amount</span><span className="font-medium">{formatCurrency(form.amount)}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Remaining Balance</span><span className={`font-medium ${remainingBalance > 0 ? "text-orange-600" : "text-green-600"}`}>{formatCurrency(Math.max(0, remainingBalance))}</span></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Select a bill to see details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
