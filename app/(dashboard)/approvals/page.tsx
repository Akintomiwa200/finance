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
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
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
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  FileText,
  Receipt,
  Banknote,
  CreditCard,
  PiggyBank,
  Send,
  CheckCheck,
  X,
  AlertCircle,
  FileCheck,
  ShoppingCart,
  Plane,
  Briefcase,
  Users,
  Layers,
  ClipboardList,
} from "lucide-react";

// Types
type ApprovalType =
  | "reimbursement"
  | "expense_report"
  | "loan"
  | "payroll"
  | "budget"
  | "leave"
  | "purchase_order"
  | "travel_request";
type ApprovalStatus = "pending" | "approved" | "rejected";

interface ApprovalItem {
  id: number;
  type: ApprovalType;
  title: string;
  description: string;
  requester: string;
  requesterEmail: string;
  requesterDepartment: string;
  amount?: number;
  submittedDate: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: ApprovalStatus;
  referenceNumber: string;
  details?: Record<string, string | number>;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  comments?: ApprovalComment[];
}

interface ApprovalComment {
  id: number;
  user: string;
  date: string;
  message: string;
}

// Initial Data
const initialApprovals: ApprovalItem[] = [
  {
    id: 1,
    type: "reimbursement",
    title: "Travel to Lagos - Reimbursement",
    description:
      "Business trip to Lagos for client meeting. Includes flight ₦350,000, hotel ₦180,000, and taxi ₦50,000.",
    requester: "John Doe",
    requesterEmail: "john.doe@company.com",
    requesterDepartment: "Engineering",
    amount: 580000,
    submittedDate: "2026-05-28",
    priority: "medium",
    status: "pending",
    referenceNumber: "REIM-2026-001",
    details: {
      "Flight Ticket": "₦350,000",
      "Hotel Accommodation": "₦180,000",
      "Airport Taxi": "₦50,000",
      Category: "Travel",
    },
  },
  {
    id: 2,
    type: "expense_report",
    title: "Office Supplies - Q2",
    description:
      "Quarterly office supplies purchase including design materials and software licenses.",
    requester: "Jane Smith",
    requesterEmail: "jane.smith@company.com",
    requesterDepartment: "Design",
    amount: 340000,
    submittedDate: "2026-06-01",
    priority: "low",
    status: "pending",
    referenceNumber: "EXP-2026-002",
    details: {
      "Design Software License": "₦250,000",
      "Drawing Tablet": "₦90,000",
      Category: "Supplies",
    },
  },
  {
    id: 3,
    type: "loan",
    title: "Employee Loan - Alice Johnson",
    description:
      "Loan application for education fees. Amount: ₦750,000, Term: 12 months, Interest: 6%.",
    requester: "Alice Johnson",
    requesterEmail: "alice.johnson@company.com",
    requesterDepartment: "Marketing",
    amount: 750000,
    submittedDate: "2026-03-01",
    priority: "high",
    status: "pending",
    referenceNumber: "LOAN-2026-004",
    details: {
      "Loan Amount": "₦750,000",
      "Interest Rate": "6%",
      Term: "12 months",
      "Monthly Deduction": "₦66,250",
      Purpose: "Education fees",
    },
  },
  {
    id: 4,
    type: "budget",
    title: "Finance Department Budget FY 2026",
    description:
      "Annual budget proposal for the Finance department. Total: ₦20,000,000.",
    requester: "Robert Chen",
    requesterEmail: "robert.chen@company.com",
    requesterDepartment: "Finance",
    amount: 20000000,
    submittedDate: "2026-01-10",
    priority: "urgent",
    status: "pending",
    referenceNumber: "BUD-2026-005",
    details: {
      Salaries: "₦12,000,000",
      "Software & ERP": "₦5,000,000",
      Consulting: "₦3,000,000",
      "Fiscal Year": "FY 2026",
    },
  },
  {
    id: 5,
    type: "leave",
    title: "Annual Leave Request - Mike Roberts",
    description:
      "Requesting 15 working days annual leave from July 1-21, 2026.",
    requester: "Mike Roberts",
    requesterEmail: "mike.roberts@company.com",
    requesterDepartment: "Operations",
    submittedDate: "2026-06-01",
    dueDate: "2026-06-15",
    priority: "medium",
    status: "pending",
    referenceNumber: "LEAVE-2026-006",
    details: {
      "Leave Type": "Annual Leave",
      Duration: "15 working days",
      "Start Date": "July 1, 2026",
      "End Date": "July 21, 2026",
      "Remaining Leave": "12 days",
    },
  },
  {
    id: 6,
    type: "purchase_order",
    title: "PO - IT Equipment Upgrade",
    description:
      "Purchase order for 20 laptops and 15 monitors for the Engineering team.",
    requester: "Tom Harris",
    requesterEmail: "tom.harris@company.com",
    requesterDepartment: "IT",
    amount: 8500000,
    submittedDate: "2026-05-25",
    priority: "high",
    status: "pending",
    referenceNumber: "PO-2026-007",
    details: {
      "Dell Laptops (x20)": "₦6,000,000",
      "LG Monitors (x15)": "₦2,500,000",
      Vendor: "TechCorp Solutions",
      Delivery: "2 weeks",
    },
  },
  {
    id: 7,
    type: "travel_request",
    title: "Travel Request - Conference Attendance",
    description:
      "Request to attend the annual Marketing Conference in Abuja. 3 days, 2 nights.",
    requester: "Emma Wilson",
    requesterEmail: "emma.wilson@company.com",
    requesterDepartment: "Marketing",
    amount: 650000,
    submittedDate: "2026-05-15",
    priority: "low",
    status: "pending",
    referenceNumber: "TRAV-2026-008",
    details: {
      "Conference Registration": "₦300,000",
      "Travel Expenses": "₦200,000",
      Accommodation: "₦150,000",
      Dates: "August 15-17, 2026",
    },
  },
  {
    id: 8,
    type: "reimbursement",
    title: "Client Dinner - Reimbursement",
    description: "Dinner meeting with potential client at Eko Hotel.",
    requester: "Bob King",
    requesterEmail: "bob.king@company.com",
    requesterDepartment: "Sales",
    amount: 125000,
    submittedDate: "2026-05-30",
    priority: "low",
    status: "approved",
    referenceNumber: "REIM-2026-003",
    approvedBy: "Admin User",
    approvedDate: "2026-05-31",
    details: {
      "Dinner at Eko Hotel": "₦125,000",
      Category: "Entertainment",
      Attendees: "3 people",
    },
  },
  {
    id: 9,
    type: "expense_report",
    title: "Marketing Conference - Expense Report",
    description:
      "Expenses for attending the Marketing Conference including registration and travel.",
    requester: "Emma Wilson",
    requesterEmail: "emma.wilson@company.com",
    requesterDepartment: "Marketing",
    amount: 650000,
    submittedDate: "2026-05-20",
    priority: "medium",
    status: "rejected",
    referenceNumber: "EXP-2026-005",
    rejectionReason:
      "Budget exceeded. Please provide additional justification for travel expenses.",
    details: {
      "Conference Registration": "₦300,000",
      "Travel Expenses": "₦200,000",
      "Marketing Materials": "₦150,000",
    },
  },
  {
    id: 10,
    type: "payroll",
    title: "June 2026 Payroll Run",
    description:
      "Monthly payroll processing for 46 employees. Total net pay: ₦45,230,000.",
    requester: "Admin User",
    requesterEmail: "admin@company.com",
    requesterDepartment: "HR",
    amount: 45230000,
    submittedDate: "2026-06-01",
    priority: "urgent",
    status: "pending",
    referenceNumber: "PAY-2026-006",
    details: {
      "Total Employees": "46",
      "Gross Pay": "₦58,750,000",
      "Total Deductions": "₦13,530,000",
      "Net Pay": "₦45,230,000",
      Period: "June 2026",
    },
  },
];

