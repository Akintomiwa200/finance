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
import { Progress } from "@/src/components/ui/progress";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
} from "recharts";
import {
  Search,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  ArrowUpDown,
  Receipt,
  Layers,
  Target,
  AlertCircle,
  Activity,
  ShoppingCart,
  Plane,
  Utensils,
  Wrench,
  Zap,
  Laptop,
} from "lucide-react";

// Types
interface ExpenseCategory {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  trend: number;
  icon: string;
  subcategories: { name: string; amount: number; count: number }[];
  monthlyData: { month: string; amount: number; count: number }[];
}

interface DepartmentExpense {
  department: string;
  amount: number;
  count: number;
  percentage: number;
  avgPerReport: number;
  topCategory: string;
  monthlyData: { month: string; amount: number }[];
}

interface ExpenseTrend {
  month: string;
  amount: number;
  count: number;
  avgPerReport: number;
}

interface ExpenseAnalysis {
  totalExpensesMTD: number;
  totalExpensesYTD: number;
  avgPerReport: number;
  pendingApproval: number;
  totalReports: number;
  approvedReports: number;
  rejectedReports: number;
  categories: ExpenseCategory[];
  departments: DepartmentExpense[];
  monthlyTrends: ExpenseTrend[];
  topExpenses: {
    description: string;
    department: string;
    category: string;
    amount: number;
    date: string;
  }[];
  lastUpdated: string;
}

