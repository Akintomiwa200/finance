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
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  Wallet,
  CreditCard,
  PiggyBank,
  Landmark,
  PieChart,
  BarChart3,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Scale,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart as ReBarChart,
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
type Period = "monthly" | "quarterly" | "yearly";

interface BalanceSheetItem {
  id: number;
  section: "assets" | "liabilities" | "equity";
  category: string;
  subcategory: string;
  accountCode: string;
  currentAmount: number;
  previousAmount: number;
  change: number;
  changePercent: number;
}

interface BalanceSheetSummary {
  totalCurrentAssets: number;
  totalFixedAssets: number;
  totalAssets: number;
  totalCurrentLiabilities: number;
  totalLongTermLiabilities: number;
  totalLiabilities: number;
  totalEquity: number;
  totalLiabilitiesEquity: number;
}

// Mock Data
const mockBalanceSheetItems: BalanceSheetItem[] = [
  // Current Assets
  {
    id: 1,
    section: "assets",
    category: "Current Assets",
    subcategory: "Cash - Operating",
    accountCode: "1110",
    currentAmount: 12500000,
    previousAmount: 10000000,
    change: 2500000,
    changePercent: 25,
  },
  {
    id: 2,
    section: "assets",
    category: "Current Assets",
    subcategory: "Cash - Savings",
    accountCode: "1120",
    currentAmount: 50000000,
    previousAmount: 50000000,
    change: 0,
    changePercent: 0,
  },
  {
    id: 3,
    section: "assets",
    category: "Current Assets",
    subcategory: "Accounts Receivable",
    accountCode: "1130",
    currentAmount: 25000000,
    previousAmount: 15000000,
    change: 10000000,
    changePercent: 66.7,
  },
  {
    id: 4,
    section: "assets",
    category: "Current Assets",
    subcategory: "Inventory",
    accountCode: "1140",
    currentAmount: 8000000,
    previousAmount: 6000000,
    change: 2000000,
    changePercent: 33.3,
  },
  {
    id: 5,
    section: "assets",
    category: "Current Assets",
    subcategory: "Prepaid Expenses",
    accountCode: "1150",
    currentAmount: 2000000,
    previousAmount: 1500000,
    change: 500000,
    changePercent: 33.3,
  },

  // Fixed Assets
  {
    id: 6,
    section: "assets",
    category: "Fixed Assets",
    subcategory: "Equipment",
    accountCode: "1210",
    currentAmount: 24500000,
    previousAmount: 20000000,
    change: 4500000,
    changePercent: 22.5,
  },
  {
    id: 7,
    section: "assets",
    category: "Fixed Assets",
    subcategory: "Furniture & Fixtures",
    accountCode: "1220",
    currentAmount: 5000000,
    previousAmount: 5000000,
    change: 0,
    changePercent: 0,
  },
  {
    id: 8,
    section: "assets",
    category: "Fixed Assets",
    subcategory: "Vehicles",
    accountCode: "1230",
    currentAmount: 35000000,
    previousAmount: 35000000,
    change: 0,
    changePercent: 0,
  },
  {
    id: 9,
    section: "assets",
    category: "Fixed Assets",
    subcategory: "Accumulated Depreciation",
    accountCode: "1290",
    currentAmount: -12000000,
    previousAmount: -8000000,
    change: -4000000,
    changePercent: -50,
  },
  {
    id: 10,
    section: "assets",
    category: "Fixed Assets",
    subcategory: "Intangible Assets",
    accountCode: "1300",
    currentAmount: 3000000,
    previousAmount: 2000000,
    change: 1000000,
    changePercent: 50,
  },

  // Current Liabilities
  {
    id: 11,
    section: "liabilities",
    category: "Current Liabilities",
    subcategory: "Accounts Payable",
    accountCode: "2100",
    currentAmount: 15000000,
    previousAmount: 10000000,
    change: 5000000,
    changePercent: 50,
  },
  {
    id: 12,
    section: "liabilities",
    category: "Current Liabilities",
    subcategory: "Accrued Expenses",
    accountCode: "2110",
    currentAmount: 3000000,
    previousAmount: 2000000,
    change: 1000000,
    changePercent: 50,
  },
  {
    id: 13,
    section: "liabilities",
    category: "Current Liabilities",
    subcategory: "Short-term Loans",
    accountCode: "2120",
    currentAmount: 5000000,
    previousAmount: 5000000,
    change: 0,
    changePercent: 0,
  },
  {
    id: 14,
    section: "liabilities",
    category: "Current Liabilities",
    subcategory: "Tax Payable",
    accountCode: "2130",
    currentAmount: 2500000,
    previousAmount: 2000000,
    change: 500000,
    changePercent: 25,
  },

  // Long-term Liabilities
  {
    id: 15,
    section: "liabilities",
    category: "Long-term Liabilities",
    subcategory: "Bank Loans",
    accountCode: "2200",
    currentAmount: 50000000,
    previousAmount: 55000000,
    change: -5000000,
    changePercent: -9.1,
  },
  {
    id: 16,
    section: "liabilities",
    category: "Long-term Liabilities",
    subcategory: "Lease Liabilities",
    accountCode: "2210",
    currentAmount: 15000000,
    previousAmount: 15000000,
    change: 0,
    changePercent: 0,
  },

  // Equity
  {
    id: 17,
    section: "equity",
    category: "Shareholders' Equity",
    subcategory: "Share Capital",
    accountCode: "3100",
    currentAmount: 100000000,
    previousAmount: 100000000,
    change: 0,
    changePercent: 0,
  },
  {
    id: 18,
    section: "equity",
    category: "Shareholders' Equity",
    subcategory: "Retained Earnings",
    accountCode: "3200",
    currentAmount: 50000000,
    previousAmount: 35000000,
    change: 15000000,
    changePercent: 42.9,
  },
  {
    id: 19,
    section: "equity",
    category: "Shareholders' Equity",
    subcategory: "Revaluation Reserve",
    accountCode: "3300",
    currentAmount: 5000000,
    previousAmount: 5000000,
    change: 0,
    changePercent: 0,
  },
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
  }).format(Math.abs(amount));
};

