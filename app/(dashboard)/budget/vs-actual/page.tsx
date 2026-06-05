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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Calendar,
  Building2,
  Target,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

// Types
type VarianceStatus = "on_track" | "over_budget" | "under_budget";
type Period = "monthly" | "quarterly" | "yearly";

interface BudgetVsActualItem {
  id: number;
  category: string;
  subcategory: string;
  accountCode: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  status: VarianceStatus;
  period: string;
}

interface MonthlyData {
  month: string;
  budget: number;
  actual: number;
  variance: number;
}

// Mock Budget Data
const mockBudgetData: BudgetVsActualItem[] = [
  // Revenue
  {
    id: 1,
    category: "Revenue",
    subcategory: "Product Sales",
    accountCode: "4000",
    budgetAmount: 183000000,
    actualAmount: 12500000,
    variance: -170500000,
    variancePercent: -93.2,
    status: "under_budget",
    period: "2026",
  },
  {
    id: 2,
    category: "Revenue",
    subcategory: "Service Revenue",
    accountCode: "4100",
    budgetAmount: 74200000,
    actualAmount: 5800000,
    variance: -68400000,
    variancePercent: -92.2,
    status: "under_budget",
    period: "2026",
  },

  // Cost of Sales
  {
    id: 3,
    category: "Cost of Sales",
    subcategory: "Raw Materials",
    accountCode: "5000",
    budgetAmount: 49600000,
    actualAmount: 3500000,
    variance: 46100000,
    variancePercent: 92.9,
    status: "under_budget",
    period: "2026",
  },
  {
    id: 4,
    category: "Cost of Sales",
    subcategory: "Direct Labor",
    accountCode: "5100",
    budgetAmount: 25800000,
    actualAmount: 2000000,
    variance: 23800000,
    variancePercent: 92.2,
    status: "under_budget",
    period: "2026",
  },

  // Operating Expenses
  {
    id: 5,
    category: "Operating Expenses",
    subcategory: "Sales & Marketing",
    accountCode: "6000",
    budgetAmount: 21500000,
    actualAmount: 1500000,
    variance: 20000000,
    variancePercent: 93.0,
    status: "under_budget",
    period: "2026",
  },
  {
    id: 6,
    category: "Operating Expenses",
    subcategory: "Rent & Utilities",
    accountCode: "6100",
    budgetAmount: 14400000,
    actualAmount: 1200000,
    variance: 13200000,
    variancePercent: 91.7,
    status: "under_budget",
    period: "2026",
  },
  {
    id: 7,
    category: "Operating Expenses",
    subcategory: "Salaries & Wages",
    accountCode: "6200",
    budgetAmount: 37800000,
    actualAmount: 3000000,
    variance: 34800000,
    variancePercent: 92.1,
    status: "under_budget",
    period: "2026",
  },
  {
    id: 8,
    category: "Operating Expenses",
    subcategory: "IT & Software",
    accountCode: "6300",
    budgetAmount: 6000000,
    actualAmount: 500000,
    variance: 5500000,
    variancePercent: 91.7,
    status: "under_budget",
    period: "2026",
  },

  // Admin Expenses
  {
    id: 9,
    category: "Admin Expenses",
    subcategory: "Professional Fees",
    accountCode: "7000",
    budgetAmount: 3600000,
    actualAmount: 300000,
    variance: 3300000,
    variancePercent: 91.7,
    status: "under_budget",
    period: "2026",
  },
  {
    id: 10,
    category: "Admin Expenses",
    subcategory: "Insurance",
    accountCode: "7100",
    budgetAmount: 2400000,
    actualAmount: 200000,
    variance: 2200000,
    variancePercent: 91.7,
    status: "under_budget",
    period: "2026",
  },

  // R&D
  {
    id: 11,
    category: "R&D",
    subcategory: "Product Development",
    accountCode: "8000",
    budgetAmount: 6000000,
    actualAmount: 500000,
    variance: 5500000,
    variancePercent: 91.7,
    status: "under_budget",
    period: "2026",
  },

  // Capital Expenditure
  {
    id: 12,
    category: "Capital Expenditure",
    subcategory: "Equipment",
    accountCode: "9000",
    budgetAmount: 3500000,
    actualAmount: 0,
    variance: 3500000,
    variancePercent: 100,
    status: "under_budget",
    period: "2026",
  },
];

