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
  FileCheck,
  AlertTriangle,
  CreditCard,
  Upload,
  Mail,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type TaxType =
  | "vat"
  | "company_income"
  | "withholding"
  | "paye"
  | "edt"
  | "nit";
type TaxPeriod = "monthly" | "quarterly" | "annually" | "bi_annual";
type FilingStatus =
  | "draft"
  | "pending"
  | "submitted"
  | "filed"
  | "overdue"
  | "rejected";
type PaymentStatus = "unpaid" | "partial" | "paid" | "waived";

interface TaxReturn {
  id: number;
  returnNumber: string;
  taxType: TaxType;
  period: TaxPeriod;
  year: number;
  month?: number;
  quarter?: number;
  dueDate: string;
  filingDate?: string;
  status: FilingStatus;
  paymentStatus: PaymentStatus;
  taxableAmount: number;
  taxDue: number;
  penalties: number;
  interest: number;
  totalDue: number;
  amountPaid: number;
  balanceDue: number;
  filingMethod: "online" | "manual" | "agent";
  reference?: string;
  paymentReference?: string;
  remarks?: string;
  attachments?: string[];
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  filedBy?: string;
  filedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Data
const mockTaxReturns: TaxReturn[] = [
  {
    id: 1,
    returnNumber: "VAT-2026-001",
    taxType: "vat",
    period: "monthly",
    year: 2026,
    month: 1,
    dueDate: "2026-02-20",
    filingDate: "2026-02-15",
    status: "filed",
    paymentStatus: "paid",
    taxableAmount: 12500000,
    taxDue: 937500,
    penalties: 0,
    interest: 0,
    totalDue: 937500,
    amountPaid: 937500,
    balanceDue: 0,
    filingMethod: "online",
    reference: "VAT-RET-001",
    paymentReference: "PAY-2026-0456",
    preparedBy: "John Smith",
    reviewedBy: "Jane Manager",
    approvedBy: "Finance Director",
    filedBy: "System",
    filedAt: "2026-02-15T14:30:00",
    createdAt: "2026-02-01T09:00:00",
    updatedAt: "2026-02-15T14:30:00",
  },
  {
    id: 2,
    returnNumber: "CIT-2025-001",
    taxType: "company_income",
    period: "annually",
    year: 2025,
    dueDate: "2026-06-30",
    status: "pending",
    paymentStatus: "unpaid",
    taxableAmount: 125000000,
    taxDue: 31250000,
    penalties: 0,
    interest: 0,
    totalDue: 31250000,
    amountPaid: 0,
    balanceDue: 31250000,
    filingMethod: "agent",
    preparedBy: "External Accountant",
    createdAt: "2026-03-01T10:00:00",
    updatedAt: "2026-03-01T10:00:00",
  },
  {
    id: 3,
    returnNumber: "WHT-2026-001",
    taxType: "withholding",
    period: "monthly",
    year: 2026,
    month: 1,
    dueDate: "2026-02-28",
    filingDate: "2026-02-25",
    status: "filed",
    paymentStatus: "partial",
    taxableAmount: 5000000,
    taxDue: 500000,
    penalties: 25000,
    interest: 5000,
    totalDue: 530000,
    amountPaid: 300000,
    balanceDue: 230000,
    filingMethod: "online",
    reference: "WHT-RET-001",
    paymentReference: "PAY-2026-0789",
    preparedBy: "Alice Johnson",
    reviewedBy: "Tax Manager",
    filedBy: "System",
    filedAt: "2026-02-25T11:00:00",
    createdAt: "2026-02-20T14:00:00",
    updatedAt: "2026-02-25T11:00:00",
  },
  {
    id: 4,
    returnNumber: "PAYE-2026-001",
    taxType: "paye",
    period: "monthly",
    year: 2026,
    month: 1,
    dueDate: "2026-02-10",
    filingDate: "2026-02-05",
    status: "filed",
    paymentStatus: "paid",
    taxableAmount: 15000000,
    taxDue: 2250000,
    penalties: 0,
    interest: 0,
    totalDue: 2250000,
    amountPaid: 2250000,
    balanceDue: 0,
    filingMethod: "online",
    reference: "PAYE-RET-001",
    paymentReference: "PAY-2026-0123",
    preparedBy: "HR Manager",
    reviewedBy: "Finance Manager",
    filedBy: "System",
    filedAt: "2026-02-05T09:00:00",
    createdAt: "2026-02-01T08:00:00",
    updatedAt: "2026-02-05T09:00:00",
  },
  {
    id: 5,
    returnNumber: "VAT-2026-002",
    taxType: "vat",
    period: "monthly",
    year: 2026,
    month: 2,
    dueDate: "2026-03-20",
    status: "overdue",
    paymentStatus: "unpaid",
    taxableAmount: 13800000,
    taxDue: 1035000,
    penalties: 51750,
    interest: 0,
    totalDue: 1086750,
    amountPaid: 0,
    balanceDue: 1086750,
    filingMethod: "online",
    preparedBy: "John Smith",
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-03-01T09:00:00",
    remarks: "Awaiting payment processing",
  },
  {
    id: 6,
    returnNumber: "EDT-2026-001",
    taxType: "edt",
    period: "annually",
    year: 2026,
    dueDate: "2026-03-31",
    status: "draft",
    paymentStatus: "unpaid",
    taxableAmount: 0,
    taxDue: 0,
    penalties: 0,
    interest: 0,
    totalDue: 0,
    amountPaid: 0,
    balanceDue: 0,
    filingMethod: "online",
    preparedBy: "Tax Officer",
    createdAt: "2026-03-10T11:00:00",
    updatedAt: "2026-03-10T11:00:00",
  },
];

const taxTypes = [
  { value: "vat", label: "Value Added Tax (VAT)", rate: "7.5%", icon: Receipt },
  {
    value: "company_income",
    label: "Company Income Tax (CIT)",
    rate: "30%",
    icon: Building2,
  },
  {
    value: "withholding",
    label: "Withholding Tax (WHT)",
    rate: "10%",
    icon: CreditCard,
  },
  {
    value: "paye",
    label: "PAYE (Pay As You Earn)",
    rate: "Progressive",
    icon: Users,
  },
  { value: "edt", label: "Education Tax (EDT)", rate: "2.5%", icon: Landmark },
  { value: "nit", label: "NITDEF", rate: "1%", icon: FileText },
];

const periods = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "bi_annual", label: "Bi-Annual" },
  { value: "annually", label: "Annual" },
];

