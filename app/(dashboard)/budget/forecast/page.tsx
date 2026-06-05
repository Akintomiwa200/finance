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
import { Slider } from "@/src/components/ui/slider";
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
  Target,
  LineChart,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Save,
  Send,
  Settings,
  Sliders,
  Brain,
  Zap,
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
  ComposedChart,
  Cell,
} from "recharts";

// Types
type ForecastPeriod = "quarterly" | "annually";
type ForecastScenario = "optimistic" | "pessimistic" | "most_likely";

interface ForecastAssumption {
  id: number;
  name: string;
  currentValue: number;
  forecastValue: number;
  growthRate: number;
  category: string;
}

interface ForecastData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
}

// Mock Historical Data
const historicalData: ForecastData[] = [
  {
    period: "Q1 2025",
    revenue: 12500000,
    expenses: 8500000,
    profit: 4000000,
    cashFlow: 3500000,
  },
  {
    period: "Q2 2025",
    revenue: 13800000,
    expenses: 9200000,
    profit: 4600000,
    cashFlow: 4200000,
  },
  {
    period: "Q3 2025",
    revenue: 14200000,
    expenses: 9400000,
    profit: 4800000,
    cashFlow: 4500000,
  },
  {
    period: "Q4 2025",
    revenue: 15600000,
    expenses: 10100000,
    profit: 5500000,
    cashFlow: 5100000,
  },
  {
    period: "Q1 2026",
    revenue: 14800000,
    expenses: 9800000,
    profit: 5000000,
    cashFlow: 4700000,
  },
  {
    period: "Q2 2026",
    revenue: 15200000,
    expenses: 10000000,
    profit: 5200000,
    cashFlow: 4900000,
  },
  {
    period: "Q3 2026",
    revenue: 15800000,
    expenses: 10300000,
    profit: 5500000,
    cashFlow: 5200000,
  },
  {
    period: "Q4 2026",
    revenue: 16500000,
    expenses: 10700000,
    profit: 5800000,
    cashFlow: 5500000,
  },
];

