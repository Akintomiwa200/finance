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
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  BarChart3,
  Target,
  Settings,
  Copy,
  Printer,
  Save,
  Send,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Types
type BudgetStatus = "draft" | "submitted" | "approved" | "rejected";
type BudgetPeriod = "monthly" | "quarterly" | "annually";

interface DepartmentBudget {
  id: number;
  departmentId: number;
  departmentName: string;
  fiscalYear: number;
  period: BudgetPeriod;
  totalBudget: number;
  totalActual: number;
  totalVariance: number;
  variancePercent: number;
  status: BudgetStatus;
  categories: BudgetCategory[];
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface BudgetCategory {
  id: number;
  categoryName: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  january?: number;
  february?: number;
  march?: number;
  april?: number;
  may?: number;
  june?: number;
  july?: number;
  august?: number;
  september?: number;
  october?: number;
  november?: number;
  december?: number;
}

// Mock Departments
const departments = [
  { id: 1, name: "Finance", code: "FIN", head: "John Doe", employees: 12 },
  {
    id: 2,
    name: "Engineering",
    code: "ENG",
    head: "Jane Smith",
    employees: 45,
  },
  { id: 3, name: "Sales", code: "SAL", head: "Bob Johnson", employees: 28 },
  {
    id: 4,
    name: "Marketing",
    code: "MKT",
    head: "Alice Williams",
    employees: 15,
  },
  {
    id: 5,
    name: "Human Resources",
    code: "HR",
    head: "Carol Brown",
    employees: 10,
  },
  { id: 6, name: "Operations", code: "OPS", head: "David Lee", employees: 32 },
  { id: 7, name: "IT", code: "IT", head: "Eva Martinez", employees: 18 },
  {
    id: 8,
    name: "Customer Support",
    code: "CS",
    head: "Frank Wilson",
    employees: 25,
  },
];

// Mock Budget Categories
const budgetCategories = [
  "Salaries & Wages",
  "Benefits",
  "Training & Development",
  "Office Supplies",
  "Software & Licenses",
  "Hardware & Equipment",
  "Travel & Entertainment",
  "Marketing & Advertising",
  "Professional Services",
  "Rent & Utilities",
  "Maintenance",
  "Communication",
  "Research & Development",
  "Other",
];

// Mock Department Budgets
const mockDepartmentBudgets: DepartmentBudget[] = [
  {
    id: 1,
    departmentId: 2,
    departmentName: "Engineering",
    fiscalYear: 2026,
    period: "annually",
    totalBudget: 250000000,
    totalActual: 185000000,
    totalVariance: 65000000,
    variancePercent: 26,
    status: "approved",
    categories: [
      {
        id: 1,
        categoryName: "Salaries & Wages",
        budgetAmount: 150000000,
        actualAmount: 120000000,
        variance: 30000000,
        variancePercent: 20,
      },
      {
        id: 2,
        categoryName: "Software & Licenses",
        budgetAmount: 30000000,
        actualAmount: 25000000,
        variance: 5000000,
        variancePercent: 16.7,
      },
      {
        id: 3,
        categoryName: "Hardware & Equipment",
        budgetAmount: 40000000,
        actualAmount: 25000000,
        variance: 15000000,
        variancePercent: 37.5,
      },
      {
        id: 4,
        categoryName: "Training & Development",
        budgetAmount: 15000000,
        actualAmount: 8000000,
        variance: 7000000,
        variancePercent: 46.7,
      },
      {
        id: 5,
        categoryName: "Other",
        budgetAmount: 15000000,
        actualAmount: 7000000,
        variance: 8000000,
        variancePercent: 53.3,
      },
    ],
    notes: "Includes new hardware for development team",
    approvedBy: "CFO",
    approvedDate: "2025-12-15",
    createdAt: "2025-11-01",
    updatedAt: "2025-12-15",
    createdBy: "Budget Manager",
  },
  {
    id: 2,
    departmentId: 3,
    departmentName: "Sales",
    fiscalYear: 2026,
    period: "annually",
    totalBudget: 180000000,
    totalActual: 95000000,
    totalVariance: 85000000,
    variancePercent: 47.2,
    status: "approved",
    categories: [
      {
        id: 6,
        categoryName: "Salaries & Wages",
        budgetAmount: 80000000,
        actualAmount: 60000000,
        variance: 20000000,
        variancePercent: 25,
      },
      {
        id: 7,
        categoryName: "Marketing & Advertising",
        budgetAmount: 60000000,
        actualAmount: 20000000,
        variance: 40000000,
        variancePercent: 66.7,
      },
      {
        id: 8,
        categoryName: "Travel & Entertainment",
        budgetAmount: 25000000,
        actualAmount: 10000000,
        variance: 15000000,
        variancePercent: 60,
      },
      {
        id: 9,
        categoryName: "Other",
        budgetAmount: 15000000,
        actualAmount: 5000000,
        variance: 10000000,
        variancePercent: 66.7,
      },
    ],
    approvedBy: "CFO",
    approvedDate: "2025-12-18",
    createdAt: "2025-11-05",
    updatedAt: "2025-12-18",
    createdBy: "Budget Manager",
  },
  {
    id: 3,
    departmentId: 4,
    departmentName: "Marketing",
    fiscalYear: 2026,
    period: "annually",
    totalBudget: 120000000,
    totalActual: 45000000,
    totalVariance: 75000000,
    variancePercent: 62.5,
    status: "approved",
    categories: [
      {
        id: 10,
        categoryName: "Marketing & Advertising",
        budgetAmount: 80000000,
        actualAmount: 30000000,
        variance: 50000000,
        variancePercent: 62.5,
      },
      {
        id: 11,
        categoryName: "Salaries & Wages",
        budgetAmount: 30000000,
        actualAmount: 25000000,
        variance: 5000000,
        variancePercent: 16.7,
      },
      {
        id: 12,
        categoryName: "Other",
        budgetAmount: 10000000,
        actualAmount: 2000000,
        variance: 8000000,
        variancePercent: 80,
      },
    ],
    approvedBy: "CFO",
    approvedDate: "2025-12-20",
    createdAt: "2025-11-10",
    updatedAt: "2025-12-20",
    createdBy: "Budget Manager",
  },
  {
    id: 4,
    departmentId: 1,
    departmentName: "Finance",
    fiscalYear: 2026,
    period: "annually",
    totalBudget: 80000000,
    totalActual: 65000000,
    totalVariance: 15000000,
    variancePercent: 18.8,
    status: "draft",
    categories: [
      {
        id: 13,
        categoryName: "Salaries & Wages",
        budgetAmount: 50000000,
        actualAmount: 42000000,
        variance: 8000000,
        variancePercent: 16,
      },
      {
        id: 14,
        categoryName: "Professional Services",
        budgetAmount: 15000000,
        actualAmount: 12000000,
        variance: 3000000,
        variancePercent: 20,
      },
      {
        id: 15,
        categoryName: "Other",
        budgetAmount: 15000000,
        actualAmount: 11000000,
        variance: 4000000,
        variancePercent: 26.7,
      },
    ],
    createdAt: "2025-11-15",
    updatedAt: "2025-11-15",
    createdBy: "Budget Manager",
  },
  {
    id: 5,
    departmentId: 5,
    departmentName: "Human Resources",
    fiscalYear: 2026,
    period: "annually",
    totalBudget: 60000000,
    totalActual: 35000000,
    totalVariance: 25000000,
    variancePercent: 41.7,
    status: "submitted",
    categories: [
      {
        id: 16,
        categoryName: "Salaries & Wages",
        budgetAmount: 40000000,
        actualAmount: 35000000,
        variance: 5000000,
        variancePercent: 12.5,
      },
      {
        id: 17,
        categoryName: "Training & Development",
        budgetAmount: 15000000,
        actualAmount: 5000000,
        variance: 10000000,
        variancePercent: 66.7,
      },
      {
        id: 18,
        categoryName: "Benefits",
        budgetAmount: 5000000,
        actualAmount: 4000000,
        variance: 1000000,
        variancePercent: 20,
      },
    ],
    createdAt: "2025-11-20",
    updatedAt: "2025-11-20",
    createdBy: "HR Manager",
  },
];

const statuses = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  {
    value: "submitted",
    label: "Submitted",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "approved",
    label: "Approved",
    color: "bg-green-100 text-green-700",
  },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

// Helper functions
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

const getStatusBadge = (status: BudgetStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    draft: <FileText className="h-3 w-3 mr-1" />,
    submitted: <Send className="h-3 w-3 mr-1" />,
    approved: <CheckCircle className="h-3 w-3 mr-1" />,
    rejected: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getVarianceColor = (variancePercent: number) => {
  if (variancePercent < 10) return "text-green-600";
  if (variancePercent < 30) return "text-yellow-600";
  return "text-red-600";
};

export default function DepartmentBudgets() {
  const router = useRouter();

  // State
  const [budgets, setBudgets] = useState<DepartmentBudget[]>(
    mockDepartmentBudgets,
  );
  const [departmentsList] = useState(departments);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2026");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentBudget;
    direction: "asc" | "desc";
  }>({ key: "departmentName", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBudget, setSelectedBudget] = useState<DepartmentBudget | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"budgets" | "analytics">(
    "budgets",
  );

  // Form state
  const [formData, setFormData] = useState({
    departmentId: 0,
    fiscalYear: new Date().getFullYear(),
    period: "annually" as BudgetPeriod,
    categories: [] as BudgetCategory[],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(
    null,
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.totalActual, 0);
    const totalVariance = totalBudget - totalActual;
    const avgUtilization =
      totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
    const approvedCount = budgets.filter((b) => b.status === "approved").length;
    const draftCount = budgets.filter((b) => b.status === "draft").length;
    const submittedCount = budgets.filter(
      (b) => b.status === "submitted",
    ).length;

    const departmentStats: Record<
      string,
      { budget: number; actual: number; percent: number }
    > = {};
    budgets.forEach((b) => {
      departmentStats[b.departmentName] = {
        budget: b.totalBudget,
        actual: b.totalActual,
        percent: b.totalBudget > 0 ? (b.totalActual / b.totalBudget) * 100 : 0,
      };
    });

    return {
      totalBudget,
      totalActual,
      totalVariance,
      avgUtilization,
      approvedCount,
      draftCount,
      submittedCount,
      departmentStats,
    };
  }, [budgets]);

  // Filter and sort
  const filteredBudgets = useMemo(() => {
    let result = [...budgets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.departmentName.toLowerCase().includes(query) ||
          b.createdBy.toLowerCase().includes(query),
      );
    }

    if (departmentFilter !== "all") {
      result = result.filter(
        (b) => b.departmentId === parseInt(departmentFilter),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (yearFilter !== "all") {
      result = result.filter((b) => b.fiscalYear === parseInt(yearFilter));
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
    departmentFilter,
    statusFilter,
    yearFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Chart data
  const departmentChartData = useMemo(() => {
    return Object.entries(stats.departmentStats).map(([name, data]) => ({
      name,
      budget: data.budget,
      actual: data.actual,
      utilization: data.percent,
    }));
  }, [stats.departmentStats]);

  const categoryChartData =
    selectedBudget?.categories.map((cat) => ({
      name: cat.categoryName,
      budget: cat.budgetAmount,
      actual: cat.actualAmount,
      variance: cat.variance,
    })) || [];

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  // Handlers
  const handleSort = (key: keyof DepartmentBudget) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewBudget = (budget: DepartmentBudget) => {
    setSelectedBudget(budget);
    setIsViewModalOpen(true);
  };

  const handleEditBudget = (budget: DepartmentBudget) => {
    setSelectedBudget(budget);
    setFormData({
      departmentId: budget.departmentId,
      fiscalYear: budget.fiscalYear,
      period: budget.period,
      categories: [...budget.categories],
      notes: budget.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (categoryData: Partial<BudgetCategory>) => {
    if (editingCategory) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === editingCategory.id
            ? ({ ...c, ...categoryData } as BudgetCategory)
            : c,
        ),
      }));
    } else {
      const newCategory: BudgetCategory = {
        id: Date.now(),
        categoryName: categoryData.categoryName || "",
        budgetAmount: categoryData.budgetAmount || 0,
        actualAmount: 0,
        variance: 0,
        variancePercent: 0,
      };
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleRemoveCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== categoryId),
    }));
  };

  const calculateTotalBudget = (categories: BudgetCategory[]) => {
    return categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.departmentId) errors.departmentId = "Department is required";
    if (formData.categories.length === 0)
      errors.categories = "At least one budget category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBudget = () => {
    if (!validateForm()) return;

    const selectedDept = departmentsList.find(
      (d) => d.id === formData.departmentId,
    );
    const totalBudget = calculateTotalBudget(formData.categories);

    const newBudget: DepartmentBudget = {
      id: Math.max(...budgets.map((b) => b.id), 0) + 1,
      departmentId: formData.departmentId,
      departmentName: selectedDept!.name,
      fiscalYear: formData.fiscalYear,
      period: formData.period,
      totalBudget,
      totalActual: 0,
      totalVariance: totalBudget,
      variancePercent: 100,
      status: "draft",
      categories: formData.categories,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
    };

    setBudgets((prev) => [newBudget, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateBudget = () => {
    if (!validateForm() || !selectedBudget) return;

    const totalBudget = calculateTotalBudget(formData.categories);
    const totalActual = formData.categories.reduce(
      (sum, cat) => sum + cat.actualAmount,
      0,
    );
    const totalVariance = totalBudget - totalActual;
    const variancePercent =
      totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

    const updatedBudget: DepartmentBudget = {
      ...selectedBudget,
      departmentId: formData.departmentId,
      fiscalYear: formData.fiscalYear,
      period: formData.period,
      totalBudget,
      totalActual,
      totalVariance,
      variancePercent,
      categories: formData.categories.map((cat) => ({
        ...cat,
        variance: cat.budgetAmount - cat.actualAmount,
        variancePercent:
          cat.budgetAmount > 0
            ? ((cat.budgetAmount - cat.actualAmount) / cat.budgetAmount) * 100
            : 0,
      })),
      notes: formData.notes,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setBudgets((prev) =>
      prev.map((b) => (b.id === selectedBudget.id ? updatedBudget : b)),
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

  const handleApproveBudget = (budget: DepartmentBudget) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budget.id
          ? {
              ...b,
              status: "approved",
              approvedBy: "CFO",
              approvedDate: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : b,
      ),
    );
  };

  const resetForm = () => {
    setFormData({
      departmentId: 0,
      fiscalYear: new Date().getFullYear(),
      period: "annually",
      categories: [],
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Department",
      "Fiscal Year",
      "Total Budget",
      "Total Actual",
      "Variance",
      "Variance %",
      "Status",
    ];
    const csvData = filteredBudgets.map((b) => [
      b.departmentName,
      b.fiscalYear.toString(),
      b.totalBudget.toString(),
      b.totalActual.toString(),
      b.totalVariance.toString(),
      `${b.variancePercent.toFixed(1)}%`,
      b.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `department-budgets-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setBudgets([...mockDepartmentBudgets]);
    setCurrentPage(1);
    setSearchQuery("");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setYearFilter("2026");
  };

  // Category Modal Component
  const CategoryModal = () => {
    const [categoryData, setCategoryData] = useState<Partial<BudgetCategory>>(
      editingCategory || {
        categoryName: "",
        budgetAmount: 0,
        actualAmount: 0,
      },
    );

    const handleSave = () => {
      if (!categoryData.categoryName || !categoryData.budgetAmount) {
        return;
      }
      handleSaveCategory(categoryData);
    };

    return (
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Budget Category" : "Add Budget Category"}
            </DialogTitle>
            <DialogDescription>Enter category budget details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Category Name *</Label>
              <Select
                value={categoryData.categoryName}
                onValueChange={(v) =>
                  setCategoryData((prev) => ({ ...prev, categoryName: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
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
            <div>
              <Label>Budget Amount (₦) *</Label>
              <Input
                type="number"
                value={categoryData.budgetAmount || ""}
                onChange={(e) =>
                  setCategoryData((prev) => ({
                    ...prev,
                    budgetAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                placeholder="0"
              />
            </div>
            <div>
              <Label>Actual Amount (₦)</Label>
              <Input
                type="number"
                value={categoryData.actualAmount || ""}
                onChange={(e) =>
                  setCategoryData((prev) => ({
                    ...prev,
                    actualAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Department Budgets
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage budgets across all departments
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalBudget)}
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
                <p className="text-sm text-muted-foreground">Total Actual</p>
                <p className="text-2xl font-bold text-green-600">
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
                <p className="text-sm text-muted-foreground">
                  Average Utilization
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.avgUtilization.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Approved Budgets
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approvedCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
                placeholder="Search by department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

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
                {departmentsList.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
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
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={yearFilter}
              onValueChange={(v) => {
                setYearFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[100px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="budgets">Department Budgets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("departmentName")}
                        >
                          Department
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Fiscal Year</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("totalBudget")}
                        >
                          Budget
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("totalActual")}
                        >
                          Actual
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("totalVariance")}
                        >
                          Variance
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBudgets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Building2 className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No department budgets found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBudgets.map((budget) => {
                        const utilization =
                          budget.totalBudget > 0
                            ? (budget.totalActual / budget.totalBudget) * 100
                            : 0;
                        return (
                          <TableRow key={budget.id}>
                            <TableCell className="font-medium">
                              {budget.departmentName}
                            </TableCell>
                            <TableCell>{budget.fiscalYear}</TableCell>
                            <TableCell>
                              {formatCurrency(budget.totalBudget)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(budget.totalActual)}
                            </TableCell>
                            <TableCell
                              className={getVarianceColor(
                                budget.variancePercent,
                              )}
                            >
                              {budget.totalVariance >= 0 ? "+" : "-"}
                              {formatCurrency(Math.abs(budget.totalVariance))}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {utilization.toFixed(0)}%
                                </span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${utilization > 80 ? "bg-red-500" : utilization > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                                    style={{
                                      width: `${Math.min(utilization, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(budget.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewBudget(budget)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {budget.status === "draft" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditBudget(budget)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleApproveBudget(budget)
                                      }
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </>
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
              {filteredBudgets.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
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
                        filteredBudgets.length,
                      )}{" "}
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Budget Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Budget vs Actual by Department
                </CardTitle>
                <CardDescription>Comparison across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                    <Bar dataKey="actual" fill="#10B981" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Utilization Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Budget Utilization Rate
                </CardTitle>
                <CardDescription>
                  Percentage of budget used by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentChartData.map((dept, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{dept.name}</span>
                        <span className="font-medium">
                          {dept.utilization.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${dept.utilization > 80 ? "bg-red-500" : dept.utilization > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{
                            width: `${Math.min(dept.utilization, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Budget Category Distribution
                </CardTitle>
                <CardDescription>
                  Overall budget allocation by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={budgets
                        .flatMap((b) => b.categories)
                        .reduce(
                          (acc, cat) => {
                            const existing = acc.find(
                              (c) => c.name === cat.categoryName,
                            );
                            if (existing) {
                              existing.value += cat.budgetAmount;
                            } else {
                              acc.push({
                                name: cat.categoryName,
                                value: cat.budgetAmount,
                              });
                            }
                            return acc;
                          },
                          [] as { name: string; value: number }[],
                        )}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgets
                        .flatMap((b) => b.categories)
                        .map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Status</CardTitle>
                <CardDescription>
                  Distribution by approval status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approved</span>
                      <span className="font-medium text-green-600">
                        {stats.approvedCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(stats.approvedCount / budgets.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Submitted</span>
                      <span className="font-medium text-yellow-600">
                        {stats.submittedCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${(stats.submittedCount / budgets.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Draft</span>
                      <span className="font-medium text-gray-600">
                        {stats.draftCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{
                          width: `${(stats.draftCount / budgets.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Budget Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedBudget?.departmentName} Budget -{" "}
                {selectedBudget?.fiscalYear}
              </span>
              {selectedBudget && getStatusBadge(selectedBudget.status)}
            </DialogTitle>
            <DialogDescription>
              Created by {selectedBudget?.createdBy} on{" "}
              {formatDate(selectedBudget?.createdAt || "")}
            </DialogDescription>
          </DialogHeader>
          {selectedBudget && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedBudget.totalBudget)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Actual Spending
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedBudget.totalActual)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Variance</p>
                  <p
                    className={`text-lg font-bold ${selectedBudget.totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(Math.abs(selectedBudget.totalVariance))}
                    {selectedBudget.totalVariance >= 0 ? " Under" : " Over"}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Utilization</p>
                  <p className="text-lg font-bold">
                    {(
                      (selectedBudget.totalActual /
                        selectedBudget.totalBudget) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Budget Categories</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBudget.categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.categoryName}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cat.budgetAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cat.actualAmount)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${getVarianceColor(cat.variancePercent)}`}
                        >
                          {formatCurrency(Math.abs(cat.variance))}
                        </TableCell>
                        <TableCell className="text-right">
                          {(
                            (cat.actualAmount / cat.budgetAmount) *
                            100
                          ).toFixed(1)}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Category Chart */}
              {categoryChartData.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Category Chart</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                      <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                      <Bar dataKey="actual" fill="#10B981" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {selectedBudget.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedBudget.notes}</p>
                </div>
              )}

              {selectedBudget.approvedBy && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Approved By</p>
                  <p>
                    {selectedBudget.approvedBy} on{" "}
                    {formatDate(selectedBudget.approvedDate!)}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Budget Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen
                ? "Create Department Budget"
                : "Edit Department Budget"}
            </DialogTitle>
            <DialogDescription>
              Set budget allocations by category
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Department *</Label>
                <Select
                  value={formData.departmentId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentId: parseInt(v),
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentsList.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.departmentId && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.departmentId}
                  </p>
                )}
              </div>
              <div>
                <Label>Fiscal Year</Label>
                <Select
                  value={formData.fiscalYear.toString()}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      fiscalYear: parseInt(v),
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Budget Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, period: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Categories */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Budget Categories</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCategory}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {formData.categories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">
                        Budget Amount
                      </TableHead>
                      {isEditModalOpen && (
                        <TableHead className="text-right">
                          Actual Amount
                        </TableHead>
                      )}
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.categoryName}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cat.budgetAmount)}
                        </TableCell>
                        {isEditModalOpen && (
                          <TableCell className="text-right">
                            {formatCurrency(cat.actualAmount)}
                          </TableCell>
                        )}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(cat)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCategory(cat.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          calculateTotalBudget(formData.categories),
                        )}
                      </TableCell>
                      {isEditModalOpen && (
                        <TableCell className="text-right">
                          {formatCurrency(
                            formData.categories.reduce(
                              (s, c) => s + c.actualAmount,
                              0,
                            ),
                          )}
                        </TableCell>
                      )}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Wallet className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No budget categories added
                  </p>
                  <Button variant="link" onClick={handleAddCategory}>
                    Add your first category
                  </Button>
                </div>
              )}
              {formErrors.categories && (
                <p className="text-sm text-red-500 mt-2">
                  {formErrors.categories}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="border-t pt-4">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={3}
                placeholder="Additional notes about this budget..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                isCreateModalOpen ? handleCreateBudget : handleUpdateBudget
              }
            >
              {isCreateModalOpen ? "Create Budget" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <CategoryModal />
    </div>
  );
}
