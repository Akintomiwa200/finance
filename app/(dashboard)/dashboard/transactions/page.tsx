"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Search, Download,
  ArrowUpDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { fetchTransactions } from "@/src/lib/api";
import { TransactionsListSkeleton } from "@/src/components/layout/dashboard-skeletons";

interface Tx {
  id: string;
  name: string;
  rawDate: string;
  date: string;
  amount: number;
  status: string;
  category: string;
  account: string;
}

function formatDate(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return `Today, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTransactions({ limit: 200 })
      .then((data) => {
        const normalized: Tx[] = data.transactions.map((tx) => ({
          id: tx.id,
          name: tx.title,
          rawDate: tx.date,
          date: formatDate(new Date(tx.date)),
          amount: Number(tx.amount),
          status: tx.status.toLowerCase(),
          category: tx.category,
          account: tx.account || "Checking",
        }));
        setTransactions(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = transactions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.name.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.status.toLowerCase().includes(q) ||
          tx.account.toLowerCase().includes(q),
      );
    }
    result = [...result].sort((a, b) => {
      if (sortField === "amount") {
        return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
      return sortDir === "desc"
        ? new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
        : new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
    });
    return result;
  }, [searchQuery, sortField, sortDir, transactions]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  const handleDownloadCSV = () => {
    const header = "Name,Date,Amount,Status,Category,Account\n";
    const rows = transactions
      .map((tx) => `${tx.name},${tx.rawDate},${tx.amount},${tx.status},${tx.category},${tx.account}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <TransactionsListSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {filtered.length} total transactions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="h-10 w-full sm:w-[240px] pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={handleDownloadCSV}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("date")}>
                    <span className="inline-flex items-center gap-1">
                      Date <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Account</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                    <span className="inline-flex items-center gap-1 justify-end">
                      Amount <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => router.push(`/dashboard/transactions/${tx.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          tx.amount > 0 ? "bg-accent-50 text-success" : "bg-accent-50 text-danger"
                        }`}>
                          {tx.amount > 0 ? "↑" : "↓"}
                        </div>
                        <span className="font-medium">{tx.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.category}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.account}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${tx.amount > 0 ? "text-success" : ""}`}>
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={tx.status === "completed" ? "success" : "warning"}>{tx.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-background text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-accent-600 text-white"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-background text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
