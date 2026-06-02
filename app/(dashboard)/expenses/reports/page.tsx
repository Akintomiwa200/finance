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
  Eye,
  Pencil,
  Trash2,
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
  Send,
  Printer,
  Paperclip,
  PlusCircle,
  MinusCircle,
  Building2,
  TrendingUp,
  AlertCircle,
  FileCheck,
  PiggyBank,
} from "lucide-react";

// Types
interface ExpenseItem {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  receipt?: string;
}

interface ExpenseReport {
  id: number;
  title: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  items: ExpenseItem[];
  totalAmount: number;
  submittedDate: string;
  status: "draft" | "submitted" | "approved" | "rejected" | "reimbursed";
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  reimbursedDate?: string;
  rejectionReason?: string;
}

// Initial Data
const initialReports: ExpenseReport[] = [
  {
    id: 1,
    title: "Travel to Lagos",
    employeeName: "John Doe",
    employeeEmail: "john.doe@company.com",
    department: "Engineering",
    items: [
      {
        id: 1,
        description: "Flight Ticket",
        category: "Travel",
        amount: 350000,
        date: "2026-05-20",
      },
      {
        id: 2,
        description: "Hotel Accommodation",
        category: "Lodging",
        amount: 180000,
        date: "2026-05-21",
      },
      {
        id: 3,
        description: "Airport Taxi",
        category: "Transport",
        amount: 50000,
        date: "2026-05-20",
      },
    ],
    totalAmount: 580000,
    submittedDate: "2026-05-28",
    status: "approved",
    approvedBy: "Sarah Williams",
    approvedDate: "2026-05-30",
  },
  {
    id: 2,
    title: "Office Supplies",
    employeeName: "Jane Smith",
    employeeEmail: "jane.smith@company.com",
    department: "Design",
    items: [
      {
        id: 1,
        description: "Design Software License",
        category: "Software",
        amount: 250000,
        date: "2026-05-28",
      },
      {
        id: 2,
        description: "Drawing Tablet",
        category: "Equipment",
        amount: 90000,
        date: "2026-05-29",
      },
    ],
    totalAmount: 340000,
    submittedDate: "2026-06-01",
    status: "submitted",
  },
  {
    id: 3,
    title: "Client Dinner",
    employeeName: "Bob King",
    employeeEmail: "bob.king@company.com",
    department: "Sales",
    items: [
      {
        id: 1,
        description: "Dinner at Eko Hotel",
        category: "Entertainment",
        amount: 125000,
        date: "2026-05-30",
      },
    ],
    totalAmount: 125000,
    submittedDate: "2026-05-30",
    status: "reimbursed",
    approvedBy: "Mike Brown",
    approvedDate: "2026-06-01",
    reimbursedDate: "2026-06-02",
  },
  {
    id: 4,
    title: "Software Licenses",
    employeeName: "Alice Lee",
    employeeEmail: "alice.lee@company.com",
    department: "IT",
    items: [
      {
        id: 1,
        description: "Adobe Creative Suite Annual",
        category: "Software",
        amount: 1200000,
        date: "2026-05-25",
      },
      {
        id: 2,
        description: "Figma Pro License",
        category: "Software",
        amount: 450000,
        date: "2026-05-26",
      },
      {
        id: 3,
        description: "VS Code Enterprise",
        category: "Software",
        amount: 450000,
        date: "2026-05-27",
      },
    ],
    totalAmount: 2100000,
    submittedDate: "2026-06-02",
    status: "draft",
  },
  {
    id: 5,
    title: "Marketing Conference",
    employeeName: "Emma Wilson",
    employeeEmail: "emma.wilson@company.com",
    department: "Marketing",
    items: [
      {
        id: 1,
        description: "Conference Registration",
        category: "Professional Development",
        amount: 300000,
        date: "2026-05-15",
      },
      {
        id: 2,
        description: "Travel Expenses",
        category: "Travel",
        amount: 200000,
        date: "2026-05-16",
      },
      {
        id: 3,
        description: "Marketing Materials",
        category: "Supplies",
        amount: 150000,
        date: "2026-05-17",
      },
    ],
    totalAmount: 650000,
    submittedDate: "2026-05-20",
    status: "rejected",
    rejectionReason:
      "Budget exceeded. Please provide additional justification for travel expenses.",
  },
  {
    id: 6,
    title: "Team Building Event",
    employeeName: "Mike Roberts",
    employeeEmail: "mike.roberts@company.com",
    department: "HR",
    items: [
      {
        id: 1,
        description: "Venue Rental",
        category: "Events",
        amount: 400000,
        date: "2026-05-10",
      },
      {
        id: 2,
        description: "Catering Service",
        category: "Food",
        amount: 300000,
        date: "2026-05-10",
      },
    ],
    totalAmount: 700000,
    submittedDate: "2026-05-12",
    status: "submitted",
  },
];