// Mock Monthly Data
const mockMonthlyData: MonthlyData[] = [
  { month: "Jan", budget: 15000000, actual: 12500000, variance: -2500000 },
  { month: "Feb", budget: 15200000, actual: 13000000, variance: -2200000 },
  { month: "Mar", budget: 15500000, actual: 13500000, variance: -2000000 },
  { month: "Apr", budget: 15800000, actual: 14000000, variance: -1800000 },
  { month: "May", budget: 16000000, actual: 14500000, variance: -1500000 },
  { month: "Jun", budget: 16200000, actual: 15000000, variance: -1200000 },
  { month: "Jul", budget: 16500000, actual: 15500000, variance: -1000000 },
  { month: "Aug", budget: 16800000, actual: 16000000, variance: -800000 },
  { month: "Sep", budget: 17000000, actual: 16500000, variance: -500000 },
  { month: "Oct", budget: 17300000, actual: 17000000, variance: -300000 },
  { month: "Nov", budget: 17500000, actual: 17500000, variance: 0 },
  { month: "Dec", budget: 17800000, actual: 18000000, variance: 200000 },
];

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getVariantBadge = (status: VarianceStatus) => {
  switch (status) {
    case "on_track":
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          On Track
        </Badge>
      );
    case "over_budget":
      return (
        <Badge className="bg-red-100 text-red-700">
          <AlertCircle className="h-3 w-3 mr-1" />
          Over Budget
        </Badge>
      );
    case "under_budget":
      return (
        <Badge className="bg-blue-100 text-blue-700">
          <TrendingDown className="h-3 w-3 mr-1" />
          Under Budget
        </Badge>
      );
  }
};

const getVarianceColor = (variance: number, isExpense: boolean = false) => {
  if (isExpense) {
    // For expenses, negative variance (spent less) is good
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-gray-600";
  } else {
    // For revenue, positive variance (earned more) is good
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-gray-600";
  }
};

