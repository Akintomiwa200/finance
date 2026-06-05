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
  Wallet,
  Building2,
  CreditCard,
  PiggyBank,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type CashFlowCategory = "operating" | "investing" | "financing";

type CashFlowDirection = "inflow" | "outflow";

interface CashFlowItem {
  id: number;
  category: CashFlowCategory;
  subcategory: string;
  description: string;
  amount: number;
  direction: CashFlowDirection;
  date: string;
  account?: string;
  reference?: string;
}

interface CashFlowPeriod {
  period: string;
  operatingInflows: number;
  operatingOutflows: number;
  investingInflows: number;
  investingOutflows: number;
  financingInflows: number;
  financingOutflows: number;
  netOperating: number;
  netInvesting: number;
  netFinancing: number;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

// Mock Data
const mockCashFlowData: CashFlowItem[] = [
  // Operating Activities - Inflows
  {
    id: 1,
    category: "operating",
    subcategory: "Sales Revenue",
    description: "Customer payments - March 2026",
    amount: 12500000,
    direction: "inflow",
    date: "2026-03-01",
    reference: "INV-001",
  },
  {
    id: 2,
    category: "operating",
    subcategory: "Sales Revenue",
    description: "Customer payments - March 2026",
    amount: 8500000,
    direction: "inflow",
    date: "2026-03-05",
    reference: "INV-002",
  },
  {
    id: 3,
    category: "operating",
    subcategory: "Sales Revenue",
    description: "Customer payments - March 2026",
    amount: 3200000,
    direction: "inflow",
    date: "2026-03-10",
    reference: "INV-003",
  },
  {
    id: 4,
    category: "operating",
    subcategory: "Other Income",
    description: "Interest received",
    amount: 12500,
    direction: "inflow",
    date: "2026-03-15",
  },

  // Operating Activities - Outflows
  {
    id: 5,
    category: "operating",
    subcategory: "Supplies",
    description: "Office supplies purchase",
    amount: 250000,
    direction: "outflow",
    date: "2026-03-02",
  },
  {
    id: 6,
    category: "operating",
    subcategory: "Salaries",
    description: "March salaries payment",
    amount: 2500000,
    direction: "outflow",
    date: "2026-03-28",
  },
  {
    id: 7,
    category: "operating",
    subcategory: "Utilities",
    description: "Electricity bill",
    amount: 185000,
    direction: "outflow",
    date: "2026-03-15",
  },
  {
    id: 8,
    category: "operating",
    subcategory: "Rent",
    description: "Office rent",
    amount: 1200000,
    direction: "outflow",
    date: "2026-03-01",
  },
  {
    id: 9,
    category: "operating",
    subcategory: "Marketing",
    description: "Marketing campaign",
    amount: 500000,
    direction: "outflow",
    date: "2026-03-10",
  },
  {
    id: 10,
    category: "operating",
    subcategory: "Insurance",
    description: "Business insurance",
    amount: 300000,
    direction: "outflow",
    date: "2026-03-20",
  },

  // Investing Activities - Inflows
  {
    id: 11,
    category: "investing",
    subcategory: "Asset Sale",
    description: "Sale of old equipment",
    amount: 500000,
    direction: "inflow",
    date: "2026-03-12",
  },

  // Investing Activities - Outflows
  {
    id: 12,
    category: "investing",
    subcategory: "Equipment Purchase",
    description: "New laptops purchase",
    amount: 4500000,
    direction: "outflow",
    date: "2026-03-08",
  },
  {
    id: 13,
    category: "investing",
    subcategory: "Software",
    description: "Software licenses",
    amount: 2000000,
    direction: "outflow",
    date: "2026-03-15",
  },

  // Financing Activities - Inflows
  {
    id: 14,
    category: "financing",
    subcategory: "Bank Loan",
    description: "Loan disbursement",
    amount: 10000000,
    direction: "inflow",
    date: "2026-03-20",
  },
  {
    id: 15,
    category: "financing",
    subcategory: "Capital Injection",
    description: "Owner investment",
    amount: 5000000,
    direction: "inflow",
    date: "2026-03-01",
  },

  // Financing Activities - Outflows
  {
    id: 16,
    category: "financing",
    subcategory: "Loan Repayment",
    description: "Monthly loan repayment",
    amount: 500000,
    direction: "outflow",
    date: "2026-03-25",
  },
  {
    id: 17,
    category: "financing",
    subcategory: "Dividends",
    description: "Dividend payment",
    amount: 2000000,
    direction: "outflow",
    date: "2026-03-30",
  },
];

// Generate period data (monthly)
const generatePeriodData = (): CashFlowPeriod[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = 2026;

  return months.map((month, index) => {
    const operatingInflows = Math.random() * 15000000 + 5000000;
    const operatingOutflows = Math.random() * 10000000 + 3000000;
    const investingInflows = Math.random() * 2000000;
    const investingOutflows = Math.random() * 5000000 + 1000000;
    const financingInflows = index === 2 ? 15000000 : Math.random() * 5000000;
    const financingOutflows = Math.random() * 2000000 + 500000;

    const netOperating = operatingInflows - operatingOutflows;
    const netInvesting = investingInflows - investingOutflows;
    const netFinancing = financingInflows - financingOutflows;
    const netCashFlow = netOperating + netInvesting + netFinancing;

    return {
      period: `${month} ${currentYear}`,
      operatingInflows,
      operatingOutflows,
      investingInflows,
      investingOutflows,
      financingInflows,
      financingOutflows,
      netOperating,
      netInvesting,
      netFinancing,
      netCashFlow,
      beginningCash: 10000000 + netCashFlow * index,
      endingCash: 10000000 + netCashFlow * (index + 1),
    };
  });
};

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
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryIcon = (category: CashFlowCategory) => {
  switch (category) {
    case "operating":
      return <Activity className="h-4 w-4" />;
    case "investing":
      return <TrendingUp className="h-4 w-4" />;
    case "financing":
      return <CreditCard className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: CashFlowCategory) => {
  switch (category) {
    case "operating":
      return "text-blue-600 bg-blue-50";
    case "investing":
      return "text-purple-600 bg-purple-50";
    case "financing":
      return "text-green-600 bg-green-50";
  }
};

export default function CashFlowStatement() {
  const router = useRouter();

  // State
  const [cashFlowItems] = useState<CashFlowItem[]>(mockCashFlowData);
  const [periodData] = useState<CashFlowPeriod[]>(generatePeriodData);
  const [selectedPeriod, setSelectedPeriod] = useState("Mar 2026");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "2026-03-01",
    to: "2026-03-31",
  });
  const [activeTab, setActiveTab] = useState<
    "statement" | "analysis" | "trends"
  >("statement");
  const [selectedCategory, setSelectedCategory] = useState<
    CashFlowCategory | "all"
  >("all");

