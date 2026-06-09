"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Search, Download,
  ArrowUpDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

const allTransactions = [
  { id: 1, name: "Grocery Store", date: "Today, 2:30 PM", amount: -86.50, status: "completed" as const, category: "Food", account: "Checking" },
  { id: 2, name: "Freelance Payment", date: "Today, 11:00 AM", amount: 1200.00, status: "completed" as const, category: "Income", account: "Checking" },
  { id: 3, name: "Electric Bill", date: "Yesterday", amount: -145.00, status: "pending" as const, category: "Utilities", account: "Checking" },
  { id: 4, name: "Transfer to Savings", date: "Yesterday", amount: -500.00, status: "completed" as const, category: "Transfer", account: "Savings" },
  { id: 5, name: "Coffee Shop", date: "2 days ago", amount: -5.75, status: "completed" as const, category: "Food", account: "Checking" },
  { id: 6, name: "Subscription - Netflix", date: "3 days ago", amount: -15.99, status: "completed" as const, category: "Entertainment", account: "Checking" },
  { id: 7, name: "Client Invoice #1042", date: "3 days ago", amount: 3400.00, status: "completed" as const, category: "Income", account: "Checking" },
  { id: 8, name: "Gas Station", date: "4 days ago", amount: -48.20, status: "completed" as const, category: "Transport", account: "Checking" },
  { id: 9, name: "Restaurant", date: "5 days ago", amount: -62.30, status: "completed" as const, category: "Food", account: "Checking" },
  { id: 10, name: "Phone Bill", date: "6 days ago", amount: -85.00, status: "completed" as const, category: "Utilities", account: "Checking" },
  { id: 11, name: "Internet & TV", date: "Mar 22", amount: -89.99, status: "completed" as const, category: "Utilities", account: "Checking" },
  { id: 12, name: "Insurance Premium", date: "Mar 20", amount: -210.00, status: "completed" as const, category: "Insurance", account: "Checking" },
  { id: 13, name: "Credit Card Payment", date: "Mar 18", amount: -320.00, status: "completed" as const, category: "Bills", account: "Credit Card" },
  { id: 14, name: "Consulting Fee", date: "Mar 15", amount: 2500.00, status: "completed" as const, category: "Income", account: "Checking" },
  { id: 15, name: "Amazon Order", date: "Mar 14", amount: -67.20, status: "completed" as const, category: "Shopping", account: "Checking" },
  { id: 16, name: "Uber Rides", date: "Mar 12", amount: -34.50, status: "pending" as const, category: "Transport", account: "Checking" },
  { id: 17, name: "Dividend Payout", date: "Mar 10", amount: 150.00, status: "completed" as const, category: "Income", account: "Savings" },
  { id: 18, name: "Gym Membership", date: "Mar 8", amount: -49.99, status: "completed" as const, category: "Health", account: "Checking" },
  { id: 19, name: "Freelance Project", date: "Mar 5", amount: 1800.00, status: "completed" as const, category: "Income", account: "Checking" },
  { id: 20, name: "Water Bill", date: "Mar 3", amount: -42.00, status: "completed" as const, category: "Utilities", account: "Checking" },
  { id: 21, name: "SWIFT Transfer — Client Ltd (UK)", date: "Today, 9:15 AM", amount: 4500.00, status: "completed" as const, category: "Income", account: "USD Account" },
  { id: 22, name: "Alibaba Order", date: "Yesterday", amount: -2340.00, status: "completed" as const, category: "Shopping", account: "USD Account" },
  { id: 23, name: "TransferWise Fee", date: "2 days ago", amount: -35.00, status: "completed" as const, category: "Transfer", account: "GBP Account" },
  { id: 24, name: "AWS Cloud Services", date: "3 days ago", amount: -1247.30, status: "pending" as const, category: "Technology", account: "USD Account" },
  { id: 25, name: "Freelancer.com Payment", date: "4 days ago", amount: 2800.00, status: "completed" as const, category: "Income", account: "EUR Account" },
  { id: 26, name: "Shopify Payout", date: "5 days ago", amount: 1890.00, status: "completed" as const, category: "Income", account: "CAD Account" },
  { id: 27, name: "AliExpress Purchase", date: "6 days ago", amount: -156.50, status: "completed" as const, category: "Shopping", account: "USD Account" },
  { id: 28, name: "Remittance (Western Union)", date: "1 week ago", amount: -500.00, status: "pending" as const, category: "Transfer", account: "Checking" },
  { id: 29, name: "Google Ads Charge", date: "1 week ago", amount: -890.00, status: "completed" as const, category: "Advertising", account: "USD Account" },
  { id: 30, name: "International Invoice — TechCorp", date: "1 week ago", amount: 6200.00, status: "completed" as const, category: "Income", account: "GBP Account" },
];

export default function TransactionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = allTransactions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.name.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.status.toLowerCase().includes(q),
      );
    }
    result = [...result].sort((a, b) => {
      if (sortField === "amount") {
        return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
      return sortDir === "desc" ? a.id - b.id : b.id - a.id;
    });
    return result;
  }, [searchQuery, sortField, sortDir]);

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
    const rows = allTransactions
      .map((tx) => `${tx.name},${tx.date},${tx.amount},${tx.status},${tx.category},${tx.account}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} total transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Input
              placeholder="Search transactions..."
              className="pl-9 w-full sm:w-[240px]"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
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
                          tx.amount > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                          {tx.amount > 0 ? "↑" : "↓"}
                        </div>
                        <span className="font-medium">{tx.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.category}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.account}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${tx.amount > 0 ? "text-green-600" : ""}`}>
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
              Page {page} of {totalPages}
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