const statuses = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "submitted",
    label: "Submitted",
    color: "bg-blue-100 text-blue-700",
  },
  { value: "filed", label: "Filed", color: "bg-green-100 text-green-700" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

const paymentStatuses = [
  { value: "unpaid", label: "Unpaid", color: "bg-red-100 text-red-700" },
  {
    value: "partial",
    label: "Partial",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-700" },
  { value: "waived", label: "Waived", color: "bg-blue-100 text-blue-700" },
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
  if (!dateString) return "-";
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

const getStatusBadge = (status: FilingStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    draft: <FileText className="h-3 w-3 mr-1" />,
    pending: <Clock className="h-3 w-3 mr-1" />,
    submitted: <Send className="h-3 w-3 mr-1" />,
    filed: <CheckCircle className="h-3 w-3 mr-1" />,
    overdue: <AlertCircle className="h-3 w-3 mr-1" />,
    rejected: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getPaymentStatusBadge = (status: PaymentStatus) => {
  const config = paymentStatuses.find((s) => s.value === status);
  return <Badge className={config?.color}>{config?.label}</Badge>;
};

const getTaxTypeLabel = (type: TaxType) => {
  return taxTypes.find((t) => t.value === type)?.label || type;
};

const getPeriodLabel = (period: TaxPeriod) => {
  return periods.find((p) => p.value === period)?.label || period;
};

export default function TaxReturns() {
  const router = useRouter();

  // State
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>(mockTaxReturns);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TaxReturn;
    direction: "asc" | "desc";
  }>({ key: "dueDate", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedReturn, setSelectedReturn] = useState<TaxReturn | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"returns" | "summary">("returns");

  // Form state
  const [formData, setFormData] = useState({
    taxType: "vat" as TaxType,
    period: "monthly" as TaxPeriod,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: 1,
    taxableAmount: 0,
    filingMethod: "online" as "online" | "manual" | "agent",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Available years
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const totalReturns = taxReturns.length;
    const filedReturns = taxReturns.filter((r) => r.status === "filed").length;
    const pendingReturns = taxReturns.filter(
      (r) => r.status === "pending",
    ).length;
    const overdueReturns = taxReturns.filter(
      (r) => r.status === "overdue",
    ).length;
    const totalTaxDue = taxReturns.reduce((sum, r) => sum + r.totalDue, 0);
    const totalPaid = taxReturns.reduce((sum, r) => sum + r.amountPaid, 0);
    const totalOutstanding = totalTaxDue - totalPaid;

    const byType: Record<string, number> = {};
    taxReturns.forEach((r) => {
      byType[r.taxType] = (byType[r.taxType] || 0) + r.totalDue;
    });

    return {
      totalReturns,
      filedReturns,
      pendingReturns,
      overdueReturns,
      totalTaxDue,
      totalPaid,
      totalOutstanding,
      complianceRate:
        totalReturns > 0 ? (filedReturns / totalReturns) * 100 : 0,
      byType,
    };
  }, [taxReturns]);

  // Filter and sort
  const filteredReturns = useMemo(() => {
    let result = [...taxReturns];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.returnNumber.toLowerCase().includes(query) ||
          getTaxTypeLabel(r.taxType).toLowerCase().includes(query) ||
          r.reference?.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((r) => r.taxType === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((r) => r.paymentStatus === paymentFilter);
    }

    if (yearFilter !== "all") {
      result = result.filter((r) => r.year === parseInt(yearFilter));
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "dueDate" || sortConfig.key === "filingDate") {
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
    taxReturns,
    searchQuery,
    typeFilter,
    statusFilter,
    paymentFilter,
    yearFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate tax due based on tax type
  const calculateTaxDue = (taxType: TaxType, amount: number): number => {
    const rates: Record<TaxType, number> = {
      vat: 0.075,
      company_income: 0.3,
      withholding: 0.1,
      paye: 0.15,
      edt: 0.025,
      nit: 0.01,
    };
    return amount * (rates[taxType] || 0);
  };

  // Handlers
  const handleSort = (key: keyof TaxReturn) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewReturn = (taxReturn: TaxReturn) => {
    setSelectedReturn(taxReturn);
    setIsViewModalOpen(true);
  };

  const handleEditReturn = (taxReturn: TaxReturn) => {
    setSelectedReturn(taxReturn);
    setFormData({
      taxType: taxReturn.taxType,
      period: taxReturn.period,
      year: taxReturn.year,
      month: taxReturn.month || 1,
      quarter: taxReturn.quarter || 1,
      taxableAmount: taxReturn.taxableAmount,
      filingMethod: taxReturn.filingMethod,
      remarks: taxReturn.remarks || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.taxType) errors.taxType = "Tax type is required";
    if (!formData.period) errors.period = "Period is required";
    if (!formData.year) errors.year = "Year is required";
    if (formData.taxableAmount <= 0)
      errors.taxableAmount = "Taxable amount must be greater than 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateReturn = () => {
    if (!validateForm()) return;

    const taxDue = calculateTaxDue(formData.taxType, formData.taxableAmount);
    const dueDate = new Date(formData.year, formData.month, 20);

    const newReturn: TaxReturn = {
      id: Math.max(...taxReturns.map((r) => r.id), 0) + 1,
      returnNumber: `${formData.taxType.toUpperCase()}-${formData.year}-${String(taxReturns.length + 1).padStart(3, "0")}`,
      taxType: formData.taxType,
      period: formData.period,
      year: formData.year,
      month: formData.period === "monthly" ? formData.month : undefined,
      quarter: formData.period === "quarterly" ? formData.quarter : undefined,
      dueDate: dueDate.toISOString().split("T")[0],
      status: "draft",
      paymentStatus: "unpaid",
      taxableAmount: formData.taxableAmount,
      taxDue,
      penalties: 0,
      interest: 0,
      totalDue: taxDue,
      amountPaid: 0,
      balanceDue: taxDue,
      filingMethod: formData.filingMethod,
      remarks: formData.remarks,
      preparedBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTaxReturns((prev) => [newReturn, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateReturn = () => {
    if (!validateForm() || !selectedReturn) return;

    const taxDue = calculateTaxDue(formData.taxType, formData.taxableAmount);
    const dueDate = new Date(formData.year, formData.month, 20);

    const updatedReturn: TaxReturn = {
      ...selectedReturn,
      taxType: formData.taxType,
      period: formData.period,
      year: formData.year,
      month: formData.period === "monthly" ? formData.month : undefined,
      quarter: formData.period === "quarterly" ? formData.quarter : undefined,
      dueDate: dueDate.toISOString().split("T")[0],
      taxableAmount: formData.taxableAmount,
      taxDue,
      totalDue: taxDue + selectedReturn.penalties + selectedReturn.interest,
      balanceDue:
        taxDue +
        selectedReturn.penalties +
        selectedReturn.interest -
        selectedReturn.amountPaid,
      filingMethod: formData.filingMethod,
      remarks: formData.remarks,
      updatedAt: new Date().toISOString(),
    };

    setTaxReturns((prev) =>
      prev.map((r) => (r.id === selectedReturn.id ? updatedReturn : r)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedReturn(null);
  };

  const handleFileReturn = () => {
    if (!selectedReturn) return;

    setTaxReturns((prev) =>
      prev.map((r) =>
        r.id === selectedReturn.id
          ? {
              ...r,
              status: "filed",
              filingDate: new Date().toISOString().split("T")[0],
              filedBy: "Current User",
              filedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsFileDialogOpen(false);
    setSelectedReturn(null);
  };

  const handleMakePayment = () => {
    if (!selectedReturn || paymentAmount <= 0) return;

    const newAmountPaid = selectedReturn.amountPaid + paymentAmount;
    const newBalanceDue = selectedReturn.totalDue - newAmountPaid;
    const newPaymentStatus = newBalanceDue <= 0 ? "paid" : "partial";

    setTaxReturns((prev) =>
      prev.map((r) =>
        r.id === selectedReturn.id
          ? {
              ...r,
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              paymentStatus: newPaymentStatus,
              paymentReference: `PAY-${Date.now()}`,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsPayDialogOpen(false);
    setSelectedReturn(null);
    setPaymentAmount(0);
  };

  const handleDeleteReturn = () => {
    if (!selectedReturn) return;
    setTaxReturns((prev) => prev.filter((r) => r.id !== selectedReturn.id));
    setIsDeleteDialogOpen(false);
    setSelectedReturn(null);
  };

  const resetForm = () => {
    setFormData({
      taxType: "vat",
      period: "monthly",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: 1,
      taxableAmount: 0,
      filingMethod: "online",
      remarks: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Return #",
      "Tax Type",
      "Period",
      "Year",
      "Due Date",
      "Taxable Amount",
      "Tax Due",
      "Status",
      "Payment Status",
      "Balance Due",
    ];
    const csvData = filteredReturns.map((r) => [
      r.returnNumber,
      getTaxTypeLabel(r.taxType),
      getPeriodLabel(r.period),
      r.year.toString(),
      formatDate(r.dueDate),
      r.taxableAmount.toString(),
      r.taxDue.toString(),
      r.status,
      r.paymentStatus,
      r.balanceDue.toString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-returns-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setTaxReturns([...mockTaxReturns]);
    setCurrentPage(1);
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setPaymentFilter("all");
    setYearFilter("all");
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
              <Landmark className="h-6 w-6" />
              Tax Returns
            </h1>
            <p className="text-muted-foreground mt-1">
              File and track all tax returns
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
            New Return
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-2xl font-bold">{stats.totalReturns}</p>
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
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.complianceRate.toFixed(0)}%
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tax Due</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.totalTaxDue)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalOutstanding)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
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
                placeholder="Search by return #, tax type..."
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tax Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {taxTypes.map((type) => (
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
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentFilter}
              onValueChange={(v) => {
                setPaymentFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={yearFilter}
              onValueChange={(v) => {
                setYearFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tax Returns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("returnNumber")}
                    >
                      Return #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Tax Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("dueDate")}
                    >
                      Due Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Taxable Amount</TableHead>
                  <TableHead className="text-right">Tax Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Landmark className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No tax returns found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReturns.map((taxReturn) => (
                    <TableRow key={taxReturn.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {taxReturn.returnNumber}
                      </TableCell>
                      <TableCell>
                        {getTaxTypeLabel(taxReturn.taxType)}
                      </TableCell>
                      <TableCell>
                        {getPeriodLabel(taxReturn.period)}{" "}
                        {taxReturn.month ? taxReturn.month : ""}{" "}
                        {taxReturn.quarter ? `Q${taxReturn.quarter}` : ""}
                      </TableCell>
                      <TableCell
                        className={
                          new Date(taxReturn.dueDate) < new Date() &&
                          taxReturn.status !== "filed"
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {formatDate(taxReturn.dueDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(taxReturn.taxableAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(taxReturn.taxDue)}
                      </TableCell>
                      <TableCell>{getStatusBadge(taxReturn.status)}</TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(taxReturn.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReturn(taxReturn)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {taxReturn.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditReturn(taxReturn)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedReturn(taxReturn);
                                  setIsFileDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {taxReturn.status === "filed" &&
                            taxReturn.balanceDue > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedReturn(taxReturn);
                                  setPaymentAmount(taxReturn.balanceDue);
                                  setIsPayDialogOpen(true);
                                }}
                                className="text-blue-600"
                              >
                                <DollarSign className="h-4 w-4" />
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
          {filteredReturns.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredReturns.length)}{" "}
                  of {filteredReturns.length}
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

      {/* View Return Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Tax Return Details</span>
              {selectedReturn && getStatusBadge(selectedReturn.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedReturn?.returnNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tax Type</p>
                  <p className="font-medium">
                    {getTaxTypeLabel(selectedReturn.taxType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p>
                    {getPeriodLabel(selectedReturn.period)}{" "}
                    {selectedReturn.month ? selectedReturn.month : ""}{" "}
                    {selectedReturn.quarter ? `Q${selectedReturn.quarter}` : ""}{" "}
                    {selectedReturn.year}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p
                    className={
                      new Date(selectedReturn.dueDate) < new Date() &&
                      selectedReturn.status !== "filed"
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {formatDate(selectedReturn.dueDate)}
                  </p>
                </div>
                {selectedReturn.filingDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Filing Date</p>
                    <p>{formatDate(selectedReturn.filingDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Filing Method</p>
                  <p className="capitalize">{selectedReturn.filingMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-mono text-sm">
                    {selectedReturn.reference || "-"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Financial Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Taxable Amount
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedReturn.taxableAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Tax Due</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedReturn.taxDue)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Penalties & Interest
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(
                        selectedReturn.penalties + selectedReturn.interest,
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Total Due</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedReturn.totalDue)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Amount Paid</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedReturn.amountPaid)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Balance Due</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(selectedReturn.balanceDue)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedReturn.paymentReference && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Payment Reference
                  </p>
                  <p className="font-mono text-sm">
                    {selectedReturn.paymentReference}
                  </p>
                </div>
              )}

              {selectedReturn.remarks && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Remarks</p>
                  <p className="text-sm mt-1">{selectedReturn.remarks}</p>
                </div>
              )}

              {/* Processing Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Processing Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Prepared by {selectedReturn.preparedBy} on{" "}
                      {formatDateTime(selectedReturn.createdAt)}
                    </span>
                  </div>
                  {selectedReturn.reviewedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Reviewed by {selectedReturn.reviewedBy}</span>
                    </div>
                  )}
                  {selectedReturn.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Approved by {selectedReturn.approvedBy}</span>
                    </div>
                  )}
                  {selectedReturn.filedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="h-4 w-4 text-purple-600" />
                      <span>
                        Filed by {selectedReturn.filedBy} on{" "}
                        {formatDateTime(selectedReturn.filedAt!)}
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

      {/* Create/Edit Return Modal */}
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
              {isCreateModalOpen ? "Create Tax Return" : "Edit Tax Return"}
            </DialogTitle>
            <DialogDescription>Enter tax return details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Tax Type *</Label>
              <Select
                value={formData.taxType}
                onValueChange={(v: any) =>
                  setFormData((prev) => ({ ...prev, taxType: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taxTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({type.rate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.taxType && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.taxType}
                </p>
              )}
            </div>

            <div>
              <Label>Filing Period *</Label>
              <Select
                value={formData.period}
                onValueChange={(v: any) =>
                  setFormData((prev) => ({ ...prev, period: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.period && (
                <p className="text-sm text-red-500 mt-1">{formErrors.period}</p>
              )}
            </div>

            <div>
              <Label>Tax Year *</Label>
              <Select
                value={formData.year.toString()}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, year: parseInt(v) }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.year && (
                <p className="text-sm text-red-500 mt-1">{formErrors.year}</p>
              )}
            </div>

            {formData.period === "monthly" && (
              <div>
                <Label>Month *</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, month: parseInt(v) }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2000, month - 1, 1).toLocaleString(
                            "default",
                            { month: "long" },
                          )}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.period === "quarterly" && (
              <div>
                <Label>Quarter *</Label>
                <Select
                  value={formData.quarter.toString()}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, quarter: parseInt(v) }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Q1 (Jan - Mar)</SelectItem>
                    <SelectItem value="2">Q2 (Apr - Jun)</SelectItem>
                    <SelectItem value="3">Q3 (Jul - Sep)</SelectItem>
                    <SelectItem value="4">Q4 (Oct - Dec)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Taxable Amount (₦) *</Label>
              <Input
                type="number"
                value={formData.taxableAmount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    taxableAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                placeholder="0"
              />
              {formErrors.taxableAmount && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.taxableAmount}
                </p>
              )}
            </div>

            <div>
              <Label>Filing Method</Label>
              <Select
                value={formData.filingMethod}
                onValueChange={(v: any) =>
                  setFormData((prev) => ({ ...prev, filingMethod: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Filing</SelectItem>
                  <SelectItem value="manual">Manual Filing</SelectItem>
                  <SelectItem value="agent">Through Tax Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Remarks (Optional)</Label>
              <Textarea
                value={formData.remarks}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, remarks: e.target.value }))
                }
                className="mt-1"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {/* Tax Preview */}
            {formData.taxableAmount > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Tax Preview</h3>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span>
                      Tax Due (
                      {taxTypes.find((t) => t.value === formData.taxType)?.rate}
                      ):
                    </span>
                    <span className="font-bold">
                      {formatCurrency(
                        calculateTaxDue(
                          formData.taxType,
                          formData.taxableAmount,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                isCreateModalOpen ? handleCreateReturn : handleUpdateReturn
              }
            >
              {isCreateModalOpen ? "Create Return" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Return Dialog */}
      <AlertDialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>File Tax Return</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to file this tax return?
              {selectedReturn && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedReturn.returnNumber}</p>
                  <p>Tax Type: {getTaxTypeLabel(selectedReturn.taxType)}</p>
                  <p>Amount Due: {formatCurrency(selectedReturn.totalDue)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFileReturn}>
              File Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Make Payment Dialog */}
      <AlertDialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Record payment for this tax return.
              {selectedReturn && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedReturn.returnNumber}</p>
                  <p>Total Due: {formatCurrency(selectedReturn.totalDue)}</p>
                  <p>
                    Outstanding Balance:{" "}
                    {formatCurrency(selectedReturn.balanceDue)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Payment Amount *</Label>
            <Input
              type="number"
              value={paymentAmount || ""}
              onChange={(e) =>
                setPaymentAmount(parseFloat(e.target.value) || 0)
              }
              className="mt-1"
              placeholder="0"
              max={selectedReturn?.balanceDue}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPaymentAmount(0)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMakePayment}
              disabled={
                paymentAmount <= 0 ||
                paymentAmount > (selectedReturn?.balanceDue || 0)
              }
            >
              Record Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
