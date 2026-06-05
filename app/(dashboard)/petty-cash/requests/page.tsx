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
  CheckCircle,
  XCircle,
  Clock,
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
  CreditCard,
  TrendingUp,
  TrendingDown,
  Printer,
  Send,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Copy,
  Flag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";

// Types
type RequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disbursed"
  | "cancelled";
type RequestPriority = "low" | "medium" | "high";
type PaymentMethod = "cash" | "bank_transfer" | "cheque";

interface CashRequest {
  id: number;
  requestNumber: string;
  requester: {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
  };
  requestDate: string;
  amount: number;
  purpose: string;
  category: string;
  priority: RequestPriority;
  status: RequestStatus;
  paymentMethod: PaymentMethod;
  expectedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  disbursedBy?: string;
  disbursedDate?: string;
  receipts?: {
    id: number;
    fileName: string;
    fileUrl: string;
  }[];
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface PettyCashBalance {
  fundName: string;
  currentBalance: number;
  totalDisbursed: number;
  totalRequests: number;
  pendingRequests: number;
  lastReplenishment: string;
  replenishmentThreshold: number;
}

// Mock Data
const mockRequests: CashRequest[] = [
  {
    id: 1,
    requestNumber: "PCR-2026-0001",
    requester: {
      id: 101,
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
      position: "Marketing Coordinator",
    },
    requestDate: "2026-03-01",
    amount: 50000,
    purpose: "Office supplies for Q1 campaign",
    category: "Office Supplies",
    priority: "medium",
    status: "disbursed",
    paymentMethod: "cash",
    expectedDate: "2026-03-03",
    approvedBy: "Jane Manager",
    approvedDate: "2026-03-01T14:30:00",
    disbursedBy: "Cashier",
    disbursedDate: "2026-03-02T10:00:00",
    notes: "Need by Friday for campaign launch",
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-03-02T10:00:00",
  },
  {
    id: 2,
    requestNumber: "PCR-2026-0002",
    requester: {
      id: 102,
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      department: "Operations",
      position: "Facilities Manager",
    },
    requestDate: "2026-03-02",
    amount: 35000,
    purpose: "Cleaning supplies and materials",
    category: "Cleaning Supplies",
    priority: "high",
    status: "approved",
    paymentMethod: "cash",
    expectedDate: "2026-03-04",
    approvedBy: "Operations Director",
    approvedDate: "2026-03-02T16:00:00",
    notes: "Urgent - running low on supplies",
    createdAt: "2026-03-02T10:30:00",
    updatedAt: "2026-03-02T16:00:00",
  },
  {
    id: 3,
    requestNumber: "PCR-2026-0003",
    requester: {
      id: 103,
      name: "Bob Williams",
      email: "bob.williams@company.com",
      department: "IT",
      position: "IT Support",
    },
    requestDate: "2026-03-03",
    amount: 25000,
    purpose: "Emergency keyboard and mouse replacements",
    category: "IT Equipment",
    priority: "high",
    status: "pending",
    paymentMethod: "cash",
    expectedDate: "2026-03-05",
    notes: "Several keyboards malfunctioning",
    createdAt: "2026-03-03T09:15:00",
    updatedAt: "2026-03-03T09:15:00",
  },
  {
    id: 4,
    requestNumber: "PCR-2026-0004",
    requester: {
      id: 104,
      name: "Carol Davis",
      email: "carol.davis@company.com",
      department: "HR",
      position: "HR Assistant",
    },
    requestDate: "2026-03-03",
    amount: 15000,
    purpose: "Employee recognition snacks",
    category: "Staff Welfare",
    priority: "low",
    status: "rejected",
    paymentMethod: "cash",
    expectedDate: "2026-03-06",
    rejectionReason:
      "Budget not available for this quarter. Please resubmit next month.",
    createdAt: "2026-03-03T11:00:00",
    updatedAt: "2026-03-03T15:30:00",
  },
  {
    id: 5,
    requestNumber: "PCR-2026-0005",
    requester: {
      id: 105,
      name: "David Brown",
      email: "david.brown@company.com",
      department: "Sales",
      position: "Sales Executive",
    },
    requestDate: "2026-03-04",
    amount: 75000,
    purpose: "Client lunch and entertainment",
    category: "Entertainment",
    priority: "medium",
    status: "approved",
    paymentMethod: "bank_transfer",
    expectedDate: "2026-03-06",
    approvedBy: "Sales Manager",
    approvedDate: "2026-03-04T14:00:00",
    notes: "Important client meeting",
    createdAt: "2026-03-04T09:00:00",
    updatedAt: "2026-03-04T14:00:00",
  },
  {
    id: 6,
    requestNumber: "PCR-2026-0006",
    requester: {
      id: 106,
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      department: "Finance",
      position: "Accountant",
    },
    requestDate: "2026-03-04",
    amount: 50000,
    purpose: "Petty cash replenishment",
    category: "Petty Cash",
    priority: "high",
    status: "pending",
    paymentMethod: "bank_transfer",
    expectedDate: "2026-03-05",
    notes: "Funds running low for daily operations",
    createdAt: "2026-03-04T13:45:00",
    updatedAt: "2026-03-04T13:45:00",
  },
  {
    id: 7,
    requestNumber: "PCR-2026-0007",
    requester: {
      id: 107,
      name: "Frank Miller",
      email: "frank.miller@company.com",
      department: "Engineering",
      position: "Software Engineer",
    },
    requestDate: "2026-03-05",
    amount: 20000,
    purpose: "Software subscription renewal",
    category: "Software",
    priority: "medium",
    status: "pending",
    paymentMethod: "bank_transfer",
    expectedDate: "2026-03-07",
    notes: "IDE license renewal",
    createdAt: "2026-03-05T08:30:00",
    updatedAt: "2026-03-05T08:30:00",
  },
];

const categories = [
  "Office Supplies",
  "Cleaning Supplies",
  "IT Equipment",
  "Staff Welfare",
  "Entertainment",
  "Petty Cash",
  "Software",
  "Transport",
  "Medical",
  "Other",
];

const departments = [
  "Marketing",
  "Operations",
  "IT",
  "HR",
  "Sales",
  "Finance",
  "Engineering",
];
const statuses = [
  "all",
  "pending",
  "approved",
  "rejected",
  "disbursed",
  "cancelled",
];
const priorities = ["all", "low", "medium", "high"];

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

const getStatusBadge = (status: RequestStatus) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    disbursed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    disbursed: "Disbursed",
    cancelled: "Cancelled",
  };

  return (
    <Badge className={`${styles[status]} flex items-center gap-1 w-fit`}>
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "approved" && <CheckCircle className="h-3 w-3" />}
      {status === "rejected" && <XCircle className="h-3 w-3" />}
      {status === "disbursed" && <CheckCircle className="h-3 w-3" />}
      {status === "cancelled" && <XCircle className="h-3 w-3" />}
      {labels[status]}
    </Badge>
  );
};

