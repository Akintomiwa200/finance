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
  Building2,
  Landmark,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Printer,
  Copy,
  MoreHorizontal,
  Banknote,
  Receipt,
  FileText,
  Lock,
  Unlock,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type AccountType =
  | "checking"
  | "savings"
  | "money_market"
  | "fixed_deposit"
  | "current";
type AccountStatus = "active" | "inactive" | "suspended" | "closed";
type BankName =
  | "First Bank"
  | "GT Bank"
  | "Zenith Bank"
  | "Access Bank"
  | "UBA"
  | "Union Bank"
  | "FCMB"
  | "Sterling Bank"
  | "Other";

interface BankAccount {
  id: number;
  accountName: string;
  accountNumber: string;
  bankName: BankName;
  accountType: AccountType;
  currency: string;
  currentBalance: number;
  availableBalance: number;
  openingBalance: number;
  status: AccountStatus;
  branchName: string;
  swiftCode?: string;
  routingNumber?: string;
  iban?: string;
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
  };
  reconciliationDate?: string;
  lastStatementDate?: string;
  notes?: string;
  isDefault: boolean;
  chartOfAccountId?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock Data
const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    accountName: "Company Operating Account",
    accountNumber: "2034567890",
    bankName: "First Bank",
    accountType: "current",
    currency: "NGN",
    currentBalance: 12500000,
    availableBalance: 12500000,
    openingBalance: 10000000,
    status: "active",
    branchName: "Ikeja Branch",
    swiftCode: "FIRSTNGLA",
    routingNumber: "011234567",
    contactPerson: {
      name: "John Adeyemi",
      email: "john@company.com",
      phone: "+234 802 123 4567",
    },
    reconciliationDate: "2026-03-01",
    lastStatementDate: "2026-03-31",
    isDefault: true,
    chartOfAccountId: 1110,
    createdAt: "2024-01-15",
    updatedAt: "2026-03-31",
    createdBy: "Finance Admin",
  },
  {
    id: 2,
    accountName: "Company Savings Account",
    accountNumber: "0987654321",
    bankName: "GT Bank",
    accountType: "savings",
    currency: "NGN",
    currentBalance: 50000000,
    availableBalance: 50000000,
    openingBalance: 50000000,
    status: "active",
    branchName: "Victoria Island",
    swiftCode: "GTBANGLA",
    routingNumber: "058123456",
    contactPerson: {
      name: "Sarah Okafor",
      email: "sarah@company.com",
      phone: "+234 803 456 7890",
    },
    reconciliationDate: "2026-03-01",
    lastStatementDate: "2026-03-31",
    isDefault: false,
    chartOfAccountId: 1120,
    createdAt: "2024-02-01",
    updatedAt: "2026-03-31",
    createdBy: "Finance Admin",
  },
  {
    id: 3,
    accountName: "USD Dollar Account",
    accountNumber: "1234567890",
    bankName: "Zenith Bank",
    accountType: "current",
    currency: "USD",
    currentBalance: 25000,
    availableBalance: 25000,
    openingBalance: 25000,
    status: "active",
    branchName: "Marina",
    swiftCode: "ZEIBNGLA",
    routingNumber: "057123456",
    contactPerson: {
      name: "Michael Eze",
      email: "michael@company.com",
      phone: "+234 805 678 9012",
    },
    reconciliationDate: "2026-03-01",
    lastStatementDate: "2026-03-31",
    isDefault: false,
    chartOfAccountId: 1110,
    createdAt: "2024-03-10",
    updatedAt: "2026-03-31",
    createdBy: "Finance Admin",
  },
  {
    id: 4,
    accountName: "Fixed Deposit Account",
    accountNumber: "5678901234",
    bankName: "Access Bank",
    accountType: "fixed_deposit",
    currency: "NGN",
    currentBalance: 100000000,
    availableBalance: 100000000,
    openingBalance: 100000000,
    status: "active",
    branchName: "Allen Avenue",
    swiftCode: "ABNGLALA",
    routingNumber: "044123456",
    contactPerson: {
      name: "Amara Nwosu",
      email: "amara@company.com",
      phone: "+234 806 789 0123",
    },
    reconciliationDate: "2026-03-01",
    lastStatementDate: "2026-03-31",
    isDefault: false,
    chartOfAccountId: 1120,
    createdAt: "2024-04-15",
    updatedAt: "2026-03-31",
    createdBy: "Treasury Manager",
  },
  {
    id: 5,
    accountName: "Petty Cash Account",
    accountNumber: "PETTY001",
    bankName: "Other",
    accountType: "checking",
    currency: "NGN",
    currentBalance: 250000,
    availableBalance: 250000,
    openingBalance: 250000,
    status: "active",
    branchName: "Head Office",
    isDefault: false,
    chartOfAccountId: 1110,
    createdAt: "2024-05-20",
    updatedAt: "2026-03-31",
    createdBy: "Finance Admin",
  },
];

