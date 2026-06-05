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
  Search,
  Filter,
  Calendar,
  DollarSign,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Scale,
  TrendingUp,
  TrendingDown,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
interface TrialBalanceAccount {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: "asset" | "liability" | "equity" | "revenue" | "expense";
  category: string;
  openingBalance: {
    debit: number;
    credit: number;
  };
  transactions: {
    debit: number;
    credit: number;
  };
  closingBalance: {
    debit: number;
    credit: number;
  };
}

interface TrialBalanceReport {
  asOfDate: string;
  accounts: TrialBalanceAccount[];
  totals: {
    openingDebit: number;
    openingCredit: number;
    transactionDebit: number;
    transactionCredit: number;
    closingDebit: number;
    closingCredit: number;
  };
  isBalanced: boolean;
  difference: number;
}

// Mock Data
const mockAccounts: TrialBalanceAccount[] = [
  // Assets
  {
    id: 1,
    accountCode: "1110",
    accountName: "Cash - Operating",
    accountType: "asset",
    category: "Current Assets",
    openingBalance: { debit: 35000000, credit: 0 },
    transactions: { debit: 15000000, credit: 8000000 },
    closingBalance: { debit: 42000000, credit: 0 },
  },
  {
    id: 2,
    accountCode: "1120",
    accountName: "Cash - Savings",
    accountType: "asset",
    category: "Current Assets",
    openingBalance: { debit: 50000000, credit: 0 },
    transactions: { debit: 5000000, credit: 2000000 },
    closingBalance: { debit: 53000000, credit: 0 },
  },
  {
    id: 3,
    accountCode: "1130",
    accountName: "Accounts Receivable",
    accountType: "asset",
    category: "Current Assets",
    openingBalance: { debit: 15000000, credit: 0 },
    transactions: { debit: 35000000, credit: 28000000 },
    closingBalance: { debit: 22000000, credit: 0 },
  },
  {
    id: 4,
    accountCode: "1140",
    accountName: "Inventory",
    accountType: "asset",
    category: "Current Assets",
    openingBalance: { debit: 6000000, credit: 0 },
    transactions: { debit: 2000000, credit: 0 },
    closingBalance: { debit: 8000000, credit: 0 },
  },
  {
    id: 5,
    accountCode: "1150",
    accountName: "Prepaid Expenses",
    accountType: "asset",
    category: "Current Assets",
    openingBalance: { debit: 1500000, credit: 0 },
    transactions: { debit: 500000, credit: 0 },
    closingBalance: { debit: 2000000, credit: 0 },
  },
  {
    id: 6,
    accountCode: "1210",
    accountName: "Equipment",
    accountType: "asset",
    category: "Fixed Assets",
    openingBalance: { debit: 20000000, credit: 0 },
    transactions: { debit: 4500000, credit: 0 },
    closingBalance: { debit: 24500000, credit: 0 },
  },
  {
    id: 7,
    accountCode: "1220",
    accountName: "Accumulated Depreciation",
    accountType: "asset",
    category: "Fixed Assets",
    openingBalance: { debit: 0, credit: 5000000 },
    transactions: { debit: 0, credit: 1250000 },
    closingBalance: { debit: 0, credit: 6250000 },
  },

  // Liabilities
  {
    id: 8,
    accountCode: "2100",
    accountName: "Accounts Payable",
    accountType: "liability",
    category: "Current Liabilities",
    openingBalance: { debit: 0, credit: 10000000 },
    transactions: { debit: 7000000, credit: 12000000 },
    closingBalance: { debit: 0, credit: 15000000 },
  },
  {
    id: 9,
    accountCode: "2110",
    accountName: "Accrued Expenses",
    accountType: "liability",
    category: "Current Liabilities",
    openingBalance: { debit: 0, credit: 2000000 },
    transactions: { debit: 500000, credit: 1500000 },
    closingBalance: { debit: 0, credit: 3000000 },
  },
  {
    id: 10,
    accountCode: "2120",
    accountName: "Short-term Loans",
    accountType: "liability",
    category: "Current Liabilities",
    openingBalance: { debit: 0, credit: 5000000 },
    transactions: { debit: 0, credit: 0 },
    closingBalance: { debit: 0, credit: 5000000 },
  },
  {
    id: 11,
    accountCode: "2130",
    accountName: "Tax Payable",
    accountType: "liability",
    category: "Current Liabilities",
    openingBalance: { debit: 0, credit: 2000000 },
    transactions: { debit: 0, credit: 500000 },
    closingBalance: { debit: 0, credit: 2500000 },
  },
  {
    id: 12,
    accountCode: "2200",
    accountName: "Bank Loans",
    accountType: "liability",
    category: "Long-term Liabilities",
    openingBalance: { debit: 0, credit: 55000000 },
    transactions: { debit: 5000000, credit: 0 },
    closingBalance: { debit: 0, credit: 50000000 },
  },
  {
    id: 13,
    accountCode: "2210",
    accountName: "Lease Liabilities",
    accountType: "liability",
    category: "Long-term Liabilities",
    openingBalance: { debit: 0, credit: 15000000 },
    transactions: { debit: 0, credit: 0 },
    closingBalance: { debit: 0, credit: 15000000 },
  },

  // Equity
  {
    id: 14,
    accountCode: "3100",
    accountName: "Share Capital",
    accountType: "equity",
    category: "Equity",
    openingBalance: { debit: 0, credit: 100000000 },
    transactions: { debit: 0, credit: 0 },
    closingBalance: { debit: 0, credit: 100000000 },
  },
  {
    id: 15,
    accountCode: "3200",
    accountName: "Retained Earnings",
    accountType: "equity",
    category: "Equity",
    openingBalance: { debit: 0, credit: 35000000 },
    transactions: { debit: 0, credit: 15000000 },
    closingBalance: { debit: 0, credit: 50000000 },
  },
  {
    id: 16,
    accountCode: "3300",
    accountName: "Revaluation Reserve",
    accountType: "equity",
    category: "Equity",
    openingBalance: { debit: 0, credit: 5000000 },
    transactions: { debit: 0, credit: 0 },
    closingBalance: { debit: 0, credit: 5000000 },
  },

  // Revenue
  {
    id: 17,
    accountCode: "4000",
    accountName: "Product Sales",
    accountType: "revenue",
    category: "Revenue",
    openingBalance: { debit: 0, credit: 50000000 },
    transactions: { debit: 0, credit: 7500000 },
    closingBalance: { debit: 0, credit: 57500000 },
  },
  {
    id: 18,
    accountCode: "4100",
    accountName: "Service Revenue",
    accountType: "revenue",
    category: "Revenue",
    openingBalance: { debit: 0, credit: 20000000 },
    transactions: { debit: 0, credit: 3800000 },
    closingBalance: { debit: 0, credit: 23800000 },
  },

  // Expenses
  {
    id: 19,
    accountCode: "5100",
    accountName: "Cost of Goods Sold",
    accountType: "expense",
    category: "Cost of Sales",
    openingBalance: { debit: 20000000, credit: 0 },
    transactions: { debit: 3500000, credit: 0 },
    closingBalance: { debit: 23500000, credit: 0 },
  },
  {
    id: 20,
    accountCode: "6100",
    accountName: "Salaries Expense",
    accountType: "expense",
    category: "Operating Expenses",
    openingBalance: { debit: 20000000, credit: 0 },
    transactions: { debit: 3000000, credit: 0 },
    closingBalance: { debit: 23000000, credit: 0 },
  },
  {
    id: 21,
    accountCode: "6200",
    accountName: "Rent Expense",
    accountType: "expense",
    category: "Operating Expenses",
    openingBalance: { debit: 8000000, credit: 0 },
    transactions: { debit: 1200000, credit: 0 },
    closingBalance: { debit: 9200000, credit: 0 },
  },
  {
    id: 22,
    accountCode: "6300",
    accountName: "Utilities Expense",
    accountType: "expense",
    category: "Operating Expenses",
    openingBalance: { debit: 5000000, credit: 0 },
    transactions: { debit: 850000, credit: 0 },
    closingBalance: { debit: 5850000, credit: 0 },
  },
  {
    id: 23,
    accountCode: "6400",
    accountName: "Marketing Expense",
    accountType: "expense",
    category: "Operating Expenses",
    openingBalance: { debit: 3000000, credit: 0 },
    transactions: { debit: 1500000, credit: 0 },
    closingBalance: { debit: 4500000, credit: 0 },
  },
  {
    id: 24,
    accountCode: "6500",
    accountName: "Depreciation Expense",
    accountType: "expense",
    category: "Operating Expenses",
    openingBalance: { debit: 3000000, credit: 0 },
    transactions: { debit: 1250000, credit: 0 },
    closingBalance: { debit: 4250000, credit: 0 },
  },
];

