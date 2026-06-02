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
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Receipt,
  Users,
  Wallet,
  CreditCard,
  PiggyBank,
  FileText,
} from "lucide-react";

// Types
interface AgingBucket {
  period: string;
  range: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

interface AgedInvoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  balanceDue: number;
  dueDate: string;
  daysOverdue: number;
  agingBucket: string;
  status: "current" | "overdue" | "critical" | "doubtful";
  lastPayment?: string;
  lastPaymentAmount?: number;
  contactPerson?: string;
  contactPhone?: string;
}

interface VendorAgedInvoice {
  id: number;
  invoiceNumber: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  balanceDue: number;
  dueDate: string;
  daysOverdue: number;
  agingBucket: string;
  status: "current" | "due-soon" | "overdue";
  paymentTerms: string;
}

interface AgingReport {
  asOfDate: string;
  totalOutstandingAR: number;
  totalOverdueAR: number;
  totalOutstandingAP: number;
  totalOverdueAP: number;
  arCollectionRate: number;
  apPaymentRate: number;
  arAging: AgingBucket[];
  apAging: AgingBucket[];
  arInvoices: AgedInvoice[];
  apInvoices: VendorAgedInvoice[];
  arTrend: { month: string; outstanding: number; collected: number }[];
  apTrend: { month: string; outstanding: number; paid: number }[];
  lastUpdated: string;
}

