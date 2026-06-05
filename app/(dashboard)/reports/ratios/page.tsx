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
import { Label } from "@/src/components/ui/label";
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
  Info,
  Target,
  Activity,
  Shield,
  Zap,
  Droplet,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

// Types
type RatioCategory =
  | "liquidity"
  | "profitability"
  | "leverage"
  | "efficiency"
  | "market";
type Period = "monthly" | "quarterly" | "annually";
type TrendDirection = "up" | "down" | "stable";

interface FinancialRatio {
  id: number;
  name: string;
  category: RatioCategory;
  value: number;
  previousValue: number;
  industryBenchmark: number;
  targetValue: number;
  status: "excellent" | "good" | "fair" | "poor" | "critical";
  trend: TrendDirection;
  trendValue: number;
  description: string;
  formula: string;
  interpretation: string;
}

interface RatioTrendData {
  period: string;
  value: number;
  benchmark: number;
}

// Mock Ratio Data
const mockRatios: FinancialRatio[] = [
  // Liquidity Ratios
  {
    id: 1,
    name: "Current Ratio",
    category: "liquidity",
    value: 4.02,
    previousValue: 3.85,
    industryBenchmark: 2.0,
    targetValue: 2.5,
    status: "excellent",
    trend: "up",
    trendValue: 4.4,
    description:
      "Measures ability to pay short-term obligations with current assets",
    formula: "Current Assets / Current Liabilities",
    interpretation:
      "Higher ratio indicates better liquidity position. Above 2.0 is generally considered healthy.",
  },
  {
    id: 2,
    name: "Quick Ratio",
    category: "liquidity",
    value: 3.75,
    previousValue: 3.52,
    industryBenchmark: 1.5,
    targetValue: 1.8,
    status: "excellent",
    trend: "up",
    trendValue: 6.5,
    description: "Stricter liquidity measure excluding inventory",
    formula: "(Current Assets - Inventory) / Current Liabilities",
    interpretation:
      "Also known as Acid-Test ratio. Excludes inventory which may be difficult to convert to cash quickly.",
  },
  {
    id: 3,
    name: "Cash Ratio",
    category: "liquidity",
    value: 2.45,
    previousValue: 2.3,
    industryBenchmark: 0.5,
    targetValue: 0.8,
    status: "excellent",
    trend: "up",
    trendValue: 6.5,
    description: "Most conservative liquidity measure using only cash",
    formula: "(Cash + Cash Equivalents) / Current Liabilities",
    interpretation:
      "Indicates ability to pay short-term debt with cash on hand.",
  },

  // Profitability Ratios
  {
    id: 4,
    name: "Gross Profit Margin",
    category: "profitability",
    value: 38.5,
    previousValue: 36.8,
    industryBenchmark: 35.0,
    targetValue: 40.0,
    status: "good",
    trend: "up",
    trendValue: 4.6,
    description: "Percentage of revenue retained after cost of goods sold",
    formula: "(Revenue - COGS) / Revenue × 100",
    interpretation:
      "Higher margin indicates better pricing power and cost control.",
  },
  {
    id: 5,
    name: "Operating Margin",
    category: "profitability",
    value: 24.8,
    previousValue: 23.2,
    industryBenchmark: 20.0,
    targetValue: 25.0,
    status: "good",
    trend: "up",
    trendValue: 6.9,
    description: "Profit from core operations before interest and taxes",
    formula: "Operating Income / Revenue × 100",
    interpretation: "Measures operational efficiency and profitability.",
  },
  {
    id: 6,
    name: "Net Profit Margin",
    category: "profitability",
    value: 22.1,
    previousValue: 20.5,
    industryBenchmark: 15.0,
    targetValue: 20.0,
    status: "excellent",
    trend: "up",
    trendValue: 7.8,
    description: "Bottom-line profitability after all expenses",
    formula: "Net Income / Revenue × 100",
    interpretation:
      "Indicates overall profitability and cost management effectiveness.",
  },
  {
    id: 7,
    name: "Return on Assets (ROA)",
    category: "profitability",
    value: 12.3,
    previousValue: 11.8,
    industryBenchmark: 10.0,
    targetValue: 12.0,
    status: "good",
    trend: "up",
    trendValue: 4.2,
    description: "How efficiently assets generate profits",
    formula: "Net Income / Total Assets × 100",
    interpretation: "Higher percentage indicates better asset utilization.",
  },
  {
    id: 8,
    name: "Return on Equity (ROE)",
    category: "profitability",
    value: 18.5,
    previousValue: 17.2,
    industryBenchmark: 15.0,
    targetValue: 18.0,
    status: "good",
    trend: "up",
    trendValue: 7.6,
    description: "Return generated on shareholders' investment",
    formula: "Net Income / Shareholders' Equity × 100",
    interpretation:
      "Key metric for investors measuring profitability relative to equity.",
  },

  // Leverage Ratios
  {
    id: 9,
    name: "Debt to Equity",
    category: "leverage",
    value: 0.63,
    previousValue: 0.71,
    industryBenchmark: 1.0,
    targetValue: 0.8,
    status: "good",
    trend: "down",
    trendValue: -11.3,
    description: "Proportion of debt vs equity financing",
    formula: "Total Liabilities / Shareholders' Equity",
    interpretation:
      "Lower ratio indicates less leverage and lower financial risk.",
  },
  {
    id: 10,
    name: "Debt Ratio",
    category: "leverage",
    value: 0.39,
    previousValue: 0.42,
    industryBenchmark: 0.5,
    targetValue: 0.45,
    status: "good",
    trend: "down",
    trendValue: -7.1,
    description: "Percentage of assets financed by debt",
    formula: "Total Liabilities / Total Assets",
    interpretation: "Indicates financial leverage and solvency risk.",
  },
  {
    id: 11,
    name: "Interest Coverage",
    category: "leverage",
    value: 8.5,
    previousValue: 7.8,
    industryBenchmark: 3.0,
    targetValue: 5.0,
    status: "excellent",
    trend: "up",
    trendValue: 9.0,
    description: "Ability to pay interest expenses",
    formula: "EBIT / Interest Expense",
    interpretation:
      "Higher ratio indicates greater ability to meet interest obligations.",
  },

  // Efficiency Ratios
  {
    id: 12,
    name: "Asset Turnover",
    category: "efficiency",
    value: 1.85,
    previousValue: 1.78,
    industryBenchmark: 1.5,
    targetValue: 1.8,
    status: "good",
    trend: "up",
    trendValue: 3.9,
    description: "How efficiently assets generate sales",
    formula: "Revenue / Total Assets",
    interpretation: "Higher ratio indicates better asset utilization.",
  },
  {
    id: 13,
    name: "Inventory Turnover",
    category: "efficiency",
    value: 6.2,
    previousValue: 5.8,
    industryBenchmark: 5.0,
    targetValue: 6.0,
    status: "good",
    trend: "up",
    trendValue: 6.9,
    description: "How quickly inventory is sold",
    formula: "COGS / Average Inventory",
    interpretation: "Higher ratio indicates efficient inventory management.",
  },
  {
    id: 14,
    name: "Receivables Turnover",
    category: "efficiency",
    value: 8.4,
    previousValue: 7.9,
    industryBenchmark: 7.0,
    targetValue: 8.0,
    status: "good",
    trend: "up",
    trendValue: 6.3,
    description: "How quickly customers pay",
    formula: "Revenue / Average Accounts Receivable",
    interpretation:
      "Higher ratio indicates effective credit and collection policies.",
  },
  {
    id: 15,
    name: "Days Sales Outstanding",
    category: "efficiency",
    value: 43.5,
    previousValue: 46.2,
    industryBenchmark: 52.0,
    targetValue: 45.0,
    status: "good",
    trend: "down",
    trendValue: -5.8,
    description: "Average collection period",
    formula: "365 / Receivables Turnover",
    interpretation: "Lower DSO indicates faster collection of receivables.",
  },

  // Market Ratios
  {
    id: 16,
    name: "Earnings Per Share (EPS)",
    category: "market",
    value: 125,
    previousValue: 118,
    industryBenchmark: 100,
    targetValue: 120,
    status: "good",
    trend: "up",
    trendValue: 5.9,
    description: "Profit attributable to each share",
    formula: "Net Income / Weighted Average Shares",
    interpretation: "Higher EPS indicates greater profitability per share.",
  },
  {
    id: 17,
    name: "Price to Earnings (P/E)",
    category: "market",
    value: 15.2,
    previousValue: 16.1,
    industryBenchmark: 18.0,
    targetValue: 16.0,
    status: "good",
    trend: "down",
    trendValue: -5.6,
    description: "Valuation multiple",
    formula: "Market Price per Share / EPS",
    interpretation: "Lower P/E may indicate undervaluation.",
  },
];

