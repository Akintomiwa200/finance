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
  Hash,
  CalendarDays,
} from "lucide-react";

// Types
interface PaymentSchedule {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  balance: number;
  status: "pending" | "paid" | "overdue";
  paidDate?: string;
}

interface EmployeeLoan {
  id: number;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // months
  monthlyDeduction: number;
  totalRepayable: number;
  startDate: string;
  endDate: string;
  purpose: string;
  status: "pending" | "active" | "paid" | "rejected" | "defaulted";
  paidAmount: number;
  remainingBalance: number;
  installmentsPaid: number;
  totalInstallments: number;
  schedule: PaymentSchedule[];
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  rejectionReason?: string;
}

// Initial Data
const initialLoans: EmployeeLoan[] = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeEmail: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    loanAmount: 500000,
    interestRate: 5,
    loanTerm: 10,
    monthlyDeduction: 52500,
    totalRepayable: 525000,
    startDate: "2026-01-15",
    endDate: "2026-11-15",
    purpose: "Home renovation",
    status: "active",
    paidAmount: 210000,
    remainingBalance: 315000,
    installmentsPaid: 4,
    totalInstallments: 10,
    schedule: generateSchedule(500000, 5, 10, "2026-01-15", 4),
    approvedBy: "Sarah Williams",
    approvedDate: "2026-01-10",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeEmail: "jane.smith@company.com",
    department: "Design",
    position: "UX Designer",
    loanAmount: 1000000,
    interestRate: 7,
    loanTerm: 10,
    monthlyDeduction: 103500,
    totalRepayable: 1035000,
    startDate: "2025-11-01",
    endDate: "2026-09-01",
    purpose: "Car purchase",
    status: "active",
    paidAmount: 828000,
    remainingBalance: 207000,
    installmentsPaid: 8,
    totalInstallments: 10,
    schedule: generateSchedule(1000000, 7, 10, "2025-11-01", 8),
    approvedBy: "Mike Brown",
    approvedDate: "2025-10-25",
  },
  {
    id: 3,
    employeeName: "Bob King",
    employeeEmail: "bob.king@company.com",
    department: "Sales",
    position: "Sales Representative",
    loanAmount: 300000,
    interestRate: 3,
    loanTerm: 10,
    monthlyDeduction: 30450,
    totalRepayable: 304500,
    startDate: "2025-08-01",
    endDate: "2026-06-01",
    purpose: "Medical emergency",
    status: "paid",
    paidAmount: 304500,
    remainingBalance: 0,
    installmentsPaid: 10,
    totalInstallments: 10,
    schedule: generateSchedule(300000, 3, 10, "2025-08-01", 10),
    approvedBy: "Sarah Williams",
    approvedDate: "2025-07-28",
  },
  {
    id: 4,
    employeeName: "Alice Johnson",
    employeeEmail: "alice.johnson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    loanAmount: 750000,
    interestRate: 6,
    loanTerm: 12,
    monthlyDeduction: 66250,
    totalRepayable: 795000,
    startDate: "2026-03-01",
    endDate: "2027-03-01",
    purpose: "Education fees",
    status: "pending",
    paidAmount: 0,
    remainingBalance: 750000,
    installmentsPaid: 0,
    totalInstallments: 12,
    schedule: generateSchedule(750000, 6, 12, "2026-03-01", 0),
  },
  {
    id: 5,
    employeeName: "Tom Wilson",
    employeeEmail: "tom.wilson@company.com",
    department: "Engineering",
    position: "DevOps Engineer",
    loanAmount: 450000,
    interestRate: 8,
    loanTerm: 6,
    monthlyDeduction: 76500,
    totalRepayable: 459000,
    startDate: "2026-02-01",
    endDate: "2026-08-01",
    purpose: "Debt consolidation",
    status: "defaulted",
    paidAmount: 153000,
    remainingBalance: 306000,
    installmentsPaid: 2,
    totalInstallments: 6,
    schedule: generateSchedule(450000, 8, 6, "2026-02-01", 2),
    approvedBy: "Mike Brown",
    approvedDate: "2026-01-28",
  },
  {
    id: 6,
    employeeName: "Emma Davis",
    employeeEmail: "emma.davis@company.com",
    department: "HR",
    position: "HR Specialist",
    loanAmount: 200000,
    interestRate: 4,
    loanTerm: 5,
    monthlyDeduction: 40800,
    totalRepayable: 204000,
    startDate: "2026-04-01",
    endDate: "2026-09-01",
    purpose: "Laptop purchase",
    status: "rejected",
    paidAmount: 0,
    remainingBalance: 200000,
    installmentsPaid: 0,
    totalInstallments: 5,
    schedule: generateSchedule(200000, 4, 5, "2026-04-01", 0),
    rejectionReason:
      "Insufficient employment duration. Minimum 6 months required.",
  },
];

