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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  Wallet,
  CreditCard,
  PiggyBank,
  PieChart,
  BarChart3,
  LineChart,
  Eye,
  FileText,
  Scale,
  Landmark,
  CheckCircle,
  AlertCircle,
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
type FinancialStatement =
  | "income_statement"
  | "balance_sheet"
  | "cash_flow"
  | "ratios";
type Period = "monthly" | "quarterly" | "yearly";

interface IncomeStatementItem {
  id: number;
  category: string;
  subcategory: string;
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercent: number;
}

interface BalanceSheetItem {
  id: number;
  category: string;
  subcategory: string;
  currentAmount: number;
  previousAmount: number;
  change: number;
  changePercent: number;
}

interface CashFlowItem {
  id: number;
  category: string;
  subcategory: string;
  amount: number;
  percentage: number;
}

interface FinancialRatio {
  name: string;
  value: number;
  benchmark: number;
  status: "good" | "warning" | "critical";
  description: string;
}

// Mock Income Statement Data
const mockIncomeStatement: IncomeStatementItem[] = [
  {
    id: 1,
    category: "Revenue",
    subcategory: "Product Sales",
    currentPeriod: 12500000,
    previousPeriod: 11200000,
    change: 1300000,
    changePercent: 11.6,
  },
  {
    id: 2,
    category: "Revenue",
    subcategory: "Service Revenue",
    currentPeriod: 5800000,
    previousPeriod: 5200000,
    change: 600000,
    changePercent: 11.5,
  },
  {
    id: 3,
    category: "Cost of Sales",
    subcategory: "Raw Materials",
    currentPeriod: 3500000,
    previousPeriod: 3200000,
    change: 300000,
    changePercent: 9.4,
  },
  {
    id: 4,
    category: "Cost of Sales",
    subcategory: "Direct Labor",
    currentPeriod: 2000000,
    previousPeriod: 1800000,
    change: 200000,
    changePercent: 11.1,
  },
  {
    id: 5,
    category: "Operating Expenses",
    subcategory: "Sales & Marketing",
    currentPeriod: 1500000,
    previousPeriod: 1400000,
    change: 100000,
    changePercent: 7.1,
  },
  {
    id: 6,
    category: "Operating Expenses",
    subcategory: "Rent & Utilities",
    currentPeriod: 1200000,
    previousPeriod: 1150000,
    change: 50000,
    changePercent: 4.3,
  },
  {
    id: 7,
    category: "Operating Expenses",
    subcategory: "Salaries & Wages",
    currentPeriod: 3000000,
    previousPeriod: 2800000,
    change: 200000,
    changePercent: 7.1,
  },
  {
    id: 8,
    category: "Operating Expenses",
    subcategory: "IT & Software",
    currentPeriod: 500000,
    previousPeriod: 450000,
    change: 50000,
    changePercent: 11.1,
  },
];

// Mock Balance Sheet Data
const mockBalanceSheet: BalanceSheetItem[] = [
  {
    id: 1,
    category: "Assets",
    subcategory: "Current Assets",
    currentAmount: 102500000,
    previousAmount: 87500000,
    change: 15000000,
    changePercent: 17.1,
  },
  {
    id: 2,
    category: "Assets",
    subcategory: "Fixed Assets",
    currentAmount: 52500000,
    previousAmount: 47000000,
    change: 5500000,
    changePercent: 11.7,
  },
  {
    id: 3,
    category: "Liabilities",
    subcategory: "Current Liabilities",
    currentAmount: 25500000,
    previousAmount: 19000000,
    change: 6500000,
    changePercent: 34.2,
  },
  {
    id: 4,
    category: "Liabilities",
    subcategory: "Long-term Liabilities",
    currentAmount: 65000000,
    previousAmount: 70000000,
    change: -5000000,
    changePercent: -7.1,
  },
  {
    id: 5,
    category: "Equity",
    subcategory: "Share Capital",
    currentAmount: 100000000,
    previousAmount: 100000000,
    change: 0,
    changePercent: 0,
  },
  {
    id: 6,
    category: "Equity",
    subcategory: "Retained Earnings",
    currentAmount: 50000000,
    previousAmount: 35000000,
    change: 15000000,
    changePercent: 42.9,
  },
];

