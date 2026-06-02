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
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileCheck,
  PlusCircle,
  MinusCircle,
  Percent,
  Wallet,
  PiggyBank,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Send,
} from "lucide-react";

// Types
interface BudgetLineItem {
  id: number;
  category: string;
  description: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  status: "on-track" | "over-budget" | "under-budget" | "at-risk";
}

interface DepartmentBudget {
  id: number;
  department: string;
  fiscalYear: string;
  totalBudget: number;
  totalActual: number;
  totalVariance: number;
  totalVariancePercentage: number;
  lineItems: BudgetLineItem[];
  status: "draft" | "submitted" | "approved" | "active" | "closed";
  manager: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

// Initial Data
const initialBudgets: DepartmentBudget[] = [
  {
    id: 1,
    department: "Engineering",
    fiscalYear: "FY 2026",
    totalBudget: 85000000,
    totalActual: 42500000,
    totalVariance: 42500000,
    totalVariancePercentage: 50,
    lineItems: [
      {
        id: 1,
        category: "Salaries",
        description: "Engineering team salaries",
        budgetedAmount: 50000000,
        actualAmount: 25000000,
        variance: 25000000,
        variancePercentage: 50,
        status: "on-track",
      },
      {
        id: 2,
        category: "Equipment",
        description: "Laptops and monitors",
        budgetedAmount: 10000000,
        actualAmount: 8000000,
        variance: 2000000,
        variancePercentage: 20,
        status: "on-track",
      },
      {
        id: 3,
        category: "Software",
        description: "Development tools & licenses",
        budgetedAmount: 15000000,
        actualAmount: 6000000,
        variance: 9000000,
        variancePercentage: 60,
        status: "under-budget",
      },
      {
        id: 4,
        category: "Training",
        description: "Professional development",
        budgetedAmount: 5000000,
        actualAmount: 2500000,
        variance: 2500000,
        variancePercentage: 50,
        status: "on-track",
      },
      {
        id: 5,
        category: "Travel",
        description: "Conferences & meetings",
        budgetedAmount: 5000000,
        actualAmount: 1000000,
        variance: 4000000,
        variancePercentage: 80,
        status: "under-budget",
      },
    ],
    status: "active",
    manager: "Sarah Williams",
    approvedBy: "CEO",
    approvedDate: "2026-01-05",
    createdAt: "2025-12-15",
    notes:
      "Q1-Q2 engineering budget. Majority of equipment purchases completed.",
  },
  {
    id: 2,
    department: "Marketing",
    fiscalYear: "FY 2026",
    totalBudget: 45000000,
    totalActual: 38000000,
    totalVariance: 7000000,
    totalVariancePercentage: 15.6,
    lineItems: [
      {
        id: 1,
        category: "Advertising",
        description: "Digital & social media ads",
        budgetedAmount: 20000000,
        actualAmount: 18500000,
        variance: 1500000,
        variancePercentage: 7.5,
        status: "on-track",
      },
      {
        id: 2,
        category: "Events",
        description: "Trade shows & conferences",
        budgetedAmount: 10000000,
        actualAmount: 9500000,
        variance: 500000,
        variancePercentage: 5,
        status: "on-track",
      },
      {
        id: 3,
        category: "Content",
        description: "Content creation & production",
        budgetedAmount: 8000000,
        actualAmount: 6200000,
        variance: 1800000,
        variancePercentage: 22.5,
        status: "under-budget",
      },
      {
        id: 4,
        category: "PR",
        description: "Public relations",
        budgetedAmount: 4000000,
        actualAmount: 2800000,
        variance: 1200000,
        variancePercentage: 30,
        status: "under-budget",
      },
      {
        id: 5,
        category: "Software",
        description: "Marketing tools",
        budgetedAmount: 3000000,
        actualAmount: 1000000,
        variance: 2000000,
        variancePercentage: 66.7,
        status: "under-budget",
      },
    ],
    status: "active",
    manager: "Mike Brown",
    approvedBy: "CFO",
    approvedDate: "2026-01-08",
    createdAt: "2025-12-20",
    notes: "Marketing campaign spending ramping up in Q2.",
  },
  {
    id: 3,
    department: "Sales",
    fiscalYear: "FY 2026",
    totalBudget: 35000000,
    totalActual: 32000000,
    totalVariance: 3000000,
    totalVariancePercentage: 8.6,
    lineItems: [
      {
        id: 1,
        category: "Salaries",
        description: "Sales team salaries & commission",
        budgetedAmount: 20000000,
        actualAmount: 19500000,
        variance: 500000,
        variancePercentage: 2.5,
        status: "on-track",
      },
      {
        id: 2,
        category: "Travel",
        description: "Client visits & meetings",
        budgetedAmount: 8000000,
        actualAmount: 7200000,
        variance: 800000,
        variancePercentage: 10,
        status: "on-track",
      },
      {
        id: 3,
        category: "Entertainment",
        description: "Client entertainment",
        budgetedAmount: 4000000,
        actualAmount: 3300000,
        variance: 700000,
        variancePercentage: 17.5,
        status: "on-track",
      },
      {
        id: 4,
        category: "Tools",
        description: "CRM & sales tools",
        budgetedAmount: 3000000,
        actualAmount: 2000000,
        variance: 1000000,
        variancePercentage: 33.3,
        status: "under-budget",
      },
    ],
    status: "active",
    manager: "David Lee",
    approvedBy: "CFO",
    approvedDate: "2026-01-10",
    createdAt: "2026-01-02",
    notes:
      "Sales team performing well. Commission costs aligned with projections.",
  },
  {
    id: 4,
    department: "HR",
    fiscalYear: "FY 2026",
    totalBudget: 25000000,
    totalActual: 14500000,
    totalVariance: 10500000,
    totalVariancePercentage: 42,
    lineItems: [
      {
        id: 1,
        category: "Recruitment",
        description: "Hiring & onboarding",
        budgetedAmount: 8000000,
        actualAmount: 4500000,
        variance: 3500000,
        variancePercentage: 43.8,
        status: "under-budget",
      },
      {
        id: 2,
        category: "Training",
        description: "Employee training programs",
        budgetedAmount: 7000000,
        actualAmount: 4000000,
        variance: 3000000,
        variancePercentage: 42.9,
        status: "under-budget",
      },
      {
        id: 3,
        category: "Benefits",
        description: "Employee benefits & wellness",
        budgetedAmount: 6000000,
        actualAmount: 3500000,
        variance: 2500000,
        variancePercentage: 41.7,
        status: "under-budget",
      },
      {
        id: 4,
        category: "Software",
        description: "HR management systems",
        budgetedAmount: 4000000,
        actualAmount: 2500000,
        variance: 1500000,
        variancePercentage: 37.5,
        status: "under-budget",
      },
    ],
    status: "active",
    manager: "Emma Wilson",
    approvedBy: "CEO",
    approvedDate: "2026-01-12",
    createdAt: "2026-01-05",
    notes: "Major recruitment drive planned for Q3.",
  },
  {
    id: 5,
    department: "Finance",
    fiscalYear: "FY 2026",
    totalBudget: 20000000,
    totalActual: 12000000,
    totalVariance: 8000000,
    totalVariancePercentage: 40,
    lineItems: [
      {
        id: 1,
        category: "Salaries",
        description: "Finance team salaries",
        budgetedAmount: 12000000,
        actualAmount: 7500000,
        variance: 4500000,
        variancePercentage: 37.5,
        status: "on-track",
      },
      {
        id: 2,
        category: "Software",
        description: "Accounting & ERP systems",
        budgetedAmount: 5000000,
        actualAmount: 3000000,
        variance: 2000000,
        variancePercentage: 40,
        status: "on-track",
      },
      {
        id: 3,
        category: "Consulting",
        description: "External auditors & consultants",
        budgetedAmount: 3000000,
        actualAmount: 1500000,
        variance: 1500000,
        variancePercentage: 50,
        status: "under-budget",
      },
    ],
    status: "submitted",
    manager: "Robert Chen",
    createdAt: "2026-01-10",
    notes: "Awaiting CFO approval for final budget allocation.",
  },
  {
    id: 6,
    department: "IT",
    fiscalYear: "FY 2026",
    totalBudget: 55000000,
    totalActual: 31000000,
    totalVariance: 24000000,
    totalVariancePercentage: 43.6,
    lineItems: [
      {
        id: 1,
        category: "Infrastructure",
        description: "Servers & networking",
        budgetedAmount: 25000000,
        actualAmount: 16000000,
        variance: 9000000,
        variancePercentage: 36,
        status: "on-track",
      },
      {
        id: 2,
        category: "Software",
        description: "Enterprise software licenses",
        budgetedAmount: 15000000,
        actualAmount: 8000000,
        variance: 7000000,
        variancePercentage: 46.7,
        status: "under-budget",
      },
      {
        id: 3,
        category: "Security",
        description: "Cybersecurity tools & services",
        budgetedAmount: 10000000,
        actualAmount: 5000000,
        variance: 5000000,
        variancePercentage: 50,
        status: "on-track",
      },
      {
        id: 4,
        category: "Support",
        description: "IT support & maintenance",
        budgetedAmount: 5000000,
        actualAmount: 2000000,
        variance: 3000000,
        variancePercentage: 60,
        status: "under-budget",
      },
    ],
    status: "draft",
    manager: "Tom Harris",
    createdAt: "2026-01-15",
    notes: "Draft budget - pending department head review.",
  },
];

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "IT",
  "Operations",
  "Administration",
];
const fiscalYears = ["FY 2024", "FY 2025", "FY 2026", "FY 2027"];
const budgetCategories = [
  "Salaries",
  "Equipment",
  "Software",
  "Training",
  "Travel",
  "Advertising",
  "Events",
  "Content",
  "PR",
  "Entertainment",
  "Tools",
  "Recruitment",
  "Benefits",
  "Consulting",
  "Infrastructure",
  "Security",
  "Support",
  "Utilities",
  "Rent",
  "Insurance",
  "Other",
];

