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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle,
  Receipt,
  Landmark,
  Building2,
  Eye,
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
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Types
type VatRate = 7.5;
type TransactionType = "sales" | "purchase" | "expense";
type VatStatus = "filed" | "pending" | "overdue";

interface VatTransaction {
  id: number;
  date: string;
  invoiceNumber: string;
  description: string;
  type: TransactionType;
  taxableAmount: number;
  vatAmount: number;
  rate: VatRate;
  customerSupplier: string;
  vatStatus: VatStatus;
}

interface VatPeriod {
  period: string;
  outputVat: number;
  inputVat: number;
  netVat: number;
  filings: number;
  payments: number;
}

// Mock Data
const mockVatTransactions: VatTransaction[] = [
  // Sales (Output VAT)
  {
    id: 1,
    date: "2026-01-15",
    invoiceNumber: "INV-2026-001",
    description: "Consulting Services",
    type: "sales",
    taxableAmount: 5000000,
    vatAmount: 375000,
    rate: 7.5,
    customerSupplier: "Nigerian Breweries",
    vatStatus: "filed",
  },
  {
    id: 2,
    date: "2026-01-20",
    invoiceNumber: "INV-2026-002",
    description: "Software Development",
    type: "sales",
    taxableAmount: 3500000,
    vatAmount: 262500,
    rate: 7.5,
    customerSupplier: "MTN Nigeria",
    vatStatus: "filed",
  },
  {
    id: 3,
    date: "2026-02-10",
    invoiceNumber: "INV-2026-003",
    description: "IT Support Services",
    type: "sales",
    taxableAmount: 2800000,
    vatAmount: 210000,
    rate: 7.5,
    customerSupplier: "Access Bank",
    vatStatus: "filed",
  },
  {
    id: 4,
    date: "2026-02-25",
    invoiceNumber: "INV-2026-004",
    description: "Consulting Services",
    type: "sales",
    taxableAmount: 4200000,
    vatAmount: 315000,
    rate: 7.5,
    customerSupplier: "Lagos State Govt",
    vatStatus: "filed",
  },
  {
    id: 5,
    date: "2026-03-05",
    invoiceNumber: "INV-2026-005",
    description: "Software License",
    type: "sales",
    taxableAmount: 1250000,
    vatAmount: 93750,
    rate: 7.5,
    customerSupplier: "First Bank",
    vatStatus: "pending",
  },
  {
    id: 6,
    date: "2026-03-18",
    invoiceNumber: "INV-2026-006",
    description: "Cloud Services",
    type: "sales",
    taxableAmount: 2300000,
    vatAmount: 172500,
    rate: 7.5,
    customerSupplier: "GT Bank",
    vatStatus: "pending",
  },

  // Purchases (Input VAT)
  {
    id: 7,
    date: "2026-01-05",
    invoiceNumber: "PO-2026-001",
    description: "Office Supplies",
    type: "purchase",
    taxableAmount: 250000,
    vatAmount: 18750,
    rate: 7.5,
    customerSupplier: "Office Depot",
    vatStatus: "filed",
  },
  {
    id: 8,
    date: "2026-01-12",
    invoiceNumber: "PO-2026-002",
    description: "IT Equipment",
    type: "purchase",
    taxableAmount: 1500000,
    vatAmount: 112500,
    rate: 7.5,
    customerSupplier: "Tech Solutions",
    vatStatus: "filed",
  },
  {
    id: 9,
    date: "2026-02-08",
    invoiceNumber: "PO-2026-003",
    description: "Software License",
    type: "purchase",
    taxableAmount: 800000,
    vatAmount: 60000,
    rate: 7.5,
    customerSupplier: "Microsoft",
    vatStatus: "filed",
  },
  {
    id: 10,
    date: "2026-02-20",
    invoiceNumber: "PO-2026-004",
    description: "Consulting Services",
    type: "purchase",
    taxableAmount: 1200000,
    vatAmount: 90000,
    rate: 7.5,
    customerSupplier: "Deloitte",
    vatStatus: "filed",
  },
  {
    id: 11,
    date: "2026-03-02",
    invoiceNumber: "PO-2026-005",
    description: "Stationery",
    type: "purchase",
    taxableAmount: 150000,
    vatAmount: 11250,
    rate: 7.5,
    customerSupplier: "Stationery World",
    vatStatus: "pending",
  },
  {
    id: 12,
    date: "2026-03-15",
    invoiceNumber: "PO-2026-006",
    description: "Marketing Services",
    type: "purchase",
    taxableAmount: 500000,
    vatAmount: 37500,
    rate: 7.5,
    customerSupplier: "Digital Agency",
    vatStatus: "pending",
  },

  // Expenses
  {
    id: 13,
    date: "2026-01-25",
    invoiceNumber: "EXP-2026-001",
    description: "Electricity Bill",
    type: "expense",
    taxableAmount: 185000,
    vatAmount: 13875,
    rate: 7.5,
    customerSupplier: "Power Utility",
    vatStatus: "filed",
  },
  {
    id: 14,
    date: "2026-02-18",
    invoiceNumber: "EXP-2026-002",
    description: "Internet Services",
    type: "expense",
    taxableAmount: 120000,
    vatAmount: 9000,
    rate: 7.5,
    customerSupplier: "ISP Provider",
    vatStatus: "filed",
  },
  {
    id: 15,
    date: "2026-03-10",
    invoiceNumber: "EXP-2026-003",
    description: "Office Rent",
    type: "expense",
    taxableAmount: 1200000,
    vatAmount: 90000,
    rate: 7.5,
    customerSupplier: "Property Manager",
    vatStatus: "pending",
  },
];

