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
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  FileText,
  MessageSquare,
  AlertCircle,
  Filter,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Bell,
  CheckSquare,
  XSquare,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
interface PendingApproval {
  id: number;
  requestId: string;
  requestType: "expense" | "purchase" | "leave" | "budget" | "contract";
  title: string;
  description: string;
  requester: {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
    avatar?: string;
  };
  amount?: number;
  submittedDate: string;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  currentLevel: number;
  levelName: string;
  previousApprovers?: {
    name: string;
    date: string;
    decision: string;
  }[];
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
  metadata?: Record<string, any>;
  comments?: string;
}

// Mock Data
const mockPendingApprovals: PendingApproval[] = [
  {
    id: 1,
    requestId: "REQ-2026-011",
    requestType: "expense",
    title: "Q2 Marketing Campaign - Digital Ads",
    description:
      "Budget for Google Ads and social media advertising campaigns for Q2 2026",
    requester: {
      id: 101,
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
      position: "Marketing Manager",
    },
    amount: 15000000,
    submittedDate: "2026-03-20",
    dueDate: "2026-03-27",
    priority: "high",
    currentLevel: 2,
    levelName: "Finance Review",
    previousApprovers: [
      {
        name: "Sarah Johnson",
        date: "2026-03-21",
        decision: "Approved - Within department budget",
      },
    ],
    attachments: [
      { name: "campaign_plan_q2.pdf", url: "#", size: "2.3 MB" },
      { name: "budget_breakdown.xlsx", url: "#", size: "1.1 MB" },
    ],
    metadata: {
      campaignType: "Digital",
      expectedROI: "25%",
      targetAudience: "18-35",
    },
  },
  {
    id: 2,
    requestId: "REQ-2026-012",
    requestType: "purchase",
    title: "Laptop Upgrade - Development Team",
    description: "10 MacBook Pro laptops for new developers joining in April",
    requester: {
      id: 102,
      name: "Alice Chen",
      email: "alice.chen@company.com",
      department: "Engineering",
      position: "Tech Lead",
    },
    amount: 28000000,
    submittedDate: "2026-03-18",
    dueDate: "2026-03-25",
    priority: "medium",
    currentLevel: 1,
    levelName: "Department Head",
    attachments: [
      { name: "hardware_specs.pdf", url: "#", size: "1.5 MB" },
      { name: "vendor_quote.pdf", url: "#", size: "0.8 MB" },
    ],
  },
  {
    id: 3,
    requestId: "REQ-2026-013",
    requestType: "leave",
    title: "Annual Leave Request - 5 days",
    description: "Requesting annual leave for family vacation",
    requester: {
      id: 103,
      name: "David Wilson",
      email: "david.wilson@company.com",
      department: "Sales",
      position: "Sales Representative",
    },
    submittedDate: "2026-03-21",
    dueDate: "2026-03-28",
    priority: "low",
    currentLevel: 1,
    levelName: "Team Lead",
    metadata: {
      leaveStart: "2026-04-10",
      leaveEnd: "2026-04-14",
      leaveType: "Annual",
      daysRequested: 5,
    },
  },
  {
    id: 4,
    requestId: "REQ-2026-014",
    requestType: "budget",
    title: "R&D Budget Increase - Q2",
    description:
      "Additional budget for AI research and development initiatives",
    requester: {
      id: 104,
      name: "Emily Brown",
      email: "emily.brown@company.com",
      department: "Engineering",
      position: "R&D Director",
    },
    amount: 50000000,
    submittedDate: "2026-03-15",
    dueDate: "2026-03-29",
    priority: "high",
    currentLevel: 3,
    levelName: "Executive Committee",
    previousApprovers: [
      {
        name: "Michael Lee",
        date: "2026-03-16",
        decision: "Approved - Aligns with strategic goals",
      },
      {
        name: "Finance Team",
        date: "2026-03-18",
        decision: "Pending budget availability review",
      },
    ],
    attachments: [
      { name: "ai_roadmap.pdf", url: "#", size: "3.2 MB" },
      { name: "roi_analysis.xlsx", url: "#", size: "2.1 MB" },
    ],
    comments: "This is critical for our competitive advantage",
  },
  {
    id: 5,
    requestId: "REQ-2026-015",
    requestType: "contract",
    title: "Cloud Services Agreement - AWS",
    description: "Annual renewal of AWS cloud services contract",
    requester: {
      id: 105,
      name: "Frank Miller",
      email: "frank.miller@company.com",
      department: "IT",
      position: "Infrastructure Manager",
    },
    amount: 120000000,
    submittedDate: "2026-03-19",
    dueDate: "2026-04-02",
    priority: "high",
    currentLevel: 2,
    levelName: "Legal Review",
    attachments: [
      { name: "aws_contract_2026.pdf", url: "#", size: "4.5 MB" },
      { name: "legal_review_notes.docx", url: "#", size: "1.2 MB" },
    ],
  },
  {
    id: 6,
    requestId: "REQ-2026-016",
    requestType: "expense",
    title: "Team Building Event - Q2",
    description: "Quarterly team building activity for the Sales department",
    requester: {
      id: 106,
      name: "Grace Lee",
      email: "grace.lee@company.com",
      department: "Sales",
      position: "Sales Manager",
    },
    amount: 2500000,
    submittedDate: "2026-03-22",
    dueDate: "2026-03-29",
    priority: "medium",
    currentLevel: 1,
    levelName: "Department Head",
    metadata: {
      eventDate: "2026-04-15",
      participants: 25,
      venue: "Offsite Location",
    },
  },
  {
    id: 7,
    requestId: "REQ-2026-017",
    requestType: "purchase",
    title: "Office Supplies - Stationery",
    description: "Bulk order of office stationery for all departments",
    requester: {
      id: 107,
      name: "Henry Adams",
      email: "henry.adams@company.com",
      department: "Operations",
      position: "Office Manager",
    },
    amount: 500000,
    submittedDate: "2026-03-23",
    dueDate: "2026-03-30",
    priority: "low",
    currentLevel: 1,
    levelName: "Operations Manager",
  },
  {
    id: 8,
    requestId: "REQ-2026-018",
    requestType: "expense",
    title: "Training Program - Leadership Development",
    description: "External leadership training for senior managers",
    requester: {
      id: 108,
      name: "Iris Taylor",
      email: "iris.taylor@company.com",
      department: "HR",
      position: "HR Business Partner",
    },
    amount: 8000000,
    submittedDate: "2026-03-21",
    dueDate: "2026-03-28",
    priority: "medium",
    currentLevel: 2,
    levelName: "HR Leadership",
    previousApprovers: [
      {
        name: "HR Director",
        date: "2026-03-22",
        decision: "Approved - High potential impact",
      },
    ],
    attachments: [
      { name: "training_proposal.pdf", url: "#", size: "1.8 MB" },
      { name: "vendor_profile.pdf", url: "#", size: "0.9 MB" },
    ],
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
const priorityLevels = ["all", "high", "medium", "low"];
const departments = [
  "all",
  "Marketing",
  "Engineering",
  "Sales",
  "HR",
  "IT",
  "Operations",
  "Finance",
  "Legal",
];

export default function PendingApprovals() {
  const router = useRouter();

  // State
  const [pendingApprovals, setPendingApprovals] =
    useState<PendingApproval[]>(mockPendingApprovals);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PendingApproval;
    direction: "asc" | "desc";
  }>({ key: "submittedDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] =
    useState<PendingApproval | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Statistics
  const stats = useMemo(() => {
    const totalPending = pendingApprovals.length;
    const highPriority = pendingApprovals.filter(
      (p) => p.priority === "high",
    ).length;
    const mediumPriority = pendingApprovals.filter(
      (p) => p.priority === "medium",
    ).length;
    const lowPriority = pendingApprovals.filter(
      (p) => p.priority === "low",
    ).length;
    const totalAmount = pendingApprovals.reduce(
      (sum, p) => sum + (p.amount || 0),
      0,
    );
    const overdueCount = pendingApprovals.filter((p) => {
      if (!p.dueDate) return false;
      return new Date(p.dueDate) < new Date();
    }).length;
    const urgentCount = pendingApprovals.filter(
      (p) =>
        p.priority === "high" ||
        (p.dueDate && new Date(p.dueDate) < new Date()),
    ).length;

    return {
      totalPending,
      highPriority,
      mediumPriority,
      lowPriority,
      totalAmount,
      overdueCount,
      urgentCount,
      avgAmount: totalPending > 0 ? totalAmount / totalPending : 0,
    };
  }, [pendingApprovals]);

  // Filter and sort
  const filteredApprovals = useMemo(() => {
    let result = [...pendingApprovals];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.requestId.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.requester.name.toLowerCase().includes(query) ||
          p.requester.department.toLowerCase().includes(query),
      );
    }

    if (requestTypeFilter !== "all") {
      result = result.filter((p) => p.requestType === requestTypeFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter(
        (p) => p.requester.department === departmentFilter,
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (
          sortConfig.key === "submittedDate" ||
          sortConfig.key === "dueDate"
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
    pendingApprovals,
    searchQuery,
    requestTypeFilter,
    priorityFilter,
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
  const handleSort = (key: keyof PendingApproval) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewRequest = (request: PendingApproval) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
    setActiveTab("overview");
  };

  const handleApprove = () => {
    if (!selectedRequest) return;

    // In real app, send to API
    console.log(
      "Approved:",
      selectedRequest.requestId,
      "Comment:",
      approvalComment,
    );

    // Remove from pending list
    setPendingApprovals((prev) =>
      prev.filter((p) => p.id !== selectedRequest.id),
    );

    // Reset and close
    setApprovalComment("");
    setIsApproveDialogOpen(false);
    setIsViewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest) return;

    // In real app, send to API
    console.log(
      "Rejected:",
      selectedRequest.requestId,
      "Reason:",
      approvalComment,
    );

    // Remove from pending list
    setPendingApprovals((prev) =>
      prev.filter((p) => p.id !== selectedRequest.id),
    );

    // Reset and close
    setApprovalComment("");
    setIsRejectDialogOpen(false);
    setIsViewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleBulkApprove = () => {
    // In real app, implement bulk approval
    console.log("Bulk approve selected items");
  };

  const getPriorityBadge = (priority: PendingApproval["priority"]) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };

    const labels = {
      high: "High",
      medium: "Medium",
      low: "Low",
    };

    return (
      <Badge className={`${styles[priority]} flex items-center gap-1 w-fit`}>
        <AlertCircle className="h-3 w-3" />
        {labels[priority]}
      </Badge>
    );
  };

  const getRequestTypeBadge = (type: PendingApproval["requestType"]) => {
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

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleRefresh = () => {
    setPendingApprovals([...mockPendingApprovals]);
    setCurrentPage(1);
    setSearchQuery("");
    setRequestTypeFilter("all");
    setPriorityFilter("all");
    setDepartmentFilter("all");
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
              Pending Approvals
              <Badge variant="secondary" className="ml-2">
                {stats.totalPending}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and take action on requests awaiting your approval
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkApprove}
            className="gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            Bulk Action
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">{stats.totalPending}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent Requests</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.urgentCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.overdueCount}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
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
                placeholder="Search by ID, title, requester..."
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
              value={priorityFilter}
              onValueChange={(v) => {
                setPriorityFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <AlertCircle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority === "all"
                      ? "All Priorities"
                      : priority.charAt(0).toUpperCase() + priority.slice(1)}
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

      {/* Pending Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Requests Awaiting Approval</CardTitle>
          <CardDescription>
            {filteredApprovals.length} pending request
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
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No pending approvals found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All caught up! 🎉
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApprovals.map((request) => (
                    <TableRow
                      key={request.id}
                      className={
                        isOverdue(request.dueDate) ? "bg-red-50/30" : ""
                      }
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        {request.requestId}
                      </TableCell>
                      <TableCell>
                        {getRequestTypeBadge(request.requestType)}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={request.title}
                      >
                        {request.title}
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
                      <TableCell className="text-sm">
                        {formatDate(request.submittedDate)}
                      </TableCell>
                      <TableCell>
                        {request.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span
                              className={`text-sm ${isOverdue(request.dueDate) ? "text-red-600 font-medium" : ""}`}
                            >
                              {formatDate(request.dueDate)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Level {request.currentLevel}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {request.levelName}
                          </span>
                        </div>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsApproveDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsRejectDialogOpen(true);
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Request Details</span>
              {selectedRequest && getPriorityBadge(selectedRequest.priority)}
            </DialogTitle>
            <DialogDescription>
              Request #{selectedRequest?.requestId} -{" "}
              {selectedRequest?.levelName} Level {selectedRequest?.currentLevel}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="approval">Approval Flow</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Request Type
                    </p>
                    <div className="mt-1">
                      {getRequestTypeBadge(selectedRequest.requestType)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-medium">{selectedRequest.title}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1">{selectedRequest.description}</p>
                  </div>
                  {selectedRequest.amount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(selectedRequest.amount)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Submitted Date
                    </p>
                    <p>{formatDate(selectedRequest.submittedDate)}</p>
                  </div>
                  {selectedRequest.dueDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p
                        className={
                          isOverdue(selectedRequest.dueDate)
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {formatDate(selectedRequest.dueDate)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Requester Information
                  </h3>
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
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
                      <p>{selectedRequest.requester.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Position</p>
                      <p>{selectedRequest.requester.position}</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.comments && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Additional Comments
                    </h3>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">{selectedRequest.comments}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-4 py-4">
                {selectedRequest.metadata && (
                  <div>
                    <h3 className="font-semibold mb-3">
                      Additional Information
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(selectedRequest.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                {!selectedRequest.metadata && (
                  <div className="text-center py-8 text-muted-foreground">
                    No additional details available
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approval" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Current Level: {selectedRequest.levelName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Waiting for your decision
                      </p>
                    </div>
                  </div>

                  {selectedRequest.previousApprovers &&
                    selectedRequest.previousApprovers.map((approver, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{approver.name}</p>
                          <p className="text-sm">{approver.decision}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(approver.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4 py-4">
                {selectedRequest.attachments &&
                selectedRequest.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No attachments available
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedRequest && (
              <>
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsRejectDialogOpen(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewModalOpen(false);
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
              Are you sure you want to approve this request?
              {selectedRequest && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedRequest.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(selectedRequest.amount)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Approval Comment (Optional)</Label>
            <Textarea
              placeholder="Add any comments or notes..."
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApprovalComment("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
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
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request.
              {selectedRequest && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedRequest.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(selectedRequest.amount)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Rejection Reason *</Label>
            <Textarea
              placeholder="Please explain why this request is being rejected..."
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="mt-2"
              rows={4}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApprovalComment("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
