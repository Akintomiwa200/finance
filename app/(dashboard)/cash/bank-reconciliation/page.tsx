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
import { Textarea } from "@/src/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  XCircle,
  BookOpen,
  Calculator,
  AlertCircle,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  Printer,
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  Landmark,
  Plus,
  Eye,
  Edit,
  Trash2,
  Save,
  Send,
  Clock,
  User,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type ReconciliationStatus = "in_progress" | "completed" | "approved";
type TransactionType =
  | "deposit"
  | "withdrawal"
  | "fee"
  | "interest"
  | "transfer";
type MatchStatus = "matched" | "unmatched" | "pending";

interface BankTransaction {
  id: number;
  date: string;
  description: string;
  reference: string;
  amount: number;
  type: TransactionType;
  matchStatus: MatchStatus;
  matchedToId?: number;
}

interface BookTransaction {
  id: number;
  date: string;
  description: string;
  reference: string;
  amount: number;
  type: TransactionType;
  matchStatus: MatchStatus;
  matchedToId?: number;
}

interface Reconciliation {
  id: number;
  accountId: number;
  accountName: string;
  accountNumber: string;
  statementDate: string;
  statementBalance: number;
  bookBalance: number;
  difference: number;
  status: ReconciliationStatus;
  bankTransactions: BankTransaction[];
  bookTransactions: BookTransaction[];
  adjustments: Adjustment[];
  createdBy: string;
  createdAt: string;
  completedBy?: string;
  completedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

interface Adjustment {
  id: number;
  description: string;
  amount: number;
  type: "addition" | "deduction";
  reason: string;
}

// Mock Bank Account
const mockBankAccount = {
  id: 1,
  name: "Company Operating Account",
  number: "2034567890",
  bank: "First Bank",
  currentBookBalance: 12500000,
};

// Mock Bank Statement Transactions
const mockBankTransactions: BankTransaction[] = [
  {
    id: 1,
    date: "2026-03-01",
    description: "Opening Balance",
    reference: "OPENING",
    amount: 10000000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 1,
  },
  {
    id: 2,
    date: "2026-03-05",
    description: "Customer Payment - Invoice INV-001",
    reference: "TRF-001",
    amount: 2500000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 2,
  },
  {
    id: 3,
    date: "2026-03-10",
    description: "Supplier Payment",
    reference: "CHQ-001",
    amount: -500000,
    type: "withdrawal",
    matchStatus: "matched",
    matchedToId: 3,
  },
  {
    id: 4,
    date: "2026-03-15",
    description: "Bank Charges",
    reference: "FEE-001",
    amount: -25000,
    type: "fee",
    matchStatus: "unmatched",
  },
  {
    id: 5,
    date: "2026-03-18",
    description: "Customer Payment - Invoice INV-002",
    reference: "TRF-002",
    amount: 1800000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 4,
  },
  {
    id: 6,
    date: "2026-03-20",
    description: "Utility Payment",
    reference: "UTIL-001",
    amount: -85000,
    type: "withdrawal",
    matchStatus: "unmatched",
  },
  {
    id: 7,
    date: "2026-03-22",
    description: "Interest Earned",
    reference: "INT-001",
    amount: 12500,
    type: "interest",
    matchStatus: "unmatched",
  },
  {
    id: 8,
    date: "2026-03-25",
    description: "ATM Withdrawal",
    reference: "ATM-001",
    amount: -100000,
    type: "withdrawal",
    matchStatus: "unmatched",
  },
  {
    id: 9,
    date: "2026-03-28",
    description: "Customer Payment - Invoice INV-003",
    reference: "TRF-003",
    amount: 3200000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 5,
  },
  {
    id: 10,
    date: "2026-03-30",
    description: "Monthly Service Fee",
    reference: "FEE-002",
    amount: -15000,
    type: "fee",
    matchStatus: "unmatched",
  },
];

// Mock Book Transactions
const mockBookTransactions: BookTransaction[] = [
  {
    id: 1,
    date: "2026-03-01",
    description: "Opening Balance",
    reference: "OPENING",
    amount: 10000000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 1,
  },
  {
    id: 2,
    date: "2026-03-05",
    description: "Customer Payment - Invoice INV-001",
    reference: "INV-001",
    amount: 2500000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 2,
  },
  {
    id: 3,
    date: "2026-03-10",
    description: "Supplier Payment - Office Supplies",
    reference: "PO-001",
    amount: -500000,
    type: "withdrawal",
    matchStatus: "matched",
    matchedToId: 3,
  },
  {
    id: 4,
    date: "2026-03-18",
    description: "Customer Payment - Invoice INV-002",
    reference: "INV-002",
    amount: 1800000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 5,
  },
  {
    id: 5,
    date: "2026-03-28",
    description: "Customer Payment - Invoice INV-003",
    reference: "INV-003",
    amount: 3200000,
    type: "deposit",
    matchStatus: "matched",
    matchedToId: 9,
  },
  {
    id: 6,
    date: "2026-03-25",
    description: "Office Rent Payment",
    reference: "RENT-001",
    amount: -1200000,
    type: "withdrawal",
    matchStatus: "unmatched",
  },
  {
    id: 7,
    date: "2026-03-27",
    description: "Salary Payment",
    reference: "SAL-001",
    amount: -2500000,
    type: "withdrawal",
    matchStatus: "unmatched",
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getMatchStatusBadge = (status: MatchStatus) => {
  switch (status) {
    case "matched":
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Matched
        </Badge>
      );
    case "unmatched":
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          <AlertCircle className="h-3 w-3 mr-1" />
          Unmatched
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-blue-100 text-blue-700">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return null;
  }
};

const getTransactionTypeIcon = (type: TransactionType) => {
  switch (type) {
    case "deposit":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "withdrawal":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case "fee":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    case "interest":
      return <DollarSign className="h-4 w-4 text-blue-600" />;
    case "transfer":
      return <Send className="h-4 w-4 text-purple-600" />;
  }
};

export default function BankReconciliation() {
  const router = useRouter();

  // State
  const [bankAccount] = useState(mockBankAccount);
  const [bankTransactions, setBankTransactions] =
    useState<BankTransaction[]>(mockBankTransactions);
  const [bookTransactions, setBookTransactions] =
    useState<BookTransaction[]>(mockBookTransactions);
  const [statementBalance, setStatementBalance] = useState(12587500);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [status, setStatus] = useState<ReconciliationStatus>("in_progress");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"bank" | "book" | "adjustments">(
    "bank",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<
    BankTransaction | BookTransaction | null
  >(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    description: "",
    amount: 0,
    type: "addition" as "addition" | "deduction",
    reason: "",
  });
  const [matchTargetId, setMatchTargetId] = useState<number | null>(null);

  // Calculate book balance
  const bookBalance = useMemo(() => {
    const totalDeposits = bookTransactions.reduce(
      (sum, t) => sum + (t.amount > 0 ? t.amount : 0),
      0,
    );
    const totalWithdrawals = bookTransactions.reduce(
      (sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0),
      0,
    );
    return bankAccount.currentBookBalance + totalDeposits - totalWithdrawals;
  }, [bookTransactions, bankAccount.currentBookBalance]);

  // Filter transactions
  const filteredBankTransactions = useMemo(() => {
    let result = [...bankTransactions];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.reference.toLowerCase().includes(query),
      );
    }
    return result;
  }, [bankTransactions, searchQuery]);

