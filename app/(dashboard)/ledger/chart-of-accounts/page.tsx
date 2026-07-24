"use client";

import { useState, useMemo, useEffect } from "react";
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
  Eye,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FolderTree,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";
import { useLedgerStore } from "@/src/store/ledger-store";
import type {
  Account,
  AccountType,
  AccountCategory,
  AccountStatus,
  NormalBalance,
} from "@/src/types/ledger";
import { ACCOUNT_TYPE_OPTIONS, ACCOUNT_CATEGORY_OPTIONS } from "@/src/types/ledger";

const accountTypes = ACCOUNT_TYPE_OPTIONS;
const accountCategories = ACCOUNT_CATEGORY_OPTIONS.map((c) => c.value);

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

  const accounts = useLedgerStore((s) => s.accounts);
  const loading = useLedgerStore((s) => s.loading);
  const fetchAccounts = useLedgerStore((s) => s.fetchAccounts);
  const updateAccount = useLedgerStore((s) => s.updateAccount);
  const deleteAccount = useLedgerStore((s) => s.deleteAccount);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "hierarchy" | "ledger">(
    "list",
  );
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accountCode: "",
    name: "",
    type: "asset" as AccountType,
    category: "current" as AccountCategory,
    parentAccountId: null as string | null,
    normalBalance: "debit" as NormalBalance,
    openingBalance: 0,
    description: "",
    department: "",
    taxRelated: false,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const buildHierarchy = useMemo(() => {
    const accountMap = new Map<string, Account & { children: Account[] }>();
    const roots: (Account & { children: Account[] })[] = [];

    accounts.forEach((account) => {
      accountMap.set(account.id, { ...account, children: [] });
    });

    accounts.forEach((account) => {
      if (account.parentAccountId && accountMap.has(account.parentAccountId)) {
        const parent = accountMap.get(account.parentAccountId)!;
        parent.children.push(accountMap.get(account.id)!);
      } else if (!account.parentAccountId) {
        roots.push(accountMap.get(account.id)!);
      }
    });

    return roots;
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountCode.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          (a.description && a.description.toLowerCase().includes(query)),
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

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: keyof Account) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewAccount = (account: Account) => {
    router.push(`/ledger/chart-of-accounts/${account.id}`);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      accountCode: account.accountCode,
      name: account.name,
      type: account.type,
      category: account.category,
      parentAccountId: account.parentAccountId || null,
      normalBalance: account.normalBalance,
      openingBalance: account.openingBalance,
      description: account.description || "",
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

  const handleUpdateAccount = async () => {
    if (!validateForm() || !selectedAccount) return;
    setSubmitting(true);
    try {
      const result = await updateAccount(selectedAccount.id, {
        ...formData,
        normalBalance: formData.normalBalance.toUpperCase(),
        type: formData.type.toUpperCase(),
        category: formData.category.toUpperCase(),
      });
      if (result) {
        resetForm();
        setIsEditModalOpen(false);
        setSelectedAccount(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    setSubmitting(true);
    try {
      await deleteAccount(selectedAccount.id);
      setIsDeleteDialogOpen(false);
      setSelectedAccount(null);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      accountCode: "",
      name: "",
      type: "asset",
      category: "current",
      parentAccountId: null,
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
    const iconMap: Record<string, typeof Wallet> = {
      asset: Wallet,
      liability: CreditCard,
      equity: PiggyBank,
      revenue: TrendingUp,
      expense: TrendingDown,
    };
    const Icon = iconMap[type] || FolderTree;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeBadge = (type: AccountType) => {
    const styles: Record<string, string> = {
      asset: "bg-blue-100 text-blue-700",
      liability: "bg-red-100 text-red-700",
      equity: "bg-green-100 text-green-700",
      revenue: "bg-purple-100 text-purple-700",
      expense: "bg-orange-100 text-orange-700",
    };

    const labels: Record<string, string> = {
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
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      suspended: "bg-red-100 text-red-700",
    };

    const labels: Record<string, string> = {
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
      a.description || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chart-of-accounts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderHierarchy = (items: (Account & { children?: Account[] })[], depth = 0) => {
    return items.map((account) => (
      <div key={account.id} className="select-none">
        <div
          className={`flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer`}
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
          <Button onClick={() => router.push("/ledger/chart-of-accounts/new")} className="gap-2">
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
        onValueChange={(v) => setActiveView(v as "list" | "hierarchy" | "ledger")}
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
                    {loading && accounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                            <p className="text-muted-foreground">Loading accounts...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedAccounts.length === 0 ? (
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
                            {account.category.replace("_", " ")}
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
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(totalPages || 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
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
                    .filter((a) => !a.childAccounts?.length && a.parentAccountId)
                    .slice(0, 8)
                    .map((account) => (
                      <Button
                        key={account.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleViewAccount(account)}
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
                  <p className="capitalize">{selectedAccount.category.replace("_", " ")}</p>
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
                    {selectedAccount.createdBy || "System"}
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

              {selectedAccount.bankName && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p>{selectedAccount.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-mono">
                        {selectedAccount.bankAccountNumber}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p>{selectedAccount.bankAccountName}</p>
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
                if (selectedAccount) handleEditAccount(selectedAccount);
              }}
            >
              Edit Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Account Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Account
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
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, type: v as AccountType }))
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
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, category: v as AccountCategory }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parent Account</Label>
                <Select
                  value={formData.parentAccountId || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentAccountId: v || null,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {accounts
                      .filter((a) => !a.parentAccountId)
                      .map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id}
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
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, normalBalance: v as NormalBalance }))
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
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAccount}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
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
              Permanently delete &quot;{selectedAccount?.name}&quot;? This action cannot
              be undone.
              {selectedAccount?.childAccounts && selectedAccount.childAccounts.length > 0 && (
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
              disabled={!!selectedAccount?.childAccounts && selectedAccount.childAccounts.length > 0}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
