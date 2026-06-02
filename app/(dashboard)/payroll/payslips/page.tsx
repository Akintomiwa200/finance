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
  Download,
  Mail,
  Printer,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
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
  Send,
  Banknote,
  Building2,
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileCheck,
  Share2,
  Smartphone,
} from "lucide-react";

// Types
interface SalaryComponent {
  name: string;
  type: "earning" | "deduction";
  amount: number;
}

interface Payslip {
  id: number;
  employeeName: string;
  employeeEmail: string;
  employeeId: string;
  department: string;
  position: string;
  period: string;
  paymentDate: string;
  basicSalary: number;
  earnings: SalaryComponent[];
  deductions: SalaryComponent[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: "draft" | "generated" | "sent" | "viewed";
  generatedDate?: string;
  sentDate?: string;
  viewedDate?: string;
  bankName: string;
  accountNumber: string;
  taxId: string;
  pensionId: string;
  yearToDate: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
    taxPaid: number;
    pensionPaid: number;
  };
}

// Helper to generate payslip data
function generatePayslips(): Payslip[] {
  const departments = [
    "Engineering",
    "Finance",
    "HR",
    "Design",
    "Marketing",
    "Sales",
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
  const months = ["January", "February", "March", "April", "May", "June"];

  const payslips: Payslip[] = [];

  for (let i = 0; i < 8; i++) {
    const basicSalary = Math.floor(Math.random() * 800000) + 300000;
    const housingAllowance = Math.floor(basicSalary * 0.25);
    const transportAllowance = Math.floor(basicSalary * 0.15);
    const medicalAllowance = Math.floor(basicSalary * 0.05);
    const bonus = Math.random() > 0.6 ? Math.floor(basicSalary * 0.2) : 0;

    const earnings: SalaryComponent[] = [
      { name: "Basic Salary", type: "earning", amount: basicSalary },
      { name: "Housing Allowance", type: "earning", amount: housingAllowance },
      {
        name: "Transport Allowance",
        type: "earning",
        amount: transportAllowance,
      },
      { name: "Medical Allowance", type: "earning", amount: medicalAllowance },
    ];

    if (bonus > 0) {
      earnings.push({
        name: "Performance Bonus",
        type: "earning",
        amount: bonus,
      });
    }

    const pensionDeduction = Math.floor(basicSalary * 0.08);
    const taxDeduction = Math.floor(basicSalary * 0.12);
    const healthInsurance = Math.floor(basicSalary * 0.025);
    const loanDeduction =
      i % 3 === 0 ? Math.floor(Math.random() * 80000) + 20000 : 0;

    const deductions: SalaryComponent[] = [
      {
        name: "Pension Contribution",
        type: "deduction",
        amount: pensionDeduction,
      },
      { name: "PAYE Tax", type: "deduction", amount: taxDeduction },
      { name: "Health Insurance", type: "deduction", amount: healthInsurance },
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

    const statuses: Payslip["status"][] = [
      "generated",
      "generated",
      "sent",
      "sent",
      "viewed",
      "generated",
      "draft",
      "sent",
    ];
    const period = months[i % months.length] + " 2026";

    payslips.push({
      id: i + 1,
      employeeName: `Employee ${i + 1}`,
      employeeEmail: `employee${i + 1}@company.com`,
      employeeId: `EMP-${String(i + 1).padStart(4, "0")}`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      period,
      paymentDate: `2026-${String((i % 6) + 1).padStart(2, "0")}-${String(25 + (i % 6)).padStart(2, "0")}`,
      basicSalary,
      earnings,
      deductions,
      grossPay,
      totalDeductions,
      netPay,
      status: statuses[i % statuses.length],
      generatedDate: `2026-${String((i % 6) + 1).padStart(2, "0")}-${String(20 + (i % 6)).padStart(2, "0")}`,
      sentDate:
        statuses[i % statuses.length] === "sent" ||
        statuses[i % statuses.length] === "viewed"
          ? `2026-${String((i % 6) + 1).padStart(2, "0")}-${String(22 + (i % 6)).padStart(2, "0")}`
          : undefined,
      viewedDate:
        statuses[i % statuses.length] === "viewed"
          ? `2026-${String((i % 6) + 1).padStart(2, "0")}-${String(24 + (i % 6)).padStart(2, "0")}`
          : undefined,
      bankName: banks[i % banks.length],
      accountNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      taxId: `TAX-${String(i + 1).padStart(6, "0")}`,
      pensionId: `PEN-${String(i + 1).padStart(6, "0")}`,
      yearToDate: {
        grossPay: grossPay * 5,
        totalDeductions: totalDeductions * 5,
        netPay: netPay * 5,
        taxPaid: taxDeduction * 5,
        pensionPaid: pensionDeduction * 5,
      },
    });
  }

  return payslips;
}

export default function PayslipsPage() {
  // State
  const [payslips, setPayslips] = useState<Payslip[]>(generatePayslips());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payslip;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isBulkSendDialogOpen, setIsBulkSendDialogOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Statistics
  const stats = useMemo(() => {
    const generated = payslips.filter((p) => p.status === "generated").length;
    const sent = payslips.filter((p) => p.status === "sent").length;
    const viewed = payslips.filter((p) => p.status === "viewed").length;
    const draft = payslips.filter((p) => p.status === "draft").length;

    const totalNetPay = payslips.reduce((sum, p) => sum + p.netPay, 0);
    const totalGrossPay = payslips.reduce((sum, p) => sum + p.grossPay, 0);
    const totalDeductions = payslips.reduce(
      (sum, p) => sum + p.totalDeductions,
      0,
    );

    return {
      generated,
      sent,
      viewed,
      draft,
      totalNetPay,
      totalGrossPay,
      totalDeductions,
      totalPayslips: payslips.length,
    };
  }, [payslips]);

  // Departments list
  const departments = useMemo(() => {
    return [...new Set(payslips.map((p) => p.department))];
  }, [payslips]);

  // Filter and sort
  const filteredPayslips = useMemo(() => {
    let result = [...payslips];

    // Tab filter
    if (activeTab !== "all") {
      result = result.filter((p) => p.status === activeTab);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(query) ||
          p.employeeEmail.toLowerCase().includes(query) ||
          p.employeeId.toLowerCase().includes(query) ||
          p.department.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== "all") {
      result = result.filter((p) => p.department === departmentFilter);
    }

    // Month filter
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1,
      ).toLocaleString("default", {
        month: "long",
      });
      result = result.filter(
        (p) => p.period.includes(monthName) && p.period.includes(year),
      );
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
  }, [
    payslips,
    searchQuery,
    statusFilter,
    departmentFilter,
    selectedMonth,
    sortConfig,
    activeTab,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredPayslips.length / itemsPerPage);
  const paginatedPayslips = filteredPayslips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Payslip) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handleGeneratePayslips = () => {
    setPayslips((prev) =>
      prev.map((p) =>
        p.status === "draft"
          ? {
              ...p,
              status: "generated" as const,
              generatedDate: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    );
    setIsGenerateDialogOpen(false);
  };

  const handleSendPayslip = () => {
    if (!selectedPayslip) return;

    setPayslips((prev) =>
      prev.map((p) =>
        p.id === selectedPayslip.id
          ? {
              ...p,
              status: "sent" as const,
              sentDate: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    );

    setIsSendDialogOpen(false);
    setSelectedPayslip(null);
  };

  const handleBulkSend = () => {
    setPayslips((prev) =>
      prev.map((p) =>
        p.status === "generated"
          ? {
              ...p,
              status: "sent" as const,
              sentDate: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    );
    setIsBulkSendDialogOpen(false);
  };

  const handleViewPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);

    // Mark as viewed if sent
    if (payslip.status === "sent") {
      setPayslips((prev) =>
        prev.map((p) =>
          p.id === payslip.id
            ? {
                ...p,
                status: "viewed" as const,
                viewedDate: new Date().toISOString().split("T")[0],
              }
            : p,
        ),
      );
    }

    setIsViewModalOpen(true);
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

  const getStatusBadge = (status: Payslip["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "generated":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <FileCheck className="h-3 w-3 mr-1" />
            Generated
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Send className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case "viewed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Eye className="h-3 w-3 mr-1" />
            Viewed
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

  const getMonthDisplay = (monthValue: string) => {
    if (!monthValue) return "All Months";
    const [year, month] = monthValue.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric",
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payslips
          </h1>
          <p className="text-muted-foreground mt-1">
            View and generate employee payslips
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsBulkSendDialogOpen(true)}
            disabled={!payslips.some((p) => p.status === "generated")}
          >
            <Send className="h-4 w-4 mr-2" />
            Send All
          </Button>
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <FileCheck className="h-4 w-4 mr-2" />
            Generate Payslips
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payslips</p>
                <p className="text-2xl font-bold">{stats.totalPayslips}</p>
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
                <p className="text-sm text-muted-foreground">Total Net Pay</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalNetPay)}
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
                <p className="text-sm text-muted-foreground">Sent/Viewed</p>
                <p className="text-2xl font-bold">
                  {stats.sent + stats.viewed}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Send className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {stats.draft + stats.generated}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
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
                placeholder="Search employee, ID, department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[200px]"
            />
            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({payslips.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
          <TabsTrigger value="generated">
            Generated ({stats.generated})
          </TabsTrigger>
          <TabsTrigger value="sent">Sent ({stats.sent})</TabsTrigger>
          <TabsTrigger value="viewed">Viewed ({stats.viewed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle>
                Employee Payslips — {getMonthDisplay(selectedMonth)}
              </CardTitle>
              <CardDescription>
                {filteredPayslips.length} payslip
                {filteredPayslips.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("grossPay")}
                    >
                      Gross Pay
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("netPay")}
                    >
                      Net Pay
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayslips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No payslips found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                              {getInitials(payslip.employeeName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {payslip.employeeName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payslip.employeeId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {payslip.department}
                      </TableCell>
                      <TableCell className="text-sm">
                        {payslip.period}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payslip.grossPay)}
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {formatCurrency(payslip.totalDeductions)}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        {formatCurrency(payslip.netPay)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Payslip"
                            onClick={() => handleViewPayslip(payslip)}
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
                                onClick={() => handleViewPayslip(payslip)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Payslip
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                              </DropdownMenuItem>
                              {payslip.status === "generated" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPayslip(payslip);
                                    setIsSendDialogOpen(true);
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send to Employee
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Link
                              </DropdownMenuItem>
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
          {filteredPayslips.length > 0 && (
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
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredPayslips.length,
                  )}{" "}
                  of {filteredPayslips.length}
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

      {/* View Payslip Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payslip</DialogTitle>
            <DialogDescription>
              {selectedPayslip?.period} - {selectedPayslip?.employeeName}
            </DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg">
                        {getInitials(selectedPayslip.employeeName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">
                        {selectedPayslip.employeeName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPayslip.employeeId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPayslip.department} -{" "}
                        {selectedPayslip.position}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Payment Date
                    </p>
                    <p className="font-bold">
                      {formatDate(selectedPayslip.paymentDate)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Period</p>
                    <p className="font-medium">{selectedPayslip.period}</p>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-green-700 mb-3">
                    Earnings
                  </h3>
                  <div className="space-y-2">
                    {selectedPayslip.earnings.map((earning, i) => (
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
                    <div className="flex justify-between text-sm font-bold py-2 bg-green-50 px-2 rounded">
                      <span>Gross Pay</span>
                      <span className="text-green-700">
                        {formatCurrency(selectedPayslip.grossPay)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-red-700 mb-3">
                    Deductions
                  </h3>
                  <div className="space-y-2">
                    {selectedPayslip.deductions.map((deduction, i) => (
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
                    <div className="flex justify-between text-sm font-bold py-2 bg-red-50 px-2 rounded">
                      <span>Total Deductions</span>
                      <span className="text-red-700">
                        {formatCurrency(selectedPayslip.totalDeductions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Net Pay</span>
                  <span className="text-2xl font-bold text-green-700">
                    {formatCurrency(selectedPayslip.netPay)}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Bank</p>
                  <p className="font-medium">{selectedPayslip.bankName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Number</p>
                  <p className="font-medium">{selectedPayslip.accountNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tax ID</p>
                  <p className="font-medium">{selectedPayslip.taxId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pension ID</p>
                  <p className="font-medium">{selectedPayslip.pensionId}</p>
                </div>
              </div>

              {/* Year to Date */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Year to Date</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Gross Pay</p>
                    <p className="font-medium">
                      {formatCurrency(selectedPayslip.yearToDate.grossPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deductions</p>
                    <p className="font-medium text-red-600">
                      {formatCurrency(
                        selectedPayslip.yearToDate.totalDeductions,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net Pay</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedPayslip.yearToDate.netPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax Paid</p>
                    <p className="font-medium">
                      {formatCurrency(selectedPayslip.yearToDate.taxPaid)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="flex items-center justify-between pt-4 border-t text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-muted-foreground">Generated</p>
                    <p>{formatDate(selectedPayslip.generatedDate || "")}</p>
                  </div>
                  {selectedPayslip.sentDate && (
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p>{formatDate(selectedPayslip.sentDate)}</p>
                    </div>
                  )}
                  {selectedPayslip.viewedDate && (
                    <div>
                      <p className="text-muted-foreground">Viewed</p>
                      <p>{formatDate(selectedPayslip.viewedDate)}</p>
                    </div>
                  )}
                </div>
                {getStatusBadge(selectedPayslip.status)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {selectedPayslip && selectedPayslip.status === "generated" && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsSendDialogOpen(true);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Employee
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Payslips Confirmation */}
      <AlertDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Payslips</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate payslips for all {stats.draft} draft employee
              records. Generated payslips can be sent to employees via email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGeneratePayslips}>
              <FileCheck className="h-4 w-4 mr-2" />
              Generate All Payslips
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Single Payslip */}
      <AlertDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Payslip</AlertDialogTitle>
            <AlertDialogDescription>
              Send the payslip for <strong>{selectedPayslip?.period}</strong> to{" "}
              <strong>{selectedPayslip?.employeeName}</strong> at{" "}
              <strong>{selectedPayslip?.employeeEmail}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendPayslip}>
              <Send className="h-4 w-4 mr-2" />
              Send Payslip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Send Confirmation */}
      <AlertDialog
        open={isBulkSendDialogOpen}
        onOpenChange={setIsBulkSendDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send All Generated Payslips</AlertDialogTitle>
            <AlertDialogDescription>
              This will send {stats.generated} generated payslips to their
              respective employees via email. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkSend}>
              <Send className="h-4 w-4 mr-2" />
              Send All ({stats.generated} payslips)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