const approvalTypes: {
  value: ApprovalType;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "reimbursement", label: "Reimbursement", icon: Receipt },
  { value: "expense_report", label: "Expense Report", icon: FileText },
  { value: "loan", label: "Employee Loan", icon: PiggyBank },
  { value: "payroll", label: "Payroll", icon: Banknote },
  { value: "budget", label: "Budget", icon: Layers },
  { value: "leave", label: "Leave Request", icon: Calendar },
  { value: "purchase_order", label: "Purchase Order", icon: ShoppingCart },
  { value: "travel_request", label: "Travel Request", icon: Plane },
];

export default function ApprovalsPage() {
  // State
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ApprovalItem;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isBulkApproveDialogOpen, setIsBulkApproveDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [commentText, setCommentText] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const pending = approvals.filter((a) => a.status === "pending");
    const approved = approvals.filter((a) => a.status === "approved");
    const rejected = approvals.filter((a) => a.status === "rejected");
    const urgent = pending.filter(
      (a) => a.priority === "urgent" || a.priority === "high",
    );
    const totalPendingAmount = pending.reduce(
      (sum, a) => sum + (a.amount || 0),
      0,
    );

    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      urgentCount: urgent.length,
      totalPendingAmount,
      todayCount: pending.filter(
        (a) => a.submittedDate === new Date().toISOString().split("T")[0],
      ).length,
    };
  }, [approvals]);

  // Filter and sort
  const filteredApprovals = useMemo(() => {
    let result = [...approvals];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.requester.toLowerCase().includes(query) ||
          a.requesterDepartment.toLowerCase().includes(query) ||
          a.referenceNumber.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((a) => a.type === typeFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((a) => a.priority === priorityFilter);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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

    // Default sort: urgent first, then by date
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    result.sort((a, b) => {
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return (
        new Date(b.submittedDate).getTime() -
        new Date(a.submittedDate).getTime()
      );
    });

    return result;
  }, [
    approvals,
    searchQuery,
    statusFilter,
    typeFilter,
    priorityFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const paginatedApprovals = filteredApprovals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof ApprovalItem) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handleApprove = () => {
    if (!selectedApproval) return;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: "approved" as const,
              approvedBy: "Admin User",
              approvedDate: new Date().toISOString().split("T")[0],
              comments: [
                ...(a.comments || []),
                {
                  id: Date.now(),
                  user: "Admin User",
                  date: new Date().toISOString().split("T")[0],
                  message: commentText || "Approved",
                },
              ],
            }
          : a,
      ),
    );

    setCommentText("");
    setIsApproveDialogOpen(false);
    setSelectedApproval(null);
  };

  const handleReject = () => {
    if (!selectedApproval) return;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: "rejected" as const,
              rejectionReason,
              comments: [
                ...(a.comments || []),
                {
                  id: Date.now(),
                  user: "Admin User",
                  date: new Date().toISOString().split("T")[0],
                  message: `Rejected: ${rejectionReason}`,
                },
              ],
            }
          : a,
      ),
    );

    setRejectionReason("");
    setCommentText("");
    setIsRejectDialogOpen(false);
    setSelectedApproval(null);
  };

  const handleBulkApprove = () => {
    setApprovals((prev) =>
      prev.map((a) =>
        selectedIds.includes(a.id)
          ? {
              ...a,
              status: "approved" as const,
              approvedBy: "Admin User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : a,
      ),
    );

    setSelectedIds([]);
    setIsBulkApproveDialogOpen(false);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const pendingIds = paginatedApprovals
      .filter((a) => a.status === "pending")
      .map((a) => a.id);

    if (pendingIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !pendingIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pendingIds])]);
    }
  };

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

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: ApprovalItem["priority"]) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-red-200 text-red-800 text-xs">Urgent</Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-700 text-xs">High</Badge>
        );
      case "medium":
        return (
          <Badge className="bg-blue-100 text-blue-700 text-xs">Medium</Badge>
        );
      case "low":
        return <Badge className="bg-gray-100 text-gray-600 text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: ApprovalType) => {
    const found = approvalTypes.find((t) => t.value === type);
    if (!found) return FileText;
    return found.icon;
  };

  const getTypeLabel = (type: ApprovalType) => {
    const found = approvalTypes.find((t) => t.value === type);
    return found?.label || type;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Pending and historical approval requests
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedIds([])}>
              Clear Selection ({selectedIds.length})
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsBulkApproveDialogOpen(true)}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Approve All Selected
            </Button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent/High</p>
                <p className="text-2xl font-bold">{stats.urgentCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalPendingAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="pending">
            Pending ({stats.pendingCount})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({stats.approvedCount})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({stats.rejectedCount})
          </TabsTrigger>
          <TabsTrigger value="all">All ({approvals.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, requester, reference..."
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
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {approvalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === "all"
              ? "All Requests"
              : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Requests`}
          </CardTitle>
          <CardDescription>
            {filteredApprovals.length} request
            {filteredApprovals.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {statusFilter === "pending" && (
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        checked={
                          paginatedApprovals
                            .filter((a) => a.status === "pending")
                            .every((a) => selectedIds.includes(a.id)) &&
                          paginatedApprovals.some((a) => a.status === "pending")
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                  )}
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("submittedDate")}
                    >
                      Submitted
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={statusFilter === "pending" ? 9 : 8}
                      className="text-center py-12"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No approval requests found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApprovals.map((approval) => {
                    const TypeIcon = getTypeIcon(approval.type);
                    return (
                      <TableRow
                        key={approval.id}
                        className={
                          approval.priority === "urgent"
                            ? "bg-red-50/50"
                            : approval.priority === "high"
                              ? "bg-orange-50/30"
                              : ""
                        }
                      >
                        {statusFilter === "pending" && (
                          <TableCell>
                            {approval.status === "pending" && (
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(approval.id)}
                                onChange={() => toggleSelect(approval.id)}
                                className="rounded border-gray-300"
                              />
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-muted rounded-md">
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium">
                              {getTypeLabel(approval.type)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {approval.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {approval.referenceNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                                {getInitials(approval.requester)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {approval.requester}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {approval.requesterDepartment}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {approval.amount
                            ? formatCurrency(approval.amount)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {formatDate(approval.submittedDate)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getDaysAgo(approval.submittedDate)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(approval.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View"
                              onClick={() => {
                                setSelectedApproval(approval);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {approval.status === "pending" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Quick Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedApproval(approval);
                                      setCommentText("");
                                      setIsApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedApproval(approval);
                                      setRejectionReason("");
                                      setIsRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

          {/* Pagination */}
          {filteredApprovals.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
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
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredApprovals.length,
                  )}{" "}
                  of {filteredApprovals.length}
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

      {/* View Approval Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>
              {selectedApproval?.referenceNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-6 py-4">
              <div className="flex items-start justify-between pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedApproval.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedApproval.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(selectedApproval.priority)}
                  {getStatusBadge(selectedApproval.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Requester
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                        {getInitials(selectedApproval.requester)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {selectedApproval.requester}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedApproval.requesterEmail}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Department
                  </p>
                  <p className="font-medium mt-1">
                    {selectedApproval.requesterDepartment}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Type
                  </p>
                  <p className="font-medium mt-1">
                    {getTypeLabel(selectedApproval.type)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Submitted
                  </p>
                  <p className="font-medium mt-1">
                    {formatDate(selectedApproval.submittedDate)}
                  </p>
                </div>
                {selectedApproval.amount && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Amount
                    </p>
                    <p className="font-bold text-lg mt-1">
                      {formatCurrency(selectedApproval.amount)}
                    </p>
                  </div>
                )}
                {selectedApproval.dueDate && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Due Date
                    </p>
                    <p className="font-medium mt-1">
                      {formatDate(selectedApproval.dueDate)}
                    </p>
                  </div>
                )}
              </div>

              {selectedApproval.details && (
                <div>
                  <p className="font-medium mb-2">Details</p>
                  <div className="border rounded-lg divide-y">
                    {Object.entries(selectedApproval.details).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between p-3 text-sm"
                        >
                          <span className="text-muted-foreground">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {selectedApproval.approvedBy && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Approved by {selectedApproval.approvedBy} on{" "}
                    {formatDate(selectedApproval.approvedDate || "")}
                  </p>
                </div>
              )}

              {selectedApproval.rejectionReason && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    <XCircle className="h-4 w-4 inline mr-1" />
                    Rejected: {selectedApproval.rejectionReason}
                  </p>
                </div>
              )}

              {selectedApproval.comments &&
                selectedApproval.comments.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Comments</p>
                    <div className="space-y-2">
                      {selectedApproval.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 bg-muted rounded-lg text-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.date)}
                            </span>
                          </div>
                          <p>{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedApproval?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setRejectionReason("");
                    setIsRejectDialogOpen(true);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setCommentText("");
                    setIsApproveDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
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
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve{" "}
              <strong>{selectedApproval?.title}</strong>?
              {selectedApproval?.amount && (
                <>
                  {" "}
                  Amount:{" "}
                  <strong>{formatCurrency(selectedApproval.amount)}</strong>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Comment (optional)</Label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add an approval comment..."
              className="mt-2"
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
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
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting{" "}
              <strong>{selectedApproval?.title}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Rejection Reason *</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Approve Dialog */}
      <AlertDialog
        open={isBulkApproveDialogOpen}
        onOpenChange={setIsBulkApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Approve</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve{" "}
              <strong>
                {selectedIds.length} request
                {selectedIds.length !== 1 ? "s" : ""}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Approve All ({selectedIds.length})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
