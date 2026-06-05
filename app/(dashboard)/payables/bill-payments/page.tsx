"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
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
  ArrowLeft,
  Plus,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Receipt,
  CreditCard,
  Send,
  Printer,
  Landmark,
  Wallet,
  Banknote,
  FileText,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";
type PaymentMethod =
  | "bank_transfer"
  | "cash"
  | "cheque"
  | "credit_card"
  | "online";

interface BillPayment {
  id: number;
  paymentNumber: string;
  bill: {
    id: number;
    billNumber: string;
    vendor: {
      id: number;
      name: string;
      code: string;
    };
    invoiceNumber: string;
    totalAmount: number;
    balanceDue: number;
  };
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  notes?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  chequeDetails?: {
    chequeNumber: string;
    bankName: string;
    issueDate: string;
  };
  creditCardDetails?: {
    cardLast4: string;
    cardType: string;
    transactionId: string;
  };
  approvedBy?: {
    id: number;
    name: string;
    date: string;
  };
  processedBy?: {
    id: number;
    name: string;
    date: string;
  };
  attachments?: {
    id: number;
    name: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock Bills with Outstanding Balances
const mockBills = [
  {
    id: 1,
    billNumber: "BILL-2026-0001",
    vendor: { id: 1, name: "Office Depot Nigeria", code: "VEN-001" },
    invoiceNumber: "INV-2026-045",
    totalAmount: 322500,
    balanceDue: 0,
  },
  {
    id: 2,
    billNumber: "BILL-2026-0002",
    vendor: { id: 2, name: "Tech Solutions Ltd", code: "VEN-002" },
    invoiceNumber: "INV-2026-089",
    totalAmount: 806250,
    balanceDue: 806250,
  },
  {
    id: 3,
    billNumber: "BILL-2026-0003",
    vendor: { id: 3, name: "Power Utility Company", code: "VEN-003" },
    invoiceNumber: "UTIL-2026-03",
    totalAmount: 225750,
    balanceDue: 225750,
  },
  {
    id: 4,
    billNumber: "BILL-2026-0004",
    vendor: { id: 4, name: "Property Management Ltd", code: "VEN-004" },
    invoiceNumber: "RENT-2026-03",
    totalAmount: 1612500,
    balanceDue: 1612500,
  },
  {
    id: 5,
    billNumber: "BILL-2026-0005",
    vendor: { id: 1, name: "Office Depot Nigeria", code: "VEN-001" },
    invoiceNumber: "INV-2026-102",
    totalAmount: 153187.5,
    balanceDue: 153187.5,
  },
];

// Mock Payments
const mockPayments: BillPayment[] = [
  {
    id: 1,
    paymentNumber: "PMT-2026-0001",
    bill: mockBills[0],
    amount: 322500,
    paymentDate: "2026-03-15",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "TRF-2026-0123",
    notes: "Full payment for office supplies",
    bankDetails: {
      bankName: "First Bank",
      accountNumber: "2034567890",
      accountName: "Office Depot Nigeria Ltd",
    },
    approvedBy: { id: 1, name: "Finance Manager", date: "2026-03-14T10:00:00" },
    processedBy: {
      id: 2,
      name: "Payment Processor",
      date: "2026-03-15T09:00:00",
    },
    createdAt: "2026-03-14T09:00:00",
    updatedAt: "2026-03-15T09:00:00",
    createdBy: "John Smith",
  },
  {
    id: 2,
    paymentNumber: "PMT-2026-0002",
    bill: mockBills[1],
    amount: 400000,
    paymentDate: "2026-03-20",
    paymentMethod: "bank_transfer",
    status: "processing",
    reference: "TRF-2026-0156",
    notes: "Partial payment for IT services",
    bankDetails: {
      bankName: "GT Bank",
      accountNumber: "0123456789",
      accountName: "Tech Solutions Ltd",
    },
    createdAt: "2026-03-20T10:00:00",
    updatedAt: "2026-03-20T10:00:00",
    createdBy: "Alice Johnson",
  },
  {
    id: 3,
    paymentNumber: "PMT-2026-0003",
    bill: mockBills[2],
    amount: 225750,
    paymentDate: "2026-03-18",
    paymentMethod: "cash",
    status: "pending",
    reference: "CASH-2026-045",
    notes: "Utility bill payment",
    createdAt: "2026-03-18T14:00:00",
    updatedAt: "2026-03-18T14:00:00",
    createdBy: "Facilities Manager",
  },
  {
    id: 4,
    paymentNumber: "PMT-2026-0004",
    bill: mockBills[3],
    amount: 806250,
    paymentDate: "2026-03-22",
    paymentMethod: "cheque",
    status: "pending",
    reference: "CHQ-2026-089",
    chequeDetails: {
      chequeNumber: "000145",
      bankName: "Zenith Bank",
      issueDate: "2026-03-22",
    },
    notes: "Rent payment for March",
    createdAt: "2026-03-22T11:00:00",
    updatedAt: "2026-03-22T11:00:00",
    createdBy: "Admin Manager",
  },
  {
    id: 5,
    paymentNumber: "PMT-2026-0005",
    bill: mockBills[2],
    amount: 100000,
    paymentDate: "2026-03-25",
    paymentMethod: "credit_card",
    status: "failed",
    reference: "CC-2026-567",
    creditCardDetails: {
      cardLast4: "4242",
      cardType: "Visa",
      transactionId: "TXN-2026-789",
    },
    notes: "Card payment failed - insufficient funds",
    createdAt: "2026-03-25T09:00:00",
    updatedAt: "2026-03-25T09:15:00",
    createdBy: "Finance Officer",
  },
];

const paymentStatuses = [
  { value: "all", label: "All Status" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-700" },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700",
  },
];

const paymentMethods = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Landmark },
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "cheque", label: "Cheque", icon: Receipt },
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
  { value: "online", label: "Online Payment", icon: Send },
];

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: PaymentStatus) => {
  const config = paymentStatuses.find((s) => s.value === status);
  const icons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    processing: <RefreshCw className="h-3 w-3 mr-1" />,
    completed: <CheckCircle className="h-3 w-3 mr-1" />,
    failed: <XCircle className="h-3 w-3 mr-1" />,
    cancelled: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getPaymentMethodLabel = (method: PaymentMethod) => {
  return paymentMethods.find((m) => m.value === method)?.label || method;
};

export default function BillPayments() {
  const router = useRouter();

  // State
  const [payments, setPayments] = useState<BillPayment[]>(mockPayments);
  const [bills] = useState(mockBills);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BillPayment;
    direction: "asc" | "desc";
  }>({ key: "paymentDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<BillPayment | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"payments" | "pending">(
    "payments",
  );

  // Form state for new payment
  const [formData, setFormData] = useState({
    billId: 0,
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "bank_transfer" as PaymentMethod,
    reference: "",
    notes: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    chequeNumber: "",
    chequeBank: "",
    chequeIssueDate: "",
    cardLast4: "",
    cardType: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedCount = payments.filter(
      (p) => p.status === "completed",
    ).length;
    const pendingCount = payments.filter((p) => p.status === "pending").length;
    const processingCount = payments.filter(
      (p) => p.status === "processing",
    ).length;
    const failedCount = payments.filter((p) => p.status === "failed").length;
    const thisMonthAmount = payments
      .filter((p) => {
        const paymentDate = new Date(p.paymentDate);
        const now = new Date();
        return (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear() &&
          p.status === "completed"
        );
      })
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPayments,
      totalAmount,
      completedCount,
      pendingCount,
      processingCount,
      failedCount,
      thisMonthAmount,
    };
  }, [payments]);

  // Filter and sort
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (payment) =>
          payment.paymentNumber.toLowerCase().includes(query) ||
          payment.bill.vendor.name.toLowerCase().includes(query) ||
          payment.reference.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((payment) => payment.status === statusFilter);
    }

    if (methodFilter !== "all") {
      result = result.filter(
        (payment) => payment.paymentMethod === methodFilter,
      );
    }

    if (dateRange.from) {
      result = result.filter(
        (payment) => payment.paymentDate >= dateRange.from,
      );
    }
    if (dateRange.to) {
      result = result.filter((payment) => payment.paymentDate <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "paymentDate") {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [
    payments,
    searchQuery,
    statusFilter,
    methodFilter,
    dateRange,
    sortConfig,
  ]);

  // Pending bills that need payment
  const pendingBills = useMemo(() => {
    return bills.filter((bill) => bill.balanceDue > 0);
  }, [bills]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof BillPayment) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewPayment = (payment: BillPayment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleSelectBill = (billId: number) => {
    const bill = bills.find((b) => b.id === billId);
    if (bill) {
      setSelectedBillId(billId);
      setFormData((prev) => ({
        ...prev,
        billId,
        amount: bill.balanceDue,
        reference: `PAY-${bill.billNumber}`,
      }));
      setIsCreateModalOpen(true);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.billId) errors.billId = "Please select a bill";
    if (formData.amount <= 0) errors.amount = "Amount must be greater than 0";
    if (!formData.paymentDate) errors.paymentDate = "Payment date is required";

    const selectedBill = bills.find((b) => b.id === formData.billId);
    if (selectedBill && formData.amount > selectedBill.balanceDue) {
      errors.amount = `Amount cannot exceed outstanding balance (${formatCurrency(selectedBill.balanceDue)})`;
    }

    if (formData.paymentMethod === "bank_transfer") {
      if (!formData.bankName) errors.bankName = "Bank name is required";
      if (!formData.accountNumber)
        errors.accountNumber = "Account number is required";
      if (!formData.accountName)
        errors.accountName = "Account name is required";
    }

    if (formData.paymentMethod === "cheque") {
      if (!formData.chequeNumber)
        errors.chequeNumber = "Cheque number is required";
      if (!formData.chequeBank) errors.chequeBank = "Bank name is required";
    }

    if (formData.paymentMethod === "credit_card") {
      if (!formData.cardLast4)
        errors.cardLast4 = "Last 4 digits of card are required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePayment = () => {
    if (!validateForm()) return;

    const selectedBill = bills.find((b) => b.id === formData.billId)!;

    const newPayment: BillPayment = {
      id: Math.max(...payments.map((p) => p.id), 0) + 1,
      paymentNumber: `PMT-${new Date().getFullYear()}-${String(payments.length + 1).padStart(4, "0")}`,
      bill: {
        id: selectedBill.id,
        billNumber: selectedBill.billNumber,
        vendor: selectedBill.vendor,
        invoiceNumber: selectedBill.invoiceNumber,
        totalAmount: selectedBill.totalAmount,
        balanceDue: selectedBill.balanceDue - formData.amount,
      },
      amount: formData.amount,
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
      status: "pending",
      reference: formData.reference,
      notes: formData.notes,
      bankDetails:
        formData.paymentMethod === "bank_transfer"
          ? {
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
            }
          : undefined,
      chequeDetails:
        formData.paymentMethod === "cheque"
          ? {
              chequeNumber: formData.chequeNumber,
              bankName: formData.chequeBank,
              issueDate: formData.chequeIssueDate || formData.paymentDate,
            }
          : undefined,
      creditCardDetails:
        formData.paymentMethod === "credit_card"
          ? {
              cardLast4: formData.cardLast4,
              cardType: formData.cardType,
              transactionId: `TXN-${Date.now()}`,
            }
          : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
    };

    setPayments((prev) => [newPayment, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
    setSelectedBillId(null);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? {
              ...p,
              status: "completed",
              approvedBy: {
                id: 1,
                name: "Finance Manager",
                date: new Date().toISOString(),
              },
              processedBy: {
                id: 2,
                name: "Payment Processor",
                date: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
    setIsConfirmDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleCancelPayment = () => {
    if (!selectedPayment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? {
              ...p,
              status: "cancelled",
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
    setIsCancelDialogOpen(false);
    setSelectedPayment(null);
  };

  const resetForm = () => {
    setFormData({
      billId: 0,
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "bank_transfer",
      reference: "",
      notes: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      chequeNumber: "",
      chequeBank: "",
      chequeIssueDate: "",
      cardLast4: "",
      cardType: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Payment #",
      "Date",
      "Bill #",
      "Vendor",
      "Amount",
      "Method",
      "Status",
      "Reference",
    ];
    const csvData = filteredPayments.map((p) => [
      p.paymentNumber,
      formatDate(p.paymentDate),
      p.bill.billNumber,
      p.bill.vendor.name,
      p.amount.toString(),
      getPaymentMethodLabel(p.paymentMethod),
      p.status,
      p.reference,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill-payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setPayments([...mockPayments]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setDateRange({ from: "", to: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Bill Payments
            </h1>
            <p className="text-muted-foreground mt-1">
              Process and record vendor bill payments
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{stats.totalPayments}</p>
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
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
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
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.thisMonthAmount)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.pendingCount} pending, {stats.processingCount} processing
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by payment #, vendor, reference..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={methodFilter}
                  onValueChange={(v) => {
                    setMethodFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 mt-3">
                <Input
                  type="date"
                  placeholder="From Date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="w-[150px]"
                />
                <Input
                  type="date"
                  placeholder="To Date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="w-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("paymentNumber")}
                        >
                          Payment #
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("paymentDate")}
                        >
                          Date
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <CreditCard className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No payments found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-xs font-medium">
                            {payment.paymentNumber}
                          </TableCell>
                          <TableCell>
                            {formatDate(payment.paymentDate)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.bill.billNumber}
                          </TableCell>
                          <TableCell>{payment.bill.vendor.name}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodLabel(payment.paymentMethod)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.reference}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {payment.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPayment(payment);
                                      setIsConfirmDialogOpen(true);
                                    }}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPayment(payment);
                                      setIsCancelDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredPayments.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows per page:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(v) => {
                        setItemsPerPage(parseInt(v));
                        setCurrentPage(1);
                      }}
                    >
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
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredPayments.length,
                      )}{" "}
                      of {filteredPayments.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
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
            <CardHeader>
              <CardTitle>Bills Awaiting Payment</CardTitle>
              <CardDescription>
                {pendingBills.length} bill{pendingBills.length !== 1 ? "s" : ""}{" "}
                with outstanding balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Outstanding</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <p className="text-muted-foreground">
                              All bills are paid!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              No outstanding bills to display.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingBills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-mono text-xs">
                            {bill.billNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {bill.vendor.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {bill.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(bill.totalAmount)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-orange-600">
                            {formatCurrency(bill.balanceDue)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              onClick={() => handleSelectBill(bill.id)}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Make Payment
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

      {/* View Payment Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Payment Details</span>
              {selectedPayment && getStatusBadge(selectedPayment.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment?.paymentNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p>{formatDate(selectedPayment.paymentDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p>{getPaymentMethodLabel(selectedPayment.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-mono text-sm">
                    {selectedPayment.reference}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Bill Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bill Number</p>
                    <p className="font-mono text-sm">
                      {selectedPayment.bill.billNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <p>{selectedPayment.bill.vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Invoice Number
                    </p>
                    <p className="font-mono text-sm">
                      {selectedPayment.bill.invoiceNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p>{formatCurrency(selectedPayment.bill.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {selectedPayment.bankDetails && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Bank Transfer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p>{selectedPayment.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-mono">
                        {selectedPayment.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p>{selectedPayment.bankDetails.accountName}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment.chequeDetails && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Cheque Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cheque Number
                      </p>
                      <p className="font-mono">
                        {selectedPayment.chequeDetails.chequeNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p>{selectedPayment.chequeDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Issue Date
                      </p>
                      <p>
                        {formatDate(selectedPayment.chequeDetails.issueDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment.creditCardDetails && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Credit Card Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Card Type</p>
                      <p>{selectedPayment.creditCardDetails.cardType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last 4 Digits
                      </p>
                      <p className="font-mono">
                        ****{selectedPayment.creditCardDetails.cardLast4}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID
                      </p>
                      <p className="font-mono text-sm">
                        {selectedPayment.creditCardDetails.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedPayment.notes}</p>
                </div>
              )}

              {/* Approval/Processing Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Processing Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Created by {selectedPayment.createdBy} on{" "}
                      {formatDateTime(selectedPayment.createdAt)}
                    </span>
                  </div>
                  {selectedPayment.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        Approved by {selectedPayment.approvedBy.name} on{" "}
                        {formatDateTime(selectedPayment.approvedBy.date)}
                      </span>
                    </div>
                  )}
                  {selectedPayment.processedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="h-4 w-4 text-blue-600" />
                      <span>
                        Processed by {selectedPayment.processedBy.name} on{" "}
                        {formatDateTime(selectedPayment.processedBy.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Payment Modal */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Record a payment for a vendor bill
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Select Bill *</Label>
                <Select
                  value={formData.billId?.toString() || ""}
                  onValueChange={(v) => {
                    const billId = parseInt(v);
                    const bill = bills.find((b) => b.id === billId);
                    setFormData((prev) => ({
                      ...prev,
                      billId,
                      amount: bill?.balanceDue || 0,
                    }));
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a bill to pay" />
                  </SelectTrigger>
                  <SelectContent>
                    {bills
                      .filter((b) => b.balanceDue > 0)
                      .map((bill) => (
                        <SelectItem key={bill.id} value={bill.id.toString()}>
                          {bill.billNumber} - {bill.vendor.name} -{" "}
                          {formatCurrency(bill.balanceDue)} outstanding
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formErrors.billId && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.billId}
                  </p>
                )}
              </div>

              <div>
                <Label>Payment Amount *</Label>
                <Input
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
                {formErrors.amount && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.amount}
                  </p>
                )}
              </div>

              <div>
                <Label>Payment Date *</Label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {formErrors.paymentDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.paymentDate}
                  </p>
                )}
              </div>

              <div>
                <Label>Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, paymentMethod: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reference Number</Label>
                <Input
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reference: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Transaction reference"
                />
              </div>

              {/* Bank Transfer Details */}
              {formData.paymentMethod === "bank_transfer" && (
                <>
                  <div>
                    <Label>Bank Name *</Label>
                    <Input
                      value={formData.bankName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Bank name"
                    />
                    {formErrors.bankName && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.bankName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Account Number *</Label>
                    <Input
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Account number"
                    />
                    {formErrors.accountNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.accountNumber}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label>Account Name *</Label>
                    <Input
                      value={formData.accountName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accountName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Account holder name"
                    />
                    {formErrors.accountName && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.accountName}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Cheque Details */}
              {formData.paymentMethod === "cheque" && (
                <>
                  <div>
                    <Label>Cheque Number *</Label>
                    <Input
                      value={formData.chequeNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          chequeNumber: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Cheque number"
                    />
                    {formErrors.chequeNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.chequeNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Bank Name *</Label>
                    <Input
                      value={formData.chequeBank}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          chequeBank: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Bank name"
                    />
                    {formErrors.chequeBank && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.chequeBank}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      value={formData.chequeIssueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          chequeIssueDate: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {/* Credit Card Details */}
              {formData.paymentMethod === "credit_card" && (
                <>
                  <div>
                    <Label>Card Type</Label>
                    <Input
                      value={formData.cardType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cardType: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Visa, Mastercard, etc."
                    />
                  </div>
                  <div>
                    <Label>Last 4 Digits *</Label>
                    <Input
                      value={formData.cardLast4}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cardLast4: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="1234"
                      maxLength={4}
                    />
                    {formErrors.cardLast4 && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.cardLast4}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="mt-1"
                  rows={3}
                  placeholder="Payment notes..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePayment}>Create Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Payment Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this payment as completed?
              {selectedPayment && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedPayment.paymentNumber}</p>
                  <p>Amount: {formatCurrency(selectedPayment.amount)}</p>
                  <p>Vendor: {selectedPayment.bill.vendor.name}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPayment}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Payment Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this payment? This action cannot
              be undone.
              {selectedPayment && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedPayment.paymentNumber}</p>
                  <p>Amount: {formatCurrency(selectedPayment.amount)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelPayment}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