const getPriorityBadge = (priority: RequestPriority) => {
  const styles = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-red-100 text-red-700",
  };

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <Badge className={`${styles[priority]} flex items-center gap-1 w-fit`}>
      {priority === "high" && <AlertCircle className="h-3 w-3" />}
      {priority === "medium" && <Clock className="h-3 w-3" />}
      {priority === "low" && <Flag className="h-3 w-3" />}
      {labels[priority]}
    </Badge>
  );
};

export default function CashRequests() {
  const router = useRouter();

  // State
  const [requests, setRequests] = useState<CashRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CashRequest;
    direction: "asc" | "desc";
  }>({ key: "requestDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState<CashRequest | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDisburseDialogOpen, setIsDisburseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "balance">(
    "requests",
  );

  // Form state
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterDepartment: "",
    amount: 0,
    purpose: "",
    category: "",
    priority: "medium" as RequestPriority,
    paymentMethod: "cash" as PaymentMethod,
    expectedDate: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Petty Cash Balance
  const pettyCashBalance: PettyCashBalance = useMemo(() => {
    const disbursedRequests = requests.filter((r) => r.status === "disbursed");
    const totalDisbursed = disbursedRequests.reduce(
      (sum, r) => sum + r.amount,
      0,
    );
    const pendingRequests = requests.filter(
      (r) => r.status === "pending",
    ).length;

    return {
      fundName: "Main Petty Cash Fund",
      currentBalance: 250000 - totalDisbursed,
      totalDisbursed,
      totalRequests: requests.length,
      pendingRequests,
      lastReplenishment: "2026-02-28",
      replenishmentThreshold: 50000,
    };
  }, [requests]);

  // Filter and sort
  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.requestNumber.toLowerCase().includes(query) ||
          r.requester.name.toLowerCase().includes(query) ||
          r.purpose.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter(
        (r) => r.requester.department === departmentFilter,
      );
    }

    if (priorityFilter !== "all") {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue =
          sortConfig.key === "requestDate"
            ? new Date(a.requestDate).getTime()
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === "requestDate"
            ? new Date(b.requestDate).getTime()
            : b[sortConfig.key];

        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }

    return result;
  }, [
    requests,
    searchQuery,
    statusFilter,
    categoryFilter,
    departmentFilter,
    priorityFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Statistics
  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const pendingCount = requests.filter((r) => r.status === "pending").length;
    const approvedCount = requests.filter(
      (r) => r.status === "approved",
    ).length;
    const disbursedCount = requests.filter(
      (r) => r.status === "disbursed",
    ).length;
    const rejectedCount = requests.filter(
      (r) => r.status === "rejected",
    ).length;
    const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);
    const disbursedAmount = requests
      .filter((r) => r.status === "disbursed")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalRequests,
      pendingCount,
      approvedCount,
      disbursedCount,
      rejectedCount,
      totalAmount,
      disbursedAmount,
    };
  }, [requests]);

  // Handlers
  const handleSort = (key: keyof CashRequest) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewRequest = (request: CashRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleEditRequest = (request: CashRequest) => {
    setSelectedRequest(request);
    setFormData({
      requesterName: request.requester.name,
      requesterEmail: request.requester.email,
      requesterDepartment: request.requester.department,
      amount: request.amount,
      purpose: request.purpose,
      category: request.category,
      priority: request.priority,
      paymentMethod: request.paymentMethod,
      expectedDate: request.expectedDate || "",
      notes: request.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.requesterName)
      errors.requesterName = "Requester name is required";
    if (!formData.amount || formData.amount <= 0)
      errors.amount = "Valid amount is required";
    if (!formData.purpose) errors.purpose = "Purpose is required";
    if (!formData.category) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRequest = () => {
    if (!validateForm()) return;

    const newRequest: CashRequest = {
      id: Math.max(...requests.map((r) => r.id), 0) + 1,
      requestNumber: `PCR-${new Date().getFullYear()}-${String(requests.length + 1).padStart(4, "0")}`,
      requester: {
        id: Date.now(),
        name: formData.requesterName,
        email: formData.requesterEmail,
        department: formData.requesterDepartment,
        position: "Employee",
      },
      requestDate: new Date().toISOString().split("T")[0],
      amount: formData.amount,
      purpose: formData.purpose,
      category: formData.category,
      priority: formData.priority,
      status: "pending",
      paymentMethod: formData.paymentMethod,
      expectedDate: formData.expectedDate,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateRequest = () => {
    if (!validateForm() || !selectedRequest) return;

    const updatedRequest: CashRequest = {
      ...selectedRequest,
      requester: {
        ...selectedRequest.requester,
        name: formData.requesterName,
        email: formData.requesterEmail,
        department: formData.requesterDepartment,
      },
      amount: formData.amount,
      purpose: formData.purpose,
      category: formData.category,
      priority: formData.priority,
      paymentMethod: formData.paymentMethod,
      expectedDate: formData.expectedDate,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === selectedRequest.id ? updatedRequest : r)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApproveRequest = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "approved",
              approvedBy: "Current Approver",
              approvedDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleRejectRequest = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "rejected",
              rejectionReason,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectionReason("");
  };

  const handleDisburseRequest = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "disbursed",
              disbursedBy: "Cashier",
              disbursedDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsDisburseDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = () => {
    if (!selectedRequest) return;
    setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    setIsDeleteDialogOpen(false);
    setSelectedRequest(null);
  };

  const resetForm = () => {
    setFormData({
      requesterName: "",
      requesterEmail: "",
      requesterDepartment: "",
      amount: 0,
      purpose: "",
      category: "",
      priority: "medium",
      paymentMethod: "cash",
      expectedDate: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Request #",
      "Date",
      "Requester",
      "Department",
      "Amount",
      "Category",
      "Priority",
      "Status",
      "Purpose",
    ];
    const csvData = filteredRequests.map((r) => [
      r.requestNumber,
      formatDate(r.requestDate),
      r.requester.name,
      r.requester.department,
      r.amount.toString(),
      r.category,
      r.priority,
      r.status,
      r.purpose,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cash-requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setRequests([...mockRequests]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setDepartmentFilter("all");
    setPriorityFilter("all");
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
              Petty Cash Book
            </h1>
            <p className="text-muted-foreground mt-1">
              Submit and manage petty cash requests
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
            New Request
          </Button>
        </div>
      </div>

      {/* Petty Cash Balance Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Petty Cash Fund</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(pettyCashBalance.currentBalance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last replenishment:{" "}
                  {formatDate(pettyCashBalance.lastReplenishment)}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(pettyCashBalance.totalDisbursed)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Pending Requests
                </p>
                <p className="text-lg font-semibold text-yellow-600">
                  {pettyCashBalance.pendingRequests}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-lg font-semibold">
                  {pettyCashBalance.totalRequests}
                </p>
              </div>
            </div>
            {pettyCashBalance.currentBalance <
              pettyCashBalance.replenishmentThreshold && (
              <Button variant="destructive" size="sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Low Balance - Request Replenishment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
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
                <p className="text-sm text-muted-foreground">Disbursed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.disbursedCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-purple-600" />
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Cash Requests</TabsTrigger>
          <TabsTrigger value="balance">Balance & History</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by request #, requester, purpose..."
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
                      <SelectItem key={status} value={status}>
                        {status === "all"
                          ? "All Status"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
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
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
                    <SelectItem value="all">All Depts</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={(v) => {
                    setPriorityFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <Flag className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority === "all"
                          ? "All Priority"
                          : priority.charAt(0).toUpperCase() +
                            priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("requestNumber")}
                        >
                          Request #
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("requestDate")}
                        >
                          Date
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Receipt className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No cash requests found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-xs font-medium">
                            {request.requestNumber}
                          </TableCell>
                          <TableCell>
                            {formatDate(request.requestDate)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {request.requester.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {request.requester.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{request.requester.department}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(request.amount)}
                          </TableCell>
                          <TableCell>{request.category}</TableCell>
                          <TableCell>
                            {getPriorityBadge(request.priority)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditRequest(request)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setIsApproveDialogOpen(true);
                                    }}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setIsRejectDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {request.status === "approved" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setIsDisburseDialogOpen(true);
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
              {filteredRequests.length > 0 && (
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
                        filteredRequests.length,
                      )}{" "}
                      of {filteredRequests.length}
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

        <TabsContent value="balance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Petty Cash Balance History</CardTitle>
              <CardDescription>
                Track balance changes and replenishment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  Balance history chart coming soon
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current balance:{" "}
                  {formatCurrency(pettyCashBalance.currentBalance)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Request Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Cash Request Details</span>
              {selectedRequest && getStatusBadge(selectedRequest.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.requestNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Request Date</p>
                  <p>{formatDate(selectedRequest.requestDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(selectedRequest.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedRequest.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  {getPriorityBadge(selectedRequest.priority)}
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p>{selectedRequest.purpose}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Requester Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedRequest.requester.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedRequest.requester.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>{selectedRequest.requester.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p>{selectedRequest.requester.position}</p>
                  </div>
                </div>
              </div>

              {/* Approval/Disbursement Info */}
              {(selectedRequest.approvedBy ||
                selectedRequest.disbursedBy ||
                selectedRequest.rejectionReason) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Processing Information</h3>
                  <div className="space-y-2">
                    {selectedRequest.approvedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Approved by {selectedRequest.approvedBy} on{" "}
                          {formatDateTime(selectedRequest.approvedDate!)}
                        </span>
                      </div>
                    )}
                    {selectedRequest.disbursedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span>
                          Disbursed by {selectedRequest.disbursedBy} on{" "}
                          {formatDateTime(selectedRequest.disbursedDate!)}
                        </span>
                      </div>
                    )}
                    {selectedRequest.rejectionReason && (
                      <div className="flex items-start gap-2 text-sm text-red-600">
                        <XCircle className="h-4 w-4 mt-0.5" />
                        <div>
                          <span className="font-medium">Rejection Reason:</span>
                          <p>{selectedRequest.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedRequest.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Additional Notes
                  </p>
                  <p className="text-sm mt-1">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedRequest && selectedRequest.status === "pending" && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedRequest(selectedRequest);
                  setIsApproveDialogOpen(true);
                }}
              >
                Approve Request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Request Modal */}
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
              {isCreateModalOpen ? "New Cash Request" : "Edit Cash Request"}
            </DialogTitle>
            <DialogDescription>
              Submit a request for petty cash disbursement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Requester Email</Label>
                <Input
                  type="email"
                  value={formData.requesterEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requesterEmail: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={formData.requesterDepartment}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, requesterDepartment: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, priority: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expected Date</Label>
                <Input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expectedDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Purpose *</Label>
                <Textarea
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      purpose: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={3}
                  placeholder="Describe the purpose of this cash request..."
                />
                {formErrors.purpose && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.purpose}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
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
                isCreateModalOpen ? handleCreateRequest : handleUpdateRequest
              }
            >
              {isCreateModalOpen ? "Submit Request" : "Save Changes"}
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
            <AlertDialogTitle>Approve Cash Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this cash request?
              {selectedRequest && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedRequest.requestNumber}</p>
                  <p className="text-sm">
                    Amount: {formatCurrency(selectedRequest.amount)}
                  </p>
                  <p className="text-sm">Purpose: {selectedRequest.purpose}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveRequest}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Cash Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request.
              {selectedRequest && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedRequest.requestNumber}</p>
                  <p className="text-sm">
                    Amount: {formatCurrency(selectedRequest.amount)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Rejection Reason *</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={3}
              placeholder="Please explain why this request is being rejected..."
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectRequest}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disburse Dialog */}
      <AlertDialog
        open={isDisburseDialogOpen}
        onOpenChange={setIsDisburseDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disburse Cash</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm disbursement of approved cash request.
              {selectedRequest && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedRequest.requestNumber}</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedRequest.amount)}
                  </p>
                  <p className="text-sm">
                    To: {selectedRequest.requester.name}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisburseRequest}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Disbursement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
