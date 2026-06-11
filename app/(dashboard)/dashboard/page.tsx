"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingCart,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  X,
  Check,
  Send,
  Plus,
  User,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useAuthStore } from "@/src/store/auth-store";
import { Badge } from "@/src/components/ui/badge";
import { Dialog } from "@/src/components/ui/dialog";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchTransactions, createTransaction } from "@/src/lib/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#64748b"];

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

function computeMonthlyIncome(transactions: NormalizedTx[]): { month: string; income: number; expenses: number }[] {
  const monthly: Record<string, { income: number; expenses: number }> = {};
  MONTHS.forEach((m) => (monthly[m] = { income: 0, expenses: 0 }));
  transactions.forEach((tx) => {
    const m = MONTHS[new Date(tx.rawDate).getMonth()];
    if (tx.amount > 0) monthly[m].income += tx.amount;
    else monthly[m].expenses += Math.abs(tx.amount);
  });
  return MONTHS.map((month) => ({ month, ...monthly[month] }));
}

function computeExpenseBreakdown(transactions: NormalizedTx[]): { name: string; value: number; color: string }[] {
  const groups: Record<string, number> = {};
  transactions.filter((tx) => tx.amount < 0).forEach((tx) => {
    groups[tx.category] = (groups[tx.category] || 0) + Math.abs(tx.amount);
  });
  const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  const others = sorted.slice(5);
  const top = sorted.slice(0, 5);
  const result = top.map(([name, value], i) => ({ name, value: Math.round(value), color: PIE_COLORS[i] }));
  const othersSum = others.reduce((s, [, v]) => s + v, 0);
  if (othersSum > 0) result.push({ name: "Others", value: Math.round(othersSum), color: PIE_COLORS[5] });
  return result;
}

function computeCategoryData(transactions: NormalizedTx[]): { name: string; amount: number; percentage: number; color: string }[] {
  const expenses = transactions.filter((tx) => tx.amount < 0);
  const total = expenses.reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const groups: Record<string, number> = {};
  expenses.forEach((tx) => {
    const cat = tx.category;
    groups[cat] = (groups[cat] || 0) + Math.abs(tx.amount);
  });
  const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  const colors = ["bg-accent-500", "bg-accent-400", "bg-accent-300", "bg-accent-600", "bg-accent-700", "bg-surface", "bg-accent-200", "bg-accent-800"];
  return sorted.slice(0, 6).map(([name, amount], i) => ({
    name,
    amount: Math.round(amount),
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    color: colors[i] || "bg-gray-400",
  }));
}

function computeUpcomingBills(transactions: NormalizedTx[]): { id: string; name: string; amount: number; date: string }[] {
  return transactions
    .filter((tx) => tx.status === "pending" && tx.amount < 0)
    .slice(0, 4)
    .map((tx) => ({
      id: tx.id,
      name: tx.name,
      amount: Math.abs(tx.amount),
      date: formatDate(new Date(tx.rawDate)),
    }));
}

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔",
  restaurant: "🍔",
  dining: "🍔",
  shopping: "🛒",
  entertainment: "🎬",
  transport: "🚗",
  utilities: "💡",
  rent: "🏠",
  salary: "💰",
  income: "💰",
  "health & fitness": "🏥",
  health: "🏥",
  education: "📚",
  transfer: "💸",
  "international transfer": "🌍",
  travel: "✈️",
  subscription: "📺",
  bills: "📄",
  other: "📌",
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category.toLowerCase()] || "📌";
}

