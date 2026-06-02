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
  DialogTrigger,
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
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Receipt,
  DollarSign,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  Eye,
  Banknote,
  Paperclip,
  AlertCircle,
  TrendingUp,
  Wallet,
  PiggyBank,
} from "lucide-react";

// Types
interface Reimbursement {
  id: number;
  employeeName: string;
  employeeEmail: string;
  department: string;
  expenseReport: string;
  category: string;
  amount: number;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "paid";
  description: string;
  attachments?: string[];
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  notes?: string;
}

// Initial Data
const initialReimbursements: Reimbursement[] = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeEmail: "john.doe@company.com",
    department: "Engineering",
    expenseReport: "Travel to Lagos",
    category: "Travel",
    amount: 580000,
    submittedDate: "2026-05-28",
    status: "approved",
    description:
      "Business trip to Lagos for client meeting. Includes flight and accommodation.",
    attachments: ["flight_receipt.pdf", "hotel_invoice.pdf"],
    approvedBy: "Sarah Williams",
    approvedDate: "2026-05-30",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeEmail: "jane.smith@company.com",
    department: "Design",
    expenseReport: "Office Supplies",
    category: "Supplies",
    amount: 340000,
    submittedDate: "2026-06-01",
    status: "pending",
    description:
      "Purchase of design materials and software licenses for Q3 projects.",
    attachments: ["receipt_001.pdf"],
  },
  {
    id: 3,
    employeeName: "Bob King",
    employeeEmail: "bob.king@company.com",
    department: "Sales",
    expenseReport: "Client Dinner",
    category: "Entertainment",
    amount: 125000,
    submittedDate: "2026-05-30",
    status: "pending",
    description: "Dinner meeting with potential client at Eko Hotel.",
  },
  {
    id: 4,
    employeeName: "Alice Johnson",
    employeeEmail: "alice.johnson@company.com",
    department: "Marketing",
    expenseReport: "Conference Registration",
    category: "Professional Development",
    amount: 250000,
    submittedDate: "2026-05-25",
    status: "paid",
    description: "Annual marketing conference registration fee.",
    attachments: ["conference_registration.pdf"],
    approvedBy: "Mike Brown",
    approvedDate: "2026-05-27",
    paidDate: "2026-05-29",
  },
  {
    id: 5,
    employeeName: "Tom Wilson",
    employeeEmail: "tom.wilson@company.com",
    department: "Engineering",
    expenseReport: "Server Maintenance",
    category: "IT Equipment",
    amount: 890000,
    submittedDate: "2026-05-22",
    status: "rejected",
    description: "Emergency server maintenance and replacement parts.",
    attachments: ["maintenance_report.pdf", "parts_invoice.pdf"],
    notes:
      "Not in budget for this quarter. Please resubmit with proper approval.",
  },
  {
    id: 6,
    employeeName: "Emma Davis",
    employeeEmail: "emma.davis@company.com",
    department: "HR",
    expenseReport: "Training Materials",
    category: "Training",
    amount: 175000,
    submittedDate: "2026-06-02",
    status: "pending",
    description:
      "Purchase of training materials for new hire orientation program.",
  },
  {
    id: 7,
    employeeName: "Mike Roberts",
    employeeEmail: "mike.roberts@company.com",
    department: "Operations",
    expenseReport: "Delivery Services",
    category: "Logistics",
    amount: 95000,
    submittedDate: "2026-05-31",
    status: "approved",
    description: "Express delivery charges for urgent client documents.",
    approvedBy: "Sarah Williams",
    approvedDate: "2026-06-01",
  },
  {
    id: 8,
    employeeName: "Lisa Chen",
    employeeEmail: "lisa.chen@company.com",
    department: "Finance",
    expenseReport: "Software Subscription",
    category: "Software",
    amount: 420000,
    submittedDate: "2026-05-20",
    status: "paid",
    description: "Annual subscription for accounting software.",
    attachments: ["invoice_software.pdf"],
    approvedBy: "David Brown",
    approvedDate: "2026-05-22",
    paidDate: "2026-05-25",
  },
];

const categories = [
  "Travel",
  "Supplies",
  "Entertainment",
  "Professional Development",
  "IT Equipment",
  "Training",
  "Logistics",
  "Software",
  "Office Equipment",
  "Utilities",
  "Other",
];

