"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Tag,
  Building2,
  DollarSign,
  Clock,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Dialog } from "@/src/components/ui/dialog";

const initialTransactions = [
  {
    id: 1,
    name: "Grocery Store",
    date: "Today, 2:30 PM",
    amount: -86.5,
    status: "completed" as const,
    category: "Food",
    account: "Checking",
    merchant: "Whole Foods",
    reference: "TRX-2024-001",
    notes: "Weekly grocery shopping",
  },
  {
    id: 2,
    name: "Freelance Payment",
    date: "Today, 11:00 AM",
    amount: 1200.0,
    status: "completed" as const,
    category: "Income",
    account: "Checking",
    merchant: "Client XYZ",
    reference: "INV-2024-042",
    notes: "Web development project",
  },
  {
    id: 3,
    name: "Electric Bill",
    date: "Yesterday",
    amount: -145.0,
    status: "pending" as const,
    category: "Utilities",
    account: "Checking",
    merchant: "Power Company",
    reference: "UTIL-0324",
    notes: "Monthly electricity bill",
  },
  {
    id: 4,
    name: "Transfer to Savings",
    date: "Yesterday",
    amount: -500.0,
    status: "completed" as const,
    category: "Transfer",
    account: "Savings",
    merchant: "Bank Transfer",
    reference: "TRF-042",
    notes: "Monthly savings transfer",
  },
  {
    id: 5,
    name: "Coffee Shop",
    date: "2 days ago",
    amount: -5.75,
    status: "completed" as const,
    category: "Food",
    account: "Checking",
    merchant: "Starbucks",
    reference: "POS-2356",
    notes: "Morning coffee",
  },
  {
    id: 6,
    name: "Subscription - Netflix",
    date: "3 days ago",
    amount: -15.99,
    status: "completed" as const,
    category: "Entertainment",
    account: "Checking",
    merchant: "Netflix",
    reference: "SUB-0424",
    notes: "Monthly subscription",
  },
  {
    id: 7,
    name: "Client Invoice #1042",
    date: "3 days ago",
    amount: 3400.0,
    status: "completed" as const,
    category: "Income",
    account: "Checking",
    merchant: "ABC Corp",
    reference: "INV-1042",
    notes: "Consulting services",
  },
  {
    id: 8,
    name: "Gas Station",
    date: "4 days ago",
    amount: -48.2,
    status: "completed" as const,
    category: "Transport",
    account: "Checking",
    merchant: "Shell",
    reference: "POS-7891",
    notes: "Fuel purchase",
  },
  {
    id: 9,
    name: "Restaurant",
    date: "5 days ago",
    amount: -62.3,
    status: "completed" as const,
    category: "Food",
    account: "Checking",
    merchant: "Olive Garden",
    reference: "POS-4562",
    notes: "Dinner with friends",
  },
  {
    id: 10,
    name: "Phone Bill",
    date: "6 days ago",
    amount: -85.0,
    status: "completed" as const,
    category: "Utilities",
    account: "Checking",
    merchant: "AT&T",
    reference: "BILL-0324",
    notes: "Monthly phone bill",
  },
  {
    id: 11,
    name: "Internet & TV",
    date: "Mar 22",
    amount: -89.99,
    status: "completed" as const,
    category: "Utilities",
    account: "Checking",
    merchant: "Comcast",
    reference: "BILL-0322",
    notes: "Internet and cable",
  },
  {
    id: 12,
    name: "Insurance Premium",
    date: "Mar 20",
    amount: -210.0,
    status: "completed" as const,
    category: "Insurance",
    account: "Checking",
    merchant: "State Farm",
    reference: "INS-0320",
    notes: "Auto insurance",
  },
  {
    id: 13,
    name: "Credit Card Payment",
    date: "Mar 18",
    amount: -320.0,
    status: "completed" as const,
    category: "Bills",
    account: "Credit Card",
    merchant: "Chase",
    reference: "PMT-0318",
    notes: "Credit card payment",
  },
  {
    id: 14,
    name: "Consulting Fee",
    date: "Mar 15",
    amount: 2500.0,
    status: "completed" as const,
    category: "Income",
    account: "Checking",
    merchant: "Tech Solutions",
    reference: "INV-0315",
    notes: "Consulting project",
  },
  {
    id: 15,
    name: "Amazon Order",
    date: "Mar 14",
    amount: -67.2,
    status: "completed" as const,
    category: "Shopping",
    account: "Checking",
    merchant: "Amazon",
    reference: "ORD-12345",
    notes: "Electronics purchase",
  },
  {
    id: 16,
    name: "Uber Rides",
    date: "Mar 12",
    amount: -34.5,
    status: "pending" as const,
    category: "Transport",
    account: "Checking",
    merchant: "Uber",
    reference: "RIDE-789",
    notes: "Airport transfer",
  },
  {
    id: 17,
    name: "Dividend Payout",
    date: "Mar 10",
    amount: 150.0,
    status: "completed" as const,
    category: "Income",
    account: "Savings",
    merchant: "Vanguard",
    reference: "DIV-0310",
    notes: "Quarterly dividend",
  },
  {
    id: 18,
    name: "Gym Membership",
    date: "Mar 8",
    amount: -49.99,
    status: "completed" as const,
    category: "Health",
    account: "Checking",
    merchant: "24 Hour Fitness",
    reference: "SUB-0308",
    notes: "Monthly gym fee",
  },
  {
    id: 19,
    name: "Freelance Project",
    date: "Mar 5",
    amount: 1800.0,
    status: "completed" as const,
    category: "Income",
    account: "Checking",
    merchant: "Startup Inc",
    reference: "INV-0305",
    notes: "Website development",
  },
  {
    id: 20,
    name: "Water Bill",
    date: "Mar 3",
    amount: -42.0,
    status: "completed" as const,
    category: "Utilities",
    account: "Checking",
    merchant: "Water Dept",
    reference: "UTIL-0303",
    notes: "Monthly water bill",
  },
  {
    id: 21,
    name: "SWIFT Transfer — Client Ltd (UK)",
    date: "Today, 9:15 AM",
    amount: 4500.0,
    status: "completed" as const,
    category: "Income",
    account: "USD Account",
    merchant: "Client Ltd (United Kingdom)",
    reference: "SWIFT-2024-001",
    notes: "International wire transfer",
  },
  {
    id: 22,
    name: "Alibaba Order",
    date: "Yesterday",
    amount: -2340.0,
    status: "completed" as const,
    category: "Shopping",
    account: "USD Account",
    merchant: "Alibaba Group (China)",
    reference: "ALI-ORD-8842",
    notes: "Bulk inventory purchase",
  },
  {
    id: 23,
    name: "TransferWise Fee",
    date: "2 days ago",
    amount: -35.0,
    status: "completed" as const,
    category: "Transfer",
    account: "GBP Account",
    merchant: "Wise Payments Ltd (UK)",
    reference: "WISE-FEE-023",
    notes: "Cross-border transfer fee",
  },
  {
    id: 24,
    name: "AWS Cloud Services",
    date: "3 days ago",
    amount: -1247.3,
    status: "pending" as const,
    category: "Technology",
    account: "USD Account",
    merchant: "Amazon Web Services (US)",
    reference: "AWS-0424-987",
    notes: "Monthly cloud infrastructure",
  },
  {
    id: 25,
    name: "Freelancer.com Payment",
    date: "4 days ago",
    amount: 2800.0,
    status: "completed" as const,
    category: "Income",
    account: "EUR Account",
    merchant: "Freelancer International",
    reference: "FL-INV-7721",
    notes: "Project milestone payment (EUR)",
  },
  {
    id: 26,
    name: "Shopify Payout",
    date: "5 days ago",
    amount: 1890.0,
    status: "completed" as const,
    category: "Income",
    account: "CAD Account",
    merchant: "Shopify Inc (Canada)",
    reference: "SHOP-PAY-056",
    notes: "Monthly store revenue",
  },
  {
    id: 27,
    name: "AliExpress Purchase",
    date: "6 days ago",
    amount: -156.5,
    status: "completed" as const,
    category: "Shopping",
    account: "USD Account",
    merchant: "AliExpress (China)",
    reference: "AE-ORD-3391",
    notes: "Office supplies order",
  },
  {
    id: 28,
    name: "Remittance (Western Union)",
    date: "1 week ago",
    amount: -500.0,
    status: "pending" as const,
    category: "Transfer",
    account: "Checking",
    merchant: "Western Union",
    reference: "WU-TRF-8812",
    notes: "Family remittance overseas",
  },
  {
    id: 29,
    name: "Google Ads Charge",
    date: "1 week ago",
    amount: -890.0,
    status: "completed" as const,
    category: "Advertising",
    account: "USD Account",
    merchant: "Google LLC (US)",
    reference: "ADS-0424-554",
    notes: "Q2 advertising spend",
  },
  {
    id: 30,
    name: "International Invoice — TechCorp",
    date: "1 week ago",
    amount: 6200.0,
    status: "completed" as const,
    category: "Income",
    account: "GBP Account",
    merchant: "TechCorp Ltd (United Kingdom)",
    reference: "INV-GBP-1044",
    notes: "Consulting services (GBP)",
  },
];

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [note, setNote] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const idx = transactions.findIndex((t) => t.id === Number(params.id));
  const tx = transactions[idx];

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  if (!tx) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <Card className="border shadow-sm bg-card/80 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <DollarSign className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Transaction Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The transaction with ID #{params.id} does not exist or has been deleted.
              </p>
              <Button onClick={() => router.push("/dashboard/transactions")} className="rounded-full">
                Back to Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      Income: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      Utilities: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      Transfer: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      Entertainment: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
      Transport: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      Insurance: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
      Bills: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      Shopping: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400",
      Health: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  const categories = ["Food", "Income", "Utilities", "Transfer", "Entertainment", "Transport", "Insurance", "Bills", "Shopping", "Health"];
  const accounts = ["Checking", "Savings", "Credit Card"];

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updated = { ...tx };
    updated.name = form.get("name") as string;
    updated.category = form.get("category") as string;
    updated.account = form.get("account") as string;
    updated.merchant = form.get("merchant") as string;
    updated.notes = form.get("notes") as string;
    const amount = parseFloat(form.get("amount") as string);
    if (!isNaN(amount)) updated.amount = amount;
    const copy = [...transactions];
    copy[idx] = updated;
    setTransactions(copy);
    setShowEdit(false);
    showToast("Transaction updated");
  };

  const handleDelete = () => {
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    setShowDelete(false);
    showToast("Transaction deleted");
    setTimeout(() => router.push("/dashboard/transactions"), 800);
  };

  const handleReceipt = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Receipt #${tx.id}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: #f5f5f5; display: flex; justify-content: center; padding: 40px 16px;
}
.receipt {
  background: #fff; width: 380px; padding: 32px; border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
.header { text-align: center; margin-bottom: 24px; }
.logo { width: 40px; height: 40px; margin: 0 auto 12px; }
.logo-bg { fill: #ff5555; }
.logo-inner { fill: #cc0000; }
h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.sub { font-size: 12px; color: #888; }
.divider { height: 1px; background: #eee; margin: 16px 0; }
.row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
.row .label { color: #888; }
.row .value { font-weight: 600; }
.amount-row { padding: 12px 0; }
.amount-row .value { font-size: 24px; font-weight: 700; }
.status { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-top: 8px; }
.status-completed { background: #e6f7e6; color: #1a7d1a; }
.status-pending { background: #fff7e6; color: #b8860b; }
.footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 16px; }
.print-btn { display: block; margin: 20px auto 0; padding: 10px 24px; border: none; border-radius: 999px; background: #1a1a1a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
.print-btn:hover { opacity: 0.9; }
</style></head><body>
<div class="receipt">
  <div class="header">
    <svg class="logo" viewBox="0 0 32 32" fill="none">
      <path class="logo-bg" d="M16 0L4 8V24L16 32L28 24V8L16 0Z"/>
      <path class="logo-inner" d="M16 4L8 9V23L16 28L24 23V9L16 4Z"/>
    </svg>
    <h1>uifry</h1>
    <p class="sub">Payment Receipt</p>
  </div>
  <div class="divider"></div>
  <div class="row"><span class="label">Receipt #</span><span class="value">${tx.reference || `RCP-${String(tx.id).padStart(4, "0")}`}</span></div>
  <div class="row"><span class="label">Date</span><span class="value">${tx.date}</span></div>
  <div class="row"><span class="label">Transaction</span><span class="value">${tx.name}</span></div>
  <div class="row"><span class="label">Merchant</span><span class="value">${tx.merchant || tx.name}</span></div>
  <div class="row"><span class="label">Category</span><span class="value">${tx.category}</span></div>
  <div class="row"><span class="label">Account</span><span class="value">${tx.account}</span></div>
  <div class="divider"></div>
  <div class="row amount-row">
    <span class="label">Total</span>
    <span class="value" style="color:${tx.amount > 0 ? "#1a7d1a" : "#1a1a1a"}">${tx.amount > 0 ? "+" : "-"}$${Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  </div>
  <div style="text-align:center;">
    <span class="status ${tx.status === "completed" ? "status-completed" : "status-pending"}">${tx.status === "completed" ? "✓ Paid" : "⏳ Pending"}</span>
  </div>
  <div class="divider"></div>
  <p class="footer">Thank you for your business!</p>
  <button class="print-btn" onclick="window.print()">Print Receipt</button>
</div></body></html>`);
    w.document.close();
    showToast("Receipt opened in new tab");
  };

  const handleShare = async () => {
    const text = `Transaction: ${tx.name}\nAmount: $${Math.abs(tx.amount).toFixed(2)}\nDate: ${tx.date}\nStatus: ${tx.status}`;
    if (navigator.share) {
      await navigator.share({ title: tx.name, text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    }
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    const copy = [...transactions];
    copy[idx] = { ...tx, notes: note };
    setTransactions(copy);
    setNote("");
    setShowNote(false);
    showToast("Note added");
  };

  const handlePdf = () => window.print();

  const handleReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowReport(false);
    showToast("Issue reported — we'll review it shortly");
  };

  const handleDispute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowDispute(false);
    showToast("Dispute filed — we'll investigate within 48 hours");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border bg-card shadow-lg text-sm font-medium animate-in slide-in-from-top-2">
          {toast.ok ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted transition-all duration-200">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Transaction Details</h1>
              <p className="text-sm text-muted-foreground mt-1">View and manage transaction information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setShowEdit(true)}>
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setShowDelete(true)}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>

        {/* ── Hero ── */}
        <Card className="border shadow-xl bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="p-8 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <Avatar className={`w-20 h-20 mx-auto mb-4 shadow-lg ${tx.amount > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                <AvatarFallback className="text-2xl font-bold bg-transparent">{getInitials(tx.name)}</AvatarFallback>
              </Avatar>
              <div className="relative">
                <Badge variant="secondary" className={`mb-3 px-3 py-1 text-xs font-medium ${tx.amount > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {tx.amount > 0 ? "Income" : "Expense"}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">{tx.name}</h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{tx.date}</span>
                </div>
                <div className={`text-4xl sm:text-5xl font-bold mb-3 ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : "-"}$
                  {Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={tx.status === "completed" ? "success" : "warning"} className="px-3 py-1 text-xs font-medium rounded-full">
                    {tx.status === "completed" ? "✓ Completed" : "⏳ Pending"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 pb-8">
              <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleReceipt}>
                <Download className="w-4 h-4" /> Receipt
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Details ── */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" /> Transaction Information
              </h3>
              <div className="space-y-4">
                <Row label="Transaction ID" value={tx.reference || `#${tx.id}`} mono />
                <Separator />
                <Row label="Merchant" value={tx.merchant || tx.name} />
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge className={`${getCategoryColor(tx.category)} border-0 rounded-full px-3 py-1 text-xs font-medium`}>{tx.category}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{tx.account}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-muted-foreground" /> Additional Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{tx.date}</span>
                  </div>
                </div>
                <Separator />
                <Row label="Amount" value={`${tx.amount > 0 ? "+" : ""}$${Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} bold green={tx.amount > 0} />
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tx.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm font-medium capitalize">{tx.status}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <span className="text-sm text-right max-w-[200px]">{tx.notes || "No additional notes"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Quick Actions ── */}
        <Card className="border shadow-sm bg-card">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowNote(true)}>Add Note</Button>
              <Button variant="outline" size="sm" className="rounded-full" onClick={handlePdf}>Download PDF</Button>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowReport(true)}>Report Issue</Button>
              <Button variant="outline" size="sm" className="rounded-full text-red-600 hover:text-red-700" onClick={() => setShowDispute(true)}>Dispute Transaction</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Edit Modal ── */}
      <Dialog open={showEdit} onClose={() => setShowEdit(false)} title="Edit Transaction">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <Input name="name" defaultValue={tx.name} required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Amount</label>
              <Input name="amount" type="number" step="0.01" defaultValue={Math.abs(tx.amount)} required className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select name="category" defaultValue={tx.category} className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Account</label>
              <select name="account" defaultValue={tx.account} className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {accounts.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Merchant</label>
              <Input name="merchant" defaultValue={tx.merchant || ""} className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <textarea name="notes" defaultValue={tx.notes || ""} rows={3} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 rounded-full">Save Changes</Button>
            <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => setShowEdit(false)}>Cancel</Button>
          </div>
        </form>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog open={showDelete} onClose={() => setShowDelete(false)} title="Delete Transaction">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-red-800 dark:text-red-200">This action cannot be undone. Are you sure you want to delete this transaction?</span>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 rounded-full bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</Button>
            <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

      {/* ── Add Note Modal ── */}
      <Dialog open={showNote} onClose={() => { setShowNote(false); setNote(""); }} title="Add Note">
        <div className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note about this transaction..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="flex gap-2">
            <Button className="flex-1 rounded-full" onClick={handleAddNote} disabled={!note.trim()}>Save Note</Button>
            <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setShowNote(false); setNote(""); }}>Cancel</Button>
          </div>
        </div>
      </Dialog>

      {/* ── Report Issue Modal ── */}
      <Dialog open={showReport} onClose={() => setShowReport(false)} title="Report Issue">
        <form onSubmit={handleReport} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Describe the issue</label>
            <textarea name="issue" rows={4} required placeholder="Please describe what went wrong..." className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 rounded-full">Submit Report</Button>
            <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => setShowReport(false)}>Cancel</Button>
          </div>
        </form>
      </Dialog>

      {/* ── Dispute Modal ── */}
      <Dialog open={showDispute} onClose={() => setShowDispute(false)} title="Dispute Transaction">
        <form onSubmit={handleDispute} className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 text-sm">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
            <span>Filing a dispute will initiate an investigation. Please provide details below.</span>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Reason for dispute</label>
            <select required className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select a reason...</option>
              <option>Duplicate transaction</option>
              <option>Incorrect amount</option>
              <option>Unauthorized transaction</option>
              <option>Product/service not received</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Additional details</label>
            <textarea name="details" rows={3} placeholder="Provide any additional context..." className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 rounded-full bg-red-600 hover:bg-red-700">File Dispute</Button>
            <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => setShowDispute(false)}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

function Row({ label, value, mono, bold, green }: { label: string; value: string; mono?: boolean; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : ""} ${bold ? "font-bold" : "font-medium"} ${green ? "text-green-600 dark:text-green-400" : ""}`}>{value}</span>
    </div>
  );
}