function extractContacts(transactions: NormalizedTx[]): Contact[] {
  const seen = new Set<string>();
  const contacts: Contact[] = [];

  // Sort by date descending to get most recent contacts first
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );

  for (const tx of sorted) {
    if (!tx.merchant) continue;
    const key = tx.merchant.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const isInternational = tx.category?.toLowerCase().includes("international");
    contacts.push({
      initials: tx.merchant
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      name: tx.merchant,
      role: isInternational ? "International" : tx.amount < 0 ? "Payee" : "Payer",
      accountNumber: tx.reference || "N/A",
      bank: tx.account || "N/A",
      type: isInternational ? "international" : "local",
    });
  }

  // If no contacts derived from transactions, provide fallback
  if (contacts.length === 0) {
    contacts.push(
      { initials: "SA", name: "Savings Account", role: "Internal", accountNumber: "0123456789", bank: "GT Bank", type: "local" },
      { initials: "JK", name: "John Kim", role: "Vendor", accountNumber: "2098765432", bank: "First Bank", type: "local" },
      { initials: "JD", name: "James Dean (UK)", role: "International Client", accountNumber: "GB29NWBK60161331926819", bank: "Barclays (UK)", type: "international" },
      { initials: "LW", name: "Li Wei (China)", role: "Supplier", accountNumber: "ICBC889900112233", bank: "ICBC (China)", type: "international" },
    );
  }

  return contacts;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NormalizedTx {
  id: string;
  name: string;
  date: string;
  rawDate: string;
  amount: number;
  status: string;
  category: string;
  account: string;
  merchant?: string;
  reference?: string;
  notes?: string;
  receipt?: string;
  description?: string;
}

interface Contact {
  initials: string;
  name: string;
  role: string;
  accountNumber: string;
  bank: string;
  type: "local" | "international";
}



// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          {trend === "up" ? (
            <span className="flex items-center gap-0.5 text-xs font-medium text-success bg-surface-2 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> {change}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-xs font-medium text-danger bg-surface-2 px-2 py-0.5 rounded-full">
              <ArrowDownRight className="w-3 h-3" /> {change}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [timeRange, setTimeRange] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Transactions from API
  const [transactions, setTransactions] = useState<NormalizedTx[]>([]);

  // Quick Transfer
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<number>(-1);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferSent, setTransferSent] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [contactType, setContactType] = useState<"local" | "international">("local");

  // Other modals
  const [selectedTx, setSelectedTx] = useState<NormalizedTx | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [appliedFilterCategory, setAppliedFilterCategory] = useState("All");
  const [appliedFilterStatus, setAppliedFilterStatus] = useState("All");
  const [appliedFilterDateFrom, setAppliedFilterDateFrom] = useState("");
  const [appliedFilterDateTo, setAppliedFilterDateTo] = useState("");

  // ── Fetch data ──

  useEffect(() => {
    fetchTransactions({ limit: 200 })
      .then((data) => {
        const normalized: NormalizedTx[] = data.transactions.map((tx) => ({
          id: tx.id,
          name: tx.title,
          date: formatDate(new Date(tx.date)),
          rawDate: tx.date,
          amount: Number(tx.amount),
          status: tx.status.toLowerCase(),
          category: tx.category,
          account: tx.account || "Checking",
          merchant: tx.merchant || undefined,
          reference: tx.reference || undefined,
          notes: tx.notes || undefined,
          receipt: tx.receipt || undefined,
          description: tx.description || undefined,
        }));
        setTransactions(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Computed from transactions ──

  const fullIncomeData = useMemo(() => computeMonthlyIncome(transactions), [transactions]);
  const pieData = useMemo(() => computeExpenseBreakdown(transactions), [transactions]);
  const categories = useMemo(() => computeCategoryData(transactions), [transactions]);
  const upcomingBills = useMemo(() => computeUpcomingBills(transactions), [transactions]);
  const totalPie = useMemo(() => pieData.reduce((s, i) => s + i.value, 0), [pieData]);
  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentMonth = transactions.filter((t) => new Date(t.rawDate).getMonth() === now.getMonth() && new Date(t.rawDate).getFullYear() === now.getFullYear());
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = transactions.filter((t) => new Date(t.rawDate).getMonth() === prevDate.getMonth() && new Date(t.rawDate).getFullYear() === prevDate.getFullYear());
    const income = currentMonth.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = currentMonth.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const prevIncome = prevMonth.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const prevExpenses = prevMonth.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const spentPct = income > 0 ? +((expenses / income) * 100).toFixed(1) : 0;
    const savingsRate = income > 0 ? +(((income - expenses) / income) * 100).toFixed(1) : 0;
    return { income, expenses, prevIncome, prevExpenses, spentPct, savingsRate };
  }, [transactions]);
  const budgetData = useMemo(() => {
    const map: Record<string, { spent: number; color: string }> = {
      Housing: { spent: 0, color: "bg-accent-500" },
      Food: { spent: 0, color: "bg-accent-500" },
      Transport: { spent: 0, color: "bg-accent-500" },
      Utilities: { spent: 0, color: "bg-accent-500" },
      Entertainment: { spent: 0, color: "bg-accent-500" },
    };
    const now = new Date();
    transactions
      .filter((t) => t.amount < 0 && new Date(t.rawDate).getMonth() === now.getMonth() && new Date(t.rawDate).getFullYear() === now.getFullYear())
      .forEach((t) => {
        const cat = t.category.charAt(0).toUpperCase() + t.category.slice(1);
        if (map[cat]) map[cat].spent += Math.abs(t.amount);
      });
    return Object.entries(map)
      .filter(([, v]) => v.spent > 0)
      .map(([label, v]) => ({
        label,
        spent: Math.round(v.spent),
        budget: Math.round(Math.max(v.spent * 1.3, v.spent + 500)),
        color: v.color,
      }))
      .slice(0, 3);
  }, [transactions]);

  // ── Derived from transactions ──

  const billingStats = useMemo(() => {
    const now = new Date();
    const paid = transactions
      .filter((tx) => {
        const d = new Date(tx.rawDate);
        return tx.amount < 0 && tx.status === "completed" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const remaining = transactions
      .filter((tx) => {
        const d = new Date(tx.rawDate);
        return tx.amount < 0 && tx.status === "pending" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    return { paid, remaining };
  }, [transactions]);

  const recentActivities = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
      .slice(0, 5)
      .map((tx) => ({
        id: tx.id,
        icon: getCategoryIcon(tx.category),
        title: tx.name,
        date: tx.date,
        amount: `${tx.amount > 0 ? "+" : ""}$${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      }));
  }, [transactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      setContactsList(extractContacts(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    setSelectedContact((prev) => {
      if (contactsList.length === 0) return -1;
      if (prev < 0) return 0;
      if (prev >= contactsList.length) return contactsList.length - 1;
      return prev;
    });
  }, [contactsList.length]);

  const filteredTransactions = useMemo(() => {
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
    if (appliedFilterCategory !== "All") {
      result = result.filter((tx) => tx.category === appliedFilterCategory);
    }
    if (appliedFilterStatus !== "All") {
      result = result.filter((tx) => tx.status === appliedFilterStatus.toLowerCase());
    }
    if (appliedFilterDateFrom) {
      result = result.filter((tx) => new Date(tx.rawDate) >= new Date(appliedFilterDateFrom));
    }
    if (appliedFilterDateTo) {
      result = result.filter((tx) => new Date(tx.rawDate) <= new Date(appliedFilterDateTo));
    }
    return result;
  }, [searchQuery, transactions, appliedFilterCategory, appliedFilterStatus, appliedFilterDateFrom, appliedFilterDateTo]);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {
      daily: 3,
      weekly: 6,
      monthly: 12,
      yearly: 12,
    };
    const count = map[timeRange] || 12;
    return fullIncomeData.slice(-count);
  }, [timeRange, fullIncomeData]);

  // Live stat values derived from transactions
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.amount < 0)
      .reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome + totalExpenses;
    const pendingBills = transactions
      .filter((t) => t.status === "pending")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const sorted = [...transactions].sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
    const mid = Math.floor(sorted.length / 2);
    const recent = sorted.slice(0, mid);
    const previous = sorted.slice(mid);
    const recentIncome = recent.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const recentExpenses = recent.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const prevIncome = previous.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const prevExpenses = previous.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const incomeChange = prevIncome > 0 ? +((recentIncome / prevIncome - 1) * 100).toFixed(1) : 0;
    const expenseChange = prevExpenses > 0 ? +((recentExpenses / prevExpenses - 1) * 100).toFixed(1) : 0;
    const netChange = totalIncome > 0 ? +((balance / totalIncome) * 100).toFixed(1) : 0;
    const now = new Date();
    const currentMonthPending = transactions.filter((t) => t.status === "pending" && t.amount < 0 && new Date(t.rawDate).getMonth() === now.getMonth()).reduce((s, t) => s + Math.abs(t.amount), 0);
    const prevMonthPending = transactions.filter((t) => t.status === "pending" && t.amount < 0 && new Date(t.rawDate).getMonth() === (now.getMonth() - 1 + 12) % 12).reduce((s, t) => s + Math.abs(t.amount), 0);
    const pendingChange = prevMonthPending > 0 ? +((currentMonthPending / prevMonthPending - 1) * 100).toFixed(1) : 0;
    return {
      totalIncome,
      totalExpenses: Math.abs(totalExpenses),
      balance,
      pendingBills,
      incomeChange,
      expenseChange,
      netChange,
      pendingChange,
    };
  }, [transactions]);

  // ── Handlers ──

  const handleDownloadCSV = () => {
    const header = "Name,Date,Amount,Status,Category,Account\n";
    const rows = transactions
      .map(
        (tx) =>
          `${tx.name},${tx.date},${tx.amount},${tx.status},${tx.category},${tx.account}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendTransfer = useCallback(() => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || selectedContact < 0) return;
    const contact = contactsList[selectedContact];

    const prefix =
      contact.type === "international"
        ? "International Transfer to"
        : "Local Transfer to";
    const title = `${prefix} ${contact.name}`;

    createTransaction({
      title,
      amount: -amount,
      type: contact.type === "international" ? "INTERNATIONAL_TRANSFER" : "TRANSFER",
      category: contact.type === "international" ? "International Transfer" : "Transfer",
      account: contact.bank || "Checking",
      merchant: contact.name,
      status: "COMPLETED",
      date: new Date().toISOString(),
    }).then((newTx) => {
      const normalized: NormalizedTx = {
        id: newTx.id,
        name: newTx.title,
        date: "Just now",
        rawDate: newTx.date,
        amount: Number(newTx.amount),
        status: newTx.status.toLowerCase(),
        category: newTx.category,
        account: newTx.account || "Checking",
      };
      setTransactions((prev) => [normalized, ...prev]);
    });

    setTransferSent(true);
    setTimeout(() => {
      setTransferModalOpen(false);
      setTransferSent(false);
      setTransferAmount("");
    }, 2000);
  }, [transferAmount, selectedContact, contactsList]);

  const displayedTxs = filteredTransactions.slice(0, 5);

  const currentContact = (
    selectedContact >= 0 && selectedContact < contactsList.length
      ? contactsList[selectedContact]
      : null
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name || "User"}! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-[260px] pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-[130px]"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Filter"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownloadCSV}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={`$${stats.totalIncome.toLocaleString()}`}
          change={`+${stats.incomeChange}%`}
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          change={`+${stats.expenseChange}%`}
          trend="down"
          icon={ShoppingCart}
        />
        <StatCard
          title="Net Balance"
          value={`$${stats.balance.toLocaleString()}`}
          change={`+${stats.netChange}%`}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Bills"
          value={`$${stats.pendingBills.toLocaleString()}`}
          change={`${stats.pendingChange}%`}
          trend={stats.pendingChange >= 0 ? "up" : "down"}
          icon={CreditCard}
        />
      </div>

      {/* ── Main Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Monthly income vs expenses</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/transactions")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {displayedTxs.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() =>
                      router.push(`/dashboard/transactions/${tx.id}`)
                    }
                    className="w-full flex items-center justify-between py-2.5 border-b border-border last:border-0 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          tx.amount > 0
                            ? "bg-accent-50 text-success"
                            : "bg-accent-50 text-danger"
                        }`}
                      >
                        {tx.amount > 0 ? "↑" : "↓"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-sm font-semibold ${tx.amount > 0 ? "text-success" : ""}`}
                      >
                        {tx.amount > 0 ? "+" : ""}$
                        {Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <Badge
                        variant={
                          tx.status === "completed" ? "success" : "warning"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </button>
                ))}
                {filteredTransactions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No transactions match your search.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {upcomingBills.map((bill, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      router.push(`/dashboard/transactions/${bill.id}`)
                    }
                    className="w-full flex items-center justify-between py-1.5 text-left hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {bill.date}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      ${bill.amount.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Due</span>
                  <span className="font-bold">
                    $
                    {upcomingBills.reduce((s, b) => s + b.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    Paid this month
                  </p>
                  <p className="text-lg font-bold">
                    ${billingStats.paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-lg font-bold">
                    ${billingStats.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-6">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-bold">
                      ${(totalPie / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="w-full space-y-2.5">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetData.length > 0 ? budgetData.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">
                      ${item.spent.toLocaleString()} / $
                      {item.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${(item.spent / item.budget) * 100}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No expense data this month</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Transfer */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                {contactsList.map((contact, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedContact(i)}
                    className={`relative group w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      selectedContact === i
                        ? "bg-accent-600 text-white ring-2 ring-accent-200 ring-offset-2"
                        : "bg-surface text-primary hover:bg-surface-2"
                    }`}
                    title={contact.name}
                  >
                    {contact.initials}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-popover border border-border text-xs text-popover-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                      {contact.name} — {contact.bank} ({contact.accountNumber}){" "}
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${contact.type === "international" ? "bg-accent-50 text-accent-700" : "bg-accent-50 text-accent-700"}`}
                      >
                        {contact.type === "international"
                          ? "International"
                          : "Local"}
                      </span>
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setAddContactOpen(true)}
                  disabled={contactsList.length >= 6}
                  className="w-10 h-10 rounded-full border border-dashed border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={
                    contactsList.length >= 6 ? "Max 6 contacts" : "Add contact"
                  }
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Amount"
                  type="number"
                  className="flex-1"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
                <Button
                  disabled={
                    !transferAmount ||
                    parseFloat(transferAmount) <= 0 ||
                    selectedContact < 0
                  }
                  onClick={() => {
                    if (
                      transferAmount &&
                      parseFloat(transferAmount) > 0 &&
                      selectedContact >= 0
                    )
                      setTransferModalOpen(true);
                  }}
                >
                  <Send className="w-4 h-4 mr-1" /> Send
                </Button>
              </div>
              {currentContact && (
                <div className="text-xs text-muted-foreground text-center leading-relaxed">
                  To:{" "}
                  <span className="font-medium text-foreground">
                    {currentContact.name}
                  </span>
                  <br />
                  {currentContact.bank} ·{" "}
                  {currentContact.accountNumber}
                  <span
                    className={`ml-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${currentContact.type === "international" ? "bg-accent-50 text-accent-700" : "bg-accent-50 text-accent-700"}`}
                  >
                    {currentContact.type === "international"
                      ? "International"
                      : "Local"}
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    {currentContact.role}
                  </span>
                </div>
              )}
              {!currentContact && (
                <p className="text-xs text-muted-foreground text-center">
                  Select a contact above to send money
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBills.map((bill, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {bill.date}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    ${bill.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Bottom Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.name}</span>
                  <span className="text-muted-foreground">
                    ${cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Income</span>
                <span className="font-medium">${monthlyComparison.income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium">${monthlyComparison.expenses.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-accent-500 h-2.5 rounded-full"
                  style={{ width: `${Math.min(monthlyComparison.spentPct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyComparison.spentPct}% of income spent this month
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-medium text-success">{monthlyComparison.savingsRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-success h-2.5 rounded-full"
                  style={{ width: `${Math.min(monthlyComparison.savingsRate, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyComparison.savingsRate >= 0 ? "Positive savings this month" : "Exceeding income this month"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((a, i) => (
              <button
                key={i}
                onClick={() =>
                  router.push(
                    a.id
                      ? `/dashboard/transactions/${a.id}`
                      : "/dashboard/transactions",
                  )
                }
                className="w-full flex items-start gap-3 text-left hover:bg-muted/50 rounded-lg px-2 -mx-2 py-1.5 transition-colors"
              >
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center text-lg shrink-0">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <p className="text-sm font-semibold whitespace-nowrap">
                  {a.amount}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ════════════════ MODALS ════════════════ */}

      {/* ── Transaction Detail Modal ── */}
      <Dialog
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Details"
      >
        {selectedTx && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{selectedTx.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedTx.date}
                </p>
              </div>
              <span
                className={`text-xl font-bold ${selectedTx.amount > 0 ? "text-success" : ""}`}
              >
                {selectedTx.amount > 0 ? "+" : ""}$
                {Math.abs(selectedTx.amount).toFixed(2)}
              </span>
            </div>
            <hr className="border-border" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="font-medium mt-0.5 capitalize">
                  {selectedTx.status}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Category</span>
                <p className="font-medium mt-0.5">{selectedTx.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Account</span>
                <p className="font-medium mt-0.5">{selectedTx.account}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type</span>
                <p className="font-medium mt-0.5">
                  {selectedTx.amount > 0 ? "Income" : "Expense"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedTx(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ── Filter Modal ── */}
      <Dialog
        open={filterModalOpen}
        onClose={() => {
          setFilterModalOpen(false);
          setFilterCategory(appliedFilterCategory);
          setFilterStatus(appliedFilterStatus);
          setFilterDateFrom(appliedFilterDateFrom);
          setFilterDateTo(appliedFilterDateTo);
        }}
        title="Filter Transactions"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Food",
                "Income",
                "Utilities",
                "Transport",
                "Entertainment",
                "Transfer",
                "International Transfer",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filterCategory === cat
                      ? "bg-accent-600 text-white border-accent-600"
                      : "border-border bg-background hover:bg-muted text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {["All", "Completed", "Pending"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filterStatus === s
                      ? "bg-accent-600 text-white border-accent-600"
                      : "border-border bg-background hover:bg-muted text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Date Range</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="self-center text-muted-foreground">to</span>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => {
                setAppliedFilterCategory(filterCategory);
                setAppliedFilterStatus(filterStatus);
                setAppliedFilterDateFrom(filterDateFrom);
                setAppliedFilterDateTo(filterDateTo);
                setFilterModalOpen(false);
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFilterCategory("All");
                setFilterStatus("All");
                setFilterDateFrom("");
                setFilterDateTo("");
                setAppliedFilterCategory("All");
                setAppliedFilterStatus("All");
                setAppliedFilterDateFrom("");
                setAppliedFilterDateTo("");
                setFilterModalOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ── Transfer Confirmation Modal ── */}
      <Dialog
        open={transferModalOpen}
        onClose={() => {
          if (!transferSent) setTransferModalOpen(false);
        }}
        title="Confirm Transfer"
      >
        {currentContact ? (
          <div className="space-y-4">
            {transferSent ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <p className="text-lg font-semibold">Transfer Successful!</p>
                <p className="text-sm text-muted-foreground text-center">
                  ${parseFloat(transferAmount).toFixed(2)} sent to{" "}
                  {currentContact.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentContact.bank} ·{" "}
                  {currentContact.accountNumber}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${currentContact.type === "international" ? "bg-accent-50 text-accent-700" : "bg-accent-50 text-accent-700"}`}
                >
                  {currentContact.type === "international"
                    ? "🌍 International Transfer"
                    : "🏦 Local Transfer"}
                </span>
              </div>
            ) : (
              <>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">
                      ${parseFloat(transferAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">From</span>
                    <span>Checking Account</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To</span>
                    <span className="text-right">
                      {currentContact.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${currentContact.type === "international" ? "bg-accent-50 text-accent-700" : "bg-accent-50 text-accent-700"}`}
                    >
                      {currentContact.type === "international"
                        ? "🌍 International"
                        : "🏦 Local"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bank</span>
                    <span>{currentContact.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-muted-foreground">Account</span>
                    <span>{currentContact.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span>{currentContact.role}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={handleSendTransfer}>
                    <Send className="w-4 h-4 mr-1" /> Confirm Transfer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setTransferModalOpen(false)}
                >
                  Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 text-sm text-muted-foreground text-center">
            Contact information not available
          </div>
        )}
      </Dialog>

      {/* ── Add Contact Modal ── */}
      <Dialog
        open={addContactOpen}
        onClose={() => {
          setAddContactOpen(false);
          setContactType("local");
        }}
        title="Add Contact"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const name = form.get("name") as string;
            const role = form.get("role") as string;
            const accountNumber = form.get("accountNumber") as string;
            const bank = form.get("bank") as string;
            const type = form.get("type") as string;
            if (!name || !role || !type) return;
            const initials = name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            setContactsList((prev) => [
              ...prev,
              {
                initials,
                name,
                role,
                accountNumber,
                bank,
                type: type as "local" | "international",
              },
            ]);
            setAddContactOpen(false);
            setContactType("local");
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <Input
              name="name"
              placeholder="e.g. Jane Doe"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Contact Type
            </label>

            <div className="relative grid grid-cols-2 rounded-xl bg-muted p-1">
              {/* Local */}
              <label
                className={`
                  flex items-center justify-center gap-2 rounded-lg px-4 py-3
                  text-sm font-medium cursor-pointer transition-all duration-200
                  ${
                    contactType === "local"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <input
                  type="radio"
                  name="type"
                  value="local"
                  checked={contactType === "local"}
                  onChange={() => setContactType("local")}
                  className="sr-only"
                />

                <span className="text-lg">🏦</span>
                <div className="flex flex-col leading-none">
                  <span>Local</span>
                  <span className="text-[11px] opacity-70 font-normal">
                    Domestic transfer
                  </span>
                </div>
              </label>

              {/* International */}
              <label
                className={`
                  flex items-center justify-center gap-2 rounded-lg px-4 py-3
                  text-sm font-medium cursor-pointer transition-all duration-200
                  ${
                    contactType === "international"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <input
                  type="radio"
                  name="type"
                  value="international"
                  checked={contactType === "international"}
                  onChange={() => setContactType("international")}
                  className="sr-only"
                />

                <span className="text-lg">🌍</span>
                <div className="flex flex-col leading-none">
                  <span>International</span>
                  <span className="text-[11px] opacity-70 font-normal">
                    SWIFT / Global
                  </span>
                </div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {contactType === "international"
                  ? "IBAN / SWIFT"
                  : "Account Number"}
              </label>
              <Input
                name="accountNumber"
                placeholder={
                  contactType === "international"
                    ? "e.g. GB29NWBK60161331926819"
                    : "e.g. 0123456789"
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Bank
              </label>
              <select
                name="bank"
                required
                defaultValue=""
                key={contactType}
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  {contactType === "international"
                    ? "Select international bank..."
                    : "Select local bank..."}
                </option>
                {contactType === "local" ? (
                  <>
                    <option>GT Bank</option>
                    <option>First Bank</option>
                    <option>Access Bank</option>
                    <option>Zenith Bank</option>
                    <option>UBA</option>
                    <option>Opay</option>
                    <option>Palm Pay</option>
                    <option>Moniepoint</option>
                    <option>Kuda Bank</option>
                    <option>Other</option>
                  </>
                ) : (
                  <>
                    <option>Barclays (UK)</option>
                    <option>HSBC (UK)</option>
                    <option>Lloyds Bank (UK)</option>
                    <option>Deutsche Bank (Germany)</option>
                    <option>BNP Paribas (France)</option>
                    <option>ICBC (China)</option>
                    <option>Bank of China</option>
                    <option>JPMorgan Chase (US)</option>
                    <option>Bank of America (US)</option>
                    <option>Standard Chartered (Singapore)</option>
                    <option>Other</option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Role
            </label>
            <select
              name="role"
              required
              defaultValue=""
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>
                Select role...
              </option>
              {contactType === "international" ? (
                <>
                  <option>International Client</option>
                  <option>Supplier</option>
                  <option>Freelancer</option>
                  <option>Partner</option>
                  <option>External</option>
                </>
              ) : (
                <>
                  <option>Internal</option>
                  <option>Vendor</option>
                  <option>Employee</option>
                  <option>Freelancer</option>
                  <option>External</option>
                </>
              )}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 rounded-full">
              Add Contact
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => {
                setAddContactOpen(false);
                setContactType("local");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
