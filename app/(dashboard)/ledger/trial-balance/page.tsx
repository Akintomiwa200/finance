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
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  Search,
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
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Landmark,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";
import { useLedgerStore } from "@/src/store/ledger-store";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface TrialBalanceRow {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  category: string;
  openingBalance: { debit: number; credit: number };
  transactions: { debit: number; credit: number };
  closingBalance: { debit: number; credit: number };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getAccountTypeLabel(type: string) {
  const labels: Record<string, string> = { asset: "Assets", liability: "Liabilities", equity: "Equity", revenue: "Revenue", expense: "Expenses" };
  return labels[type] || type;
}

function getAccountTypeColor(type: string) {
  const colors: Record<string, string> = { asset: "text-blue-600", liability: "text-red-600", equity: "text-purple-600", revenue: "text-emerald-600", expense: "text-amber-600" };
  return colors[type] || "text-gray-600";
}

export default function TrialBalancePage() {
  const router = useRouter();
  const accounts = useLedgerStore((s) => s.accounts);
  const journalEntries = useLedgerStore((s) => s.journalEntries);
  const loading = useLedgerStore((s) => s.loading);
  const fetchAccounts = useLedgerStore((s) => s.fetchAccounts);
  const fetchJournalEntries = useLedgerStore((s) => s.fetchJournalEntries);

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
    if (journalEntries.length === 0) fetchJournalEntries();
  }, [accounts.length, journalEntries.length, fetchAccounts, fetchJournalEntries]);

  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TrialBalanceRow;
    direction: "asc" | "desc";
  }>({ key: "accountCode", direction: "asc" });
  const [activeView, setActiveView] = useState<"summary" | "detailed" | "analytics">("summary");

  const report = useMemo(() => {
    const posted = journalEntries.filter((je) => je.status === "posted" && je.date <= asOfDate);
    const rows: TrialBalanceRow[] = accounts
      .filter((a) => !a.childAccounts?.length)
      .map((a) => {
        let txDr = 0, txCr = 0;
        for (const je of posted) {
          for (const l of je.lines.filter((l) => l.accountId === a.id)) {
            txDr += l.debit;
            txCr += l.credit;
          }
        }
        const isOpeningDebit = a.normalBalance === "debit";
        const openingDebit = isOpeningDebit ? a.openingBalance : 0;
        const openingCredit = isOpeningDebit ? 0 : a.openingBalance;
        return {
          accountId: a.id,
          accountCode: a.accountCode,
          accountName: a.name,
          accountType: a.type,
          category: a.category.replace("_", " "),
          openingBalance: { debit: openingDebit, credit: openingCredit },
          transactions: { debit: txDr, credit: txCr },
          closingBalance: {
            debit: openingDebit + txDr - (isOpeningDebit ? 0 : txCr - txDr),
            credit: openingCredit + txCr - (isOpeningDebit ? 0 : 0),
          },
        };
      })
      .filter((r) => r.closingBalance.debit !== 0 || r.closingBalance.credit !== 0 || r.transactions.debit !== 0 || r.transactions.credit !== 0);

    const totals = {
      openingDebit: rows.reduce((s, r) => s + r.openingBalance.debit, 0),
      openingCredit: rows.reduce((s, r) => s + r.openingBalance.credit, 0),
      transactionDebit: rows.reduce((s, r) => s + r.transactions.debit, 0),
      transactionCredit: rows.reduce((s, r) => s + r.transactions.credit, 0),
      closingDebit: rows.reduce((s, r) => s + r.closingBalance.debit, 0),
      closingCredit: rows.reduce((s, r) => s + r.closingBalance.credit, 0),
    };
    return { asOfDate, accounts: rows, totals, isBalanced: Math.abs(totals.closingDebit - totals.closingCredit) < 0.01, difference: Math.abs(totals.closingDebit - totals.closingCredit) };
  }, [accounts, journalEntries, asOfDate]);

  const categories = useMemo(() => {
    const cats = new Set(report.accounts.map((a) => a.category));
    return ["all", ...Array.from(cats)];
  }, [report.accounts]);

  const filteredAccounts = useMemo(() => {
    let result = [...report.accounts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => a.accountCode.toLowerCase().includes(q) || a.accountName.toLowerCase().includes(q));
    }
    if (accountTypeFilter !== "all") result = result.filter((a) => a.accountType === accountTypeFilter);
    if (categoryFilter !== "all") result = result.filter((a) => a.category === categoryFilter);
    if (sortConfig.key) result.sort((a, b) => compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction));
    return result;
  }, [report.accounts, searchQuery, accountTypeFilter, categoryFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const accountsByType = useMemo(() => {
    const grouped: Record<string, TrialBalanceRow[]> = {};
    for (const a of report.accounts) {
      if (!grouped[a.accountType]) grouped[a.accountType] = [];
      grouped[a.accountType].push(a);
    }
    return grouped;
  }, [report.accounts]);

  const balanceByTypeData = useMemo(() => {
    return Object.entries(accountsByType).map(([type, accs]) => ({
      name: getAccountTypeLabel(type),
      debit: accs.reduce((s, a) => s + a.closingBalance.debit, 0),
      credit: accs.reduce((s, a) => s + a.closingBalance.credit, 0),
    }));
  }, [accountsByType]);

  const categoryDistributionData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of report.accounts) {
      const cat = a.category;
      map[cat] = (map[cat] || 0) + a.closingBalance.debit + a.closingBalance.credit;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [report.accounts]);

  const handleRefresh = () => {
    setSearchQuery("");
    setAccountTypeFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
    fetchAccounts();
    fetchJournalEntries();
  };

  const handleSort = (key: keyof TrialBalanceRow) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = ["Code", "Name", "Type", "Category", "Opening DR", "Opening CR", "Tx DR", "Tx CR", "Closing DR", "Closing CR"];
    const csv = [headers, ...filteredAccounts.map((a) => [
      a.accountCode, a.accountName, a.accountType, a.category,
      a.openingBalance.debit.toString(), a.openingBalance.credit.toString(),
      a.transactions.debit.toString(), a.transactions.credit.toString(),
      a.closingBalance.debit.toString(), a.closingBalance.credit.toString(),
    ])].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-${asOfDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Trial Balance</h1>
            <p className="text-muted-foreground mt-1">Account balances as of {asOfDate}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} className="w-[160px]" />
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Load
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(report.totals.closingDebit)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(report.totals.closingCredit)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Difference</p>
                <p className={`text-xl font-bold ${report.isBalanced ? "text-green-600" : "text-red-600"}`}>{formatCurrency(report.difference)}</p>
              </div>
              {report.isBalanced ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-xl font-bold ${report.isBalanced ? "text-green-600" : "text-red-600"}`}>
                  {report.isBalanced ? "Balanced" : "Unbalanced"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          {Object.entries(accountsByType).map(([type, accs]) => (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base ${getAccountTypeColor(type)}`}>{getAccountTypeLabel(type)}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accs.map((a) => (
                      <TableRow key={a.accountId}>
                        <TableCell className="font-mono text-xs">{a.accountCode}</TableCell>
                        <TableCell>{a.accountName}</TableCell>
                        <TableCell className="text-right font-medium text-blue-600">{a.closingBalance.debit > 0 ? formatCurrency(a.closingBalance.debit) : "-"}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">{a.closingBalance.credit > 0 ? formatCurrency(a.closingBalance.credit) : "-"}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold border-t-2">
                      <TableCell colSpan={2} className="text-right">Subtotal</TableCell>
                      <TableCell className="text-right text-blue-600">{formatCurrency(accs.reduce((s, a) => s + a.closingBalance.debit, 0))}</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(accs.reduce((s, a) => s + a.closingBalance.credit, 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex justify-end gap-8">
                <div className="text-sm">
                  <span className="text-muted-foreground">Grand Total Debit: </span>
                  <span className="font-bold text-blue-600 text-lg">{formatCurrency(report.totals.closingDebit)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Grand Total Credit: </span>
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(report.totals.closingCredit)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by code or name..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
                </div>
                <Select value={accountTypeFilter} onValueChange={(v) => { setAccountTypeFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {["asset", "liability", "equity", "revenue", "expense"].map((t) => (
                      <SelectItem key={t} value={t}>{getAccountTypeLabel(t)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("accountCode")}>Code<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                      <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("accountName")}>Name<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Opening DR</TableHead>
                      <TableHead className="text-right">Opening CR</TableHead>
                      <TableHead className="text-right">Tx DR</TableHead>
                      <TableHead className="text-right">Tx CR</TableHead>
                      <TableHead className="text-right">Closing DR</TableHead>
                      <TableHead className="text-right">Closing CR</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && accounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : paginatedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">No accounts found</TableCell>
                      </TableRow>
                    ) : (
                      paginatedAccounts.map((a) => (
                        <TableRow key={a.accountId}>
                          <TableCell className="font-mono text-xs">{a.accountCode}</TableCell>
                          <TableCell>{a.accountName}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{a.accountType}</Badge></TableCell>
                          <TableCell className="capitalize text-sm">{a.category}</TableCell>
                          <TableCell className="text-right text-sm">{a.openingBalance.debit > 0 ? formatCurrency(a.openingBalance.debit) : "-"}</TableCell>
                          <TableCell className="text-right text-sm">{a.openingBalance.credit > 0 ? formatCurrency(a.openingBalance.credit) : "-"}</TableCell>
                          <TableCell className="text-right text-sm font-medium text-blue-600">{a.transactions.debit > 0 ? formatCurrency(a.transactions.debit) : "-"}</TableCell>
                          <TableCell className="text-right text-sm font-medium text-green-600">{a.transactions.credit > 0 ? formatCurrency(a.transactions.credit) : "-"}</TableCell>
                          <TableCell className="text-right text-sm font-bold text-blue-600">{a.closingBalance.debit > 0 ? formatCurrency(a.closingBalance.debit) : "-"}</TableCell>
                          <TableCell className="text-right text-sm font-bold text-green-600">{a.closingBalance.credit > 0 ? formatCurrency(a.closingBalance.credit) : "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/ledger/trial-balance/${a.accountId}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredAccounts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[60px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm mx-2">Page {currentPage} of {totalPages || 1}</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages || 1)} disabled={currentPage === totalPages || totalPages === 0}><ChevronsRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Balance by Account Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={balanceByTypeData} cx="50%" cy="50%" outerRadius={100} dataKey="debit" nameKey="name">
                      {balanceByTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Category Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Account Type Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(accountsByType).map(([type, accs]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background`}>
                      {type === "asset" && <Wallet className="h-4 w-4 text-blue-600" />}
                      {type === "liability" && <CreditCard className="h-4 w-4 text-red-600" />}
                      {type === "equity" && <PiggyBank className="h-4 w-4 text-purple-600" />}
                      {type === "revenue" && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                      {type === "expense" && <TrendingDown className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{getAccountTypeLabel(type)}</p>
                      <p className="text-sm text-muted-foreground">{accs.length} accounts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(accs.reduce((s, a) => s + a.closingBalance.debit + a.closingBalance.credit, 0))}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
