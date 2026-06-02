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
import { Progress } from "@/src/components/ui/progress";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
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
  Calendar,
  DollarSign,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  Calculator,
  CreditCard,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Wallet,
  Banknote,
  Building2,
  FileText,
  Percent,
  Send,
  Printer,
  FileCheck,
  Play,
  Pause,
  RotateCcw,
  Lock,
  Unlock,
} from "lucide-react";

// Types
interface SalaryComponent {
  name: string;
  type: "earning" | "deduction";
  amount: number;
}

interface PayrollEmployee {
  id: number;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  basicSalary: number;
  earnings: SalaryComponent[];
  deductions: SalaryComponent[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: "pending" | "processed" | "paid";
  bankName: string;
  accountNumber: string;
}

interface PayrollRun {
  id: number;
  period: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
  status:
    | "draft"
    | "processing"
    | "pending_approval"
    | "approved"
    | "paid"
    | "cancelled";
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  employees: PayrollEmployee[];
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  notes?: string;
}

// Helper to generate payroll data
function generatePayrollData(): PayrollRun[] {
  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "IT",
    "Operations",
  ];
  const positions = [
    "Manager",
    "Senior Developer",
    "Junior Developer",
    "Designer",
    "Analyst",
    "Specialist",
  ];
  const banks = ["Access Bank", "GTBank", "First Bank", "UBA", "Zenith Bank"];

