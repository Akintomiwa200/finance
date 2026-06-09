"use client";

import { useState, useMemo, useCallback } from "react";
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

// ─── Data ────────────────────────────────────────────────────────────────────

const fullIncomeData = [
  { month: "Jan", income: 18500, expenses: 14200 },
  { month: "Feb", income: 20200, expenses: 16500 },
  { month: "Mar", income: 19500, expenses: 15800 },
  { month: "Apr", income: 22800, expenses: 17200 },
  { month: "May", income: 25200, expenses: 18900 },
  { month: "Jun", income: 24000, expenses: 18320 },
  { month: "Jul", income: 23100, expenses: 17700 },
  { month: "Aug", income: 21900, expenses: 16400 },
  { month: "Sep", income: 26300, expenses: 19500 },
  { month: "Oct", income: 24700, expenses: 18100 },
  { month: "Nov", income: 28100, expenses: 20300 },
  { month: "Dec", income: 26500, expenses: 19200 },
];

const pieData = [
  { name: "Housing", value: 4800, color: "#8B5CF6" },
  { name: "Food", value: 3200, color: "#60A5FA" },
  { name: "Transport", value: 2100, color: "#F59E0B" },
  { name: "Entertainment", value: 1800, color: "#10B981" },
  { name: "Shopping", value: 2900, color: "#EC4899" },
  { name: "Others", value: 3520, color: "#6B7280" },
];

const allTransactions = [
  {
    id: 1,
    name: "Grocery Store",
    date: "Today, 2:30 PM",
    amount: -86.5,
    status: "completed" as const,
    category: "Food",
    account: "Checking",
  },
  {
    id: 2,
    name: "Freelance Payment",
    date: "Today, 11:00 AM",
    amount: 1200.0,
    status: "completed" as const,
    category: "Income",
    account: "Checking",
  },
  {
    id: 3,
    name: "Electric Bill",
    date: "Yesterday",
    amount: -145.0,
    status: "pending" as const,
    category: "Utilities",
    account: "Checking",
  },
  {
    id: 4,
    name: "Transfer to Savings",
    date: "Yesterday",
    amount: -500.0,
    status: "completed" as const,
    category: "Transfer",
    account: "Savings",
  },
  {
    id: 5,
    name: "Coffee Shop",
    date: "2 days ago",
    amount: -5.75,
    status: "completed" as const,
    category: "Food",
    account: "Checking",
  },
  {
    id: 6,
    name: "Subscription - Netflix",
    date: "3 days ago",
    amount: -15.99,
    status: "completed" as const,
    category: "Entertainment",
    account: "Checking",
  },
  {
    id: 7,
    name: "Client Invoice #1042",
    date: "3 days ago",
    amount: 3400.0,
    status: "completed" as const,
    category: "Income",
    account: "Checking",
  },
  {
    id: 8,
    name: "Gas Station",
    date: "4 days ago",
    amount: -48.2,
    status: "completed" as const,
    category: "Transport",
    account: "Checking",
  },
  {
    id: 9,
    name: "Restaurant",
    date: "5 days ago",
    amount: -62.3,
    status: "completed" as const,
    category: "Food",
    account: "Checking",
  },
  {
    id: 10,
    name: "Phone Bill",
    date: "6 days ago",
    amount: -85.0,
    status: "completed" as const,
    category: "Utilities",
    account: "Checking",
  },
  {
    id: 21,
    name: "SWIFT Transfer — Client Ltd (UK)",
    date: "Today, 9:15 AM",
    amount: 4500.0,
    status: "completed" as const,
    category: "Income",
    account: "USD Account",
  },
  {
    id: 22,
    name: "Alibaba Order",
    date: "Yesterday",
    amount: -2340.0,
    status: "completed" as const,
    category: "Shopping",
    account: "USD Account",
  },
  {
    id: 23,
    name: "TransferWise Fee",
    date: "2 days ago",
    amount: -35.0,
    status: "completed" as const,
    category: "Transfer",
    account: "GBP Account",
  },
  {
    id: 24,
    name: "AWS Cloud Services",
    date: "3 days ago",
    amount: -1247.3,
    status: "pending" as const,
    category: "Technology",
    account: "USD Account",
  },
  {
    id: 25,
    name: "Freelancer.com Payment",
    date: "4 days ago",
    amount: 2800.0,
    status: "completed" as const,
    category: "Income",
    account: "EUR Account",
  },
  {
    id: 26,
    name: "Shopify Payout",
    date: "5 days ago",
    amount: 1890.0,
    status: "completed" as const,
    category: "Income",
    account: "CAD Account",
  },
  {
    id: 27,
    name: "AliExpress Purchase",
    date: "6 days ago",
    amount: -156.5,
    status: "completed" as const,
    category: "Shopping",
    account: "USD Account",
  },
  {
    id: 28,
    name: "Remittance (Western Union)",
    date: "1 week ago",
    amount: -500.0,
    status: "pending" as const,
    category: "Transfer",
    account: "Checking",
  },
  {
    id: 29,
    name: "Google Ads Charge",
    date: "1 week ago",
    amount: -890.0,
    status: "completed" as const,
    category: "Advertising",
    account: "USD Account",
  },
  {
    id: 30,
    name: "International Invoice — TechCorp",
    date: "1 week ago",
    amount: 6200.0,
    status: "completed" as const,
    category: "Income",
    account: "GBP Account",
  },
];