export default function BudgetVsActual() {
  const router = useRouter();

  // State
  const [budgetData] = useState<BudgetVsActualItem[]>(mockBudgetData);
  const [monthlyData] = useState<MonthlyData[]>(mockMonthlyData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState<Period>("yearly");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<BudgetVsActualItem | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "summary" | "details" | "analysis"
  >("summary");

  // Categories for filter
  const categories = useMemo(() => {
    const cats = new Set(budgetData.map((item) => item.category));
    return ["all", ...Array.from(cats)];
  }, [budgetData]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = [...budgetData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.subcategory.toLowerCase().includes(query) ||
          item.accountCode.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [budgetData, searchQuery, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Summary statistics
  const summary = useMemo(() => {
    const totalBudget = budgetData.reduce(
      (sum, item) => sum + item.budgetAmount,
      0,
    );
    const totalActual = budgetData.reduce(
      (sum, item) => sum + item.actualAmount,
      0,
    );
    const totalVariance = totalActual - totalBudget;
    const variancePercent =
      totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

    const revenue = budgetData.filter((i) => i.category === "Revenue");
    const revenueBudget = revenue.reduce((sum, i) => sum + i.budgetAmount, 0);
    const revenueActual = revenue.reduce((sum, i) => sum + i.actualAmount, 0);
    const revenueVariance = revenueActual - revenueBudget;

    const expenses = budgetData.filter((i) => i.category !== "Revenue");
    const expensesBudget = expenses.reduce((sum, i) => sum + i.budgetAmount, 0);
    const expensesActual = expenses.reduce((sum, i) => sum + i.actualAmount, 0);
    const expensesVariance = expensesActual - expensesBudget;

    const onTrackCount = budgetData.filter(
      (i) => i.status === "on_track",
    ).length;
    const overBudgetCount = budgetData.filter(
      (i) => i.status === "over_budget",
    ).length;
    const underBudgetCount = budgetData.filter(
      (i) => i.status === "under_budget",
    ).length;

    return {
      totalBudget,
      totalActual,
      totalVariance,
      variancePercent,
      revenueBudget,
      revenueActual,
      revenueVariance,
      expensesBudget,
      expensesActual,
      expensesVariance,
      onTrackCount,
      overBudgetCount,
      underBudgetCount,
    };
  }, [budgetData]);

  // Monthly totals by category
  const monthlyRevenueData = useMemo(() => {
    return monthlyData.map((m) => ({
      month: m.month,
      budget: m.budget,
      actual: m.actual,
      variance: m.variance,
    }));
  }, [monthlyData]);

  // Category performance data
  const categoryPerformance = useMemo(() => {
    const categories = [
      "Revenue",
      "Cost of Sales",
      "Operating Expenses",
      "Admin Expenses",
      "R&D",
      "Capital Expenditure",
    ];
    return categories
      .map((cat) => {
        const items = budgetData.filter((i) => i.category === cat);
        const budget = items.reduce((sum, i) => sum + i.budgetAmount, 0);
        const actual = items.reduce((sum, i) => sum + i.actualAmount, 0);
        const variance = actual - budget;
        const variancePercent = budget > 0 ? (variance / budget) * 100 : 0;
        return { category: cat, budget, actual, variance, variancePercent };
      })
      .filter((c) => c.budget > 0);
  }, [budgetData]);

  const handleViewDetails = (item: BudgetVsActualItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Category",
      "Subcategory",
      "Account Code",
      "Budget",
      "Actual",
      "Variance",
      "Variance %",
      "Status",
    ];
    const csvData = filteredData.map((item) => [
      item.category,
      item.subcategory,
      item.accountCode,
      item.budgetAmount.toString(),
      item.actualAmount.toString(),
      item.variance.toString(),
      `${item.variancePercent.toFixed(1)}%`,
      item.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-vs-actual-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const COLORS = [
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#6366F1",
    "#3B82F6",
  ];

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
              <Target className="h-6 w-6" />
              Budget vs Actual
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare budgeted amounts against actual performance for{" "}
              {selectedYear}
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.totalBudget)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Actual Performance
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalActual)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Variance</p>
                <p
                  className={`text-2xl font-bold ${summary.totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {summary.totalVariance >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(summary.totalVariance))}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Variance %</p>
                <p
                  className={`text-2xl font-bold ${summary.variancePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {summary.variancePercent >= 0 ? "+" : ""}
                  {summary.variancePercent.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <PieChart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Expenses Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Revenue Performance</p>
              <Badge
                className={
                  summary.revenueVariance >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {summary.revenueVariance >= 0 ? "+" : ""}
                {formatCurrency(summary.revenueVariance)}
              </Badge>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Budget: {formatCurrency(summary.revenueBudget)}</span>
              <span>Actual: {formatCurrency(summary.revenueActual)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min((summary.revenueActual / summary.revenueBudget) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((summary.revenueActual / summary.revenueBudget) * 100).toFixed(
                1,
              )}
              % of budget achieved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Expense Performance</p>
              <Badge
                className={
                  summary.expensesVariance <= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {summary.expensesVariance <= 0 ? "Under" : "Over"} Budget
              </Badge>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Budget: {formatCurrency(summary.expensesBudget)}</span>
              <span>Actual: {formatCurrency(summary.expensesActual)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width: `${Math.min((summary.expensesActual / summary.expensesBudget) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {(
                ((summary.expensesBudget - summary.expensesActual) /
                  summary.expensesBudget) *
                100
              ).toFixed(1)}
              % under budget
            </p>
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
                placeholder="Search by subcategory, account code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
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
                <SelectItem value="on_track">On Track</SelectItem>
                <SelectItem value="over_budget">Over Budget</SelectItem>
                <SelectItem value="under_budget">Under Budget</SelectItem>
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
        <TabsList className="grid w-full grid-cols-3 print:hidden">
          <TabsTrigger value="summary">Summary Dashboard</TabsTrigger>
          <TabsTrigger value="details">Budget vs Actual Details</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Monthly Budget vs Actual
              </CardTitle>
              <CardDescription>
                Comparison of budgeted vs actual performance by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ReBarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Performance</CardTitle>
              <CardDescription>Budget vs Actual by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryPerformance.map((cat) => (
                      <TableRow key={cat.category}>
                        <TableCell className="font-medium">
                          {cat.category}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cat.budget)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cat.actual)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${getVarianceColor(cat.variance, cat.category !== "Revenue")}`}
                        >
                          {cat.variance >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(cat.variance))}
                        </TableCell>
                        <TableCell
                          className={`text-right ${cat.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {cat.variance >= 0 ? "+" : ""}
                          {cat.variancePercent.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {summary.onTrackCount}
                </p>
                <p className="text-sm text-muted-foreground">On Track Items</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {summary.overBudgetCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Over Budget Items
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {summary.underBudgetCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Under Budget Items
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Account Code</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Target className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No data found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="font-medium">
                            {item.subcategory}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.accountCode}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.budgetAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.actualAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${getVarianceColor(item.variance, item.category !== "Revenue")}`}
                          >
                            {item.variance >= 0 ? "+" : "-"}
                            {formatCurrency(Math.abs(item.variance))}
                          </TableCell>
                          <TableCell
                            className={`text-right ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.variancePercent >= 0 ? "+" : ""}
                            {item.variancePercent.toFixed(1)}%
                          </TableCell>
                          <TableCell>{getVariantBadge(item.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
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
              {filteredData.length > 0 && (
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
                        filteredData.length,
                      )}{" "}
                      of {filteredData.length}
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

        <TabsContent value="analysis" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cumulative Variance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Cumulative Variance Trend
                </CardTitle>
                <CardDescription>
                  How variance accumulates over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Area
                      type="monotone"
                      dataKey="variance"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                      name="Cumulative Variance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance vs Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance vs Budget</CardTitle>
                <CardDescription>
                  Actual as percentage of budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Revenue Achievement</span>
                      <span className="font-medium">
                        {(
                          (summary.revenueActual / summary.revenueBudget) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((summary.revenueActual / summary.revenueBudget) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Expense Control</span>
                      <span className="font-medium">
                        {(
                          ((summary.expensesBudget - summary.expensesActual) /
                            summary.expensesBudget) *
                          100
                        ).toFixed(1)}
                        % under budget
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((summary.expensesActual / summary.expensesBudget) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Variances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Top Positive Variances
                </CardTitle>
                <CardDescription>Best performing budget items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetData
                    .filter((i) => i.variance > 0)
                    .sort((a, b) => b.variance - a.variance)
                    .slice(0, 5)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.subcategory}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600 font-medium">
                            +{formatCurrency(item.variance)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            +{item.variancePercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Top Negative Variances
                </CardTitle>
                <CardDescription>Areas needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetData
                    .filter((i) => i.variance < 0)
                    .sort((a, b) => a.variance - b.variance)
                    .slice(0, 5)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.subcategory}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-medium">
                            -{formatCurrency(Math.abs(item.variance))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.variancePercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Budget vs Actual Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Subcategory</p>
                <p className="font-medium">{selectedItem.subcategory}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p className="font-mono">{selectedItem.accountCode}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.budgetAmount)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Actual</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.actualAmount)}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Variance</p>
                <p
                  className={`text-xl font-bold ${getVarianceColor(selectedItem.variance, selectedItem.category !== "Revenue")}`}
                >
                  {selectedItem.variance >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(selectedItem.variance))}
                </p>
                <p className="text-sm">
                  ({selectedItem.variancePercent >= 0 ? "+" : ""}
                  {selectedItem.variancePercent.toFixed(1)}%)
                </p>
              </div>
              <div className="text-center">
                {getVariantBadge(selectedItem.status)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