  const generateEmployees = (
    count: number,
    month: string,
  ): PayrollEmployee[] => {
    const employees: PayrollEmployee[] = [];

    for (let i = 0; i < count; i++) {
      const basicSalary = Math.floor(Math.random() * 500000) + 200000;
      const housingAllowance = Math.floor(basicSalary * 0.2);
      const transportAllowance = Math.floor(basicSalary * 0.1);
      const medicalAllowance = Math.floor(basicSalary * 0.05);
      const bonus = Math.random() > 0.7 ? Math.floor(basicSalary * 0.15) : 0;

      const earnings: SalaryComponent[] = [
        { name: "Basic Salary", type: "earning", amount: basicSalary },
        {
          name: "Housing Allowance",
          type: "earning",
          amount: housingAllowance,
        },
        {
          name: "Transport Allowance",
          type: "earning",
          amount: transportAllowance,
        },
        {
          name: "Medical Allowance",
          type: "earning",
          amount: medicalAllowance,
        },
      ];

      if (bonus > 0) {
        earnings.push({
          name: "Performance Bonus",
          type: "earning",
          amount: bonus,
        });
      }

      const pensionDeduction = Math.floor(basicSalary * 0.08);
      const taxDeduction = Math.floor(basicSalary * 0.1);
      const loanDeduction =
        Math.random() > 0.6 ? Math.floor(Math.random() * 50000) + 10000 : 0;
      const healthInsurance = Math.floor(basicSalary * 0.025);

      const deductions: SalaryComponent[] = [
        {
          name: "Pension Contribution",
          type: "deduction",
          amount: pensionDeduction,
        },
        { name: "PAYE Tax", type: "deduction", amount: taxDeduction },
        {
          name: "Health Insurance",
          type: "deduction",
          amount: healthInsurance,
        },
      ];

      if (loanDeduction > 0) {
        deductions.push({
          name: "Loan Repayment",
          type: "deduction",
          amount: loanDeduction,
        });
      }

      const grossPay = earnings.reduce((sum, e) => sum + e.amount, 0);
      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
      const netPay = grossPay - totalDeductions;

      employees.push({
        id: i + 1,
        employeeName: `Employee ${i + 1}`,
        employeeEmail: `employee${i + 1}@company.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        position: positions[Math.floor(Math.random() * positions.length)],
        basicSalary,
        earnings,
        deductions,
        grossPay,
        totalDeductions,
        netPay,
        status: "pending",
        bankName: banks[Math.floor(Math.random() * banks.length)],
        accountNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      });
    }

    return employees;
  };

  return [
    {
      id: 1,
      period: "May 2026",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      paymentDate: "2026-05-31",
      status: "paid",
      totalEmployees: 45,
      totalGrossPay: 58750000,
      totalDeductions: 13530000,
      totalNetPay: 45220000,
      employees: generateEmployees(45, "May"),
      createdBy: "Admin User",
      createdAt: "2026-05-01",
      approvedBy: "Sarah Williams",
      approvedDate: "2026-05-28",
      paidDate: "2026-05-31",
    },
    {
      id: 2,
      period: "April 2026",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      paymentDate: "2026-04-30",
      status: "paid",
      totalEmployees: 44,
      totalGrossPay: 57200000,
      totalDeductions: 13100000,
      totalNetPay: 44100000,
      employees: generateEmployees(44, "April"),
      createdBy: "Admin User",
      createdAt: "2026-04-01",
      approvedBy: "Sarah Williams",
      approvedDate: "2026-04-28",
      paidDate: "2026-04-30",
    },
    {
      id: 3,
      period: "June 2026",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      paymentDate: "2026-06-30",
      status: "draft",
      totalEmployees: 46,
      totalGrossPay: 0,
      totalDeductions: 0,
      totalNetPay: 0,
      employees: generateEmployees(46, "June"),
      createdBy: "Admin User",
      createdAt: "2026-06-01",
    },
    {
      id: 4,
      period: "March 2026",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      paymentDate: "2026-03-31",
      status: "paid",
      totalEmployees: 43,
      totalGrossPay: 55800000,
      totalDeductions: 12800000,
      totalNetPay: 43000000,
      employees: generateEmployees(43, "March"),
      createdBy: "Admin User",
      createdAt: "2026-03-01",
      approvedBy: "Mike Brown",
      approvedDate: "2026-03-29",
      paidDate: "2026-03-31",
    },
  ];
}

export default function PayrollRunsPage() {
  // State
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(
    generatePayrollData(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PayrollRun;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  const [selectedEmployeeView, setSelectedEmployeeView] =
    useState<PayrollEmployee | null>(null);
  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [formData, setFormData] = useState({
    period: "",
    startDate: "",
    endDate: "",
    paymentDate: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const thisYearRuns = payrollRuns.filter(
      (r) => new Date(r.startDate).getFullYear() === currentYear,
    );
    const totalPaidThisYear = thisYearRuns
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.totalNetPay, 0);

    const lastRun = payrollRuns
      .filter((r) => r.status === "paid")
      .sort(
        (a, b) =>
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
      )[0];

    const draftRuns = payrollRuns.filter((r) => r.status === "draft").length;
    const processingRuns = payrollRuns.filter(
      (r) => r.status === "processing" || r.status === "pending_approval",
    ).length;
    const completedRuns = payrollRuns.filter((r) => r.status === "paid").length;

    return {
      totalPaidThisYear,
      lastRunAmount: lastRun?.totalNetPay || 0,
      lastRunPeriod: lastRun?.period || "N/A",
      draftRuns,
      processingRuns,
      completedRuns,
      totalRuns: payrollRuns.length,
    };
  }, [payrollRuns]);

  // Filter and sort
  const filteredRuns = useMemo(() => {
    let result = [...payrollRuns];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.period.toLowerCase().includes(query) ||
          r.status.toLowerCase().includes(query),
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

    // Default sort by start date descending
    result.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

    return result;
  }, [payrollRuns, searchQuery, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage);
  const paginatedRuns = filteredRuns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof PayrollRun) => {
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.period.trim()) errors.period = "Period is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (!formData.paymentDate) errors.paymentDate = "Payment date is required";

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      errors.endDate = "End date must be after start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePayrollRun = () => {
    if (!validateForm()) return;

    const newRun: PayrollRun = {
      id: Math.max(...payrollRuns.map((r) => r.id), 0) + 1,
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      paymentDate: formData.paymentDate,
      status: "draft",
      totalEmployees: 0,
      totalGrossPay: 0,
      totalDeductions: 0,
      totalNetPay: 0,
      employees: [],
      createdBy: "Admin User",
      createdAt: new Date().toISOString().split("T")[0],
      notes: formData.notes,
    };

    setPayrollRuns((prev) => [newRun, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleProcessPayroll = () => {
    if (!selectedRun) return;

    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === selectedRun.id
          ? {
              ...r,
              status: "processing" as const,
              totalEmployees: r.employees.length,
              totalGrossPay: r.employees.reduce(
                (sum, e) => sum + e.grossPay,
                0,
              ),
              totalDeductions: r.employees.reduce(
                (sum, e) => sum + e.totalDeductions,
                0,
              ),
              totalNetPay: r.employees.reduce((sum, e) => sum + e.netPay, 0),
              employees: r.employees.map((e) => ({
                ...e,
                status: "processed" as const,
              })),
            }
          : r,
      ),
    );

    setIsProcessDialogOpen(false);
    setSelectedRun(null);
  };

  const handleApprovePayroll = () => {
    if (!selectedRun) return;

    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === selectedRun.id
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
    setSelectedRun(null);
  };

  const handlePayPayroll = () => {
    if (!selectedRun) return;

    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === selectedRun.id
          ? {
              ...r,
              status: "paid",
              paidDate: new Date().toISOString().split("T")[0],
              employees: r.employees.map((e) => ({
                ...e,
                status: "paid" as const,
              })),
            }
          : r,
      ),
    );

    setIsPayDialogOpen(false);
    setSelectedRun(null);
  };

  const handleCancelPayroll = () => {
    if (!selectedRun) return;

    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === selectedRun.id ? { ...r, status: "cancelled" } : r,
      ),
    );

    setIsCancelDialogOpen(false);
    setSelectedRun(null);
  };

  const resetForm = () => {
    setFormData({
      period: "",
      startDate: "",
      endDate: "",
      paymentDate: "",
      notes: "",
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

  const getStatusBadge = (status: PayrollRun["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "pending_approval":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Banknote className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getEmployeeStatusBadge = (status: PayrollEmployee["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 text-xs">
            Pending
          </Badge>
        );
      case "processed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
            Processed
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 text-xs"
          >
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

  const canProcess = (status: string) => status === "draft";
  const canApprove = (status: string) => status === "processing";
  const canPay = (status: string) => status === "approved";
  const canCancel = (status: string) =>
    ["draft", "processing", "pending_approval"].includes(status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payroll Runs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage payroll periods, computations, and approvals
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Payroll Run
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Payroll Run</DialogTitle>
              <DialogDescription>
                Set up a new payroll period. You can add employees and process
                payroll after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="period">Period Name *</Label>
                <Input
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  placeholder="e.g., June 2026"
                />
                {formErrors.period && (
                  <p className="text-sm text-red-500">{formErrors.period}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-red-500">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                  {formErrors.endDate && (
                    <p className="text-sm text-red-500">{formErrors.endDate}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                />
                {formErrors.paymentDate && (
                  <p className="text-sm text-red-500">
                    {formErrors.paymentDate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsCreateModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePayrollRun}>
                Create Payroll Run
              </Button>
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
                <p className="text-sm text-muted-foreground">Last Payroll</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.lastRunAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.lastRunPeriod}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Paid (YTD)
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalPaidThisYear)}
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
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.processingRuns}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <RotateCcw className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Runs</p>
                <p className="text-2xl font-bold">{stats.completedRuns}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FileCheck className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by period, status..."
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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending_approval">
                  Pending Approval
                </SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Periods Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Periods</CardTitle>
          <CardDescription>
            {filteredRuns.length} payroll run
            {filteredRuns.length !== 1 ? "s" : ""} found
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
                      onClick={() => handleSort("period")}
                    >
                      Period
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("totalNetPay")}
                    >
                      Total Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRuns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Calculator className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No payroll runs found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{run.period}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(run.startDate)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(run.endDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {run.totalEmployees > 0 ? run.totalEmployees : "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {run.totalNetPay > 0
                          ? formatCurrency(run.totalNetPay)
                          : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(run.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => {
                              setSelectedRun(run);
                              setIsViewModalOpen(true);
                            }}
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
                                onClick={() => {
                                  setSelectedRun(run);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canProcess(run.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRun(run);
                                    setIsProcessDialogOpen(true);
                                  }}
                                >
                                  <Play className="h-4 w-4 mr-2 text-blue-600" />
                                  Process Payroll
                                </DropdownMenuItem>
                              )}
                              {canApprove(run.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRun(run);
                                    setIsApproveDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {canPay(run.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRun(run);
                                    setIsPayDialogOpen(true);
                                  }}
                                >
                                  <Banknote className="h-4 w-4 mr-2 text-green-600" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              {canCancel(run.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedRun(run);
                                      setIsCancelDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Run
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
          {filteredRuns.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredRuns.length)} of{" "}
                  {filteredRuns.length}
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

      {/* View Payroll Run Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Run Details</DialogTitle>
            <DialogDescription>
              {selectedRun?.period} - Complete payroll breakdown
            </DialogDescription>
          </DialogHeader>
          {selectedRun && (
            <div className="space-y-6 py-4">
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Employees</p>
                  <p className="text-lg font-bold">
                    {selectedRun.totalEmployees}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gross Pay</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedRun.totalGrossPay)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deductions</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(selectedRun.totalDeductions)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Pay</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedRun.totalNetPay)}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Period</p>
                  <p className="font-medium">{selectedRun.period}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {formatDate(selectedRun.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {formatDate(selectedRun.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Date</p>
                  <p className="font-medium">
                    {formatDate(selectedRun.paymentDate)}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="employees" className="w-full">
                <TabsList>
                  <TabsTrigger value="employees">
                    <Users className="h-4 w-4 mr-2" />
                    Employees ({selectedRun.employees.length})
                  </TabsTrigger>
                  <TabsTrigger value="summary">
                    <Calculator className="h-4 w-4 mr-2" />
                    Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Gross Pay</TableHead>
                            <TableHead>Deductions</TableHead>
                            <TableHead>Net Pay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRun.employees.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-8"
                              >
                                <p className="text-muted-foreground">
                                  No employees added yet
                                </p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            selectedRun.employees.map((emp) => (
                              <TableRow key={emp.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                        {getInitials(emp.employeeName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {emp.employeeName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {emp.position}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {emp.department}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {formatCurrency(emp.grossPay)}
                                </TableCell>
                                <TableCell className="text-red-600 font-medium">
                                  {formatCurrency(emp.totalDeductions)}
                                </TableCell>
                                <TableCell className="font-bold text-green-600">
                                  {formatCurrency(emp.netPay)}
                                </TableCell>
                                <TableCell>
                                  {getEmployeeStatusBadge(emp.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedEmployeeView(emp);
                                      setIsEmployeeDetailOpen(true);
                                    }}
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
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Earnings Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedRun.employees.length > 0 &&
                            selectedRun.employees[0].earnings.map(
                              (earning, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {earning.name}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(
                                      selectedRun.employees.reduce(
                                        (sum, emp) =>
                                          sum +
                                          (emp.earnings.find(
                                            (e) => e.name === earning.name,
                                          )?.amount || 0),
                                        0,
                                      ),
                                    )}
                                  </span>
                                </div>
                              ),
                            )}
                          <div className="flex justify-between text-sm font-bold pt-3 border-t">
                            <span>Total Gross Pay</span>
                            <span>
                              {formatCurrency(selectedRun.totalGrossPay)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Deductions Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedRun.employees.length > 0 &&
                            selectedRun.employees[0].deductions.map(
                              (deduction, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {deduction.name}
                                  </span>
                                  <span className="font-medium text-red-600">
                                    {formatCurrency(
                                      selectedRun.employees.reduce(
                                        (sum, emp) =>
                                          sum +
                                          (emp.deductions.find(
                                            (d) => d.name === deduction.name,
                                          )?.amount || 0),
                                        0,
                                      ),
                                    )}
                                  </span>
                                </div>
                              ),
                            )}
                          <div className="flex justify-between text-sm font-bold pt-3 border-t">
                            <span>Total Deductions</span>
                            <span className="text-red-600">
                              {formatCurrency(selectedRun.totalDeductions)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Payslips
            </Button>
            {selectedRun && canProcess(selectedRun.status) && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsProcessDialogOpen(true);
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            )}
            {selectedRun && canPay(selectedRun.status) && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsPayDialogOpen(true);
                }}
              >
                <Banknote className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Detail Modal */}
      <Dialog
        open={isEmployeeDetailOpen}
        onOpenChange={setIsEmployeeDetailOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Employee Payroll Details</DialogTitle>
            <DialogDescription>
              {selectedEmployeeView?.employeeName} - Salary breakdown
            </DialogDescription>
          </DialogHeader>
          {selectedEmployeeView && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {getInitials(selectedEmployeeView.employeeName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {selectedEmployeeView.employeeName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployeeView.department} -{" "}
                    {selectedEmployeeView.position}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium text-sm">Earnings</p>
                {selectedEmployeeView.earnings.map((earning, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm py-2 border-b"
                  >
                    <span>{earning.name}</span>
                    <span className="font-medium">
                      {formatCurrency(earning.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold py-2">
                  <span>Gross Pay</span>
                  <span>{formatCurrency(selectedEmployeeView.grossPay)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium text-sm">Deductions</p>
                {selectedEmployeeView.deductions.map((deduction, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm py-2 border-b"
                  >
                    <span>{deduction.name}</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(deduction.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold py-2">
                  <span>Total Deductions</span>
                  <span className="text-red-600">
                    {formatCurrency(selectedEmployeeView.totalDeductions)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-bold">Net Pay</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(selectedEmployeeView.netPay)}
                </span>
              </div>

              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span>{selectedEmployeeView.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number</span>
                  <span>{selectedEmployeeView.accountNumber}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmployeeDetailOpen(false)}
            >
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Payslip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Confirmation */}
      <AlertDialog
        open={isProcessDialogOpen}
        onOpenChange={setIsProcessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payroll</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process the payroll for{" "}
              <strong>{selectedRun?.period}</strong>? This will calculate all
              salaries and deductions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProcessPayroll}>
              <Play className="h-4 w-4 mr-2" />
              Process Payroll
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
            <AlertDialogTitle>Approve Payroll</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve the payroll for{" "}
              <strong>{selectedRun?.period}</strong>? Total net pay:{" "}
              <strong>
                {selectedRun && formatCurrency(selectedRun.totalNetPay)}
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprovePayroll}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
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
              Confirm that the payroll for{" "}
              <strong>{selectedRun?.period}</strong> has been paid. Total:{" "}
              <strong>
                {selectedRun && formatCurrency(selectedRun.totalNetPay)}
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePayPayroll}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Banknote className="h-4 w-4 mr-2" />
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payroll Run</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the payroll run for{" "}
              <strong>{selectedRun?.period}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Run</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelPayroll}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Run
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
