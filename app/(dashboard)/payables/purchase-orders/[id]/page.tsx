"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePayableStore } from "@/src/store/payable-store";
import type { PurchaseOrder, POStatusType } from "@/src/types/payable";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
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
  CheckCircle,
  XCircle,
  Send,
  Package,
  FileText,
  Calendar,
  MapPin,
  Truck,
  DollarSign,
} from "lucide-react";

const statusVariant: Record<POStatusType, "default" | "secondary" | "success" | "warning" | "danger" | "info"> = {
  draft: "secondary",
  pending_approval: "warning",
  approved: "info",
  ordered: "info",
  partially_received: "warning",
  fully_received: "success",
  cancelled: "danger",
  rejected: "danger",
};

const formatStatus = (s: POStatusType) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatDateTime = (d: string) =>
  new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getPOById, fetchPurchaseOrders, updatePO, deletePO, loading } = usePayableStore();
  const [po, setPo] = useState<PurchaseOrder | undefined>(undefined);
  const [actionConfirm, setActionConfirm] = useState<{ action: string; label: string } | null>(null);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  useEffect(() => {
    const found = getPOById(id);
    if (found) setPo(found);
  }, [id, getPOById, loading]);

  const handleStatusChange = async (newStatus: POStatusType) => {
    const result = await updatePO(id, { status: newStatus });
    if (result) setPo(result);
    setActionConfirm(null);
  };

  const handleDelete = async () => {
    await deletePO(id);
    router.push("/payables/purchase-orders");
  };

  if (loading && !po) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <p className="text-muted-foreground">Purchase order not found.</p>
        <Link href="/payables/purchase-orders">
          <Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Purchase Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/payables/purchase-orders">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Link href="/payables/purchase-orders" className="hover:text-foreground">Payables</Link>
              <span>/</span>
              <Link href="/payables/purchase-orders" className="hover:text-foreground">Purchase Orders</Link>
              <span>/</span>
              <span className="text-foreground">{po.poNumber}</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{po.poNumber}</h1>
              <Badge variant={statusVariant[po.status]}>{formatStatus(po.status)}</Badge>
              <Badge variant={po.priority === "urgent" ? "danger" : po.priority === "high" ? "warning" : po.priority === "medium" ? "default" : "secondary"}>
                {po.priority.charAt(0).toUpperCase() + po.priority.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Vendor: {po.vendorName}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {po.status === "draft" && (
            <>
              <Link href={`/payables/purchase-orders/${po.id}/edit`}>
                <Button variant="outline" className="gap-2"><Edit className="h-4 w-4" /> Edit</Button>
              </Link>
              <Button variant="outline" className="gap-2" onClick={() => setActionConfirm({ action: "submit", label: "submit for approval" })}>
                <Send className="h-4 w-4" /> Submit for Approval
              </Button>
              <Button variant="danger" className="gap-2" onClick={() => setActionConfirm({ action: "delete", label: "delete" })}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </>
          )}
          {po.status === "pending_approval" && (
            <>
              <Button variant="outline" className="gap-2 text-green-600" onClick={() => setActionConfirm({ action: "approve", label: "approve" })}>
                <CheckCircle className="h-4 w-4" /> Approve
              </Button>
              <Button variant="danger" className="gap-2" onClick={() => setActionConfirm({ action: "reject", label: "reject" })}>
                <XCircle className="h-4 w-4" /> Reject
              </Button>
            </>
          )}
          {po.status === "approved" && (
            <Button variant="outline" className="gap-2" onClick={() => setActionConfirm({ action: "order", label: "mark as ordered" })}>
              <Send className="h-4 w-4" /> Mark as Ordered
            </Button>
          )}
          {po.status === "ordered" && (
            <Button variant="outline" className="gap-2" onClick={() => setActionConfirm({ action: "receive", label: "mark as received" })}>
              <Package className="h-4 w-4" /> Mark as Received
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> PO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">PO Number</p>
                <p className="font-medium font-mono">{po.poNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vendor</p>
                <p className="font-medium">{po.vendorName}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Order Date</p>
                <p>{formatDate(po.orderDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Expected Delivery</p>
                <p>{formatDate(po.expectedDeliveryDate)}</p>
              </div>
              {po.actualDeliveryDate && (
                <div>
                  <p className="text-muted-foreground">Actual Delivery</p>
                  <p>{formatDate(po.actualDeliveryDate)}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground flex items-center gap-1"><Truck className="h-3 w-3" /> Delivery Method</p>
                <p className="capitalize">{po.deliveryMethod}</p>
              </div>
              {po.deliveryAddress && (
                <div className="col-span-2">
                  <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Delivery Address</p>
                  <p>{po.deliveryAddress}</p>
                </div>
              )}
              {po.deliveryNotes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Delivery Notes</p>
                  <p>{po.deliveryNotes}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{formatDateTime(po.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{formatDateTime(po.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(po.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({po.taxRate ?? 0}%)</span>
                <span>{formatCurrency(po.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span>{formatCurrency(po.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.lines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No line items</TableCell>
                  </TableRow>
                ) : (
                  po.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.description}</TableCell>
                      <TableCell className="text-right">{line.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(line.amount)}</TableCell>
                      <TableCell className="text-right">
                        <span className={line.receivedQuantity >= line.quantity ? "text-green-600" : ""}>
                          {line.receivedQuantity} / {line.quantity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {po.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{po.notes}</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!actionConfirm} onOpenChange={() => setActionConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionConfirm?.label}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!actionConfirm) return;
                const actionMap: Record<string, POStatusType> = {
                  submit: "pending_approval",
                  approve: "approved",
                  reject: "rejected",
                  order: "ordered",
                  receive: "fully_received",
                };
                if (actionConfirm.action === "delete") {
                  handleDelete();
                } else if (actionMap[actionConfirm.action]) {
                  handleStatusChange(actionMap[actionConfirm.action]);
                }
              }}
              className={actionConfirm?.action === "delete" || actionConfirm?.action === "reject" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {actionConfirm?.action === "delete" ? "Delete" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
