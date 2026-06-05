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
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  DollarSign,
  Calendar,
  User,
  Building2,
  Receipt,
  FileText,
  AlertCircle,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  Calculator,
  Landmark,
  TrendingUp,
  TrendingDown,
  Printer,
  Save,
  Send,
  HelpCircle,
  ListChecks,
  Scale,
  Banknote,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type ReconciliationStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "approved"
  | "disputed";
type VarianceType = "over" | "short" | "exact";
type TransactionStatus = "verified" | "unverified" | "disputed";

interface PettyCashTransaction {
  id: number;
  date: string;
  description: string;
  voucherNumber: string;
  category: string;
  amount: number;
  receiptAttached: boolean;
  status: TransactionStatus;
  notes?: string;
}

interface Reconciliation {
  id: number;
  reconciliationNumber: string;
  fundName: string;
  asOfDate: string;
  startingBalance: number;
  expectedBalance: number;
  physicalCount: number;
  variance: number;
  varianceType: VarianceType;
  status: ReconciliationStatus;
  transactions: PettyCashTransaction[];
  adjustments: Adjustment[];
  verifiedBy?: string;
  verifiedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

interface Adjustment {
  id: number;
  description: string;
  amount: number;
  type: "addition" | "deduction";
  reason: string;
  approvedBy?: string;
}

// Mock Data
const mockReconciliation: Reconciliation = {
  id: 1,
  reconciliationNumber: "PCR-2026-003",
  fundName: "Main Office Petty Cash",
  asOfDate: "2026-03-15",
  startingBalance: 250000,
  expectedBalance: 175000,
  physicalCount: 168500,
  variance: -6500,
  varianceType: "short",
  status: "in_progress",
  transactions: [
    {
      id: 1,
      date: "2026-03-01",
      description: "Office supplies",
      voucherNumber: "V-001",
      category: "Office Supplies",
      amount: 25000,
      receiptAttached: true,
      status: "verified",
    },
    {
      id: 2,
      date: "2026-03-02",
      description: "Transport fare",
      voucherNumber: "V-002",
      category: "Transport",
      amount: 8000,
      receiptAttached: true,
      status: "verified",
    },
    {
      id: 3,
      date: "2026-03-03",
      description: "Client lunch",
      voucherNumber: "V-003",
      category: "Entertainment",
      amount: 45000,
      receiptAttached: true,
      status: "verified",
    },
    {
      id: 4,
      date: "2026-03-05",
      description: "First aid kit",
      voucherNumber: "V-004",
      category: "Medical",
      amount: 25000,
      receiptAttached: true,
      status: "verified",
    },
    {
      id: 5,
      date: "2026-03-06",
      description: "AC repair",
      voucherNumber: "V-005",
      category: "Maintenance",
      amount: 35000,
      receiptAttached: true,
      status: "verified",
    },
    {
      id: 6,
      date: "2026-03-07",
      description: "Stationery",
      voucherNumber: "V-006",
      category: "Stationery",
      amount: 15000,
      receiptAttached: true,
      status: "unverified",
    },
    {
      id: 7,
      date: "2026-03-08",
      description: "Team lunch",
      voucherNumber: "V-007",
      category: "Staff Welfare",
      amount: 50000,
      receiptAttached: false,
      status: "unverified",
      notes: "Receipt lost, awaiting approval",
    },
  ],
  adjustments: [
    {
      id: 1,
      description: "Unrecorded cash receipt",
      amount: 2000,
      type: "addition",
      reason: "Found cash in drawer not recorded",
    },
  ],
  notes:
    "Petty cash count shows shortage of ₦6,500. Additional receipts pending verification.",
  createdAt: "2026-03-15T10:00:00",
  createdBy: "Finance Officer",
};

const categories = [
  "Office Supplies",
  "Transport",
  "Entertainment",
  "Medical",
  "Maintenance",
  "Stationery",
  "Staff Welfare",
  "Software",
  "Cleaning",
  "Other",
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
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: ReconciliationStatus) => {
  const styles = {
    draft: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    approved: "bg-purple-100 text-purple-700",
    disputed: "bg-red-100 text-red-700",
  };

  const labels = {
    draft: "Draft",
    in_progress: "In Progress",
    completed: "Completed",
    approved: "Approved",
    disputed: "Disputed",
  };

  return (
    <Badge className={`${styles[status]} flex items-center gap-1 w-fit`}>
      {status === "in_progress" && <Clock className="h-3 w-3" />}
      {status === "completed" && <CheckCircle className="h-3 w-3" />}
      {status === "approved" && <CheckCircle className="h-3 w-3" />}
      {status === "disputed" && <AlertCircle className="h-3 w-3" />}
      {labels[status]}
    </Badge>
  );
};

const getTransactionStatusBadge = (status: TransactionStatus) => {
  const styles = {
    verified: "bg-green-100 text-green-700",
    unverified: "bg-yellow-100 text-yellow-700",
    disputed: "bg-red-100 text-red-700",
  };

  const labels = {
    verified: "Verified",
    unverified: "Unverified",
    disputed: "Disputed",
  };

  return (
    <Badge className={`${styles[status]} flex items-center gap-1 w-fit`}>
      {status === "verified" && <CheckCircle className="h-3 w-3" />}
      {status === "unverified" && <AlertCircle className="h-3 w-3" />}
      {status === "disputed" && <XCircle className="h-3 w-3" />}
      {labels[status]}
    </Badge>
  );
};

export default function PettyCashReconciliation() {
  const router = useRouter();

  // State
  const [reconciliation, setReconciliation] =
    useState<Reconciliation>(mockReconciliation);
  const [physicalCount, setPhysicalCount] = useState(
    reconciliation.physicalCount,
  );
  const [notes, setNotes] = useState(reconciliation.notes || "");
  const [selectedTransaction, setSelectedTransaction] =
    useState<PettyCashTransaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reconciliation" | "transactions" | "history"
  >("reconciliation");

  // Adjustment form
  const [adjustmentForm, setAdjustmentForm] = useState({
    description: "",
    amount: 0,
    type: "addition" as "addition" | "deduction",
    reason: "",
  });
  const [adjustmentErrors, setAdjustmentErrors] = useState<
    Record<string, string>
  >({});

  // Calculations
  const totalDisbursements = useMemo(() => {
    return reconciliation.transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [reconciliation.transactions]);

  const verifiedTotal = useMemo(() => {
    return reconciliation.transactions
      .filter((t) => t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reconciliation.transactions]);

  const unverifiedTotal = useMemo(() => {
    return reconciliation.transactions
      .filter((t) => t.status === "unverified")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [reconciliation.transactions]);

  const totalAdjustments = useMemo(() => {
    return reconciliation.adjustments.reduce((sum, adj) => {
      return sum + (adj.type === "addition" ? adj.amount : -adj.amount);
    }, 0);
  }, [reconciliation.adjustments]);

  const calculatedBalance = useMemo(() => {
    return (
      reconciliation.startingBalance - totalDisbursements + totalAdjustments
    );
  }, [reconciliation.startingBalance, totalDisbursements, totalAdjustments]);

  const variance = useMemo(() => {
    return physicalCount - calculatedBalance;
  }, [physicalCount, calculatedBalance]);

  const varianceType: VarianceType =
    variance > 0 ? "over" : variance < 0 ? "short" : "exact";

  // Handlers
  const handleUpdatePhysicalCount = () => {
    setReconciliation((prev) => ({
      ...prev,
      physicalCount,
      variance,
      varianceType,
    }));
  };

  const handleVerifyTransaction = (transaction: PettyCashTransaction) => {
    setReconciliation((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === transaction.id ? { ...t, status: "verified" } : t,
      ),
    }));
  };

  const handleDisputeTransaction = (
    transaction: PettyCashTransaction,
    reason: string,
  ) => {
    setReconciliation((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === transaction.id
          ? { ...t, status: "disputed", notes: reason }
          : t,
      ),
    }));
  };