  // Filtered data for selected period
  const filteredData = useMemo(() => {
    let result = [...cashFlowItems];
    if (dateRange.from) {
      result = result.filter((item) => item.date >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((item) => item.date <= dateRange.to);
    }
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }
    return result;
  }, [cashFlowItems, dateRange, selectedCategory]);

  // Calculate totals
  const totals = useMemo(() => {
    const operatingInflows = filteredData
      .filter((i) => i.category === "operating" && i.direction === "inflow")
      .reduce((sum, i) => sum + i.amount, 0);
    const operatingOutflows = filteredData
      .filter((i) => i.category === "operating" && i.direction === "outflow")
      .reduce((sum, i) => sum + i.amount, 0);
    const investingInflows = filteredData
      .filter((i) => i.category === "investing" && i.direction === "inflow")
      .reduce((sum, i) => sum + i.amount, 0);
    const investingOutflows = filteredData
      .filter((i) => i.category === "investing" && i.direction === "outflow")
      .reduce((sum, i) => sum + i.amount, 0);
    const financingInflows = filteredData
      .filter((i) => i.category === "financing" && i.direction === "inflow")
      .reduce((sum, i) => sum + i.amount, 0);
    const financingOutflows = filteredData
      .filter((i) => i.category === "financing" && i.direction === "outflow")
      .reduce((sum, i) => sum + i.amount, 0);

    const netOperating = operatingInflows - operatingOutflows;
    const netInvesting = investingInflows - investingOutflows;
    const netFinancing = financingInflows - financingOutflows;
    const netCashFlow = netOperating + netInvesting + netFinancing;

    return {
      operatingInflows,
      operatingOutflows,
      investingInflows,
      investingOutflows,
      financingInflows,
      financingOutflows,
      netOperating,
      netInvesting,
      netFinancing,
      netCashFlow,
      beginningCash: 10000000,
      endingCash: 10000000 + netCashFlow,
    };
  }, [filteredData]);

