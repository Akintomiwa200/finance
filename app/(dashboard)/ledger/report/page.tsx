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
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";
import { useLedgerStore } from "@/src/store/ledger-store";
import type { Account, JournalLine, LedgerEntry } from "@/src/types/ledger";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getAccountTypeLabel(type: string) {
  const labels: Record<string, string> = { asset: "Assets", liability: "Liabilities", equity: "Equity", revenue: "Revenue", expense: "Expenses" };
  return labels[type] || type;
}

function getAccountTypeColor(type: string) {
  const colors: Record<string, string> = { asset: "text-blue-600", liability: "text-red-600", equity: "text-purple-600", revenue: "text-emerald-600", expense: "text-amber-600" };
  return colors[type] || "text-gray-600";
}

interface LedgerAccountView {
  account: Account;
  transactions: LedgerEntry[];
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
}

export default function LedgerReportPage() {
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

  const today = new Date().toISOString().split("T")[0];
  const oneMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "accountCode", direction: "asc" });
  const [activeTab, setActiveTab] = useState<"accounts" | "transactions">("accounts");

  const ledgerAccounts = useMemo(() => {
    const posted = journalEntries.filter((je) => je.status === "posted" && je.date >= fromDate && je.date <= toDate);
    const leafAccounts = accounts.filter((a) => !a.childAccounts?.length);

    return leafAccounts.map((a): LedgerAccountView => {
      const txns: LedgerEntry[] = [];
      let totalDr = 0, totalCr = 0;

      for (const je of posted) {
        for (const l of je.lines.filter((l) => l.accountId === a.id)) {
          totalDr += l.debit;
          totalCr += l.credit;
          txns.push({
            id: l.id,
            date: je.date,
            reference: je.entryNumber,
            description: l.description,
            debit: l.debit,
            credit: l.credit,
            balance: 0,
            journalId: je.id,
            journalType: je.type,
            createdBy: je.createdBy,
          });
        }
      }

      return {
        account: a,
        transactions: txns.sort((x, y) => x.date.localeCompare(y.date)),
        totalDebit: totalDr,
        totalCredit: totalCr,
        closingBalance: a.currentBalance,
      };
    }).filter((v) => v.transactions.length > 0 || v.account.currentBalance !== 0);
  }, [accounts, journalEntries, fromDate, toDate]);

  const categories = useMemo(() => {
    const cats = new Set(ledgerAccounts.map((v) => v.account.category.replace("_", " ")));
    return ["all", ...Array.from(cats)];
  }, [ledgerAccounts]);

  const filteredAccounts = useMemo(() => {
    let result = [...ledgerAccounts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((v) => v.account.accountCode.toLowerCase().includes(q) || v.account.name.toLowerCase().includes(q));
    }
    if (accountTypeFilter !== "all") result = result.filter((v) => v.account.type === accountTypeFilter);
    if (categoryFilter !== "all") result = result.filter((v) => v.account.category.replace("_", " ") === categoryFilter);
    if (sortConfig.key) result.sort((a, b) => compareValues((a.account as unknown as Record<string, unknown>)[sortConfig.key], (b.account as unknown as Record<string, unknown>)[sortConfig.key], sortConfig.direction));
    return result;
  }, [ledgerAccounts, searchQuery, accountTypeFilter, categoryFilter, sortConfig]);

  const allTransactions = useMemo(() => {
    const txns: (LedgerEntry & { accountCode: string; accountName: string })[] = [];
    for (const v of ledgerAccounts) {
      for (const t of v.transactions) {
        txns.push({ ...t, accountCode: v.account.accountCode, accountName: v.account.name });
      }
    }
    return txns.sort((a, b) => b.date.localeCompare(a.date));
  }, [ledgerAccounts]);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return allTransactions;
    const q = searchQuery.toLowerCase();
    return allTransactions.filter((t) => t.reference.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.accountCode.toLowerCase().includes(q) || t.accountName.toLowerCase().includes(q));
  }, [allTransactions, searchQuery]);

  const totalPages = activeTab === "accounts"
    ? Math.ceil(filteredAccounts.length / itemsPerPage)
    : Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totals = useMemo(() => ({
    totalDebits: ledgerAccounts.reduce((s, v) => s + v.totalDebit, 0),
    totalCredits: ledgerAccounts.reduce((s, v) => s + v.totalCredit, 0),
    netChange: ledgerAccounts.reduce((s, v) => s + v.totalDebit - v.totalCredit, 0),
  }), [ledgerAccounts]);

  const handleRefresh = () => {
    setSearchQuery("");
    setAccountTypeFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
    fetchAccounts();
    fetchJournalEntries();
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (activeTab === "accounts") {
      const headers = ["Code", "Name", "Type", "Category", "Total Debit", "Total Credit", "Closing Balance"];
      const csv = [headers, ...filteredAccounts.map((v) => [
        v.account.accountCode, v.account.name, v.account.type, v.account.category,
        v.totalDebit.toString(), v.totalCredit.toString(), v.closingBalance.toString(),
      ])].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `ledger-accounts-${fromDate}-${toDate}.csv`; a.click(); URL.revokeObjectURL(url);
    } else {
      const headers = ["Date", "Account", "Description", "Debit", "Credit", "Reference", "Created By"];
      const csv = [headers, ...filteredTransactions.map((t) => [
        t.date, `${t.accountCode} - ${t.accountName}`, t.description, t.debit.toString(), t.credit.toString(), t.reference, t.createdBy,
      ])].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `ledger-transactions-${fromDate}-${toDate}.csv`; a.click(); URL.revokeObjectURL(url);
    }
  };

  const resetPage = () => { setCurrentPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">General Ledger</h1>
            <p className="text-muted-foreground mt-1">{formatDate(fromDate)} — {formatDate(toDate)}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); resetPage(); }} className="w-[140px]" />
          <span className="text-muted-foreground">—</span>
          <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); resetPage(); }} className="w-[140px]" />
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1"><RefreshCw className="h-4 w-4" /> Load</Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1"><Download className="h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1"><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(totals.totalDebits)}</p>
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
                <p className="text-xl font-bold text-green-600">{formatCurrency(totals.totalCredits)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Change</p>
                <p className={`text-xl font-bold ${totals.netChange >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {totals.netChange >= 0 ? "+" : "-"}{formatCurrency(Math.abs(totals.netChange))}
                </p>
              </div>
              {totals.netChange >= 0 ? <TrendingUp className="h-5 w-5 text-blue-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-xl font-bold">{ledgerAccounts.length}</p>
              </div>
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as typeof activeTab); resetPage(); }} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Accounts Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search accounts..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }} className="pl-9" />
                </div>
                <Select value={accountTypeFilter} onValueChange={(v) => { setAccountTypeFilter(v); resetPage(); }}>
                  <SelectTrigger className="w-full sm:w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {["asset", "liability", "equity", "revenue", "expense"].map((t) => <SelectItem key={t} value={t}>{getAccountTypeLabel(t)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); resetPage(); }}>
                  <SelectTrigger className="w-full sm:w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c.toUpperCase()}</SelectItem>)}
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
                      <TableHead className="text-right">Total Debit</TableHead>
                      <TableHead className="text-right">Total Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && accounts.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                    ) : paginatedAccounts.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No accounts found</TableCell></TableRow>
                    ) : (
                      paginatedAccounts.map((v) => (
                        <TableRow key={v.account.id}>
                          <TableCell className="font-mono text-xs">{v.account.accountCode}</TableCell>
                          <TableCell className="font-medium">{v.account.name}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{v.account.type}</Badge></TableCell>
                          <TableCell className="capitalize text-sm">{v.account.category.replace("_", " ")}</TableCell>
                          <TableCell className="text-right font-medium text-blue-600">{v.totalDebit > 0 ? formatCurrency(v.totalDebit) : "-"}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{v.totalCredit > 0 ? formatCurrency(v.totalCredit) : "-"}</TableCell>
                          <TableCell className={`text-right font-bold ${v.account.normalBalance === "debit" ? "text-blue-600" : "text-green-600"}`}>{formatCurrency(v.closingBalance)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/ledger/report/${v.account.id}`)}>
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
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); resetPage(); }}>
                      <SelectTrigger className="w-[60px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem>
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

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by reference, description, account..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }} className="pl-9" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No transactions found</TableCell></TableRow>
                    ) : (
                      paginatedTransactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="text-sm">{formatDate(t.date)}</TableCell>
                          <TableCell><span className="font-mono text-xs">{t.accountCode}</span> <span className="text-sm">{t.accountName}</span></TableCell>
                          <TableCell className="text-sm">{t.description || "-"}</TableCell>
                          <TableCell className="font-mono text-xs">{t.reference}</TableCell>
                          <TableCell className="text-right font-medium text-blue-600">{t.debit > 0 ? formatCurrency(t.debit) : "-"}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{t.credit > 0 ? formatCurrency(t.credit) : "-"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{t.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredTransactions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); resetPage(); }}>
                      <SelectTrigger className="w-[60px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}</span>
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
      </Tabs>
    </div>
  );
}