const contacts = [
  {
    initials: "SA",
    name: "Savings Account",
    role: "Internal",
    accountNumber: "0123456789",
    bank: "GT Bank",
    type: "local",
  },
  {
    initials: "JK",
    name: "John Kim",
    role: "Vendor",
    accountNumber: "2098765432",
    bank: "First Bank",
    type: "local",
  },
  {
    initials: "JD",
    name: "James Dean (UK)",
    role: "International Client",
    accountNumber: "GB29NWBK60161331926819",
    bank: "Barclays (UK)",
    type: "international",
  },
  {
    initials: "LW",
    name: "Li Wei (China)",
    role: "Supplier",
    accountNumber: "ICBC889900112233",
    bank: "ICBC (China)",
    type: "international",
  },
];

const categories = [
  { name: "Housing", amount: 4800, percentage: 28, color: "bg-purple-500" },
  { name: "Food & Dining", amount: 3200, percentage: 19, color: "bg-blue-400" },
  {
    name: "Transportation",
    amount: 2100,
    percentage: 12,
    color: "bg-amber-400",
  },
  {
    name: "Entertainment",
    amount: 1800,
    percentage: 10,
    color: "bg-emerald-400",
  },
  { name: "Shopping", amount: 2900, percentage: 17, color: "bg-pink-400" },
  { name: "Others", amount: 3520, percentage: 14, color: "bg-gray-400" },
];

const upcomingBills = [
  { id: 11, name: "Internet & TV", amount: 89.99, date: "Mar 25" },
  { id: 10, name: "Phone Bill", amount: 45.0, date: "Mar 28" },
  { id: 13, name: "Credit Card", amount: 320.0, date: "Apr 5" },
  { id: 12, name: "Insurance", amount: 210.0, date: "Apr 10" },
];