// Generate period data
const generatePeriodData = (): VatPeriod[] => {
  return [
    {
      period: "Jan 2026",
      outputVat: 637500,
      inputVat: 145125,
      netVat: 492375,
      filings: 2,
      payments: 492375,
    },
    {
      period: "Feb 2026",
      outputVat: 525000,
      inputVat: 159000,
      netVat: 366000,
      filings: 2,
      payments: 366000,
    },
    {
      period: "Mar 2026",
      outputVat: 266250,
      inputVat: 138750,
      netVat: 127500,
      filings: 2,
      payments: 0,
    },
    {
      period: "Apr 2026",
      outputVat: 450000,
      inputVat: 120000,
      netVat: 330000,
      filings: 0,
      payments: 0,
    },
    {
      period: "May 2026",
      outputVat: 380000,
      inputVat: 95000,
      netVat: 285000,
      filings: 0,
      payments: 0,
    },
    {
      period: "Jun 2026",
      outputVat: 520000,
      inputVat: 130000,
      netVat: 390000,
      filings: 0,
      payments: 0,
    },
  ];
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

const getTransactionTypeBadge = (type: TransactionType) => {
  switch (type) {
    case "sales":
      return (
        <Badge className="bg-green-100 text-green-700">
          Sales (Output VAT)
        </Badge>
      );
    case "purchase":
      return (
        <Badge className="bg-blue-100 text-blue-700">
          Purchase (Input VAT)
        </Badge>
      );
    case "expense":
      return (
        <Badge className="bg-orange-100 text-orange-700">
          Expense (Input VAT)
        </Badge>
      );
  }
};

const getVatStatusBadge = (status: VatStatus) => {
  switch (status) {
    case "filed":
      return <Badge className="bg-green-100 text-green-700">Filed</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    case "overdue":
      return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
  }
};

export default function VatGstReports() {
  const router = useRouter();

  // State
  const [transactions] = useState<VatTransaction[]>(mockVatTransactions);
  const [periodData] = useState<VatPeriod[]>(generatePeriodData);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "2026-01-01",
    to: "2026-03-31",
  });
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Mar 2026");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<VatTransaction | null>(null);
  const [activeTab, setActiveTab] = useState<
    "summary" | "transactions" | "analysis"
  >("summary");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (dateRange.from) {
      result = result.filter((t) => t.date >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((t) => t.date <= dateRange.to);
    }
    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.invoiceNumber.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.customerSupplier.toLowerCase().includes(query),
      );
    }

    return result;
  }, [transactions, dateRange, typeFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculations
  const totals = useMemo(() => {
    const outputVat = filteredTransactions
      .filter((t) => t.type === "sales")
      .reduce((sum, t) => sum + t.vatAmount, 0);
    const inputVat = filteredTransactions
      .filter((t) => t.type === "purchase" || t.type === "expense")
      .reduce((sum, t) => sum + t.vatAmount, 0);
    const netVat = outputVat - inputVat;
    const totalTaxable = filteredTransactions.reduce(
      (sum, t) => sum + t.taxableAmount,
      0,
    );

    return {
      outputVat,
      inputVat,
      netVat,
      totalTaxable,
      transactionsCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Chart data
  const monthlyTrendData = periodData.map((p) => ({
    month: p.period,
    outputVat: p.outputVat,
    inputVat: p.inputVat,
    netVat: p.netVat,
  }));

  const currentPeriod =
    periodData.find((p) => p.period === selectedPeriod) || periodData[2];

  const categoryData = [
    { name: "Output VAT (Sales)", value: totals.outputVat, color: "#10B981" },
    { name: "Input VAT (Purchases)", value: totals.inputVat, color: "#3B82F6" },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  const handleViewDetails = (transaction: VatTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Date",
      "Invoice #",
      "Description",
      "Type",
      "Customer/Supplier",
      "Taxable Amount",
      "VAT Amount",
      "Status",
    ];
    const csvData = filteredTransactions.map((t) => [
      formatDate(t.date),
      t.invoiceNumber,
      t.description,
      t.type === "sales" ? "Sales (Output)" : "Purchase/Expense (Input)",
      t.customerSupplier,
      t.taxableAmount.toString(),
      t.vatAmount.toString(),
      t.vatStatus,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vat-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setDateRange({ from: "2026-01-01", to: "2026-03-31" });
    setTypeFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
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
              <Receipt className="h-6 w-6" />
              VAT/GST Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Value Added Tax analysis and reporting
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Output VAT (Sales)
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.outputVat)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              VAT collected from customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Input VAT (Purchases)
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totals.inputVat)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              VAT paid to suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net VAT Payable</p>
                <p
                  className={`text-2xl font-bold ${totals.netVat >= 0 ? "text-orange-600" : "text-green-600"}`}
                >
                  {formatCurrency(Math.abs(totals.netVat))}
                  {totals.netVat >= 0 ? " payable" : " refundable"}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totals.netVat >= 0
                ? "Amount due to tax authority"
                : "Amount reclaimable"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Effective VAT Rate
                </p>
                <p className="text-2xl font-bold">
                  {totals.totalTaxable > 0
                    ? ((totals.netVat / totals.totalTaxable) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Net VAT as % of taxable supplies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Date Range and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice #, description, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="sales">Sales (Output VAT)</SelectItem>
                <SelectItem value="purchase">Purchases (Input VAT)</SelectItem>
                <SelectItem value="expense">Expenses (Input VAT)</SelectItem>
              </SelectContent>
            </Select>
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
          <TabsTrigger value="summary">Summary Report</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Details</TabsTrigger>
          <TabsTrigger value="analysis">VAT Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly VAT Trend</CardTitle>
              <CardDescription>
                Output VAT vs Input VAT by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ReBarChart data={monthlyTrendData}>
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
                  <Bar dataKey="outputVat" fill="#10B981" name="Output VAT" />
                  <Bar dataKey="inputVat" fill="#3B82F6" name="Input VAT" />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Period Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Current Period Summary
                </CardTitle>
                <CardDescription>{selectedPeriod}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Output VAT</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(currentPeriod.outputVat)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Input VAT</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(currentPeriod.inputVat)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-semibold">Net VAT Payable</span>
                    <span
                      className={`text-xl font-bold ${currentPeriod.netVat >= 0 ? "text-orange-600" : "text-green-600"}`}
                    >
                      {formatCurrency(Math.abs(currentPeriod.netVat))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      VAT Returns Filed
                    </span>
                    <span className="text-xl font-bold">
                      {currentPeriod.filings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Payments Made</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(currentPeriod.payments)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">VAT Composition</CardTitle>
                <CardDescription>Output vs Input VAT breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={categoryData}
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
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Input VAT represents{" "}
                    {totals.inputVat > 0
                      ? ((totals.inputVat / totals.outputVat) * 100).toFixed(1)
                      : 0}
                    % of Output VAT
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer/Supplier</TableHead>
                      <TableHead className="text-right">
                        Taxable Amount
                      </TableHead>
                      <TableHead className="text-right">VAT Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Receipt className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No transactions found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.invoiceNumber}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {getTransactionTypeBadge(transaction.type)}
                          </TableCell>
                          <TableCell>{transaction.customerSupplier}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(transaction.taxableAmount)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(transaction.vatAmount)}
                          </TableCell>
                          <TableCell>
                            {getVatStatusBadge(transaction.vatStatus)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(transaction)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredTransactions.length > 0 && (
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
                        filteredTransactions.length,
                      )}{" "}
                      of {filteredTransactions.length}
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
            {/* Monthly Net VAT Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net VAT Trend</CardTitle>
                <CardDescription>
                  Monthly net VAT payable/refundable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
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
                      dataKey="netVat"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                      name="Net VAT"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* VAT Ratio Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">VAT Ratio Analysis</CardTitle>
                <CardDescription>Input VAT recovery rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Input VAT Recovery Rate</span>
                      <span className="font-medium">
                        {totals.inputVat > 0
                          ? (
                              (totals.inputVat / totals.outputVat) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((totals.inputVat / totals.outputVat) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>VAT to Revenue Ratio</span>
                      <span className="font-medium">
                        {totals.totalTaxable > 0
                          ? (
                              (totals.outputVat / totals.totalTaxable) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((totals.outputVat / totals.totalTaxable) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      VAT Compliance Summary
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Total VAT Returns:</span>
                        <span className="font-medium">
                          {periodData.reduce((sum, p) => sum + p.filings, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>On-time Filings:</span>
                        <span className="font-medium text-green-600">
                          {periodData.filter((p) => p.filings > 0).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total VAT Paid:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            periodData.reduce((sum, p) => sum + p.payments, 0),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Customers by VAT */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Top Customers (Output VAT)
                </CardTitle>
                <CardDescription>
                  Highest VAT contributing customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions
                    .filter((t) => t.type === "sales")
                    .reduce(
                      (acc, t) => {
                        const existing = acc.find(
                          (item) => item.customer === t.customerSupplier,
                        );
                        if (existing) {
                          existing.vatAmount += t.vatAmount;
                        } else {
                          acc.push({
                            customer: t.customerSupplier,
                            vatAmount: t.vatAmount,
                          });
                        }
                        return acc;
                      },
                      [] as { customer: string; vatAmount: number }[],
                    )
                    .sort((a, b) => b.vatAmount - a.vatAmount)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            Customer
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(item.vatAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            VAT contributed
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Suppliers by VAT */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Top Suppliers (Input VAT)
                </CardTitle>
                <CardDescription>Highest VAT from suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions
                    .filter(
                      (t) => t.type === "purchase" || t.type === "expense",
                    )
                    .reduce(
                      (acc, t) => {
                        const existing = acc.find(
                          (item) => item.supplier === t.customerSupplier,
                        );
                        if (existing) {
                          existing.vatAmount += t.vatAmount;
                        } else {
                          acc.push({
                            supplier: t.customerSupplier,
                            vatAmount: t.vatAmount,
                          });
                        }
                        return acc;
                      },
                      [] as { supplier: string; vatAmount: number }[],
                    )
                    .sort((a, b) => b.vatAmount - a.vatAmount)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.supplier}</p>
                          <p className="text-xs text-muted-foreground">
                            Supplier/Vendor
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            {formatCurrency(item.vatAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Input VAT
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedTransaction.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-mono text-sm">
                    {selectedTransaction.invoiceNumber}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedTransaction.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  {getTransactionTypeBadge(selectedTransaction.type)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Customer/Supplier
                  </p>
                  <p>{selectedTransaction.customerSupplier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Taxable Amount
                  </p>
                  <p className="font-medium">
                    {formatCurrency(selectedTransaction.taxableAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VAT Rate</p>
                  <p>{selectedTransaction.rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VAT Amount</p>
                  <p className="font-bold text-purple-600">
                    {formatCurrency(selectedTransaction.vatAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getVatStatusBadge(selectedTransaction.vatStatus)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
