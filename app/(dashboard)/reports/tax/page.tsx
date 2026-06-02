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
  ArrowUpDown,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Receipt,
  Shield,
  Scale,
  Landmark,
  Calculator,
  Users,
} from "lucide-react";

// Types
interface TaxPeriod {
  id: number;
  period: string;
  type: "monthly" | "quarterly" | "annual";
  startDate: string;
  endDate: string;
  dueDate: string;
  filingDate?: string;
  paye: number;
  vat: number;
  withholdingTax: number;
  pensionEmployee: number;
  pensionEmployer: number;
  otherTaxes: number;
  totalTax: number;
  status: "draft" | "filed" | "paid" | "overdue" | "amended";
  filedBy?: string;
  receiptNumber?: string;
  notes?: string;
}

interface TaxSummary {
  totalPayeMTD: number;
  totalVatMTD: number;
  totalWithholdingMTD: number;
  totalTaxYTD: number;
  totalPayeYTD: number;
  totalVatYTD: number;
  totalWithholdingYTD: number;
  totalPensionYTD: number;
  periods: TaxPeriod[];
  monthlyTrend: {
    month: string;
    paye: number;
    vat: number;
    withholding: number;
    total: number;
  }[];
  taxBreakdown: { name: string; value: number; color: string }[];
  lastUpdated: string;
}

