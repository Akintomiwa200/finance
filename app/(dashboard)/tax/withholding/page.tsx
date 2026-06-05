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
  FileText,
  DollarSign,
  Calendar,
  Building2,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Receipt,
  Send,
  Printer,
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Percent,
  Users,
  Briefcase,
  Package,
  HardHat,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type WhtType =
  | "goods"
  | "services"
  | "rent"
  | "construction"
  | "consultancy"
  | "dividends"
  | "interest";
type WhtStatus = "pending" | "approved" | "remitted" | "exempt";
type PaymentStatus = "unpaid" | "paid";

interface WithholdingTax {
  id: number;
  whtNumber: string;
  invoiceNumber: string;
  date: string;
  supplier: {
    id: number;
    name: string;
    tin: string;
    address: string;
  };
  transactionType: WhtType;
  grossAmount: number;
  whtRate: number;
  whtAmount: number;
  status: WhtStatus;
  paymentStatus: PaymentStatus;
  dueDate: string;
  paymentDate?: string;
  paymentReference?: string;
  certificateNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Suppliers
const mockSuppliers = [
  { id: 1, name: "Tech Solutions Ltd", tin: "12345678-0001", address: "Lagos" },
  {
    id: 2,
    name: "Office Depot Nigeria",
    tin: "87654321-0002",
    address: "Ikeja",
  },
  {
    id: 3,
    name: "Consulting Partners",
    tin: "11223344-0003",
    address: "Victoria Island",
  },
  {
    id: 4,
    name: "Construction Co Ltd",
    tin: "44332211-0004",
    address: "Abuja",
  },
  { id: 5, name: "Property Managers", tin: "55667788-0005", address: "Lekki" },
];

// Mock WHT Data
const mockWhtTransactions: WithholdingTax[] = [
  {
    id: 1,
    whtNumber: "WHT-2026-001",
    invoiceNumber: "INV-2026-001",
    date: "2026-02-15",
    supplier: mockSuppliers[0],
    transactionType: "services",
    grossAmount: 2500000,
    whtRate: 10,
    whtAmount: 250000,
    status: "remitted",
    paymentStatus: "paid",
    dueDate: "2026-03-15",
    paymentDate: "2026-03-10",
    paymentReference: "WHT-PAY-001",
    certificateNumber: "WHT-CERT-2026-001",
    notes: "IT consulting services",
    createdBy: "John Smith",
    createdAt: "2026-02-15T09:00:00",
    updatedAt: "2026-03-10T14:00:00",
  },
  {
    id: 2,
    whtNumber: "WHT-2026-002",
    invoiceNumber: "INV-2026-002",
    date: "2026-02-20",
    supplier: mockSuppliers[1],
    transactionType: "goods",
    grossAmount: 1500000,
    whtRate: 5,
    whtAmount: 75000,
    status: "approved",
    paymentStatus: "unpaid",
    dueDate: "2026-03-20",
    notes: "Office supplies purchase",
    createdBy: "Alice Johnson",
    createdAt: "2026-02-20T11:00:00",
    updatedAt: "2026-02-20T11:00:00",
  },
  {
    id: 3,
    whtNumber: "WHT-2026-003",
    invoiceNumber: "INV-2026-003",
    date: "2026-03-01",
    supplier: mockSuppliers[2],
    transactionType: "consultancy",
    grossAmount: 3500000,
    whtRate: 10,
    whtAmount: 350000,
    status: "pending",
    paymentStatus: "unpaid",
    dueDate: "2026-03-31",
    notes: "Management consulting",
    createdBy: "Bob Williams",
    createdAt: "2026-03-01T14:00:00",
    updatedAt: "2026-03-01T14:00:00",
  },
  {
    id: 4,
    whtNumber: "WHT-2026-004",
    invoiceNumber: "INV-2026-004",
    date: "2026-03-05",
    supplier: mockSuppliers[3],
    transactionType: "construction",
    grossAmount: 5000000,
    whtRate: 5,
    whtAmount: 250000,
    status: "approved",
    paymentStatus: "unpaid",
    dueDate: "2026-04-04",
    notes: "Office renovation",
    createdBy: "Carol Davis",
    createdAt: "2026-03-05T10:00:00",
    updatedAt: "2026-03-05T10:00:00",
  },
  {
    id: 5,
    whtNumber: "WHT-2026-005",
    invoiceNumber: "INV-2026-005",
    date: "2026-03-10",
    supplier: mockSuppliers[4],
    transactionType: "rent",
    grossAmount: 1200000,
    whtRate: 10,
    whtAmount: 120000,
    status: "exempt",
    paymentStatus: "paid",
    dueDate: "2026-04-09",
    paymentDate: "2026-03-10",
    notes: "Rent payment - exempted",
    createdBy: "David Brown",
    createdAt: "2026-03-10T09:00:00",
    updatedAt: "2026-03-10T09:00:00",
  },
];

const transactionTypes = [
  { value: "goods", label: "Goods", rate: 5, icon: Package },
  { value: "services", label: "Services", rate: 10, icon: Briefcase },
  { value: "rent", label: "Rent", rate: 10, icon: Building2 },
  { value: "construction", label: "Construction", rate: 5, icon: HardHat },
  { value: "consultancy", label: "Consultancy", rate: 10, icon: Users },
  { value: "dividends", label: "Dividends", rate: 10, icon: TrendingUp },
  { value: "interest", label: "Interest", rate: 10, icon: DollarSign },
];

const statuses = [
  { value: "all", label: "All Status" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  {
    value: "remitted",
    label: "Remitted",
    color: "bg-green-100 text-green-700",
  },
  { value: "exempt", label: "Exempt", color: "bg-gray-100 text-gray-700" },
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

const getStatusBadge = (status: WhtStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    approved: <CheckCircle className="h-3 w-3 mr-1" />,
    remitted: <Send className="h-3 w-3 mr-1" />,
    exempt: <CheckCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getTransactionTypeLabel = (type: WhtType) => {
  return transactionTypes.find((t) => t.value === type)?.label || type;
};

export default function WithholdingTax() {
  const router = useRouter();

  // State
  const [whtTransactions, setWhtTransactions] =
    useState<WithholdingTax[]>(mockWhtTransactions);
  const [suppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof WithholdingTax;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedWht, setSelectedWht] = useState<WithholdingTax | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRemitDialogOpen, setIsRemitDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"wht" | "summary">("wht");

  // Form state
  const [formData, setFormData] = useState({
    supplierId: 0,
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    transactionType: "services" as WhtType,
    grossAmount: 0,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentReference, setPaymentReference] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const totalWht = whtTransactions.length;
    const totalAmount = whtTransactions.reduce(
      (sum, w) => sum + w.whtAmount,
      0,
    );
    const remittedAmount = whtTransactions
      .filter((w) => w.status === "remitted")
      .reduce((sum, w) => sum + w.whtAmount, 0);
    const pendingAmount = whtTransactions
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.whtAmount, 0);
    const pendingCount = whtTransactions.filter(
      (w) => w.status === "pending",
    ).length;
    const approvedCount = whtTransactions.filter(
      (w) => w.status === "approved",
    ).length;

    const byType: Record<string, number> = {};
    whtTransactions.forEach((w) => {
      byType[w.transactionType] =
        (byType[w.transactionType] || 0) + w.whtAmount;
    });

    return {
      totalWht,
      totalAmount,
      remittedAmount,
      pendingAmount,
      pendingCount,
      approvedCount,
      byType,
      complianceRate: totalWht > 0 ? (remittedAmount / totalAmount) * 100 : 0,
    };
  }, [whtTransactions]);

  // Filter and sort
  const filteredWht = useMemo(() => {
    let result = [...whtTransactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.whtNumber.toLowerCase().includes(query) ||
          w.supplier.name.toLowerCase().includes(query) ||
          w.supplier.tin.toLowerCase().includes(query) ||
          w.invoiceNumber.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((w) => w.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((w) => w.transactionType === typeFilter);
    }

    if (dateRange.from) {
      result = result.filter((w) => w.date >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((w) => w.date <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "date" || sortConfig.key === "dueDate") {
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
    whtTransactions,
    searchQuery,
    statusFilter,
    typeFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredWht.length / itemsPerPage);
  const paginatedWht = filteredWht.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate WHT amount based on type and gross amount
  const calculateWhtAmount = (type: WhtType, amount: number): number => {
    const rate = transactionTypes.find((t) => t.value === type)?.rate || 0;
    return amount * (rate / 100);
  };

  const selectedType = formData.transactionType;
  const calculatedWhtAmount = calculateWhtAmount(
    selectedType,
    formData.grossAmount,
  );
  const netAmount = formData.grossAmount - calculatedWhtAmount;

  // Handlers
  const handleSort = (key: keyof WithholdingTax) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewWht = (wht: WithholdingTax) => {
    setSelectedWht(wht);
    setIsViewModalOpen(true);
  };

  const handleEditWht = (wht: WithholdingTax) => {
    setSelectedWht(wht);
    setFormData({
      supplierId: wht.supplier.id,
      invoiceNumber: wht.invoiceNumber,
      date: wht.date,
      transactionType: wht.transactionType,
      grossAmount: wht.grossAmount,
      notes: wht.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.supplierId) errors.supplierId = "Please select a supplier";
    if (!formData.invoiceNumber)
      errors.invoiceNumber = "Invoice number is required";
    if (!formData.date) errors.date = "Date is required";
    if (formData.grossAmount <= 0)
      errors.grossAmount = "Gross amount must be greater than 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateWht = () => {
    if (!validateForm()) return;

    const selectedSupplier = suppliers.find(
      (s) => s.id === formData.supplierId,
    );
    const whtRate =
      transactionTypes.find((t) => t.value === formData.transactionType)
        ?.rate || 0;
    const whtAmount = calculateWhtAmount(
      formData.transactionType,
      formData.grossAmount,
    );

    const dueDate = new Date(formData.date);
    dueDate.setDate(dueDate.getDate() + 30);

    const newWht: WithholdingTax = {
      id: Math.max(...whtTransactions.map((w) => w.id), 0) + 1,
      whtNumber: `WHT-${new Date().getFullYear()}-${String(whtTransactions.length + 1).padStart(3, "0")}`,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      supplier: selectedSupplier!,
      transactionType: formData.transactionType,
      grossAmount: formData.grossAmount,
      whtRate,
      whtAmount,
      status: "pending",
      paymentStatus: "unpaid",
      dueDate: dueDate.toISOString().split("T")[0],
      notes: formData.notes,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWhtTransactions((prev) => [newWht, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateWht = () => {
    if (!validateForm() || !selectedWht) return;

    const selectedSupplier = suppliers.find(
      (s) => s.id === formData.supplierId,
    );
    const whtRate =
      transactionTypes.find((t) => t.value === formData.transactionType)
        ?.rate || 0;
    const whtAmount = calculateWhtAmount(
      formData.transactionType,
      formData.grossAmount,
    );

    const updatedWht: WithholdingTax = {
      ...selectedWht,
      supplier: selectedSupplier!,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      transactionType: formData.transactionType,
      grossAmount: formData.grossAmount,
      whtRate,
      whtAmount,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setWhtTransactions((prev) =>
      prev.map((w) => (w.id === selectedWht.id ? updatedWht : w)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedWht(null);
  };

  const handleApproveWht = () => {
    if (!selectedWht) return;

    setWhtTransactions((prev) =>
      prev.map((w) =>
        w.id === selectedWht.id
          ? {
              ...w,
              status: "approved",
              updatedAt: new Date().toISOString(),
            }
          : w,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedWht(null);
  };

  const handleRemitWht = () => {
    if (!selectedWht) return;

    setWhtTransactions((prev) =>
      prev.map((w) =>
        w.id === selectedWht.id
          ? {
              ...w,
              status: "remitted",
              paymentStatus: "paid",
              paymentDate: new Date().toISOString().split("T")[0],
              paymentReference,
              certificateNumber,
              updatedAt: new Date().toISOString(),
            }
          : w,
      ),
    );
    setIsRemitDialogOpen(false);
    setSelectedWht(null);
    setPaymentReference("");
    setCertificateNumber("");
  };

  const handleDeleteWht = () => {
    if (!selectedWht) return;
    setWhtTransactions((prev) => prev.filter((w) => w.id !== selectedWht.id));
    setIsDeleteDialogOpen(false);
    setSelectedWht(null);
  };

  const resetForm = () => {
    setFormData({
      supplierId: 0,
      invoiceNumber: "",
      date: new Date().toISOString().split("T")[0],
      transactionType: "services",
      grossAmount: 0,
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "WHT #",
      "Date",
      "Supplier",
      "TIN",
      "Invoice #",
      "Type",
      "Gross Amount",
      "Rate",
      "WHT Amount",
      "Status",
      "Due Date",
    ];
    const csvData = filteredWht.map((w) => [
      w.whtNumber,
      formatDate(w.date),
      w.supplier.name,
      w.supplier.tin,
      w.invoiceNumber,
      getTransactionTypeLabel(w.transactionType),
      w.grossAmount.toString(),
      `${w.whtRate}%`,
      w.whtAmount.toString(),
      w.status,
      formatDate(w.dueDate),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `withholding-tax-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setWhtTransactions([...mockWhtTransactions]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
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
              <Percent className="h-6 w-6" />
              Withholding Tax
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage withholding tax calculations and remittances
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
            New WHT
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total WHT Amount
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Remitted to FIRS
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.remittedAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Send className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Remittance
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.pendingAmount)}
                </p>
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
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.complianceRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by WHT #, supplier, invoice..."
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
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label} ({type.rate}%)
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

      {/* WHT Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("whtNumber")}
                    >
                      WHT #
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
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead className="text-right">Gross Amount</TableHead>
                  <TableHead className="text-right">WHT Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWht.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Percent className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No withholding tax records found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWht.map((wht) => (
                    <TableRow key={wht.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {wht.whtNumber}
                      </TableCell>
                      <TableCell>{formatDate(wht.date)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {wht.supplier.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            TIN: {wht.supplier.tin}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeLabel(wht.transactionType)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {wht.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(wht.grossAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(wht.whtAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(wht.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewWht(wht)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {wht.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditWht(wht)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWht(wht);
                                  setIsApproveDialogOpen(true);
                                }}
                                className="text-blue-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {wht.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedWht(wht);
                                setIsRemitDialogOpen(true);
                              }}
                              className="text-green-600"
                            >
                              <Send className="h-4 w-4" />
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

          {/* Pagination */}
          {filteredWht.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredWht.length)} of{" "}
                  {filteredWht.length}
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

      {/* View WHT Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Withholding Tax Details</span>
              {selectedWht && getStatusBadge(selectedWht.status)}
            </DialogTitle>
            <DialogDescription>{selectedWht?.whtNumber}</DialogDescription>
          </DialogHeader>
          {selectedWht && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{formatDate(selectedWht.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p
                    className={
                      new Date(selectedWht.dueDate) < new Date()
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {formatDate(selectedWht.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedWht.supplier.name}</p>
                  <p className="text-xs text-muted-foreground">
                    TIN: {selectedWht.supplier.tin}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-mono text-sm">
                    {selectedWht.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Transaction Type
                  </p>
                  <p>{getTransactionTypeLabel(selectedWht.transactionType)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WHT Rate</p>
                  <p>{selectedWht.whtRate}%</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Financial Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Gross Amount
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedWht.grossAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">WHT Rate</p>
                    <p className="text-lg font-bold">{selectedWht.whtRate}%</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">WHT Amount</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(selectedWht.whtAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Net Payment</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(
                        selectedWht.grossAmount - selectedWht.whtAmount,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {selectedWht.paymentReference && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Remittance Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Reference
                      </p>
                      <p className="font-mono text-sm">
                        {selectedWht.paymentReference}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Certificate Number
                      </p>
                      <p className="font-mono text-sm">
                        {selectedWht.certificateNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Date
                      </p>
                      <p>{formatDate(selectedWht.paymentDate!)}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedWht.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedWht.notes}</p>
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

      {/* Create/Edit WHT Modal */}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen
                ? "Create Withholding Tax"
                : "Edit Withholding Tax"}
            </DialogTitle>
            <DialogDescription>Enter withholding tax details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Supplier *</Label>
              <Select
                value={formData.supplierId?.toString() || ""}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, supplierId: parseInt(v) }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.id}
                      value={supplier.id.toString()}
                    >
                      {supplier.name} (TIN: {supplier.tin})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.supplierId && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.supplierId}
                </p>
              )}
            </div>

            <div>
              <Label>Invoice Number *</Label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="INV-001"
              />
              {formErrors.invoiceNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.invoiceNumber}
                </p>
              )}
            </div>

            <div>
              <Label>Transaction Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="mt-1"
              />
              {formErrors.date && (
                <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>
              )}
            </div>

            <div>
              <Label>Transaction Type *</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(v: any) =>
                  setFormData((prev) => ({ ...prev, transactionType: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({type.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gross Amount (₦) *</Label>
              <Input
                type="number"
                value={formData.grossAmount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    grossAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                placeholder="0"
              />
              {formErrors.grossAmount && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.grossAmount}
                </p>
              )}
            </div>

            {/* WHT Calculation Preview */}
            {formData.grossAmount > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">WHT Calculation</h3>
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Gross Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(formData.grossAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      WHT Rate (
                      {selectedType === "goods"
                        ? "5%"
                        : selectedType === "construction"
                          ? "5%"
                          : "10%"}
                      ):
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculatedWhtAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="font-semibold">
                      Net Payment to Supplier:
                    </span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(netAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={2}
                placeholder="Additional notes..."
              />
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
              onClick={isCreateModalOpen ? handleCreateWht : handleUpdateWht}
            >
              {isCreateModalOpen ? "Create WHT" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve WHT Deduction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this withholding tax?
              {selectedWht && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedWht.whtNumber}</p>
                  <p>Supplier: {selectedWht.supplier.name}</p>
                  <p>Amount: {formatCurrency(selectedWht.whtAmount)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveWht}>
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remit Dialog */}
      <AlertDialog open={isRemitDialogOpen} onOpenChange={setIsRemitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remit Withholding Tax</AlertDialogTitle>
            <AlertDialogDescription>
              Record remittance to tax authority.
              {selectedWht && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedWht.whtNumber}</p>
                  <p>
                    Amount to Remit: {formatCurrency(selectedWht.whtAmount)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Payment Reference *</Label>
              <Input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="mt-1"
                placeholder="FIRS Payment Reference"
              />
            </div>
            <div>
              <Label>WHT Certificate Number</Label>
              <Input
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                className="mt-1"
                placeholder="Certificate number"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPaymentReference("");
                setCertificateNumber("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemitWht}
              disabled={!paymentReference}
            >
              Confirm Remittance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
