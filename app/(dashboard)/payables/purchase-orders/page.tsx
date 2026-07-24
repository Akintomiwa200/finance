"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePayableStore } from "@/src/store/payable-store";
import type { PurchaseOrder, POStatusType, POPriorityType } from "@/src/types/payable";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
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
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Package,
  FileText,
  DollarSign,
  Clock,
  ShoppingCart,
} from "lucide-react";

const statusOptions: { value: POStatusType | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "ordered", label: "Ordered" },
  { value: "partially_received", label: "Partially Received" },
  { value: "fully_received", label: "Fully Received" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
];

const priorityOptions: { value: POPriorityType | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

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

const priorityVariant: Record<POPriorityType, "default" | "secondary" | "success" | "warning" | "danger" | "info"> = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "danger",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatStatus = (s: POStatusType) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { purchaseOrders, loading, fetchPurchaseOrders, deletePO } = usePayableStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof PurchaseOrder>("orderDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const value = purchaseOrders.reduce((s, po) => s + po.totalAmount, 0);
    const pending = purchaseOrders.filter((po) => po.status === "pending_approval").length;
    const ordered = purchaseOrders.filter((po) => po.status === "ordered").length;
    return { total, value, pending, ordered };
  }, [purchaseOrders]);

  const filtered = useMemo(() => {
    let result = [...purchaseOrders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (po) => po.poNumber.toLowerCase().includes(q) || po.vendorName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((po) => po.status === statusFilter);
    if (priorityFilter !== "all") result = result.filter((po) => po.priority === priorityFilter);
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" && typeof bv === "string" ? av.localeCompare(bv) : Number(av) - Number(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [purchaseOrders, search, statusFilter, priorityFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: keyof PurchaseOrder) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePO(deleteId);
      setDeleteId(null);
    }
  };

  const canDelete = (status: POStatusType) => status === "draft" || status === "cancelled" || status === "rejected";

  const handleExport = () => {
    const headers = ["PO Number", "Vendor", "Status", "Priority", "Order Date", "Expected Delivery", "Total"];
    const rows = filtered.map((po) => [
      po.poNumber, po.vendorName, po.status, po.priority, formatDate(po.orderDate), formatDate(po.expectedDeliveryDate), po.totalAmount.toString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" />
            Purchase Orders
          </h1>
          <p className="text-muted-foreground mt-1">Manage purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/payables/purchase-orders/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create PO
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total POs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.value)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ordered</p>
                <p className="text-2xl font-bold text-purple-600">{stats.ordered}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO #, vendor..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("poNumber")}>
                      PO # <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("orderDate")}>
                      Order Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("totalAmount")}>
                      Total <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No purchase orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono text-xs font-medium">{po.poNumber}</TableCell>
                      <TableCell className="font-medium">{po.vendorName}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[po.status]}>{formatStatus(po.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant[po.priority]}>{po.priority.charAt(0).toUpperCase() + po.priority.slice(1)}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(po.orderDate)}</TableCell>
                      <TableCell>{formatDate(po.expectedDeliveryDate)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(po.totalAmount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link href={`/payables/purchase-orders/${po.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {po.status === "draft" && (
                            <Link href={`/payables/purchase-orders/${po.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          {canDelete(po.status) && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => setDeleteId(po.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t px-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">Page {page} of {totalPages || 1}</span>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page >= totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