export default function BudgetPage() {
  // State
  const [budgets, setBudgets] = useState<DepartmentBudget[]>(initialBudgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [fiscalYearFilter, setFiscalYearFilter] = useState("FY 2026");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentBudget;
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
  const [selectedBudget, setSelectedBudget] = useState<DepartmentBudget | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    department: "",
    fiscalYear: "FY 2026",
    manager: "",
    lineItems: [] as BudgetLineItem[],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.totalActual, 0);
    const totalVariance = totalBudgeted - totalActual;
    const overallSpentPercentage =
      totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0;

    const active = budgets.filter((b) => b.status === "active").length;
    const submitted = budgets.filter((b) => b.status === "submitted").length;
    const draft = budgets.filter((b) => b.status === "draft").length;
    const approved = budgets.filter((b) => b.status === "approved").length;
    const closed = budgets.filter((b) => b.status === "closed").length;

    const overBudgetItems = budgets.reduce(
      (sum, b) =>
        sum +
        b.lineItems.filter((item) => item.status === "over-budget").length,
      0,
    );
    const atRiskItems = budgets.reduce(
      (sum, b) =>
        sum + b.lineItems.filter((item) => item.status === "at-risk").length,
      0,
    );

    return {
      totalBudgeted,
      totalActual,
      totalVariance,
      overallSpentPercentage,
      active,
      submitted,
      draft,
      approved,
      closed,
      overBudgetItems,
      atRiskItems,
      totalDepartments: budgets.length,
    };
  }, [budgets]);

  // Filter and sort
  const filteredBudgets = useMemo(() => {
    let result = [...budgets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.department.toLowerCase().includes(query) ||
          b.manager.toLowerCase().includes(query) ||
          b.fiscalYear.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((b) => b.department === departmentFilter);
    }

    if (fiscalYearFilter !== "all") {
      result = result.filter((b) => b.fiscalYear === fiscalYearFilter);
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
  }, [
    budgets,
    searchQuery,
    statusFilter,
    departmentFilter,
    fiscalYearFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof DepartmentBudget) => {
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

  const addLineItem = () => {
    const newItem: BudgetLineItem = {
      id: Date.now(),
      category: "",
      description: "",
      budgetedAmount: 0,
      actualAmount: 0,
      variance: 0,
      variancePercentage: 0,
      status: "on-track",
    };
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  };

  const removeLineItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== itemId),
    }));
  };

  const updateLineItem = (
    itemId: number,
    field: keyof BudgetLineItem,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id !== itemId) return item;

        const updated = { ...item, [field]: value };

        if (field === "budgetedAmount" || field === "actualAmount") {
          updated.variance = updated.budgetedAmount - updated.actualAmount;
          updated.variancePercentage =
            updated.budgetedAmount > 0
              ? Math.round(
                  (updated.variance / updated.budgetedAmount) * 10000,
                ) / 100
              : 0;

          // Auto-determine status
          const spentPercent =
            updated.budgetedAmount > 0
              ? (updated.actualAmount / updated.budgetedAmount) * 100
              : 0;

          if (updated.actualAmount > updated.budgetedAmount) {
            updated.status = "over-budget";
          } else if (spentPercent > 90) {
            updated.status = "at-risk";
          } else if (spentPercent < 30) {
            updated.status = "under-budget";
          } else {
            updated.status = "on-track";
          }
        }

        return updated;
      }),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.department) errors.department = "Department is required";
    if (!formData.manager.trim()) errors.manager = "Manager name is required";
    if (formData.lineItems.length === 0)
      errors.lineItems = "At least one line item is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBudget = () => {
    if (!validateForm()) return;

    const totalBudget = formData.lineItems.reduce(
      (sum, item) => sum + item.budgetedAmount,
      0,
    );
    const totalActual = formData.lineItems.reduce(
      (sum, item) => sum + item.actualAmount,
      0,
    );

    const newBudget: DepartmentBudget = {
      id: Math.max(...budgets.map((b) => b.id), 0) + 1,
      department: formData.department,
      fiscalYear: formData.fiscalYear,
      totalBudget,
      totalActual,
      totalVariance: totalBudget - totalActual,
      totalVariancePercentage:
        totalBudget > 0
          ? Math.round(((totalBudget - totalActual) / totalBudget) * 10000) /
            100
          : 0,
      lineItems: formData.lineItems,
      status: "draft",
      manager: formData.manager,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBudgets((prev) => [newBudget, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditBudget = () => {
    if (!validateForm() || !selectedBudget) return;

    const totalBudget = formData.lineItems.reduce(
      (sum, item) => sum + item.budgetedAmount,
      0,
    );
    const totalActual = formData.lineItems.reduce(
      (sum, item) => sum + item.actualAmount,
      0,
    );

    setBudgets((prev) =>
      prev.map((b) =>
        b.id === selectedBudget.id
          ? {
              ...b,
              department: formData.department,
              fiscalYear: formData.fiscalYear,
              manager: formData.manager,
              lineItems: formData.lineItems,
              totalBudget,
              totalActual,
              totalVariance: totalBudget - totalActual,
              totalVariancePercentage:
                totalBudget > 0
                  ? Math.round(
                      ((totalBudget - totalActual) / totalBudget) * 10000,
                    ) / 100
                  : 0,
              notes: formData.notes,
            }
          : b,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedBudget(null);
  };

  const handleDeleteBudget = () => {
    if (!selectedBudget) return;
    setBudgets((prev) => prev.filter((b) => b.id !== selectedBudget.id));
    setIsDeleteDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleSubmitBudget = () => {
    if (!selectedBudget) return;
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === selectedBudget.id ? { ...b, status: "submitted" as const } : b,
      ),
    );
    setIsSubmitDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleApproveBudget = () => {
    if (!selectedBudget) return;
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === selectedBudget.id
          ? {
              ...b,
              status: "active" as const,
              approvedBy: "Admin User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : b,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedBudget(null);
  };

  const openEditModal = (budget: DepartmentBudget) => {
    setSelectedBudget(budget);
    setFormData({
      department: budget.department,
      fiscalYear: budget.fiscalYear,
      manager: budget.manager,
      lineItems: [...budget.lineItems],
      notes: budget.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (budget: DepartmentBudget) => {
    setSelectedBudget(budget);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      department: "",
      fiscalYear: "FY 2026",
      manager: "",
      lineItems: [],
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
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: DepartmentBudget["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <FileCheck className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-200 text-gray-600">
            <Layers className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getItemStatusBadge = (status: BudgetLineItem["status"]) => {
    switch (status) {
      case "on-track":
        return (
          <Badge className="bg-green-100 text-green-700 text-xs">
            On Track
          </Badge>
        );
      case "over-budget":
        return (
          <Badge className="bg-red-100 text-red-700 text-xs">Over Budget</Badge>
        );
      case "under-budget":
        return (
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            Under Budget
          </Badge>
        );
      case "at-risk":
        return (
          <Badge className="bg-orange-100 text-orange-700 text-xs">
            At Risk
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSpentPercentage = (actual: number, budgeted: number) => {
    return budgeted > 0 ? Math.min(100, (actual / budgeted) * 100) : 0;
  };

  const getSpentColor = (percentage: number) => {
    if (percentage > 100) return "bg-red-500";
    if (percentage > 90) return "bg-orange-500";
    if (percentage > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const canEdit = (status: string) => status === "draft";
  const canSubmit = (status: string) => status === "draft";
  const canApprove = (status: string) => status === "submitted";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Budget
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and monitor departmental budgets
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                Set up a departmental budget with line items for the fiscal
                year.
              </DialogDescription>
            </DialogHeader>
            <BudgetForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onAddItem={addLineItem}
              onRemoveItem={removeLineItem}
              onUpdateItem={updateLineItem}
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
              <Button onClick={handleCreateBudget}>Save Budget</Button>
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
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalBudgeted)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalActual)}
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
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalVariance)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <PiggyBank className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Spent</p>
                <p className="text-2xl font-bold">
                  {stats.overallSpentPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Percent className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <Progress
              value={stats.overallSpentPercentage}
              className="h-2 mt-3"
            />
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
                placeholder="Search by department, manager..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={fiscalYearFilter}
              onValueChange={(v) => {
                setFiscalYearFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {fiscalYears.map((fy) => (
                  <SelectItem key={fy} value={fy}>
                    {fy}
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Department Budgets —{" "}
            {fiscalYearFilter === "all" ? "All Years" : fiscalYearFilter}
          </CardTitle>
          <CardDescription>
            {filteredBudgets.length} budget
            {filteredBudgets.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>FY</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("totalBudget")}
                    >
                      Budgeted
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBudgets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No budgets found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBudgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {budget.department}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{budget.fiscalYear}</TableCell>
                      <TableCell className="text-sm">
                        {budget.manager}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(budget.totalBudget)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(budget.totalActual)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            budget.totalVariance >= 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {formatCurrency(budget.totalVariance)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>
                              {budget.totalVariancePercentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={getSpentPercentage(
                              budget.totalActual,
                              budget.totalBudget,
                            )}
                            className="h-2"
                            indicatorClassName={getSpentColor(
                              getSpentPercentage(
                                budget.totalActual,
                                budget.totalBudget,
                              ),
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(budget.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View"
                            onClick={() => openViewModal(budget)}
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
                                onClick={() => openViewModal(budget)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              {canEdit(budget.status) && (
                                <DropdownMenuItem
                                  onClick={() => openEditModal(budget)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                              )}
                              {canSubmit(budget.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBudget(budget);
                                    setIsSubmitDialogOpen(true);
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-2" /> Submit for
                                  Approval
                                </DropdownMenuItem>
                              )}
                              {canApprove(budget.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBudget(budget);
                                    setIsApproveDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />{" "}
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {canEdit(budget.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedBudget(budget);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
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
          {filteredBudgets.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredBudgets.length)}{" "}
                  of {filteredBudgets.length}
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

      {/* View Budget Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Budget Details</DialogTitle>
            <DialogDescription>
              {selectedBudget?.department} — {selectedBudget?.fiscalYear}
            </DialogDescription>
          </DialogHeader>
          {selectedBudget && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedBudget.totalBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actual Spent</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedBudget.totalActual)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedBudget.totalVariance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  {getStatusBadge(selectedBudget.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Manager</p>
                  <p className="font-medium">{selectedBudget.manager}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedBudget.createdAt)}
                  </p>
                </div>
                {selectedBudget.approvedBy && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Approved By</p>
                      <p className="font-medium">{selectedBudget.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Approved Date</p>
                      <p className="font-medium">
                        {formatDate(selectedBudget.approvedDate || "")}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <p className="font-medium mb-3">Line Items</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Budgeted</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBudget.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.description}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.budgetedAmount)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.actualAmount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              item.variance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatCurrency(Math.abs(item.variance))}
                            {item.variance < 0 ? " Over" : ""}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="w-[80px] space-y-1">
                            <Progress
                              value={getSpentPercentage(
                                item.actualAmount,
                                item.budgetedAmount,
                              )}
                              className="h-2"
                              indicatorClassName={getSpentColor(
                                getSpentPercentage(
                                  item.actualAmount,
                                  item.budgetedAmount,
                                ),
                              )}
                            />
                            <span className="text-xs">
                              {item.variancePercentage.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getItemStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedBudget.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedBudget.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedBudget && canApprove(selectedBudget.status) && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsApproveDialogOpen(true);
                }}
              >
                Approve Budget
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update budget details and line items.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onAddItem={addLineItem}
            onRemoveItem={removeLineItem}
            onUpdateItem={updateLineItem}
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
            <Button onClick={handleEditBudget}>Save Changes</Button>
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
              Submit <strong>{selectedBudget?.department}</strong> budget for{" "}
              <strong>
                {formatCurrency(selectedBudget?.totalBudget || 0)}
              </strong>{" "}
              for approval?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitBudget}>
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
            <AlertDialogTitle>Approve Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Approve <strong>{selectedBudget?.department}</strong> budget for{" "}
              <strong>
                {formatCurrency(selectedBudget?.totalBudget || 0)}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveBudget}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
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
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete <strong>{selectedBudget?.department}</strong>{" "}
              budget? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBudget}
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

// Budget Form Component
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function BudgetForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  formData: {
    department: string;
    fiscalYear: string;
    manager: string;
    lineItems: BudgetLineItem[];
    notes: string;
  };
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onUpdateItem: (
    id: number,
    field: keyof BudgetLineItem,
    value: string | number,
  ) => void;
}) {
  const totalBudget = formData.lineItems.reduce(
    (s, i) => s + i.budgetedAmount,
    0,
  );
  const totalActual = formData.lineItems.reduce(
    (s, i) => s + i.actualAmount,
    0,
  );

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(v) => onSelectChange("department", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.department && (
            <p className="text-sm text-red-500">{formErrors.department}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Fiscal Year</Label>
          <Select
            value={formData.fiscalYear}
            onValueChange={(v) => onSelectChange("fiscalYear", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fiscalYears.map((fy) => (
                <SelectItem key={fy} value={fy}>
                  {fy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Manager *</Label>
          <Input
            name="manager"
            value={formData.manager}
            onChange={onInputChange}
            placeholder="Department manager"
          />
          {formErrors.manager && (
            <p className="text-sm text-red-500">{formErrors.manager}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Line Items *</Label>
          <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
        {formErrors.lineItems && (
          <p className="text-sm text-red-500">{formErrors.lineItems}</p>
        )}

        {formData.lineItems.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Layers className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No line items added</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddItem}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add first item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.lineItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-muted/30 items-end"
              >
                <div className="col-span-12 sm:col-span-2">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={item.category}
                    onValueChange={(v) => onUpdateItem(item.id, "category", v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      onUpdateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <Label className="text-xs">Budgeted (₦)</Label>
                  <Input
                    type="number"
                    value={item.budgetedAmount || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "budgetedAmount",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <Label className="text-xs">Actual (₦)</Label>
                  <Input
                    type="number"
                    value={item.actualAmount || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "actualAmount",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <Label className="text-xs">Variance</Label>
                  <div className="mt-1 p-2 bg-muted rounded text-sm font-medium">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    }).format(item.variance)}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-1 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end p-4 bg-muted rounded-lg gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Total Budget:</span>{" "}
                <span className="font-bold">{formatCurrency(totalBudget)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Actual:</span>{" "}
                <span className="font-bold">{formatCurrency(totalActual)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining:</span>{" "}
                <span className="font-bold text-green-600">
                  {formatCurrency(totalBudget - totalActual)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          placeholder="Additional notes..."
          rows={2}
        />
      </div>
    </div>
  );
}