  const handleAddAdjustment = () => {
    if (!adjustmentForm.description || adjustmentForm.amount <= 0) {
      setAdjustmentErrors({
        description: !adjustmentForm.description
          ? "Description is required"
          : "",
        amount: adjustmentForm.amount <= 0 ? "Valid amount is required" : "",
      });
      return;
    }

    const newAdjustment: Adjustment = {
      id: Math.max(...reconciliation.adjustments.map((a) => a.id), 0) + 1,
      description: adjustmentForm.description,
      amount: adjustmentForm.amount,
      type: adjustmentForm.type,
      reason: adjustmentForm.reason,
    };

    setReconciliation((prev) => ({
      ...prev,
      adjustments: [...prev.adjustments, newAdjustment],
    }));

    setAdjustmentForm({
      description: "",
      amount: 0,
      type: "addition",
      reason: "",
    });
    setIsAdjustmentModalOpen(false);
  };

  const handleRemoveAdjustment = (adjustmentId: number) => {
    setReconciliation((prev) => ({
      ...prev,
      adjustments: prev.adjustments.filter((a) => a.id !== adjustmentId),
    }));
  };

  const handleCompleteReconciliation = () => {
    setReconciliation((prev) => ({
      ...prev,
      status: "completed",
      verifiedBy: "Current User",
      verifiedDate: new Date().toISOString(),
      notes,
    }));
    setIsCompleteDialogOpen(false);
  };

