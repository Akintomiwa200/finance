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
  Edit,
  Trash2,
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
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  Landmark,
  Receipt,
  FileText,
  Printer,
  Send,
  CreditCard,
  MoreHorizontal,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type TransactionType = "deposit" | "withdrawal";
type TransactionStatus = "pending" | "completed" | "cancelled";
type PaymentMethod = "cash" | "bank_transfer" | "cheque" | "online";

interface CashTransaction {
  id: number;
  transactionNumber: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  reference?: string;
  bankAccount?: {
    id: number;
    name: string;
    accountNumber: string;
  };
  receivedFrom?: string;
  paidTo?: string;
  receiptNumber?: string;
  approvedBy?: string;
  approvedDate?: string;
  processedBy?: string;
  processedDate?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  createdBy: string;
}

// Mock Bank Accounts
const mockBankAccounts = [
  {
    id: 1,
    name: "Company Operating Account",
    accountNumber: "2034567890",
    bank: "First Bank",
  },
  {
    id: 2,
    name: "Company Savings Account",
    accountNumber: "0987654321",
    bank: "GT Bank",
  },
];

// Mock Transactions
const mockTransactions: CashTransaction[] = [
  {
    id: 1,
    transactionNumber: "TXN-2026-0001",
    date: "2026-03-01",
    type: "deposit",
    amount: 2500000,
    description: "Customer payment - Invoice INV-001",
    category: "Sales Revenue",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "TRF-2026-0456",
    bankAccount: mockBankAccounts[0],
    receivedFrom: "Nigerian Breweries PLC",
    receiptNumber: "REC-001",
    approvedBy: "Finance Manager",
    approvedDate: "2026-03-01T10:00:00",
    processedBy: "Cashier",
    processedDate: "2026-03-01T11:00:00",
    notes: "Payment for consulting services",
    createdAt: "2026-03-01T09:00:00",
    createdBy: "John Smith",
  },
  {
    id: 2,
    transactionNumber: "TXN-2026-0002",
    date: "2026-03-05",
    type: "withdrawal",
    amount: 500000,
    description: "Office supplies purchase",
    category: "Office Supplies",
    paymentMethod: "cash",
    status: "completed",
    reference: "CASH-001",
    paidTo: "Office Depot",
    receiptNumber: "RC-2026-045",
    approvedBy: "Department Head",
    approvedDate: "2026-03-05T09:00:00",
    processedBy: "Cashier",
    processedDate: "2026-03-05T10:00:00",
    notes: "Monthly office supplies",
    createdAt: "2026-03-05T08:00:00",
    createdBy: "Alice Johnson",
  },
  {
    id: 3,
    transactionNumber: "TXN-2026-0003",
    date: "2026-03-10",
    type: "deposit",
    amount: 1800000,
    description: "Customer payment - Invoice INV-002",
    category: "Sales Revenue",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "TRF-2026-0789",
    bankAccount: mockBankAccounts[0],
    receivedFrom: "MTN Nigeria",
    receiptNumber: "REC-002",
    approvedBy: "Finance Manager",
    approvedDate: "2026-03-10T14:00:00",
    processedBy: "Cashier",
    processedDate: "2026-03-10T15:00:00",
    createdAt: "2026-03-10T13:00:00",
    createdBy: "John Smith",
  },
  {
    id: 4,
    transactionNumber: "TXN-2026-0004",
    date: "2026-03-15",
    type: "withdrawal",
    amount: 2500000,
    description: "Salary payment - March",
    category: "Payroll",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "SAL-2026-03",
    bankAccount: mockBankAccounts[0],
    paidTo: "Staff Salaries",
    approvedBy: "CEO",
    approvedDate: "2026-03-14T16:00:00",
    processedBy: "Payroll Officer",
    processedDate: "2026-03-15T09:00:00",
    notes: "Monthly salary disbursement",
    createdAt: "2026-03-14T10:00:00",
    createdBy: "HR Manager",
  },
  {
    id: 5,
    transactionNumber: "TXN-2026-0005",
    date: "2026-03-18",
    type: "withdrawal",
    amount: 1200000,
    description: "Office rent payment",
    category: "Rent",
    paymentMethod: "bank_transfer",
    status: "pending",
    reference: "RENT-2026-03",
    bankAccount: mockBankAccounts[0],
    paidTo: "Property Management Ltd",
    notes: "Monthly office rent - awaiting approval",
    createdAt: "2026-03-18T11:00:00",
    createdBy: "Facilities Manager",
  },
  {
    id: 6,
    transactionNumber: "TXN-2026-0006",
    date: "2026-03-20",
    type: "deposit",
    amount: 3200000,
    description: "Customer payment - Invoice INV-003",
    category: "Sales Revenue",
    paymentMethod: "bank_transfer",
    status: "pending",
    reference: "TRF-2026-0901",
    bankAccount: mockBankAccounts[0],
    receivedFrom: "Access Bank Plc",
    notes: "Awaiting confirmation",
    createdAt: "2026-03-20T14:00:00",
    createdBy: "John Smith",
  },
  {
    id: 7,
    transactionNumber: "TXN-2026-0007",
    date: "2026-03-22",
    type: "withdrawal",
    amount: 185000,
    description: "Electricity bill payment",
    category: "Utilities",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "UTIL-2026-03",
    bankAccount: mockBankAccounts[0],
    paidTo: "Power Utility Company",
    receiptNumber: "UTIL-2026-045",
    approvedBy: "Finance Manager",
    approvedDate: "2026-03-22T10:00:00",
    processedBy: "Cashier",
    processedDate: "2026-03-22T11:00:00",
    createdAt: "2026-03-22T09:00:00",
    createdBy: "Facilities Manager",
  },
];

