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
  User,
  Building2,
  Receipt,
  FileText,
  AlertCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Printer,
  Calculator,
  Landmark,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Copy,
  Flag,
  PieChart,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Types
type TransactionType =
  | "disbursement"
  | "replenishment"
  | "receipt"
  | "adjustment";
type TransactionCategory =
  | "office_supplies"
  | "cleaning"
  | "transport"
  | "entertainment"
  | "medical"
  | "maintenance"
  | "software"
  | "stationery"
  | "staff_welfare"
  | "other";
type ApprovalStatus = "pending" | "approved" | "rejected";

interface PettyCashTransaction {
  id: number;
  transactionNumber: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  balance: number;
  requester?: {
    id: number;
    name: string;
    department: string;
  };
  approvedBy?: string;
  approvedDate?: string;
  receivedBy?: string;
  receiptNumber?: string;
  vendor?: string;
  notes?: string;
  status: ApprovalStatus;
  createdAt: string;
  createdBy: string;
}

interface PettyCashFund {
  id: number;
  fundName: string;
  currentBalance: number;
  initialBalance: number;
  totalDisbursements: number;
  totalReplenishments: number;
  lastReconciliation: string;
  nextReconciliation: string;
  custodian: string;
  custodianEmail: string;
  location: string;
  status: "active" | "frozen" | "closed";
}

// Mock Data
const mockTransactions: PettyCashTransaction[] = [
  {
    id: 1,
    transactionNumber: "PCT-2026-0001",
    date: "2026-03-01",
    type: "disbursement",
    category: "office_supplies",
    description: "Printer paper and toner",
    amount: 25000,
    balance: 225000,
    requester: { id: 101, name: "John Smith", department: "Marketing" },
    approvedBy: "Jane Manager",
    approvedDate: "2026-03-01T10:30:00",
    receivedBy: "John Smith",
    receiptNumber: "RC-2026-045",
    vendor: "Office Depot",
    status: "approved",
    createdAt: "2026-03-01T09:00:00",
    createdBy: "John Smith",
  },
  {
    id: 2,
    transactionNumber: "PCT-2026-0002",
    date: "2026-03-02",
    type: "disbursement",
    category: "transport",
    description: "Taxi to client meeting",
    amount: 8000,
    balance: 217000,
    requester: { id: 102, name: "Alice Johnson", department: "Sales" },
    approvedBy: "Sales Manager",
    approvedDate: "2026-03-02T14:00:00",
    receivedBy: "Alice Johnson",
    receiptNumber: "TX-2026-123",
    vendor: "Uber",
    status: "approved",
    createdAt: "2026-03-02T11:00:00",
    createdBy: "Alice Johnson",
  },
  {
    id: 3,
    transactionNumber: "PCT-2026-0003",
    date: "2026-03-03",
    type: "disbursement",
    category: "entertainment",
    description: "Client lunch",
    amount: 45000,
    balance: 172000,
    requester: { id: 103, name: "Bob Williams", department: "Sales" },
    approvedBy: "Sales Director",
    approvedDate: "2026-03-03T09:30:00",
    receivedBy: "Bob Williams",
    receiptNumber: "INV-2026-789",
    vendor: "The Grand Hotel",
    status: "approved",
    createdAt: "2026-03-03T08:00:00",
    createdBy: "Bob Williams",
  },
  {
    id: 4,
    transactionNumber: "PCT-2026-0004",
    date: "2026-03-04",
    type: "replenishment",
    category: "office_supplies",
    description: "Petty cash replenishment",
    amount: 100000,
    balance: 272000,
    receivedBy: "Cashier",
    vendor: "Bank",
    status: "approved",
    createdAt: "2026-03-04T10:00:00",
    createdBy: "Finance Officer",
  },
  {
    id: 5,
    transactionNumber: "PCT-2026-0005",
    date: "2026-03-05",
    type: "disbursement",
    category: "medical",
    description: "First aid kit supplies",
    amount: 25000,
    balance: 247000,
    requester: { id: 104, name: "Carol Davis", department: "HR" },
    approvedBy: "HR Manager",
    approvedDate: "2026-03-05T11:00:00",
    receivedBy: "Carol Davis",
    receiptNumber: "RX-2026-345",
    vendor: "Pharmacy Plus",
    status: "approved",
    createdAt: "2026-03-05T09:00:00",
    createdBy: "Carol Davis",
  },
  {
    id: 6,
    transactionNumber: "PCT-2026-0006",
    date: "2026-03-06",
    type: "disbursement",
    category: "maintenance",
    description: "AC repair",
    amount: 35000,
    balance: 212000,
    requester: { id: 105, name: "David Brown", department: "Operations" },
    approvedBy: "Ops Manager",
    approvedDate: "2026-03-06T15:00:00",
    receivedBy: "David Brown",
    receiptNumber: "SR-2026-567",
    vendor: "CoolTech Services",
    status: "approved",
    createdAt: "2026-03-06T13:00:00",
    createdBy: "David Brown",
  },
  {
    id: 7,
    transactionNumber: "PCT-2026-0007",
    date: "2026-03-07",
    type: "disbursement",
    category: "stationery",
    description: "Notebooks and pens",
    amount: 15000,
    balance: 197000,
    requester: { id: 106, name: "Emma Wilson", department: "Finance" },
    approvedBy: "Finance Manager",
    approvedDate: "2026-03-07T10:00:00",
    receivedBy: "Emma Wilson",
    receiptNumber: "RC-2026-890",
    vendor: "Stationery World",
    status: "approved",
    createdAt: "2026-03-07T08:30:00",
    createdBy: "Emma Wilson",
  },
  {
    id: 8,
    transactionNumber: "PCT-2026-0008",
    date: "2026-03-08",
    type: "disbursement",
    category: "staff_welfare",
    description: "Team lunch",
    amount: 50000,
    balance: 147000,
    requester: { id: 107, name: "Frank Miller", department: "Engineering" },
    approvedBy: "Tech Lead",
    approvedDate: "2026-03-08T12:00:00",
    receivedBy: "Frank Miller",
    receiptNumber: "INV-2026-234",
    vendor: "Food Hub",
    status: "pending",
    createdAt: "2026-03-08T11:00:00",
    createdBy: "Frank Miller",
  },
  {
    id: 9,
    transactionNumber: "PCT-2026-0009",
    date: "2026-03-09",
    type: "disbursement",
    category: "software",
    description: "Software subscription",
    amount: 20000,
    balance: 127000,
    requester: { id: 108, name: "Grace Lee", department: "IT" },
    approvedBy: "IT Manager",
    approvedDate: "2026-03-09T14:00:00",
    receivedBy: "Grace Lee",
    receiptNumber: "SUB-2026-456",
    vendor: "Microsoft",
    status: "approved",
    createdAt: "2026-03-09T09:00:00",
    createdBy: "Grace Lee",
  },
  {
    id: 10,
    transactionNumber: "PCT-2026-0010",
    date: "2026-03-10",
    type: "replenishment",
    category: "office_supplies",
    description: "Petty cash top-up",
    amount: 150000,
    balance: 277000,
    receivedBy: "Cashier",
    vendor: "Bank",
    status: "approved",
    createdAt: "2026-03-10T11:00:00",
    createdBy: "Finance Officer",
  },
];