  const handleApproveReconciliation = () => {
    setReconciliation((prev) => ({
      ...prev,
      status: "approved",
      approvedBy: "Approver",
      approvedDate: new Date().toISOString(),
    }));
    setIsApproveDialogOpen(false);
  };

  const handleExport = () => {
    const headers = [
      "Transaction #",
      "Date",
      "Description",
      "Category",
      "Amount",
      "Status",
      "Receipt",
    ];
    const csvData = reconciliation.transactions.map((t) => [
      t.voucherNumber,
      formatDate(t.date),
      t.description,
      t.category,
      t.amount.toString(),
      t.status,
      t.receiptAttached ? "Yes" : "No",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-${reconciliation.reconciliationNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
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
              Petty Cash Reconciliation
            </h1>
            <p className="text-muted-foreground mt-1">
              {reconciliation.reconciliationNumber} -{" "}
              {formatDate(reconciliation.asOfDate)}
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
          {reconciliation.status === "in_progress" && (
            <>
              <Button
                onClick={() => setIsCompleteDialogOpen(true)}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Complete
              </Button>
            </>
          )}
          {reconciliation.status === "completed" && (
            <Button
              onClick={() => setIsApproveDialogOpen(true)}
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
              Approve
            </Button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <Card
        className={`border-l-4 ${
          reconciliation.status === "approved"
            ? "border-l-green-500"
            : reconciliation.status === "completed"
              ? "border-l-blue-500"
              : reconciliation.status === "in_progress"
                ? "border-l-yellow-500"
                : reconciliation.status === "disputed"
                  ? "border-l-red-500"
                  : "border-l-gray-500"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusBadge(reconciliation.status)}
              <span className="text-sm text-muted-foreground">
                Created: {formatDate(reconciliation.createdAt)} by{" "}
                {reconciliation.createdBy}
              </span>
              {reconciliation.verifiedBy && (
                <span className="text-sm text-muted-foreground">
                  Verified: {formatDate(reconciliation.verifiedDate!)} by{" "}
                  {reconciliation.verifiedBy}
                </span>
              )}
              {reconciliation.approvedBy && (
                <span className="text-sm text-muted-foreground">
                  Approved: {formatDate(reconciliation.approvedDate!)} by{" "}
                  {reconciliation.approvedBy}
                </span>
              )}
            </div>
            {reconciliation.varianceType !== "exact" &&
              reconciliation.status !== "approved" && (
                <div
                  className={`flex items-center gap-2 text-sm ${varianceType === "short" ? "text-red-600" : "text-orange-600"}`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {varianceType === "short" ? "Shortage" : "Overage"} of{" "}
                    {formatCurrency(Math.abs(variance))} detected
                  </span>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Starting Balance
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(reconciliation.startingBalance)}
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
                  Total Disbursements
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalDisbursements)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected Balance
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculatedBalance)}
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
                <p className="text-sm text-muted-foreground">Physical Count</p>
                <Input
                  type="number"
                  value={physicalCount}
                  onChange={(e) =>
                    setPhysicalCount(parseFloat(e.target.value) || 0)
                  }
                  onBlur={handleUpdatePhysicalCount}
                  className="text-2xl font-bold w-32 text-right"
                  disabled={reconciliation.status !== "in_progress"}
                />
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variance Alert */}
      {variance !== 0 && reconciliation.status === "in_progress" && (
        <Card
          className={`${varianceType === "short" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle
                className={`h-5 w-5 ${varianceType === "short" ? "text-red-600" : "text-orange-600"}`}
              />
              <div>
                <p
                  className={`font-semibold ${varianceType === "short" ? "text-red-600" : "text-orange-600"}`}
                >
                  {varianceType === "short"
                    ? "Cash Shortage Detected"
                    : "Cash Overage Detected"}
                </p>
                <p className="text-sm">
                  Physical count shows{" "}
                  {varianceType === "short" ? "less" : "more"} cash than
                  expected by {formatCurrency(Math.abs(variance))}.
                  {varianceType === "short" &&
                    " Please investigate missing transactions or add adjustment."}
                  {varianceType === "over" &&
                    " Please verify if there are unrecorded receipts."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 print:hidden">
          <TabsTrigger value="reconciliation">
            Reconciliation Summary
          </TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="history">Adjustments & History</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliation" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reconciliation Calculation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Reconciliation Calculation
                </CardTitle>
                <CardDescription>
                  Breakdown of expected vs actual balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Starting Balance (as of{" "}
                      {formatDate(reconciliation.asOfDate)})
                    </span>
                    <span className="font-medium">
                      {formatCurrency(reconciliation.startingBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Total Disbursements
                    </span>
                    <span className="font-medium text-red-600">
                      - {formatCurrency(totalDisbursements)}
                    </span>
                  </div>
                  {reconciliation.adjustments.map((adj) => (
                    <div
                      key={adj.id}
                      className="flex justify-between py-2 border-b pl-4"
                    >
                      <span className="text-sm text-muted-foreground">
                        {adj.description}
                      </span>
                      <span
                        className={`font-medium ${adj.type === "addition" ? "text-green-600" : "text-red-600"}`}
                      >
                        {adj.type === "addition" ? "+" : "-"}{" "}
                        {formatCurrency(adj.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-b font-semibold">
                    <span>Expected Balance</span>
                    <span>{formatCurrency(calculatedBalance)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Physical Cash Count
                    </span>
                    <span className="font-medium">
                      {formatCurrency(physicalCount)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between py-2 ${varianceType !== "exact" ? "bg-muted p-3 rounded-lg -mx-3" : ""}`}
                  >
                    <span className="font-semibold">Variance</span>
                    <span
                      className={`font-bold ${varianceType === "short" ? "text-red-600" : varianceType === "over" ? "text-orange-600" : "text-green-600"}`}
                    >
                      {varianceType === "short"
                        ? "-"
                        : varianceType === "over"
                          ? "+"
                          : ""}
                      {formatCurrency(Math.abs(variance))}
                      {varianceType !== "exact" &&
                        ` (${varianceType === "short" ? "Shortage" : "Overage"})`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
                <CardDescription>
                  Status of all transactions in this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Verified Transactions</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(verifiedTotal)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {
                          reconciliation.transactions.filter(
                            (t) => t.status === "verified",
                          ).length
                        }{" "}
                        transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Unverified Transactions</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">
                        {formatCurrency(unverifiedTotal)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {
                          reconciliation.transactions.filter(
                            (t) => t.status === "unverified",
                          ).length
                        }{" "}
                        transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span>Adjustments</span>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${totalAdjustments > 0 ? "text-green-600" : totalAdjustments < 0 ? "text-red-600" : ""}`}
                      >
                        {totalAdjustments > 0 ? "+" : ""}
                        {formatCurrency(totalAdjustments)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reconciliation.adjustments.length} adjustments
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Reconciliation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about the reconciliation process, discrepancies found, etc..."
                  rows={4}
                  disabled={reconciliation.status !== "in_progress"}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Petty Cash Transactions</CardTitle>
                  <CardDescription>
                    Review and verify each transaction
                  </CardDescription>
                </div>
                {reconciliation.status === "in_progress" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdjustmentModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Adjustment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliation.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-xs">
                          {transaction.voucherNumber}
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          {transaction.receiptAttached ? (
                            <Badge variant="outline" className="text-green-600">
                              <Receipt className="h-3 w-3 mr-1" />
                              Attached
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600">
                              <XCircle className="h-3 w-3 mr-1" />
                              Missing
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {getTransactionStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          {reconciliation.status === "in_progress" &&
                            transaction.status === "unverified" && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleVerifyTransaction(transaction)
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const reason = prompt(
                                      "Please provide reason for dispute:",
                                    );
                                    if (reason)
                                      handleDisputeTransaction(
                                        transaction,
                                        reason,
                                      );
                                  }}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adjustments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adjustments</CardTitle>
                <CardDescription>
                  Manual adjustments made during reconciliation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reconciliation.adjustments.length > 0 ? (
                  <div className="space-y-3">
                    {reconciliation.adjustments.map((adj) => (
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
                          {reconciliation.status === "in_progress" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAdjustment(adj.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" />
                    <p>No adjustments recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit Trail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audit Trail</CardTitle>
                <CardDescription>
                  Reconciliation history and approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Reconciliation Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(reconciliation.createdAt)} by{" "}
                        {reconciliation.createdBy}
                      </p>
                    </div>
                  </div>

                  {reconciliation.verifiedBy && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Reconciliation Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(reconciliation.verifiedDate!)} by{" "}
                          {reconciliation.verifiedBy}
                        </p>
                      </div>
                    </div>
                  )}

                  {reconciliation.approvedBy && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Send className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Reconciliation Approved</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(reconciliation.approvedDate!)} by{" "}
                          {reconciliation.approvedBy}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Adjustment Modal */}
      <Dialog
        open={isAdjustmentModalOpen}
        onOpenChange={setIsAdjustmentModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Adjustment</DialogTitle>
            <DialogDescription>
              Record a manual adjustment to balance the petty cash
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
                    Addition (Cash Overage)
                  </SelectItem>
                  <SelectItem value="deduction">
                    Deduction (Cash Shortage)
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
                placeholder="e.g., Unrecorded cash receipt"
              />
              {adjustmentErrors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {adjustmentErrors.description}
                </p>
              )}
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
              {adjustmentErrors.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {adjustmentErrors.amount}
                </p>
              )}
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
              onClick={() => setIsAdjustmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAdjustment}>Add Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <AlertDialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Reconciliation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete this reconciliation?
              {variance !== 0 && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  There is still a{" "}
                  {varianceType === "short" ? "shortage" : "overage"} of{" "}
                  {formatCurrency(Math.abs(variance))}.
                  {varianceType === "short" &&
                    " Please review unverified transactions or add adjustments."}
                  {varianceType === "over" &&
                    " Please verify if there are unrecorded receipts."}
                </div>
              )}
              {unverifiedTotal > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  There are{" "}
                  {
                    reconciliation.transactions.filter(
                      (t) => t.status === "unverified",
                    ).length
                  }{" "}
                  unverified transactions totaling{" "}
                  {formatCurrency(unverifiedTotal)}.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteReconciliation}
              disabled={variance !== 0 || unverifiedTotal > 0}
            >
              Complete Reconciliation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Dialog */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Reconciliation</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that you have reviewed and approve this reconciliation.
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Reconciliation Period: {formatDate(reconciliation.asOfDate)}
                </p>
                <p className="text-sm">
                  Final Balance: {formatCurrency(physicalCount)}
                </p>
                <p className="text-sm">
                  Variance: {formatCurrency(Math.abs(variance))} (
                  {varianceType === "short"
                    ? "Shortage"
                    : varianceType === "over"
                      ? "Overage"
                      : "Exact"}
                  )
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveReconciliation}>
              Approve Reconciliation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
