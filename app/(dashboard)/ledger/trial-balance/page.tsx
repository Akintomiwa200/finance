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
  Search,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Wallet,
  CreditCard,
  PiggyBank,
  BarChart3,
  PieChart,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2,
  Landmark,
  Receipt,
  Scale,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";
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
interface TrialBalanceAccount {
  accountId: number;
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

// Mock Data Generator
const generateTrialBalance = (asOfDate: string): TrialBalanceReport => {
  const accounts: TrialBalanceAccount[] = [
    // Assets
    {
      accountId: 1,
      accountCode: "1110",
      accountName: "Cash - Operating",
      accountType: "asset",
      category: "Current Assets",
      openingBalance: { debit: 35000000, credit: 0 },
      transactions: { debit: 15000000, credit: 8000000 },
      closingBalance: { debit: 42000000, credit: 0 },
    },
    {
      accountId: 2,
      accountCode: "1120",
      accountName: "Cash - Savings",
      accountType: "asset",
      category: "Current Assets",
      openingBalance: { debit: 50000000, credit: 0 },
      transactions: { debit: 5000000, credit: 2000000 },
      closingBalance: { debit: 53000000, credit: 0 },
    },
    {
      accountId: 3,
      accountCode: "1130",
      accountName: "Accounts Receivable",
      accountType: "asset",
      category: "Current Assets",
      openingBalance: { debit: 15000000, credit: 0 },
      transactions: { debit: 35000000, credit: 28000000 },
      closingBalance: { debit: 22000000, credit: 0 },
    },
    {
      accountId: 4,
      accountCode: "1210",
      accountName: "Equipment",
      accountType: "asset",
      category: "Fixed Assets",
      openingBalance: { debit: 20000000, credit: 0 },
      transactions: { debit: 4500000, credit: 0 },
      closingBalance: { debit: 24500000, credit: 0 },
    },
    {
      accountId: 5,
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
      accountId: 6,
      accountCode: "2100",
      accountName: "Accounts Payable",
      accountType: "liability",
      category: "Current Liabilities",
      openingBalance: { debit: 0, credit: 10000000 },
      transactions: { debit: 7000000, credit: 12000000 },
      closingBalance: { debit: 0, credit: 15000000 },
    },
    {
      accountId: 7,
      accountCode: "2200",
      accountName: "Bank Loans",
      accountType: "liability",
      category: "Long-term Liabilities",
      openingBalance: { debit: 0, credit: 55000000 },
      transactions: { debit: 5000000, credit: 0 },
      closingBalance: { debit: 0, credit: 50000000 },
    },
    // Equity
    {
      accountId: 8,
      accountCode: "3100",
      accountName: "Share Capital",
      accountType: "equity",
      category: "Equity",
      openingBalance: { debit: 0, credit: 100000000 },
      transactions: { debit: 0, credit: 0 },
      closingBalance: { debit: 0, credit: 100000000 },
    },
    {
      accountId: 9,
      accountCode: "3200",
      accountName: "Retained Earnings",
      accountType: "equity",
      category: "Equity",
      openingBalance: { debit: 0, credit: 35000000 },
      transactions: { debit: 1250000, credit: 0 },
      closingBalance: { debit: 0, credit: 33750000 },
    },
    // Revenue
    {
      accountId: 10,
      accountCode: "4100",
      accountName: "Sales Revenue",
      accountType: "revenue",
      category: "Revenue",
      openingBalance: { debit: 0, credit: 50000000 },
      transactions: { debit: 0, credit: 35000000 },
      closingBalance: { debit: 0, credit: 85000000 },
    },
    // Expenses
    {
      accountId: 11,
      accountCode: "5100",
      accountName: "Salaries Expense",
      accountType: "expense",
      category: "Operating Expenses",
      openingBalance: { debit: 20000000, credit: 0 },
      transactions: { debit: 25000000, credit: 0 },
      closingBalance: { debit: 45000000, credit: 0 },
    },
    {
      accountId: 12,
      accountCode: "5200",
      accountName: "Rent Expense",
      accountType: "expense",
      category: "Operating Expenses",
      openingBalance: { debit: 8000000, credit: 0 },
      transactions: { debit: 12000000, credit: 0 },
      closingBalance: { debit: 20000000, credit: 0 },
    },
    {
      accountId: 13,
      accountCode: "5300",
      accountName: "Utilities Expense",
      accountType: "expense",
      category: "Operating Expenses",
      openingBalance: { debit: 5000000, credit: 0 },
      transactions: { debit: 3500000, credit: 0 },
      closingBalance: { debit: 8500000, credit: 0 },
    },
    {
      accountId: 14,
      accountCode: "5400",
      accountName: "Office Supplies",
      accountType: "expense",
      category: "Operating Expenses",
      openingBalance: { debit: 2000000, credit: 0 },
      transactions: { debit: 1500000, credit: 0 },
      closingBalance: { debit: 3500000, credit: 0 },
    },
    {
      accountId: 15,
      accountCode: "5500",
      accountName: "Depreciation Expense",
      accountType: "expense",
      category: "Non-operating Expenses",
      openingBalance: { debit: 0, credit: 0 },
      transactions: { debit: 1250000, credit: 0 },
      closingBalance: { debit: 1250000, credit: 0 },
    },
  ];

  const totals = accounts.reduce(
    (acc, account) => ({
      openingDebit: acc.openingDebit + account.openingBalance.debit,
      openingCredit: acc.openingCredit + account.openingBalance.credit,
      transactionDebit: acc.transactionDebit + account.transactions.debit,
      transactionCredit: acc.transactionCredit + account.transactions.credit,
      closingDebit: acc.closingDebit + account.closingBalance.debit,
      closingCredit: acc.closingCredit + account.closingBalance.credit,
    }),
    {
      openingDebit: 0,
      openingCredit: 0,
      transactionDebit: 0,
      transactionCredit: 0,
      closingDebit: 0,
      closingCredit: 0,
    },
  );

  const isBalanced = totals.closingDebit === totals.closingCredit;
  const difference = Math.abs(totals.closingDebit - totals.closingCredit);

  return {
    asOfDate,
    accounts,
    totals,
    isBalanced,
    difference,
  };
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
    month: "long",
    day: "numeric",
  });
};

const getAccountTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    asset: "Assets",
    liability: "Liabilities",
    equity: "Equity",
    revenue: "Revenue",
    expense: "Expenses",
  };
  return labels[type] || type;
};

const getAccountTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    asset: "text-blue-600 bg-blue-50",
    liability: "text-red-600 bg-red-50",
    equity: "text-green-600 bg-green-50",
    revenue: "text-purple-600 bg-purple-50",
    expense: "text-orange-600 bg-orange-50",
  };
  return colors[type] || "text-gray-600 bg-gray-50";
};

export default function TrialBalance() {
  const router = useRouter();

  // State
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [report, setReport] = useState<TrialBalanceReport>(() =>
    generateTrialBalance(asOfDate),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TrialBalanceAccount;
    direction: "asc" | "desc";
  }>({ key: "accountCode", direction: "asc" });
  const [selectedAccount, setSelectedAccount] =
    useState<TrialBalanceAccount | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "summary" | "detailed" | "analytics"
  >("summary");

  // Categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(report.accounts.map((a) => a.category));
    return ["all", ...Array.from(cats)];
  }, [report.accounts]);

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    let result = [...report.accounts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountCode.toLowerCase().includes(query) ||
          a.accountName.toLowerCase().includes(query),
      );
    }

    if (accountTypeFilter !== "all") {
      result = result.filter((a) => a.accountType === accountTypeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) =>
        compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction),
      );
    }

    return result;
  }, [
    report.accounts,
    searchQuery,
    accountTypeFilter,
    categoryFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Group accounts by type for analytics
  const accountsByType = useMemo(() => {
    const groups: Record<string, TrialBalanceAccount[]> = {
      asset: [],
      liability: [],
      equity: [],
      revenue: [],
      expense: [],
    };

    report.accounts.forEach((account) => {
      groups[account.accountType].push(account);
    });

    return groups;
  }, [report.accounts]);

  // Chart data
  const balanceByTypeData = useMemo(() => {
    return Object.entries(accountsByType).map(([type, accounts]) => {
      const totalBalance = accounts.reduce((sum, account) => {
        const balance =
          account.closingBalance.debit - account.closingBalance.credit;
        return sum + Math.abs(balance);
      }, 0);
      return {
        name: getAccountTypeLabel(type),
        value: totalBalance,
      };
    });
  }, [accountsByType]);

  const categoryDistributionData = useMemo(() => {
    const categoriesMap = new Map<string, number>();
    report.accounts.forEach((account) => {
      const current = categoriesMap.get(account.category) || 0;
      const balance =
        account.closingBalance.debit - account.closingBalance.credit;
      categoriesMap.set(account.category, current + Math.abs(balance));
    });
    return Array.from(categoriesMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [report.accounts]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
  ];

  // Handlers
  const handleRefresh = () => {
    setReport(generateTrialBalance(asOfDate));
    setCurrentPage(1);
    setSearchQuery("");
    setAccountTypeFilter("all");
    setCategoryFilter("all");
  };

  const handleSort = (key: keyof TrialBalanceAccount) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewDetails = (account: TrialBalanceAccount) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Account Code",
      "Account Name",
      "Type",
      "Category",
      "Opening Balance (DR)",
      "Opening Balance (CR)",
      "Transactions (DR)",
      "Transactions (CR)",
      "Closing Balance (DR)",
      "Closing Balance (CR)",
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

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalAssets = accountsByType.asset.reduce((sum, a) => {
      return sum + (a.closingBalance.debit - a.closingBalance.credit);
    }, 0);
    const totalLiabilities = accountsByType.liability.reduce((sum, a) => {
      return sum + (a.closingBalance.credit - a.closingBalance.debit);
    }, 0);
    const totalEquity = accountsByType.equity.reduce((sum, a) => {
      return sum + (a.closingBalance.credit - a.closingBalance.debit);
    }, 0);
    const totalRevenue = accountsByType.revenue.reduce((sum, a) => {
      return sum + (a.closingBalance.credit - a.closingBalance.debit);
    }, 0);
    const totalExpenses = accountsByType.expense.reduce((sum, a) => {
      return sum + (a.closingBalance.debit - a.closingBalance.credit);
    }, 0);

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }, [accountsByType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:flex-col print:items-start">
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
              As of {formatDate(report.asOfDate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-[180px]"
            />
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Load
            </Button>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Balance Status Alert */}
      {!report.isBalanced && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">
                  Trial Balance is Out of Balance!
                </p>
                <p className="text-sm">
                  Difference: {formatCurrency(report.difference)}. Please review
                  journal entries for errors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summaryStats.totalAssets)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Liabilities
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summaryStats.totalLiabilities)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Equity</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryStats.totalEquity)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Net Income (YTD)
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summaryStats.netIncome)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <Tabs
        value={activeView}
        onValueChange={(v) => setActiveView(v as any)}
        className="w-full print:hidden"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          {/* Summary by Account Type */}
          {Object.entries(accountsByType).map(([type, accounts]) => {
            if (accounts.length === 0) return null;
            const typeTotalDebit = accounts.reduce(
              (sum, a) => sum + a.closingBalance.debit,
              0,
            );
            const typeTotalCredit = accounts.reduce(
              (sum, a) => sum + a.closingBalance.credit,
              0,
            );
            const typeBalance = typeTotalDebit - typeTotalCredit;

            return (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className={getAccountTypeColor(type)}>
                      {getAccountTypeLabel(type)}
                    </span>
                    <span
                      className={`text-sm font-normal ${typeBalance > 0 ? "text-blue-600" : "text-green-600"}`}
                    >
                      Balance: {formatCurrency(Math.abs(typeBalance))}{" "}
                      {typeBalance > 0 ? "(DR)" : "(CR)"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.accountId}>
                          <TableCell className="font-mono text-xs">
                            {account.accountCode}
                          </TableCell>
                          <TableCell>{account.accountName}</TableCell>
                          <TableCell>{account.category}</TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {account.closingBalance.debit > 0
                              ? formatCurrency(account.closingBalance.debit)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {account.closingBalance.credit > 0
                              ? formatCurrency(account.closingBalance.credit)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 font-bold">
                        <TableCell colSpan={3} className="text-right">
                          Total for {getAccountTypeLabel(type)}:
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(typeTotalDebit)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(typeTotalCredit)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}

          {/* Grand Totals */}
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">GRAND TOTALS</div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Debits
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(report.totals.closingDebit)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Credits
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(report.totals.closingCredit)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Difference</p>
                    <p
                      className={`text-2xl font-bold ${report.isBalanced ? "text-green-600" : "text-red-600"}`}
                    >
                      {report.isBalanced
                        ? formatCurrency(0)
                        : formatCurrency(report.difference)}
                    </p>
                  </div>
                </div>
                {report.isBalanced && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Balanced
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code or name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>

                <Select
                  value={accountTypeFilter}
                  onValueChange={(v) => {
                    setAccountTypeFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="asset">Assets</SelectItem>
                    <SelectItem value="liability">Liabilities</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
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
                    <Building2 className="h-4 w-4 mr-2" />
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

          {/* Detailed Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("accountCode")}
                        >
                          Account Code
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("accountName")}
                        >
                          Account Name
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
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
                          <TableRow key={account.accountId}>
                            <TableCell className="font-mono text-xs">
                              {account.accountCode}
                            </TableCell>
                            <TableCell className="font-medium">
                              {account.accountName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getAccountTypeColor(
                                  account.accountType,
                                )}
                              >
                                {getAccountTypeLabel(account.accountType)}
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

        <TabsContent value="analytics" className="space-y-4 mt-4">
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
                  <RePieChart>
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
                  </RePieChart>
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
                  <BarChart data={categoryDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Account Type Summary Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Type Summary</CardTitle>
                <CardDescription>
                  Balances by account classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(accountsByType).map(([type, accounts]) => {
                    if (accounts.length === 0) return null;
                    const totalBalance = accounts.reduce((sum, a) => {
                      const balance =
                        a.closingBalance.debit - a.closingBalance.credit;
                      return sum + balance;
                    }, 0);
                    return (
                      <div
                        key={type}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${getAccountTypeColor(type)}`}
                          >
                            {type === "asset" && <Wallet className="h-4 w-4" />}
                            {type === "liability" && (
                              <CreditCard className="h-4 w-4" />
                            )}
                            {type === "equity" && (
                              <PiggyBank className="h-4 w-4" />
                            )}
                            {type === "revenue" && (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            {type === "expense" && (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-medium">
                            {getAccountTypeLabel(type)}
                          </span>
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
                    <span className="font-bold">{report.accounts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Active Accounts:
                    </span>
                    <span className="font-bold text-green-600">
                      {
                        report.accounts.filter(
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
                        report.accounts.filter(
                          (a) =>
                            a.closingBalance.debit === 0 &&
                            a.closingBalance.credit === 0,
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-muted-foreground">
                      Assets = Liabilities + Equity:
                    </span>
                    <span
                      className={`font-bold ${Math.abs(summaryStats.totalAssets - (summaryStats.totalLiabilities + summaryStats.totalEquity)) < 1000 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(summaryStats.totalAssets)} ={" "}
                      {formatCurrency(
                        summaryStats.totalLiabilities +
                          summaryStats.totalEquity,
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Account Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Account Details</span>
              {selectedAccount && (
                <Badge
                  variant="outline"
                  className={getAccountTypeColor(selectedAccount.accountType)}
                >
                  {getAccountTypeLabel(selectedAccount.accountType)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedAccount.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="capitalize">{selectedAccount.accountType}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Balance Summary</h3>
                <div className="grid grid-cols-3 gap-4">
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
                      Period Activity
                    </p>
                    <p className={`font-bold`}>
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
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Transaction Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Debits:</span>
                    <span className="text-blue-600 font-medium">
                      {formatCurrency(selectedAccount.transactions.debit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Credits:
                    </span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(selectedAccount.transactions.credit)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Net Change:</span>
                    <span
                      className={`font-bold ${selectedAccount.transactions.debit > selectedAccount.transactions.credit ? "text-blue-600" : "text-green-600"}`}
                    >
                      {formatCurrency(
                        Math.abs(
                          selectedAccount.transactions.debit -
                            selectedAccount.transactions.credit,
                        ),
                      )}
                      {selectedAccount.transactions.debit >
                      selectedAccount.transactions.credit
                        ? " DR"
                        : selectedAccount.transactions.credit >
                            selectedAccount.transactions.debit
                          ? " CR"
                          : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