// Generate trend data for each ratio
const generateTrendData = (ratio: FinancialRatio): RatioTrendData[] => {
  const baseValue = ratio.value;
  return [
    {
      period: "Q1 2025",
      value: baseValue * 0.85,
      benchmark: ratio.industryBenchmark,
    },
    {
      period: "Q2 2025",
      value: baseValue * 0.9,
      benchmark: ratio.industryBenchmark,
    },
    {
      period: "Q3 2025",
      value: baseValue * 0.95,
      benchmark: ratio.industryBenchmark,
    },
    {
      period: "Q4 2025",
      value: baseValue * 0.98,
      benchmark: ratio.industryBenchmark,
    },
    { period: "Q1 2026", value: baseValue, benchmark: ratio.industryBenchmark },
  ];
};

// Category configuration
const categoryConfig = {
  liquidity: {
    label: "Liquidity Ratios",
    icon: Droplet,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Measure ability to meet short-term obligations",
  },
  profitability: {
    label: "Profitability Ratios",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Measure ability to generate profits",
  },
  leverage: {
    label: "Leverage Ratios",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Measure financial risk and debt levels",
  },
  efficiency: {
    label: "Efficiency Ratios",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Measure asset utilization effectiveness",
  },
  market: {
    label: "Market Ratios",
    icon: TrendingUp,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    description: "Measure market valuation and investor returns",
  },
};

