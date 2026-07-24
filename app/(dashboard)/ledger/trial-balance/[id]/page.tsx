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
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
} from "lucide-react";
import { ACCOUNT_TYPE_CONFIG } from "@/src/types/ledger";
import type { JournalLine } from "@/src/types/ledger";

export default function TrialBalanceAccountDetailPage() {
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
    getJournalEntriesForAccount,
  } = useLedgerStore();

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
    if (journalEntries.length === 0) fetchJournalEntries();
  }, [accounts.length, journalEntries.length, fetchAccounts, fetchJournalEntries]);

  const account = getAccountById(id);
  const ledgerEntries = useMemo(() => getLedgerEntriesForAccount(id), [getLedgerEntriesForAccount, id, journalEntries]);
  const journalAccountEntries = useMemo(() => getJournalEntriesForAccount(id), [getJournalEntriesForAccount, id, journalEntries]);

  const postedEntryLines = useMemo(() => {
    const lines: (JournalLine & { journalDate: string; journalRef: string; journalType: string; journalDescription: string })[] = [];
    for (const je of journalEntries.filter((j) => j.status === "posted")) {
      for (const line of je.lines.filter((l) => l.accountId === id)) {
        lines.push({
          ...line,
          journalDate: je.date,
          journalRef: je.entryNumber,
          journalType: je.type,
          journalDescription: je.description,
        });
      }
    }
    return lines;
  }, [journalEntries, id]);

  const totalDebit = postedEntryLines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = postedEntryLines.reduce((s, l) => s + l.credit, 0);
  const netChange = account?.normalBalance === "debit" ? totalDebit - totalCredit : totalCredit - totalDebit;
  const closingBalance = (account?.openingBalance || 0) + netChange;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Math.abs(v));

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const handleExport = () => {
    const headers = ["Date", "Reference", "Description", "Debit", "Credit", "Running Balance"];
    const rows = ledgerEntries.map((e) => [formatDate(e.date), e.reference, e.description, e.debit.toString(), e.credit.toString(), e.balance.toString()]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-${account?.accountCode || id}.csv`;
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
        <Button variant="outline" className="mt-4" onClick={() => router.push("/ledger/trial-balance")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Trial Balance
        </Button>
      </div>
    );
  }

  const typeConfig = ACCOUNT_TYPE_CONFIG[account.type];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/ledger/trial-balance")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <Badge variant="outline" className={`capitalize ${typeConfig.color}`}>{typeConfig.label}</Badge>
              <Badge variant={account.status === "active" ? "default" : "secondary"} className="capitalize">{account.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">Account {account.accountCode} &middot; Trial Balance Detail</p>
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
              <TrendingUp className="h-3 w-3" /> {postedEntryLines.filter((l) => l.debit > 0).length} debit entries
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalCredit)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <TrendingDown className="h-3 w-3" /> {postedEntryLines.filter((l) => l.credit > 0).length} credit entries
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Closing Balance</p>
            <p className={`text-lg font-bold ${closingBalance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(closingBalance)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              {closingBalance >= 0 ? <Wallet className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
              {closingBalance >= 0 ? "Net debit" : "Net credit"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Ledger Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {ledgerEntries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No posted entries found for this account.</p>
          ) : (
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
                  {ledgerEntries.map((e) => (
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal Entries Touching This Account</CardTitle>
        </CardHeader>
        <CardContent>
          {journalAccountEntries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No journal entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalAccountEntries.map((je) => {
                    const relevantLines = je.lines.filter((l) => l.accountId === id);
                    const entryAmount = relevantLines.reduce((s, l) => s + l.debit + l.credit, 0);
                    return (
                      <TableRow key={je.id}>
                        <TableCell className="font-mono text-xs">{je.entryNumber}</TableCell>
                        <TableCell>{formatDate(je.date)}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{je.type}</Badge></TableCell>
                        <TableCell><Badge variant={je.status === "posted" ? "default" : "secondary"} className="capitalize">{je.status}</Badge></TableCell>
                        <TableCell>{je.description}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatCurrency(entryAmount)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/ledger/journal-entries/${je.id}`)}>
                            <ArrowLeft className="h-3 w-3 rotate-180" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
