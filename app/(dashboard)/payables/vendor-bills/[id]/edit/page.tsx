"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ArrowLeft, Plus, Trash2, Save, AlertTriangle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { usePayableStore } from "@/src/store/payable-store";
import { BILL_TYPE_OPTIONS } from "@/src/types/payable";
import type { BillLineItem } from "@/src/types/payable";

let lineIdCounter = 1000;

function makeLine(): BillLineItem {
  return { id: `edit-${lineIdCounter++}`, description: "", quantity: 1, unitPrice: 0, amount: 0, accountCode: null, accountName: null };
}

export default function EditBillPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { bills, vendors, fetchBills, fetchVendors, getBillById, updateBill } = usePayableStore();

  const [vendorId, setVendorId] = useState("");
  const [type, setType] = useState("purchase");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<BillLineItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => { fetchBills(); fetchVendors(); }, [fetchBills, fetchVendors]);

  const bill = useMemo(() => getBillById(id), [getBillById, id, bills]);

  useEffect(() => {
    if (bill && !initialized) {
      setVendorId(bill.vendorId);
      setType(bill.type);
      setIssueDate(bill.issueDate);
      setDueDate(bill.dueDate);
      setDescription(bill.description || "");
      setLines(bill.lines.length > 0 ? bill.lines.map((l) => ({ ...l })) : [makeLine()]);
      setTaxRate(bill.taxRate ?? 0);
      setDiscountRate(bill.discountRate ?? 0);
      setNotes(bill.notes || "");
      setInitialized(true);
    }
  }, [bill, initialized]);

  const updateLine = (lineId: string, field: keyof BillLineItem, value: string | number) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        const updated = { ...l, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = updated.quantity * updated.unitPrice;
        }
        return updated;
      })
    );
  };

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0), [lines]);
  const taxAmount = useMemo(() => subtotal * (taxRate / 100), [subtotal, taxRate]);
  const discountAmount = useMemo(() => subtotal * (discountRate / 100), [subtotal, discountRate]);
  const totalAmount = useMemo(() => subtotal + taxAmount - discountAmount, [subtotal, taxAmount, discountAmount]);

  if (!bill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Bill not found.</p>
        <Button variant="ghost" onClick={() => router.push("/payables/vendor-bills")} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Bills
        </Button>
      </div>
    );
  }

  if (bill.status !== "draft") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto" />
        <h2 className="text-xl font-semibold">Cannot Edit Bill</h2>
        <p className="text-muted-foreground">Only draft bills can be edited.</p>
        <Button onClick={() => router.push(`/payables/vendor-bills/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Bill
        </Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!vendorId || !issueDate || !dueDate || lines.length === 0) return;
    setSubmitting(true);
    const vendor = vendors.find((v) => v.id === vendorId);
    const result = await updateBill(id, {
      vendorId,
      vendorName: vendor?.name || bill.vendorName,
      type,
      issueDate,
      dueDate,
      description: description || null,
      subtotal,
      taxRate: taxRate || null,
      taxAmount,
      discountRate: discountRate || null,
      discountAmount,
      totalAmount,
      balanceDue: totalAmount - bill.amountPaid,
      notes: notes || null,
      lines,
    });
    setSubmitting(false);
    if (result) router.push(`/payables/vendor-bills/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Payables &gt; Vendor Bills &gt; {bill.billNumber} &gt; Edit</p>
          <h1 className="text-2xl font-bold tracking-tight">Edit {bill.billNumber}</h1>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Bill Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vendor *</Label>
              <Select value={vendorId} onValueChange={setVendorId}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bill Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BILL_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Bill description" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setLines((p) => [...p, makeLine()])} className="gap-1">
            <Plus className="h-3 w-3" /> Add Row
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {lines.map((line, idx) => (
            <div key={line.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4 space-y-1">
                {idx === 0 && <Label className="text-xs">Description</Label>}
                <Input value={line.description} onChange={(e) => updateLine(line.id, "description", e.target.value)} placeholder="Item description" />
              </div>
              <div className="col-span-2 space-y-1">
                {idx === 0 && <Label className="text-xs">Qty</Label>}
                <Input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(line.id, "quantity", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="col-span-2 space-y-1">
                {idx === 0 && <Label className="text-xs">Unit Price</Label>}
                <Input type="number" min="0" value={line.unitPrice} onChange={(e) => updateLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="col-span-2 space-y-1">
                {idx === 0 && <Label className="text-xs">Amount</Label>}
                <Input value={line.amount.toFixed(2)} readOnly className="bg-muted" />
              </div>
              <div className="col-span-2 flex justify-end">
                {idx === 0 && <div className="h-5" />}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLines((p) => (p.length > 1 ? p.filter((l) => l.id !== line.id) : p))}
                  disabled={lines.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{subtotal.toFixed(2)}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax Rate (%)</span>
                <Input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-24 ml-auto" />
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax Amount</span><span className="font-medium">{taxAmount.toFixed(2)}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Discount Rate (%)</span>
                <Input type="number" min="0" max="100" value={discountRate} onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)} className="w-24 ml-auto" />
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Discount Amount</span><span className="font-medium">-{discountAmount.toFixed(2)}</span></div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Total</span><span>{totalAmount.toFixed(2)}</span></div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Additional notes..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting || !vendorId || !dueDate} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Update Bill"}
        </Button>
      </div>
    </div>
  );
}
