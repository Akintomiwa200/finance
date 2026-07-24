"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLedgerStore } from "@/src/store/ledger-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  ArrowLeft,
  Printer,
  Download,
  Loader2,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
} from "lucide-react";
import { ACCOUNT_TYPE_CONFIG } from "@/src/types/ledger";

export default function GeneralLedgerAccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    accounts,
    journalEntries,
    loading,
    fetchAccounts,
    fetchJournalEntries,
    getAccountById,
    getLedgerEntriesForAccount,
  } = useLedgerStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
    if (journalEntries.length === 0) fetchJournalEntries();
  }, [accounts.length, journalEntries.length, fetchAccounts, fetchJournalEntries]);

  const account = getAccountById(id);
  const allLedgerEntries = useMemo(() => getLedgerEntriesForAccount(id), [getLedgerEntriesForAccount, id, journalEntries]);

  const filteredEntries = useMemo(() => {
    let entries = allLedgerEntries;
    if (dateFrom) entries = entries.filter((e) => e.date >= dateFrom);
    if (dateTo) entries = entries.filter((e) => e.date <= dateTo);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter((e) => e.reference.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return entries;
  }, [allLedgerEntries, dateFrom, dateTo, searchQuery]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalDebit = filteredEntries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = filteredEntries.reduce((s, e) => s + e.credit, 0);
  const netChange = account?.normalBalance === "debit" ? totalDebit - totalCredit : totalCredit - totalDebit;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Math.abs(v));

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const handleExport = () => {
    const headers = ["Date", "Reference", "Description", "Debit", "Credit", "Running Balance"];
    const rows = filteredEntries.map((e) => [formatDate(e.date), e.reference, e.description, e.debit.toString(), e.credit.toString(), e.balance.toString()]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `general-ledger-${account?.accountCode || id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !account) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Account not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/ledger/report")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
        </Button>
      </div>
    );
  }

  const typeConfig = ACCOUNT_TYPE_CONFIG[account.type];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/ledger/report")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <Badge variant="outline" className={`capitalize ${typeConfig.color}`}>{typeConfig.label}</Badge>
              <Badge variant={account.status === "active" ? "default" : "secondary"} className="capitalize">{account.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">Account {account.accountCode} &middot; General Ledger</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Opening Balance</p>
            <p className="text-lg font-bold">{formatCurrency(account.openingBalance)}</p>
            <Badge variant="outline" className="mt-1 capitalize text-xs">{account.normalBalance} normal</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(totalDebit)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3" /> {filteredEntries.filter((e) => e.debit > 0).length} entries
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalCredit)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <TrendingDown className="h-3 w-3" /> {filteredEntries.filter((e) => e.credit > 0).length} entries
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Closing Balance</p>
            <p className={`text-lg font-bold ${netChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency((account.openingBalance || 0) + netChange)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              {netChange >= 0 ? <Wallet className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
              Net {netChange >= 0 ? "debit" : "credit"}: {formatCurrency(netChange)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="flex gap-2">
              <Input type="date" className="w-[150px]" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} placeholder="From" />
              <Input type="date" className="w-[150px]" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} placeholder="To" />
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No transactions found for this account.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Running Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEntries.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell>{formatDate(e.date)}</TableCell>
                        <TableCell className="font-mono text-xs">{e.reference}</TableCell>
                        <TableCell>{e.description || <span className="text-muted-foreground italic">No description</span>}</TableCell>
                        <TableCell className="text-right text-sm">{e.debit > 0 ? formatCurrency(e.debit) : "-"}</TableCell>
                        <TableCell className="text-right text-sm">{e.credit > 0 ? formatCurrency(e.credit) : "-"}</TableCell>
                        <TableCell className={`text-right text-sm font-medium ${e.balance >= 0 ? "text-blue-600" : "text-green-600"}`}>
                          {formatCurrency(e.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rows:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[60px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredEntries.length)} of {filteredEntries.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
                  <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Debits</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(totalDebit)}</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Credits</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(totalCredit)}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Net Movement</p>
                  <p className={`text-lg font-bold ${netChange >= 0 ? "text-blue-600" : "text-green-600"}`}>{formatCurrency(netChange)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