const bankNames: BankName[] = [
  "First Bank",
  "GT Bank",
  "Zenith Bank",
  "Access Bank",
  "UBA",
  "Union Bank",
  "FCMB",
  "Sterling Bank",
  "Other",
];

const accountTypes = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "current", label: "Current" },
  { value: "money_market", label: "Money Market" },
  { value: "fixed_deposit", label: "Fixed Deposit" },
];

const statuses = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
  { value: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-700" },
  {
    value: "suspended",
    label: "Suspended",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "closed", label: "Closed", color: "bg-red-100 text-red-700" },
];

const currencies = ["NGN", "USD", "EUR", "GBP"];

// Helper functions
const formatCurrency = (amount: number, currency: string = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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

const getStatusBadge = (status: AccountStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    active: <CheckCircle className="h-3 w-3 mr-1" />,
    inactive: <Clock className="h-3 w-3 mr-1" />,
    suspended: <AlertCircle className="h-3 w-3 mr-1" />,
    closed: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getAccountTypeLabel = (type: AccountType) => {
  return accountTypes.find((t) => t.value === type)?.label || type;
};

export default function BankAccounts() {
  const router = useRouter();

  // State
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BankAccount;
    direction: "asc" | "desc";
  }>({ key: "accountName", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"accounts" | "summary">(
    "accounts",
  );
  const [showBalances, setShowBalances] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "First Bank" as BankName,
    accountType: "current" as AccountType,
    currency: "NGN",
    openingBalance: 0,
    branchName: "",
    swiftCode: "",
    routingNumber: "",
    iban: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    isDefault: false,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce(
      (sum, acc) => sum + acc.currentBalance,
      0,
    );
    const activeCount = accounts.filter((a) => a.status === "active").length;
    const totalNGN = accounts
      .filter((a) => a.currency === "NGN")
      .reduce((sum, acc) => sum + acc.currentBalance, 0);
    const totalUSD = accounts
      .filter((a) => a.currency === "USD")
      .reduce((sum, acc) => sum + acc.currentBalance, 0);
    const totalEUR = accounts
      .filter((a) => a.currency === "EUR")
      .reduce((sum, acc) => sum + acc.currentBalance, 0);

    return {
      totalAccounts,
      totalBalance,
      activeCount,
      totalNGN,
      totalUSD,
      totalEUR,
      averageBalance: totalAccounts > 0 ? totalBalance / totalAccounts : 0,
    };
  }, [accounts]);

  // Filter and sort
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountName.toLowerCase().includes(query) ||
          a.accountNumber.includes(query) ||
          a.bankName.toLowerCase().includes(query) ||
          a.branchName.toLowerCase().includes(query),
      );
    }

    if (bankFilter !== "all") {
      result = result.filter((a) => a.bankName === bankFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((a) => a.accountType === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (currencyFilter !== "all") {
      result = result.filter((a) => a.currency === currencyFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
  }, [
    accounts,
    searchQuery,
    bankFilter,
    typeFilter,
    statusFilter,
    currencyFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof BankAccount) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setFormData({
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      accountType: account.accountType,
      currency: account.currency,
      openingBalance: account.openingBalance,
      branchName: account.branchName,
      swiftCode: account.swiftCode || "",
      routingNumber: account.routingNumber || "",
      iban: account.iban || "",
      contactName: account.contactPerson?.name || "",
      contactEmail: account.contactPerson?.email || "",
      contactPhone: account.contactPerson?.phone || "",
      isDefault: account.isDefault,
      notes: account.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.accountName) errors.accountName = "Account name is required";
    if (!formData.accountNumber)
      errors.accountNumber = "Account number is required";
    if (!formData.bankName) errors.bankName = "Bank name is required";
    if (!formData.branchName) errors.branchName = "Branch name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAccount = () => {
    if (!validateForm()) return;

    const newAccount: BankAccount = {
      id: Math.max(...accounts.map((a) => a.id), 0) + 1,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      accountType: formData.accountType,
      currency: formData.currency,
      currentBalance: formData.openingBalance,
      availableBalance: formData.openingBalance,
      openingBalance: formData.openingBalance,
      status: "active",
      branchName: formData.branchName,
      swiftCode: formData.swiftCode,
      routingNumber: formData.routingNumber,
      iban: formData.iban,
      contactPerson: formData.contactName
        ? {
            name: formData.contactName,
            email: formData.contactEmail,
            phone: formData.contactPhone,
          }
        : undefined,
      isDefault: formData.isDefault,
      chartOfAccountId: formData.accountType === "savings" ? 1120 : 1110,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
    };

    // If this account is set as default, remove default from others
    if (formData.isDefault) {
      setAccounts((prev) => prev.map((a) => ({ ...a, isDefault: false })));
    }

    setAccounts((prev) => [newAccount, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateAccount = () => {
    if (!validateForm() || !selectedAccount) return;

    const updatedAccount: BankAccount = {
      ...selectedAccount,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      accountType: formData.accountType,
      currency: formData.currency,
      openingBalance: formData.openingBalance,
      branchName: formData.branchName,
      swiftCode: formData.swiftCode,
      routingNumber: formData.routingNumber,
      iban: formData.iban,
      contactPerson: formData.contactName
        ? {
            name: formData.contactName,
            email: formData.contactEmail,
            phone: formData.contactPhone,
          }
        : undefined,
      isDefault: formData.isDefault,
      notes: formData.notes,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    // If this account is set as default, remove default from others
    if (formData.isDefault && !selectedAccount.isDefault) {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === selectedAccount.id ? a.isDefault : false,
        })),
      );
    }

    setAccounts((prev) =>
      prev.map((a) => (a.id === selectedAccount.id ? updatedAccount : a)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = () => {
    if (!selectedAccount) return;
    setAccounts((prev) => prev.filter((a) => a.id !== selectedAccount.id));
    setIsDeleteDialogOpen(false);
    setSelectedAccount(null);
  };

  const resetForm = () => {
    setFormData({
      accountName: "",
      accountNumber: "",
      bankName: "First Bank",
      accountType: "current",
      currency: "NGN",
      openingBalance: 0,
      branchName: "",
      swiftCode: "",
      routingNumber: "",
      iban: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      isDefault: false,
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Account Name",
      "Account Number",
      "Bank",
      "Type",
      "Currency",
      "Balance",
      "Status",
    ];
    const csvData = filteredAccounts.map((a) => [
      a.accountName,
      a.accountNumber,
      a.bankName,
      getAccountTypeLabel(a.accountType),
      a.currency,
      a.currentBalance.toString(),
      a.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bank-accounts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setAccounts([...mockBankAccounts]);
    setCurrentPage(1);
    setSearchQuery("");
    setBankFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrencyFilter("all");
  };

  const handleSetDefault = (account: BankAccount) => {
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === account.id })),
    );
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
              <Landmark className="h-6 w-6" />
              Bank Accounts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all your business bank accounts
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
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">{stats.totalAccounts}</p>
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
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalBalance, "NGN")}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Balance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.averageBalance, "NGN")}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currency Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">NGN Balance</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(stats.totalNGN, "NGN")}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">USD Balance</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(stats.totalUSD, "USD")}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">EUR Balance</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(stats.totalEUR, "EUR")}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600 opacity-50" />
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
                placeholder="Search by account name, number, bank..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={bankFilter}
              onValueChange={(v) => {
                setBankFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                {bankNames.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
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
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currencyFilter}
              onValueChange={(v) => {
                setCurrencyFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <DollarSign className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowBalances(!showBalances)}
              className="print:hidden"
            >
              {showBalances ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("accountName")}
                    >
                      Account Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("currentBalance")}
                    >
                      Balance
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Landmark className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No bank accounts found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {account.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                          {account.accountName}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {account.accountNumber}
                      </TableCell>
                      <TableCell>{account.bankName}</TableCell>
                      <TableCell className="capitalize">
                        {getAccountTypeLabel(account.accountType)}
                      </TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell
                        className={`font-medium ${showBalances ? "text-green-600" : "filter blur-sm"}`}
                      >
                        {showBalances
                          ? formatCurrency(
                              account.currentBalance,
                              account.currency,
                            )
                          : "•••••••"}
                      </TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell>
                        {account.isDefault ? (
                          <Badge className="bg-blue-100 text-blue-700">
                            Default
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(account)}
                            className="text-xs"
                          >
                            Set Default
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAccount(account)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAccount(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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

      {/* View Account Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedAccount?.accountName}</span>
              {selectedAccount && getStatusBadge(selectedAccount.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedAccount?.accountNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{selectedAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="capitalize">
                    {getAccountTypeLabel(selectedAccount.accountType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p>{selectedAccount.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p>{selectedAccount.branchName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Opening Balance
                  </p>
                  <p>
                    {formatCurrency(
                      selectedAccount.openingBalance,
                      selectedAccount.currency,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Balance
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(
                      selectedAccount.currentBalance,
                      selectedAccount.currency,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Balance
                  </p>
                  <p>
                    {formatCurrency(
                      selectedAccount.availableBalance,
                      selectedAccount.currency,
                    )}
                  </p>
                </div>
                {selectedAccount.swiftCode && (
                  <div>
                    <p className="text-sm text-muted-foreground">SWIFT Code</p>
                    <p className="font-mono text-sm">
                      {selectedAccount.swiftCode}
                    </p>
                  </div>
                )}
                {selectedAccount.routingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Routing Number
                    </p>
                    <p className="font-mono text-sm">
                      {selectedAccount.routingNumber}
                    </p>
                  </div>
                )}
                {selectedAccount.iban && (
                  <div>
                    <p className="text-sm text-muted-foreground">IBAN</p>
                    <p className="font-mono text-sm">{selectedAccount.iban}</p>
                  </div>
                )}
              </div>

              {selectedAccount.contactPerson && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Person
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{selectedAccount.contactPerson.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{selectedAccount.contactPerson.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{selectedAccount.contactPerson.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {(selectedAccount.reconciliationDate ||
                selectedAccount.lastStatementDate) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">
                    Reconciliation Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAccount.reconciliationDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Reconciliation
                        </p>
                        <p>{formatDate(selectedAccount.reconciliationDate)}</p>
                      </div>
                    )}
                    {selectedAccount.lastStatementDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Statement
                        </p>
                        <p>{formatDate(selectedAccount.lastStatementDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedAccount.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedAccount.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                handleEditAccount(selectedAccount!);
              }}
            >
              Edit Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Account Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "Add Bank Account" : "Edit Bank Account"}
            </DialogTitle>
            <DialogDescription>Enter bank account details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Account Name *</Label>
                <Input
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountName: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g., Company Operating Account"
                />
                {formErrors.accountName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.accountName}
                  </p>
                )}
              </div>
              <div>
                <Label>Account Number *</Label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Account number"
                />
                {formErrors.accountNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.accountNumber}
                  </p>
                )}
              </div>
              <div>
                <Label>Bank Name *</Label>
                <Select
                  value={formData.bankName}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, bankName: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bankNames.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.bankName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.bankName}
                  </p>
                )}
              </div>
              <div>
                <Label>Account Type</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, accountType: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, currency: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Opening Balance (₦)</Label>
                <Input
                  type="number"
                  value={formData.openingBalance || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      openingBalance: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Branch Name *</Label>
                <Input
                  value={formData.branchName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      branchName: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g., Ikeja Branch"
                />
                {formErrors.branchName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.branchName}
                  </p>
                )}
              </div>
              <div>
                <Label>SWIFT Code</Label>
                <Input
                  value={formData.swiftCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      swiftCode: e.target.value.toUpperCase(),
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g., FIRSTNGLA"
                />
              </div>
              <div>
                <Label>Routing Number</Label>
                <Input
                  value={formData.routingNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      routingNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Routing/ABA number"
                />
              </div>
              <div>
                <Label>IBAN</Label>
                <Input
                  value={formData.iban}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      iban: e.target.value.toUpperCase(),
                    }))
                  }
                  className="mt-1"
                  placeholder="International Bank Account Number"
                />
              </div>
            </div>

            {/* Contact Person */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Contact Person (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactName: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Default Account */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Set as Default Account</Label>
                  <p className="text-xs text-muted-foreground">
                    This account will be pre-selected for transactions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="border-t pt-4">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={3}
                placeholder="Additional notes about this account..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                isCreateModalOpen ? handleCreateAccount : handleUpdateAccount
              }
            >
              {isCreateModalOpen ? "Add Account" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{selectedAccount?.accountName}"? This action
              cannot be undone.
              {selectedAccount?.isDefault && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This is the default account. Please set another account as
                  default before deleting.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
              disabled={selectedAccount?.isDefault}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
