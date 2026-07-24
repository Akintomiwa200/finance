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
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { usePayableStore } from "@/src/store/payable-store";
import { PAYMENT_METHOD_OPTIONS } from "@/src/types/payable";
import type { BillStatusType, BillPaymentMethodType } from "@/src/types/payable";

const statusColors: Record<BillStatusType, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function BillDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { bills, fetchBills, getBillById, updateBill, deleteBill, addPayment } = usePayableStore();

  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<BillPaymentMethodType>("bank_transfer");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const bill = useMemo(() => getBillById(id), [getBillById, id, bills]);

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

  const handleApprove = async () => {
    setSubmitting(true);
    await updateBill(id, { status: "approved", approvedAt: new Date().toISOString() });
    setSubmitting(false);
  };

  const handlePay = async () => {
    if (payAmount <= 0) return;
    setSubmitting(true);
    const payment = await addPayment({
      amount: payAmount,
      paymentDate: payDate,
      paymentMethod: payMethod,
      status: "completed",
      billId: bill.id,
      billNumber: bill.billNumber,
      vendorName: bill.vendorName,
    });
    if (payment) {
      const newAmountPaid = bill.amountPaid + payAmount;
      const newBalance = bill.totalAmount - newAmountPaid;
      await updateBill(id, {
        amountPaid: newAmountPaid,
        balanceDue: newBalance,
        status: newBalance <= 0 ? "paid" : bill.status,
      });
    }
    setPayAmount(0);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await deleteBill(id);
    setSubmitting(false);
    router.push("/payables/vendor-bills");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/payables/vendor-bills")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Payables &gt; Vendor Bills &gt; {bill.billNumber}</p>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight">{bill.billNumber}</h1>
            <Badge className={statusColors[bill.status]}>{bill.status}</Badge>
            <Badge variant="outline" className="capitalize">{bill.type}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Bill Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="font-medium">{bill.vendorName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Issue Date</span><span>{formatDate(bill.issueDate)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Due Date</span>
              <span className={bill.status !== "paid" && new Date(bill.dueDate) < new Date() ? "text-red-600 font-medium" : ""}>{formatDate(bill.dueDate)}</span>
            </div>
            {bill.description && <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span>{bill.description}</span></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(bill.subtotal)}</span></div>
            {bill.taxRate != null && <div className="flex justify-between"><span className="text-muted-foreground">Tax ({bill.taxRate}%)</span><span>{formatCurrency(bill.taxAmount)}</span></div>}
            {bill.discountRate != null && <div className="flex justify-between"><span className="text-muted-foreground">Discount ({bill.discountRate}%)</span><span className="text-red-600">-{formatCurrency(bill.discountAmount)}</span></div>}
            <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Total</span><span>{formatCurrency(bill.totalAmount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="text-green-600">{formatCurrency(bill.amountPaid)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Balance Due</span><span className={bill.balanceDue > 0 ? "font-bold text-orange-600" : "font-bold"}>{formatCurrency(bill.balanceDue)}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bill.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.description}</TableCell>
                  <TableCell className="text-right">{line.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(line.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(bill.status === "draft" || bill.status === "pending" || bill.status === "approved" || bill.status === "overdue" || bill.status === "cancelled") && (
        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {bill.status === "draft" && (
              <div className="flex gap-2">
                <Button onClick={() => router.push(`/payables/vendor-bills/${id}/edit`)} className="gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => setShowDelete(true)} className="gap-2">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            )}
            {bill.status === "cancelled" && (
              <Button variant="destructive" onClick={() => setShowDelete(true)} className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            )}
            {bill.status === "pending" && (
              <Button onClick={handleApprove} disabled={submitting} className="gap-2">
                <CheckCircle className="h-4 w-4" /> {submitting ? "Approving..." : "Approve"}
              </Button>
            )}
            {(bill.status === "approved" || bill.status === "overdue") && bill.balanceDue > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Record Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Amount *</Label>
                    <Input type="number" min="0" max={bill.balanceDue} value={payAmount || ""} onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                  </div>
                  <div className="space-y-1">
                    <Label>Payment Method *</Label>
                    <Select value={payMethod} onValueChange={(v) => setPayMethod(v as BillPaymentMethodType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHOD_OPTIONS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Payment Date *</Label>
                    <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handlePay} disabled={submitting || payAmount <= 0} className="gap-2">
                  <DollarSign className="h-4 w-4" /> {submitting ? "Processing..." : "Submit Payment"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {bill.notes && (
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{bill.notes}</p></CardContent>
        </Card>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Delete Bill</h2>
              <p className="text-muted-foreground">Are you sure you want to delete this bill? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={submitting}>{submitting ? "Deleting..." : "Delete"}</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