const formatPercentage = (value: number) => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const getChangeColor = (change: number, isLiability: boolean = false) => {
  // For assets, increase is good, decrease is bad
  // For liabilities, increase is bad, decrease is good
  if (isLiability) {
    if (change > 0) return "text-red-600";
    if (change < 0) return "text-green-600";
    return "text-gray-600";
  } else {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  }
};

export default function BalanceSheet() {
  const router = useRouter();

  // State
  const [balanceSheetItems] = useState<BalanceSheetItem[]>(
    mockBalanceSheetItems,
  );
  const [period, setPeriod] = useState<Period>("monthly");
  const [asOfDate, setAsOfDate] = useState("March 31, 2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<BalanceSheetItem | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"statement" | "analysis">(
    "statement",
  );

  // Calculate summary totals
  const summary = useMemo((): BalanceSheetSummary => {
    const currentAssets = balanceSheetItems
      .filter((i) => i.category === "Current Assets")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const fixedAssets = balanceSheetItems
      .filter((i) => i.category === "Fixed Assets")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const totalAssets = currentAssets + fixedAssets;

    const currentLiabilities = balanceSheetItems
      .filter((i) => i.category === "Current Liabilities")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const longTermLiabilities = balanceSheetItems
      .filter((i) => i.category === "Long-term Liabilities")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const totalLiabilities = currentLiabilities + longTermLiabilities;

    const totalEquity = balanceSheetItems
      .filter((i) => i.section === "equity")
      .reduce((sum, i) => sum + i.currentAmount, 0);

    const totalLiabilitiesEquity = totalLiabilities + totalEquity;

    return {
      totalCurrentAssets: currentAssets,
      totalFixedAssets: fixedAssets,
      totalAssets,
      totalCurrentLiabilities: currentLiabilities,
      totalLongTermLiabilities: longTermLiabilities,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesEquity,
    };
  }, [balanceSheetItems]);

  // Financial Ratios
  const ratios = useMemo(() => {
    const currentRatio =
      summary.totalCurrentLiabilities > 0
        ? summary.totalCurrentAssets / summary.totalCurrentLiabilities
        : 0;

    const quickAssets =
      summary.totalCurrentAssets -
      (balanceSheetItems.find((i) => i.subcategory === "Inventory")
        ?.currentAmount || 0);
    const quickRatio =
      summary.totalCurrentLiabilities > 0
        ? quickAssets / summary.totalCurrentLiabilities
        : 0;

    const debtToEquity =
      summary.totalEquity > 0
        ? summary.totalLiabilities / summary.totalEquity
        : 0;

    const equityRatio =
      summary.totalAssets > 0 ? summary.totalEquity / summary.totalAssets : 0;

    const workingCapital =
      summary.totalCurrentAssets - summary.totalCurrentLiabilities;

    return {
      currentRatio,
      quickRatio,
      debtToEquity,
      equityRatio,
      workingCapital,
    };
  }, [summary, balanceSheetItems]);

  // Chart data
  const assetsComposition = [
    {
      name: "Current Assets",
      value: summary.totalCurrentAssets,
      color: "#10B981",
    },
    { name: "Fixed Assets", value: summary.totalFixedAssets, color: "#3B82F6" },
  ];

  const liabilitiesComposition = [
    {
      name: "Current Liabilities",
      value: summary.totalCurrentLiabilities,
      color: "#F59E0B",
    },
    {
      name: "Long-term Liabilities",
      value: summary.totalLongTermLiabilities,
      color: "#EF4444",
    },
  ];

  const capitalStructure = [
    { name: "Liabilities", value: summary.totalLiabilities, color: "#F59E0B" },
    { name: "Equity", value: summary.totalEquity, color: "#10B981" },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Filtered items
  const filteredItems = useMemo(() => {
    let result = [...balanceSheetItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.subcategory.toLowerCase().includes(query) ||
          item.accountCode.toLowerCase().includes(query),
      );
    }

    if (sectionFilter !== "all") {
      result = result.filter((item) => item.section === sectionFilter);
    }

    return result;
  }, [balanceSheetItems, searchQuery, sectionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleViewDetails = (item: BalanceSheetItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Section",
      "Category",
      "Subcategory",
      "Account Code",
      "Current Period",
      "Previous Period",
      "Change",
      "Change %",
    ];
    const csvData = filteredItems.map((item) => [
      item.section,
      item.category,
      item.subcategory,
      item.accountCode,
      item.currentAmount.toString(),
      item.previousAmount.toString(),
      item.change.toString(),
      `${item.changePercent.toFixed(1)}%`,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `balance-sheet-${asOfDate.replace(/\s/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setSectionFilter("all");
    setCurrentPage(1);
  };

  const verifyBalance = summary.totalAssets === summary.totalLiabilitiesEquity;

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
              <Scale className="h-6 w-6" />
              Balance Sheet
            </h1>
            <p className="text-muted-foreground mt-1">As of {asOfDate}</p>
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
            <Select value={asOfDate} onValueChange={setAsOfDate}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="March 31, 2026">March 31, 2026</SelectItem>
                <SelectItem value="December 31, 2025">
                  December 31, 2025
                </SelectItem>
                <SelectItem value="September 30, 2025">
                  September 30, 2025
                </SelectItem>
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

      {/* Balance Verification Alert */}
      {!verifyBalance && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">
                  Balance Sheet is Out of Balance!
                </p>
                <p className="text-sm">
                  Assets ({formatCurrency(summary.totalAssets)}) do not equal
                  Liabilities + Equity (
                  {formatCurrency(summary.totalLiabilitiesEquity)})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalAssets)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Liabilities
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.totalLiabilities)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Equity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summary.totalEquity)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <PiggyBank className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Working Capital</p>
                <p
                  className={`text-2xl font-bold ${ratios.workingCapital >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(ratios.workingCapital))}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Current Ratio</p>
            <p className="text-xl font-bold">
              {ratios.currentRatio.toFixed(2)}
            </p>
            <p className="text-xs">Current Assets / Current Liabilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Quick Ratio</p>
            <p className="text-xl font-bold">{ratios.quickRatio.toFixed(2)}</p>
            <p className="text-xs">
              (Current Assets - Inventory) / Current Liabilities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Debt to Equity</p>
            <p className="text-xl font-bold">
              {ratios.debtToEquity.toFixed(2)}
            </p>
            <p className="text-xs">Total Liabilities / Total Equity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Equity Ratio</p>
            <p className="text-xl font-bold">
              {ratios.equityRatio.toFixed(1)}%
            </p>
            <p className="text-xs">Total Equity / Total Assets</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subcategory, account code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={sectionFilter}
              onValueChange={(v) => {
                setSectionFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="assets">Assets</SelectItem>
                <SelectItem value="liabilities">Liabilities</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
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
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="statement">Balance Sheet</TabsTrigger>
          <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="statement" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Account Code</TableHead>
                      <TableHead className="text-right">
                        Current Period
                      </TableHead>
                      <TableHead className="text-right">
                        Previous Period
                      </TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Change %</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
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
                          <TableCell className="capitalize">
                            {item.section}
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="font-medium">
                            {item.subcategory}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.accountCode}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.currentAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.previousAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${getChangeColor(item.change, item.section === "liabilities")}`}
                          >
                            {item.change >= 0 ? "+" : "-"}
                            {formatCurrency(Math.abs(item.change))}
                          </TableCell>
                          <TableCell
                            className={`text-right ${getChangeColor(item.change, item.section === "liabilities")}`}
                          >
                            {formatPercentage(item.changePercent)}
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
                  {/* Summary Rows */}
                  <TableHeader>
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Current Assets
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalCurrentAssets)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Fixed Assets
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalFixedAssets)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="border-b-2 font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Assets
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(summary.totalAssets)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Current Liabilities
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalCurrentLiabilities)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Long-term Liabilities
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.totalLongTermLiabilities)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="border-b-2 font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Liabilities
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(summary.totalLiabilities)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Equity
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(summary.totalEquity)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={4} className="text-right">
                        Total Liabilities & Equity
                      </TableCell>
                      <TableCell
                        className={`text-right text-lg ${summary.totalAssets === summary.totalLiabilitiesEquity ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(summary.totalLiabilitiesEquity)}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell></TableCell>
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

        <TabsContent value="analysis" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assets Composition</CardTitle>
                <CardDescription>Breakdown of total assets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={assetsComposition}
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
                      {assetsComposition.map((entry, index) => (
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

            {/* Liabilities Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Liabilities Composition
                </CardTitle>
                <CardDescription>
                  Breakdown of total liabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={liabilitiesComposition}
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
                      {liabilitiesComposition.map((entry, index) => (
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

            {/* Capital Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capital Structure</CardTitle>
                <CardDescription>Liabilities vs Equity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={capitalStructure}
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
                      {capitalStructure.map((entry, index) => (
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

            {/* Ratio Analysis Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ratio Analysis</CardTitle>
                <CardDescription>
                  Key financial health indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        Current Ratio ({ratios.currentRatio.toFixed(2)})
                      </span>
                      <span
                        className={
                          ratios.currentRatio >= 2
                            ? "text-green-600"
                            : ratios.currentRatio >= 1.5
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {ratios.currentRatio >= 2
                          ? "Good"
                          : ratios.currentRatio >= 1.5
                            ? "Fair"
                            : "Poor"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${ratios.currentRatio >= 2 ? "bg-green-500" : ratios.currentRatio >= 1.5 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{
                          width: `${Math.min((ratios.currentRatio / 3) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quick Ratio ({ratios.quickRatio.toFixed(2)})</span>
                      <span
                        className={
                          ratios.quickRatio >= 1.5
                            ? "text-green-600"
                            : ratios.quickRatio >= 1
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {ratios.quickRatio >= 1.5
                          ? "Good"
                          : ratios.quickRatio >= 1
                            ? "Fair"
                            : "Poor"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${ratios.quickRatio >= 1.5 ? "bg-green-500" : ratios.quickRatio >= 1 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{
                          width: `${Math.min((ratios.quickRatio / 2.5) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        Debt to Equity ({ratios.debtToEquity.toFixed(2)})
                      </span>
                      <span
                        className={
                          ratios.debtToEquity <= 1
                            ? "text-green-600"
                            : ratios.debtToEquity <= 2
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {ratios.debtToEquity <= 1
                          ? "Good"
                          : ratios.debtToEquity <= 2
                            ? "Fair"
                            : "Poor"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${ratios.debtToEquity <= 1 ? "bg-green-500" : ratios.debtToEquity <= 2 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{
                          width: `${Math.min((ratios.debtToEquity / 3) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="font-medium">{selectedItem.subcategory}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p className="capitalize">{selectedItem.section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p className="font-mono">{selectedItem.accountCode}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Current Period
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.currentAmount)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Previous Period
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.previousAmount)}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Change</p>
                <p
                  className={`text-xl font-bold ${getChangeColor(selectedItem.change, selectedItem.section === "liabilities")}`}
                >
                  {selectedItem.change >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(selectedItem.change))}
                </p>
                <p className="text-sm">
                  ({formatPercentage(selectedItem.changePercent)})
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