// Initial Data
const initialData: TaxSummary = {
  totalPayeMTD: 3500000,
  totalVatMTD: 850000,
  totalWithholdingMTD: 420000,
  totalTaxYTD: 26100000,
  totalPayeYTD: 20400000,
  totalVatYTD: 4800000,
  totalWithholdingYTD: 2380000,
  totalPensionYTD: 6800000,
  lastUpdated: "2026-06-02",
  periods: [
    {
      id: 1,
      period: "May 2026",
      type: "monthly",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      dueDate: "2026-06-10",
      filingDate: "2026-06-05",
      paye: 3500000,
      vat: 850000,
      withholdingTax: 420000,
      pensionEmployee: 1200000,
      pensionEmployer: 1200000,
      otherTaxes: 0,
      totalTax: 4770000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2026-05-001",
    },
    {
      id: 2,
      period: "April 2026",
      type: "monthly",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      dueDate: "2026-05-10",
      filingDate: "2026-05-08",
      paye: 3400000,
      vat: 780000,
      withholdingTax: 380000,
      pensionEmployee: 1150000,
      pensionEmployer: 1150000,
      otherTaxes: 0,
      totalTax: 4560000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2026-04-001",
    },
    {
      id: 3,
      period: "March 2026",
      type: "monthly",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      dueDate: "2026-04-10",
      filingDate: "2026-04-07",
      paye: 3600000,
      vat: 820000,
      withholdingTax: 400000,
      pensionEmployee: 1180000,
      pensionEmployer: 1180000,
      otherTaxes: 50000,
      totalTax: 4820000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2026-03-001",
    },
    {
      id: 4,
      period: "February 2026",
      type: "monthly",
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      dueDate: "2026-03-10",
      filingDate: "2026-03-09",
      paye: 3300000,
      vat: 750000,
      withholdingTax: 360000,
      pensionEmployee: 1100000,
      pensionEmployer: 1100000,
      otherTaxes: 0,
      totalTax: 4410000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2026-02-001",
    },
    {
      id: 5,
      period: "January 2026",
      type: "monthly",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      dueDate: "2026-02-10",
      filingDate: "2026-02-05",
      paye: 3200000,
      vat: 720000,
      withholdingTax: 340000,
      pensionEmployee: 1050000,
      pensionEmployer: 1050000,
      otherTaxes: 0,
      totalTax: 4260000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2026-01-001",
    },
    {
      id: 6,
      period: "Q1 2026",
      type: "quarterly",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      dueDate: "2026-04-30",
      filingDate: "2026-04-15",
      paye: 10100000,
      vat: 2290000,
      withholdingTax: 1100000,
      pensionEmployee: 3330000,
      pensionEmployer: 3330000,
      otherTaxes: 50000,
      totalTax: 13490000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2026-Q1-001",
    },
    {
      id: 7,
      period: "Q4 2025",
      type: "quarterly",
      startDate: "2025-10-01",
      endDate: "2025-12-31",
      dueDate: "2026-01-31",
      filingDate: "2026-01-25",
      paye: 9800000,
      vat: 2150000,
      withholdingTax: 1050000,
      pensionEmployee: 3200000,
      pensionEmployer: 3200000,
      otherTaxes: 0,
      totalTax: 13000000,
      status: "filed",
      filedBy: "Jane Manager",
      receiptNumber: "TAX-2025-Q4-001",
    },
    {
      id: 8,
      period: "June 2026",
      type: "monthly",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      dueDate: "2026-07-10",
      paye: 3600000,
      vat: 880000,
      withholdingTax: 430000,
      pensionEmployee: 1220000,
      pensionEmployer: 1220000,
      otherTaxes: 0,
      totalTax: 4910000,
      status: "draft",
      notes: "Pending payroll finalization for June",
    },
  ],
  monthlyTrend: [
    {
      month: "Jan",
      paye: 3200000,
      vat: 720000,
      withholding: 340000,
      total: 4260000,
    },
    {
      month: "Feb",
      paye: 3300000,
      vat: 750000,
      withholding: 360000,
      total: 4410000,
    },
    {
      month: "Mar",
      paye: 3600000,
      vat: 820000,
      withholding: 400000,
      total: 4820000,
    },
    {
      month: "Apr",
      paye: 3400000,
      vat: 780000,
      withholding: 380000,
      total: 4560000,
    },
    {
      month: "May",
      paye: 3500000,
      vat: 850000,
      withholding: 420000,
      total: 4770000,
    },
    {
      month: "Jun",
      paye: 3600000,
      vat: 880000,
      withholding: 430000,
      total: 4910000,
    },
  ],
  taxBreakdown: [
    { name: "PAYE", value: 20400000, color: "#3B82F6" },
    { name: "VAT", value: 4800000, color: "#10B981" },
    { name: "Withholding Tax", value: 2380000, color: "#F59E0B" },
    { name: "Pension (Employee)", value: 3400000, color: "#8B5CF6" },
    { name: "Pension (Employer)", value: 3400000, color: "#EC4899" },
    { name: "Other Taxes", value: 50000, color: "#6B7280" },
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
];

export default function TaxReportsPage() {
  // State
  const [data] = useState<TaxSummary>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TaxPeriod;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter periods
  const filteredPeriods = useMemo(() => {
    let result = [...data.periods];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.period.toLowerCase().includes(query) ||
          (p.receiptNumber && p.receiptNumber.toLowerCase().includes(query)) ||
          (p.filedBy && p.filedBy.toLowerCase().includes(query)) ||
          (p.notes && p.notes.toLowerCase().includes(query)),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((p) => p.type === typeFilter);
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

    // Default sort by end date descending
    result.sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    );

    return result;
  }, [data.periods, searchQuery, statusFilter, typeFilter, sortConfig]);

  const handleSort = (key: keyof TaxPeriod) => {
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
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
    return `₦${amount}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: TaxPeriod["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "filed":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Filed
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      case "amended":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Amended
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: TaxPeriod["type"]) => {
    switch (type) {
      case "monthly":
        return (
          <Badge variant="outline" className="text-xs">
            Monthly
          </Badge>
        );
      case "quarterly":
        return (
          <Badge variant="outline" className="text-xs bg-purple-50">
            Quarterly
          </Badge>
        );
      case "annual":
        return (
          <Badge variant="outline" className="text-xs bg-blue-50">
            Annual
          </Badge>
        );
    }
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
            Tax Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            PAYE, VAT, and other tax obligation summaries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Tax Summary
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PAYE (MTD)</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalPayeMTD)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pay As You Earn
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VAT (MTD)</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalVatMTD)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Value Added Tax
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Receipt className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Withholding Tax (MTD)
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalWithholdingMTD)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  WHT deductions
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Scale className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Total Tax</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalTaxYTD)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All tax obligations
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Landmark className="h-5 w-5 text-purple-600" />
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
          <TabsTrigger value="periods">
            <Calendar className="h-4 w-4 mr-2" />
            Tax Periods
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="pension">
            <Shield className="h-4 w-4 mr-2" />
            Pension
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Tax Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Tax Trend</CardTitle>
                <CardDescription>
                  Tax obligations over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
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
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="paye"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="PAYE"
                    />
                    <Area
                      type="monotone"
                      dataKey="vat"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="VAT"
                    />
                    <Area
                      type="monotone"
                      dataKey="withholding"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                      name="Withholding"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tax Composition Pie */}
            <Card>
              <CardHeader>
                <CardTitle>YTD Tax Composition</CardTitle>
                <CardDescription>
                  Distribution of tax types year-to-date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.taxBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: any) =>
                        `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {data.taxBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
          </div>

          {/* Tax Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      Total PAYE (YTD)
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(data.totalPayeYTD)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      Total VAT (YTD)
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(data.totalVatYTD)}
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">
                      Total WHT (YTD)
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {formatCurrency(data.totalWithholdingYTD)}
                    </p>
                  </div>
                  <Scale className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">
                      Total Pension (YTD)
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatCurrency(data.totalPensionYTD)}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tax Periods Tab */}
        <TabsContent value="periods" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Tax Contributions</CardTitle>
                  <CardDescription>
                    Detailed tax filings by period
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search periods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="filed">Filed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
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
                      <TableHead>Period</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>PAYE</TableHead>
                      <TableHead>VAT</TableHead>
                      <TableHead>Withholding</TableHead>
                      <TableHead>Other</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("totalTax")}
                        >
                          Total
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt #</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPeriods.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No tax periods found
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPeriods.map((period) => (
                        <TableRow
                          key={period.id}
                          className={
                            period.status === "overdue"
                              ? "bg-red-50/30"
                              : period.status === "draft"
                                ? "bg-gray-50/50"
                                : ""
                          }
                        >
                          <TableCell>
                            <span className="font-medium">{period.period}</span>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(period.startDate)} -{" "}
                              {formatDate(period.endDate)}
                            </p>
                          </TableCell>
                          <TableCell>{getTypeBadge(period.type)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">
                                {formatDate(period.dueDate)}
                              </p>
                              {period.filingDate && (
                                <p className="text-xs text-muted-foreground">
                                  Filed: {formatDate(period.filingDate)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(period.paye)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(period.vat)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(period.withholdingTax)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(period.otherTaxes)}
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(period.totalTax)}
                          </TableCell>
                          <TableCell>{getStatusBadge(period.status)}</TableCell>
                          <TableCell>
                            {period.receiptNumber ? (
                              <span className="font-mono text-xs">
                                {period.receiptNumber}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                -
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Footer */}
              <div className="flex justify-end gap-6 mt-4 pt-4 border-t text-sm">
                <div>
                  <span className="text-muted-foreground">Total PAYE: </span>
                  <span className="font-bold">
                    {formatCurrency(
                      filteredPeriods.reduce((s, p) => s + p.paye, 0),
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total VAT: </span>
                  <span className="font-bold">
                    {formatCurrency(
                      filteredPeriods.reduce((s, p) => s + p.vat, 0),
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total WHT: </span>
                  <span className="font-bold">
                    {formatCurrency(
                      filteredPeriods.reduce((s, p) => s + p.withholdingTax, 0),
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Grand Total: </span>
                  <span className="font-bold">
                    {formatCurrency(
                      filteredPeriods.reduce((s, p) => s + p.totalTax, 0),
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tax Type Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Type Comparison</CardTitle>
                <CardDescription>Monthly breakdown by tax type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.monthlyTrend}>
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
                    <Legend />
                    <Bar
                      dataKey="paye"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      name="PAYE"
                    />
                    <Bar
                      dataKey="vat"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      name="VAT"
                    />
                    <Bar
                      dataKey="withholding"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                      name="Withholding"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tax Breakdown List */}
            <Card>
              <CardHeader>
                <CardTitle>YTD Tax Breakdown</CardTitle>
                <CardDescription>
                  Detailed year-to-date tax summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.taxBreakdown.map((item, index) => {
                    const percentage =
                      data.totalTaxYTD > 0
                        ? ((item.value / data.totalTaxYTD) * 100).toFixed(1)
                        : "0";
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-sm">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-bold">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        <Progress
                          value={parseFloat(percentage)}
                          className="h-2"
                          indicatorClassName={`bg-[${item.color}]`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{percentage}% of total</span>
                          <span>{formatCurrency(item.value)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t flex justify-between font-bold">
                    <span>Total Tax Obligation</span>
                    <span>{formatCurrency(data.totalTaxYTD)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pension Tab */}
        <TabsContent value="pension" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pension Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Pension Contributions</CardTitle>
                <CardDescription>
                  Employee and employer pension contributions by period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={data.periods
                      .filter((p) => p.pensionEmployee > 0)
                      .slice(0, 6)
                      .reverse()}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(v) => formatCompactCurrency(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="pensionEmployee"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                      name="Employee Contribution"
                    />
                    <Bar
                      dataKey="pensionEmployer"
                      fill="#EC4899"
                      radius={[4, 4, 0, 0]}
                      name="Employer Contribution"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pension Period Details */}
            <Card>
              <CardHeader>
                <CardTitle>Pension Period Details</CardTitle>
                <CardDescription>
                  Monthly pension contribution breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.periods
                      .filter((p) => p.pensionEmployee > 0)
                      .slice(0, 6)
                      .map((period) => (
                        <TableRow key={period.id}>
                          <TableCell className="font-medium text-sm">
                            {period.period}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(period.pensionEmployee)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(period.pensionEmployer)}
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(
                              period.pensionEmployee + period.pensionEmployer,
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(period.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4 pt-4 border-t text-sm font-bold">
                  <span>YTD Total</span>
                  <span>{formatCurrency(data.totalPensionYTD)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
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
            Download Tax Summary
          </Button>
        </div>
      </div>
    </div>
  );
}