const expenseCategories = [
  "Travel",
  "Lodging",
  "Transport",
  "Food",
  "Entertainment",
  "Software",
  "Equipment",
  "Supplies",
  "Professional Development",
  "Events",
  "Utilities",
  "Other",
];

export default function ExpenseReportsPage() {
  // State
  const [reports, setReports] = useState<ExpenseReport[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ExpenseReport;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isReimburseDialogOpen, setIsReimburseDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    employeeName: "",
    employeeEmail: "",
    department: "",
    items: [] as ExpenseItem[],
    submittedDate: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const draft = reports.filter((r) => r.status === "draft").length;
    const submitted = reports.filter((r) => r.status === "submitted").length;
    const approved = reports.filter((r) => r.status === "approved").length;
    const reimbursed = reports.filter((r) => r.status === "reimbursed").length;
    const totalAmount = reports.reduce((sum, r) => sum + r.totalAmount, 0);
    const reimbursedAmount = reports
      .filter((r) => r.status === "reimbursed")
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const pendingAmount = reports
      .filter((r) => r.status === "submitted" || r.status === "approved")
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      draft,
      submitted,
      approved,
      reimbursed,
      totalAmount,
      reimbursedAmount,
      pendingAmount,
    };
  }, [reports]);

  // Filter and sort
  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.employeeName.toLowerCase().includes(query) ||
          r.employeeEmail.toLowerCase().includes(query) ||
          r.department.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
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

    // Default sort by submitted date descending
    result.sort(
      (a, b) =>
        new Date(b.submittedDate).getTime() -
        new Date(a.submittedDate).getTime(),
    );

    return result;
  }, [reports, searchQuery, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof ExpenseReport) => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addExpenseItem = () => {
    const newItem: ExpenseItem = {
      id: Date.now(),
      description: "",
      category: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeExpenseItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateExpenseItem = (
    itemId: number,
    field: keyof ExpenseItem,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                field === "amount" ? parseFloat(value as string) || 0 : value,
            }
          : item,
      ),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = "Report title is required";
    if (!formData.employeeName.trim())
      errors.employeeName = "Employee name is required";
    if (!formData.employeeEmail.trim()) {
      errors.employeeEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.employeeEmail)) {
      errors.employeeEmail = "Invalid email format";
    }
    if (!formData.department) errors.department = "Department is required";
    if (formData.items.length === 0)
      errors.items = "At least one expense item is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = (items: ExpenseItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleAddReport = () => {
    if (!validateForm()) return;

    const newReport: ExpenseReport = {
      id: Math.max(...reports.map((r) => r.id), 0) + 1,
      title: formData.title,
      employeeName: formData.employeeName,
      employeeEmail: formData.employeeEmail,
      department: formData.department,
      items: formData.items,
      totalAmount: calculateTotal(formData.items),
      submittedDate: formData.submittedDate,
      status: "draft",
    };

    setReports((prev) => [newReport, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditReport = () => {
    if (!validateForm() || !selectedReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? {
              ...r,
              title: formData.title,
              employeeName: formData.employeeName,
              employeeEmail: formData.employeeEmail,
              department: formData.department,
              items: formData.items,
              totalAmount: calculateTotal(formData.items),
              submittedDate: formData.submittedDate,
            }
          : r,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = () => {
    if (!selectedReport) return;

    setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    setIsDeleteDialogOpen(false);
    setSelectedReport(null);
  };

  const handleSubmitReport = () => {
    if (!selectedReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status: "submitted" } : r,
      ),
    );

    setIsSubmitDialogOpen(false);
    setSelectedReport(null);
  };

  const handleApproveReport = () => {
    if (!selectedReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
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
    setSelectedReport(null);
  };

  const handleRejectReport = () => {
    if (!selectedReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? { ...r, status: "rejected", rejectionReason }
          : r,
      ),
    );

    setRejectionReason("");
    setIsRejectDialogOpen(false);
    setSelectedReport(null);
  };

  const handleReimburseReport = () => {
    if (!selectedReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? {
              ...r,
              status: "reimbursed",
              reimbursedDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );

    setIsReimburseDialogOpen(false);
    setSelectedReport(null);
  };

  const openEditModal = (report: ExpenseReport) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      employeeName: report.employeeName,
      employeeEmail: report.employeeEmail,
      department: report.department,
      items: [...report.items],
      submittedDate: report.submittedDate,
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (report: ExpenseReport) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (report: ExpenseReport) => {
    setSelectedReport(report);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      employeeName: "",
      employeeEmail: "",
      department: "",
      items: [],
      submittedDate: new Date().toISOString().split("T")[0],
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

  const getStatusBadge = (status: ExpenseReport["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Submitted
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
      case "reimbursed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <PiggyBank className="h-3 w-3 mr-1" />
            Reimbursed
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

  const canEdit = (status: string) => status === "draft";
  const canSubmit = (status: string) => status === "draft";
  const canApprove = (status: string) => status === "submitted";
  const canReimburse = (status: string) => status === "approved";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Expense Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Track employee expense submissions and approvals
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Expense Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Expense Report</DialogTitle>
              <DialogDescription>
                Fill in the expense report details. Add individual expense items
                below.
              </DialogDescription>
            </DialogHeader>
            <ExpenseReportForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onAddItem={addExpenseItem}
              onRemoveItem={removeExpenseItem}
              onUpdateItem={updateExpenseItem}
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
              <Button onClick={handleAddReport}>Save as Draft</Button>
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
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.submitted}</p>
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
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
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
                <p className="text-sm text-muted-foreground">
                  Total Reimbursed
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.reimbursedAmount)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by title, employee, department..."
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
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="reimbursed">Reimbursed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expense Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Expense Reports</CardTitle>
          <CardDescription>
            {filteredReports.length} report
            {filteredReports.length !== 1 ? "s" : ""} found
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
                      onClick={() => handleSort("title")}
                    >
                      Title
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("totalAmount")}
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
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No expense reports found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-sm">
                            {report.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                              {getInitials(report.employeeName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {report.employeeName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.department}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {report.items.length} item
                          {report.items.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(report.totalAmount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(report.submittedDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => openViewModal(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openViewModal(report)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canEdit(report.status) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => openEditModal(report)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setIsSubmitDialogOpen(true);
                                    }}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit for Approval
                                  </DropdownMenuItem>
                                </>
                              )}
                              {canApprove(report.status) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setIsApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setIsRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {canReimburse(report.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setIsReimburseDialogOpen(true);
                                  }}
                                >
                                  <PiggyBank className="h-4 w-4 mr-2 text-green-600" />
                                  Mark as Reimbursed
                                </DropdownMenuItem>
                              )}
                              {canEdit(report.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => openDeleteDialog(report)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredReports.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredReports.length)}{" "}
                  of {filteredReports.length}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Report Details</DialogTitle>
            <DialogDescription>
              Complete information about this expense report.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {getInitials(selectedReport.employeeName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedReport.employeeName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedReport.employeeEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedReport.department}
                    </p>
                  </div>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>

              {/* Report Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Report Title</p>
                  <p className="font-medium">{selectedReport.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Submitted Date
                  </p>
                  <p className="font-medium">
                    {formatDate(selectedReport.submittedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(selectedReport.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <Badge variant="secondary">
                    {selectedReport.items.length} items
                  </Badge>
                </div>
              </div>

              {/* Expense Items */}
              <div>
                <p className="font-medium mb-3">Expense Items</p>
                <div className="border rounded-lg divide-y">
                  <div className="grid grid-cols-4 gap-2 p-3 bg-muted text-xs font-medium text-muted-foreground">
                    <span>Description</span>
                    <span>Category</span>
                    <span>Amount</span>
                    <span>Date</span>
                  </div>
                  {selectedReport.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-4 gap-2 p-3 text-sm"
                    >
                      <span>{item.description}</span>
                      <Badge variant="outline" className="w-fit text-xs">
                        {item.category}
                      </Badge>
                      <span className="font-medium">
                        {formatCurrency(item.amount)}
                      </span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 font-semibold text-sm">
                    <span>Total</span>
                    <span></span>
                    <span>{formatCurrency(selectedReport.totalAmount)}</span>
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Approval Info */}
              {selectedReport.approvedBy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Approved by</p>
                  <p className="font-medium">{selectedReport.approvedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selectedReport.approvedDate || "")}
                  </p>
                </div>
              )}

              {/* Reimbursement Info */}
              {selectedReport.reimbursedDate && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Reimbursed on</p>
                  <p className="font-medium">
                    {formatDate(selectedReport.reimbursedDate)}
                  </p>
                </div>
              )}

              {/* Rejection Info */}
              {selectedReport.rejectionReason && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-600">
                    {selectedReport.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedReport && canSubmit(selectedReport.status) && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsSubmitDialogOpen(true);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            )}
            {selectedReport && canApprove(selectedReport.status) && (
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
            {selectedReport && canReimburse(selectedReport.status) && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsReimburseDialogOpen(true);
                }}
              >
                Mark as Reimbursed
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Expense Report</DialogTitle>
            <DialogDescription>
              Update the expense report details and items.
            </DialogDescription>
          </DialogHeader>
          <ExpenseReportForm
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onAddItem={addExpenseItem}
            onRemoveItem={removeExpenseItem}
            onUpdateItem={updateExpenseItem}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditReport}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation */}
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit for Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this expense report for{" "}
              <strong>
                {selectedReport && formatCurrency(selectedReport.totalAmount)}
              </strong>{" "}
              for approval? Once submitted, it cannot be edited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitReport}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Expense Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this expense report from{" "}
              <strong>{selectedReport?.employeeName}</strong> for{" "}
              <strong>
                {selectedReport && formatCurrency(selectedReport.totalAmount)}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveReport}
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
            <AlertDialogTitle>Reject Expense Report</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this expense report from{" "}
              <strong>{selectedReport?.employeeName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionReason">Rejection Reason</Label>
            <Textarea
              id="rejectionReason"
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
              onClick={handleRejectReport}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reimburse Confirmation */}
      <AlertDialog
        open={isReimburseDialogOpen}
        onOpenChange={setIsReimburseDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Reimbursed</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that the reimbursement of{" "}
              <strong>
                {selectedReport && formatCurrency(selectedReport.totalAmount)}
              </strong>{" "}
              to <strong>{selectedReport?.employeeName}</strong> has been
              processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReimburseReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Reimbursement
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
            <AlertDialogTitle>Delete Expense Report</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense report{" "}
              <strong>{selectedReport?.title}</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReport}
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