const pettyCashFund: PettyCashFund = {
  id: 1,
  fundName: "Main Office Petty Cash",
  currentBalance: 277000,
  initialBalance: 250000,
  totalDisbursements: 198000,
  totalReplenishments: 250000,
  lastReconciliation: "2026-03-01",
  nextReconciliation: "2026-04-01",
  custodian: "Finance Officer",
  custodianEmail: "finance@company.com",
  location: "Head Office - Cashier's Office",
  status: "active",
};

const transactionTypes = [
  { value: "all", label: "All Transactions" },
  { value: "disbursement", label: "Disbursements", icon: TrendingDown },
  { value: "replenishment", label: "Replenishments", icon: TrendingUp },
  { value: "receipt", label: "Receipts", icon: Receipt },
  { value: "adjustment", label: "Adjustments", icon: Calculator },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "cleaning", label: "Cleaning" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "medical", label: "Medical" },
  { value: "maintenance", label: "Maintenance" },
  { value: "software", label: "Software" },
  { value: "stationery", label: "Stationery" },
  { value: "staff_welfare", label: "Staff Welfare" },
  { value: "other", label: "Other" },
];

const departments = [
  "all",
  "Marketing",
  "Sales",
  "IT",
  "HR",
  "Operations",
  "Finance",
  "Engineering",
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

const getTransactionTypeBadge = (type: TransactionType) => {
  const styles = {
    disbursement: "bg-red-100 text-red-700",
    replenishment: "bg-green-100 text-green-700",
    receipt: "bg-blue-100 text-blue-700",
    adjustment: "bg-yellow-100 text-yellow-700",
  };

  const labels = {
    disbursement: "Disbursement",
    replenishment: "Replenishment",
    receipt: "Receipt",
    adjustment: "Adjustment",
  };

  return (
    <Badge className={`${styles[type]} flex items-center gap-1 w-fit`}>
      {type === "disbursement" && <TrendingDown className="h-3 w-3" />}
      {type === "replenishment" && <TrendingUp className="h-3 w-3" />}
      {type === "receipt" && <Receipt className="h-3 w-3" />}
      {type === "adjustment" && <Calculator className="h-3 w-3" />}
      {labels[type]}
    </Badge>
  );
};

const getCategoryLabel = (category: TransactionCategory) => {
  return categories.find((c) => c.value === category)?.label || category;
};

const getStatusBadge = (status: ApprovalStatus) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <Badge className={`${styles[status]} flex items-center gap-1 w-fit`}>
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "approved" && <CheckCircle className="h-3 w-3" />}
      {status === "rejected" && <XCircle className="h-3 w-3" />}
      {labels[status]}
    </Badge>
  );
};

