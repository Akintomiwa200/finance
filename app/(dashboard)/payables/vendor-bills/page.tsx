"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
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
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePayableStore } from "@/src/store/payable-store";
import type { BillStatusType } from "@/src/types/payable";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-700" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-700" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const statusBadge = (status: BillStatusType) => {
  const cfg = statusOptions.find((s) => s.value === status);
  return <Badge className={cfg?.color + " flex items-center w-fit"}>{cfg?.label}</Badge>;
};

export default function VendorBillsPage() {
  const router = useRouter();
  const { bills, vendors, loading, fetchBills, fetchVendors, deleteBill } = usePayableStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"billNumber" | "issueDate" | "dueDate" | "totalAmount" | "balanceDue">("issueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
    fetchVendors();
  }, [fetchBills, fetchVendors]);

  const stats = useMemo(() => {
    const total = bills.length;
    const totalAmount = bills.reduce((s, b) => s + b.totalAmount, 0);
    const outstanding = bills.reduce((s, b) => s + b.balanceDue, 0);
    const overdue = bills.filter((b) => b.status === "overdue").length;
    return { total, totalAmount, outstanding, overdue };
  }, [bills]);

  const filtered = useMemo(() => {
    let result = [...bills];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.billNumber.toLowerCase().includes(q) ||
          b.vendorName.toLowerCase().includes(q) ||
          (b.description || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    if (vendorFilter !== "all") result = result.filter((b) => b.vendorId === vendorFilter);
    result.sort((a, b) => {
      let av: string | number = a[sortKey] as string | number;
      let bv: string | number = b[sortKey] as string | number;
      if (sortKey === "issueDate" || sortKey === "dueDate") {
        av = new Date(av as string).getTime();
        bv = new Date(bv as string).getTime();
      }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [bills, search, statusFilter, vendorFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleExport = () => {
    const headers = ["Bill #", "Vendor", "Type", "Status", "Issue Date", "Due Date", "Total", "Balance Due"];
    const rows = filtered.map((b) => [
      b.billNumber, b.vendorName, b.type, b.status, formatDate(b.issueDate), formatDate(b.dueDate), b.totalAmount.toString(), b.balanceDue.toString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-bills-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteBill(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              Vendor Bills
            </h1>
            <p className="text-muted-foreground mt-1">Manage vendor bills and payables</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/payables/vendor-bills/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
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
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
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
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.outstanding)}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
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
                placeholder="Search by bill #, vendor..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={vendorFilter} onValueChange={(v) => { setVendorFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
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
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("billNumber")}>
                      Bill # <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("issueDate")}>
                      Issue Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("dueDate")}>
                      Due Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("totalAmount")}>
                      Total <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("balanceDue")}>
                      Balance Due <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <p className="text-muted-foreground">Loading...</p>
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No bills found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-mono text-xs font-medium">{bill.billNumber}</TableCell>
                      <TableCell>{bill.vendorName}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{bill.type}</Badge></TableCell>
                      <TableCell>{statusBadge(bill.status)}</TableCell>
                      <TableCell>{formatDate(bill.issueDate)}</TableCell>
                      <TableCell>
                        <span className={bill.status !== "paid" && new Date(bill.dueDate) < new Date() ? "text-red-600 font-medium" : ""}>
                          {formatDate(bill.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(bill.totalAmount)}</TableCell>
                      <TableCell className={bill.balanceDue > 0 ? "font-medium text-orange-600" : ""}>{formatCurrency(bill.balanceDue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/payables/vendor-bills/${bill.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bill.status === "draft" && (
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/payables/vendor-bills/${bill.id}/edit`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {(bill.status === "draft" || bill.status === "cancelled") && (
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(bill.id)} className="text-red-600">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setPage(1); }}>
                  <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">Page {page} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Delete Bill</h2>
              <p className="text-muted-foreground">Are you sure you want to delete this bill? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