// Helper function to generate payment schedule
function generateSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  startDate: string,
  paidInstallments: number,
): PaymentSchedule[] {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const schedule: PaymentSchedule[] = [];
  let balance = principal;
  const start = new Date(startDate);

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);

    let status: PaymentSchedule["status"] = "pending";
    if (i <= paidInstallments) {
      status = "paid";
    }

    schedule.push({
      id: i,
      installmentNumber: i,
      dueDate: dueDate.toISOString().split("T")[0],
      amount: Math.round(monthlyPayment),
      principal: Math.round(principalPayment),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
      status,
      paidDate:
        i <= paidInstallments ? dueDate.toISOString().split("T")[0] : undefined,
    });
  }

  return schedule;
}

export default function EmployeeLoansPage() {
  // State
  const [loans, setLoans] = useState<EmployeeLoan[]>(initialLoans);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof EmployeeLoan;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<EmployeeLoan | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
    department: "",
    position: "",
    loanAmount: 0,
    interestRate: 5,
    loanTerm: 12,
    purpose: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculator state
  const [calcAmount, setCalcAmount] = useState(500000);
  const [calcRate, setCalcRate] = useState(5);
  const [calcTerm, setCalcTerm] = useState(12);

  // Statistics
  const stats = useMemo(() => {
    const active = loans.filter((l) => l.status === "active");
    const pending = loans.filter((l) => l.status === "pending");
    const paid = loans.filter((l) => l.status === "paid");
    const defaulted = loans.filter((l) => l.status === "defaulted");

    const totalActiveAmount = active.reduce(
      (sum, l) => sum + l.remainingBalance,
      0,
    );
    const totalPaidAmount = paid.reduce((sum, l) => sum + l.loanAmount, 0);
    const totalOutstanding = loans
      .filter((l) => l.status === "active" || l.status === "defaulted")
      .reduce((sum, l) => sum + l.remainingBalance, 0);

    const totalLoansDisbursed = loans
      .filter((l) => l.status !== "pending" && l.status !== "rejected")
      .reduce((sum, l) => sum + l.loanAmount, 0);

    return {
      activeCount: active.length,
      pendingCount: pending.length,
      paidCount: paid.length,
      defaultedCount: defaulted.length,
      totalActiveAmount,
      totalPaidAmount,
      totalOutstanding,
      totalLoansDisbursed,
    };
  }, [loans]);

  // Calculator values
  const calculatorResult = useMemo(() => {
    const monthlyRate = calcRate / 100 / 12;
    const monthlyPayment =
      calcAmount > 0 && calcRate > 0 && calcTerm > 0
        ? (calcAmount * monthlyRate * Math.pow(1 + monthlyRate, calcTerm)) /
          (Math.pow(1 + monthlyRate, calcTerm) - 1)
        : 0;
    const totalRepayable = monthlyPayment * calcTerm;
    const totalInterest = totalRepayable - calcAmount;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalRepayable: Math.round(totalRepayable),
      totalInterest: Math.round(totalInterest),
    };
  }, [calcAmount, calcRate, calcTerm]);

  // Filter and sort
  const filteredLoans = useMemo(() => {
    let result = [...loans];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(query) ||
          l.employeeEmail.toLowerCase().includes(query) ||
          l.department.toLowerCase().includes(query) ||
          l.purpose.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
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

    return result;
  }, [loans, searchQuery, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof EmployeeLoan) => {
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
      [name]:
        name === "loanAmount" || name === "interestRate" || name === "loanTerm"
          ? parseFloat(value) || 0
          : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const calculateLoanDetails = (amount: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment =
      amount > 0 && rate > 0 && term > 0
        ? (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
          (Math.pow(1 + monthlyRate, term) - 1)
        : 0;
    const totalRepayable = monthlyPayment * term;

    return {
      monthlyDeduction: Math.round(monthlyPayment),
      totalRepayable: Math.round(totalRepayable),
    };
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
    if (!formData.position.trim()) errors.position = "Position is required";
    if (!formData.loanAmount || formData.loanAmount <= 0)
      errors.loanAmount = "Valid loan amount is required";
    if (!formData.interestRate || formData.interestRate <= 0)
      errors.interestRate = "Interest rate is required";
    if (!formData.loanTerm || formData.loanTerm <= 0)
      errors.loanTerm = "Loan term is required";
    if (!formData.purpose.trim()) errors.purpose = "Purpose is required";
    if (!formData.startDate) errors.startDate = "Start date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddLoan = () => {
    if (!validateForm()) return;

    const details = calculateLoanDetails(
      formData.loanAmount,
      formData.interestRate,
      formData.loanTerm,
    );

    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.loanTerm);

    const newLoan: EmployeeLoan = {
      id: Math.max(...loans.map((l) => l.id), 0) + 1,
      ...formData,
      monthlyDeduction: details.monthlyDeduction,
      totalRepayable: details.totalRepayable,
      endDate: endDate.toISOString().split("T")[0],
      status: "pending",
      paidAmount: 0,
      remainingBalance: formData.loanAmount,
      installmentsPaid: 0,
      totalInstallments: formData.loanTerm,
      schedule: generateSchedule(
        formData.loanAmount,
        formData.interestRate,
        formData.loanTerm,
        formData.startDate,
        0,
      ),
    };

    setLoans((prev) => [newLoan, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditLoan = () => {
    if (!validateForm() || !selectedLoan) return;

    const details = calculateLoanDetails(
      formData.loanAmount,
      formData.interestRate,
      formData.loanTerm,
    );

    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.loanTerm);

    setLoans((prev) =>
      prev.map((l) =>
        l.id === selectedLoan.id
          ? {
              ...l,
              ...formData,
              monthlyDeduction: details.monthlyDeduction,
              totalRepayable: details.totalRepayable,
              endDate: endDate.toISOString().split("T")[0],
              schedule: generateSchedule(
                formData.loanAmount,
                formData.interestRate,
                formData.loanTerm,
                formData.startDate,
                l.installmentsPaid,
              ),
            }
          : l,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedLoan(null);
  };

  const handleDeleteLoan = () => {
    if (!selectedLoan) return;

    setLoans((prev) => prev.filter((l) => l.id !== selectedLoan.id));
    setIsDeleteDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleApproveLoan = () => {
    if (!selectedLoan) return;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === selectedLoan.id
          ? {
              ...l,
              status: "active",
              approvedBy: "Admin User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : l,
      ),
    );

    setIsApproveDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleRejectLoan = () => {
    if (!selectedLoan) return;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === selectedLoan.id
          ? { ...l, status: "rejected", rejectionReason }
          : l,
      ),
    );

    setRejectionReason("");
    setIsRejectDialogOpen(false);
    setSelectedLoan(null);
  };

  const openEditModal = (loan: EmployeeLoan) => {
    setSelectedLoan(loan);
    setFormData({
      employeeName: loan.employeeName,
      employeeEmail: loan.employeeEmail,
      department: loan.department,
      position: loan.position,
      loanAmount: loan.loanAmount,
      interestRate: loan.interestRate,
      loanTerm: loan.loanTerm,
      purpose: loan.purpose,
      startDate: loan.startDate,
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (loan: EmployeeLoan) => {
    setSelectedLoan(loan);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (loan: EmployeeLoan) => {
    setSelectedLoan(loan);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeEmail: "",
      department: "",
      position: "",
      loanAmount: 0,
      interestRate: 5,
      loanTerm: 12,
      purpose: "",
      startDate: new Date().toISOString().split("T")[0],
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

  const getStatusBadge = (status: EmployeeLoan["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "defaulted":
        return (
          <Badge className="bg-red-200 text-red-800 hover:bg-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Defaulted
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

  const getProgressPercentage = (paid: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((paid / total) * 100);
  };

  const canEdit = (status: string) => status === "pending";
  const canApprove = (status: string) => status === "pending";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Employee Loans
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage employee loan applications and deductions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Loan Calculator
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Loan Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Loan Application</DialogTitle>
                <DialogDescription>
                  Fill in the loan application details. Monthly deductions will
                  be calculated automatically.
                </DialogDescription>
              </DialogHeader>
              <LoanForm
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
                <Button onClick={handleAddLoan}>Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loan Calculator */}
      {showCalculator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Calculator
            </CardTitle>
            <CardDescription>
              Calculate monthly repayments and total interest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Loan Amount (NGN)</Label>
                <Input
                  type="number"
                  value={calcAmount}
                  onChange={(e) =>
                    setCalcAmount(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={calcRate}
                  onChange={(e) => setCalcRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Term (Months)</Label>
                <Input
                  type="number"
                  value={calcTerm}
                  onChange={(e) => setCalcTerm(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-xl font-bold">
                  {formatCurrency(calculatorResult.monthlyPayment)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Repayable</p>
                <p className="text-xl font-bold">
                  {formatCurrency(calculatorResult.totalRepayable)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(calculatorResult.totalInterest)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold">{stats.activeCount}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Outstanding Balance
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalOutstanding)}
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
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalLoansDisbursed)}
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
                  Pending Applications
                </p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
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
                placeholder="Search by employee, department, purpose..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="defaulted">Defaulted</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>
            {filteredLoans.length} loan{filteredLoans.length !== 1 ? "s" : ""}{" "}
            found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("loanAmount")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Monthly Deduction</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("remainingBalance")}
                    >
                      Balance
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Installments</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <PiggyBank className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No loans found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                              {getInitials(loan.employeeName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {loan.employeeName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {loan.department}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(loan.loanAmount)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(loan.monthlyDeduction)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatCurrency(loan.remainingBalance)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of {formatCurrency(loan.totalRepayable)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {loan.installmentsPaid}/{loan.totalInstallments}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] space-y-1">
                          <Progress
                            value={getProgressPercentage(
                              loan.installmentsPaid,
                              loan.totalInstallments,
                            )}
                            className="h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {getProgressPercentage(
                              loan.installmentsPaid,
                              loan.totalInstallments,
                            )}
                            %
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => openViewModal(loan)}
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
                                onClick={() => openViewModal(loan)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canEdit(loan.status) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => openEditModal(loan)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                              {canApprove(loan.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setIsApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setIsRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject
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
          {filteredLoans.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredLoans.length)}{" "}
                  of {filteredLoans.length}
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
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>
              Complete information about this loan.
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                      {getInitials(selectedLoan.employeeName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedLoan.employeeName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLoan.employeeEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedLoan.department} - {selectedLoan.position}
                    </p>
                  </div>
                </div>
                {getStatusBadge(selectedLoan.status)}
              </div>

              {/* Loan Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(selectedLoan.loanAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-bold text-lg">
                    {selectedLoan.interestRate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Term</p>
                  <p className="font-bold text-lg">
                    {selectedLoan.loanTerm} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Deduction
                  </p>
                  <p className="font-bold text-lg">
                    {formatCurrency(selectedLoan.monthlyDeduction)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Repayable
                  </p>
                  <p className="font-bold text-lg">
                    {formatCurrency(selectedLoan.totalRepayable)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedLoan.purpose}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Repayment Progress</span>
                  <span className="font-medium">
                    {getProgressPercentage(
                      selectedLoan.installmentsPaid,
                      selectedLoan.totalInstallments,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={getProgressPercentage(
                    selectedLoan.installmentsPaid,
                    selectedLoan.totalInstallments,
                  )}
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Paid: {formatCurrency(selectedLoan.paidAmount)}</span>
                  <span>
                    Balance: {formatCurrency(selectedLoan.remainingBalance)}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {formatDate(selectedLoan.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {formatDate(selectedLoan.endDate)}
                  </p>
                </div>
              </div>

              {/* Payment Schedule */}
              <div>
                <p className="font-medium mb-3">Payment Schedule</p>
                <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-2 p-3 bg-muted text-xs font-medium text-muted-foreground sticky top-0">
                    <span>#</span>
                    <span>Due Date</span>
                    <span>Amount</span>
                    <span>Balance</span>
                    <span>Status</span>
                  </div>
                  {selectedLoan.schedule.map((payment) => (
                    <div
                      key={payment.id}
                      className="grid grid-cols-5 gap-2 p-3 text-sm"
                    >
                      <span>{payment.installmentNumber}</span>
                      <span>{formatDate(payment.dueDate)}</span>
                      <span className="font-medium">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span>{formatCurrency(payment.balance)}</span>
                      <span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            payment.status === "paid"
                              ? "bg-green-50 text-green-700"
                              : payment.status === "overdue"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {payment.status}
                        </Badge>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Info */}
              {selectedLoan.approvedBy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Approved by</p>
                  <p className="font-medium">{selectedLoan.approvedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selectedLoan.approvedDate || "")}
                  </p>
                </div>
              )}

              {/* Rejection Info */}
              {selectedLoan.rejectionReason && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-600">
                    {selectedLoan.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedLoan && canApprove(selectedLoan.status) && (
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Loan Application</DialogTitle>
            <DialogDescription>
              Update the loan application details.
            </DialogDescription>
          </DialogHeader>
          <LoanForm
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
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditLoan}>Save Changes</Button>
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
            <AlertDialogTitle>Approve Loan Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve the loan application from{" "}
              <strong>{selectedLoan?.employeeName}</strong> for{" "}
              <strong>
                {selectedLoan && formatCurrency(selectedLoan.loanAmount)}
              </strong>
              ? This will activate the loan and start deductions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveLoan}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Loan
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
            <AlertDialogTitle>Reject Loan Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this loan application from{" "}
              <strong>{selectedLoan?.employeeName}</strong>.
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
              onClick={handleRejectLoan}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Application
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
            <AlertDialogTitle>Delete Loan Application</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the loan application from{" "}
              <strong>{selectedLoan?.employeeName}</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLoan}
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

// Loan Form Component
function LoanForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
}: {
  formData: {
    employeeName: string;
    employeeEmail: string;
    department: string;
    position: string;
    loanAmount: number;
    interestRate: number;
    loanTerm: number;
    purpose: string;
    startDate: string;
  };
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
}) {
  const monthlyRate = formData.interestRate / 100 / 12;
  const monthlyPayment =
    formData.loanAmount > 0 &&
    formData.interestRate > 0 &&
    formData.loanTerm > 0
      ? (formData.loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, formData.loanTerm)) /
        (Math.pow(1 + monthlyRate, formData.loanTerm) - 1)
      : 0;
  const totalRepayable = monthlyPayment * formData.loanTerm;
  const totalInterest = totalRepayable - formData.loanAmount;

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={onInputChange}
            placeholder="Senior Developer"
          />
          {formErrors.position && (
            <p className="text-sm text-red-500">{formErrors.position}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount (NGN) *</Label>
          <Input
            id="loanAmount"
            name="loanAmount"
            type="number"
            value={formData.loanAmount || ""}
            onChange={onInputChange}
            placeholder="500000"
          />
          {formErrors.loanAmount && (
            <p className="text-sm text-red-500">{formErrors.loanAmount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%) *</Label>
          <Input
            id="interestRate"
            name="interestRate"
            type="number"
            value={formData.interestRate || ""}
            onChange={onInputChange}
            placeholder="5"
          />
          {formErrors.interestRate && (
            <p className="text-sm text-red-500">{formErrors.interestRate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanTerm">Loan Term (Months) *</Label>
          <Input
            id="loanTerm"
            name="loanTerm"
            type="number"
            value={formData.loanTerm || ""}
            onChange={onInputChange}
            placeholder="12"
          />
          {formErrors.loanTerm && (
            <p className="text-sm text-red-500">{formErrors.loanTerm}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onInputChange}
          />
          {formErrors.startDate && (
            <p className="text-sm text-red-500">{formErrors.startDate}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="purpose">Purpose *</Label>
          <Textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={onInputChange}
            placeholder="Reason for loan application..."
            rows={2}
          />
          {formErrors.purpose && (
            <p className="text-sm text-red-500">{formErrors.purpose}</p>
          )}
        </div>
      </div>

      {/* Loan Summary */}
      {formData.loanAmount > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Monthly Deduction</p>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Math.round(monthlyPayment))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Repayable</p>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Math.round(totalRepayable))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Interest</p>
            <p className="text-lg font-bold text-orange-600">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Math.round(totalInterest))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