  const filteredBookTransactions = useMemo(() => {
    let result = [...bookTransactions];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.reference.toLowerCase().includes(query),
      );
    }
    return result;
  }, [bookTransactions, searchQuery]);

  // Calculate differences
  const totalAdjustments = useMemo(() => {
    return adjustments.reduce(
      (sum, adj) => sum + (adj.type === "addition" ? adj.amount : -adj.amount),
      0,
    );
  }, [adjustments]);

  const reconciledBalance = statementBalance + totalAdjustments;
  const difference = reconciledBalance - bookBalance;
  const isBalanced = Math.abs(difference) < 1;

  // Pagination
  const totalBankPages = Math.ceil(
    filteredBankTransactions.length / itemsPerPage,
  );
  const paginatedBankTransactions = filteredBankTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalBookPages = Math.ceil(
    filteredBookTransactions.length / itemsPerPage,
  );
  const paginatedBookTransactions = filteredBookTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Statistics
  const stats = useMemo(() => {
    const matchedBankCount = bankTransactions.filter(
      (t) => t.matchStatus === "matched",
    ).length;
    const unmatchedBankCount = bankTransactions.filter(
      (t) => t.matchStatus === "unmatched",
    ).length;
    const matchedBookCount = bookTransactions.filter(
      (t) => t.matchStatus === "matched",
    ).length;
    const unmatchedBookCount = bookTransactions.filter(
      (t) => t.matchStatus === "unmatched",
    ).length;
    const totalBankAmount = bankTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );
    const totalBookAmount = bookTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );

    return {
      matchedBankCount,
      unmatchedBankCount,
      matchedBookCount,
      unmatchedBookCount,
      matchRate:
        bankTransactions.length > 0
          ? (matchedBankCount / bankTransactions.length) * 100
          : 0,
      totalBankAmount,
      totalBookAmount,
    };
  }, [bankTransactions, bookTransactions]);

  // Handlers
  const handleMatchTransaction = () => {
    if (!selectedTransaction || !matchTargetId) return;

    if (activeTab === "bank") {
      setBankTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id
            ? { ...t, matchStatus: "matched", matchedToId: matchTargetId }
            : t,
        ),
      );
      setBookTransactions((prev) =>
        prev.map((t) =>
          t.id === matchTargetId
            ? {
                ...t,
                matchStatus: "matched",
                matchedToId: selectedTransaction.id,
              }
            : t,
        ),
      );
    } else {
      setBookTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id
            ? { ...t, matchStatus: "matched", matchedToId: matchTargetId }
            : t,
        ),
      );
      setBankTransactions((prev) =>
        prev.map((t) =>
          t.id === matchTargetId
            ? {
                ...t,
                matchStatus: "matched",
                matchedToId: selectedTransaction.id,
              }
            : t,
        ),
      );
    }
    setIsMatchDialogOpen(false);
    setSelectedTransaction(null);
    setMatchTargetId(null);
  };

  const handleUnmatchTransaction = (
    transaction: BankTransaction | BookTransaction,
    type: "bank" | "book",
  ) => {
    if (type === "bank") {
      setBankTransactions((prev) =>
        prev.map((t) =>
          t.id === transaction.id
            ? { ...t, matchStatus: "unmatched", matchedToId: undefined }
            : t,
        ),
      );
    } else {
      setBookTransactions((prev) =>
        prev.map((t) =>
          t.id === transaction.id
            ? { ...t, matchStatus: "unmatched", matchedToId: undefined }
            : t,
        ),
      );
    }
  };

  const handleAddAdjustment = () => {
    if (!adjustmentForm.description || adjustmentForm.amount <= 0) return;

    const newAdjustment: Adjustment = {
      id: Date.now(),
      description: adjustmentForm.description,
      amount: adjustmentForm.amount,
      type: adjustmentForm.type,
      reason: adjustmentForm.reason,
    };

    setAdjustments((prev) => [...prev, newAdjustment]);
    setAdjustmentForm({
      description: "",
      amount: 0,
      type: "addition",
      reason: "",
    });
    setIsAdjustmentDialogOpen(false);
  };

  const handleRemoveAdjustment = (id: number) => {
    setAdjustments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCompleteReconciliation = () => {
    if (!isBalanced) {
      alert(
        "Please resolve all differences before completing the reconciliation.",
      );
      return;
    }
    setStatus("completed");
    setIsCompleteDialogOpen(false);
  };

  const handleExport = () => {
    const headers = [
      "Date",
      "Description",
      "Reference",
      "Amount",
      "Type",
      "Match Status",
    ];
    const bankData = filteredBankTransactions.map((t) => [
      formatDate(t.date),
      t.description,
      t.reference,
      t.amount.toString(),
      t.type,
      t.matchStatus,
    ]);
    const bookData = filteredBookTransactions.map((t) => [
      formatDate(t.date),
      t.description,
      t.reference,
      t.amount.toString(),
      t.type,
      t.matchStatus,
    ]);

    const csvContent = [
      "BANK STATEMENT TRANSACTIONS",
      headers.join(","),
      ...bankData.map((row) => row.join(",")),
      "",
      "BOOK TRANSACTIONS",
      headers.join(","),
      ...bookData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setBankTransactions([...mockBankTransactions]);
    setBookTransactions([...mockBookTransactions]);
    setAdjustments([]);
    setStatus("in_progress");
    setNotes("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Find potential matches for a transaction
  const getPotentialMatches = (
    transaction: BankTransaction | BookTransaction,
  ) => {
    const amount = Math.abs(transaction.amount);
    const transactions =
      activeTab === "bank" ? bookTransactions : bankTransactions;
    return transactions.filter(
      (t) =>
        t.matchStatus === "unmatched" &&
        Math.abs(Math.abs(t.amount) - amount) < 100, // Within 100 NGN tolerance
    );
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
              <Landmark className="h-6 w-6" />
              Bank Reconciliation
            </h1>
            <p className="text-muted-foreground mt-1">
              {bankAccount.name} - {bankAccount.number} ({bankAccount.bank})
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
          {status === "in_progress" && (
            <Button
              onClick={() => setIsCompleteDialogOpen(true)}
              className="gap-2"
              disabled={!isBalanced}
            >
              <CheckCircle className="h-4 w-4" />
              Complete Reconciliation
            </Button>
          )}
        </div>
      </div>

      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Statement Balance
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(statementBalance)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Landmark className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Book Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(bookBalance)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Adjustments</p>
                <p
                  className={`text-2xl font-bold ${totalAdjustments >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {totalAdjustments >= 0 ? "+" : ""}
                  {formatCurrency(totalAdjustments)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Calculator className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Difference</p>
                <p
                  className={`text-2xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(difference))}
                  {!isBalanced && (difference > 0 ? " DR" : " CR")}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                {isBalanced ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                className={`${status === "completed" ? "bg-green-100 text-green-700" : status === "approved" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {status === "completed" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : status === "approved" ? (
                  <Send className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {status === "in_progress"
                  ? "In Progress"
                  : status === "completed"
                    ? "Completed"
                    : "Approved"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Match Rate: {stats.matchRate.toFixed(1)}% (
                {stats.matchedBankCount}/{bankTransactions.length} transactions
                matched)
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.unmatchedBankCount} bank items | {stats.unmatchedBookCount}{" "}
              book items unmatched
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions by description or reference..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
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
          <TabsTrigger value="bank">
            Bank Statement ({bankTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="book">
            Book Records ({bookTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="adjustments">
            Adjustments ({adjustments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBankTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Landmark className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No bank transactions found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBankTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className={
                            transaction.matchStatus === "matched"
                              ? "bg-green-50/30"
                              : "bg-yellow-50/30"
                          }
                        >
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.reference}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTransactionTypeIcon(transaction.type)}
                              <span className="capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.amount > 0 ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {getMatchStatusBadge(transaction.matchStatus)}
                          </TableCell>
                          <TableCell>
                            {transaction.matchStatus === "unmatched" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setIsMatchDialogOpen(true);
                                }}
                                className="text-blue-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {transaction.matchStatus === "matched" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUnmatchTransaction(transaction, "bank")
                                }
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredBankTransactions.length > 0 && (
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
                        filteredBankTransactions.length,
                      )}{" "}
                      of {filteredBankTransactions.length}
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
                      Page {currentPage} of {totalBankPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalBankPages, p + 1))
                      }
                      disabled={currentPage === totalBankPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(totalBankPages)}
                      disabled={currentPage === totalBankPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="book" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No book transactions found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBookTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className={
                            transaction.matchStatus === "matched"
                              ? "bg-green-50/30"
                              : "bg-yellow-50/30"
                          }
                        >
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.reference}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTransactionTypeIcon(transaction.type)}
                              <span className="capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.amount > 0 ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {getMatchStatusBadge(transaction.matchStatus)}
                          </TableCell>
                          <TableCell>
                            {transaction.matchStatus === "unmatched" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setIsMatchDialogOpen(true);
                                }}
                                className="text-blue-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {transaction.matchStatus === "matched" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUnmatchTransaction(transaction, "book")
                                }
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredBookTransactions.length > 0 && (
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
                        filteredBookTransactions.length,
                      )}{" "}
                      of {filteredBookTransactions.length}
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
                      Page {currentPage} of {totalBookPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalBookPages, p + 1))
                      }
                      disabled={currentPage === totalBookPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(totalBookPages)}
                      disabled={currentPage === totalBookPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reconciliation Adjustments</CardTitle>
                  <CardDescription>
                    Manual adjustments to reconcile differences
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAdjustmentDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Adjustment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {adjustments.length > 0 ? (
                <div className="space-y-3">
                  {adjustments.map((adj) => (
                    <div
                      key={adj.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{adj.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {adj.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${adj.type === "addition" ? "text-green-600" : "text-red-600"}`}
                        >
                          {adj.type === "addition" ? "+" : "-"}{" "}
                          {formatCurrency(adj.amount)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdjustment(adj.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" />
                  <p>No adjustments recorded</p>
                  <p className="text-sm">
                    Add adjustments to reconcile differences
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Match Transaction Dialog */}
      <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Match Transaction</DialogTitle>
            <DialogDescription>
              Select the corresponding transaction to match with:
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Selected Transaction
                </p>
                <p className="font-medium">{selectedTransaction.description}</p>
                <p className="text-sm">
                  Amount: {formatCurrency(selectedTransaction.amount)}
                </p>
                <p className="text-sm">
                  Date: {formatDate(selectedTransaction.date)}
                </p>
                <p className="text-sm">
                  Reference: {selectedTransaction.reference}
                </p>
              </div>
              <div>
                <Label>Match with:</Label>
                <Select
                  value={matchTargetId?.toString() || ""}
                  onValueChange={(v) => setMatchTargetId(parseInt(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a transaction to match" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPotentialMatches(selectedTransaction).map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.description} - {formatCurrency(t.amount)} (
                        {formatDate(t.date)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMatchDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMatchTransaction} disabled={!matchTargetId}>
              Match Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjustment Dialog */}
      <Dialog
        open={isAdjustmentDialogOpen}
        onOpenChange={setIsAdjustmentDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Adjustment</DialogTitle>
            <DialogDescription>
              Record a manual adjustment to balance the reconciliation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Adjustment Type</Label>
              <Select
                value={adjustmentForm.type}
                onValueChange={(v: any) =>
                  setAdjustmentForm((prev) => ({ ...prev, type: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addition">
                    Addition (Increase Statement Balance)
                  </SelectItem>
                  <SelectItem value="deduction">
                    Deduction (Decrease Statement Balance)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Input
                value={adjustmentForm.description}
                onChange={(e) =>
                  setAdjustmentForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="e.g., Bank error correction"
              />
            </div>
            <div>
              <Label>Amount (₦) *</Label>
              <Input
                type="number"
                value={adjustmentForm.amount || ""}
                onChange={(e) =>
                  setAdjustmentForm((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                placeholder="0"
              />
            </div>
            <div>
              <Label>Reason *</Label>
              <Textarea
                value={adjustmentForm.reason}
                onChange={(e) =>
                  setAdjustmentForm((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                className="mt-1"
                rows={3}
                placeholder="Explain why this adjustment is needed..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAdjustmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAdjustment}>Add Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Reconciliation Dialog */}
      <AlertDialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Reconciliation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete this reconciliation?
              {!isBalanced && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg text-red-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  There is still a difference of{" "}
                  {formatCurrency(Math.abs(difference))}. Please resolve before
                  completing.
                </div>
              )}
              {isBalanced && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  All differences have been resolved. The reconciliation is
                  ready to be completed.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={3}
              placeholder="Add any notes about this reconciliation..."
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteReconciliation}
              disabled={!isBalanced}
            >
              Complete Reconciliation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
