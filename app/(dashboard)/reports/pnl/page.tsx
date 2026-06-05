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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  PieChart,
  BarChart3,
  LineChart,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
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
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type Period = "monthly" | "quarterly" | "yearly";
type ComparisonType = "budget" | "previous_period" | "previous_year";

interface PnLItem {
  id: number;
  category: string;
  subcategory: string;
  accountCode: string;
  currentAmount: number;
  previousAmount: number;
  budgetAmount: number;
  variance: number;
  variancePercent: number;
}

interface PnLSummary {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  operatingProfit: number;
  operatingMargin: number;
  otherIncome: number;
  otherExpenses: number;
  netProfit: number;
  netMargin: number;
}

// Mock Data
const mockPnLItems: PnLItem[] = [
  // Revenue
  {
    id: 1,
    category: "Revenue",
    subcategory: "Product Sales",
    accountCode: "4000",
    currentAmount: 12500000,
    previousAmount: 11200000,
    budgetAmount: 13000000,
    variance: -500000,
    variancePercent: -3.8,
  },
  {
    id: 2,
    category: "Revenue",
    subcategory: "Service Revenue",
    accountCode: "4100",
    currentAmount: 5800000,
    previousAmount: 5200000,
    budgetAmount: 6000000,
    variance: -200000,
    variancePercent: -3.3,
  },
  {
    id: 3,
    category: "Revenue",
    subcategory: "Consulting Fees",
    accountCode: "4200",
    currentAmount: 3200000,
    previousAmount: 2800000,
    budgetAmount: 3500000,
    variance: -300000,
    variancePercent: -8.6,
  },

  // Cost of Sales
  {
    id: 4,
    category: "Cost of Sales",
    subcategory: "Raw Materials",
    accountCode: "5000",
    currentAmount: 3500000,
    previousAmount: 3200000,
    budgetAmount: 3800000,
    variance: -300000,
    variancePercent: -7.9,
  },
  {
    id: 5,
    category: "Cost of Sales",
    subcategory: "Direct Labor",
    accountCode: "5100",
    currentAmount: 2000000,
    previousAmount: 1800000,
    budgetAmount: 2200000,
    variance: -200000,
    variancePercent: -9.1,
  },
  {
    id: 6,
    category: "Cost of Sales",
    subcategory: "Manufacturing Overhead",
    accountCode: "5200",
    currentAmount: 800000,
    previousAmount: 750000,
    budgetAmount: 850000,
    variance: -50000,
    variancePercent: -5.9,
  },

  // Operating Expenses
  {
    id: 7,
    category: "Operating Expenses",
    subcategory: "Sales & Marketing",
    accountCode: "6000",
    currentAmount: 1500000,
    previousAmount: 1400000,
    budgetAmount: 1600000,
    variance: -100000,
    variancePercent: -6.3,
  },
  {
    id: 8,
    category: "Operating Expenses",
    subcategory: "Rent & Utilities",
    accountCode: "6100",
    currentAmount: 1200000,
    previousAmount: 1150000,
    budgetAmount: 1250000,
    variance: -50000,
    variancePercent: -4.0,
  },
  {
    id: 9,
    category: "Operating Expenses",
    subcategory: "Salaries & Wages",
    accountCode: "6200",
    currentAmount: 3000000,
    previousAmount: 2800000,
    budgetAmount: 3200000,
    variance: -200000,
    variancePercent: -6.3,
  },
  {
    id: 10,
    category: "Operating Expenses",
    subcategory: "IT & Software",
    accountCode: "6300",
    currentAmount: 500000,
    previousAmount: 450000,
    budgetAmount: 550000,
    variance: -50000,
    variancePercent: -9.1,
  },
  {
    id: 11,
    category: "Operating Expenses",
    subcategory: "Professional Fees",
    accountCode: "6400",
    currentAmount: 400000,
    previousAmount: 350000,
    budgetAmount: 450000,
    variance: -50000,
    variancePercent: -11.1,
  },
  {
    id: 12,
    category: "Operating Expenses",
    subcategory: "Insurance",
    accountCode: "6500",
    currentAmount: 200000,
    previousAmount: 190000,
    budgetAmount: 210000,
    variance: -10000,
    variancePercent: -4.8,
  },

  // Other Income
  {
    id: 13,
    category: "Other Income",
    subcategory: "Interest Income",
    accountCode: "8000",
    currentAmount: 25000,
    previousAmount: 20000,
    budgetAmount: 30000,
    variance: -5000,
    variancePercent: -16.7,
  },
  {
    id: 14,
    category: "Other Income",
    subcategory: "Gain on Asset Sale",
    accountCode: "8100",
    currentAmount: 50000,
    previousAmount: 0,
    budgetAmount: 0,
    variance: 50000,
    variancePercent: 0,
  },

  // Other Expenses
  {
    id: 15,
    category: "Other Expenses",
    subcategory: "Interest Expense",
    accountCode: "9000",
    currentAmount: 50000,
    previousAmount: 45000,
    budgetAmount: 55000,
    variance: -5000,
    variancePercent: -9.1,
  },
  {
    id: 16,
    category: "Other Expenses",
    subcategory: "Bank Charges",
    accountCode: "9100",
    currentAmount: 25000,
    previousAmount: 22000,
    budgetAmount: 28000,
    variance: -3000,
    variancePercent: -10.7,
  },
];