const accountTypes = [
  { value: "asset", label: "Assets" },
  { value: "liability", label: "Liabilities" },
  { value: "equity", label: "Equity" },
  { value: "revenue", label: "Revenue" },
  { value: "expense", label: "Expenses" },
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
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getAccountTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    asset: "bg-blue-100 text-blue-700",
    liability: "bg-red-100 text-red-700",
    equity: "bg-green-100 text-green-700",
    revenue: "bg-purple-100 text-purple-700",
    expense: "bg-orange-100 text-orange-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

export default function TrialBalance() {
  const router = useRouter();

  // State
  const [accounts] = useState<TrialBalanceAccount[]>(mockAccounts);
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] =
    useState<TrialBalanceAccount | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"trial_balance" | "analysis">(
    "trial_balance",
  );

  // Calculate totals
  const totals = useMemo(() => {
    const openingDebit = accounts.reduce(
      (sum, a) => sum + a.openingBalance.debit,
      0,
    );
    const openingCredit = accounts.reduce(
      (sum, a) => sum + a.openingBalance.credit,
      0,
    );
    const transactionDebit = accounts.reduce(
      (sum, a) => sum + a.transactions.debit,
      0,
    );
    const transactionCredit = accounts.reduce(
      (sum, a) => sum + a.transactions.credit,
      0,
    );
    const closingDebit = accounts.reduce(
      (sum, a) => sum + a.closingBalance.debit,
      0,
    );
    const closingCredit = accounts.reduce(
      (sum, a) => sum + a.closingBalance.credit,
      0,
    );

    const isBalanced = closingDebit === closingCredit;
    const difference = Math.abs(closingDebit - closingCredit);

    return {
      openingDebit,
      openingCredit,
      transactionDebit,
      transactionCredit,
      closingDebit,
      closingCredit,
      isBalanced,
      difference,
    };
  }, [accounts]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(accounts.map((a) => a.category));
    return ["all", ...Array.from(cats)];
  }, [accounts]);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountCode.toLowerCase().includes(query) ||
          a.accountName.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((a) => a.accountType === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    return result;
  }, [accounts, searchQuery, typeFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Chart data
  const balanceByTypeData = useMemo(() => {
    const byType: Record<string, number> = {};
    accounts.forEach((account) => {
      const balance =
        account.closingBalance.debit - account.closingBalance.credit;
      const absBalance = Math.abs(balance);
      byType[account.accountType] =
        (byType[account.accountType] || 0) + absBalance;
    });
    return Object.entries(byType).map(([type, value]) => ({
      name: accountTypes.find((t) => t.value === type)?.label || type,
      value,
    }));
  }, [accounts]);

  const categoryData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    accounts.forEach((account) => {
      const balance =
        account.closingBalance.debit - account.closingBalance.credit;
      byCategory[account.category] =
        (byCategory[account.category] || 0) + Math.abs(balance);
    });
    return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  }, [accounts]);

  const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  const handleViewDetails = (account: TrialBalanceAccount) => {
    setSelectedAccount(account);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Account Code",
      "Account Name",
      "Type",
      "Category",
      "Opening Debit",
      "Opening Credit",
      "Transaction Debit",
      "Transaction Credit",
      "Closing Debit",
      "Closing Credit",
    ];
    const csvData = filteredAccounts.map((a) => [
      a.accountCode,
      a.accountName,
      a.accountType,
      a.category,
      a.openingBalance.debit.toString(),
      a.openingBalance.credit.toString(),
      a.transactions.debit.toString(),
      a.transactions.credit.toString(),
      a.closingBalance.debit.toString(),
      a.closingBalance.credit.toString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-${asOfDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
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
              <Scale className="h-6 w-6" />
              Trial Balance
            </h1>
            <p className="text-muted-foreground mt-1">
              As of {formatDate(asOfDate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
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

      {/* Balance Status Alert */}
      {!totals.isBalanced && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">
                  Trial Balance is Out of Balance!
                </p>
                <p className="text-sm">
                  Difference: {formatCurrency(totals.difference)}. Please review
                  journal entries for errors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totals.closingDebit)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.closingCredit)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Period Activity</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totals.transactionDebit)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </div>
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
                placeholder="Search by account code or name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
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
          <TabsTrigger value="trial_balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trial_balance" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">
                        Opening Balance
                      </TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">
                        Closing Balance
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Scale className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No accounts found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAccounts.map((account) => {
                        const openingBalance =
                          account.openingBalance.debit -
                          account.openingBalance.credit;
                        const transactionBalance =
                          account.transactions.debit -
                          account.transactions.credit;
                        const closingBalance =
                          account.closingBalance.debit -
                          account.closingBalance.credit;

                        return (
                          <TableRow key={account.id}>
                            <TableCell className="font-mono text-xs">
                              {account.accountCode}
                            </TableCell>
                            <TableCell className="font-medium">
                              {account.accountName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getAccountTypeColor(
                                  account.accountType,
                                )}
                              >
                                {account.accountType}
                              </Badge>
                            </TableCell>
                            <TableCell>{account.category}</TableCell>
                            <TableCell
                              className={`text-right font-medium ${openingBalance > 0 ? "text-blue-600" : openingBalance < 0 ? "text-green-600" : ""}`}
                            >
                              {openingBalance !== 0
                                ? formatCurrency(Math.abs(openingBalance))
                                : "-"}
                              {openingBalance > 0 && " DR"}
                              {openingBalance < 0 && " CR"}
                            </TableCell>
                            <TableCell
                              className={`text-right ${transactionBalance > 0 ? "text-blue-600" : transactionBalance < 0 ? "text-green-600" : ""}`}
                            >
                              {transactionBalance !== 0
                                ? formatCurrency(Math.abs(transactionBalance))
                                : "-"}
                              {transactionBalance > 0 && " DR"}
                              {transactionBalance < 0 && " CR"}
                            </TableCell>
                            <TableCell
                              className={`text-right font-bold ${closingBalance > 0 ? "text-blue-600" : closingBalance < 0 ? "text-green-600" : ""}`}
                            >
                              {closingBalance !== 0
                                ? formatCurrency(Math.abs(closingBalance))
                                : "-"}
                              {closingBalance > 0
                                ? " DR"
                                : closingBalance < 0
                                  ? " CR"
                                  : ""}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(account)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                  {/* Totals Row */}
                  <TableHeader>
                    <TableRow className="border-t-2 font-bold bg-muted/50">
                      <TableCell colSpan={4} className="text-right">
                        Totals:
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totals.openingDebit)} DR /{" "}
                        {formatCurrency(totals.openingCredit)} CR
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totals.transactionDebit)} DR /{" "}
                        {formatCurrency(totals.transactionCredit)} CR
                      </TableCell>
                      <TableCell
                        className={`text-right ${totals.isBalanced ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(totals.closingDebit)} DR /{" "}
                        {formatCurrency(totals.closingCredit)} CR
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Pagination */}
              {filteredAccounts.length > 0 && (
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
                        filteredAccounts.length,
                      )}{" "}
                      of {filteredAccounts.length}
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
            {/* Balance by Account Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Balance by Account Type
                </CardTitle>
                <CardDescription>
                  Distribution of balances across account types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={balanceByTypeData}
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
                      {balanceByTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Distribution</CardTitle>
                <CardDescription>
                  Balance distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Account Type Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Type Summary</CardTitle>
                <CardDescription>
                  Balances by account classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accountTypes.map((type) => {
                    const typeAccounts = accounts.filter(
                      (a) => a.accountType === type.value,
                    );
                    const totalBalance = typeAccounts.reduce((sum, a) => {
                      const balance =
                        a.closingBalance.debit - a.closingBalance.credit;
                      return sum + balance;
                    }, 0);
                    return (
                      <div
                        key={type.value}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${getAccountTypeColor(type.value)}`}
                          >
                            {type.value === "asset" && (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            {type.value === "liability" && (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {type.value === "equity" && (
                              <Scale className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${totalBalance > 0 ? "text-blue-600" : totalBalance < 0 ? "text-green-600" : ""}`}
                          >
                            {formatCurrency(Math.abs(totalBalance))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {totalBalance > 0
                              ? "Debit Balance"
                              : totalBalance < 0
                                ? "Credit Balance"
                                : "Zero Balance"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Statistics</CardTitle>
                <CardDescription>Period summary metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Accounts:
                    </span>
                    <span className="font-bold">{accounts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Active Accounts:
                    </span>
                    <span className="font-bold text-green-600">
                      {
                        accounts.filter(
                          (a) =>
                            a.closingBalance.debit !== 0 ||
                            a.closingBalance.credit !== 0,
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Zero Balance Accounts:
                    </span>
                    <span className="font-bold text-gray-600">
                      {
                        accounts.filter(
                          (a) =>
                            a.closingBalance.debit === 0 &&
                            a.closingBalance.credit === 0,
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-muted-foreground">
                      Debit = Credit:
                    </span>
                    <span
                      className={`font-bold ${totals.isBalanced ? "text-green-600" : "text-red-600"}`}
                    >
                      {totals.isBalanced ? "✓ Balanced" : "✗ Out of Balance"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Account Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p className="font-mono text-lg">
                  {selectedAccount.accountCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="font-medium">{selectedAccount.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge
                  className={getAccountTypeColor(selectedAccount.accountType)}
                >
                  {selectedAccount.accountType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{selectedAccount.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Opening Balance
                  </p>
                  <p
                    className={`font-bold ${selectedAccount.openingBalance.debit > 0 ? "text-blue-600" : "text-green-600"}`}
                  >
                    {formatCurrency(
                      Math.abs(
                        selectedAccount.openingBalance.debit -
                          selectedAccount.openingBalance.credit,
                      ),
                    )}
                  </p>
                  <p className="text-xs">
                    {selectedAccount.openingBalance.debit > 0
                      ? "DR"
                      : selectedAccount.openingBalance.credit > 0
                        ? "CR"
                        : "-"}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Closing Balance
                  </p>
                  <p
                    className={`font-bold ${selectedAccount.closingBalance.debit > 0 ? "text-blue-600" : "text-green-600"}`}
                  >
                    {formatCurrency(
                      Math.abs(
                        selectedAccount.closingBalance.debit -
                          selectedAccount.closingBalance.credit,
                      ),
                    )}
                  </p>
                  <p className="text-xs">
                    {selectedAccount.closingBalance.debit > 0
                      ? "DR"
                      : selectedAccount.closingBalance.credit > 0
                        ? "CR"
                        : "-"}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Period Activity</p>
                <p className="font-bold">
                  {formatCurrency(
                    Math.abs(
                      selectedAccount.transactions.debit -
                        selectedAccount.transactions.credit,
                    ),
                  )}
                </p>
                <p className="text-xs">
                  {selectedAccount.transactions.debit >
                  selectedAccount.transactions.credit
                    ? "Net DR"
                    : selectedAccount.transactions.credit >
                        selectedAccount.transactions.debit
                      ? "Net CR"
                      : "-"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
