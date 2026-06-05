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
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
type PaymentMethod =
  | "bank_transfer"
  | "cash"
  | "cheque"
  | "credit_card"
  | "online";

interface CustomerPayment {
  id: number;
  paymentNumber: string;
  customer: {
    id: number;
    name: string;
    code: string;
    email: string;
    phone: string;
  };
  invoice: {
    id: number;
    invoiceNumber: string;
    amount: number;
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
  receivedBy?: {
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

// Mock Customers
const mockCustomers = [
  {
    id: 1,
    name: "Nigerian Breweries PLC",
    code: "CUST-001",
    email: "accounts@nbplc.com",
    phone: "+234 800 123 4567",
  },
  {
    id: 2,
    name: "MTN Nigeria",
    code: "CUST-002",
    email: "accounts@mtn.ng",
    phone: "+234 700 123 4567",
  },
  {
    id: 3,
    name: "Lagos State Government",
    code: "CUST-003",
    email: "procurement@lagosstate.gov.ng",
    phone: "+234 800 456 7890",
  },
  {
    id: 4,
    name: "Access Bank Plc",
    code: "CUST-004",
    email: "supplier@accessbank.com",
    phone: "+234 800 789 0123",
  },
];

// Mock Invoices with Outstanding Balances
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2026-0001",
    customer: mockCustomers[0],
    amount: 6718750,
    balanceDue: 0,
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-0002",
    customer: mockCustomers[1],
    amount: 5309375,
    balanceDue: 2809375,
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-0003",
    customer: mockCustomers[2],
    amount: 8600000,
    balanceDue: 8600000,
  },
  {
    id: 4,
    invoiceNumber: "INV-2026-0004",
    customer: mockCustomers[3],
    amount: 14512500,
    balanceDue: 14512500,
  },
  {
    id: 5,
    invoiceNumber: "INV-2026-0005",
    customer: mockCustomers[1],
    amount: 1612500,
    balanceDue: 1612500,
  },
];

// Mock Payments
const mockPayments: CustomerPayment[] = [
  {
    id: 1,
    paymentNumber: "PMT-2026-0001",
    customer: mockCustomers[0],
    invoice: mockInvoices[0],
    amount: 6718750,
    paymentDate: "2026-03-28",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "TRF-2026-0456",
    notes: "Full payment for INV-2026-0001",
    bankDetails: {
      bankName: "First Bank",
      accountNumber: "2034567890",
      accountName: "Nigerian Breweries PLC",
    },
    receivedBy: { id: 1, name: "John Smith", date: "2026-03-28T10:00:00" },
    createdAt: "2026-03-28T09:00:00",
    updatedAt: "2026-03-28T10:00:00",
    createdBy: "John Smith",
  },
  {
    id: 2,
    paymentNumber: "PMT-2026-0002",
    customer: mockCustomers[1],
    invoice: mockInvoices[1],
    amount: 2500000,
    paymentDate: "2026-03-20",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "TRF-2026-0789",
    notes: "Partial payment",
    bankDetails: {
      bankName: "GT Bank",
      accountNumber: "0123456789",
      accountName: "MTN Nigeria",
    },
    receivedBy: { id: 1, name: "Alice Johnson", date: "2026-03-20T14:00:00" },
    createdAt: "2026-03-20T11:00:00",
    updatedAt: "2026-03-20T14:00:00",
    createdBy: "Alice Johnson",
  },
  {
    id: 3,
    paymentNumber: "PMT-2026-0003",
    customer: mockCustomers[2],
    invoice: mockInvoices[2],
    amount: 4300000,
    paymentDate: "2026-03-25",
    paymentMethod: "bank_transfer",
    status: "pending",
    reference: "TRF-2026-0890",
    notes: "Partial payment - awaiting confirmation",
    bankDetails: {
      bankName: "Zenith Bank",
      accountNumber: "9876543210",
      accountName: "Lagos State Government",
    },
    createdAt: "2026-03-25T09:00:00",
    updatedAt: "2026-03-25T09:00:00",
    createdBy: "Bid Manager",
  },
  {
    id: 4,
    paymentNumber: "PMT-2026-0004",
    customer: mockCustomers[3],
    invoice: mockInvoices[3],
    amount: 5000000,
    paymentDate: "2026-03-22",
    paymentMethod: "cheque",
    status: "completed",
    reference: "CHQ-2026-1234",
    notes: "Cheque payment",
    chequeDetails: {
      chequeNumber: "0001234",
      bankName: "Access Bank",
      issueDate: "2026-03-22",
    },
    receivedBy: { id: 1, name: "Finance Officer", date: "2026-03-22T11:00:00" },
    createdAt: "2026-03-22T10:00:00",
    updatedAt: "2026-03-22T11:00:00",
    createdBy: "Finance Officer",
  },
  {
    id: 5,
    paymentNumber: "PMT-2026-0005",
    customer: mockCustomers[1],
    invoice: mockInvoices[4],
    amount: 1612500,
    paymentDate: "2026-03-30",
    paymentMethod: "credit_card",
    status: "failed",
    reference: "CC-2026-5678",
    notes: "Card payment declined",
    creditCardDetails: {
      cardLast4: "4242",
      cardType: "Visa",
      transactionId: "TXN-2026-9012",
    },
    createdAt: "2026-03-30T09:00:00",
    updatedAt: "2026-03-30T09:15:00",
    createdBy: "Sales Rep",
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
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-700" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-700" },
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
    completed: <CheckCircle className="h-3 w-3 mr-1" />,
    failed: <XCircle className="h-3 w-3 mr-1" />,
    refunded: <RefreshCw className="h-3 w-3 mr-1" />,
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

export default function CustomerPayments() {
  const router = useRouter();

  // State
  const [payments, setPayments] = useState<CustomerPayment[]>(mockPayments);
  const [customers] = useState(mockCustomers);
  const [invoices] = useState(mockInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CustomerPayment;
    direction: "asc" | "desc";
  }>({ key: "paymentDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] =
    useState<CustomerPayment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"payments" | "pending">(
    "payments",
  );

  // Form state for new payment
  const [formData, setFormData] = useState({
    customerId: 0,
    invoiceId: 0,
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
          payment.customer.name.toLowerCase().includes(query) ||
          payment.invoice.invoiceNumber.toLowerCase().includes(query) ||
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

    if (customerFilter !== "all") {
      result = result.filter(
        (payment) => payment.customer.id === parseInt(customerFilter),
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
    customerFilter,
    dateRange,
    sortConfig,
  ]);

  // Pending invoices that need payment
  const pendingInvoices = useMemo(() => {
    return invoices.filter((invoice) => invoice.balanceDue > 0);
  }, [invoices]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof CustomerPayment) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewPayment = (payment: CustomerPayment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleSelectInvoice = (invoiceId: number) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (invoice) {
      setSelectedInvoiceId(invoiceId);
      setFormData((prev) => ({
        ...prev,
        customerId: invoice.customer.id,
        invoiceId,
        amount: invoice.balanceDue,
        reference: `PAY-${invoice.invoiceNumber}`,
      }));
      setIsCreateModalOpen(true);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerId) errors.customerId = "Please select a customer";
    if (!formData.invoiceId) errors.invoiceId = "Please select an invoice";
    if (formData.amount <= 0) errors.amount = "Amount must be greater than 0";
    if (!formData.paymentDate) errors.paymentDate = "Payment date is required";

    const selectedInvoice = invoices.find((i) => i.id === formData.invoiceId);
    if (selectedInvoice && formData.amount > selectedInvoice.balanceDue) {
      errors.amount = `Amount cannot exceed outstanding balance (${formatCurrency(selectedInvoice.balanceDue)})`;
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

    const selectedCustomer = customers.find(
      (c) => c.id === formData.customerId,
    )!;
    const selectedInvoice = invoices.find((i) => i.id === formData.invoiceId)!;

    const newPayment: CustomerPayment = {
      id: Math.max(...payments.map((p) => p.id), 0) + 1,
      paymentNumber: `PMT-${new Date().getFullYear()}-${String(payments.length + 1).padStart(4, "0")}`,
      customer: selectedCustomer,
      invoice: {
        id: selectedInvoice.id,
        invoiceNumber: selectedInvoice.invoiceNumber,
        amount: selectedInvoice.amount,
        balanceDue: selectedInvoice.balanceDue - formData.amount,
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
    setSelectedInvoiceId(null);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? {
              ...p,
              status: "completed",
              receivedBy: {
                id: 1,
                name: "Cashier",
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

  const handleRefundPayment = () => {
    if (!selectedPayment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? {
              ...p,
              status: "refunded",
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
    setIsRefundDialogOpen(false);
    setSelectedPayment(null);
  };

  const resetForm = () => {
    setFormData({
      customerId: 0,
      invoiceId: 0,
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
      "Customer",
      "Invoice #",
      "Amount",
      "Method",
      "Status",
      "Reference",
    ];
    const csvData = filteredPayments.map((p) => [
      p.paymentNumber,
      formatDate(p.paymentDate),
      p.customer.name,
      p.invoice.invoiceNumber,
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
    a.download = `customer-payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setPayments([...mockPayments]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setCustomerFilter("all");
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
              Customer Payments
            </h1>
            <p className="text-muted-foreground mt-1">
              Record and track customer payments
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
              {stats.pendingCount} pending, {stats.failedCount} failed
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
          <TabsTrigger value="pending">Pending Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by payment #, customer, invoice..."
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

                <Select
                  value={customerFilter}
                  onValueChange={(v) => {
                    setCustomerFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        {customer.name}
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice #</TableHead>
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
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {payment.customer.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {payment.customer.code}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.invoice.invoiceNumber}
                          </TableCell>
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
                                      setIsRefundDialogOpen(true);
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
              <CardTitle>Invoices Awaiting Payment</CardTitle>
              <CardDescription>
                {pendingInvoices.length} invoice
                {pendingInvoices.length !== 1 ? "s" : ""} with outstanding
                balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Outstanding</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <p className="text-muted-foreground">
                              All invoices are paid!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              No outstanding invoices to display.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono text-xs">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {invoice.customer.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-orange-600">
                            {formatCurrency(invoice.balanceDue)}
                          </TableCell>
                          <TableCell>{formatDate("2026-04-15")}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              onClick={() => handleSelectInvoice(invoice.id)}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Record Payment
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
                <h3 className="font-semibold mb-3">
                  Customer & Invoice Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">
                      {selectedPayment.customer.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Invoice Number
                    </p>
                    <p className="font-mono text-sm">
                      {selectedPayment.invoice.invoiceNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Invoice Amount
                    </p>
                    <p>{formatCurrency(selectedPayment.invoice.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Remaining Balance
                    </p>
                    <p className="text-orange-600">
                      {formatCurrency(selectedPayment.invoice.balanceDue)}
                    </p>
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
                    <div className="md:col-span-2">
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

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Processing Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Created by {selectedPayment.createdBy} on{" "}
                      {formatDateTime(selectedPayment.createdAt)}
                    </span>
                  </div>
                  {selectedPayment.receivedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        Received by {selectedPayment.receivedBy.name} on{" "}
                        {formatDateTime(selectedPayment.receivedBy.date)}
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
            <DialogTitle>Record Customer Payment</DialogTitle>
            <DialogDescription>
              Record a payment from a customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Select Invoice *</Label>
                <Select
                  value={formData.invoiceId?.toString() || ""}
                  onValueChange={(v) => {
                    const invoiceId = parseInt(v);
                    const invoice = invoices.find((i) => i.id === invoiceId);
                    if (invoice) {
                      setFormData((prev) => ({
                        ...prev,
                        invoiceId,
                        customerId: invoice.customer.id,
                        amount: invoice.balanceDue,
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices
                      .filter((i) => i.balanceDue > 0)
                      .map((invoice) => (
                        <SelectItem
                          key={invoice.id}
                          value={invoice.id.toString()}
                        >
                          {invoice.invoiceNumber} - {invoice.customer.name} -{" "}
                          {formatCurrency(invoice.balanceDue)} due
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formErrors.invoiceId && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.invoiceId}
                  </p>
                )}
              </div>

              <div>
                <Label>Customer</Label>
                <Input
                  value={
                    customers.find((c) => c.id === formData.customerId)?.name ||
                    ""
                  }
                  disabled
                  className="mt-1 bg-muted"
                />
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
            <Button onClick={handleCreatePayment}>Record Payment</Button>
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
                  <p>Customer: {selectedPayment.customer.name}</p>
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

      {/* Refund Payment Dialog */}
      <AlertDialog
        open={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to refund this payment? This action cannot
              be undone.
              {selectedPayment && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedPayment.paymentNumber}</p>
                  <p>Amount: {formatCurrency(selectedPayment.amount)}</p>
                  <p>Customer: {selectedPayment.customer.name}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefundPayment}
              className="bg-red-600 hover:bg-red-700"
            >
              Refund Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
