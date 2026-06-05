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
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  DollarSign,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
interface ApprovalRecord {
  id: number;
  requestId: string;
  requestType: "expense" | "purchase" | "leave" | "budget" | "contract";
  title: string;
  requester: string;
  requesterEmail: string;
  requesterDepartment: string;
  amount?: number;
  submittedDate: string;
  approvalDate: string;
  status: "approved" | "rejected" | "pending" | "cancelled";
  decision: "approve" | "reject" | null;
  approver: string;
  approverEmail: string;
  approverRole: string;
  comments: string;
  reviewerNotes?: string;
  level: number;
  levelName: string;
  previousApprover?: string;
  nextApprover?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

// Mock Data
const mockApprovalHistory: ApprovalRecord[] = [
  {
    id: 1,
    requestId: "REQ-2026-001",
    requestType: "expense",
    title: "Q1 Marketing Campaign Expenses",
    requester: "John Doe",
    requesterEmail: "john.doe@company.com",
    requesterDepartment: "Marketing",
    amount: 2500000,
    submittedDate: "2026-01-10",
    approvalDate: "2026-01-12",
    status: "approved",
    decision: "approve",
    approver: "Jane Smith",
    approverEmail: "jane.smith@company.com",
    approverRole: "Marketing Director",
    comments: "Approved within budget. Good ROI expected.",
    level: 1,
    levelName: "Department Head",
    previousApprover: undefined,
    nextApprover: "Sarah Johnson",
    attachments: ["budget_breakdown.xlsx", "campaign_plan.pdf"],
  },
  {
    id: 2,
    requestId: "REQ-2026-002",
    requestType: "expense",
    title: "Team Building Retreat",
    requester: "Alice Brown",
    requesterEmail: "alice.brown@company.com",
    requesterDepartment: "HR",
    amount: 1500000,
    submittedDate: "2026-01-15",
    approvalDate: "2026-01-18",
    status: "approved",
    decision: "approve",
    approver: "Robert Wilson",
    approverEmail: "robert.wilson@company.com",
    approverRole: "HR Director",
    comments: "Approved. Ensure cost-effective planning.",
    level: 1,
    levelName: "Department Head",
    attachments: ["team_retreat_proposal.pdf"],
  },
  {
    id: 3,
    requestId: "REQ-2026-003",
    requestType: "purchase",
    title: "Laptop Procurement - IT Team",
    requester: "Charlie Davis",
    requesterEmail: "charlie.davis@company.com",
    requesterDepartment: "IT",
    amount: 4500000,
    submittedDate: "2026-01-20",
    approvalDate: "2026-01-25",
    status: "approved",
    decision: "approve",
    approver: "Emily Chen",
    approverEmail: "emily.chen@company.com",
    approverRole: "IT Manager",
    comments: "Approved. 10 laptops for new developers.",
    level: 2,
    levelName: "IT Manager",
    previousApprover: "David Lee",
    nextApprover: "Finance Team",
  },
  {
    id: 4,
    requestId: "REQ-2026-004",
    requestType: "expense",
    title: "Software License Renewal",
    requester: "Diana Prince",
    requesterEmail: "diana.prince@company.com",
    requesterDepartment: "Engineering",
    amount: 8000000,
    submittedDate: "2026-02-01",
    approvalDate: "2026-02-05",
    status: "rejected",
    decision: "reject",
    approver: "Michael Scott",
    approverEmail: "michael.scott@company.com",
    approverRole: "Finance Controller",
    comments:
      "Rejected: Budget not available for this quarter. Please resubmit for Q3.",
    reviewerNotes: "Over budget by 2M",
    level: 2,
    levelName: "Finance Review",
    previousApprover: "Engineering Lead",
  },
  {
    id: 5,
    requestId: "REQ-2026-005",
    requestType: "leave",
    title: "Annual Leave Request - 2 weeks",
    requester: "Emma Watson",
    requesterEmail: "emma.watson@company.com",
    requesterDepartment: "Sales",
    submittedDate: "2026-02-10",
    approvalDate: "2026-02-11",
    status: "approved",
    decision: "approve",
    approver: "James Brown",
    approverEmail: "james.brown@company.com",
    approverRole: "Sales Manager",
    comments: "Approved. Team coverage arranged.",
    level: 1,
    levelName: "Team Lead",
    metadata: {
      leaveStart: "2026-03-01",
      leaveEnd: "2026-03-14",
      leaveType: "Annual",
    },
  },
  {
    id: 6,
    requestId: "REQ-2026-006",
    requestType: "budget",
    title: "Q2 Marketing Budget Increase",
    requester: "Frank Miller",
    requesterEmail: "frank.miller@company.com",
    requesterDepartment: "Marketing",
    amount: 12000000,
    submittedDate: "2026-02-15",
    approvalDate: "2026-02-20",
    status: "rejected",
    decision: "reject",
    approver: "Sarah Johnson",
    approverEmail: "sarah.johnson@company.com",
    approverRole: "CFO",
    comments:
      "Rejected: Need more justification for the increase. Please provide detailed ROI analysis.",
    level: 3,
    levelName: "Executive Committee",
    previousApprover: "Finance Director",
  },
  {
    id: 7,
    requestId: "REQ-2026-007",
    requestType: "contract",
    title: "Consulting Services Agreement",
    requester: "George Adams",
    requesterEmail: "george.adams@company.com",
    requesterDepartment: "Legal",
    amount: 5000000,
    submittedDate: "2026-02-25",
    approvalDate: "2026-03-01",
    status: "approved",
    decision: "approve",
    approver: "Helen Clark",
    approverEmail: "helen.clark@company.com",
    approverRole: "Legal Director",
    comments: "Approved. Contract reviewed and compliant.",
    level: 2,
    levelName: "Legal Review",
    attachments: ["service_agreement.pdf", "legal_review.docx"],
  },
  {
    id: 8,
    requestId: "REQ-2026-008",
    requestType: "expense",
    title: "Office Supplies Bulk Order",
    requester: "Ian Foster",
    requesterEmail: "ian.foster@company.com",
    requesterDepartment: "Operations",
    amount: 350000,
    submittedDate: "2026-03-05",
    approvalDate: "2026-03-06",
    status: "cancelled",
    decision: null,
    approver: "Operations Manager",
    approverEmail: "ops.manager@company.com",
    approverRole: "Operations Manager",
    comments: "Request cancelled by requester.",
    level: 1,
    levelName: "Department Head",
  },
  {
    id: 9,
    requestId: "REQ-2026-009",
    requestType: "expense",
    title: "Training & Development Program",
    requester: "Julia Roberts",
    requesterEmail: "julia.roberts@company.com",
    requesterDepartment: "HR",
    amount: 2800000,
    submittedDate: "2026-03-10",
    approvalDate: "2026-03-15",
    status: "approved",
    decision: "approve",
    approver: "Robert Wilson",
    approverEmail: "robert.wilson@company.com",
    approverRole: "HR Director",
    comments: "Approved. Great initiative for team development.",
    level: 2,
    levelName: "HR Leadership",
    previousApprover: "Training Coordinator",
  },
  {
    id: 10,
    requestId: "REQ-2026-010",
    requestType: "purchase",
    title: "New Office Furniture",
    requester: "Kevin Spacey",
    requesterEmail: "kevin.spacey@company.com",
    requesterDepartment: "Operations",
    amount: 3200000,
    submittedDate: "2026-03-18",
    approvalDate: "2026-03-22",
    status: "pending",
    decision: null,
    approver: "Pending",
    approverEmail: "",
    approverRole: "",
    comments: "Awaiting final approval from Finance",
    level: 2,
    levelName: "Finance Review",
    previousApprover: "Operations Director",
  },
];

const requestTypes = [
  "all",
  "expense",
  "purchase",
  "leave",
  "budget",
  "contract",
];
const statuses = ["all", "approved", "rejected", "pending", "cancelled"];
const departments = [
  "all",
  "Marketing",
  "HR",
  "IT",
  "Engineering",
  "Sales",
  "Legal",
  "Operations",
  "Finance",
];

function calculateAverageApprovalTime(approvals: ApprovalRecord[]) {
  const approvedRequests = approvals.filter(
    (a) => a.status === "approved" && a.submittedDate && a.approvalDate,
  );
  if (approvedRequests.length === 0) return 0;

  const totalDays = approvedRequests.reduce((sum, req) => {
    const submitted = new Date(req.submittedDate);
    const approved = new Date(req.approvalDate);
    const days = Math.ceil(
      (approved.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24),
    );
    return sum + days;
  }, 0);

  return totalDays / approvedRequests.length;
}

export default function ApprovalsHistory() {
  const router = useRouter();

  // State
  const [approvals, setApprovals] =
    useState<ApprovalRecord[]>(mockApprovalHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ApprovalRecord;
    direction: "asc" | "desc";
  }>({ key: "approvalDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedApproval, setSelectedApproval] =
    useState<ApprovalRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalRequests = approvals.length;
    const approvedCount = approvals.filter(
      (a) => a.status === "approved",
    ).length;
    const rejectedCount = approvals.filter(
      (a) => a.status === "rejected",
    ).length;
    const pendingCount = approvals.filter((a) => a.status === "pending").length;
    const cancelledCount = approvals.filter(
      (a) => a.status === "cancelled",
    ).length;
    const totalAmount = approvals.reduce((sum, a) => sum + (a.amount || 0), 0);
    const avgApprovalTime = calculateAverageApprovalTime(approvals);

    return {
      totalRequests,
      approvedCount,
      rejectedCount,
      pendingCount,
      cancelledCount,
      totalAmount,
      avgApprovalTime,
      approvalRate:
        totalRequests > 0 ? (approvedCount / totalRequests) * 100 : 0,
      rejectionRate:
        totalRequests > 0 ? (rejectedCount / totalRequests) * 100 : 0,
    };
  }, [approvals]);

  // Filter and sort
  const filteredApprovals = useMemo(() => {
    let result = [...approvals];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.requestId.toLowerCase().includes(query) ||
          a.title.toLowerCase().includes(query) ||
          a.requester.toLowerCase().includes(query) ||
          a.approver.toLowerCase().includes(query) ||
          a.comments.toLowerCase().includes(query),
      );
    }

    if (requestTypeFilter !== "all") {
      result = result.filter((a) => a.requestType === requestTypeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((a) => a.requesterDepartment === departmentFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (
          sortConfig.key === "approvalDate" ||
          sortConfig.key === "submittedDate"
        ) {
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
    approvals,
    searchQuery,
    requestTypeFilter,
    statusFilter,
    departmentFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const paginatedApprovals = filteredApprovals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof ApprovalRecord) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewDetails = (approval: ApprovalRecord) => {
    setSelectedApproval(approval);
    setIsDetailsModalOpen(true);
  };

  const getStatusIcon = (status: ApprovalRecord["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ApprovalRecord["status"]) => {
    const styles = {
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const labels = {
      approved: "Approved",
      rejected: "Rejected",
      pending: "Pending",
      cancelled: "Cancelled",
    };

    return (
      <Badge className={`${styles[status]} flex items-center gap-1 w-fit`}>
        {getStatusIcon(status)}
        {labels[status]}
      </Badge>
    );
  };

  const getRequestTypeBadge = (type: ApprovalRecord["requestType"]) => {
    const styles = {
      expense: "bg-blue-100 text-blue-700",
      purchase: "bg-purple-100 text-purple-700",
      leave: "bg-green-100 text-green-700",
      budget: "bg-orange-100 text-orange-700",
      contract: "bg-red-100 text-red-700",
    };

    const labels = {
      expense: "Expense",
      purchase: "Purchase",
      leave: "Leave",
      budget: "Budget",
      contract: "Contract",
    };

    return (
      <Badge variant="secondary" className={styles[type]}>
        {labels[type]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = () => {
    const headers = [
      "Request ID",
      "Type",
      "Title",
      "Requester",
      "Department",
      "Amount",
      "Submitted",
      "Approval Date",
      "Status",
      "Approver",
      "Comments",
    ];
    const csvData = filteredApprovals.map((a) => [
      a.requestId,
      a.requestType,
      a.title,
      a.requester,
      a.requesterDepartment,
      a.amount?.toString() || "",
      formatDate(a.submittedDate),
      formatDate(a.approvalDate),
      a.status,
      a.approver,
      a.comments,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `approval-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // In real app, fetch from API
    setApprovals([...mockApprovalHistory]);
    setCurrentPage(1);
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Approval History
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and review all approval requests and decisions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

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
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approvalRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.approvedCount} approved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejection Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejectionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <ThumbsDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.rejectedCount} rejected
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Approval Time
                </p>
                <p className="text-2xl font-bold">
                  {stats.avgApprovalTime.toFixed(1)} days
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.pendingCount} pending
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
                placeholder="Search by ID, title, requester, approver..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={requestTypeFilter}
              onValueChange={(v) => {
                setRequestTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
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
              value={departmentFilter}
              onValueChange={(v) => {
                setDepartmentFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Approval History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Records</CardTitle>
          <CardDescription>
            {filteredApprovals.length} record
            {filteredApprovals.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("requestId")}
                    >
                      Request ID
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
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
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("submittedDate")}
                    >
                      Submitted
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("approvalDate")}
                    >
                      Approval Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No approval records found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {approval.requestId}
                      </TableCell>
                      <TableCell>
                        {getRequestTypeBadge(approval.requestType)}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={approval.title}
                      >
                        {approval.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {approval.requester}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {approval.requesterEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{approval.requesterDepartment}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(approval.amount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(approval.submittedDate)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(approval.approvalDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(approval.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{approval.approver}</span>
                          <span className="text-xs text-muted-foreground">
                            {approval.approverRole}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(approval)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
                    <SelectItem value="50">50</SelectItem>
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

      {/* Approval Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Approval Details</span>
              {selectedApproval && getStatusBadge(selectedApproval.status)}
            </DialogTitle>
            <DialogDescription>
              Request #{selectedApproval?.requestId}
            </DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Request Type
                  </p>
                  <div>{getRequestTypeBadge(selectedApproval.requestType)}</div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Title
                  </p>
                  <p className="font-medium">{selectedApproval.title}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedApproval.amount)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Submitted Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(selectedApproval.submittedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Requester Info */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Requester Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedApproval.requester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedApproval.requesterEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>{selectedApproval.requesterDepartment}</p>
                  </div>
                </div>
              </div>

              {/* Approval Info */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approval Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Approver</p>
                    <p className="font-medium">{selectedApproval.approver}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedApproval.approverRole}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Approval Date
                    </p>
                    <p>{formatDate(selectedApproval.approvalDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Approval Level
                    </p>
                    <p>
                      Level {selectedApproval.level}:{" "}
                      {selectedApproval.levelName}
                    </p>
                  </div>
                  {selectedApproval.previousApprover && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Previous Approver
                      </p>
                      <p>{selectedApproval.previousApprover}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{selectedApproval.comments}</p>
                </div>
                {selectedApproval.reviewerNotes && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Reviewer Notes
                    </p>
                    <p className="text-sm mt-1">
                      {selectedApproval.reviewerNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {selectedApproval.attachments &&
                selectedApproval.attachments.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-3">Attachments</h3>
                    <div className="space-y-2">
                      {selectedApproval.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Metadata (if any) */}
              {selectedApproval.metadata && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-3">
                    Additional Information
                  </h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(selectedApproval.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
