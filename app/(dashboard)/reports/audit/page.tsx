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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Search,
  Download,
  Filter,
  Calendar,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileText,
  Users,
  Activity,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Send,
  Printer,
  LogIn,
  LogOut,
  Settings,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  DollarSign,
  Calculator,
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

// Types
type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "SUBMIT"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "PRINT"
  | "COMPUTE"
  | "LOCK"
  | "UNLOCK"
  | "ARCHIVE"
  | "RESTORE"
  | "SEND";

type AuditEntity =
  | "Employee"
  | "Payroll Run"
  | "Expense Report"
  | "Budget"
  | "Invoice"
  | "Department"
  | "Cost Center"
  | "Loan"
  | "Reimbursement"
  | "Payslip"
  | "User"
  | "Role"
  | "System"
  | "Report"
  | "Vendor"
  | "Tax";

type AuditSeverity = "info" | "warning" | "critical" | "success";

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  userEmail: string;
  userRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  details: string;
  severity: AuditSeverity;
  ipAddress: string;
  userAgent: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
  module: string;
  status: "success" | "failed" | "pending";
}

// Initial Data
const initialLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: "2026-06-02T14:30:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "CREATE",
    entity: "Payroll Run",
    entityId: "PAY-2026-006",
    details: "Created June 2026 payroll run for 46 employees",
    severity: "info",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    changes: [
      { field: "period", oldValue: "", newValue: "June 2026" },
      { field: "total_employees", oldValue: "0", newValue: "46" },
      { field: "status", oldValue: "", newValue: "draft" },
    ],
    module: "Payroll",
    status: "success",
  },
  {
    id: 2,
    timestamp: "2026-06-02T11:15:00",
    user: "Jane Manager",
    userEmail: "jane.manager@company.com",
    userRole: "Finance Manager",
    action: "APPROVE",
    entity: "Expense Report",
    entityId: "EXP-2026-002",
    details: "Approved travel expense for John Doe - Lagos trip (NGN 580,000)",
    severity: "success",
    ipAddress: "192.168.1.50",
    userAgent: "Mozilla/5.0 Firefox/126.0",
    changes: [
      { field: "status", oldValue: "submitted", newValue: "approved" },
      { field: "approved_by", oldValue: "", newValue: "Jane Manager" },
    ],
    module: "Expenses",
    status: "success",
  },
  {
    id: 3,
    timestamp: "2026-06-01T16:45:00",
    user: "John Doe",
    userEmail: "john.doe@company.com",
    userRole: "Senior Developer",
    action: "SUBMIT",
    entity: "Expense Report",
    entityId: "EXP-2026-008",
    details: "Submitted office supplies expense report (NGN 340,000)",
    severity: "info",
    ipAddress: "192.168.1.75",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    changes: [{ field: "status", oldValue: "draft", newValue: "submitted" }],
    module: "Expenses",
    status: "success",
  },
  {
    id: 4,
    timestamp: "2026-06-01T10:00:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "UPDATE",
    entity: "Employee",
    entityId: "EMP-0003",
    details: "Updated salary for Bob King from NGN 600,000 to NGN 650,000",
    severity: "warning",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    changes: [
      { field: "salary", oldValue: "NGN 600,000", newValue: "NGN 650,000" },
      { field: "updated_at", oldValue: "2025-12-01", newValue: "2026-06-01" },
    ],
    module: "Employees",
    status: "success",
  },
  {
    id: 5,
    timestamp: "2026-05-31T09:30:00",
    user: "Paul Roller",
    userEmail: "paul.roller@company.com",
    userRole: "Payroll Specialist",
    action: "COMPUTE",
    entity: "Payroll Run",
    entityId: "PAY-2026-005",
    details: "Computed May 2026 payroll - total net pay NGN 45,230,000",
    severity: "info",
    ipAddress: "192.168.1.60",
    userAgent: "Mozilla/5.0 Edge/125.0",
    changes: [
      { field: "total_gross", oldValue: "0", newValue: "NGN 58,750,000" },
      { field: "total_deductions", oldValue: "0", newValue: "NGN 13,520,000" },
      { field: "total_net", oldValue: "0", newValue: "NGN 45,230,000" },
    ],
    module: "Payroll",
    status: "success",
  },
  {
    id: 6,
    timestamp: "2026-05-30T15:20:00",
    user: "Jane Manager",
    userEmail: "jane.manager@company.com",
    userRole: "Finance Manager",
    action: "CREATE",
    entity: "Budget",
    entityId: "BUD-2027-001",
    details:
      "Created FY2027 budget draft for Finance department (NGN 55,000,000)",
    severity: "info",
    ipAddress: "192.168.1.50",
    userAgent: "Mozilla/5.0 Firefox/126.0",
    changes: [
      { field: "fiscal_year", oldValue: "", newValue: "FY 2027" },
      { field: "department", oldValue: "", newValue: "Finance" },
      { field: "total_budget", oldValue: "0", newValue: "NGN 55,000,000" },
    ],
    module: "Budget",
    status: "success",
  },
  {
    id: 7,
    timestamp: "2026-05-30T14:00:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "DELETE",
    entity: "Invoice",
    entityId: "INV-2026-007",
    details: "Deleted void invoice INV-2026-007 for Beta Ltd",
    severity: "critical",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    changes: [{ field: "status", oldValue: "draft", newValue: "deleted" }],
    module: "Invoices",
    status: "success",
  },
  {
    id: 8,
    timestamp: "2026-05-30T12:30:00",
    user: "Sarah Williams",
    userEmail: "sarah.williams@company.com",
    userRole: "HR Director",
    action: "APPROVE",
    entity: "Loan",
    entityId: "LOAN-2026-004",
    details: "Approved employee loan for Alice Johnson (NGN 750,000)",
    severity: "success",
    ipAddress: "192.168.1.55",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    changes: [
      { field: "status", oldValue: "pending", newValue: "approved" },
      { field: "approved_by", oldValue: "", newValue: "Sarah Williams" },
    ],
    module: "Loans",
    status: "success",
  },
  {
    id: 9,
    timestamp: "2026-05-30T10:45:00",
    user: "Tech Lead",
    userEmail: "tech.lead@company.com",
    userRole: "Engineering Manager",
    action: "REJECT",
    entity: "Expense Report",
    entityId: "EXP-2026-005",
    details: "Rejected marketing conference expense - budget exceeded",
    severity: "warning",
    ipAddress: "192.168.1.70",
    userAgent: "Mozilla/5.0 Safari/17.5",
    changes: [
      { field: "status", oldValue: "submitted", newValue: "rejected" },
      { field: "rejection_reason", oldValue: "", newValue: "Budget exceeded" },
    ],
    module: "Expenses",
    status: "success",
  },
  {
    id: 10,
    timestamp: "2026-05-30T08:15:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "LOGIN",
    entity: "System",
    entityId: "",
    details: "Successful login from new device",
    severity: "info",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    module: "Authentication",
    status: "success",
  },
  {
    id: 11,
    timestamp: "2026-05-29T23:55:00",
    user: "Unknown User",
    userEmail: "unknown@external.com",
    userRole: "N/A",
    action: "LOGIN",
    entity: "System",
    entityId: "",
    details: "Failed login attempt - invalid credentials",
    severity: "critical",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 Unknown",
    module: "Authentication",
    status: "failed",
  },
  {
    id: 12,
    timestamp: "2026-05-29T16:30:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "EXPORT",
    entity: "Report",
    entityId: "RPT-2026-015",
    details: "Exported payroll summary report for May 2026",
    severity: "info",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    module: "Reports",
    status: "success",
  },
  {
    id: 13,
    timestamp: "2026-05-29T14:00:00",
    user: "Jane Manager",
    userEmail: "jane.manager@company.com",
    userRole: "Finance Manager",
    action: "LOCK",
    entity: "Payroll Run",
    entityId: "PAY-2026-005",
    details: "Locked May 2026 payroll after final approval",
    severity: "warning",
    ipAddress: "192.168.1.50",
    userAgent: "Mozilla/5.0 Firefox/126.0",
    changes: [{ field: "status", oldValue: "approved", newValue: "locked" }],
    module: "Payroll",
    status: "success",
  },
  {
    id: 14,
    timestamp: "2026-05-28T11:00:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "CREATE",
    entity: "User",
    entityId: "USR-0048",
    details: "Created new user account for Emma Wilson (Marketing)",
    severity: "info",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    changes: [
      { field: "username", oldValue: "", newValue: "emma.wilson" },
      { field: "role", oldValue: "", newValue: "Marketing Manager" },
      { field: "department", oldValue: "", newValue: "Marketing" },
    ],
    module: "Users",
    status: "success",
  },
  {
    id: 15,
    timestamp: "2026-05-27T09:00:00",
    user: "Admin User",
    userEmail: "admin@company.com",
    userRole: "System Administrator",
    action: "SEND",
    entity: "Payslip",
    entityId: "PS-2026-156",
    details: "Bulk sent 156 payslips for May 2026",
    severity: "info",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/125.0",
    module: "Payslips",
    status: "success",
  },
];

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export default function AuditTrailPage() {
  // State
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AuditLog;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("logs");

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = logs.filter((l) => l.timestamp.startsWith(today));
    const criticalLogs = logs.filter((l) => l.severity === "critical");
    const failedLogs = logs.filter((l) => l.status === "failed");
    const uniqueUsers = [...new Set(logs.map((l) => l.user))].length;

    return {
      totalLogs: logs.length,
      todayLogs: todayLogs.length,
      criticalLogs: criticalLogs.length,
      failedLogs: failedLogs.length,
      uniqueUsers,
    };
  }, [logs]);

  // Chart data
  const actionChartData = useMemo(() => {
    const actionCounts: Record<string, number> = {};
    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    return Object.entries(actionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [logs]);

  const moduleChartData = useMemo(() => {
    const moduleCounts: Record<string, number> = {};
    logs.forEach((log) => {
      moduleCounts[log.module] = (moduleCounts[log.module] || 0) + 1;
    });
    return Object.entries(moduleCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [logs]);

  const hourlyActivity = useMemo(() => {
    const hours: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      hours[`${i}:00`] = 0;
    }
    logs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      hours[`${hour}:00`] = (hours[`${hour}:00`] || 0) + 1;
    });
    return Object.entries(hours).map(([hour, count]) => ({ hour, count }));
  }, [logs]);

  // Filter and sort
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.user.toLowerCase().includes(query) ||
          l.userEmail.toLowerCase().includes(query) ||
          l.action.toLowerCase().includes(query) ||
          l.entity.toLowerCase().includes(query) ||
          l.details.toLowerCase().includes(query) ||
          l.module.toLowerCase().includes(query) ||
          (l.entityId && l.entityId.toLowerCase().includes(query)),
      );
    }

    if (actionFilter !== "all")
      result = result.filter((l) => l.action === actionFilter);
    if (entityFilter !== "all")
      result = result.filter((l) => l.entity === entityFilter);
    if (severityFilter !== "all")
      result = result.filter((l) => l.severity === severityFilter);
    if (moduleFilter !== "all")
      result = result.filter((l) => l.module === moduleFilter);
    if (statusFilter !== "all")
      result = result.filter((l) => l.status === statusFilter);

    if (dateFrom) {
      result = result.filter((l) => l.timestamp >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((l) => l.timestamp <= dateTo + "T23:59:59");
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
        return 0;
      });
    } else {
      // Default: newest first
      result.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    }

    return result;
  }, [
    logs,
    searchQuery,
    actionFilter,
    entityFilter,
    severityFilter,
    moduleFilter,
    statusFilter,
    dateFrom,
    dateTo,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: keyof AuditLog) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadge = (action: AuditAction) => {
    const styles: Record<AuditAction, string> = {
      CREATE: "bg-blue-100 text-blue-800",
      UPDATE: "bg-purple-100 text-purple-800",
      DELETE: "bg-red-100 text-red-800",
      APPROVE: "bg-green-100 text-green-800",
      REJECT: "bg-red-100 text-red-800",
      SUBMIT: "bg-yellow-100 text-yellow-800",
      LOGIN: "bg-indigo-100 text-indigo-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      EXPORT: "bg-cyan-100 text-cyan-800",
      PRINT: "bg-teal-100 text-teal-800",
      COMPUTE: "bg-orange-100 text-orange-800",
      LOCK: "bg-pink-100 text-pink-800",
      UNLOCK: "bg-lime-100 text-lime-800",
      ARCHIVE: "bg-amber-100 text-amber-800",
      RESTORE: "bg-emerald-100 text-emerald-800",
      SEND: "bg-sky-100 text-sky-800",
    };
    return (
      <Badge className={styles[action] || "bg-gray-100 text-gray-800"}>
        {action}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Activity className="h-3 w-3 mr-1" />
            Info
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case "CREATE":
        return <Plus className="h-4 w-4" />;
      case "UPDATE":
        return <Edit className="h-4 w-4" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4" />;
      case "APPROVE":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECT":
        return <XCircle className="h-4 w-4" />;
      case "SUBMIT":
        return <Send className="h-4 w-4" />;
      case "LOGIN":
        return <LogIn className="h-4 w-4" />;
      case "LOGOUT":
        return <LogOut className="h-4 w-4" />;
      case "EXPORT":
        return <Download className="h-4 w-4" />;
      case "PRINT":
        return <Printer className="h-4 w-4" />;
      case "COMPUTE":
        return <Calculator className="h-4 w-4" />;
      case "LOCK":
        return <Lock className="h-4 w-4" />;
      case "UNLOCK":
        return <Unlock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const uniqueActions = [...new Set(logs.map((l) => l.action))];
  const uniqueEntities = [...new Set(logs.map((l) => l.entity))];
  const uniqueModules = [...new Set(logs.map((l) => l.module))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Audit Trail
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all system activity and changes for compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Log
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{stats.totalLogs}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-2xl font-bold">{stats.todayLogs}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.criticalLogs}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.failedLogs}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Unique Users</p>
            <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Activity Log Tab */}
        <TabsContent value="logs" className="space-y-6 mt-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by user, action, entity, details..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={actionFilter}
                    onValueChange={(v) => {
                      setActionFilter(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={moduleFilter}
                    onValueChange={(v) => {
                      setModuleFilter(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Layers className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {uniqueModules.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={severityFilter}
                    onValueChange={(v) => {
                      setSeverityFilter(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs whitespace-nowrap">From:</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full sm:w-[180px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs whitespace-nowrap">To:</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full sm:w-[180px]"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      setStatusFilter(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log Table */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                {filteredLogs.length} event
                {filteredLogs.length !== 1 ? "s" : ""} found
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
                          onClick={() => handleSort("timestamp")}
                        >
                          Timestamp
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Shield className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No audit logs found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLogs.map((log) => (
                        <TableRow
                          key={log.id}
                          className={
                            log.severity === "critical"
                              ? "bg-red-50/30"
                              : log.status === "failed"
                                ? "bg-orange-50/30"
                                : ""
                          }
                        >
                          <TableCell className="text-xs whitespace-nowrap">
                            {formatDateTime(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-muted rounded-full">
                                <Users className="h-3 w-3" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {log.user}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {log.userRole}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getActionIcon(log.action)}
                              {getActionBadge(log.action)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{log.entity}</p>
                              {log.entityId && (
                                <p className="text-xs text-muted-foreground font-mono">
                                  {log.entityId}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                            {log.details}
                          </TableCell>
                          <TableCell>
                            {getSeverityBadge(log.severity)}
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedLog(log);
                                setIsViewModalOpen(true);
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

              {/* Pagination */}
              {filteredLogs.length > 0 && (
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
                        filteredLogs.length,
                      )}{" "}
                      of {filteredLogs.length}
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Distribution</CardTitle>
                <CardDescription>
                  Most frequent actions performed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={actionChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: any) =>
                        `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {actionChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Module Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Module Activity</CardTitle>
                <CardDescription>Events by system module</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={moduleChartData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                      name="Events"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity Pattern</CardTitle>
                <CardDescription>
                  Event distribution by hour of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyActivity}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6B7280" }}
                      interval={2}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                      name="Events"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>Event severity breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Info",
                          value: logs.filter((l) => l.severity === "info")
                            .length,
                          color: "#3B82F6",
                        },
                        {
                          name: "Success",
                          value: logs.filter((l) => l.severity === "success")
                            .length,
                          color: "#10B981",
                        },
                        {
                          name: "Warning",
                          value: logs.filter((l) => l.severity === "warning")
                            .length,
                          color: "#F59E0B",
                        },
                        {
                          name: "Critical",
                          value: logs.filter((l) => l.severity === "critical")
                            .length,
                          color: "#EF4444",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: any) =>
                        `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {[
                        { name: "Info", value: 0, color: "#3B82F6" },
                        { name: "Success", value: 0, color: "#10B981" },
                        { name: "Warning", value: 0, color: "#F59E0B" },
                        { name: "Critical", value: 0, color: "#EF4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Log Detail Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Detail</DialogTitle>
            <DialogDescription>Event ID: {selectedLog?.id}</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  {getActionIcon(selectedLog.action)}
                  {getActionBadge(selectedLog.action)}
                </div>
                <div className="flex gap-2">
                  {getSeverityBadge(selectedLog.severity)}
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Timestamp</p>
                  <p className="font-medium">
                    {formatDateTime(selectedLog.timestamp)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Module</p>
                  <Badge variant="secondary">{selectedLog.module}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">User</p>
                  <p className="font-medium">{selectedLog.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLog.userEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLog.userRole}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entity</p>
                  <p className="font-medium">{selectedLog.entity}</p>
                  {selectedLog.entityId && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedLog.entityId}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Details</p>
                  <p className="text-sm">{selectedLog.details}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IP Address</p>
                  <p className="font-mono text-xs">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User Agent</p>
                  <p className="text-xs truncate">{selectedLog.userAgent}</p>
                </div>
              </div>

              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Changes Made</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Old Value</TableHead>
                        <TableHead>New Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedLog.changes.map((change, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-xs">
                            {change.field}
                          </TableCell>
                          <TableCell className="text-xs text-red-600">
                            {change.oldValue || "(empty)"}
                          </TableCell>
                          <TableCell className="text-xs text-green-600">
                            {change.newValue || "(empty)"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