// Mock Cash Flow Data
const mockCashFlow: CashFlowItem[] = [
  {
    id: 1,
    category: "Operating Activities",
    subcategory: "Net Income",
    amount: 8500000,
    percentage: 45.9,
  },
  {
    id: 2,
    category: "Operating Activities",
    subcategory: "Depreciation",
    amount: 1250000,
    percentage: 6.8,
  },
  {
    id: 3,
    category: "Operating Activities",
    subcategory: "Changes in Working Capital",
    amount: 2500000,
    percentage: 13.5,
  },
  {
    id: 4,
    category: "Investing Activities",
    subcategory: "Asset Purchases",
    amount: -4500000,
    percentage: -24.3,
  },
  {
    id: 5,
    category: "Financing Activities",
    subcategory: "Loan Repayments",
    amount: -5000000,
    percentage: -27.0,
  },
  {
    id: 6,
    category: "Financing Activities",
    subcategory: "Dividends Paid",
    amount: -2000000,
    percentage: -10.8,
  },
];

// Financial Ratios
const mockRatios: FinancialRatio[] = [
  {
    name: "Current Ratio",
    value: 4.02,
    benchmark: 2.0,
    status: "good",
    description:
      "Liquidity ratio measuring ability to pay short-term obligations",
  },
  {
    name: "Quick Ratio",
    value: 3.75,
    benchmark: 1.5,
    status: "good",
    description: "Stricter liquidity measure excluding inventory",
  },
  {
    name: "Debt to Equity",
    value: 0.63,
    benchmark: 1.0,
    status: "good",
    description: "Leverage ratio measuring debt relative to equity",
  },
  {
    name: "Gross Margin",
    value: 38.5,
    benchmark: 35.0,
    status: "good",
    description: "Profitability after cost of goods sold",
  },
  {
    name: "Operating Margin",
    value: 24.8,
    benchmark: 20.0,
    status: "good",
    description: "Profitability from core operations",
  },
  {
    name: "Net Margin",
    value: 22.1,
    benchmark: 15.0,
    status: "good",
    description: "Overall profitability after all expenses",
  },
  {
    name: "ROE",
    value: 18.5,
    benchmark: 15.0,
    status: "good",
    description: "Return on equity - shareholder returns",
  },
  {
    name: "ROA",
    value: 12.3,
    benchmark: 10.0,
    status: "good",
    description: "Return on assets - asset efficiency",
  },
];

// Monthly trend data for charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 11200000, expenses: 7800000, profit: 3400000 },
  { month: "Feb", revenue: 11800000, expenses: 8100000, profit: 3700000 },
  { month: "Mar", revenue: 12500000, expenses: 8500000, profit: 4000000 },
  { month: "Apr", revenue: 13200000, expenses: 8900000, profit: 4300000 },
  { month: "May", revenue: 13800000, expenses: 9200000, profit: 4600000 },
  { month: "Jun", revenue: 14200000, expenses: 9400000, profit: 4800000 },
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

const formatPercentage = (value: number) => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "good":
      return "text-green-600 bg-green-50";
    case "warning":
      return "text-yellow-600 bg-yellow-50";
    case "critical":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "good":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "critical":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