// Initial Data
const initialData: AgingReport = {
  asOfDate: "2026-06-02",
  totalOutstandingAR: 5190000,
  totalOverdueAR: 4090000,
  totalOutstandingAP: 2050000,
  totalOverdueAP: 850000,
  arCollectionRate: 68.5,
  apPaymentRate: 82.3,
  lastUpdated: "2026-06-02",
  arAging: [
    {
      period: "Current",
      range: "0–30 days",
      amount: 1100000,
      count: 2,
      percentage: 21.2,
      color: "#10B981",
    },
    {
      period: "31–60 days",
      range: "31–60 days",
      amount: 890000,
      count: 1,
      percentage: 17.2,
      color: "#F59E0B",
    },
    {
      period: "61–90 days",
      range: "61–90 days",
      amount: 3200000,
      count: 1,
      percentage: 61.7,
      color: "#EF4444",
    },
    {
      period: "90+ days",
      range: "90+ days",
      amount: 0,
      count: 0,
      percentage: 0,
      color: "#DC2626",
    },
  ],
  apAging: [
    {
      period: "Current",
      range: "0–30 days",
      amount: 1200000,
      count: 2,
      percentage: 58.5,
      color: "#10B981",
    },
    {
      period: "31–60 days",
      range: "31–60 days",
      amount: 750000,
      count: 1,
      percentage: 36.6,
      color: "#F59E0B",
    },
    {
      period: "61–90 days",
      range: "61–90 days",
      amount: 100000,
      count: 1,
      percentage: 4.9,
      color: "#EF4444",
    },
    {
      period: "90+ days",
      range: "90+ days",
      amount: 0,
      count: 0,
      percentage: 0,
      color: "#DC2626",
    },
  ],
  arInvoices: [
    {
      id: 1,
      invoiceNumber: "INV-2026-003",
      customerName: "Gamma Inc",
      customerEmail: "billing@gammainc.com",
      amount: 3200000,
      balanceDue: 2200000,
      dueDate: "2026-06-05",
      daysOverdue: -3,
      agingBucket: "Current",
      status: "current",
      lastPayment: "2026-05-25",
      lastPaymentAmount: 1000000,
      contactPerson: "Mr. Adebayo Ojo",
      contactPhone: "+234 800 345 6789",
    },
    {
      id: 2,
      invoiceNumber: "INV-2026-004",
      customerName: "Delta Co",
      customerEmail: "ap@deltaco.com",
      amount: 1100000,
      balanceDue: 1100000,
      dueDate: "2026-06-30",
      daysOverdue: -28,
      agingBucket: "Current",
      status: "current",
      contactPerson: "Mrs. Chioma Eze",
      contactPhone: "+234 800 456 7890",
    },
    {
      id: 3,
      invoiceNumber: "INV-2026-002",
      customerName: "Beta Ltd",
      customerEmail: "finance@betalimited.com",
      amount: 890000,
      balanceDue: 890000,
      dueDate: "2026-05-10",
      daysOverdue: 23,
      agingBucket: "31–60 days",
      status: "overdue",
      contactPerson: "Mr. Emeka Nwosu",
      contactPhone: "+234 800 234 5678",
    },
    {
      id: 4,
      invoiceNumber: "INV-2026-001",
      customerName: "Acme Corp",
      customerEmail: "accounts@acmecorp.com",
      amount: 2450000,
      balanceDue: 0,
      dueDate: "2026-04-15",
      daysOverdue: 48,
      agingBucket: "61–90 days",
      status: "current",
      lastPayment: "2026-06-10",
      lastPaymentAmount: 2450000,
      contactPerson: "Dr. Folake Adeyemi",
      contactPhone: "+234 800 123 4567",
    },
    {
      id: 5,
      invoiceNumber: "INV-2026-005",
      customerName: "Epsilon Enterprises",
      customerEmail: "finance@epsilonent.com",
      amount: 1025000,
      balanceDue: 525000,
      dueDate: "2026-03-28",
      daysOverdue: 66,
      agingBucket: "61–90 days",
      status: "critical",
      lastPayment: "2026-04-15",
      lastPaymentAmount: 500000,
      contactPerson: "Alhaji Musa Ibrahim",
      contactPhone: "+234 800 567 8901",
    },
    {
      id: 6,
      invoiceNumber: "INV-2026-006",
      customerName: "Zeta Solutions",
      customerEmail: "billing@zetasol.com",
      amount: 2150000,
      balanceDue: 2150000,
      dueDate: "2026-02-28",
      daysOverdue: 94,
      agingBucket: "90+ days",
      status: "doubtful",
      contactPerson: "Chief Olu Peters",
      contactPhone: "+234 800 678 9012",
    },
  ],
  apInvoices: [
    {
      id: 1,
      invoiceNumber: "VEN-2026-002",
      vendorName: "OfficeMart Supplies",
      vendorEmail: "accounts@officemart.com",
      amount: 340000,
      balanceDue: 340000,
      dueDate: "2026-06-18",
      daysOverdue: -16,
      agingBucket: "Current",
      status: "current",
      paymentTerms: "Net 30",
    },
    {
      id: 2,
      invoiceNumber: "VEN-2026-003",
      vendorName: "CloudServ Technologies",
      vendorEmail: "finance@cloudserv.tech",
      amount: 2100000,
      balanceDue: 2100000,
      dueDate: "2026-06-25",
      daysOverdue: -23,
      agingBucket: "Current",
      status: "current",
      paymentTerms: "Net 30",
    },
    {
      id: 3,
      invoiceNumber: "VEN-2026-004",
      vendorName: "ConsultPro Advisory",
      vendorEmail: "invoices@consultpro.com",
      amount: 750000,
      balanceDue: 500000,
      dueDate: "2026-05-10",
      daysOverdue: 23,
      agingBucket: "31–60 days",
      status: "overdue",
      paymentTerms: "Net 60",
    },
    {
      id: 4,
      invoiceNumber: "VEN-2026-006",
      vendorName: "FacilityMasters Inc",
      vendorEmail: "billing@facilitymasters.com",
      amount: 365500,
      balanceDue: 365500,
      dueDate: "2026-05-01",
      daysOverdue: 32,
      agingBucket: "31–60 days",
      status: "overdue",
      paymentTerms: "Net 30",
    },
  ],
  arTrend: [
    { month: "Jan", outstanding: 3800000, collected: 2500000 },
    { month: "Feb", outstanding: 4200000, collected: 2800000 },
    { month: "Mar", outstanding: 5100000, collected: 3200000 },
    { month: "Apr", outstanding: 4800000, collected: 3500000 },
    { month: "May", outstanding: 5500000, collected: 3800000 },
    { month: "Jun", outstanding: 5190000, collected: 2900000 },
  ],
  apTrend: [
    { month: "Jan", outstanding: 1800000, paid: 1500000 },
    { month: "Feb", outstanding: 2100000, paid: 1800000 },
    { month: "Mar", outstanding: 2400000, paid: 2000000 },
    { month: "Apr", outstanding: 2000000, paid: 2200000 },
    { month: "May", outstanding: 2300000, paid: 1900000 },
    { month: "Jun", outstanding: 2050000, paid: 1700000 },
  ],
};

