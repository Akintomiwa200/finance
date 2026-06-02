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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  Wallet,
  PiggyBank,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  Layers,
  Percent,
} from "lucide-react";

// Types
interface BudgetCategory {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  status: "under" | "on-track" | "over" | "critical";
}

interface DepartmentBudget {
  department: string;
  budget: number;
  spent: number;
  remaining: number;
  utilization: number;
  status: "under" | "on-track" | "over" | "critical";
  categories: BudgetCategory[];
  monthlySpending: { month: string; budgeted: number; actual: number }[];
}

interface BudgetSummary {
  fiscalYear: string;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallUtilization: number;
  departments: DepartmentBudget[];
  categorySummary: BudgetCategory[];
  monthlyTrend: {
    month: string;
    budgeted: number;
    actual: number;
    cumulative: number;
  }[];
  varianceSummary: {
    department: string;
    variance: number;
    percentage: number;
  }[];
  lastUpdated: string;
}

// Initial Data
const initialData: BudgetSummary = {
  fiscalYear: "FY 2026",
  totalBudget: 210000000,
  totalSpent: 133000000,
  totalRemaining: 77000000,
  overallUtilization: 63.3,
  lastUpdated: "2026-06-02",
  departments: [
    {
      department: "Finance",
      budget: 50000000,
      spent: 32000000,
      remaining: 18000000,
      utilization: 64,
      status: "on-track",
      categories: [
        {
          category: "Salaries",
          budgeted: 25000000,
          actual: 16000000,
          variance: 9000000,
          variancePercentage: 36,
          status: "under",
        },
        {
          category: "Software",
          budgeted: 10000000,
          actual: 7500000,
          variance: 2500000,
          variancePercentage: 25,
          status: "under",
        },
        {
          category: "Consulting",
          budgeted: 8000000,
          actual: 5500000,
          variance: 2500000,
          variancePercentage: 31.3,
          status: "under",
        },
        {
          category: "Travel",
          budgeted: 4000000,
          actual: 2000000,
          variance: 2000000,
          variancePercentage: 50,
          status: "under",
        },
        {
          category: "Supplies",
          budgeted: 3000000,
          actual: 1000000,
          variance: 2000000,
          variancePercentage: 66.7,
          status: "under",
        },
      ],
      monthlySpending: [
        { month: "Jan", budgeted: 4167000, actual: 3500000 },
        { month: "Feb", budgeted: 4167000, actual: 4200000 },
        { month: "Mar", budgeted: 4167000, actual: 4800000 },
        { month: "Apr", budgeted: 4167000, actual: 5500000 },
        { month: "May", budgeted: 4167000, actual: 6200000 },
        { month: "Jun", budgeted: 4167000, actual: 7800000 },
      ],
    },
    {
      department: "Engineering",
      budget: 80000000,
      spent: 45000000,
      remaining: 35000000,
      utilization: 56.3,
      status: "on-track",
      categories: [
        {
          category: "Salaries",
          budgeted: 40000000,
          actual: 22000000,
          variance: 18000000,
          variancePercentage: 45,
          status: "under",
        },
        {
          category: "Infrastructure",
          budgeted: 20000000,
          actual: 12000000,
          variance: 8000000,
          variancePercentage: 40,
          status: "under",
        },
        {
          category: "Software",
          budgeted: 10000000,
          actual: 6500000,
          variance: 3500000,
          variancePercentage: 35,
          status: "under",
        },
        {
          category: "Equipment",
          budgeted: 6000000,
          actual: 3000000,
          variance: 3000000,
          variancePercentage: 50,
          status: "under",
        },
        {
          category: "Training",
          budgeted: 4000000,
          actual: 1500000,
          variance: 2500000,
          variancePercentage: 62.5,
          status: "under",
        },
      ],
      monthlySpending: [
        { month: "Jan", budgeted: 6667000, actual: 5500000 },
        { month: "Feb", budgeted: 6667000, actual: 6200000 },
        { month: "Mar", budgeted: 6667000, actual: 7100000 },
        { month: "Apr", budgeted: 6667000, actual: 7800000 },
        { month: "May", budgeted: 6667000, actual: 8500000 },
        { month: "Jun", budgeted: 6667000, actual: 9900000 },
      ],
    },
    {
      department: "Human Resources",
      budget: 15000000,
      spent: 10000000,
      remaining: 5000000,
      utilization: 66.7,
      status: "on-track",
      categories: [
        {
          category: "Salaries",
          budgeted: 7000000,
          actual: 4500000,
          variance: 2500000,
          variancePercentage: 35.7,
          status: "under",
        },
        {
          category: "Recruitment",
          budgeted: 4000000,
          actual: 3000000,
          variance: 1000000,
          variancePercentage: 25,
          status: "under",
        },
        {
          category: "Training",
          budgeted: 2500000,
          actual: 1500000,
          variance: 1000000,
          variancePercentage: 40,
          status: "under",
        },
        {
          category: "Benefits",
          budgeted: 1500000,
          actual: 1000000,
          variance: 500000,
          variancePercentage: 33.3,
          status: "under",
        },
      ],
      monthlySpending: [
        { month: "Jan", budgeted: 1250000, actual: 1100000 },
        { month: "Feb", budgeted: 1250000, actual: 1300000 },
        { month: "Mar", budgeted: 1250000, actual: 1500000 },
        { month: "Apr", budgeted: 1250000, actual: 1700000 },
        { month: "May", budgeted: 1250000, actual: 2000000 },
        { month: "Jun", budgeted: 1250000, actual: 2400000 },
      ],
    },
    {
      department: "Sales",
      budget: 30000000,
      spent: 28000000,
      remaining: 2000000,
      utilization: 93.3,
      status: "over",
      categories: [
        {
          category: "Salaries",
          budgeted: 15000000,
          actual: 14500000,
          variance: 500000,
          variancePercentage: 3.3,
          status: "on-track",
        },
        {
          category: "Travel",
          budgeted: 6000000,
          actual: 5800000,
          variance: 200000,
          variancePercentage: 3.3,
          status: "on-track",
        },
        {
          category: "Entertainment",
          budgeted: 4000000,
          actual: 4200000,
          variance: -200000,
          variancePercentage: -5,
          status: "over",
        },
        {
          category: "Marketing",
          budgeted: 3000000,
          actual: 2500000,
          variance: 500000,
          variancePercentage: 16.7,
          status: "on-track",
        },
        {
          category: "Tools",
          budgeted: 2000000,
          actual: 1000000,
          variance: 1000000,
          variancePercentage: 50,
          status: "under",
        },
      ],
      monthlySpending: [
        { month: "Jan", budgeted: 2500000, actual: 3200000 },
        { month: "Feb", budgeted: 2500000, actual: 3800000 },
        { month: "Mar", budgeted: 2500000, actual: 4200000 },
        { month: "Apr", budgeted: 2500000, actual: 4800000 },
        { month: "May", budgeted: 2500000, actual: 5500000 },
        { month: "Jun", budgeted: 2500000, actual: 6500000 },
      ],
    },
    {
      department: "Operations",
      budget: 25000000,
      spent: 12000000,
      remaining: 13000000,
      utilization: 48,
      status: "under",
      categories: [
        {
          category: "Salaries",
          budgeted: 12000000,
          actual: 6000000,
          variance: 6000000,
          variancePercentage: 50,
          status: "under",
        },
        {
          category: "Facilities",
          budgeted: 6000000,
          actual: 3000000,
          variance: 3000000,
          variancePercentage: 50,
          status: "under",
        },
        {
          category: "Utilities",
          budgeted: 4000000,
          actual: 2000000,
          variance: 2000000,
          variancePercentage: 50,
          status: "under",
        },
        {
          category: "Supplies",
          budgeted: 3000000,
          actual: 1000000,
          variance: 2000000,
          variancePercentage: 66.7,
          status: "under",
        },
      ],
      monthlySpending: [
        { month: "Jan", budgeted: 2083000, actual: 1500000 },
        { month: "Feb", budgeted: 2083000, actual: 1600000 },
        { month: "Mar", budgeted: 2083000, actual: 1800000 },
        { month: "Apr", budgeted: 2083000, actual: 2000000 },
        { month: "May", budgeted: 2083000, actual: 2300000 },
        { month: "Jun", budgeted: 2083000, actual: 2800000 },
      ],
    },
    {
      department: "Administration",
      budget: 10000000,
      spent: 6000000,
      remaining: 4000000,
      utilization: 60,
      status: "on-track",
      categories: [
        {
          category: "Salaries",
          budgeted: 5000000,
          actual: 3000000,
          variance: 2000000,
          variancePercentage: 40,
          status: "under",
        },
        {
          category: "Office Supplies",
          budgeted: 2500000,
          actual: 1500000,
          variance: 1000000,
          variancePercentage: 40,
          status: "under",
        },
        {
          category: "Travel",
          budgeted: 1500000,
          actual: 1000000,
          variance: 500000,
          variancePercentage: 33.3,
          status: "under",
        },
        {
          category: "Misc",
          budgeted: 1000000,
          actual: 500000,
          variance: 500000,
          variancePercentage: 50,
          status: "under",
        },
      ],
      monthlySpending: [
        { month: "Jan", budgeted: 833000, actual: 700000 },
        { month: "Feb", budgeted: 833000, actual: 800000 },
        { month: "Mar", budgeted: 833000, actual: 900000 },
        { month: "Apr", budgeted: 833000, actual: 1000000 },
        { month: "May", budgeted: 833000, actual: 1200000 },
        { month: "Jun", budgeted: 833000, actual: 1400000 },
      ],
    },
  ],
  categorySummary: [
    {
      category: "Salaries",
      budgeted: 93700000,
      actual: 51600000,
      variance: 42100000,
      variancePercentage: 44.9,
      status: "under",
    },
    {
      category: "Infrastructure",
      budgeted: 20000000,
      actual: 12000000,
      variance: 8000000,
      variancePercentage: 40,
      status: "under",
    },
    {
      category: "Software",
      budgeted: 20000000,
      actual: 14000000,
      variance: 6000000,
      variancePercentage: 30,
      status: "under",
    },
    {
      category: "Travel",
      budgeted: 11500000,
      actual: 8800000,
      variance: 2700000,
      variancePercentage: 23.5,
      status: "under",
    },
    {
      category: "Consulting",
      budgeted: 8000000,
      actual: 5500000,
      variance: 2500000,
      variancePercentage: 31.3,
      status: "under",
    },
    {
      category: "Facilities",
      budgeted: 6000000,
      actual: 3000000,
      variance: 3000000,
      variancePercentage: 50,
      status: "under",
    },
    {
      category: "Equipment",
      budgeted: 6000000,
      actual: 3000000,
      variance: 3000000,
      variancePercentage: 50,
      status: "under",
    },
    {
      category: "Entertainment",
      budgeted: 4000000,
      actual: 4200000,
      variance: -200000,
      variancePercentage: -5,
      status: "over",
    },
    {
      category: "Recruitment",
      budgeted: 4000000,
      actual: 3000000,
      variance: 1000000,
      variancePercentage: 25,
      status: "under",
    },
    {
      category: "Training",
      budgeted: 6500000,
      actual: 3000000,
      variance: 3500000,
      variancePercentage: 53.8,
      status: "under",
    },
    {
      category: "Utilities",
      budgeted: 4000000,
      actual: 2000000,
      variance: 2000000,
      variancePercentage: 50,
      status: "under",
    },
    {
      category: "Marketing",
      budgeted: 3000000,
      actual: 2500000,
      variance: 500000,
      variancePercentage: 16.7,
      status: "on-track",
    },
    {
      category: "Supplies",
      budgeted: 6000000,
      actual: 2000000,
      variance: 4000000,
      variancePercentage: 66.7,
      status: "under",
    },
    {
      category: "Benefits",
      budgeted: 1500000,
      actual: 1000000,
      variance: 500000,
      variancePercentage: 33.3,
      status: "under",
    },
    {
      category: "Tools",
      budgeted: 2000000,
      actual: 1000000,
      variance: 1000000,
      variancePercentage: 50,
      status: "under",
    },
    {
      category: "Misc",
      budgeted: 1000000,
      actual: 500000,
      variance: 500000,
      variancePercentage: 50,
      status: "under",
    },
  ],
  monthlyTrend: [
    {
      month: "Jan",
      budgeted: 17500000,
      actual: 14500000,
      cumulative: 14500000,
    },
    {
      month: "Feb",
      budgeted: 17500000,
      actual: 15900000,
      cumulative: 30400000,
    },
    {
      month: "Mar",
      budgeted: 17500000,
      actual: 17400000,
      cumulative: 47800000,
    },
    {
      month: "Apr",
      budgeted: 17500000,
      actual: 18800000,
      cumulative: 66600000,
    },
    {
      month: "May",
      budgeted: 17500000,
      actual: 21500000,
      cumulative: 88100000,
    },
    {
      month: "Jun",
      budgeted: 17500000,
      actual: 26000000,
      cumulative: 114100000,
    },
  ],
  varianceSummary: [
    { department: "Finance", variance: 18000000, percentage: 36 },
    { department: "Engineering", variance: 35000000, percentage: 43.8 },
    { department: "HR", variance: 5000000, percentage: 33.3 },
    { department: "Sales", variance: 2000000, percentage: 6.7 },
    { department: "Operations", variance: 13000000, percentage: 52 },
    { department: "Admin", variance: 4000000, percentage: 40 },
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
];

export default function BudgetReportPage() {
  // State
  const [data] = useState<BudgetSummary>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentBudget;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("FY 2026");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Filter and sort departments
  const filteredDepartments = useMemo(() => {
    let result = [...data.departments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((d) => d.department.toLowerCase().includes(query));
    }

    if (selectedDepartment !== "all") {
      result = result.filter((d) => d.department === selectedDepartment);
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
  }, [data.departments, searchQuery, selectedDepartment, sortConfig]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under":
        return (
          <Badge className="bg-blue-100 text-blue-700">Under Budget</Badge>
        );
      case "on-track":
        return <Badge className="bg-green-100 text-green-700">On Track</Badge>;
      case "over":
        return (
          <Badge className="bg-orange-100 text-orange-700">Over Budget</Badge>
        );
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Critical</Badge>;
      default:
        return null;
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 75) return "bg-orange-500";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getUtilizationTextColor = (percentage: number) => {
    if (percentage > 90) return "text-red-600";
    if (percentage > 75) return "text-orange-600";
    return "text-green-600";
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Budget vs Actual Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Compare budget allocations against actual spending
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedFiscalYear}
            onValueChange={setSelectedFiscalYear}
          >
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FY 2026">FY 2026</SelectItem>
              <SelectItem value="FY 2025">FY 2025</SelectItem>
              <SelectItem value="FY 2024">FY 2024</SelectItem>
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
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalBudget)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalSpent)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.totalRemaining)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Overall Utilization
                </p>
                <p className="text-2xl font-bold">{data.overallUtilization}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <Progress value={data.overallUtilization} className="h-2 mt-3" />
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
          <TabsTrigger value="departments">
            <Building2 className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Layers className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="trends">
            <Activity className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget vs Actual Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual by Department</CardTitle>
                <CardDescription>
                  Comparison of budgeted vs actual spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.departments} barGap={4}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="department"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(value) => formatCompactCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="budget"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      name="Budget"
                    />
                    <Bar
                      dataKey="spent"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                      name="Actual Spent"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Utilization Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
                <CardDescription>
                  Percentage of total budget by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.departments}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="budget"
                      nameKey="department"
                      label={({ department, percent }: any) =>
                        `${department} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {data.departments.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Variance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Variance Analysis</CardTitle>
              <CardDescription>
                Positive variance indicates under-spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.varianceSummary} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                  />
                  <YAxis
                    dataKey="department"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  />
                  <Bar dataKey="variance" radius={[0, 4, 4, 0]}>
                    {data.varianceSummary.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.variance > 0 ? "#10B981" : "#EF4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Fiscal Year 2026 — Budget Analysis</CardTitle>
                  <CardDescription>
                    Detailed budget vs actual by department
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search departments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("budget")}
                        >
                          Budget
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("utilization")}
                        >
                          Utilization
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((dept, index) => (
                      <TableRow key={dept.department}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium">
                              {dept.department}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(dept.budget)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(dept.spent)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              dept.remaining > dept.budget * 0.2
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {formatCurrency(dept.remaining)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${getUtilizationTextColor(dept.utilization)}`}
                            >
                              {dept.utilization}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dept.status)}</TableCell>
                        <TableCell>
                          <div className="w-[150px]">
                            <Progress
                              value={dept.utilization}
                              className="h-2"
                              indicatorClassName={getUtilizationColor(
                                dept.utilization,
                              )}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Spent</span>
                              <span>Remaining</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell>{formatCurrency(data.totalBudget)}</TableCell>
                      <TableCell>{formatCurrency(data.totalSpent)}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(data.totalRemaining)}
                      </TableCell>
                      <TableCell>{data.overallUtilization}%</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Department Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept, index) => (
              <Card
                key={dept.department}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <CardTitle className="text-base">
                        {dept.department}
                      </CardTitle>
                    </div>
                    {getStatusBadge(dept.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress
                    value={dept.utilization}
                    className="h-2"
                    indicatorClassName={getUtilizationColor(dept.utilization)}
                  />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">
                        {formatCurrency(dept.budget)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium">
                        {formatCurrency(dept.spent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(dept.remaining)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Utilization</p>
                      <p
                        className={`font-bold ${getUtilizationTextColor(dept.utilization)}`}
                      >
                        {dept.utilization}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                  Budget vs actual across all categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {data.categorySummary.map((cat, index) => (
                    <div
                      key={cat.category}
                      className="space-y-2 p-3 border rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-medium text-sm">
                            {cat.category}
                          </span>
                        </div>
                        {getStatusBadge(cat.status)}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Budget:{" "}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(cat.budgeted)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Actual:{" "}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(cat.actual)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Var: </span>
                          <span
                            className={`font-medium ${cat.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {cat.variancePercentage}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={
                          cat.budgeted > 0
                            ? (cat.actual / cat.budgeted) * 100
                            : 0
                        }
                        className="h-1.5"
                        indicatorClassName={getUtilizationColor(
                          cat.budgeted > 0
                            ? (cat.actual / cat.budgeted) * 100
                            : 0,
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>
                  Top categories by budget allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                    data={data.categorySummary.slice(0, 10)}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      tickFormatter={(value) => formatCompactCurrency(value)}
                    />
                    <YAxis
                      dataKey="category"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="budgeted"
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                      name="Budget"
                      barSize={16}
                    />
                    <Bar
                      dataKey="actual"
                      fill="#F59E0B"
                      radius={[0, 4, 4, 0]}
                      name="Actual"
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
                <CardDescription>
                  Budgeted vs actual monthly spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.monthlyTrend}>
                    <defs>
                      <linearGradient
                        id="colorBudgeted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorActual"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F59E0B"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F59E0B"
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
                      tickFormatter={(value) => formatCompactCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="budgeted"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#colorBudgeted)"
                      name="Budgeted"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      fill="url(#colorActual)"
                      name="Actual"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cumulative Spending */}
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Spending</CardTitle>
                <CardDescription>
                  Running total of actual spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data.monthlyTrend}>
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
                      tickFormatter={(value) => formatCompactCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#8B5CF6" }}
                      name="Cumulative Spending"
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
                    <TableHead>Budgeted</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Variance %</TableHead>
                    <TableHead>Cumulative</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.monthlyTrend.map((month) => {
                    const variance = month.budgeted - month.actual;
                    const variancePct =
                      month.budgeted > 0
                        ? ((variance / month.budgeted) * 100).toFixed(1)
                        : "0";
                    const isOver = month.actual > month.budgeted;
                    return (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">
                          {month.month} 2026
                        </TableCell>
                        <TableCell>{formatCurrency(month.budgeted)}</TableCell>
                        <TableCell>{formatCurrency(month.actual)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              isOver ? "text-red-600" : "text-green-600"
                            }
                          >
                            {isOver ? "-" : ""}
                            {formatCurrency(Math.abs(variance))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              isOver ? "text-red-600" : "text-green-600"
                            }
                          >
                            {isOver ? "-" : ""}
                            {variancePct}%
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(month.cumulative)}
                        </TableCell>
                        <TableCell>
                          {isOver ? (
                            <Badge className="bg-red-100 text-red-700">
                              Over
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700">
                              Under
                            </Badge>
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