// Helper functions
const formatNumber = (value: number) => {
  return value.toFixed(2);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getStatusBadge = (status: string) => {
  const config = {
    excellent: { color: "bg-green-600 text-white", label: "Excellent" },
    good: { color: "bg-green-100 text-green-700", label: "Good" },
    fair: { color: "bg-yellow-100 text-yellow-700", label: "Fair" },
    poor: { color: "bg-orange-100 text-orange-700", label: "Poor" },
    critical: { color: "bg-red-100 text-red-700", label: "Critical" },
  };
  return (
    <Badge className={config[status as keyof typeof config].color}>
      {config[status as keyof typeof config].label}
    </Badge>
  );
};

const getTrendIcon = (trend: TrendDirection, value: number) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Activity className="h-4 w-4 text-gray-600" />;
};

export default function FinancialRatios() {
  const router = useRouter();

  // State
  const [ratios] = useState<FinancialRatio[]>(mockRatios);
  const [selectedCategory, setSelectedCategory] = useState<
    RatioCategory | "all"
  >("all");
  const [period, setPeriod] = useState<Period>("quarterly");
  const [selectedRatio, setSelectedRatio] = useState<FinancialRatio | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "analysis" | "trends">(
    "summary",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter ratios by category
  const filteredRatios = useMemo(() => {
    if (selectedCategory === "all") return ratios;
    return ratios.filter((r) => r.category === selectedCategory);
  }, [ratios, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredRatios.length / itemsPerPage);
  const paginatedRatios = filteredRatios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Summary statistics
  const summary = useMemo(() => {
    const excellent = ratios.filter((r) => r.status === "excellent").length;
    const good = ratios.filter((r) => r.status === "good").length;
    const fair = ratios.filter((r) => r.status === "fair").length;
    const poor = ratios.filter((r) => r.status === "poor").length;
    const critical = ratios.filter((r) => r.status === "critical").length;

    const avgLiquidity =
      ratios
        .filter((r) => r.category === "liquidity")
        .reduce((sum, r) => sum + r.value, 0) /
      ratios.filter((r) => r.category === "liquidity").length;
    const avgProfitability =
      ratios
        .filter((r) => r.category === "profitability")
        .reduce((sum, r) => sum + r.value, 0) /
      ratios.filter((r) => r.category === "profitability").length;
    const avgLeverage =
      ratios
        .filter((r) => r.category === "leverage")
        .reduce((sum, r) => sum + r.value, 0) /
      ratios.filter((r) => r.category === "leverage").length;
    const avgEfficiency =
      ratios
        .filter((r) => r.category === "efficiency")
        .reduce((sum, r) => sum + r.value, 0) /
      ratios.filter((r) => r.category === "efficiency").length;

    return {
      excellent,
      good,
      fair,
      poor,
      critical,
      avgLiquidity,
      avgProfitability,
      avgLeverage,
      avgEfficiency,
      total: ratios.length,
    };
  }, [ratios]);

  // Radar chart data
  const radarData = useMemo(() => {
    const categories = [
      "liquidity",
      "profitability",
      "leverage",
      "efficiency",
      "market",
    ];
    return categories.map((cat) => {
      const catRatios = ratios.filter((r) => r.category === cat);
      const avgValue =
        catRatios.reduce((sum, r) => sum + r.value, 0) / catRatios.length;
      const avgBenchmark =
        catRatios.reduce((sum, r) => sum + r.industryBenchmark, 0) /
        catRatios.length;
      return {
        category: categoryConfig[cat as RatioCategory]?.label || cat,
        value: avgValue,
        benchmark: avgBenchmark,
      };
    });
  }, [ratios]);

  const handleViewDetails = (ratio: FinancialRatio) => {
    setSelectedRatio(ratio);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Ratio Name",
      "Category",
      "Value",
      "Previous",
      "Benchmark",
      "Status",
      "Trend",
      "Description",
    ];
    const csvData = filteredRatios.map((r) => [
      r.name,
      categoryConfig[r.category].label,
      r.value.toString(),
      r.previousValue.toString(),
      r.industryBenchmark.toString(),
      r.status,
      `${r.trend} (${r.trendValue > 0 ? "+" : ""}${r.trendValue}%)`,
      r.description,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-ratios-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  // Get trend data for the selected ratio
  const trendData = selectedRatio ? generateTrendData(selectedRatio) : [];

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
              Financial Ratios
            </h1>
            <p className="text-muted-foreground mt-1">
              Key financial performance indicators and analysis
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
                <SelectItem value="annually">Annually</SelectItem>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {summary.excellent}
            </p>
            <p className="text-xs text-muted-foreground">Excellent Ratios</p>
          </CardContent>
        </Card>
        <Card className="bg-green-100">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-green-700 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">{summary.good}</p>
            <p className="text-xs text-muted-foreground">Good Ratios</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">
              {summary.fair + summary.poor}
            </p>
            <p className="text-xs text-muted-foreground">Needs Improvement</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">
              {summary.critical}
            </p>
            <p className="text-xs text-muted-foreground">Critical Issues</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{summary.total}</p>
            <p className="text-xs text-muted-foreground">Total Ratios</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const catRatios = ratios.filter(
            (r) => r.category === (key as RatioCategory),
          );
          const avgValue =
            catRatios.reduce((sum, r) => sum + r.value, 0) / catRatios.length;
          const Icon = config.icon;
          return (
            <Card
              key={key}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(key as RatioCategory)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{config.label}</p>
                    <p className="text-lg font-bold">{avgValue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                value={selectedCategory}
                onValueChange={(v) => setSelectedCategory(v as any)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="liquidity">Liquidity Ratios</SelectItem>
                  <SelectItem value="profitability">
                    Profitability Ratios
                  </SelectItem>
                  <SelectItem value="leverage">Leverage Ratios</SelectItem>
                  <SelectItem value="efficiency">Efficiency Ratios</SelectItem>
                  <SelectItem value="market">Market Ratios</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <TabsTrigger value="summary">Ratios Summary</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ratio Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Previous</TableHead>
                      <TableHead className="text-right">Benchmark</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRatios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No ratios found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRatios.map((ratio) => (
                        <TableRow key={ratio.id}>
                          <TableCell className="font-medium">
                            {ratio.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={categoryConfig[ratio.category].color}
                            >
                              {categoryConfig[ratio.category].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(ratio.value)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatNumber(ratio.previousValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(ratio.industryBenchmark)}
                          </TableCell>
                          <TableCell>{getStatusBadge(ratio.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(ratio.trend, ratio.trendValue)}
                              <span
                                className={`text-xs ${ratio.trendValue > 0 ? "text-green-600" : ratio.trendValue < 0 ? "text-red-600" : "text-gray-600"}`}
                              >
                                {ratio.trendValue > 0 ? "+" : ""}
                                {ratio.trendValue}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(ratio)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredRatios.length > 0 && (
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
                        filteredRatios.length,
                      )}{" "}
                      of {filteredRatios.length}
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
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Radar</CardTitle>
                <CardDescription>
                  Comparative analysis vs industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                    <Radar
                      name="Company"
                      dataKey="value"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Performance</CardTitle>
                <CardDescription>Average scores by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const catRatios = ratios.filter(
                      (r) => r.category === (key as RatioCategory),
                    );
                    const avgValue =
                      catRatios.reduce((sum, r) => sum + r.value, 0) /
                      catRatios.length;
                    const avgBenchmark =
                      catRatios.reduce(
                        (sum, r) => sum + r.industryBenchmark,
                        0,
                      ) / catRatios.length;
                    const percentage = (avgValue / avgBenchmark) * 100;
                    const Icon = config.icon;

                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${config.color}`} />
                            <span className="text-sm font-medium">
                              {config.label}
                            </span>
                          </div>
                          <span className="text-sm font-bold">
                            {avgValue.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${percentage >= 100 ? "bg-green-500" : percentage >= 80 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Benchmark: {avgBenchmark.toFixed(2)} (
                          {percentage.toFixed(0)}% of target)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Best & Worst Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
                <CardDescription>Highest rated ratios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratios
                    .sort(
                      (a, b) =>
                        a.value / a.industryBenchmark -
                        b.value / b.industryBenchmark,
                    )
                    .reverse()
                    .slice(0, 5)
                    .map((ratio, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{ratio.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {categoryConfig[ratio.category].label}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatNumber(ratio.value)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            vs {formatNumber(ratio.industryBenchmark)} benchmark
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                <CardDescription>Lowest rated ratios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratios
                    .sort(
                      (a, b) =>
                        a.value / a.industryBenchmark -
                        b.value / b.industryBenchmark,
                    )
                    .slice(0, 5)
                    .map((ratio, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{ratio.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {categoryConfig[ratio.category].label}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            {formatNumber(ratio.value)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            vs {formatNumber(ratio.industryBenchmark)} benchmark
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Historical Trend Analysis
              </CardTitle>
              <CardDescription>
                Select a ratio to view its trend over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label>Select Ratio</Label>
                <Select
                  onValueChange={(value) => {
                    const ratio = ratios.find((r) => r.name === value);
                    if (ratio) handleViewDetails(ratio);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a ratio to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratios.map((ratio) => (
                      <SelectItem key={ratio.id} value={ratio.name}>
                        {ratio.name} - {categoryConfig[ratio.category].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRatio && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">
                        Current Value
                      </p>
                      <p className="text-2xl font-bold">
                        {formatNumber(selectedRatio.value)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">
                        Previous Period
                      </p>
                      <p className="text-2xl font-bold">
                        {formatNumber(selectedRatio.previousValue)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">
                        Industry Benchmark
                      </p>
                      <p className="text-2xl font-bold">
                        {formatNumber(selectedRatio.industryBenchmark)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Status</p>
                      {getStatusBadge(selectedRatio.status)}
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <ReLineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        name="Company Value"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        stroke="#F59E0B"
                        name="Industry Benchmark"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedRatio?.name}</span>
              {selectedRatio && getStatusBadge(selectedRatio.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedRatio && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(selectedRatio.value)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">vs Previous</p>
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(
                      selectedRatio.trend,
                      selectedRatio.trendValue,
                    )}
                    <span
                      className={`text-lg font-bold ${selectedRatio.trendValue > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {selectedRatio.trendValue > 0 ? "+" : ""}
                      {selectedRatio.trendValue}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Description</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRatio.description}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Formula</p>
                <code className="text-xs bg-muted p-2 rounded block">
                  {selectedRatio.formula}
                </code>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Interpretation</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRatio.interpretation}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Performance Analysis</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Company Value:</span>
                    <span className="font-bold">
                      {formatNumber(selectedRatio.value)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Industry Benchmark:</span>
                    <span>{formatNumber(selectedRatio.industryBenchmark)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target Value:</span>
                    <span>{formatNumber(selectedRatio.targetValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Gap to Target:</span>
                    <span
                      className={
                        selectedRatio.value >= selectedRatio.targetValue
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatNumber(
                        Math.abs(
                          selectedRatio.value - selectedRatio.targetValue,
                        ),
                      )}
                      {selectedRatio.value >= selectedRatio.targetValue
                        ? " (Achieved)"
                        : " (Shortfall)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
