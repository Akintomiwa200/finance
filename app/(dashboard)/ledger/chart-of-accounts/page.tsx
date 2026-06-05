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
import { Switch } from "@/src/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FolderTree,
  Wallet,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Home,
  Car,
  Landmark,
  CreditCard,
  PiggyBank,
  Building2,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  FileText,
  MoreHorizontal,
  Copy,
  Move,
  Archive,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";

// Types
type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";
type AccountCategory =
  | "current"
  | "fixed"
  | "intangible"
  | "long_term"
  | "operating"
  | "non_operating";
type AccountStatus = "active" | "inactive" | "suspended";
type NormalBalance = "debit" | "credit";

interface Account {
  id: number;
  accountCode: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  subcategory?: string;
  parentAccountId?: number;
  parentAccountName?: string;
  normalBalance: NormalBalance;
  currentBalance: number;
  openingBalance: number;
  closingBalance: number;
  status: AccountStatus;
  description: string;
  department?: string;
  taxRelated: boolean;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  level: number;
  hasChildren: boolean;
  children?: Account[];
  ledgerEntries?: LedgerEntry[];
}

interface LedgerEntry {
  id: number;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  journalId: number;
  journalType: string;
  createdBy: string;
}

// Mock Data
const mockAccounts: Account[] = [
  {
    id: 1,
    accountCode: "1000",
    name: "Assets",
    type: "asset",
    category: "current",
    normalBalance: "debit",
    currentBalance: 0,
    openingBalance: 0,
    closingBalance: 0,
    status: "active",
    description: "All asset accounts",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 0,
    hasChildren: true,
  },
  {
    id: 2,
    accountCode: "1100",
    name: "Current Assets",
    type: "asset",
    category: "current",
    parentAccountId: 1,
    parentAccountName: "Assets",
    normalBalance: "debit",
    currentBalance: 125000000,
    openingBalance: 100000000,
    closingBalance: 125000000,
    status: "active",
    description: "Assets expected to be converted to cash within one year",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 1,
    hasChildren: true,
  },
  {
    id: 3,
    accountCode: "1110",
    name: "Cash - Operating",
    type: "asset",
    category: "current",
    parentAccountId: 2,
    parentAccountName: "Current Assets",
    normalBalance: "debit",
    currentBalance: 45000000,
    openingBalance: 35000000,
    closingBalance: 45000000,
    status: "active",
    description: "Operating cash account",
    taxRelated: false,
    bankAccount: {
      bankName: "First Bank",
      accountNumber: "1234567890",
      accountName: "Company Operating Account",
    },
    createdAt: "2024-01-01",
    updatedAt: "2026-03-01",
    createdBy: "Finance",
    level: 2,
    hasChildren: false,
  },
  {
    id: 4,
    accountCode: "1120",
    name: "Cash - Savings",
    type: "asset",
    category: "current",
    parentAccountId: 2,
    parentAccountName: "Current Assets",
    normalBalance: "debit",
    currentBalance: 50000000,
    openingBalance: 50000000,
    closingBalance: 50000000,
    status: "active",
    description: "Savings account for reserves",
    taxRelated: false,
    bankAccount: {
      bankName: "GT Bank",
      accountNumber: "0987654321",
      accountName: "Company Savings Account",
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 2,
    hasChildren: false,
  },
  {
    id: 5,
    accountCode: "1130",
    name: "Accounts Receivable",
    type: "asset",
    category: "current",
    parentAccountId: 2,
    parentAccountName: "Current Assets",
    normalBalance: "debit",
    currentBalance: 25000000,
    openingBalance: 15000000,
    closingBalance: 25000000,
    status: "active",
    description: "Amounts owed by customers",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 2,
    hasChildren: false,
  },
  {
    id: 6,
    accountCode: "1200",
    name: "Fixed Assets",
    type: "asset",
    category: "fixed",
    parentAccountId: 1,
    parentAccountName: "Assets",
    normalBalance: "debit",
    currentBalance: 25000000,
    openingBalance: 30000000,
    closingBalance: 25000000,
    status: "active",
    description: "Long-term tangible assets",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 1,
    hasChildren: true,
  },
  {
    id: 7,
    accountCode: "1210",
    name: "Equipment",
    type: "asset",
    category: "fixed",
    parentAccountId: 6,
    parentAccountName: "Fixed Assets",
    normalBalance: "debit",
    currentBalance: 15000000,
    openingBalance: 20000000,
    closingBalance: 15000000,
    status: "active",
    description: "Office and computer equipment",
    taxRelated: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 2,
    hasChildren: false,
  },
  {
    id: 8,
    accountCode: "1220",
    name: "Accumulated Depreciation",
    type: "asset",
    category: "fixed",
    parentAccountId: 6,
    parentAccountName: "Fixed Assets",
    normalBalance: "credit",
    currentBalance: 5000000,
    openingBalance: 3000000,
    closingBalance: 5000000,
    status: "active",
    description: "Contra-asset account for depreciation",
    taxRelated: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 2,
    hasChildren: false,
  },
  {
    id: 9,
    accountCode: "2000",
    name: "Liabilities",
    type: "liability",
    category: "long_term",
    normalBalance: "credit",
    currentBalance: 0,
    openingBalance: 0,
    closingBalance: 0,
    status: "active",
    description: "All liability accounts",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 0,
    hasChildren: true,
  },
  {
    id: 10,
    accountCode: "2100",
    name: "Accounts Payable",
    type: "liability",
    category: "current",
    parentAccountId: 9,
    parentAccountName: "Liabilities",
    normalBalance: "credit",
    currentBalance: 15000000,
    openingBalance: 10000000,
    closingBalance: 15000000,
    status: "active",
    description: "Amounts owed to suppliers",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
  {
    id: 11,
    accountCode: "2200",
    name: "Bank Loans",
    type: "liability",
    category: "long_term",
    parentAccountId: 9,
    parentAccountName: "Liabilities",
    normalBalance: "credit",
    currentBalance: 50000000,
    openingBalance: 55000000,
    closingBalance: 50000000,
    status: "active",
    description: "Long-term bank loans",
    taxRelated: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
  {
    id: 12,
    accountCode: "3000",
    name: "Equity",
    type: "equity",
    category: "long_term",
    normalBalance: "credit",
    currentBalance: 0,
    openingBalance: 0,
    closingBalance: 0,
    status: "active",
    description: "Owner's equity accounts",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 0,
    hasChildren: true,
  },
  {
    id: 13,
    accountCode: "3100",
    name: "Share Capital",
    type: "equity",
    category: "long_term",
    parentAccountId: 12,
    parentAccountName: "Equity",
    normalBalance: "credit",
    currentBalance: 100000000,
    openingBalance: 100000000,
    closingBalance: 100000000,
    status: "active",
    description: "Issued share capital",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
  {
    id: 14,
    accountCode: "3200",
    name: "Retained Earnings",
    type: "equity",
    category: "long_term",
    parentAccountId: 12,
    parentAccountName: "Equity",
    normalBalance: "credit",
    currentBalance: 50000000,
    openingBalance: 35000000,
    closingBalance: 50000000,
    status: "active",
    description: "Accumulated retained earnings",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
  {
    id: 15,
    accountCode: "4000",
    name: "Revenue",
    type: "revenue",
    category: "operating",
    normalBalance: "credit",
    currentBalance: 0,
    openingBalance: 0,
    closingBalance: 0,
    status: "active",
    description: "Revenue accounts",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 0,
    hasChildren: true,
  },
  {
    id: 16,
    accountCode: "4100",
    name: "Sales Revenue",
    type: "revenue",
    category: "operating",
    parentAccountId: 15,
    parentAccountName: "Revenue",
    normalBalance: "credit",
    currentBalance: 75000000,
    openingBalance: 50000000,
    closingBalance: 75000000,
    status: "active",
    description: "Revenue from sales of goods/services",
    taxRelated: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
  {
    id: 17,
    accountCode: "5000",
    name: "Expenses",
    type: "expense",
    category: "operating",
    normalBalance: "debit",
    currentBalance: 0,
    openingBalance: 0,
    closingBalance: 0,
    status: "active",
    description: "Expense accounts",
    taxRelated: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "System",
    level: 0,
    hasChildren: true,
  },
  {
    id: 18,
    accountCode: "5100",
    name: "Salaries Expense",
    type: "expense",
    category: "operating",
    parentAccountId: 17,
    parentAccountName: "Expenses",
    normalBalance: "debit",
    currentBalance: 30000000,
    openingBalance: 20000000,
    closingBalance: 30000000,
    status: "active",
    description: "Employee salaries and wages",
    taxRelated: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
  {
    id: 19,
    accountCode: "5200",
    name: "Rent Expense",
    type: "expense",
    category: "operating",
    parentAccountId: 17,
    parentAccountName: "Expenses",
    normalBalance: "debit",
    currentBalance: 12000000,
    openingBalance: 8000000,
    closingBalance: 12000000,
    status: "active",
    description: "Office rent expense",
    taxRelated: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "Finance",
    level: 1,
    hasChildren: false,
  },
];

const accountTypes = [
  { value: "asset", label: "Asset", icon: Wallet },
  { value: "liability", label: "Liability", icon: CreditCard },
  { value: "equity", label: "Equity", icon: PiggyBank },
  { value: "revenue", label: "Revenue", icon: TrendingUp },
  { value: "expense", label: "Expense", icon: TrendingDown },
];

const accountCategories = [
  "current",
  "fixed",
  "intangible",
  "long_term",
  "operating",
  "non_operating",
];

const departments = [
  "Finance",
  "Operations",
  "Sales",
  "Marketing",
  "Engineering",
  "HR",
  "IT",
];

export default function ChartOfAccounts() {
  const router = useRouter();

  // State
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Account;
    direction: "asc" | "desc";
  }>({ key: "accountCode", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "hierarchy" | "ledger">(
    "list",
  );

  // Form state
  const [formData, setFormData] = useState({
    accountCode: "",
    name: "",
    type: "asset" as AccountType,
    category: "current" as AccountCategory,
    parentAccountId: undefined as number | undefined,
    normalBalance: "debit" as NormalBalance,
    openingBalance: 0,
    description: "",
    department: "",
    taxRelated: false,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalAccounts = accounts.length;
    const totalAssets = accounts
      .filter((a) => a.type === "asset" && !a.parentAccountId)
      .reduce((sum, a) => sum + a.currentBalance, 0);
    const totalLiabilities = accounts
      .filter((a) => a.type === "liability" && !a.parentAccountId)
      .reduce((sum, a) => sum + a.currentBalance, 0);
    const totalEquity = accounts
      .filter((a) => a.type === "equity" && !a.parentAccountId)
      .reduce((sum, a) => sum + a.currentBalance, 0);
    const totalRevenue = accounts
      .filter((a) => a.type === "revenue" && !a.parentAccountId)
      .reduce((sum, a) => sum + a.currentBalance, 0);
    const totalExpenses = accounts
      .filter((a) => a.type === "expense" && !a.parentAccountId)
      .reduce((sum, a) => sum + a.currentBalance, 0);

    return {
      totalAccounts,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }, [accounts]);

  // Build account hierarchy
  const buildHierarchy = useMemo(() => {
    const accountMap = new Map<number, Account>();
    const roots: Account[] = [];

    accounts.forEach((account) => {
      accountMap.set(account.id, { ...account, children: [] });
    });

    accounts.forEach((account) => {
      if (account.parentAccountId && accountMap.has(account.parentAccountId)) {
        const parent = accountMap.get(account.parentAccountId)!;
        parent.children = parent.children || [];
        parent.children.push(accountMap.get(account.id)!);
      } else if (account.level === 0) {
        roots.push(accountMap.get(account.id)!);
      }
    });

    return roots;
  }, [accounts]);

  // Filter and sort
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountCode.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((a) => a.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) =>
        compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction),
      );
    }

    return result;
  }, [
    accounts,
    searchQuery,
    typeFilter,
    categoryFilter,
    statusFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Account) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      accountCode: account.accountCode,
      name: account.name,
      type: account.type,
      category: account.category,
      parentAccountId: account.parentAccountId,
      normalBalance: account.normalBalance,
      openingBalance: account.openingBalance,
      description: account.description,
      department: account.department || "",
      taxRelated: account.taxRelated,
      notes: account.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.accountCode) errors.accountCode = "Account code is required";
    if (!formData.name) errors.name = "Account name is required";
    if (!formData.type) errors.type = "Account type is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAccount = () => {
    if (!validateForm()) return;

    const newAccount: Account = {
      id: Math.max(...accounts.map((a) => a.id), 0) + 1,
      accountCode: formData.accountCode,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      parentAccountId: formData.parentAccountId,
      parentAccountName: formData.parentAccountId
        ? accounts.find((a) => a.id === formData.parentAccountId)?.name
        : undefined,
      normalBalance: formData.normalBalance,
      currentBalance: formData.openingBalance,
      openingBalance: formData.openingBalance,
      closingBalance: formData.openingBalance,
      status: "active",
      description: formData.description,
      department: formData.department || undefined,
      taxRelated: formData.taxRelated,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
      level: formData.parentAccountId ? 1 : 0,
      hasChildren: false,
    };

    setAccounts((prev) => [...prev, newAccount]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleUpdateAccount = () => {
    if (!validateForm() || !selectedAccount) return;

    const updatedAccount: Account = {
      ...selectedAccount,
      ...formData,
      updatedAt: new Date().toISOString().split("T")[0],
      currentBalance: formData.openingBalance,
      openingBalance: formData.openingBalance,
      closingBalance: formData.openingBalance,
    };

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
      accountCode: "",
      name: "",
      type: "asset",
      category: "current",
      parentAccountId: undefined,
      normalBalance: "debit",
      openingBalance: 0,
      description: "",
      department: "",
      taxRelated: false,
      notes: "",
    });
    setFormErrors({});
  };

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

  const getTypeIcon = (type: AccountType) => {
    const config = accountTypes.find((t) => t.value === type);
    if (config && config.icon) {
      const Icon = config.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <FolderTree className="h-4 w-4" />;
  };

  const getTypeBadge = (type: AccountType) => {
    const styles = {
      asset: "bg-blue-100 text-blue-700",
      liability: "bg-red-100 text-red-700",
      equity: "bg-green-100 text-green-700",
      revenue: "bg-purple-100 text-purple-700",
      expense: "bg-orange-100 text-orange-700",
    };

    const labels = {
      asset: "Asset",
      liability: "Liability",
      equity: "Equity",
      revenue: "Revenue",
      expense: "Expense",
    };

    return (
      <Badge className={`${styles[type]} flex items-center gap-1 w-fit`}>
        {getTypeIcon(type)}
        {labels[type]}
      </Badge>
    );
  };

  const getStatusBadge = (status: AccountStatus) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      suspended: "bg-red-100 text-red-700",
    };

    const labels = {
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getNormalBalanceBadge = (balance: NormalBalance) => {
    return (
      <Badge
        variant="outline"
        className={
          balance === "debit"
            ? "border-blue-500 text-blue-600"
            : "border-red-500 text-red-600"
        }
      >
        {balance === "debit" ? "Debit" : "Credit"}
      </Badge>
    );
  };

  const handleExport = () => {
    const headers = [
      "Code",
      "Name",
      "Type",
      "Category",
      "Normal Balance",
      "Current Balance",
      "Opening Balance",
      "Status",
      "Department",
      "Description",
    ];
    const csvData = filteredAccounts.map((a) => [
      a.accountCode,
      a.name,
      a.type,
      a.category,
      a.normalBalance,
      a.currentBalance.toString(),
      a.openingBalance.toString(),
      a.status,
      a.department || "",
      a.description,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chart-of-accounts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render hierarchy tree
  const renderHierarchy = (accounts: Account[], depth = 0) => {
    return accounts.map((account) => (
      <div key={account.id} className="select-none">
        <div
          className={`flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer ${depth > 0 ? "ml-6" : ""}`}
          onClick={() => handleViewAccount(account)}
          style={{ marginLeft: depth * 24 }}
        >
          <div className="flex items-center gap-2 flex-1">
            <FolderTree className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {account.accountCode}
            </span>
            <span className="font-medium">{account.name}</span>
            {getTypeBadge(account.type)}
            {getNormalBalanceBadge(account.normalBalance)}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {formatCurrency(account.currentBalance)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAccount(account);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {account.children &&
          account.children.length > 0 &&
          renderHierarchy(account.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              Chart of Accounts
              <Badge variant="secondary" className="ml-2">
                {stats.totalAccounts}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Define and manage your complete chart of accounts
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
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
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalAssets)}
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
                  {formatCurrency(stats.totalLiabilities)}
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
                  {formatCurrency(stats.totalEquity)}
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
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.netIncome)}
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
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          <TabsTrigger value="ledger">Ledger View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code, name, description..."
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
                  value={categoryFilter}
                  onValueChange={(v) => {
                    setCategoryFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {accountCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace("_", " ").toUpperCase()}
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
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Accounts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>
                {filteredAccounts.length} account
                {filteredAccounts.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("accountCode")}
                        >
                          Code
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("name")}
                        >
                          Account Name
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Normal Balance</TableHead>
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
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <FolderTree className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No accounts found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-mono text-xs">
                            {account.accountCode}
                          </TableCell>
                          <TableCell className="font-medium">
                            {account.name}
                          </TableCell>
                          <TableCell>{getTypeBadge(account.type)}</TableCell>
                          <TableCell className="capitalize">
                            {account.category}
                          </TableCell>
                          <TableCell>
                            {getNormalBalanceBadge(account.normalBalance)}
                          </TableCell>
                          <TableCell
                            className={`font-medium ${account.type === "asset" || account.type === "expense" ? "text-blue-600" : "text-green-600"}`}
                          >
                            {formatCurrency(Math.abs(account.currentBalance))}
                            {account.currentBalance < 0 && " (DR)"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(account.status)}
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
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

        <TabsContent value="hierarchy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Hierarchy</CardTitle>
              <CardDescription>
                Hierarchical view of the chart of accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">{renderHierarchy(buildHierarchy)}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Ledger</CardTitle>
              <CardDescription>
                View all ledger entries by account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p>Select an account to view its ledger entries</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {accounts
                    .filter((a) => !a.hasChildren && a.level > 0)
                    .slice(0, 8)
                    .map((account) => (
                      <Button
                        key={account.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <span className="font-mono text-xs mr-2">
                          {account.accountCode}
                        </span>
                        {account.name}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Account Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAccount?.name}</DialogTitle>
            <DialogDescription>
              {selectedAccount?.accountCode}
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <div className="mt-1">
                    {getTypeBadge(selectedAccount.type)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="capitalize">{selectedAccount.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Normal Balance
                  </p>
                  <div className="mt-1">
                    {getNormalBalanceBadge(selectedAccount.normalBalance)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedAccount.status)}
                  </div>
                </div>
                {selectedAccount.parentAccountName && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Parent Account
                    </p>
                    <p>{selectedAccount.parentAccountName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{selectedAccount.department || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Related</p>
                  <p>{selectedAccount.taxRelated ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>
                    {formatDate(selectedAccount.createdAt)} by{" "}
                    {selectedAccount.createdBy}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedAccount.description || "-"}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Balance Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Opening Balance
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedAccount.openingBalance)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Current Balance
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(selectedAccount.currentBalance)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Closing Balance
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedAccount.closingBalance)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAccount.bankAccount && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p>{selectedAccount.bankAccount.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-mono">
                        {selectedAccount.bankAccount.accountNumber}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p>{selectedAccount.bankAccount.accountName}</p>
                    </div>
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

      {/* Add/Edit Account Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddModalOpen ? "Add New Account" : "Edit Account"}
            </DialogTitle>
            <DialogDescription>
              Define account details for the chart of accounts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Account Code *</Label>
                <Input
                  value={formData.accountCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountCode: e.target.value,
                    }))
                  }
                  placeholder="e.g., 1000"
                  className="mt-1 font-mono"
                />
                {formErrors.accountCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.accountCode}
                  </p>
                )}
              </div>
              <div>
                <Label>Account Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Cash - Operating"
                  className="mt-1"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Label>Account Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, type: v }))
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
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parent Account</Label>
                <Select
                  value={formData.parentAccountId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentAccountId: v ? parseInt(v) : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {accounts
                      .filter((a) => a.level === 0)
                      .map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id.toString()}
                        >
                          {account.accountCode} - {account.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Normal Balance</Label>
                <Select
                  value={formData.normalBalance}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, normalBalance: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
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
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, department: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Tax Related</Label>
                <Switch
                  checked={formData.taxRelated}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, taxRelated: checked }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={2}
                  placeholder="Account description..."
                />
              </div>
              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="mt-1"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isAddModalOpen ? handleAddAccount : handleUpdateAccount}
            >
              {isAddModalOpen ? "Add Account" : "Save Changes"}
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
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{selectedAccount?.name}"? This action cannot
              be undone.
              {selectedAccount?.hasChildren && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg text-red-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This account has child accounts. Delete all child accounts
                  first.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
              disabled={selectedAccount?.hasChildren}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