  // Current period data for trends
  const currentPeriodData =
    periodData.find((p) => p.period === selectedPeriod) || periodData[2];

  // Chart data for analysis
  const categoryBreakdownData = [
    {
      name: "Operating Activities",
      value: Math.abs(totals.netOperating),
      color: "#3B82F6",
    },
    {
      name: "Investing Activities",
      value: Math.abs(totals.netInvesting),
      color: "#8B5CF6",
    },
    {
      name: "Financing Activities",
      value: Math.abs(totals.netFinancing),
      color: "#10B981",
    },
  ];

  const inflowOutflowData = [
    {
      name: "Operating",
      inflow: totals.operatingInflows,
      outflow: totals.operatingOutflows,
    },
    {
      name: "Investing",
      inflow: totals.investingInflows,
      outflow: totals.investingOutflows,
    },
    {
      name: "Financing",
      inflow: totals.financingInflows,
      outflow: totals.financingOutflows,
    },
  ];

  const monthlyTrendData = periodData.map((p) => ({
    month: p.period,
    operating: p.netOperating,
    investing: p.netInvesting,
    financing: p.netFinancing,
    netCashFlow: p.netCashFlow,
  }));

  const cashBalanceData = periodData.map((p) => ({
    month: p.period,
    beginning: p.beginningCash,
    ending: p.endingCash,
  }));

  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

