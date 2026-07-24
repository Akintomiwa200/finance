"use client";

import { use, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  Landmark,
  Calendar,
  FileText,
  ChevronRight,
  ExternalLink,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Download,
  Users,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useLedgerStore } from "@/src/store/ledger-store";
import type { Account, LedgerEntry } from "@/src/types/ledger";

const TYPE_ICONS: Record<string, React.ElementType> = {
  asset: Wallet,
  liability: CreditCard,
  equity: PiggyBank,
  revenue: TrendingUp,
  expense: TrendingDown,
};

const TYPE_COLORS: Record<string, string> = {
  asset: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  liability: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  equity: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  revenue: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  expense: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const accountId = id;

  const getAccountById = useLedgerStore((s) => s.getAccountById);
  const getChildAccounts = useLedgerStore((s) => s.getChildAccounts);
  const getLedgerEntriesForAccount = useLedgerStore((s) => s.getLedgerEntriesForAccount);
  const getJournalEntriesForAccount = useLedgerStore((s) => s.getJournalEntriesForAccount);
  const fetchAccounts = useLedgerStore((s) => s.fetchAccounts);
  const fetchJournalEntries = useLedgerStore((s) => s.fetchJournalEntries);
  const accounts = useLedgerStore((s) => s.accounts);

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
    fetchJournalEntries();
  }, [accounts.length, fetchAccounts, fetchJournalEntries]);

  const account = getAccountById(accountId);
  const childAccounts = getChildAccounts(accountId);
  const ledgerEntries = getLedgerEntriesForAccount(accountId);
  const journalEntries = getJournalEntriesForAccount(accountId);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const parentChain = useMemo(() => {
    if (!account) return [];
    const chain: Account[] = [];
    let current = account;
    while (current.parentAccountId) {
      const parent = accounts.find((a) => a.id === current.parentAccountId);
      if (parent) {
        chain.unshift(parent);
        current = parent;
      } else break;
    }
    return chain;
  }, [account, accounts]);

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Account Not Found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              The account you are looking for does not exist or may have been removed.
            </p>
            <Button
              className="mt-6"
              onClick={() => router.push("/ledger/chart-of-accounts")}
            >
              Return to Chart of Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = TYPE_ICONS[account.type] || Wallet;

  const debitTotal = ledgerEntries.reduce((sum, e) => sum + e.debit, 0);
  const creditTotal = ledgerEntries.reduce((sum, e) => sum + e.credit, 0);

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb & Back */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <button
              onClick={() => router.push("/ledger/chart-of-accounts")}
              className="hover:text-foreground transition-colors"
            >
              Chart of Accounts
            </button>
            {parentChain.map((p) => (
              <span key={p.id} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <button
                  onClick={() => router.push(`/ledger/chart-of-accounts/${p.id}`)}
                  className="hover:text-foreground transition-colors"
                >
                  {p.name}
                </button>
              </span>
            ))}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{account.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1.5 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(account.accountCode, "code")}>
            <Copy className="h-4 w-4" />
            {copiedField === "code" ? "Copied!" : account.accountCode}
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TYPE_COLORS[account.type]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{account.name}</h1>
            <Badge className={`${STATUS_BADGE[account.status]} border-0`}>
              {account.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {account.description}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${account.normalBalance === "debit" ? "text-foreground" : "text-foreground"}`}>
              {formatCurrency(account.currentBalance)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {account.normalBalance} balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Opening Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(account.openingBalance)}</p>
            <p className="text-xs text-muted-foreground mt-1">Start of period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Period Change</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const change = account.currentBalance - account.openingBalance;
              const pct = account.openingBalance > 0 ? ((change / account.openingBalance) * 100).toFixed(1) : "0.0";
              return (
                <>
                  <p className={`text-2xl font-bold ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {change >= 0 ? "+" : ""}{formatCurrency(change)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {change >= 0 ? "+" : ""}{pct}% from opening
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ledgerEntries.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Posted entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Info + Sub Accounts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-0.5">Account Code</dt>
                <dd className="font-mono font-medium">{account.accountCode}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Account Type</dt>
                <dd>
                  <Badge className={`${TYPE_COLORS[account.type]} border-0`}>
                    {account.type}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Category</dt>
                <dd className="capitalize">{account.category.replace("_", " ")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Normal Balance</dt>
                <dd className="capitalize">{account.normalBalance}</dd>
              </div>
              {account.department && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Department</dt>
                  <dd>{account.department}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground mb-0.5">Tax Related</dt>
                <dd>{account.taxRelated ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Created</dt>
                <dd className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(account.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Last Updated</dt>
                <dd className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(account.updatedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Created By</dt>
                <dd className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {account.createdBy}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Parent Account</dt>
                <dd>
                  {account.parentAccountId && account.parentAccountName ? (
                    <button
                      onClick={() => router.push(`/ledger/chart-of-accounts/${account.parentAccountId}`)}
                      className="text-brand-600 hover:underline flex items-center gap-1"
                    >
                      {account.parentAccountName}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-muted-foreground">None (root account)</span>
                  )}
                </dd>
              </div>
            </dl>

            {account.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{account.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank Account Info & Sub-Accounts */}
        <div className="space-y-6">
          {account.bankName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">{account.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account No.</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium">{account.bankAccountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(account.bankAccountNumber || "", "bank")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium text-right max-w-[180px]">{account.bankAccountName}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {childAccounts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Sub-Accounts ({childAccounts.length})
                </CardTitle>
                <CardDescription>Accounts under this parent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {childAccounts.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => router.push(`/ledger/chart-of-accounts/${child.id}`)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium">{child.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{child.accountCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(child.currentBalance)}</p>
                      <p className="text-xs text-muted-foreground">{child.status}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs: Ledger Entries & Journal Entries */}
      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger" className="gap-1.5">
            <FileText className="h-4 w-4" />
            Ledger Entries ({ledgerEntries.length})
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-1.5">
            <ArrowUpDown className="h-4 w-4" />
            Journal Entries ({journalEntries.length})
          </TabsTrigger>
        </TabsList>

        {/* Ledger Entries Tab */}
        <TabsContent value="ledger">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Ledger Entries</CardTitle>
                <CardDescription>
                  Running balance history for {account.name}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {ledgerEntries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No ledger entries</p>
                  <p className="text-sm mt-1">This account has no posted transactions yet.</p>
                </div>
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
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(entry.date)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {entry.reference}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {entry.description}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {entry.debit > 0 ? (
                              <span className="text-foreground">{formatCurrency(entry.debit)}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {entry.credit > 0 ? (
                              <span className="text-foreground">{formatCurrency(entry.credit)}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(entry.balance)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize text-xs">
                              {entry.journalType}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {ledgerEntries.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex justify-end gap-8 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Debits: </span>
                      <span className="font-mono font-medium">{formatCurrency(debitTotal)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Credits: </span>
                      <span className="font-mono font-medium">{formatCurrency(creditTotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Journal Entries</CardTitle>
              <CardDescription>
                All journal entries that include transactions in {account.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {journalEntries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ArrowUpDown className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No journal entries</p>
                  <p className="text-sm mt-1">No journal entries reference this account.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {journalEntries.map((je) => {
                    const accountLine = je.lines.find((l) => l.accountId === accountId);
                    if (!accountLine) return null;
                    return (
                      <div
                        key={je.id}
                        className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold">{je.entryNumber}</span>
                              <Badge
                                className={`border-0 text-xs ${
                                  je.status === "posted"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : je.status === "approved"
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                      : je.status === "draft"
                                        ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                }`}
                              >
                                {je.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {je.description}
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(je.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ref: </span>
                            <span className="font-mono text-xs">{je.reference}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              This account:{" "}
                            </span>
                            <span className="font-mono font-medium">
                              {accountLine.debit > 0
                                ? `Debit ${formatCurrency(accountLine.debit)}`
                                : `Credit ${formatCurrency(accountLine.credit)}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">By: </span>
                            <span>{je.createdBy}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