const transactionTypes = [
  { value: "all", label: "All Transactions" },
  { value: "deposit", label: "Deposits", icon: TrendingUp },
  { value: "withdrawal", label: "Withdrawals", icon: TrendingDown },
];

const categories = [
  "Sales Revenue",
  "Office Supplies",
  "Payroll",
  "Rent",
  "Utilities",
  "Equipment",
  "Software",
  "Marketing",
  "Travel",
  "Training",
  "Insurance",
  "Tax",
  "Other",
];

const paymentMethods = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "bank_transfer", label: "Bank Transfer", icon: Landmark },
  { value: "cheque", label: "Cheque", icon: Receipt },
  { value: "online", label: "Online Payment", icon: CreditCard },
];

const statuses = [
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
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
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

const getStatusBadge = (status: TransactionStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    completed: <CheckCircle className="h-3 w-3 mr-1" />,
    cancelled: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getTransactionTypeBadge = (type: TransactionType) => {
  if (type === "deposit") {
    return (
      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        Deposit
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
      <TrendingDown className="h-3 w-3" />
      Withdrawal
    </Badge>
  );
};

export default function CashTransactions() {
  const router = useRouter();

  // State
  const [transactions, setTransactions] =
    useState<CashTransaction[]>(mockTransactions);
  const [bankAccounts] = useState(mockBankAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CashTransaction;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] =
    useState<CashTransaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"transactions" | "summary">(
    "transactions",
  );

  // Form state
  const [formData, setFormData] = useState({
    type: "deposit" as TransactionType,
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
    category: "",
    paymentMethod: "bank_transfer" as PaymentMethod,
    reference: "",
    bankAccountId: 0,
    receivedFrom: "",
    paidTo: "",
    receiptNumber: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalDeposits = transactions
      .filter((t) => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = transactions
      .filter((t) => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transactions.filter(
      (t) => t.status === "pending",
    ).length;
    const netCashFlow = totalDeposits - totalWithdrawals;
    const transactionCount = transactions.length;

    return {
      totalDeposits,
      totalWithdrawals,
      netCashFlow,
      transactionCount,
      pendingCount,
      averageDeposit:
        transactions.filter(
          (t) => t.type === "deposit" && t.status === "completed",
        ).length > 0
          ? totalDeposits /
            transactions.filter(
              (t) => t.type === "deposit" && t.status === "completed",
            ).length
          : 0,
      averageWithdrawal:
        transactions.filter(
          (t) => t.type === "withdrawal" && t.status === "completed",
        ).length > 0
          ? totalWithdrawals /
            transactions.filter(
              (t) => t.type === "withdrawal" && t.status === "completed",
            ).length
          : 0,
    };
  }, [transactions]);

  // Filter and sort
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionNumber.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.reference?.toLowerCase().includes(query) ||
          t.receivedFrom?.toLowerCase().includes(query) ||
          t.paidTo?.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (dateRange.from) {
      result = result.filter((t) => t.date >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((t) => t.date <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "date") {
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
    transactions,
    searchQuery,
    typeFilter,
    statusFilter,
    categoryFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof CashTransaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewTransaction = (transaction: CashTransaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleEditTransaction = (transaction: CashTransaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type,
      date: transaction.date,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      reference: transaction.reference || "",
      bankAccountId: transaction.bankAccount?.id || 0,
      receivedFrom: transaction.receivedFrom || "",
      paidTo: transaction.paidTo || "",
      receiptNumber: transaction.receiptNumber || "",
      notes: transaction.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.description) errors.description = "Description is required";
    if (formData.amount <= 0) errors.amount = "Amount must be greater than 0";
    if (!formData.category) errors.category = "Category is required";
    if (formData.type === "deposit" && !formData.receivedFrom) {
      errors.receivedFrom = "Source of deposit is required";
    }
    if (formData.type === "withdrawal" && !formData.paidTo) {
      errors.paidTo = "Payee is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTransaction = () => {
    if (!validateForm()) return;

    const selectedBank = bankAccounts.find(
      (b) => b.id === formData.bankAccountId,
    );
    const newTransaction: CashTransaction = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      transactionNumber: `TXN-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(4, "0")}`,
      date: formData.date,
      type: formData.type,
      amount: formData.amount,
      description: formData.description,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      status: "pending",
      reference: formData.reference,
      bankAccount: selectedBank,
      receivedFrom: formData.receivedFrom,
      paidTo: formData.paidTo,
      receiptNumber: formData.receiptNumber,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateTransaction = () => {
    if (!validateForm() || !selectedTransaction) return;

    const selectedBank = bankAccounts.find(
      (b) => b.id === formData.bankAccountId,
    );
    const updatedTransaction: CashTransaction = {
      ...selectedTransaction,
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      reference: formData.reference,
      bankAccount: selectedBank,
      receivedFrom: formData.receivedFrom,
      paidTo: formData.paidTo,
      receiptNumber: formData.receiptNumber,
      notes: formData.notes,
    };

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTransaction.id ? updatedTransaction : t,
      ),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmTransaction = () => {
    if (!selectedTransaction) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTransaction.id
          ? {
              ...t,
              status: "completed",
              approvedBy: "Current Approver",
              approvedDate: new Date().toISOString(),
              processedBy: "Processor",
              processedDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
    setIsConfirmDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;
    setTransactions((prev) =>
      prev.filter((t) => t.id !== selectedTransaction.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const resetForm = () => {
    setFormData({
      type: "deposit",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      description: "",
      category: "",
      paymentMethod: "bank_transfer",
      reference: "",
      bankAccountId: 0,
      receivedFrom: "",
      paidTo: "",
      receiptNumber: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Transaction #",
      "Date",
      "Type",
      "Description",
      "Category",
      "Amount",
      "Status",
      "Reference",
    ];
    const csvData = filteredTransactions.map((t) => [
      t.transactionNumber,
      formatDate(t.date),
      t.type,
      t.description,
      t.category,
      t.amount.toString(),
      t.status,
      t.reference || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cash-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setTransactions([...mockTransactions]);
    setCurrentPage(1);
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
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
              <Wallet className="h-6 w-6" />
              Deposits & Withdrawals
            </h1>
            <p className="text-muted-foreground mt-1">
              Record and track cash transactions
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
            New Transaction
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalDeposits)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Withdrawals
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalWithdrawals)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                <p
                  className={`text-2xl font-bold ${stats.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(stats.netCashFlow))}
                  {stats.netCashFlow >= 0 ? " inflow" : " outflow"}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingCount}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by #, description, reference..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("transactionNumber")}
                    >
                      Transaction #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Wallet className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No transactions found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {transaction.transactionNumber}
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        {getTransactionTypeBadge(transaction.type)}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={transaction.description}
                      >
                        {transaction.description}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell
                        className={`font-medium ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditTransaction(transaction)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setIsConfirmDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
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
          {filteredTransactions.length > 0 && (
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
                    filteredTransactions.length,
                  )}{" "}
                  of {filteredTransactions.length}
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

      {/* View Transaction Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Transaction Details</span>
              {selectedTransaction &&
                getStatusBadge(selectedTransaction.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedTransaction?.transactionNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  {getTransactionTypeBadge(selectedTransaction.type)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedTransaction.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="capitalize">
                    {selectedTransaction.paymentMethod.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-mono text-sm">
                    {selectedTransaction.reference || "-"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedTransaction.description}</p>
                </div>
              </div>

              {selectedTransaction.receivedFrom && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Source Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Received From
                      </p>
                      <p>{selectedTransaction.receivedFrom}</p>
                    </div>
                    {selectedTransaction.receiptNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Receipt Number
                        </p>
                        <p className="font-mono">
                          {selectedTransaction.receiptNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTransaction.paidTo && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Payee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Paid To</p>
                      <p>{selectedTransaction.paidTo}</p>
                    </div>
                    {selectedTransaction.receiptNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Receipt Number
                        </p>
                        <p className="font-mono">
                          {selectedTransaction.receiptNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTransaction.bankAccount && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Bank Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p>{selectedTransaction.bankAccount.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-mono">
                        {selectedTransaction.bankAccount.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval/Processing Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Processing Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Created by {selectedTransaction.createdBy} on{" "}
                      {formatDateTime(selectedTransaction.createdAt)}
                    </span>
                  </div>
                  {selectedTransaction.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        Approved by {selectedTransaction.approvedBy} on{" "}
                        {formatDateTime(selectedTransaction.approvedDate!)}
                      </span>
                    </div>
                  )}
                  {selectedTransaction.processedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="h-4 w-4 text-blue-600" />
                      <span>
                        Processed by {selectedTransaction.processedBy} on{" "}
                        {formatDateTime(selectedTransaction.processedDate!)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedTransaction.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedTransaction.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Transaction Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "New Transaction" : "Edit Transaction"}
            </DialogTitle>
            <DialogDescription>
              Record a deposit or withdrawal transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Transaction Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit (Money In)</SelectItem>
                    <SelectItem value="withdrawal">
                      Withdrawal (Money Out)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Amount (₦) *</Label>
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
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.category}
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
              <div className="md:col-span-2">
                <Label>Description *</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Brief description"
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {formData.type === "deposit" && (
                <>
                  <div>
                    <Label>Received From *</Label>
                    <Input
                      value={formData.receivedFrom}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          receivedFrom: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Customer name or source"
                    />
                    {formErrors.receivedFrom && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.receivedFrom}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Receipt Number</Label>
                    <Input
                      value={formData.receiptNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          receiptNumber: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Receipt/invoice number"
                    />
                  </div>
                </>
              )}

              {formData.type === "withdrawal" && (
                <>
                  <div>
                    <Label>Paid To *</Label>
                    <Input
                      value={formData.paidTo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paidTo: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Payee name"
                    />
                    {formErrors.paidTo && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.paidTo}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Receipt Number</Label>
                    <Input
                      value={formData.receiptNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          receiptNumber: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Receipt/invoice number"
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Bank Account</Label>
                <Select
                  value={formData.bankAccountId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      bankAccountId: parseInt(v),
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {bankAccounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        {account.name} ({account.accountNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="mt-1"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                isCreateModalOpen
                  ? handleCreateTransaction
                  : handleUpdateTransaction
              }
            >
              {isCreateModalOpen ? "Create Transaction" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Transaction Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this transaction?
              {selectedTransaction && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedTransaction.transactionNumber}
                  </p>
                  <p>
                    Type:{" "}
                    {selectedTransaction.type === "deposit"
                      ? "Deposit"
                      : "Withdrawal"}
                  </p>
                  <p>Amount: {formatCurrency(selectedTransaction.amount)}</p>
                  <p>Description: {selectedTransaction.description}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTransaction}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete this transaction? This action cannot be undone.
              {selectedTransaction && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedTransaction.transactionNumber}
                  </p>
                  <p>Amount: {formatCurrency(selectedTransaction.amount)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