export default function PettyCashRegister() {
  const router = useRouter();

  // State
  const [transactions, setTransactions] =
    useState<PettyCashTransaction[]>(mockTransactions);
  const [fund, setFund] = useState<PettyCashFund>(pettyCashFund);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PettyCashTransaction;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PettyCashTransaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"register" | "analytics">(
    "register",
  );

  // Form state
  const [formData, setFormData] = useState({
    type: "disbursement" as TransactionType,
    category: "office_supplies" as TransactionCategory,
    description: "",
    amount: 0,
    requesterName: "",
    requesterDepartment: "",
    receiptNumber: "",
    vendor: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Chart data
  const categoryChartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "disbursement" && t.status === "approved")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: getCategoryLabel(name as TransactionCategory),
      value,
    }));
  }, [transactions]);

  const monthlyTrendData = useMemo(() => {
    const monthlyData: Record<
      string,
      { disbursements: number; replenishments: number }
    > = {};
    transactions.forEach((t) => {
      const month = formatDate(t.date).slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { disbursements: 0, replenishments: 0 };
      }
      if (t.type === "disbursement" && t.status === "approved") {
        monthlyData[month].disbursements += t.amount;
      } else if (t.type === "replenishment") {
        monthlyData[month].replenishments += t.amount;
      }
    });
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [transactions]);

  const departmentChartData = useMemo(() => {
    const deptTotals: Record<string, number> = {};
    transactions
      .filter(
        (t) =>
          t.type === "disbursement" && t.status === "approved" && t.requester,
      )
      .forEach((t) => {
        if (t.requester) {
          deptTotals[t.requester.department] =
            (deptTotals[t.requester.department] || 0) + t.amount;
        }
      });
    return Object.entries(deptTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
  ];

  // Filter and sort
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionNumber.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.receiptNumber?.toLowerCase().includes(query) ||
          t.requester?.name.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter(
        (t) => t.requester?.department === departmentFilter,
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (dateRange.from) {
      result = result.filter((t) => t.date >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((t) => t.date <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue =
          sortConfig.key === "date"
            ? new Date(a.date).getTime()
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === "date"
            ? new Date(b.date).getTime()
            : b[sortConfig.key];

        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }

    return result;
  }, [
    transactions,
    searchQuery,
    typeFilter,
    categoryFilter,
    departmentFilter,
    statusFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Statistics
  const stats = useMemo(() => {
    const totalDisbursements = transactions
      .filter((t) => t.type === "disbursement" && t.status === "approved")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalReplenishments = transactions
      .filter((t) => t.type === "replenishment")
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transactions.filter(
      (t) => t.status === "pending",
    ).length;
    const monthlyAvg = totalDisbursements / 3; // Approximate based on 3 months

    return {
      totalDisbursements,
      totalReplenishments,
      pendingCount,
      monthlyAvg,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  // Handlers
  const handleSort = (key: keyof PettyCashTransaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewTransaction = (transaction: PettyCashTransaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleEditTransaction = (transaction: PettyCashTransaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      requesterName: transaction.requester?.name || "",
      requesterDepartment: transaction.requester?.department || "",
      receiptNumber: transaction.receiptNumber || "",
      vendor: transaction.vendor || "",
      notes: transaction.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.description) errors.description = "Description is required";
    if (formData.amount <= 0) errors.amount = "Amount must be greater than 0";
    if (formData.type === "disbursement" && !formData.requesterName) {
      errors.requesterName = "Requester name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTransaction = () => {
    if (!validateForm()) return;

    let runningBalance = fund.currentBalance;
    let newBalance = runningBalance;

    if (formData.type === "disbursement") {
      newBalance = runningBalance - formData.amount;
    } else if (formData.type === "replenishment") {
      newBalance = runningBalance + formData.amount;
    }

    const newTransaction: PettyCashTransaction = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      transactionNumber: `PCT-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(4, "0")}`,
      date: new Date().toISOString().split("T")[0],
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      balance: newBalance,
      requester:
        formData.type === "disbursement"
          ? {
              id: Date.now(),
              name: formData.requesterName,
              department: formData.requesterDepartment,
            }
          : undefined,
      receiptNumber: formData.receiptNumber,
      vendor: formData.vendor,
      notes: formData.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setFund((prev) => ({
      ...prev,
      currentBalance: newBalance,
      totalDisbursements:
        prev.totalDisbursements +
        (formData.type === "disbursement" ? formData.amount : 0),
      totalReplenishments:
        prev.totalReplenishments +
        (formData.type === "replenishment" ? formData.amount : 0),
    }));
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateTransaction = () => {
    if (!validateForm() || !selectedTransaction) return;

    const updatedTransaction: PettyCashTransaction = {
      ...selectedTransaction,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      requester:
        formData.type === "disbursement"
          ? {
              id: selectedTransaction.requester?.id || Date.now(),
              name: formData.requesterName,
              department: formData.requesterDepartment,
            }
          : undefined,
      receiptNumber: formData.receiptNumber,
      vendor: formData.vendor,
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

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;

    // Adjust fund balance if deleting an approved transaction
    if (selectedTransaction.status === "approved") {
      if (selectedTransaction.type === "disbursement") {
        setFund((prev) => ({
          ...prev,
          currentBalance: prev.currentBalance + selectedTransaction.amount,
          totalDisbursements:
            prev.totalDisbursements - selectedTransaction.amount,
        }));
      } else if (selectedTransaction.type === "replenishment") {
        setFund((prev) => ({
          ...prev,
          currentBalance: prev.currentBalance - selectedTransaction.amount,
          totalReplenishments:
            prev.totalReplenishments - selectedTransaction.amount,
        }));
      }
    }

    setTransactions((prev) =>
      prev.filter((t) => t.id !== selectedTransaction.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleApproveTransaction = (transaction: PettyCashTransaction) => {
    let newBalance = fund.currentBalance;

    if (transaction.type === "disbursement") {
      newBalance = fund.currentBalance - transaction.amount;
    } else if (transaction.type === "replenishment") {
      newBalance = fund.currentBalance + transaction.amount;
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              status: "approved",
              approvedBy: "Current Approver",
              approvedDate: new Date().toISOString(),
              balance: newBalance,
            }
          : t,
      ),
    );

    setFund((prev) => ({
      ...prev,
      currentBalance: newBalance,
      totalDisbursements:
        prev.totalDisbursements +
        (transaction.type === "disbursement" ? transaction.amount : 0),
      totalReplenishments:
        prev.totalReplenishments +
        (transaction.type === "replenishment" ? transaction.amount : 0),
    }));
  };

  const handleRejectTransaction = (transaction: PettyCashTransaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id ? { ...t, status: "rejected" } : t,
      ),
    );
  };

  const resetForm = () => {
    setFormData({
      type: "disbursement",
      category: "office_supplies",
      description: "",
      amount: 0,
      requesterName: "",
      requesterDepartment: "",
      receiptNumber: "",
      vendor: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Transaction #",
      "Date",
      "Type",
      "Category",
      "Description",
      "Amount",
      "Balance",
      "Requester",
      "Department",
      "Status",
    ];
    const csvData = filteredTransactions.map((t) => [
      t.transactionNumber,
      formatDate(t.date),
      t.type,
      getCategoryLabel(t.category),
      t.description,
      t.amount.toString(),
      t.balance.toString(),
      t.requester?.name || "",
      t.requester?.department || "",
      t.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `petty-cash-register-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setTransactions([...mockTransactions]);
    setFund(pettyCashFund);
    setCurrentPage(1);
    setSearchQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setDateRange({ from: "", to: "" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Petty Cash Register
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all petty cash transactions and balances
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Petty Cash Balance Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(fund.currentBalance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fund: {fund.fundName} | Custodian: {fund.custodian}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Initial Balance</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(fund.initialBalance)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Total Disbursements
                </p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(fund.totalDisbursements)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Total Replenishments
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(fund.totalReplenishments)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Next Reconciliation
              </p>
              <p className="font-semibold">
                {formatDate(fund.nextReconciliation)}
              </p>
              <Badge className="mt-1 bg-green-100 text-green-700">
                {fund.status === "active"
                  ? "Active"
                  : fund.status === "frozen"
                    ? "Frozen"
                    : "Closed"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Disbursements
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalDisbursements)}
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
                <p className="text-sm text-muted-foreground">
                  Total Replenishments
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalReplenishments)}
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Avg</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.monthlyAvg)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
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
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="register">Cash Register</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by #, description, requester..."
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
                  value={categoryFilter}
                  onValueChange={(v) => {
                    setCategoryFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={departmentFilter}
                  onValueChange={(v) => {
                    setDepartmentFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === "all" ? "All Depts" : dept}
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
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Receipt className="h-12 w-12 text-muted-foreground/30" />
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
                          <TableCell>
                            {getCategoryLabel(transaction.category)}
                          </TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={transaction.description}
                          >
                            {transaction.description}
                          </TableCell>
                          <TableCell
                            className={`font-medium ${transaction.type === "disbursement" ? "text-red-600" : "text-green-600"}`}
                          >
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.requester?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleViewTransaction(transaction)
                                }
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
                                    onClick={() =>
                                      handleApproveTransaction(transaction)
                                    }
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRejectTransaction(transaction)
                                    }
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenses by Category</CardTitle>
                <CardDescription>
                  Distribution of disbursements by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Expenses by Department
                </CardTitle>
                <CardDescription>
                  Disbursements by requesting department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Trend</CardTitle>
                <CardDescription>
                  Disbursements vs Replenishments over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="disbursements"
                      stroke="#ff6b6b"
                      name="Disbursements"
                    />
                    <Line
                      type="monotone"
                      dataKey="replenishments"
                      stroke="#51cf66"
                      name="Replenishments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{getCategoryLabel(selectedTransaction.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p
                    className={`text-2xl font-bold ${selectedTransaction.type === "disbursement" ? "text-red-600" : "text-green-600"}`}
                  >
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedTransaction.description}</p>
                </div>
              </div>

              {selectedTransaction.requester && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Requester Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{selectedTransaction.requester.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
                      <p>{selectedTransaction.requester.department}</p>
                    </div>
                  </div>
                </div>
              )}

              {(selectedTransaction.receiptNumber ||
                selectedTransaction.vendor) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Receipt Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {selectedTransaction.vendor && (
                      <div>
                        <p className="text-sm text-muted-foreground">Vendor</p>
                        <p>{selectedTransaction.vendor}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

      {/* Create Transaction Modal */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsCreateModalOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogDescription>
              Record a new petty cash transaction
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
                    <SelectItem value="disbursement">
                      Disbursement (Payment Out)
                    </SelectItem>
                    <SelectItem value="replenishment">
                      Replenishment (Top Up)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.value !== "all")
                      .map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Brief description of the transaction"
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.description}
                  </p>
                )}
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
              {formData.type === "disbursement" && (
                <>
                  <div>
                    <Label>Requester Name *</Label>
                    <Input
                      value={formData.requesterName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          requesterName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Full name"
                    />
                    {formErrors.requesterName && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.requesterName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select
                      value={formData.requesterDepartment}
                      onValueChange={(v) =>
                        setFormData((prev) => ({
                          ...prev,
                          requesterDepartment: v,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments
                          .filter((d) => d !== "all")
                          .map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
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
              <div>
                <Label>Vendor</Label>
                <Input
                  value={formData.vendor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vendor: e.target.value }))
                  }
                  className="mt-1"
                  placeholder="Vendor/supplier name"
                />
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
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTransaction}>
              Create Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