const totalPie = pieData.reduce((s, i) => s + i.value, 0);

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: "blue" | "orange" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {trend === "up" ? (
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> {change}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
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
  const [timeRange, setTimeRange] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");

  // Transactions & activities (mutable)
  const [transactions, setTransactions] = useState(allTransactions);
  const [activities, setActivities] = useState([
    {
      id: 6,
      icon: "📺",
      title: "Netflix Standard Plan",
      date: "15 Sep 22 at 2:12 pm",
      amount: "$15.99",
    },
    {
      id: 15,
      icon: "🛒",
      title: "Online Shopping",
      date: "15 Sep 22 at 12:12 pm",
      amount: "$67.20",
    },
    {
      icon: "📸",
      title: "Wedding Photography",
      date: "13 Sep 22 at 1:12 am",
      amount: "$45,200",
    },
    {
      icon: "👔",
      title: "Helster Premium Plan",
      date: "11 Sep 22 at 12:12 pm",
      amount: "$718",
    },
  ]);

  // Quick Transfer
  const [contactsList, setContactsList] = useState(contacts);
  const [selectedContact, setSelectedContact] = useState<number>(0);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferSent, setTransferSent] = useState(false);
  const [nextTxId, setNextTxId] = useState(31);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [contactType, setContactType] = useState<"local" | "international">(
    "local",
  );

  // Other modals
  const [selectedTx, setSelectedTx] = useState<
    (typeof allTransactions)[number] | null
  >(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // ── Derived ──

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.name.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q),
    );
  }, [searchQuery, transactions]);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {
      daily: 3,
      weekly: 6,
      monthly: 12,
      yearly: 12,
    };
    const count = map[timeRange] || 12;
    return fullIncomeData.slice(-count);
  }, [timeRange]);

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
    const incomeChange = +((totalIncome / 18500 - 1) * 100).toFixed(1);
    const expenseChange = +(
      (Math.abs(totalExpenses) / 14200 - 1) *
      100
    ).toFixed(1);
    return {
      totalIncome,
      totalExpenses: Math.abs(totalExpenses),
      balance,
      pendingBills,
      incomeChange,
      expenseChange,
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

    // Add transaction
    const prefix =
      contact.type === "international"
        ? "International Transfer to"
        : "Local Transfer to";
    const newTx = {
      id: nextTxId,
      name: `${prefix} ${contact.name}`,
      date: "Just now",
      amount: -amount,
      status: "completed" as const,
      category:
        contact.type === "international"
          ? "International Transfer"
          : "Transfer",
      account: contact.bank || "Checking",
    };

    // Add activity
    const newActivity = {
      icon: contact.type === "international" ? "🌍" : "💸",
      title: `${contact.type === "international" ? "International" : "Local"} Transfer to ${contact.name} (${contact.bank})`,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      amount: `$${amount.toFixed(2)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setActivities((prev) => [newActivity, ...prev]);
    setNextTxId((prev) => prev + 1);

    setTransferSent(true);
    setTimeout(() => {
      setTransferModalOpen(false);
      setTransferSent(false);
      setTransferAmount("");
    }, 2000);
  }, [transferAmount, selectedContact, nextTxId]);

  const displayedTxs = filteredTransactions.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Alex! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Input
              placeholder="Search transactions..."
              className="pl-9 w-full sm:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          color="blue"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          change={`+${stats.expenseChange}%`}
          trend="down"
          icon={ShoppingCart}
          color="orange"
        />
        <StatCard
          title="Net Balance"
          value={`$${stats.balance.toLocaleString()}`}
          change="+15.3%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Pending Bills"
          value={`$${stats.pendingBills.toLocaleString()}`}
          change="-3.1%"
          trend="up"
          icon={CreditCard}
          color="purple"
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
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
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
                        className={`text-sm font-semibold ${tx.amount > 0 ? "text-green-600" : ""}`}
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
                  <p className="text-lg font-bold">$1,240</p>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-lg font-bold">$664.99</p>
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
              {[
                {
                  label: "Housing",
                  spent: 4200,
                  budget: 5000,
                  color: "bg-purple-500",
                },
                {
                  label: "Food",
                  spent: 2800,
                  budget: 3500,
                  color: "bg-blue-400",
                },
                {
                  label: "Transport",
                  spent: 1900,
                  budget: 2500,
                  color: "bg-amber-400",
                },
              ].map((item, i) => (
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
              ))}
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
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${contact.type === "international" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
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
              {selectedContact >= 0 && (
                <div className="text-xs text-muted-foreground text-center leading-relaxed">
                  To:{" "}
                  <span className="font-medium text-foreground">
                    {contactsList[selectedContact].name}
                  </span>
                  <br />
                  {contactsList[selectedContact].bank} ·{" "}
                  {contactsList[selectedContact].accountNumber}
                  <span
                    className={`ml-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${contactsList[selectedContact].type === "international" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                  >
                    {contactsList[selectedContact].type === "international"
                      ? "International"
                      : "Local"}
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    {contactsList[selectedContact].role}
                  </span>
                </div>
              )}
              {selectedContact < 0 && (
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
                <span className="font-medium">$24,580</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium">$18,320</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full"
                  style={{ width: "74.5%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                74.5% of income spent this month
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-medium text-green-600">25.5%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "25.5%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: 30% monthly savings
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
            {activities.map((a, i) => (
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
                className={`text-xl font-bold ${selectedTx.amount > 0 ? "text-green-600" : ""}`}
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
        onClose={() => setFilterModalOpen(false)}
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
                  className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:bg-muted transition-colors"
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
                  className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Date Range</p>
            <div className="flex gap-2">
              <Input type="date" className="flex-1" />
              <span className="self-center text-muted-foreground">to</span>
              <Input type="date" className="flex-1" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => setFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setFilterModalOpen(false)}
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
        <div className="space-y-4">
          {transferSent ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold">Transfer Successful!</p>
              <p className="text-sm text-muted-foreground text-center">
                ${parseFloat(transferAmount).toFixed(2)} sent to{" "}
                {contactsList[selectedContact].name}
              </p>
              <p className="text-xs text-muted-foreground">
                {contactsList[selectedContact].bank} ·{" "}
                {contactsList[selectedContact].accountNumber}
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${contactsList[selectedContact].type === "international" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
              >
                {contactsList[selectedContact].type === "international"
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
                    {contactsList[selectedContact].name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${contactsList[selectedContact].type === "international" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                  >
                    {contactsList[selectedContact].type === "international"
                      ? "🌍 International"
                      : "🏦 Local"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bank</span>
                  <span>{contactsList[selectedContact].bank}</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground">Account</span>
                  <span>{contactsList[selectedContact].accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span>{contactsList[selectedContact].role}</span>
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
