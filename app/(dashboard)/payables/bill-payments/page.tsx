"use client";

import { useEffect, useState, useMemo } from "react";
import { usePayableStore } from "@/src/store/payable-store";
import type { BillPaymentStatusType, BillPaymentMethodType } from "@/src/types/payable";
import { PAYMENT_METHOD_OPTIONS } from "@/src/types/payable";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Plus,
  Eye,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const PAYMENT_STATUS_CONFIG: Record<BillPaymentStatusType, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-3 w-3 mr-1" /> },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: <Clock className="h-3 w-3 mr-1" /> },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3 mr-1" /> },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-700", icon: <XCircle className="h-3 w-3 mr-1" /> },
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const METHOD_OPTIONS = [
  { value: "all", label: "All Methods" },
  ...PAYMENT_METHOD_OPTIONS,
];

const getMethodLabel = (method: BillPaymentMethodType) =>
  PAYMENT_METHOD_OPTIONS.find((m) => m.value === method)?.label ?? method;

export default function BillPaymentsPage() {
  const router = useRouter();
  const { payments, bills, loading, fetchPayments, fetchBills, deletePayment } = usePayableStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<"paymentDate" | "amount" | "paymentNumber">("paymentDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("payments");

  useEffect(() => {
    fetchPayments();
    fetchBills();
  }, [fetchPayments, fetchBills]);

  const stats = useMemo(() => {
    const total = payments.length;
    const completedAmount = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
    const pendingCount = payments.filter((p) => p.status === "pending" || p.status === "processing").length;
    const failedCount = payments.filter((p) => p.status === "failed").length;
    return { total, completedAmount, pendingCount, failedCount };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    let result = [...payments];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.paymentNumber.toLowerCase().includes(q) ||
          p.billNumber.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          (p.reference && p.reference.toLowerCase().includes(q)),
      );
    }
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter);
    if (dateFrom) result = result.filter((p) => p.paymentDate >= dateFrom);
    if (dateTo) result = result.filter((p) => p.paymentDate <= dateTo);

    result.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "paymentDate") {
        av = new Date(av as string).getTime();
        bv = new Date(bv as string).getTime();
      }
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [payments, searchQuery, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const pendingBills = useMemo(() => bills.filter((b) => b.balanceDue > 0), [bills]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (key: typeof sortKey) => {
    setSortKey(key);
    setSortDir((d) => (sortKey === key && d === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePayment(deleteId);
    setDeleteId(null);
  };

  const handleExport = () => {
    const headers = ["Payment #", "Bill #", "Vendor", "Amount", "Method", "Date", "Status", "Reference"];
    const rows = filteredPayments.map((p) => [
      p.paymentNumber,
      p.billNumber,
      p.vendorName,
      p.amount.toString(),
      getMethodLabel(p.paymentMethod),
      formatDate(p.paymentDate),
      p.status,
      p.reference ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill-payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Bill Payments
          </h1>
          <p className="text-muted-foreground mt-1">Process and record vendor bill payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/payables/bill-payments/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.completedAmount)}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
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
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by payment #, bill #, vendor..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 mt-3">
                <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} className="w-[150px]" />
                <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} className="w-[150px]" />
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
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("paymentNumber")}>
                          Payment #<ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("amount")}>
                          Amount<ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("paymentDate")}>
                          Date<ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <CreditCard className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No payments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedPayments.map((payment) => {
                        const cfg = PAYMENT_STATUS_CONFIG[payment.status];
                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="font-mono text-xs font-medium">{payment.paymentNumber}</TableCell>
                            <TableCell className="font-mono text-xs">{payment.billNumber}</TableCell>
                            <TableCell>{payment.vendorName}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{getMethodLabel(payment.paymentMethod)}</TableCell>
                            <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                            <TableCell>
                              <Badge className={`${cfg.color} flex items-center w-fit`}>
                                {cfg.icon}{cfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/payables/bill-payments/${payment.id}`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {payment.status === "pending" && (
                                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(payment.id)} className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredPayments.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows per page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm mx-2">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Balance Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <p className="text-muted-foreground">All bills are paid!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingBills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-mono text-xs font-medium">{bill.billNumber}</TableCell>
                          <TableCell>{bill.vendorName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(bill.totalAmount)}</TableCell>
                          <TableCell className="text-right font-medium text-orange-600">{formatCurrency(bill.balanceDue)}</TableCell>
                          <TableCell>
                            <span className={new Date(bill.dueDate) < new Date() ? "text-red-600 font-medium" : ""}>
                              {formatDate(bill.dueDate)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${bill.status === "overdue" ? "bg-red-100 text-red-700" : bill.status === "approved" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"} flex items-center w-fit capitalize`}>
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button size="sm" onClick={() => router.push(`/payables/bill-payments/new?billId=${bill.id}`)}>
                              <DollarSign className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pending payment? This action cannot be undone.
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