const COLORS = [
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#DC2626",
  "#8B5CF6",
  "#EC4899",
];

export default function InvoiceAgingReportPage() {
  // State
  const [data] = useState<AgingReport>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [arStatusFilter, setArStatusFilter] = useState("all");
  const [apStatusFilter, setApStatusFilter] = useState("all");
  const [arAgingFilter, setArAgingFilter] = useState("all");
  const [apAgingFilter, setApAgingFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter AR invoices
  const filteredARInvoices = useMemo(() => {
    let result = [...data.arInvoices];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.customerName.toLowerCase().includes(query) ||
          inv.customerEmail.toLowerCase().includes(query) ||
          (inv.contactPerson &&
            inv.contactPerson.toLowerCase().includes(query)),
      );
    }

    if (arStatusFilter !== "all") {
      result = result.filter((inv) => inv.status === arStatusFilter);
    }

    if (arAgingFilter !== "all") {
      result = result.filter((inv) => inv.agingBucket === arAgingFilter);
    }

    return result;
  }, [data.arInvoices, searchQuery, arStatusFilter, arAgingFilter]);

  // Filter AP invoices
  const filteredAPInvoices = useMemo(() => {
    let result = [...data.apInvoices];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.vendorName.toLowerCase().includes(query) ||
          inv.vendorEmail.toLowerCase().includes(query),
      );
    }

    if (apStatusFilter !== "all") {
      result = result.filter((inv) => inv.status === apStatusFilter);
    }

    if (apAgingFilter !== "all") {
      result = result.filter((inv) => inv.agingBucket === apAgingFilter);
    }

    return result;
  }, [data.apInvoices, searchQuery, apStatusFilter, apAgingFilter]);

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string, type: "ar" | "ap" = "ar") => {
    if (type === "ar") {
      switch (status) {
        case "current":
          return (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Current
            </Badge>
          );
        case "overdue":
          return (
            <Badge className="bg-yellow-100 text-yellow-700">
              <Clock className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          );
        case "critical":
          return (
            <Badge className="bg-orange-100 text-orange-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Critical
            </Badge>
          );
        case "doubtful":
          return (
            <Badge className="bg-red-100 text-red-700">
              <XCircle className="h-3 w-3 mr-1" />
              Doubtful
            </Badge>
          );
        default:
          return null;
      }
    } else {
      switch (status) {
        case "current":
          return (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Current
            </Badge>
          );
        case "due-soon":
          return (
            <Badge className="bg-yellow-100 text-yellow-700">
              <Clock className="h-3 w-3 mr-1" />
              Due Soon
            </Badge>
          );
        case "overdue":
          return (
            <Badge className="bg-red-100 text-red-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          );
        default:
          return null;
      }
    }
  };

  const getDaysOverdueColor = (days: number) => {
    if (days <= 0) return "text-green-600";
    if (days <= 30) return "text-yellow-600";
    if (days <= 60) return "text-orange-600";
    return "text-red-600";
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
            Invoice Aging Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Track overdue invoices and accounts receivable aging
          </p>
        </div>
        <div className="flex gap-2">
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
                <p className="text-sm text-muted-foreground">Outstanding AR</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalOutstandingAR)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.arCollectionRate}% collection rate
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue AR</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(data.totalOverdueAR)}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Requires immediate attention
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding AP</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalOutstandingAP)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.apPaymentRate}% paid on time
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue AP</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(data.totalOverdueAP)}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Past due payables
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
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
          <TabsTrigger value="ar-aging">
            <Wallet className="h-4 w-4 mr-2" />
            AR Aging
          </TabsTrigger>
          <TabsTrigger value="ap-aging">
            <CreditCard className="h-4 w-4 mr-2" />
            AP Aging
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AR Aging Chart */}
            <Card>
              <CardHeader>
                <CardTitle>AR Aging Summary</CardTitle>
                <CardDescription>
                  Distribution of outstanding receivables by age
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.arAging.filter((b) => b.amount > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="period"
                      label={({ period, percentage }: any) =>
                        `${period} (${percentage}%)`
                      }
                    >
                      {data.arAging
                        .filter((b) => b.amount > 0)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {data.arAging.map((bucket, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: bucket.color }}
                        />
                        <span>{bucket.range}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {formatCurrency(bucket.amount)}
                        </span>
                        <Badge variant="secondary">{bucket.count} inv.</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AP Aging Chart */}
            <Card>
              <CardHeader>
                <CardTitle>AP Aging Summary</CardTitle>
                <CardDescription>
                  Distribution of outstanding payables by age
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.apAging.filter((b) => b.amount > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="period"
                      label={({ period, percentage }: any) =>
                        `${period} (${percentage}%)`
                      }
                    >
                      {data.apAging
                        .filter((b) => b.amount > 0)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {data.apAging.map((bucket, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: bucket.color }}
                        />
                        <span>{bucket.range}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {formatCurrency(bucket.amount)}
                        </span>
                        <Badge variant="secondary">{bucket.count} inv.</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AR vs AP Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>AR vs AP Comparison</CardTitle>
              <CardDescription>
                Side-by-side comparison of receivables and payables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Current",
                      AR: data.arAging[0]?.amount || 0,
                      AP: data.apAging[0]?.amount || 0,
                    },
                    {
                      name: "31-60 Days",
                      AR: data.arAging[1]?.amount || 0,
                      AP: data.apAging[1]?.amount || 0,
                    },
                    {
                      name: "61-90 Days",
                      AR: data.arAging[2]?.amount || 0,
                      AP: data.apAging[2]?.amount || 0,
                    },
                    {
                      name: "90+ Days",
                      AR: data.arAging[3]?.amount || 0,
                      AP: data.apAging[3]?.amount || 0,
                    },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
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
                    dataKey="AR"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="Accounts Receivable"
                  />
                  <Bar
                    dataKey="AP"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                    name="Accounts Payable"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AR Aging Tab */}
        <TabsContent value="ar-aging" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Accounts Receivable Aging</CardTitle>
                  <CardDescription>
                    Detailed list of outstanding customer invoices
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={arStatusFilter}
                    onValueChange={setArStatusFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="doubtful">Doubtful</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={arAgingFilter}
                    onValueChange={setArAgingFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Aging" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="31–60 days">31-60 Days</SelectItem>
                      <SelectItem value="61–90 days">61-90 Days</SelectItem>
                      <SelectItem value="90+ days">90+ Days</SelectItem>
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
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Balance Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Aging</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredARInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No invoices found
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredARInvoices.map((inv) => (
                        <TableRow
                          key={inv.id}
                          className={
                            inv.status === "doubtful"
                              ? "bg-red-50/30"
                              : inv.status === "critical"
                                ? "bg-orange-50/30"
                                : ""
                          }
                        >
                          <TableCell>
                            <span className="font-medium text-sm">
                              {inv.invoiceNumber}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {inv.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {inv.customerEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(inv.amount)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                inv.balanceDue > 0
                                  ? "text-red-600 font-bold"
                                  : "text-green-600 font-medium"
                              }
                            >
                              {formatCurrency(inv.balanceDue)}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(inv.dueDate)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold ${getDaysOverdueColor(inv.daysOverdue)}`}
                            >
                              {inv.daysOverdue <= 0
                                ? `${Math.abs(inv.daysOverdue)} days left`
                                : `${inv.daysOverdue} days`}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {inv.agingBucket}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(inv.status, "ar")}
                          </TableCell>
                          <TableCell>
                            {inv.contactPerson && (
                              <div className="text-xs">
                                <p className="font-medium">
                                  {inv.contactPerson}
                                </p>
                                <p className="text-muted-foreground">
                                  {inv.contactPhone}
                                </p>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* AR Summary Footer */}
              <div className="flex justify-end gap-6 mt-4 pt-4 border-t text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Total Outstanding:{" "}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(
                      filteredARInvoices.reduce((s, i) => s + i.balanceDue, 0),
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Total Invoices:{" "}
                  </span>
                  <span className="font-bold">{filteredARInvoices.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AP Aging Tab */}
        <TabsContent value="ap-aging" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Accounts Payable Aging</CardTitle>
                  <CardDescription>
                    Detailed list of outstanding vendor invoices
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={apStatusFilter}
                    onValueChange={setApStatusFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="due-soon">Due Soon</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={apAgingFilter}
                    onValueChange={setApAgingFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Aging" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="31–60 days">31-60 Days</SelectItem>
                      <SelectItem value="61–90 days">61-90 Days</SelectItem>
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
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Balance Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Aging</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Terms</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAPInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No vendor invoices found
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAPInvoices.map((inv) => (
                        <TableRow
                          key={inv.id}
                          className={
                            inv.status === "overdue" ? "bg-red-50/30" : ""
                          }
                        >
                          <TableCell>
                            <span className="font-medium text-sm">
                              {inv.invoiceNumber}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {inv.vendorName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {inv.vendorEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(inv.amount)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                inv.balanceDue > 0
                                  ? "text-red-600 font-bold"
                                  : "text-green-600 font-medium"
                              }
                            >
                              {formatCurrency(inv.balanceDue)}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(inv.dueDate)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold ${getDaysOverdueColor(inv.daysOverdue)}`}
                            >
                              {inv.daysOverdue <= 0
                                ? `${Math.abs(inv.daysOverdue)} days left`
                                : `${inv.daysOverdue} days`}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {inv.agingBucket}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(inv.status, "ap")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {inv.paymentTerms}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* AP Summary Footer */}
              <div className="flex justify-end gap-6 mt-4 pt-4 border-t text-sm">
                <div>
                  <span className="text-muted-foreground">Total Payable: </span>
                  <span className="font-bold">
                    {formatCurrency(
                      filteredAPInvoices.reduce((s, i) => s + i.balanceDue, 0),
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Total Invoices:{" "}
                  </span>
                  <span className="font-bold">{filteredAPInvoices.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AR Trend */}
            <Card>
              <CardHeader>
                <CardTitle>AR Trend</CardTitle>
                <CardDescription>
                  Outstanding vs collected receivables over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.arTrend}>
                    <defs>
                      <linearGradient
                        id="colorOutstanding"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#EF4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#EF4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCollected"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                      tickFormatter={(v) => formatCompactCurrency(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="outstanding"
                      stroke="#EF4444"
                      strokeWidth={2}
                      fill="url(#colorOutstanding)"
                      name="Outstanding AR"
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#colorCollected)"
                      name="Collected"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AP Trend */}
            <Card>
              <CardHeader>
                <CardTitle>AP Trend</CardTitle>
                <CardDescription>
                  Outstanding vs paid payables over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.apTrend}>
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
                      dataKey="outstanding"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                      name="Outstanding AP"
                    />
                    <Bar
                      dataKey="paid"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      name="Paid"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Combined Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Net Cash Flow Position</CardTitle>
              <CardDescription>AR minus AP over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data.arTrend.map((ar, i) => ({
                    month: ar.month,
                    netPosition:
                      ar.outstanding - (data.apTrend[i]?.outstanding || 0),
                    AR: ar.outstanding,
                    AP: data.apTrend[i]?.outstanding || 0,
                  }))}
                >
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
                  <Line
                    type="monotone"
                    dataKey="netPosition"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#8B5CF6" }}
                    name="Net Position (AR - AP)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          As of:{" "}
          {new Date(data.asOfDate).toLocaleDateString("en-US", {
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