// Expense Report Form Component
function ExpenseReportForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  formData: {
    title: string;
    employeeName: string;
    employeeEmail: string;
    department: string;
    items: ExpenseItem[];
    submittedDate: string;
  };
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: number) => void;
  onUpdateItem: (
    itemId: number,
    field: keyof ExpenseItem,
    value: string | number,
  ) => void;
}) {
  const totalAmount = formData.items.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <div className="space-y-6 py-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Report Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="e.g., Travel to Lagos"
          />
          {formErrors.title && (
            <p className="text-sm text-red-500">{formErrors.title}</p>
          )}
        </div>

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
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.department && (
            <p className="text-sm text-red-500">{formErrors.department}</p>
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
        </div>
      </div>

      {/* Expense Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Expense Items *</Label>
          <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        {formErrors.items && (
          <p className="text-sm text-red-500">{formErrors.items}</p>
        )}

        {formData.items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Receipt className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No expense items added yet
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddItem}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add your first item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 border rounded-lg bg-muted/30"
              >
                <div className="sm:col-span-2">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      onUpdateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Item description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={item.category}
                    onValueChange={(value) =>
                      onUpdateItem(item.id, "category", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Amount (NGN)</Label>
                  <Input
                    type="number"
                    value={item.amount || ""}
                    onChange={(e) =>
                      onUpdateItem(item.id, "amount", e.target.value)
                    }
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Date</Label>
                    <Input
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        onUpdateItem(item.id, "date", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 shrink-0"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-end items-center gap-4 p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                Total Amount:
              </span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalAmount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