// Forecast Assumptions
const mockAssumptions: ForecastAssumption[] = [
  {
    id: 1,
    name: "Revenue Growth Rate",
    currentValue: 8,
    forecastValue: 10,
    growthRate: 25,
    category: "Revenue",
  },
  {
    id: 2,
    name: "Cost of Sales %",
    currentValue: 65,
    forecastValue: 63,
    growthRate: -3.1,
    category: "Costs",
  },
  {
    id: 3,
    name: "Operating Expense Growth",
    currentValue: 5,
    forecastValue: 6,
    growthRate: 20,
    category: "Expenses",
  },
  {
    id: 4,
    name: "Marketing Budget",
    currentValue: 2000000,
    forecastValue: 2200000,
    growthRate: 10,
    category: "Expenses",
  },
  {
    id: 5,
    name: "R&D Investment",
    currentValue: 1500000,
    forecastValue: 1800000,
    growthRate: 20,
    category: "Expenses",
  },
  {
    id: 6,
    name: "Salary Increase",
    currentValue: 8,
    forecastValue: 10,
    growthRate: 25,
    category: "Expenses",
  },
  {
    id: 7,
    name: "Raw Material Cost",
    currentValue: 40,
    forecastValue: 38,
    growthRate: -5,
    category: "Costs",
  },
  {
    id: 8,
    name: "Exchange Rate Impact",
    currentValue: 0,
    forecastValue: 2,
    growthRate: 0,
    category: "Other",
  },
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

const generateForecast = (
  assumptions: ForecastAssumption[],
  periods: number,
  scenario: ForecastScenario,
): ForecastData[] => {
  const lastHistorical = historicalData[historicalData.length - 1];
  const forecast: ForecastData[] = [];

  let revenueGrowth =
    assumptions.find((a) => a.name === "Revenue Growth Rate")?.forecastValue ||
    8;
  let expenseGrowth =
    assumptions.find((a) => a.name === "Operating Expense Growth")
      ?.forecastValue || 5;

  // Adjust based on scenario
  if (scenario === "optimistic") {
    revenueGrowth *= 1.3;
    expenseGrowth *= 0.8;
  } else if (scenario === "pessimistic") {
    revenueGrowth *= 0.7;
    expenseGrowth *= 1.2;
  }

  let currentRevenue = lastHistorical.revenue;
  let currentExpenses = lastHistorical.expenses;

  for (let i = 1; i <= periods; i++) {
    const quarter =
      (lastHistorical.period.split(" ")[1] === "2026" ? 4 : 0) + i;
    const year = 2026 + Math.floor((quarter - 1) / 4);
    const qNum = ((quarter - 1) % 4) + 1;

    currentRevenue = currentRevenue * (1 + revenueGrowth / 100);
    currentExpenses = currentExpenses * (1 + expenseGrowth / 100);

    const profit = currentRevenue - currentExpenses;
    const cashFlow = profit * 0.9; // Simple cash flow assumption

    forecast.push({
      period: `Q${qNum} ${year}`,
      revenue: currentRevenue,
      expenses: currentExpenses,
      profit,
      cashFlow,
    });
  }

  return forecast;
};

export default function BudgetForecast() {
  const router = useRouter();

  // State
  const [assumptions, setAssumptions] =
    useState<ForecastAssumption[]>(mockAssumptions);
  const [forecastPeriods, setForecastPeriods] = useState(8); // 2 years
  const [scenario, setScenario] = useState<ForecastScenario>("most_likely");
  const [showConfidence, setShowConfidence] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Q4 2026");
  const [isAssumptionModalOpen, setIsAssumptionModalOpen] = useState(false);
  const [editingAssumption, setEditingAssumption] =
    useState<ForecastAssumption | null>(null);
  const [activeTab, setActiveTab] = useState<
    "forecast" | "assumptions" | "scenarios"
  >("forecast");

  // Generate forecast data
  const forecastData = useMemo(() => {
    return generateForecast(assumptions, forecastPeriods, scenario);
  }, [assumptions, forecastPeriods, scenario]);

  // Combine historical and forecast for chart
  const allData = useMemo(() => {
    return [...historicalData, ...forecastData];
  }, [forecastData]);

  // Summary statistics
  const summary = useMemo(() => {
    const lastHistorical = historicalData[historicalData.length - 1];
    const lastForecast = forecastData[forecastData.length - 1];

    const revenueGrowth =
      ((lastForecast.revenue - lastHistorical.revenue) /
        lastHistorical.revenue) *
      100;
    const profitGrowth =
      ((lastForecast.profit - lastHistorical.profit) / lastHistorical.profit) *
      100;

    const totalForecastRevenue = forecastData.reduce(
      (sum, f) => sum + f.revenue,
      0,
    );
    const totalForecastProfit = forecastData.reduce(
      (sum, f) => sum + f.profit,
      0,
    );
    const avgProfitMargin = (totalForecastProfit / totalForecastRevenue) * 100;

    return {
      revenueGrowth,
      profitGrowth,
      totalForecastRevenue,
      totalForecastProfit,
      avgProfitMargin,
      endingRevenue: lastForecast.revenue,
      endingProfit: lastForecast.profit,
    };
  }, [forecastData]);

  // Handle assumption update
  const handleUpdateAssumption = (
    id: number,
    field: keyof ForecastAssumption,
    value: number,
  ) => {
    setAssumptions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const handleEditAssumption = (assumption: ForecastAssumption) => {
    setEditingAssumption(assumption);
    setIsAssumptionModalOpen(true);
  };

  const handleSaveAssumption = () => {
    if (editingAssumption) {
      setAssumptions((prev) =>
        prev.map((a) =>
          a.id === editingAssumption.id ? editingAssumption : a,
        ),
      );
      setIsAssumptionModalOpen(false);
      setEditingAssumption(null);
    }
  };

  const handleResetAssumptions = () => {
    setAssumptions(mockAssumptions);
    setScenario("most_likely");
  };

  const handleExport = () => {
    const headers = ["Period", "Revenue", "Expenses", "Profit", "Cash Flow"];
    const csvData = forecastData.map((f) => [
      f.period,
      f.revenue.toString(),
      f.expenses.toString(),
      f.profit.toString(),
      f.cashFlow.toString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-forecast-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    handleResetAssumptions();
  };

  // Get scenario color
  const getScenarioColor = () => {
    switch (scenario) {
      case "optimistic":
        return "text-green-600 bg-green-50";
      case "pessimistic":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
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
              <Brain className="h-6 w-6" />
              Budget Forecasting
            </h1>
            <p className="text-muted-foreground mt-1">
              Financial projections and scenario planning
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Select
              value={forecastPeriods.toString()}
              onValueChange={(v) => setForecastPeriods(parseInt(v))}
            >
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 Quarters (1 Year)</SelectItem>
                <SelectItem value="8">8 Quarters (2 Years)</SelectItem>
                <SelectItem value="12">12 Quarters (3 Years)</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={scenario}
               onValueChange={(v) => setScenario(v as ForecastScenario)}
            >
              <SelectTrigger className="w-[140px]">
                <Sliders className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="optimistic">Optimistic</SelectItem>
                <SelectItem value="most_likely">Most Likely</SelectItem>
                <SelectItem value="pessimistic">Pessimistic</SelectItem>
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
            Reset
          </Button>
        </div>
      </div>

      {/* Scenario Badge */}
      <div className="flex justify-center">
        <Badge className={`${getScenarioColor()} px-4 py-2 text-lg`}>
          {scenario === "optimistic" && "🚀 Optimistic Scenario"}
          {scenario === "most_likely" && "📊 Most Likely Scenario"}
          {scenario === "pessimistic" && "⚠️ Pessimistic Scenario"}
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Growth</p>
                <p
                  className={`text-2xl font-bold ${summary.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(summary.revenueGrowth)}
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
                <p className="text-sm text-muted-foreground">Profit Growth</p>
                <p
                  className={`text-2xl font-bold ${summary.profitGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(summary.profitGrowth)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Forecast Revenue
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summary.totalForecastRevenue)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Profit Margin
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {summary.avgProfitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <PieChart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue & Profit Forecast</CardTitle>
          <CardDescription>
            Historical performance and future projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={allData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="profit"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Profit"
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Historical Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-300 rounded" />
              <span>Forecast Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Profit Line</span>
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
          <TabsTrigger value="forecast">Forecast Details</TabsTrigger>
          <TabsTrigger value="assumptions">Key Assumptions</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Forecast</CardTitle>
              <CardDescription>Quarterly projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Expenses</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                      <TableHead className="text-right">
                        Profit Margin
                      </TableHead>
                      <TableHead className="text-right">Cash Flow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecastData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {item.period}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(item.revenue)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(item.expenses)}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(item.profit)}
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.profit / item.revenue) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right text-purple-600">
                          {formatCurrency(item.cashFlow)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell>Total / Average</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalForecastRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          forecastData.reduce((s, f) => s + f.expenses, 0),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalForecastProfit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {summary.avgProfitMargin.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          forecastData.reduce((s, f) => s + f.cashFlow, 0),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cash Flow Projection</CardTitle>
              <CardDescription>
                Expected cash flow over forecast period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
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
                    dataKey="cashFlow"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    name="Cash Flow"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assumptions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Forecast Assumptions
                  </CardTitle>
                  <CardDescription>Key drivers and variables</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssumptionModalOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Adjust Assumptions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assumptions.map((assumption) => (
                  <div key={assumption.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{assumption.name}</span>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">
                          Current:{" "}
                          {assumption.name.includes("Growth")
                            ? formatPercentage(assumption.currentValue)
                            : formatCurrency(assumption.currentValue)}
                        </span>
                        <span
                          className={`font-medium ${assumption.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          Forecast:{" "}
                          {assumption.name.includes("Growth")
                            ? formatPercentage(assumption.forecastValue)
                            : formatCurrency(assumption.forecastValue)}
                          <span className="text-xs ml-1">
                            ({assumption.growthRate >= 0 ? "+" : ""}
                            {assumption.growthRate.toFixed(0)}%)
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Current</span>
                        <span>Forecast</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (assumption.forecastValue /
                                (assumption.name.includes("Growth")
                                  ? 30
                                  : Math.max(
                                      assumption.currentValue,
                                      assumption.forecastValue,
                                    ))) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Optimistic Scenario */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Optimistic Scenario
                </CardTitle>
                <CardDescription>Best case projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Revenue Growth
                    </span>
                    <span className="font-bold text-green-600">+13%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Expense Growth
                    </span>
                    <span className="font-bold text-green-600">+4.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <span className="font-bold text-green-600">28.5%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">2-Year Revenue</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(385000000)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Most Likely Scenario */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Most Likely Scenario
                </CardTitle>
                <CardDescription>Baseline projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Revenue Growth
                    </span>
                    <span className="font-bold text-blue-600">+10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Expense Growth
                    </span>
                    <span className="font-bold text-blue-600">+6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <span className="font-bold text-blue-600">24.8%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">2-Year Revenue</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(352000000)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pessimistic Scenario */}
            <Card className="border-red-200 bg-red-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Pessimistic Scenario
                </CardTitle>
                <CardDescription>Worst case projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Revenue Growth
                    </span>
                    <span className="font-bold text-red-600">+7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Expense Growth
                    </span>
                    <span className="font-bold text-red-600">+7.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <span className="font-bold text-red-600">21.2%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">2-Year Revenue</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(328000000)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scenario Comparison</CardTitle>
              <CardDescription>
                Revenue projections under different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      scenario: "Optimistic",
                      revenue: 385000000,
                      color: "#10B981",
                    },
                    {
                      scenario: "Most Likely",
                      revenue: 352000000,
                      color: "#3B82F6",
                    },
                    {
                      scenario: "Pessimistic",
                      revenue: 328000000,
                      color: "#EF4444",
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" name="2-Year Revenue">
                    {[
                      <Cell key="optimistic" fill="#10B981" />,
                      <Cell key="most_likely" fill="#3B82F6" />,
                      <Cell key="pessimistic" fill="#EF4444" />,
                    ]}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assumption Edit Modal */}
      <Dialog
        open={isAssumptionModalOpen}
        onOpenChange={setIsAssumptionModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Assumptions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {assumptions.map((assumption) => (
              <div key={assumption.id} className="space-y-2">
                <Label>{assumption.name}</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current
                    </p>
                    <Input
                      type="number"
                      value={assumption.currentValue}
                      onChange={(e) =>
                        handleUpdateAssumption(
                          assumption.id,
                          "currentValue",
                          parseFloat(e.target.value),
                        )
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Forecast
                    </p>
                    <Input
                      type="number"
                      value={assumption.forecastValue}
                      onChange={(e) =>
                        handleUpdateAssumption(
                          assumption.id,
                          "forecastValue",
                          parseFloat(e.target.value),
                        )
                      }
                      className="text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAssumptionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAssumptionModalOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