  const handleExport = () => {
    const headers = [
      "Date",
      "Category",
      "Subcategory",
      "Description",
      "Amount",
      "Direction",
    ];
    const csvData = filteredData.map((item) => [
      formatDate(item.date),
      item.category,
      item.subcategory,
      item.description,
      item.amount.toString(),
      item.direction,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cash-flow-statement-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setDateRange({ from: "2026-03-01", to: "2026-03-31" });
    setSelectedCategory("all");
    setSelectedPeriod("Mar 2026");
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
              <DollarSign className="h-6 w-6" />
              Cash Flow Statement
            </h1>
            <p className="text-muted-foreground mt-1">
              {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-[140px]"
            />
            <span>to</span>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-[140px]"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v as any)}
          >
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="operating">Operating Activities</SelectItem>
              <SelectItem value="investing">Investing Activities</SelectItem>
              <SelectItem value="financing">Financing Activities</SelectItem>
            </SelectContent>
          </Select>
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
                <p className="text-sm text-muted-foreground">
                  Operating Cash Flow
                </p>
                <p
                  className={`text-2xl font-bold ${totals.netOperating >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(totals.netOperating))}
                  {totals.netOperating >= 0 ? " inflow" : " outflow"}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Investing Cash Flow
                </p>
                <p
                  className={`text-2xl font-bold ${totals.netInvesting >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(totals.netInvesting))}
                  {totals.netInvesting >= 0 ? " inflow" : " outflow"}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Financing Cash Flow
                </p>
                <p
                  className={`text-2xl font-bold ${totals.netFinancing >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(totals.netFinancing))}
                  {totals.netFinancing >= 0 ? " inflow" : " outflow"}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                <p
                  className={`text-2xl font-bold ${totals.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(totals.netCashFlow))}
                  {totals.netCashFlow >= 0 ? " inflow" : " outflow"}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
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
        <TabsList className="grid w-full grid-cols-3 print:hidden">
          <TabsTrigger value="statement">Cash Flow Statement</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="statement" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>
                Detailed breakdown of cash movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Operating Activities */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <div className="p-1.5 rounded-lg bg-blue-100">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Operating Activities
                    </h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Inflow</TableHead>
                        <TableHead className="text-right">Outflow</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData
                        .filter((i) => i.category === "operating")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {item.reference || "-"}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {item.direction === "inflow"
                                ? formatCurrency(item.amount)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {item.direction === "outflow"
                                ? formatCurrency(item.amount)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow className="border-t-2 font-bold">
                        <TableCell colSpan={3} className="text-right">
                          Total Operating Activities:
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(totals.operatingInflows)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(totals.operatingOutflows)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} className="text-right">
                          <span className="font-bold">
                            Net Operating Cash Flow:{" "}
                          </span>
                          <span
                            className={
                              totals.netOperating >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatCurrency(Math.abs(totals.netOperating))}{" "}
                            {totals.netOperating >= 0 ? "inflow" : "outflow"}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Investing Activities */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <div className="p-1.5 rounded-lg bg-purple-100">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Investing Activities
                    </h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Inflow</TableHead>
                        <TableHead className="text-right">Outflow</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData
                        .filter((i) => i.category === "investing")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {item.reference || "-"}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {item.direction === "inflow"
                                ? formatCurrency(item.amount)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {item.direction === "outflow"
                                ? formatCurrency(item.amount)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow className="border-t-2 font-bold">
                        <TableCell colSpan={3} className="text-right">
                          Total Investing Activities:
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(totals.investingInflows)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(totals.investingOutflows)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} className="text-right">
                          <span className="font-bold">
                            Net Investing Cash Flow:{" "}
                          </span>
                          <span
                            className={
                              totals.netInvesting >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatCurrency(Math.abs(totals.netInvesting))}{" "}
                            {totals.netInvesting >= 0 ? "inflow" : "outflow"}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Financing Activities */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <div className="p-1.5 rounded-lg bg-green-100">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Financing Activities
                    </h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Inflow</TableHead>
                        <TableHead className="text-right">Outflow</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData
                        .filter((i) => i.category === "financing")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {item.reference || "-"}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {item.direction === "inflow"
                                ? formatCurrency(item.amount)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {item.direction === "outflow"
                                ? formatCurrency(item.amount)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow className="border-t-2 font-bold">
                        <TableCell colSpan={3} className="text-right">
                          Total Financing Activities:
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(totals.financingInflows)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(totals.financingOutflows)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} className="text-right">
                          <span className="font-bold">
                            Net Financing Cash Flow:{" "}
                          </span>
                          <span
                            className={
                              totals.netFinancing >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatCurrency(Math.abs(totals.netFinancing))}{" "}
                            {totals.netFinancing >= 0 ? "inflow" : "outflow"}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-semibold">
                        Net Cash from Operating Activities
                      </span>
                      <span
                        className={`font-bold ${totals.netOperating >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(Math.abs(totals.netOperating))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-semibold">
                        Net Cash from Investing Activities
                      </span>
                      <span
                        className={`font-bold ${totals.netInvesting >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(Math.abs(totals.netInvesting))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-semibold">
                        Net Cash from Financing Activities
                      </span>
                      <span
                        className={`font-bold ${totals.netFinancing >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(Math.abs(totals.netFinancing))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <span className="font-bold text-lg">
                        Net Increase/Decrease in Cash
                      </span>
                      <span
                        className={`font-bold text-lg ${totals.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(Math.abs(totals.netCashFlow))}{" "}
                        {totals.netCashFlow >= 0 ? "Increase" : "Decrease"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-semibold">
                        Cash at Beginning of Period
                      </span>
                      <span className="font-bold">
                        {formatCurrency(totals.beginningCash)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-bold text-lg">
                        Cash at End of Period
                      </span>
                      <span className="font-bold text-lg text-green-600">
                        {formatCurrency(totals.endingCash)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash Flow Composition</CardTitle>
                <CardDescription>
                  Breakdown by activity category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={categoryBreakdownData}
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
                      {categoryBreakdownData.map((entry, index) => (
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

            {/* Inflow vs Outflow */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inflows vs Outflows</CardTitle>
                <CardDescription>
                  Comparison by activity category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inflowOutflowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="inflow" fill="#10B981" name="Inflows" />
                    <Bar dataKey="outflow" fill="#EF4444" name="Outflows" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Operating Cash Flow Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Operating Cash Flow Analysis
                </CardTitle>
                <CardDescription>Key operating metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Operating Cash Flow Margin
                      </p>
                      <p className="text-xs">
                        Operating Cash Flow / Total Revenue
                      </p>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {(
                        (totals.netOperating / totals.operatingInflows) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cash Conversion Rate
                      </p>
                      <p className="text-xs">
                        (Operating Cash Flow / Net Income)
                      </p>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {(
                        (totals.netOperating /
                          (totals.operatingInflows * 0.3)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Free Cash Flow
                      </p>
                      <p className="text-xs">Operating Cash Flow - Capex</p>
                    </div>
                    <p
                      className={`text-xl font-bold ${totals.netOperating - totals.investingOutflows >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(
                        Math.abs(
                          totals.netOperating - totals.investingOutflows,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Ratios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Financial Ratios</CardTitle>
                <CardDescription>Cash flow based ratios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Current Ratio</span>
                    <span className="text-lg font-bold">
                      {(
                        (totals.endingCash / (totals.operatingOutflows / 3)) *
                        100
                      ).toFixed(2)}
                      x
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      Cash Flow to Debt Ratio
                    </span>
                    <span className="text-lg font-bold">
                      {(
                        (totals.netOperating / totals.financingOutflows) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      Cash Flow Coverage Ratio
                    </span>
                    <span className="text-lg font-bold">
                      {(
                        (totals.netOperating / totals.operatingOutflows) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Monthly Cash Flow Trend */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Monthly Cash Flow Trend
                    </CardTitle>
                    <CardDescription>Net cash flow by month</CardDescription>
                  </div>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodData.map((p) => (
                        <SelectItem key={p.period} value={p.period}>
                          {p.period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ReLineChart data={monthlyTrendData}>
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
                    <Line
                      type="monotone"
                      dataKey="operating"
                      stroke="#3B82F6"
                      name="Operating"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="investing"
                      stroke="#8B5CF6"
                      name="Investing"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="financing"
                      stroke="#10B981"
                      name="Financing"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="netCashFlow"
                      stroke="#EF4444"
                      name="Net Cash Flow"
                      strokeWidth={3}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cash Balance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash Balance Trend</CardTitle>
                <CardDescription>
                  Beginning and ending cash balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={cashBalanceData}>
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
                    <Area
                      type="monotone"
                      dataKey="beginning"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="Beginning Balance"
                    />
                    <Area
                      type="monotone"
                      dataKey="ending"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      name="Ending Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Current Period Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Current Period Details - {selectedPeriod}
                </CardTitle>
                <CardDescription>
                  Detailed breakdown for selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Operating Cash Flow
                    </p>
                    <p
                      className={`text-2xl font-bold ${currentPeriodData?.netOperating >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(
                        Math.abs(currentPeriodData?.netOperating || 0),
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Investing Cash Flow
                    </p>
                    <p
                      className={`text-2xl font-bold ${currentPeriodData?.netInvesting >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(
                        Math.abs(currentPeriodData?.netInvesting || 0),
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Financing Cash Flow
                    </p>
                    <p
                      className={`text-2xl font-bold ${currentPeriodData?.netFinancing >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(
                        Math.abs(currentPeriodData?.netFinancing || 0),
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Net Cash Flow
                      </p>
                      <p
                        className={`text-3xl font-bold ${(currentPeriodData?.netCashFlow || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(
                          Math.abs(currentPeriodData?.netCashFlow || 0),
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Period Change
                      </p>
                      <p
                        className={`text-xl font-bold ${(currentPeriodData?.netCashFlow || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {(currentPeriodData?.netCashFlow || 0) >= 0
                          ? "Increase"
                          : "Decrease"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