// Monthly trend data
const monthlyTrendData = [
  { month: "Jan", revenue: 11200000, expenses: 7800000, profit: 3400000 },
  { month: "Feb", revenue: 11800000, expenses: 8100000, profit: 3700000 },
  { month: "Mar", revenue: 12500000, expenses: 8500000, profit: 4000000 },
  { month: "Apr", revenue: 13200000, expenses: 8900000, profit: 4300000 },
  { month: "May", revenue: 13800000, expenses: 9200000, profit: 4600000 },
  { month: "Jun", revenue: 14200000, expenses: 9400000, profit: 4800000 },
  { month: "Jul", revenue: 14500000, expenses: 9600000, profit: 4900000 },
  { month: "Aug", revenue: 14800000, expenses: 9800000, profit: 5000000 },
  { month: "Sep", revenue: 15200000, expenses: 10000000, profit: 5200000 },
  { month: "Oct", revenue: 15500000, expenses: 10200000, profit: 5300000 },
  { month: "Nov", revenue: 15800000, expenses: 10400000, profit: 5400000 },
  { month: "Dec", revenue: 16500000, expenses: 10700000, profit: 5800000 },
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

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const getVarianceColor = (variance: number) => {
  if (variance > 0) return "text-green-600";
  if (variance < 0) return "text-red-600";
  return "text-gray-600";
};

export default function ProfitAndLoss() {
  const router = useRouter();

  // State
  const [pnlItems] = useState<PnLItem[]>(mockPnLItems);
  const [period, setPeriod] = useState<Period>("monthly");
  const [comparison, setComparison] = useState<ComparisonType>("budget");
  const [selectedDate, setSelectedDate] = useState("March 2026");
  const [selectedQuarter, setSelectedQuarter] = useState("Q1 2026");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<PnLItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"statement" | "analysis">(
    "statement",
  );

  // Filter categories
  const categories = useMemo(() => {
    const cats = new Set(pnlItems.map((item) => item.category));
    return ["all", ...Array.from(cats)];
  }, [pnlItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    let result = [...pnlItems];

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

    return result;
  }, [pnlItems, searchQuery, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate summary totals
  const summary = useMemo((): PnLSummary => {
    const revenue = pnlItems
      .filter((i) => i.category === "Revenue")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const costOfSales = pnlItems
      .filter((i) => i.category === "Cost of Sales")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const grossProfit = revenue - costOfSales;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    const operatingExpenses = pnlItems
      .filter((i) => i.category === "Operating Expenses")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const operatingProfit = grossProfit - operatingExpenses;
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;

    const otherIncome = pnlItems
      .filter((i) => i.category === "Other Income")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const otherExpenses = pnlItems
      .filter((i) => i.category === "Other Expenses")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const netProfit = operatingProfit + otherIncome - otherExpenses;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      revenue,
      costOfSales,
      grossProfit,
      grossMargin,
      operatingExpenses,
      operatingProfit,
      operatingMargin,
      otherIncome,
      otherExpenses,
      netProfit,
      netMargin,
    };
  }, [pnlItems]);

  // Budget vs Actual comparison
  const budgetVariance = useMemo(() => {
    const budgetRevenue = pnlItems
      .filter((i) => i.category === "Revenue")
      .reduce((sum, i) => sum + i.budgetAmount, 0);
    const actualRevenue = summary.revenue;
    const revenueVariance = actualRevenue - budgetRevenue;

    const budgetExpenses = pnlItems
      .filter((i) => i.category !== "Revenue")
      .reduce((sum, i) => sum + i.budgetAmount, 0);
    const actualExpenses =
      summary.costOfSales + summary.operatingExpenses + summary.otherExpenses;
    const expenseVariance = budgetExpenses - actualExpenses; // Positive means saved money

    return {
      revenueVariance,
      expenseVariance,
      profitVariance: revenueVariance + expenseVariance,
      revenueVariancePercent: budgetRevenue ? (revenueVariance / budgetRevenue) * 100 : 0,
      expenseVariancePercent: budgetExpenses ? (expenseVariance / budgetExpenses) * 100 : 0,
      profitVariancePercent: (revenueVariance + expenseVariance) && budgetRevenue
        ? ((revenueVariance + expenseVariance) / budgetRevenue) * 100
        : 0,
    };
  }, [pnlItems, summary]);

  // Chart data
  const revenueExpenseData = [
    { name: "Revenue", amount: summary.revenue, color: "#10B981" },
    { name: "Cost of Sales", amount: summary.costOfSales, color: "#EF4444" },
    {
      name: "Operating Expenses",
      amount: summary.operatingExpenses,
      color: "#F59E0B",
    },
    { name: "Other Income", amount: summary.otherIncome, color: "#8B5CF6" },
    { name: "Other Expenses", amount: summary.otherExpenses, color: "#EC4899" },
  ];

  const monthlyChartData = monthlyTrendData.map((m) => ({
    month: m.month,
    revenue: m.revenue,
    profit: m.profit,
    margin: (m.profit / m.revenue) * 100,
  }));

  const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"];

  const handleViewDetails = (item: PnLItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Category",
      "Subcategory",
      "Account Code",
      "Current Period",
      "Previous Period",
      "Budget",
      "Variance",
      "Variance %",
    ];
    const csvData = filteredItems.map((item) => [
      item.category,
      item.subcategory,
      item.accountCode,
      item.currentAmount.toString(),
      item.previousAmount.toString(),
      item.budgetAmount.toString(),
      item.variance.toString(),
      `${item.variancePercent.toFixed(1)}%`,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-loss-${selectedDate}-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setCurrentPage(1);
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
              <TrendingUp className="h-6 w-6" />
              Profit & Loss Statement
            </h1>
            <p className="text-muted-foreground mt-1">
              Financial performance summary
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {period === "monthly" && (
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="January 2026">January 2026</SelectItem>
                  <SelectItem value="February 2026">February 2026</SelectItem>
                  <SelectItem value="March 2026">March 2026</SelectItem>
                  <SelectItem value="April 2026">April 2026</SelectItem>
                  <SelectItem value="May 2026">May 2026</SelectItem>
                  <SelectItem value="June 2026">June 2026</SelectItem>
                </SelectContent>
              </Select>
            )}
            {period === "quarterly" && (
              <Select
                value={selectedQuarter}
                onValueChange={setSelectedQuarter}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                  <SelectItem value="Q2 2026">Q2 2026</SelectItem>
                  <SelectItem value="Q3 2026">Q3 2026</SelectItem>
                  <SelectItem value="Q4 2026">Q4 2026</SelectItem>
                </SelectContent>
              </Select>
            )}
            {period === "yearly" && (
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
                </SelectContent>
              </Select>
            )}
            <Select
              value={comparison}
              onValueChange={(v) => setComparison(v as ComparisonType)}
            >
              <SelectTrigger className="w-[160px]">
                <BarChart3 className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">vs Budget</SelectItem>
                <SelectItem value="previous_period">
                  vs Previous Period
                </SelectItem>
                <SelectItem value="previous_year">vs Previous Year</SelectItem>
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
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.revenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gross Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summary.grossProfit)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {summary.grossMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Operating Profit
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summary.operatingProfit)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {summary.operatingMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p
                  className={`text-2xl font-bold ${summary.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(summary.netProfit))}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {summary.netMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Revenue vs Budget
              </span>
              <span
                className={`font-bold ${getVarianceColor(budgetVariance.revenueVariance)}`}
              >
                {budgetVariance.revenueVariance >= 0 ? "+" : ""}
                {formatCurrency(budgetVariance.revenueVariance)}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min((summary.revenue / (summary.revenue - budgetVariance.revenueVariance)) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Expenses vs Budget
              </span>
              <span
                className={`font-bold ${budgetVariance.expenseVariance >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {budgetVariance.expenseVariance >= 0 ? "Under" : "Over"}{" "}
                {formatCurrency(Math.abs(budgetVariance.expenseVariance))}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(((summary.costOfSales + summary.operatingExpenses) / (summary.costOfSales + summary.operatingExpenses - budgetVariance.expenseVariance)) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Profit vs Budget
              </span>
              <span
                className={`font-bold ${getVarianceColor(budgetVariance.profitVariance)}`}
              >
                {budgetVariance.profitVariance >= 0 ? "+" : ""}
                {formatCurrency(budgetVariance.profitVariance)}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${Math.min((summary.netProfit / (summary.netProfit - budgetVariance.profitVariance)) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="statement">Income Statement</TabsTrigger>
          <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="statement" className="space-y-4 mt-4">
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
              </div>
            </CardContent>
          </Card>

          {/* P&L Statement Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Account Code</TableHead>
                      <TableHead className="text-right">
                        Current Period
                      </TableHead>
                      {comparison === "budget" && (
                        <TableHead className="text-right">Budget</TableHead>
                      )}
                      {comparison === "previous_period" && (
                        <TableHead className="text-right">
                          Previous Period
                        </TableHead>
                      )}
                      {comparison === "previous_year" && (
                        <TableHead className="text-right">
                          Previous Year
                        </TableHead>
                      )}
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No data found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item) => {
                        const comparisonAmount =
                          comparison === "budget"
                            ? item.budgetAmount
                            : item.previousAmount;
                        const variance = item.currentAmount - comparisonAmount;
                        const variancePercent =
                          comparisonAmount !== 0
                            ? (variance / comparisonAmount) * 100
                            : 0;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="font-medium">
                              {item.subcategory}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {item.accountCode}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.currentAmount)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(comparisonAmount)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium ${getVarianceColor(variance)}`}
                            >
                              {variance >= 0 ? "+" : "-"}
                              {formatCurrency(Math.abs(variance))}
                            </TableCell>
                            <TableCell
                              className={`text-right ${getVarianceColor(variance)}`}
                            >
                              {variancePercent >= 0 ? "+" : ""}
                              {variancePercent.toFixed(1)}%
                            </TableCell>
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
                        );
                      })
                    )}
                  </TableBody>
                  {/* Summary Row */}
                  <TableHeader>
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={3} className="text-right">
                        Total Revenue
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          comparison === "budget"
                            ? pnlItems
                                .filter((i) => i.category === "Revenue")
                                .reduce((s, i) => s + i.budgetAmount, 0)
                            : comparison === "previous_period"
                              ? pnlItems
                                  .filter((i) => i.category === "Revenue")
                                  .reduce((s, i) => s + i.previousAmount, 0)
                              : 0,
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right ${getVarianceColor(budgetVariance.revenueVariance)}`}
                      >
                        {budgetVariance.revenueVariance >= 0 ? "+" : ""}
                        {formatCurrency(
                          Math.abs(budgetVariance.revenueVariance),
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right ${getVarianceColor(budgetVariance.revenueVariance)}`}
                      >
                        {budgetVariance.revenueVariancePercent?.toFixed(1)}%
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Pagination */}
              {filteredItems.length > 0 && (
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
                        filteredItems.length,
                      )}{" "}
                      of {filteredItems.length}
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
            {/* Revenue & Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Revenue & Expense Breakdown
                </CardTitle>
                <CardDescription>Composition of P&L items</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={revenueExpenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {revenueExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Profit Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Profit Trend</CardTitle>
                <CardDescription>Revenue vs Profit over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ReLineChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `${value.toFixed(0)}%`}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (value == null) return "";
                        if (name === "margin") return `${Number(value).toFixed(1)}%`;
                        return formatCurrency(Number(value));
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      name="Revenue"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="profit"
                      stroke="#3B82F6"
                      name="Profit"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="margin"
                      stroke="#F59E0B"
                      name="Profit Margin %"
                      strokeWidth={2}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Margin Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Margin Analysis</CardTitle>
                <CardDescription>Key profitability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Gross Margin</span>
                      <span className="font-medium">
                        {summary.grossMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(summary.grossMargin, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Operating Margin</span>
                      <span className="font-medium">
                        {summary.operatingMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(summary.operatingMargin, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Net Profit Margin</span>
                      <span className="font-medium">
                        {summary.netMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(summary.netMargin, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Expense Ratio
                      </span>
                      <span className="font-medium">
                        {(
                          ((summary.operatingExpenses + summary.costOfSales) /
                            summary.revenue) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Year-over-Year Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Analysis</CardTitle>
                <CardDescription>Period-over-period changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      Revenue Growth
                    </span>
                    <span className="font-bold text-green-600">+8.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      Gross Profit Growth
                    </span>
                    <span className="font-bold text-green-600">+9.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      Operating Profit Growth
                    </span>
                    <span className="font-bold text-green-600">+10.1%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      Net Profit Growth
                    </span>
                    <span className="font-bold text-green-600">+11.3%</span>
                  </div>
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
            <DialogTitle>Line Item Details</DialogTitle>
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
                  <p className="text-xs text-muted-foreground">
                    Current Period
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.currentAmount)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.budgetAmount)}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Variance</p>
                <p
                  className={`text-xl font-bold ${getVarianceColor(selectedItem.variance)}`}
                >
                  {selectedItem.variance >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(selectedItem.variance))}
                </p>
                <p className="text-sm">
                  ({selectedItem.variancePercent >= 0 ? "+" : ""}
                  {selectedItem.variancePercent.toFixed(1)}%)
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