export default function FinancialStatements() {
  const router = useRouter();

  // State
  const [activeStatement, setActiveStatement] =
    useState<FinancialStatement>("income_statement");
  const [period, setPeriod] = useState<Period>("monthly");
  const [selectedDate, setSelectedDate] = useState("March 2026");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [incomeData] = useState(mockIncomeStatement);
  const [balanceData] = useState(mockBalanceSheet);
  const [cashFlowData] = useState(mockCashFlow);
  const [ratios] = useState(mockRatios);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate totals for Income Statement
  const incomeTotals = useMemo(() => {
    const revenue = incomeData
      .filter((i) => i.category === "Revenue")
      .reduce((sum, i) => sum + i.currentPeriod, 0);
    const costOfSales = incomeData
      .filter((i) => i.category === "Cost of Sales")
      .reduce((sum, i) => sum + i.currentPeriod, 0);
    const operatingExpenses = incomeData
      .filter((i) => i.category === "Operating Expenses")
      .reduce((sum, i) => sum + i.currentPeriod, 0);
    const grossProfit = revenue - costOfSales;
    const operatingProfit = grossProfit - operatingExpenses;
    const netProfit = operatingProfit;

    return {
      revenue,
      costOfSales,
      grossProfit,
      operatingExpenses,
      operatingProfit,
      netProfit,
    };
  }, [incomeData]);

  // Calculate totals for Balance Sheet
  const balanceTotals = useMemo(() => {
    const totalAssets = balanceData
      .filter((i) => i.category === "Assets")
      .reduce((sum, i) => sum + i.currentAmount, 0);
    const totalLiabilities = balanceData
      .filter((i) => i.category === "Liabilities")
      .reduce((sum, i) => sum + i.currentAmount, 0);
    const totalEquity = balanceData
      .filter((i) => i.category === "Equity")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesEquity: totalLiabilities + totalEquity,
    };
  }, [balanceData]);

  // Cash flow totals
  const cashFlowTotals = useMemo(() => {
    const operatingTotal = cashFlowData
      .filter((i) => i.category === "Operating Activities")
      .reduce((sum, i) => sum + i.amount, 0);
    const investingTotal = cashFlowData
      .filter((i) => i.category === "Investing Activities")
      .reduce((sum, i) => sum + i.amount, 0);
    const financingTotal = cashFlowData
      .filter((i) => i.category === "Financing Activities")
      .reduce((sum, i) => sum + i.amount, 0);
    const netCashFlow = operatingTotal + investingTotal + financingTotal;

    return { operatingTotal, investingTotal, financingTotal, netCashFlow };
  }, [cashFlowData]);

  const handleExport = () => {
    let headers: string[] = [];
    let data: string[][] = [];

    switch (activeStatement) {
      case "income_statement":
        headers = [
          "Category",
          "Subcategory",
          "Current Period",
          "Previous Period",
          "Change",
          "Change %",
        ];
        data = incomeData.map((i) => [
          i.category,
          i.subcategory,
          i.currentPeriod.toString(),
          i.previousPeriod.toString(),
          i.change.toString(),
          `${i.changePercent.toFixed(1)}%`,
        ]);
        break;
      case "balance_sheet":
        headers = [
          "Category",
          "Subcategory",
          "Current Amount",
          "Previous Amount",
          "Change",
          "Change %",
        ];
        data = balanceData.map((i) => [
          i.category,
          i.subcategory,
          i.currentAmount.toString(),
          i.previousAmount.toString(),
          i.change.toString(),
          `${i.changePercent.toFixed(1)}%`,
        ]);
        break;
      case "cash_flow":
        headers = ["Category", "Subcategory", "Amount", "Percentage"];
        data = cashFlowData.map((i) => [
          i.category,
          i.subcategory,
          i.amount.toString(),
          `${i.percentage.toFixed(1)}%`,
        ]);
        break;
      case "ratios":
        headers = ["Ratio", "Value", "Benchmark", "Status", "Description"];
        data = ratios.map((r) => [
          r.name,
          r.value.toString(),
          r.benchmark.toString(),
          r.status,
          r.description,
        ]);
        break;
    }

    const csvContent = [headers, ...data]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeStatement}-${selectedDate}-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setCurrentPage(1);
  };

  const getStatementTitle = () => {
    switch (activeStatement) {
      case "income_statement":
        return "Income Statement (Profit & Loss)";
      case "balance_sheet":
        return "Balance Sheet";
      case "cash_flow":
        return "Cash Flow Statement";
      case "ratios":
        return "Financial Ratios Analysis";
      default:
        return "Financial Statements";
    }
  };

  const getStatementDescription = () => {
    switch (activeStatement) {
      case "income_statement":
        return "Financial performance overview showing revenues, expenses, and profitability";
      case "balance_sheet":
        return "Financial position showing assets, liabilities, and equity";
      case "cash_flow":
        return "Cash movements from operating, investing, and financing activities";
      case "ratios":
        return "Key financial metrics and performance indicators";
      default:
        return "";
    }
  };

  const COLORS = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
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
              <FileText className="h-6 w-6" />
              Financial Statements
            </h1>
            <p className="text-muted-foreground mt-1">{getStatementTitle()}</p>
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

      {/* Statement Selection Tabs */}
      <Tabs
        value={activeStatement}
        onValueChange={(v) => setActiveStatement(v as FinancialStatement)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income_statement">
            <TrendingUp className="h-4 w-4 mr-2" />
            Income Statement
          </TabsTrigger>
          <TabsTrigger value="balance_sheet">
            <Scale className="h-4 w-4 mr-2" />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="cash_flow">
            <DollarSign className="h-4 w-4 mr-2" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger value="ratios">
            <PieChart className="h-4 w-4 mr-2" />
            Ratios
          </TabsTrigger>
        </TabsList>

        {/* Income Statement */}
        <TabsContent value="income_statement" className="space-y-4 mt-4">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(incomeTotals.revenue)}
                </p>
                <p className="text-xs text-green-600">
                  +11.5% vs previous period
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Gross Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(incomeTotals.grossProfit)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Margin:{" "}
                  {(
                    (incomeTotals.grossProfit / incomeTotals.revenue) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Operating Profit
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(incomeTotals.operatingProfit)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Margin:{" "}
                  {(
                    (incomeTotals.operatingProfit / incomeTotals.revenue) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(incomeTotals.netProfit)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Margin:{" "}
                  {(
                    (incomeTotals.netProfit / incomeTotals.revenue) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Monthly Performance Trend
              </CardTitle>
              <CardDescription>
                Revenue, expenses, and profit over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ReLineChart data={monthlyRevenueData}>
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
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
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
                    dataKey="expenses"
                    stroke="#EF4444"
                    name="Expenses"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="profit"
                    stroke="#3B82F6"
                    name="Profit"
                    strokeWidth={2}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income Statement Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead className="text-right">
                        Current Period
                      </TableHead>
                      <TableHead className="text-right">
                        Previous Period
                      </TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Change %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-medium">
                          {item.subcategory}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.currentPeriod)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.previousPeriod)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.change >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(item.change))}
                        </TableCell>
                        <TableCell
                          className={`text-right ${item.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(item.changePercent)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Rows */}
                    <TableRow className="border-t-2 font-bold bg-muted/50">
                      <TableCell colSpan={2}>Total Revenue</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(incomeTotals.revenue)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Cost of Sales</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(incomeTotals.costOfSales)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Gross Profit</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(incomeTotals.grossProfit)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Operating Expenses</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(incomeTotals.operatingExpenses)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Operating Profit</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(incomeTotals.operatingProfit)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={2}>Net Profit</TableCell>
                      <TableCell className="text-right text-purple-600">
                        {formatCurrency(incomeTotals.netProfit)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance_sheet" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-4 text-center">
                <Wallet className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(balanceTotals.totalAssets)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Total Liabilities
                </p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(balanceTotals.totalLiabilities)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4 text-center">
                <PiggyBank className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Equity</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(balanceTotals.totalEquity)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead className="text-right">
                        Current Period
                      </TableHead>
                      <TableHead className="text-right">
                        Previous Period
                      </TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Change %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-medium">
                          {item.subcategory}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.currentAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.previousAmount)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.change >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(item.change))}
                        </TableCell>
                        <TableCell
                          className={`text-right ${item.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(item.changePercent)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold bg-muted/50">
                      <TableCell colSpan={2}>Total Assets</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(balanceTotals.totalAssets)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Total Liabilities</TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(balanceTotals.totalLiabilities)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Total Equity</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(balanceTotals.totalEquity)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={2}>
                        Total Liabilities & Equity
                      </TableCell>
                      <TableCell
                        className={`text-right ${balanceTotals.totalAssets === balanceTotals.totalLiabilitiesEquity ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(balanceTotals.totalLiabilitiesEquity)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Statement */}
        <TabsContent value="cash_flow" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Operating Cash Flow
                </p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(cashFlowTotals.operatingTotal)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Investing Cash Flow
                </p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(Math.abs(cashFlowTotals.investingTotal))}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Financing Cash Flow
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(Math.abs(cashFlowTotals.financingTotal))}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Net Cash Flow</p>
                <p
                  className={`text-lg font-bold ${cashFlowTotals.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(cashFlowTotals.netCashFlow))}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-medium">
                          {item.subcategory}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${item.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.amount >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(item.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold bg-muted/50">
                      <TableCell colSpan={2}>Net Cash Flow</TableCell>
                      <TableCell
                        className={`text-right ${cashFlowTotals.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {cashFlowTotals.netCashFlow >= 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(cashFlowTotals.netCashFlow))}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cash Flow Composition</CardTitle>
              <CardDescription>Breakdown by activity type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={[
                      {
                        name: "Operating",
                        value: Math.abs(cashFlowTotals.operatingTotal),
                        color: "#10B981",
                      },
                      {
                        name: "Investing",
                        value: Math.abs(cashFlowTotals.investingTotal),
                        color: "#EF4444",
                      },
                      {
                        name: "Financing",
                        value: Math.abs(cashFlowTotals.financingTotal),
                        color: "#3B82F6",
                      },
                    ]}
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
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#3B82F6" />
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Ratios */}
        <TabsContent value="ratios" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ratios.map((ratio, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm">{ratio.name}</p>
                    {getStatusIcon(ratio.status)}
                  </div>
                  <p className="text-2xl font-bold">{ratio.value.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Benchmark: {ratio.benchmark.toFixed(2)}
                  </p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    {ratio.description}
                  </p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${ratio.status === "good" ? "bg-green-500" : ratio.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{
                          width: `${Math.min((ratio.value / (ratio.benchmark * 2)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ratio Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Ratio Performance Dashboard
              </CardTitle>
              <CardDescription>
                Comparison against industry benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ReBarChart data={ratios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Actual Value" />
                  <Bar dataKey="benchmark" fill="#82ca9d" name="Benchmark" />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