// Initial Data
const initialData: ExpenseAnalysis = {
  totalExpensesMTD: 3240000,
  totalExpensesYTD: 18750000,
  avgPerReport: 405000,
  pendingApproval: 1200000,
  totalReports: 46,
  approvedReports: 38,
  rejectedReports: 8,
  lastUpdated: "2026-06-02",
  categories: [
    {
      category: "Travel & Transport",
      amount: 1200000,
      count: 8,
      percentage: 37,
      trend: 12.5,
      icon: "Plane",
      subcategories: [
        { name: "Air Travel", amount: 650000, count: 3 },
        { name: "Local Transport", amount: 350000, count: 4 },
        { name: "Hotel Accommodation", amount: 200000, count: 1 },
      ],
      monthlyData: [
        { month: "Jan", amount: 180000, count: 1 },
        { month: "Feb", amount: 150000, count: 1 },
        { month: "Mar", amount: 220000, count: 2 },
        { month: "Apr", amount: 280000, count: 2 },
        { month: "May", amount: 200000, count: 1 },
        { month: "Jun", amount: 170000, count: 1 },
      ],
    },
    {
      category: "Office Supplies",
      amount: 640000,
      count: 12,
      percentage: 20,
      trend: -5.2,
      icon: "ShoppingCart",
      subcategories: [
        { name: "Stationery", amount: 250000, count: 5 },
        { name: "Printer Supplies", amount: 200000, count: 4 },
        { name: "Office Equipment", amount: 190000, count: 3 },
      ],
      monthlyData: [
        { month: "Jan", amount: 120000, count: 2 },
        { month: "Feb", amount: 100000, count: 2 },
        { month: "Mar", amount: 110000, count: 2 },
        { month: "Apr", amount: 130000, count: 2 },
        { month: "May", amount: 95000, count: 2 },
        { month: "Jun", amount: 85000, count: 2 },
      ],
    },
    {
      category: "Software & Licenses",
      amount: 2100000,
      count: 3,
      percentage: 65,
      trend: 25.8,
      icon: "Laptop",
      subcategories: [
        { name: "SaaS Subscriptions", amount: 1200000, count: 1 },
        { name: "Development Tools", amount: 600000, count: 1 },
        { name: "Security Software", amount: 300000, count: 1 },
      ],
      monthlyData: [
        { month: "Jan", amount: 0, count: 0 },
        { month: "Feb", amount: 0, count: 0 },
        { month: "Mar", amount: 1200000, count: 1 },
        { month: "Apr", amount: 0, count: 0 },
        { month: "May", amount: 600000, count: 1 },
        { month: "Jun", amount: 300000, count: 1 },
      ],
    },
    {
      category: "Meals & Entertainment",
      amount: 340000,
      count: 6,
      percentage: 10,
      trend: -8.3,
      icon: "Utensils",
      subcategories: [
        { name: "Client Dinners", amount: 180000, count: 3 },
        { name: "Team Lunch", amount: 100000, count: 2 },
        { name: "Events", amount: 60000, count: 1 },
      ],
      monthlyData: [
        { month: "Jan", amount: 65000, count: 1 },
        { month: "Feb", amount: 55000, count: 1 },
        { month: "Mar", amount: 70000, count: 1 },
        { month: "Apr", amount: 50000, count: 1 },
        { month: "May", amount: 60000, count: 1 },
        { month: "Jun", amount: 40000, count: 1 },
      ],
    },
    {
      category: "Utilities",
      amount: 500000,
      count: 4,
      percentage: 15,
      trend: 3.1,
      icon: "Zap",
      subcategories: [
        { name: "Electricity", amount: 250000, count: 2 },
        { name: "Internet", amount: 150000, count: 1 },
        { name: "Water", amount: 100000, count: 1 },
      ],
      monthlyData: [
        { month: "Jan", amount: 85000, count: 1 },
        { month: "Feb", amount: 80000, count: 1 },
        { month: "Mar", amount: 90000, count: 1 },
        { month: "Apr", amount: 85000, count: 1 },
        { month: "May", amount: 80000, count: 0 },
        { month: "Jun", amount: 80000, count: 0 },
      ],
    },
    {
      category: "Professional Services",
      amount: 850000,
      count: 5,
      percentage: 26,
      trend: 15.4,
      icon: "Wrench",
      subcategories: [
        { name: "Consulting", amount: 450000, count: 2 },
        { name: "Legal Services", amount: 250000, count: 2 },
        { name: "Audit", amount: 150000, count: 1 },
      ],
      monthlyData: [
        { month: "Jan", amount: 150000, count: 1 },
        { month: "Feb", amount: 120000, count: 1 },
        { month: "Mar", amount: 180000, count: 1 },
        { month: "Apr", amount: 200000, count: 1 },
        { month: "May", amount: 100000, count: 1 },
        { month: "Jun", amount: 100000, count: 0 },
      ],
    },
  ],
  departments: [
    {
      department: "Engineering",
      amount: 1450000,
      count: 15,
      percentage: 35,
      avgPerReport: 96700,
      topCategory: "Software & Licenses",
      monthlyData: [
        { month: "Jan", amount: 200000 },
        { month: "Feb", amount: 220000 },
        { month: "Mar", amount: 250000 },
        { month: "Apr", amount: 280000 },
        { month: "May", amount: 260000 },
        { month: "Jun", amount: 240000 },
      ],
    },
    {
      department: "Marketing",
      amount: 850000,
      count: 10,
      percentage: 20,
      avgPerReport: 85000,
      topCategory: "Travel & Transport",
      monthlyData: [
        { month: "Jan", amount: 140000 },
        { month: "Feb", amount: 130000 },
        { month: "Mar", amount: 150000 },
        { month: "Apr", amount: 160000 },
        { month: "May", amount: 140000 },
        { month: "Jun", amount: 130000 },
      ],
    },
    {
      department: "Sales",
      amount: 720000,
      count: 8,
      percentage: 17,
      avgPerReport: 90000,
      topCategory: "Meals & Entertainment",
      monthlyData: [
        { month: "Jan", amount: 110000 },
        { month: "Feb", amount: 120000 },
        { month: "Mar", amount: 130000 },
        { month: "Apr", amount: 125000 },
        { month: "May", amount: 120000 },
        { month: "Jun", amount: 115000 },
      ],
    },
    {
      department: "Operations",
      amount: 580000,
      count: 7,
      percentage: 14,
      avgPerReport: 82857,
      topCategory: "Utilities",
      monthlyData: [
        { month: "Jan", amount: 90000 },
        { month: "Feb", amount: 95000 },
        { month: "Mar", amount: 100000 },
        { month: "Apr", amount: 105000 },
        { month: "May", amount: 95000 },
        { month: "Jun", amount: 95000 },
      ],
    },
    {
      department: "Administration",
      amount: 600000,
      count: 6,
      percentage: 14,
      avgPerReport: 100000,
      topCategory: "Office Supplies",
      monthlyData: [
        { month: "Jan", amount: 100000 },
        { month: "Feb", amount: 95000 },
        { month: "Mar", amount: 105000 },
        { month: "Apr", amount: 100000 },
        { month: "May", amount: 100000 },
        { month: "Jun", amount: 100000 },
      ],
    },
  ],
  monthlyTrends: [
    { month: "Jan", amount: 2650000, count: 6, avgPerReport: 441667 },
    { month: "Feb", amount: 2880000, count: 7, avgPerReport: 411429 },
    { month: "Mar", amount: 3100000, count: 8, avgPerReport: 387500 },
    { month: "Apr", amount: 3350000, count: 9, avgPerReport: 372222 },
    { month: "May", amount: 3520000, count: 8, avgPerReport: 440000 },
    { month: "Jun", amount: 3240000, count: 8, avgPerReport: 405000 },
  ],
  topExpenses: [
    {
      description: "Adobe Creative Suite Annual",
      department: "Engineering",
      category: "Software & Licenses",
      amount: 1200000,
      date: "2026-03-15",
    },
    {
      description: "Flight to London - Client Meeting",
      department: "Marketing",
      category: "Travel & Transport",
      amount: 450000,
      date: "2026-04-10",
    },
    {
      description: "Management Consulting - Q1",
      department: "Operations",
      category: "Professional Services",
      amount: 350000,
      date: "2026-02-20",
    },
    {
      description: "Office Furniture - New Hires",
      department: "Administration",
      category: "Office Supplies",
      amount: 280000,
      date: "2026-05-05",
    },
    {
      description: "Team Building Event",
      department: "Sales",
      category: "Meals & Entertainment",
      amount: 250000,
      date: "2026-03-28",
    },
    {
      description: "Server Infrastructure Upgrade",
      department: "Engineering",
      category: "Software & Licenses",
      amount: 600000,
      date: "2026-05-12",
    },
    {
      description: "Legal Contract Review",
      department: "Administration",
      category: "Professional Services",
      amount: 220000,
      date: "2026-01-18",
    },
    {
      description: "Annual Electricity Bill",
      department: "Operations",
      category: "Utilities",
      amount: 250000,
      date: "2026-01-05",
    },
  ],
};

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];
const TREEMAP_COLORS = [
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#10B981",
  "#34D399",
  "#6EE7B7",
  "#F59E0B",
  "#FBBF24",
  "#FCD34D",
  "#EF4444",
];