export default function ReimbursementsPage() {
  // State
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(
    initialReimbursements,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Reimbursement;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] =
    useState<Reimbursement | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
    department: "",
    expenseReport: "",
    category: "",
    amount: 0,
    submittedDate: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const pending = reimbursements.filter((r) => r.status === "pending");
    const totalPendingAmount = pending.reduce((sum, r) => sum + r.amount, 0);
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthReimbursements = reimbursements.filter((r) => {
      const date = new Date(r.submittedDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    const thisMonthAmount = thisMonthReimbursements.reduce(
      (sum, r) => sum + r.amount,
      0,
    );
    const approvedThisMonth = reimbursements.filter(
      (r) => r.status === "approved" || r.status === "paid",
    ).length;
    const totalPaid = reimbursements
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      pendingCount: pending.length,
      totalPendingAmount,
      thisMonthAmount,
      approvedThisMonth,
      totalPaid,
    };
  }, [reimbursements]);

  // Filter and sort
  const filteredReimbursements = useMemo(() => {
    let result = [...reimbursements];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(query) ||
          r.employeeEmail.toLowerCase().includes(query) ||
          r.expenseReport.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.department.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    // Sort
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

    return result;
  }, [reimbursements, searchQuery, statusFilter, categoryFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredReimbursements.length / itemsPerPage);
  const paginatedReimbursements = filteredReimbursements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Reimbursement) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.employeeName.trim())
      errors.employeeName = "Employee name is required";
    if (!formData.employeeEmail.trim()) {
      errors.employeeEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.employeeEmail)) {
      errors.employeeEmail = "Invalid email format";
    }
    if (!formData.department) errors.department = "Department is required";
    if (!formData.expenseReport.trim())
      errors.expenseReport = "Expense report is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.amount || formData.amount <= 0)
      errors.amount = "Valid amount is required";
    if (!formData.submittedDate) errors.submittedDate = "Date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddReimbursement = () => {
    if (!validateForm()) return;

    const newReimbursement: Reimbursement = {
      id: Math.max(...reimbursements.map((r) => r.id), 0) + 1,
      ...formData,
      amount: formData.amount,
      status: "pending",
      description: formData.description,
    };

    setReimbursements((prev) => [newReimbursement, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleApprove = () => {
    if (!selectedReimbursement) return;

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id
          ? {
              ...r,
              status: "approved",
              approvedBy: "Admin User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );

    setIsApproveDialogOpen(false);
    setSelectedReimbursement(null);
  };

  const handleReject = () => {
    if (!selectedReimbursement) return;

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id
          ? {
              ...r,
              status: "rejected",
              notes: rejectionNote || "Rejected",
            }
          : r,
      ),
    );

    setRejectionNote("");
    setIsRejectDialogOpen(false);
    setSelectedReimbursement(null);
  };

  const handlePay = () => {
    if (!selectedReimbursement) return;

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id
          ? {
              ...r,
              status: "paid",
              paidDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );

    setIsPayDialogOpen(false);
    setSelectedReimbursement(null);
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeEmail: "",
      department: "",
      expenseReport: "",
      category: "",
      amount: 0,
      submittedDate: new Date().toISOString().split("T")[0],
      description: "",
    });
    setFormErrors({});
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Reimbursement["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Banknote className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Reimbursements
          </h1>
          <p className="text-muted-foreground mt-1">
            Process and track employee reimbursements
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reimbursement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit New Reimbursement</DialogTitle>
              <DialogDescription>
                Fill in the reimbursement details below. All fields marked with
                * are required.
              </DialogDescription>
            </DialogHeader>
            <ReimbursementForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddReimbursement}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  reimbursements
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
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalPendingAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  waiting approval
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.thisMonthAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  total submitted
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalPaid)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">completed</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee, report, category..."
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
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
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
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Queue</CardTitle>
          <CardDescription>
            {filteredReimbursements.length} reimbursement
            {filteredReimbursements.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Expense Report</TableHead>
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
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("submittedDate")}
                    >
                      Submitted
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReimbursements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No reimbursements found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                              {getInitials(reimbursement.employeeName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {reimbursement.employeeName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reimbursement.department}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">
                            {reimbursement.expenseReport}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {reimbursement.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(reimbursement.amount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(reimbursement.submittedDate)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reimbursement.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => {
                              setSelectedReimbursement(reimbursement);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {reimbursement.status === "pending" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReimbursement(reimbursement);
                                    setIsApproveDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReimbursement(reimbursement);
                                    setIsRejectDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          {reimbursement.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                              onClick={() => {
                                setSelectedReimbursement(reimbursement);
                                setIsPayDialogOpen(true);
                              }}
                            >
                              <Banknote className="h-4 w-4 mr-1" />
                              Pay
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
          {filteredReimbursements.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
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
                    filteredReimbursements.length,
                  )}{" "}
                  of {filteredReimbursements.length}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reimbursement Details</DialogTitle>
            <DialogDescription>
              Complete information about this reimbursement request.
            </DialogDescription>
          </DialogHeader>
          {selectedReimbursement && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(selectedReimbursement.employeeName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {selectedReimbursement.employeeName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReimbursement.employeeEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedReimbursement.department}
                  </p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedReimbursement.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Expense Report
                  </p>
                  <p className="font-medium">
                    {selectedReimbursement.expenseReport}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="secondary">
                    {selectedReimbursement.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(selectedReimbursement.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p>{formatDate(selectedReimbursement.submittedDate)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm">{selectedReimbursement.description}</p>
              </div>

              {selectedReimbursement.attachments && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Attachments
                  </p>
                  <div className="space-y-2">
                    {selectedReimbursement.attachments.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm"
                      >
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReimbursement.approvedBy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Approved by</p>
                  <p className="font-medium">
                    {selectedReimbursement.approvedBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selectedReimbursement.approvedDate || "")}
                  </p>
                </div>
              )}

              {selectedReimbursement.paidDate && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Paid on</p>
                  <p className="font-medium">
                    {formatDate(selectedReimbursement.paidDate)}
                  </p>
                </div>
              )}

              {selectedReimbursement.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm text-red-600">
                    {selectedReimbursement.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedReimbursement?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsRejectDialogOpen(true);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsApproveDialogOpen(true);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            {selectedReimbursement?.status === "approved" && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsPayDialogOpen(true);
                }}
              >
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Reimbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve the reimbursement request from{" "}
              <strong>{selectedReimbursement?.employeeName}</strong> for{" "}
              <strong>
                {selectedReimbursement &&
                  formatCurrency(selectedReimbursement.amount)}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            <AlertDialogTitle>Reject Reimbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this reimbursement request
              from <strong>{selectedReimbursement?.employeeName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionNote">Rejection Reason</Label>
            <Textarea
              id="rejectionNote"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
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
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pay Confirmation */}
      <AlertDialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Paid</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that the payment of{" "}
              <strong>
                {selectedReimbursement &&
                  formatCurrency(selectedReimbursement.amount)}
              </strong>{" "}
              to <strong>{selectedReimbursement?.employeeName}</strong> has been
              processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePay}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Reimbursement Form Component
function ReimbursementForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
}: {
  formData: {
    employeeName: string;
    employeeEmail: string;
    department: string;
    expenseReport: string;
    category: string;
    amount: number;
    submittedDate: string;
    description: string;
  };
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="employeeName">Employee Name *</Label>
        <Input
          id="employeeName"
          name="employeeName"
          value={formData.employeeName}
          onChange={onInputChange}
          placeholder="John Doe"
        />
        {formErrors.employeeName && (
          <p className="text-sm text-red-500">{formErrors.employeeName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeEmail">Employee Email *</Label>
        <Input
          id="employeeEmail"
          name="employeeEmail"
          type="email"
          value={formData.employeeEmail}
          onChange={onInputChange}
          placeholder="john.doe@company.com"
        />
        {formErrors.employeeEmail && (
          <p className="text-sm text-red-500">{formErrors.employeeEmail}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department *</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => onSelectChange("department", value)}
        >
          <SelectTrigger id="department">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.department && (
          <p className="text-sm text-red-500">{formErrors.department}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expenseReport">Expense Report *</Label>
        <Input
          id="expenseReport"
          name="expenseReport"
          value={formData.expenseReport}
          onChange={onInputChange}
          placeholder="e.g., Travel to Lagos"
        />
        {formErrors.expenseReport && (
          <p className="text-sm text-red-500">{formErrors.expenseReport}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onSelectChange("category", value)}
        >
          <SelectTrigger id="category">
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
          <p className="text-sm text-red-500">{formErrors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (NGN) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount || ""}
          onChange={onInputChange}
          placeholder="500000"
        />
        {formErrors.amount && (
          <p className="text-sm text-red-500">{formErrors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="submittedDate">Submitted Date *</Label>
        <Input
          id="submittedDate"
          name="submittedDate"
          type="date"
          value={formData.submittedDate}
          onChange={onInputChange}
        />
        {formErrors.submittedDate && (
          <p className="text-sm text-red-500">{formErrors.submittedDate}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Provide details about this expense..."
          rows={3}
        />
      </div>
    </div>
  );
}
