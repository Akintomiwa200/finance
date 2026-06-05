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
  Search,
  Calendar,
  Filter,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
  Landmark,
  Receipt,
  BookOpen,
  ListChecks,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";

// Types
interface LedgerTransaction {
  id: number;
  date: string;
  journalNumber: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  journalType: string;
  createdBy: string;
  postedBy: string;
  department?: string;
  costCenter?: string;
}

interface LedgerAccount {
  accountId: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  category: string;
  normalBalance: "debit" | "credit";
  openingBalance: number;
  transactions: LedgerTransaction[];
  closingBalance: number;
}

interface LedgerReport {
  asOfDate: string;
  fromDate: string;
  toDate: string;
  accounts: LedgerAccount[];
  totals: {
    totalDebits: number;
    totalCredits: number;
    netChange: number;
  };
}

// Mock Data Generator
const generateLedgerReport = (
  fromDate: string,
  toDate: string,
): LedgerReport => {
  const accounts: LedgerAccount[] = [
    {
      accountId: 1,
      accountCode: "1110",
      accountName: "Cash - Operating",
      accountType: "asset",
      category: "Current Assets",
      normalBalance: "debit",
      openingBalance: 35000000,
      transactions: [
        {
          id: 1,
          date: "2026-03-01",
          journalNumber: "JNL-2026-0001",
          reference: "PAY-2026-0023",
          description: "Salary payment",
          debit: 0,
          credit: 25000000,
          balance: 10000000,
          journalType: "manual",
          createdBy: "John Doe",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 2,
          date: "2026-03-05",
          journalNumber: "JNL-2026-0002",
          reference: "RENT-2026-03",
          description: "Rent payment",
          debit: 0,
          credit: 12000000,
          balance: -2000000,
          journalType: "manual",
          createdBy: "Jane Smith",
          postedBy: "Jane Smith",
          department: "Finance",
        },
        {
          id: 3,
          date: "2026-03-10",
          journalNumber: "JNL-2026-0003",
          reference: "DEP-2026-03",
          description: "Cash deposit",
          debit: 5000000,
          credit: 0,
          balance: 3000000,
          journalType: "manual",
          createdBy: "Mike Johnson",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 4,
          date: "2026-03-15",
          journalNumber: "JNL-2026-0004",
          reference: "TRF-2026-03",
          description: "Transfer to savings",
          debit: 0,
          credit: 2000000,
          balance: 1000000,
          journalType: "system",
          createdBy: "System",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 5,
          date: "2026-03-20",
          journalNumber: "JNL-2026-0005",
          reference: "UTIL-2026-03",
          description: "Utility payment",
          debit: 0,
          credit: 850000,
          balance: 150000,
          journalType: "manual",
          createdBy: "Operations Team",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 6,
          date: "2026-03-25",
          journalNumber: "JNL-2026-0006",
          reference: "SALES-2026-03",
          description: "Customer payment",
          debit: 2500000,
          credit: 0,
          balance: 2650000,
          journalType: "manual",
          createdBy: "Sales Team",
          postedBy: "System",
          department: "Finance",
        },
      ],
      closingBalance: 2650000,
    },
    {
      accountId: 2,
      accountCode: "1120",
      accountName: "Cash - Savings",
      accountType: "asset",
      category: "Current Assets",
      normalBalance: "debit",
      openingBalance: 50000000,
      transactions: [
        {
          id: 7,
          date: "2026-03-15",
          journalNumber: "JNL-2026-0004",
          reference: "TRF-2026-03",
          description: "Transfer from operating",
          debit: 2000000,
          credit: 0,
          balance: 52000000,
          journalType: "system",
          createdBy: "System",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 8,
          date: "2026-03-28",
          journalNumber: "JNL-2026-0007",
          reference: "INT-2026-03",
          description: "Interest earned",
          debit: 125000,
          credit: 0,
          balance: 52125000,
          journalType: "system",
          createdBy: "Bank",
          postedBy: "System",
          department: "Finance",
        },
      ],
      closingBalance: 52125000,
    },
    {
      accountId: 3,
      accountCode: "1130",
      accountName: "Accounts Receivable",
      accountType: "asset",
      category: "Current Assets",
      normalBalance: "debit",
      openingBalance: 15000000,
      transactions: [
        {
          id: 9,
          date: "2026-03-10",
          journalNumber: "JNL-2026-0008",
          reference: "INV-2026-045",
          description: "Invoice to customer",
          debit: 3500000,
          credit: 0,
          balance: 18500000,
          journalType: "manual",
          createdBy: "Sales Team",
          postedBy: "System",
          department: "Sales",
        },
        {
          id: 10,
          date: "2026-03-20",
          journalNumber: "JNL-2026-0009",
          reference: "REC-2026-023",
          description: "Payment received",
          debit: 0,
          credit: 2500000,
          balance: 16000000,
          journalType: "manual",
          createdBy: "Sales Team",
          postedBy: "System",
          department: "Sales",
        },
        {
          id: 11,
          date: "2026-03-25",
          journalNumber: "JNL-2026-0006",
          reference: "SALES-2026-03",
          description: "Sales on credit",
          debit: 5000000,
          credit: 0,
          balance: 21000000,
          journalType: "manual",
          createdBy: "Sales Team",
          postedBy: "System",
          department: "Sales",
        },
      ],
      closingBalance: 21000000,
    },
    {
      accountId: 4,
      accountCode: "2100",
      accountName: "Accounts Payable",
      accountType: "liability",
      category: "Current Liabilities",
      normalBalance: "credit",
      openingBalance: 10000000,
      transactions: [
        {
          id: 12,
          date: "2026-03-05",
          journalNumber: "JNL-2026-0010",
          reference: "PO-2026-078",
          description: "Supplier invoice",
          debit: 0,
          credit: 4500000,
          balance: 14500000,
          journalType: "manual",
          createdBy: "Procurement",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 13,
          date: "2026-03-15",
          journalNumber: "JNL-2026-0011",
          reference: "PAY-2026-045",
          description: "Payment to supplier",
          debit: 3000000,
          credit: 0,
          balance: 11500000,
          journalType: "manual",
          createdBy: "Finance",
          postedBy: "System",
          department: "Finance",
        },
        {
          id: 14,
          date: "2026-03-22",
          journalNumber: "JNL-2026-0012",
          reference: "PO-2026-089",
          description: "Office supplies",
          debit: 0,
          credit: 1250000,
          balance: 12750000,
          journalType: "manual",
          createdBy: "Operations",
          postedBy: "System",
          department: "Operations",
        },
      ],
      closingBalance: 12750000,
    },
    {
      accountId: 5,
      accountCode: "4100",
      accountName: "Sales Revenue",
      accountType: "revenue",
      category: "Revenue",
      normalBalance: "credit",
      openingBalance: 50000000,
      transactions: [
        {
          id: 15,
          date: "2026-03-10",
          journalNumber: "JNL-2026-0008",
          reference: "INV-2026-045",
          description: "Product sales",
          debit: 0,
          credit: 3500000,
          balance: 53500000,
          journalType: "manual",
          createdBy: "Sales Team",
          postedBy: "System",
          department: "Sales",
        },
        {
          id: 16,
          date: "2026-03-25",
          journalNumber: "JNL-2026-0006",
          reference: "SALES-2026-03",
          description: "Service revenue",
          debit: 0,
          credit: 5000000,
          balance: 58500000,
          journalType: "manual",
          createdBy: "Sales Team",
          postedBy: "System",
          department: "Sales",
        },
      ],
      closingBalance: 58500000,
    },
    {
      accountId: 6,
      accountCode: "5100",
      accountName: "Salaries Expense",
      accountType: "expense",
      category: "Operating Expenses",
      normalBalance: "debit",
      openingBalance: 20000000,
      transactions: [
        {
          id: 17,
          date: "2026-03-01",
          journalNumber: "JNL-2026-0001",
          reference: "PAY-2026-0023",
          description: "March salaries",
          debit: 25000000,
          credit: 0,
          balance: 45000000,
          journalType: "manual",
          createdBy: "John Doe",
          postedBy: "System",
          department: "HR",
        },
      ],
      closingBalance: 45000000,
    },
    {
      accountId: 7,
      accountCode: "5200",
      accountName: "Rent Expense",
      accountType: "expense",
      category: "Operating Expenses",
      normalBalance: "debit",
      openingBalance: 8000000,
      transactions: [
        {
          id: 18,
          date: "2026-03-05",
          journalNumber: "JNL-2026-0002",
          reference: "RENT-2026-03",
          description: "Office rent",
          debit: 12000000,
          credit: 0,
          balance: 20000000,
          journalType: "manual",
          createdBy: "Jane Smith",
          postedBy: "Jane Smith",
          department: "Operations",
        },
      ],
      closingBalance: 20000000,
    },
  ];

  const totals = accounts.reduce(
    (acc, account) => ({
      totalDebits:
        acc.totalDebits +
        account.transactions.reduce((sum, t) => sum + t.debit, 0),
      totalCredits:
        acc.totalCredits +
        account.transactions.reduce((sum, t) => sum + t.credit, 0),
      netChange: 0,
    }),
    { totalDebits: 0, totalCredits: 0, netChange: 0 },
  );
  totals.netChange = totals.totalDebits - totals.totalCredits;

  return {
    asOfDate: toDate,
    fromDate,
    toDate,
    accounts,
    totals,
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
    month: "short",
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

export default function LedgerReport() {
  const router = useRouter();

  // State
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState<LedgerReport>(() =>
    generateLedgerReport(fromDate, toDate),
  );
  const [selectedAccount, setSelectedAccount] = useState<LedgerAccount | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LedgerAccount;
    direction: "asc" | "desc";
  }>({ key: "accountCode", direction: "asc" });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"accounts" | "transactions">(
    "accounts",
  );

  // Categories
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

  // All transactions for the transactions view
  const allTransactions = useMemo(() => {
    const transactions: (LedgerTransaction & {
      accountCode: string;
      accountName: string;
    })[] = [];
    report.accounts.forEach((account) => {
      account.transactions.forEach((transaction) => {
        transactions.push({
          ...transaction,
          accountCode: account.accountCode,
          accountName: account.accountName,
        });
      });
    });
    return transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [report.accounts]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return allTransactions;
    const query = searchQuery.toLowerCase();
    return allTransactions.filter(
      (t) =>
        t.journalNumber.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.accountCode.toLowerCase().includes(query) ||
        t.accountName.toLowerCase().includes(query) ||
        t.reference.toLowerCase().includes(query),
    );
  }, [allTransactions, searchQuery]);

  // Pagination for accounts
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Pagination for transactions
  const transactionPages = Math.ceil(
    filteredTransactions.length / itemsPerPage,
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleRefresh = () => {
    setReport(generateLedgerReport(fromDate, toDate));
    setCurrentPage(1);
    setSearchQuery("");
    setAccountTypeFilter("all");
    setCategoryFilter("all");
  };

  const handleSort = (key: keyof LedgerAccount) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewAccount = (account: LedgerAccount) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  const handleExport = () => {
    if (activeTab === "accounts") {
      const headers = [
        "Account Code",
        "Account Name",
        "Type",
        "Category",
        "Opening Balance",
        "Total Debits",
        "Total Credits",
        "Closing Balance",
      ];
      const csvData = filteredAccounts.map((a) => [
        a.accountCode,
        a.accountName,
        a.accountType,
        a.category,
        a.openingBalance.toString(),
        a.transactions.reduce((sum, t) => sum + t.debit, 0).toString(),
        a.transactions.reduce((sum, t) => sum + t.credit, 0).toString(),
        a.closingBalance.toString(),
      ]);
      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `general-ledger-accounts-${fromDate}-to-${toDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = [
        "Date",
        "Journal #",
        "Reference",
        "Description",
        "Account Code",
        "Account Name",
        "Debit",
        "Credit",
        "Department",
      ];
      const csvData = filteredTransactions.map((t) => [
        t.date,
        t.journalNumber,
        t.reference,
        t.description,
        t.accountCode,
        t.accountName,
        t.debit.toString(),
        t.credit.toString(),
        t.department || "",
      ]);
      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `general-ledger-transactions-${fromDate}-to-${toDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate running balance for an account
  const getRunningBalance = (
    transactions: LedgerTransaction[],
    normalBalance: "debit" | "credit",
    openingBalance: number,
  ) => {
    let balance = openingBalance;
    return transactions.map((transaction) => {
      if (normalBalance === "debit") {
        balance = balance + transaction.debit - transaction.credit;
      } else {
        balance = balance - transaction.debit + transaction.credit;
      }
      return { ...transaction, runningBalance: balance };
    });
  };

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalAssets = report.accounts
      .filter((a) => a.accountType === "asset")
      .reduce((sum, a) => sum + a.closingBalance, 0);
    const totalLiabilities = report.accounts
      .filter((a) => a.accountType === "liability")
      .reduce((sum, a) => sum + a.closingBalance, 0);
    const totalEquity = report.accounts
      .filter((a) => a.accountType === "equity")
      .reduce((sum, a) => sum + a.closingBalance, 0);
    const totalRevenue = report.accounts
      .filter((a) => a.accountType === "revenue")
      .reduce((sum, a) => sum + a.closingBalance, 0);
    const totalExpenses = report.accounts
      .filter((a) => a.accountType === "expense")
      .reduce((sum, a) => sum + a.closingBalance, 0);

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }, [report.accounts]);

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
              <BookOpen className="h-6 w-6" />
              General Ledger Report
            </h1>
            <p className="text-muted-foreground mt-1">
              {formatDate(report.fromDate)} - {formatDate(report.toDate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-[150px]"
            />
            <span>to</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-[150px]"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(report.totals.totalDebits)}
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
                  {formatCurrency(report.totals.totalCredits)}
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
                <p className="text-sm text-muted-foreground">Net Change</p>
                <p
                  className={`text-2xl font-bold ${report.totals.netChange > 0 ? "text-blue-600" : report.totals.netChange < 0 ? "text-green-600" : "text-gray-600"}`}
                >
                  {formatCurrency(Math.abs(report.totals.netChange))}
                  {report.totals.netChange > 0
                    ? " DR"
                    : report.totals.netChange < 0
                      ? " CR"
                      : ""}
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
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold">
                  {
                    report.accounts.filter((a) => a.transactions.length > 0)
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <ListChecks className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as any);
          setCurrentPage(1);
          setSearchQuery("");
        }}
        className="w-full print:hidden"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Accounts Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4 mt-4">
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

          {/* Accounts Table */}
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
                      <TableHead className="text-right">Total Debits</TableHead>
                      <TableHead className="text-right">
                        Total Credits
                      </TableHead>
                      <TableHead className="text-right">
                        Closing Balance
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No accounts found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAccounts.map((account) => {
                        const totalDebits = account.transactions.reduce(
                          (sum, t) => sum + t.debit,
                          0,
                        );
                        const totalCredits = account.transactions.reduce(
                          (sum, t) => sum + t.credit,
                          0,
                        );
                        const closingBalance =
                          account.normalBalance === "debit"
                            ? account.openingBalance +
                              totalDebits -
                              totalCredits
                            : account.openingBalance -
                              totalDebits +
                              totalCredits;

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
                              className={`text-right font-medium ${account.openingBalance > 0 ? "text-blue-600" : account.openingBalance < 0 ? "text-green-600" : ""}`}
                            >
                              {account.openingBalance !== 0
                                ? formatCurrency(
                                    Math.abs(account.openingBalance),
                                  )
                                : "-"}
                              {account.openingBalance > 0 &&
                              account.normalBalance === "debit"
                                ? " DR"
                                : ""}
                              {account.openingBalance > 0 &&
                              account.normalBalance === "credit"
                                ? " CR"
                                : ""}
                            </TableCell>
                            <TableCell className="text-right text-blue-600">
                              {formatCurrency(totalDebits)}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatCurrency(totalCredits)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-bold ${closingBalance > 0 ? "text-blue-600" : closingBalance < 0 ? "text-green-600" : ""}`}
                            >
                              {formatCurrency(Math.abs(closingBalance))}
                              {closingBalance > 0 &&
                              account.normalBalance === "debit"
                                ? " DR"
                                : ""}
                              {closingBalance > 0 &&
                              account.normalBalance === "credit"
                                ? " CR"
                                : ""}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAccount(account)}
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

        <TabsContent value="transactions" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by journal #, description, account..."
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

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Journal #</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
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
                          <TableCell className="whitespace-nowrap">
                            {formatDate(transaction.date)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.journalNumber}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.reference}
                          </TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={transaction.description}
                          >
                            {transaction.description}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-mono text-xs">
                                {transaction.accountCode}
                              </span>
                              <p className="text-sm">
                                {transaction.accountName}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-blue-600 font-medium">
                            {transaction.debit > 0
                              ? formatCurrency(transaction.debit)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            {transaction.credit > 0
                              ? formatCurrency(transaction.credit)
                              : "-"}
                          </TableCell>
                          <TableCell>{transaction.department || "-"}</TableCell>
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
                      Page {currentPage} of {transactionPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(transactionPages, p + 1))
                      }
                      disabled={currentPage === transactionPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(transactionPages)}
                      disabled={currentPage === transactionPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Details Modal with Ledger */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <span>{selectedAccount?.accountName}</span>
                <p className="text-sm text-muted-foreground font-normal">
                  {selectedAccount?.accountCode} - {selectedAccount?.category}
                </p>
              </div>
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
              {/* Account Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Opening Balance
                  </p>
                  <p
                    className={`text-lg font-bold ${selectedAccount.openingBalance > 0 ? "text-blue-600" : selectedAccount.openingBalance < 0 ? "text-green-600" : ""}`}
                  >
                    {formatCurrency(Math.abs(selectedAccount.openingBalance))}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Total Debits</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(
                      selectedAccount.transactions.reduce(
                        (sum, t) => sum + t.debit,
                        0,
                      ),
                    )}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Total Credits</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(
                      selectedAccount.transactions.reduce(
                        (sum, t) => sum + t.credit,
                        0,
                      ),
                    )}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Closing Balance
                  </p>
                  <p
                    className={`text-lg font-bold ${selectedAccount.closingBalance > 0 ? "text-blue-600" : selectedAccount.closingBalance < 0 ? "text-green-600" : ""}`}
                  >
                    {formatCurrency(Math.abs(selectedAccount.closingBalance))}
                  </p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Transaction History</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Journal #</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getRunningBalance(
                        selectedAccount.transactions,
                        selectedAccount.normalBalance,
                        selectedAccount.openingBalance,
                      ).map((transaction, idx) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.journalNumber}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.reference}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-right text-blue-600">
                            {transaction.debit > 0
                              ? formatCurrency(transaction.debit)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {transaction.credit > 0
                              ? formatCurrency(transaction.credit)
                              : "-"}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${transaction.runningBalance > 0 && selectedAccount.normalBalance === "debit" ? "text-blue-600" : transaction.runningBalance > 0 && selectedAccount.normalBalance === "credit" ? "text-green-600" : ""}`}
                          >
                            {formatCurrency(
                              Math.abs(transaction.runningBalance),
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 font-bold">
                        <TableCell colSpan={6} className="text-right">
                          Closing Balance:
                        </TableCell>
                        <TableCell
                          className={`text-right ${selectedAccount.closingBalance > 0 && selectedAccount.normalBalance === "debit" ? "text-blue-600" : selectedAccount.closingBalance > 0 && selectedAccount.normalBalance === "credit" ? "text-green-600" : ""}`}
                        >
                          {formatCurrency(
                            Math.abs(selectedAccount.closingBalance),
                          )}
                          {selectedAccount.closingBalance > 0 &&
                          selectedAccount.normalBalance === "debit"
                            ? " DR"
                            : ""}
                          {selectedAccount.closingBalance > 0 &&
                          selectedAccount.normalBalance === "credit"
                            ? " CR"
                            : ""}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
