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
  Search,
  Filter,
  Calendar,
  DollarSign,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  PieChart,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type AgingCategory =
  | "current"
  | "days_1_30"
  | "days_31_60"
  | "days_61_90"
  | "days_90_plus";
type ReportType = "receivable" | "payable";

interface AgingItem {
  id: number;
  partyId: number;
  partyName: string;
  partyCode: string;
  totalAmount: number;
  current: number;
  days1_30: number;
  days31_60: number;
  days61_90: number;
  days90Plus: number;
  invoiceCount: number;
  oldestInvoiceDate?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

interface AgingSummary {
  totalCurrent: number;
  total1_30: number;
  total31_60: number;
  total61_90: number;
  total90Plus: number;
  grandTotal: number;
  riskPercentage: number;
}

// Mock Data - Accounts Receivable
const mockReceivableItems: AgingItem[] = [
  {
    id: 1,
    partyId: 1,
    partyName: "Nigerian Breweries PLC",
    partyCode: "CUST-001",
    totalAmount: 25000000,
    current: 5000000,
    days1_30: 8000000,
    days31_60: 7000000,
    days61_90: 3000000,
    days90Plus: 2000000,
    invoiceCount: 12,
    oldestInvoiceDate: "2025-12-15",
    contactPerson: "John Adeyemi",
    email: "accounts@nbplc.com",
    phone: "+234 802 123 4567",
  },
  {
    id: 2,
    partyId: 2,
    partyName: "MTN Nigeria",
    partyCode: "CUST-002",
    totalAmount: 25000000,
    current: 10000000,
    days1_30: 8000000,
    days31_60: 5000000,
    days61_90: 2000000,
    days90Plus: 0,
    invoiceCount: 8,
    oldestInvoiceDate: "2026-01-10",
    contactPerson: "Sarah Okafor",
    email: "accounts@mtn.ng",
    phone: "+234 803 456 7890",
  },
  {
    id: 3,
    partyId: 3,
    partyName: "Lagos State Government",
    partyCode: "CUST-003",
    totalAmount: 15000000,
    current: 2000000,
    days1_30: 3000000,
    days31_60: 4000000,
    days61_90: 3000000,
    days90Plus: 3000000,
    invoiceCount: 6,
    oldestInvoiceDate: "2025-11-20",
    contactPerson: "Michael Eze",
    email: "procurement@lagosstate.gov.ng",
    phone: "+234 805 678 9012",
  },
  {
    id: 4,
    partyId: 4,
    partyName: "Access Bank Plc",
    partyCode: "CUST-004",
    totalAmount: 5000000,
    current: 2000000,
    days1_30: 2000000,
    days31_60: 1000000,
    days61_90: 0,
    days90Plus: 0,
    invoiceCount: 4,
    oldestInvoiceDate: "2026-02-01",
    contactPerson: "Amara Nwosu",
    email: "supplier@accessbank.com",
    phone: "+234 806 789 0123",
  },
  {
    id: 5,
    partyId: 5,
    partyName: "First Bank Nigeria",
    partyCode: "CUST-005",
    totalAmount: 8000000,
    current: 1000000,
    days1_30: 2000000,
    days31_60: 3000000,
    days61_90: 2000000,
    days90Plus: 0,
    invoiceCount: 5,
    oldestInvoiceDate: "2026-01-05",
    contactPerson: "Olu Adeleke",
    email: "procurement@firstbank.com",
    phone: "+234 807 890 1234",
  },
  {
    id: 6,
    partyId: 6,
    partyName: "GT Bank Plc",
    partyCode: "CUST-006",
    totalAmount: 6000000,
    current: 3000000,
    days1_30: 2000000,
    days31_60: 1000000,
    days61_90: 0,
    days90Plus: 0,
    invoiceCount: 3,
    oldestInvoiceDate: "2026-02-10",
    contactPerson: "Chioma Okonkwo",
    email: "supply@gtbank.com",
    phone: "+234 808 901 2345",
  },
  {
    id: 7,
    partyId: 7,
    partyName: "Dangote Group",
    partyCode: "CUST-007",
    totalAmount: 35000000,
    current: 5000000,
    days1_30: 10000000,
    days31_60: 10000000,
    days61_90: 5000000,
    days90Plus: 5000000,
    invoiceCount: 15,
    oldestInvoiceDate: "2025-10-15",
    contactPerson: "Aliyu Abubakar",
    email: "accounts@dangote.com",
    phone: "+234 809 012 3456",
  },
];

// Mock Data - Accounts Payable
const mockPayableItems: AgingItem[] = [
  {
    id: 1,
    partyId: 1,
    partyName: "Tech Solutions Ltd",
    partyCode: "VEN-001",
    totalAmount: 2500000,
    current: 500000,
    days1_30: 1000000,
    days31_60: 500000,
    days61_90: 500000,
    days90Plus: 0,
    invoiceCount: 5,
    oldestInvoiceDate: "2026-01-20",
    contactPerson: "Sarah Okafor",
    email: "sarah@techsolutions.ng",
    phone: "+234 803 456 7890",
  },
  {
    id: 2,
    partyId: 2,
    partyName: "Office Depot Nigeria",
    partyCode: "VEN-002",
    totalAmount: 1500000,
    current: 500000,
    days1_30: 500000,
    days31_60: 500000,
    days61_90: 0,
    days90Plus: 0,
    invoiceCount: 4,
    oldestInvoiceDate: "2026-02-05",
    contactPerson: "John Adeyemi",
    email: "john@officedepot.ng",
    phone: "+234 802 123 4567",
  },
  {
    id: 3,
    partyId: 3,
    partyName: "Power Utility Company",
    partyCode: "VEN-003",
    totalAmount: 225750,
    current: 0,
    days1_30: 225750,
    days31_60: 0,
    days61_90: 0,
    days90Plus: 0,
    invoiceCount: 2,
    oldestInvoiceDate: "2026-02-28",
    contactPerson: "Customer Service",
    email: "billing@powerco.ng",
    phone: "+234 700 123 4567",
  },
  {
    id: 4,
    partyId: 4,
    partyName: "Property Management Ltd",
    partyCode: "VEN-004",
    totalAmount: 1612500,
    current: 1612500,
    days1_30: 0,
    days31_60: 0,
    days61_90: 0,
    days90Plus: 0,
    invoiceCount: 1,
    oldestInvoiceDate: "2026-03-01",
    contactPerson: "David Okonkwo",
    email: "david@property.ng",
    phone: "+234 805 678 9012",
  },
  {
    id: 5,
    partyId: 5,
    partyName: "Global Logistics",
    partyCode: "VEN-005",
    totalAmount: 750000,
    current: 250000,
    days1_30: 250000,
    days31_60: 250000,
    days61_90: 0,
    days90Plus: 0,
    invoiceCount: 3,
    oldestInvoiceDate: "2026-02-15",
    contactPerson: "Michael Eze",
    email: "michael@globallogistics.ng",
    phone: "+234 805 678 9012",
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

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getRiskBadge = (days90Plus: number, total: number) => {
  const riskPercentage = total > 0 ? (days90Plus / total) * 100 : 0;
  if (riskPercentage > 30)
    return <Badge className="bg-red-100 text-red-700">High Risk</Badge>;
  if (riskPercentage > 15)
    return <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>;
  return <Badge className="bg-green-100 text-green-700">Low Risk</Badge>;
};

const getAgingCellColor = (amount: number) => {
  if (amount === 0) return "text-gray-400";
  return "font-medium";
};

export default function AgingReports() {
  const router = useRouter();

  // State
  const [reportType, setReportType] = useState<ReportType>("receivable");
  const [receivableItems] = useState<AgingItem[]>(mockReceivableItems);
  const [payableItems] = useState<AgingItem[]>(mockPayableItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<AgingItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "details">("summary");

  // Get current data based on report type
  const currentData =
    reportType === "receivable" ? receivableItems : payableItems;

  // Calculate summary
  const summary = useMemo((): AgingSummary => {
    const totalCurrent = currentData.reduce(
      (sum, item) => sum + item.current,
      0,
    );
    const total1_30 = currentData.reduce((sum, item) => sum + item.days1_30, 0);
    const total31_60 = currentData.reduce(
      (sum, item) => sum + item.days31_60,
      0,
    );
    const total61_90 = currentData.reduce(
      (sum, item) => sum + item.days61_90,
      0,
    );
    const total90Plus = currentData.reduce(
      (sum, item) => sum + item.days90Plus,
      0,
    );
    const grandTotal =
      totalCurrent + total1_30 + total31_60 + total61_90 + total90Plus;
    const riskPercentage =
      grandTotal > 0 ? (total90Plus / grandTotal) * 100 : 0;

    return {
      totalCurrent,
      total1_30,
      total31_60,
      total61_90,
      total90Plus,
      grandTotal,
      riskPercentage,
    };
  }, [currentData]);

  // Chart data
  const agingChartData = [
    { name: "Current", value: summary.totalCurrent, color: "#10B981" },
    { name: "1-30 Days", value: summary.total1_30, color: "#3B82F6" },
    { name: "31-60 Days", value: summary.total31_60, color: "#F59E0B" },
    { name: "61-90 Days", value: summary.total61_90, color: "#F97316" },
    { name: "90+ Days", value: summary.total90Plus, color: "#EF4444" },
  ];

  // Filter items
  const filteredItems = useMemo(() => {
    let result = [...currentData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.partyName.toLowerCase().includes(query) ||
          item.partyCode.toLowerCase().includes(query) ||
          item.contactPerson?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [currentData, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleViewDetails = (item: AgingItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Party Name",
      "Party Code",
      "Total Amount",
      "Current",
      "1-30 Days",
      "31-60 Days",
      "61-90 Days",
      "90+ Days",
      "Invoice Count",
      "Oldest Invoice",
    ];
    const csvData = filteredItems.map((item) => [
      item.partyName,
      item.partyCode,
      item.totalAmount.toString(),
      item.current.toString(),
      item.days1_30.toString(),
      item.days31_60.toString(),
      item.days61_90.toString(),
      item.days90Plus.toString(),
      item.invoiceCount.toString(),
      formatDate(item.oldestInvoiceDate || ""),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}-aging-report-${asOfDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#F97316", "#EF4444"];

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
              <Clock className="h-6 w-6" />
              Aging Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              {reportType === "receivable"
                ? "Accounts Receivable"
                : "Accounts Payable"}{" "}
              Aging Analysis
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Select
              value={reportType}
              onValueChange={(v) => setReportType(v as ReportType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receivable">Accounts Receivable</SelectItem>
                <SelectItem value="payable">Accounts Payable</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-[150px]"
            />
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
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(summary.totalCurrent)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">1-30 Days</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(summary.total1_30)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">31-60 Days</p>
            <p className="text-xl font-bold text-yellow-600">
              {formatCurrency(summary.total31_60)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">61-90 Days</p>
            <p className="text-xl font-bold text-orange-600">
              {formatCurrency(summary.total61_90)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">90+ Days</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(summary.total90Plus)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Summary */}
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary.grandTotal)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                High Risk Amount (90+ days)
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.total90Plus)}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.riskPercentage.toFixed(1)}% of total
              </p>
            </div>
            <div>
              {summary.riskPercentage > 30 ? (
                <Badge className="bg-red-100 text-red-700 text-lg px-4 py-2">
                  High Risk
                </Badge>
              ) : summary.riskPercentage > 15 ? (
                <Badge className="bg-yellow-100 text-yellow-700 text-lg px-4 py-2">
                  Medium Risk
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                  Low Risk
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search by ${reportType === "receivable" ? "customer" : "vendor"} name or code...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aging Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aging Distribution</CardTitle>
            <CardDescription>Breakdown by aging category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agingChartData}
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
                  {agingChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aging Trend</CardTitle>
            <CardDescription>Amount by aging period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {agingChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {reportType === "receivable" ? "Customer" : "Vendor"}
                      </TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">1-30 Days</TableHead>
                      <TableHead className="text-right">31-60 Days</TableHead>
                      <TableHead className="text-right">61-90 Days</TableHead>
                      <TableHead className="text-right">90+ Days</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No data found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.partyName}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.partyCode}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(item.totalAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${getAgingCellColor(item.current)}`}
                          >
                            {formatCurrency(item.current)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${getAgingCellColor(item.days1_30)}`}
                          >
                            {formatCurrency(item.days1_30)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${getAgingCellColor(item.days31_60)}`}
                          >
                            {formatCurrency(item.days31_60)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${getAgingCellColor(item.days61_90)}`}
                          >
                            {formatCurrency(item.days61_90)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${item.days90Plus > 0 ? "text-red-600" : ""}`}
                          >
                            {formatCurrency(item.days90Plus)}
                          </TableCell>
                          <TableCell>
                            {getRiskBadge(item.days90Plus, item.totalAmount)}
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
                      ))
                    )}
                  </TableBody>
                  {/* Total Row */}
                  <TableHeader>
                    <TableRow className="border-t-2 font-bold bg-muted/50">
                      <TableCell colSpan={2} className="text-right">
                        Totals:
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.grandTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalCurrent)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.total1_30)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.total31_60)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.total61_90)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(summary.total90Plus)}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
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

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Aging Analysis</CardTitle>
              <CardDescription>
                Complete breakdown with invoice information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {reportType === "receivable" ? "Customer" : "Vendor"}
                      </TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">
                        Invoice Count
                      </TableHead>
                      <TableHead>Oldest Invoice</TableHead>
                      <TableHead className="text-right">
                        Total Outstanding
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.partyName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.partyCode}
                        </TableCell>
                        <TableCell>{item.contactPerson || "-"}</TableCell>
                        <TableCell>{item.email || "-"}</TableCell>
                        <TableCell>{item.phone || "-"}</TableCell>
                        <TableCell className="text-right">
                          {item.invoiceCount}
                        </TableCell>
                        <TableCell>
                          {formatDate(item.oldestInvoiceDate || "")}
                        </TableCell>
                        <TableCell className="text-right font-bold text-orange-600">
                          {formatCurrency(item.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Details: {selectedItem?.partyName}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Party Code</p>
                <p className="font-mono">{selectedItem.partyCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p>{selectedItem.contactPerson || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{selectedItem.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{selectedItem.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Count</p>
                <p>{selectedItem.invoiceCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Oldest Invoice Date
                </p>
                <p>{formatDate(selectedItem.oldestInvoiceDate || "")}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Aging Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedItem.current)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>1-30 Days:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedItem.days1_30)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>31-60 Days:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedItem.days31_60)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>61-90 Days:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedItem.days61_90)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>90+ Days:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(selectedItem.days90Plus)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total Outstanding:</span>
                    <span>{formatCurrency(selectedItem.totalAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                {getRiskBadge(
                  selectedItem.days90Plus,
                  selectedItem.totalAmount,
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