export default function ExpenseAnalysisReportPage() {
  // State
  const [data] = useState<ExpenseAnalysis>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("June 2026");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filtered data
  const filteredCategories = useMemo(() => {
    let result = [...data.categories];
    if (selectedDepartment !== "all") {
      // Filter categories that have expenses in selected department
      const deptCategories = data.topExpenses
        .filter((e) => e.department === selectedDepartment)
        .map((e) => e.category);
      result = result.filter((c) => deptCategories.includes(c.category));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((c) => c.category.toLowerCase().includes(query));
    }
    return result;
  }, [data.categories, selectedDepartment, searchQuery]);

  const filteredTopExpenses = useMemo(() => {
    let result = [...data.topExpenses];
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (selectedDepartment !== "all") {
      result = result.filter((e) => e.department === selectedDepartment);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(query) ||
          e.department.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query),
      );
    }
    return result;
  }, [data.topExpenses, selectedCategory, selectedDepartment, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
    return `₦${amount}`;
  };

  const getTrendBadge = (trend: number) => {
    if (trend > 0) {
      return (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <TrendingUp className="h-3 w-3" />+{trend}%
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <TrendingDown className="h-3 w-3" />
        {trend}%
      </span>
    );
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      Plane: Plane,
      ShoppingCart: ShoppingCart,
      Laptop: Laptop,
      Utensils: Utensils,
      Zap: Zap,
      Wrench: Wrench,
    };
    const Icon = icons[iconName] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Treemap data
  const treemapData = useMemo(() => {
    return data.categories.map((cat) => ({
      name: cat.category,
      size: cat.amount,
      children: cat.subcategories.map((sub) => ({
        name: sub.name,
        size: sub.amount,
      })),
    }));
  }, [data.categories]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Expense Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze expense patterns by category, department, and time
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="June 2026">June 2026</SelectItem>
              <SelectItem value="May 2026">May 2026</SelectItem>
              <SelectItem value="Q2 2026">Q2 2026</SelectItem>
              <SelectItem value="2026">FY 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Expenses (MTD)
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalExpensesMTD)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    -8% vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg per Report</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.avgPerReport)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalReports} total reports
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Receipt className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.pendingApproval)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalReports -
                    data.approvedReports -
                    data.rejectedReports}{" "}
                  reports
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Expenses</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalExpensesYTD)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">
                    +15.2% vs last year
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Layers className="h-4 w-4 mr-2" />
            By Category
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="h-4 w-4 mr-2" />
            By Department
          </TabsTrigger>
          <TabsTrigger value="trends">
            <Activity className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Distribution Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="category"
                      label={({ category, percentage }: any) =>
                        `${category} (${percentage}%)`
                      }
                    >
                      {data.categories.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trend</CardTitle>
                <CardDescription>6-month expense pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.monthlyTrends}>
                    <defs>
                      <linearGradient
                        id="colorExpense"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(v) => formatCompactCurrency(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#colorExpense)"
                      name="Total Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Expenses Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Expenses</CardTitle>
                  <CardDescription>
                    Largest individual expense items
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {data.categories.map((c) => (
                        <SelectItem key={c.category} value={c.category}>
                          {c.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Building2 className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {data.departments.map((d) => (
                        <SelectItem key={d.department} value={d.department}>
                          {d.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopExpenses.map((expense, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">
                        {expense.description}
                      </TableCell>
                      <TableCell>{expense.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Department vs Category Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Department Spending by Category</CardTitle>
              <CardDescription>
                Cross-reference of departments and expense categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.departments}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="department"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(v) => formatCompactCurrency(v)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {data.categories.slice(0, 5).map((cat, index) => (
                    <Bar
                      key={cat.category}
                      dataKey="amount"
                      fill={COLORS[index]}
                      radius={[4, 4, 0, 0]}
                      name={cat.category}
                      stackId="a"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>By Category</CardTitle>
                  <CardDescription>
                    Expense breakdown by category with trends
                  </CardDescription>
                </div>
                <div className="relative w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Avg per Report</TableHead>
                      <TableHead>Distribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((cat, index) => (
                      <TableRow key={cat.category}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="p-1.5 rounded-md"
                              style={{
                                backgroundColor: `${COLORS[index % COLORS.length]}20`,
                              }}
                            >
                              {getCategoryIcon(cat.icon)}
                            </div>
                            <span className="font-medium">{cat.category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(cat.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{cat.count}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={cat.percentage}
                              className="w-16 h-2"
                            />
                            <span className="font-medium">
                              {cat.percentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getTrendBadge(cat.trend)}</TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(Math.round(cat.amount / cat.count))}
                        </TableCell>
                        <TableCell>
                          <div className="w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${cat.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Category Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.slice(0, 6).map((cat, index) => (
              <Card
                key={cat.category}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-1.5 rounded-md"
                        style={{
                          backgroundColor: `${COLORS[index % COLORS.length]}20`,
                        }}
                      >
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <CardTitle className="text-base">
                        {cat.category}
                      </CardTitle>
                    </div>
                    {getTrendBadge(cat.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reports</span>
                    <span>{cat.count}</span>
                  </div>
                  <Progress value={cat.percentage} className="h-1.5" />
                  <div className="space-y-1 pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">
                      Subcategories:
                    </p>
                    {cat.subcategories.map((sub, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span>{sub.name}</span>
                        <span className="font-medium">
                          {formatCurrency(sub.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Department</CardTitle>
                <CardDescription>Total spending per department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.departments}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="department"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(v) => formatCompactCurrency(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {data.departments.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Detail Table */}
            <Card>
              <CardHeader>
                <CardTitle>Department Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.departments.map((dept, index) => (
                    <div
                      key={dept.department}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-medium">{dept.department}</span>
                        </div>
                        <span className="font-bold">
                          {formatCurrency(dept.amount)}
                        </span>
                      </div>
                      <Progress value={dept.percentage} className="h-1.5" />
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          Reports:{" "}
                          <span className="font-medium text-foreground">
                            {dept.count}
                          </span>
                        </div>
                        <div>
                          Avg:{" "}
                          <span className="font-medium text-foreground">
                            {formatCurrency(dept.avgPerReport)}
                          </span>
                        </div>
                        <div>
                          Top:{" "}
                          <span className="font-medium text-foreground">
                            {dept.topCategory}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Department Monthly Trends</CardTitle>
              <CardDescription>
                Spending patterns over time by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    allowDuplicatedCategory={false}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(v) => formatCompactCurrency(v)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {data.departments.map((dept, index) => (
                    <Line
                      key={dept.department}
                      data={dept.monthlyData}
                      type="monotone"
                      dataKey="amount"
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name={dept.department}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense & Count Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Amount & Report Count</CardTitle>
                <CardDescription>Dual-axis trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.monthlyTrends}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(v) => formatCompactCurrency(v)}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="amount"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      name="Amount"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="count"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Report Count"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average per Report Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Average per Report</CardTitle>
                <CardDescription>
                  Trend of average expense amount per report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data.monthlyTrends}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(v) => formatCompactCurrency(v)}
                    />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgPerReport"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: "#8B5CF6",
                        stroke: "white",
                        strokeWidth: 2,
                      }}
                      name="Avg per Report"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Report Count</TableHead>
                    <TableHead>Avg per Report</TableHead>
                    <TableHead>MoM Change</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.monthlyTrends.map((month, index) => {
                    const prevAmount =
                      index > 0
                        ? data.monthlyTrends[index - 1].amount
                        : month.amount;
                    const momChange =
                      prevAmount > 0
                        ? ((month.amount - prevAmount) / prevAmount) * 100
                        : 0;
                    return (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">
                          {month.month} 2026
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(month.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{month.count}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(month.avgPerReport)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              momChange >= 0 ? "text-red-600" : "text-green-600"
                            }
                          >
                            {momChange >= 0 ? "+" : ""}
                            {momChange.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {momChange > 5 ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : momChange < -5 ? (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          ) : (
                            <Activity className="h-4 w-4 text-yellow-600" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Last updated:{" "}
          {new Date(data.lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
