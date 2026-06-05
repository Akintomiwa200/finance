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
  Users,
  Building2,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Wallet,
  PiggyBank,
  CreditCard,
  Percent,
  Target,
  Activity,
} from "lucide-react";

// Types
interface DepartmentPayroll {
  department: string;
  employees: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  percentage: number;
  averageSalary: number;
  breakdown: {
    basicSalary: number;
    allowances: number;
    bonuses: number;
    overtime: number;
    pension: number;
    tax: number;
    loanRepayment: number;
    insurance: number;
    otherDeductions: number;
  };
}

interface MonthlyTrend {
  month: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  employees: number;
}

interface PayrollSummary {
  totalPayrollMTD: number;
  totalPayrollYTD: number;
  activeEmployees: number;
  averageSalary: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  departmentBreakdown: DepartmentPayroll[];
  monthlyTrends: MonthlyTrend[];
  deductionBreakdown: { name: string; value: number; color: string }[];
  allowanceBreakdown: { name: string; value: number; color: string }[];
  lastUpdated: string;
}

// Initial Data
const initialData: PayrollSummary = {
  totalPayrollMTD: 45230000,
  totalPayrollYTD: 271380000,
  activeEmployees: 156,
  averageSalary: 289936,
  totalGrossPay: 58750000,
  totalDeductions: 13520000,
  totalNetPay: 45230000,
  lastUpdated: "2026-06-02",
  departmentBreakdown: [
    {
      department: "Engineering",
      employees: 45,
      grossPay: 15400000,
      deductions: 3850000,
      netPay: 11550000,
      percentage: 34,
      averageSalary: 342222,
      breakdown: {
        basicSalary: 10500000,
        allowances: 3200000,
        bonuses: 1200000,
        overtime: 500000,
        pension: 840000,
        tax: 1260000,
        loanRepayment: 850000,
        insurance: 400000,
        otherDeductions: 500000,
      },
    },
    {
      department: "Finance",
      employees: 12,
      grossPay: 8200000,
      deductions: 2050000,
      netPay: 6150000,
      percentage: 18,
      averageSalary: 683333,
      breakdown: {
        basicSalary: 5800000,
        allowances: 1500000,
        bonuses: 600000,
        overtime: 300000,
        pension: 464000,
        tax: 696000,
        loanRepayment: 350000,
        insurance: 240000,
        otherDeductions: 300000,
      },
    },
    {
      department: "Sales",
      employees: 20,
      grossPay: 7800000,
      deductions: 1950000,
      netPay: 5850000,
      percentage: 17,
      averageSalary: 390000,
      breakdown: {
        basicSalary: 5200000,
        allowances: 1600000,
        bonuses: 700000,
        overtime: 300000,
        pension: 416000,
        tax: 624000,
        loanRepayment: 400000,
        insurance: 210000,
        otherDeductions: 300000,
      },
    },
    {
      department: "HR",
      employees: 8,
      grossPay: 3200000,
      deductions: 800000,
      netPay: 2400000,
      percentage: 7,
      averageSalary: 400000,
      breakdown: {
        basicSalary: 2200000,
        allowances: 600000,
        bonuses: 250000,
        overtime: 150000,
        pension: 176000,
        tax: 264000,
        loanRepayment: 150000,
        insurance: 100000,
        otherDeductions: 110000,
      },
    },
    {
      department: "Operations",
      employees: 15,
      grossPay: 5630000,
      deductions: 1407500,
      netPay: 4222500,
      percentage: 12,
      averageSalary: 375333,
      breakdown: {
        basicSalary: 3800000,
        allowances: 1100000,
        bonuses: 500000,
        overtime: 230000,
        pension: 304000,
        tax: 456000,
        loanRepayment: 300000,
        insurance: 167500,
        otherDeductions: 180000,
      },
    },
    {
      department: "Administration",
      employees: 6,
      grossPay: 5000000,
      deductions: 1250000,
      netPay: 3750000,
      percentage: 11,
      averageSalary: 833333,
      breakdown: {
        basicSalary: 3500000,
        allowances: 900000,
        bonuses: 400000,
        overtime: 200000,
        pension: 280000,
        tax: 420000,
        loanRepayment: 250000,
        insurance: 150000,
        otherDeductions: 150000,
      },
    },
  ],
  monthlyTrends: [
    {
      month: "Jan",
      grossPay: 52000000,
      deductions: 12000000,
      netPay: 40000000,
      employees: 150,
    },
    {
      month: "Feb",
      grossPay: 53500000,
      deductions: 12300000,
      netPay: 41200000,
      employees: 152,
    },
    {
      month: "Mar",
      grossPay: 54800000,
      deductions: 12600000,
      netPay: 42200000,
      employees: 153,
    },
    {
      month: "Apr",
      grossPay: 56200000,
      deductions: 12900000,
      netPay: 43300000,
      employees: 154,
    },
    {
      month: "May",
      grossPay: 57500000,
      deductions: 13200000,
      netPay: 44300000,
      employees: 155,
    },
    {
      month: "Jun",
      grossPay: 58750000,
      deductions: 13520000,
      netPay: 45230000,
      employees: 156,
    },
  ],
  deductionBreakdown: [
    { name: "PAYE Tax", value: 5200000, color: "#EF4444" },
    { name: "Pension", value: 3500000, color: "#F59E0B" },
    { name: "Loan Repayment", value: 2300000, color: "#8B5CF6" },
    { name: "Health Insurance", value: 1267500, color: "#3B82F6" },
    { name: "Other Deductions", value: 1252500, color: "#6B7280" },
  ],
  allowanceBreakdown: [
    { name: "Housing Allowance", value: 8500000, color: "#10B981" },
    { name: "Transport Allowance", value: 5200000, color: "#3B82F6" },
    { name: "Medical Allowance", value: 2800000, color: "#8B5CF6" },
    { name: "Performance Bonus", value: 3800000, color: "#F59E0B" },
    { name: "Other Allowances", value: 2100000, color: "#EC4899" },
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

export default function PayrollSummaryReportPage() {
  // State
  const [data] = useState<PayrollSummary>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentPayroll;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("June 2026");
  const [activeTab, setActiveTab] = useState("overview");

  // Filter and sort departments
  const filteredDepartments = useMemo(() => {
    let result = [...data.departmentBreakdown];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((d) => d.department.toLowerCase().includes(query));
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
  }, [data.departmentBreakdown, searchQuery, sortConfig]);

  const handleSort = (key: keyof DepartmentPayroll) => {
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

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold mb-2">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / data.totalDeductions) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${((percent ?? 0) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payroll Summary Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Summary of payroll costs across departments and periods
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
              <SelectItem value="April 2026">April 2026</SelectItem>
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
                  Total Payroll (MTD)
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalPayrollMTD)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    +2.1% vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Employees
                </p>
                <p className="text-2xl font-bold">{data.activeEmployees}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+1 this month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.averageSalary)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  per employee
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Payroll</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalPayrollYTD)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  January - June 2026
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-orange-600" />
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
          <TabsTrigger value="departments">
            <Building2 className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="trends">
            <Activity className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Breakdown
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payroll Trend</CardTitle>
                <CardDescription>
                  Gross pay vs net pay over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.monthlyTrends}>
                    <defs>
                      <linearGradient
                        id="colorGross"
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
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
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
                      dataKey="grossPay"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#colorGross)"
                      name="Gross Pay"
                    />
                    <Area
                      type="monotone"
                      dataKey="netPay"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#colorNet)"
                      name="Net Pay"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Payroll Distribution by Department</CardTitle>
                <CardDescription>
                  Percentage of total payroll per department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.departmentBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="netPay"
                      nameKey="department"
                      label={({ department, percentage }: any) =>
                        `${department} (${percentage}%)`
                      }
                      labelLine={true}
                    >
                      {data.departmentBreakdown.map((_, index) => (
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      Total Gross Pay
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(data.totalGrossPay)}
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 font-medium">
                      Total Deductions
                    </p>
                    <p className="text-2xl font-bold text-red-900">
                      {formatCurrency(data.totalDeductions)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      Total Net Pay
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(data.totalNetPay)}
                    </p>
                  </div>
                  <PiggyBank className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Department Breakdown</CardTitle>
                  <CardDescription>
                    Detailed payroll breakdown by department
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search departments..."
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
                      <TableHead>Department</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("employees")}
                        >
                          Employees
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Avg Salary</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("grossPay")}
                        >
                          Gross Pay
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("netPay")}
                        >
                          Net Pay
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead>Distribution</TableHead>
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
                        <TableCell>
                          <Badge variant="secondary">{dept.employees}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(dept.averageSalary)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(dept.grossPay)}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {formatCurrency(dept.deductions)}
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          {formatCurrency(dept.netPay)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {dept.percentage}%
                            </span>
                            <Progress
                              value={dept.percentage}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-[120px]">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${(dept.netPay / dept.grossPay) * 100}%`,
                                }}
                              />
                              <div
                                className="h-full bg-red-400"
                                style={{
                                  width: `${(dept.deductions / dept.grossPay) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Net</span>
                              <span>Ded.</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell>
                        <Badge>{data.activeEmployees}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(data.averageSalary)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(data.totalGrossPay)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(data.totalDeductions)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(data.totalNetPay)}
                      </TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Department Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.slice(0, 6).map((dept, index) => (
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
                    <Badge variant="secondary">{dept.employees} emp.</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Pay</span>
                    <span className="font-medium">
                      {formatCurrency(dept.grossPay)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deductions</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(dept.deductions)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t">
                    <span>Net Pay</span>
                    <span className="text-green-600">
                      {formatCurrency(dept.netPay)}
                    </span>
                  </div>
                  <Progress value={dept.percentage} className="h-1.5" />
                  <p className="text-xs text-muted-foreground text-right">
                    {dept.percentage}% of total payroll
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Count Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Count Trend</CardTitle>
                <CardDescription>Monthly active employee count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                      domain={[145, 160]}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="employees"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#8B5CF6" }}
                      name="Employees"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Deductions Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Deductions Trend</CardTitle>
                <CardDescription>Monthly deduction breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(value) => formatCompactCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="deductions"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                      name="Total Deductions"
                    />
                    <Bar
                      dataKey="netPay"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      name="Net Pay"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Avg Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.monthlyTrends.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">
                        {month.month} 2026
                      </TableCell>
                      <TableCell>{month.employees}</TableCell>
                      <TableCell>{formatCurrency(month.grossPay)}</TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(month.deductions)}
                      </TableCell>
                      <TableCell className="text-green-600 font-bold">
                        {formatCurrency(month.netPay)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          Math.round(month.grossPay / month.employees),
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deductions Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Deduction Breakdown</CardTitle>
                <CardDescription>
                  Distribution of payroll deductions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.deductionBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {data.deductionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {data.deductionBreakdown.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allowances Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Allowance Breakdown</CardTitle>
                <CardDescription>
                  Distribution of allowances and bonuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.allowanceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {data.allowanceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {data.allowanceBreakdown.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gross to Net Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Gross to Net Pay Flow</CardTitle>
              <CardDescription>
                How gross pay translates to net pay after deductions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl min-w-[160px]">
                  <p className="text-sm text-blue-700 font-medium mb-1">
                    Gross Pay
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(data.totalGrossPay)}
                  </p>
                </div>
                <ChevronDown className="h-6 w-6 text-muted-foreground hidden sm:block" />
                <div className="text-center p-6 bg-red-50 rounded-xl min-w-[160px]">
                  <p className="text-sm text-red-700 font-medium mb-1">
                    Total Deductions
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    -{formatCurrency(data.totalDeductions)}
                  </p>
                </div>
                <ChevronDown className="h-6 w-6 text-muted-foreground hidden sm:block" />
                <div className="text-center p-6 bg-green-50 rounded-xl min-w-[160px] ring-2 ring-green-300">
                  <p className="text-sm text-green-700 font-medium mb-1">
                    Net Pay
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(data.totalNetPay)}
                  </p>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Deduction Rate:{" "}
                {((data.totalDeductions / data.totalGrossPay) * 100).toFixed(1)}
                % of gross pay
              </div>
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
