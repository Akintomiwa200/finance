"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePayableStore } from "@/src/store/payable-store";
import type { PurchaseOrderLineItem, POPriorityType, DeliveryMethodType } from "@/src/types/payable";
import { PO_PRIORITY_OPTIONS, DELIVERY_METHOD_OPTIONS } from "@/src/types/payable";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const { vendors, fetchVendors, addPO } = usePayableStore();

  const [vendorId, setVendorId] = useState("");
  const [priority, setPriority] = useState<POPriorityType>("medium");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(7.5);
  const [lines, setLines] = useState<PurchaseOrderLineItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, receivedQuantity: 0, amount: 0, accountCode: null, accountName: null },
    ]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, field: string, value: string | number) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        updated.amount = updated.quantity * updated.unitPrice;
        return updated;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId || !expectedDeliveryDate || lines.length === 0) return;
    setSubmitting(true);

    const vendor = vendors.find((v) => v.id === vendorId);
    const result = await addPO({
      vendorId,
      vendorName: vendor?.name || "",
      status: "draft",
      priority,
      orderDate,
      expectedDeliveryDate,
      deliveryMethod,
      deliveryAddress: deliveryAddress || null,
      deliveryNotes: deliveryNotes || null,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      notes: notes || null,
      lines,
    });

    setSubmitting(false);
    if (result) router.push("/payables/purchase-orders");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/payables/purchase-orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Link href="/payables/purchase-orders" className="hover:text-foreground">Payables</Link>
            <span>/</span>
            <Link href="/payables/purchase-orders" className="hover:text-foreground">Purchase Orders</Link>
            <span>/</span>
            <span className="text-foreground">New Purchase Order</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight">New Purchase Order</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>PO Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Vendor *</Label>
                <Select value={vendorId} onValueChange={setVendorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as POPriorityType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PO_PRIORITY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Order Date *</Label>
                <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Expected Delivery Date *</Label>
                <Input type="date" value={expectedDeliveryDate} onChange={(e) => setExpectedDeliveryDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Delivery Method</Label>
                <Select value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as DeliveryMethodType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_METHOD_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Address</Label>
              <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Enter delivery address" />
            </div>
            <div className="space-y-2">
              <Label>Delivery Notes</Label>
              <Input value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} placeholder="Special delivery instructions" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addLine} className="gap-1">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {lines.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No line items. Click "Add Item" to begin.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[140px]">Unit Price</TableHead>
                      <TableHead className="w-[140px] text-right">Amount</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Input
                            value={line.description}
                            onChange={(e) => updateLine(line.id, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(line.id, "quantity", Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={line.unitPrice}
                            onChange={(e) => updateLine(line.id, "unitPrice", Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(line.quantity * line.unitPrice)}</TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(line.id)} className="h-8 w-8 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" min="0" step="0.1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or comments..."
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/payables/purchase-orders">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={submitting || !vendorId || !expectedDeliveryDate || lines.length === 0} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
