"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Pencil, Trash2, FileText, Share2, StickyNote,
  AlertTriangle, Scale, X, Check, Calendar, DollarSign,
  Building2, CreditCard, Tag, MoreHorizontal, Printer,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Dialog } from "@/src/components/ui/dialog";
import { fetchTransaction, updateTransaction, deleteTransaction } from "@/src/lib/api";

interface Tx {
  id: string;
  name: string;
  date: string;
  rawDate: string;
  amount: number;
  status: string;
  category: string;
  account: string;
  merchant: string;
  reference: string;
  notes: string;
  description: string;
  receipt: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCategoryColor(cat: string) {
  const colors: Record<string, string> = {
    Food: "bg-accent-50 text-accent-700", Income: "bg-accent-50 text-accent-700",
    Utilities: "bg-accent-50 text-accent-700", Transfer: "bg-accent-50 text-accent-700",
    Entertainment: "bg-accent-50 text-accent-700", Transport: "bg-accent-50 text-accent-700",
    Shopping: "bg-accent-50 text-accent-700", Health: "bg-accent-50 text-accent-700",
    Housing: "bg-accent-50 text-accent-700", Salary: "bg-accent-50 text-accent-700",
    Investment: "bg-accent-50 text-accent-700",
  };
  return colors[cat] || "bg-accent-50 text-accent-700";
}

function formatDate(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return `Today, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all ${
      ok ? "bg-accent-600 text-white" : "bg-danger text-white"
    }`}>
      {ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {msg}
    </div>
  );
}

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [tx, setTx] = useState<Tx | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => setToast({ msg, ok });

  useEffect(() => {
    fetchTransaction(id)
      .then((data) => {
        setTx({
          id: data.id,
          name: data.title,
          rawDate: data.date,
          date: formatDate(new Date(data.date)),
          amount: Number(data.amount),
          status: data.status.toLowerCase(),
          category: data.category,
          account: data.account || "Checking",
          merchant: data.merchant || "",
          reference: data.reference || "",
          notes: data.notes || "",
          description: data.description || "",
          receipt: data.receipt || "",
        });
      })
      .catch(() => router.push("/dashboard/transactions"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Transaction Not Found</h2>
        <p className="text-muted-foreground mb-6">The transaction you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push("/dashboard/transactions")}>Back to Transactions</Button>
      </div>
    );
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    const name = form.get("name") as string;
    const category = form.get("category") as string;
    const account = form.get("account") as string;
    const merchant = form.get("merchant") as string;
    const notes = form.get("notes") as string;
    const amount = parseFloat(form.get("amount") as string);
    if (name) data.title = name;
    if (category) data.category = category;
    if (account) data.account = account;
    if (merchant !== undefined) data.merchant = merchant;
    if (notes !== undefined) data.notes = notes;
    if (!isNaN(amount)) data.amount = amount;
    try {
      const updated = await updateTransaction(tx.id, data);
      setTx((prev) => prev ? { ...prev, name: updated.title, category: updated.category, account: updated.account || "", merchant: updated.merchant || "", notes: updated.notes || "", amount: Number(updated.amount) } : prev);
      setShowEdit(false);
      showToast("Transaction updated");
    } catch {
      showToast("Failed to update", false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(tx.id);
      setShowDelete(false);
      showToast("Transaction deleted");
      setTimeout(() => router.push("/dashboard/transactions"), 800);
    } catch {
      showToast("Failed to delete", false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      const updated = await updateTransaction(tx.id, { notes: note });
      setTx((prev) => prev ? { ...prev, notes: updated.notes || "" } : prev);
      setNote("");
      setShowNote(false);
      showToast("Note added");
    } catch {
      showToast("Failed to add note", false);
    }
  };

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

  const handleReceipt = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <!DOCTYPE html>
      <html><head><title>Receipt #${tx.reference || tx.id}</title>
      <style>
        body{font-family:system-ui,-apple-system,sans-serif;background:#f5f5f5;display:flex;justify-content:center;padding:40px;margin:0}
        .receipt{background:#fff;max-width:420px;width:100%;padding:32px;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.08)}
        h1{font-size:22px;margin:0 0 4px}
        .sub{color:#666;font-size:13px;margin-bottom:24px}
        .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
        .label{color:#888}
        .value{font-weight:600;text-align:right}
        .total{font-size:28px;font-weight:700;margin:20px 0;text-align:center}
        .badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600}
        .badge-completed{background:#d1fae5;color:#065f46}
        .badge-pending{background:#fef3c7;color:#92400e}
        .print-btn{display:block;width:100%;padding:14px;border:none;border-radius:12px;background:#111;color:#fff;font-size:15px;font-weight:600;cursor:pointer;margin-top:24px}
        .print-btn:hover{opacity:.9}
        @media print{.print-btn{display:none}}
      </style></head><body>
      <div class="receipt">
        <h1>Receipt</h1>
        <p class="sub">${tx.reference || `RCP-${String(tx.id).padStart(4, "0")}`} &middot; ${tx.date}</p>
        <div class="row"><span class="label">Transaction</span><span class="value">${tx.name}</span></div>
        <div class="row"><span class="label">Merchant</span><span class="value">${tx.merchant || tx.name}</span></div>
        <div class="row"><span class="label">Category</span><span class="value">${tx.category}</span></div>
        <div class="row"><span class="label">Account</span><span class="value">${tx.account}</span></div>
        <div class="total">${tx.amount > 0 ? "+" : ""}$${Math.abs(tx.amount).toFixed(2)}</div>
        <div style="text-align:center;margin-bottom:12px">
          <span class="badge ${tx.status === "completed" ? "badge-completed" : "badge-pending"}">${tx.status}</span>
        </div>
        <button class="print-btn" onclick="window.print()"><svg style="width:16px;height:16px;display:inline;margin-right:8px;vertical-align:middle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>Print Receipt</button>
      </div>
      </body></html>
    `);
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

  const categories = ["Food", "Income", "Utilities", "Transfer", "Entertainment", "Transport", "Insurance", "Bills", "Shopping", "Health"];
  const accounts = ["Checking", "Savings", "Credit Card"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--lp-red,#ff5555)] to-[var(--lp-red-dark,#cc0000)] px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{getInitials(tx.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{tx.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {tx.date}</span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className={tx.amount > 0 ? "text-accent-200" : ""}>
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </span>
              </div>
            </div>
            <Badge variant={tx.status === "completed" ? "success" : "warning"} className="capitalize text-xs px-3 py-1">{tx.status}</Badge>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-border">
          {[
            { icon: Pencil, label: "Edit", onClick: () => setShowEdit(true) },
            { icon: Trash2, label: "Delete", onClick: () => setShowDelete(true) },
            { icon: FileText, label: "Receipt", onClick: handleReceipt },
            { icon: Share2, label: "Share", onClick: handleShare },
            { icon: StickyNote, label: "Add Note", onClick: () => setShowNote(true) },
            { icon: AlertTriangle, label: "Report", onClick: () => setShowReport(true) },
            { icon: Scale, label: "Dispute", onClick: () => setShowDispute(true) },
          ].map(({ icon: Icon, label, onClick }) => (
            <button key={label} onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-muted transition-colors">
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Details */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div className="space-y-1">
              <Row label="Transaction ID" value={tx.reference || `#${tx.id.slice(0, 8)}`} />
              <Row label="Date & Time" value={<span className="text-sm">{tx.date}</span>} />
              <Row label="Status" value={
                <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${tx.status === "completed" ? "bg-success" : "bg-warning"}`} />{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
              } />
              <Row label="Amount" value={
                <span className={tx.amount > 0 ? "text-success font-semibold" : ""}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              } />
            </div>
            <div className="space-y-1">
              <Row label="Category" value={<Badge className={getCategoryColor(tx.category)}>{tx.category}</Badge>} />
              <Row label="Account" value={<span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-muted-foreground" />{tx.account}</span>} />
              <Row label="Merchant" value={tx.merchant || tx.name} />
              <Row label="Notes" value={tx.notes || "No additional notes"} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><StickyNote className="w-4 h-4" /> Notes</h3>
          <p className="text-sm text-muted-foreground">{tx.notes || "No additional notes"}</p>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onClose={() => setShowEdit(false)} title="Edit Transaction">
        <form onSubmit={handleEdit} className="space-y-4 mt-2">
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Name</label><input name="name" defaultValue={tx.name} required className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-muted-foreground block mb-1">Category</label><select name="category" defaultValue={tx.category} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="text-xs font-medium text-muted-foreground block mb-1">Account</label><select name="account" defaultValue={tx.account} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">{accounts.map((a) => <option key={a}>{a}</option>)}</select></div>
          </div>
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Amount</label><input name="amount" type="number" step="0.01" defaultValue={Math.abs(tx.amount)} required className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm" /></div>
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Merchant</label><input name="merchant" defaultValue={tx.merchant || ""} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm" /></div>
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Notes</label><textarea name="notes" rows={3} defaultValue={tx.notes || ""} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button type="submit" className="bg-[var(--lp-red,#ff5555)] text-white hover:opacity-90">Save Changes</Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onClose={() => setShowDelete(false)} title="Delete Transaction">
        <p className="text-sm text-muted-foreground mt-2">Are you sure you want to delete this transaction? This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} className="bg-red-600 text-white hover:opacity-90">Delete</Button>
        </div>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNote} onClose={() => setShowNote(false)} title="Add Note">
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Write your note..." className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => setShowNote(false)}>Cancel</Button>
          <Button onClick={handleAddNote} className="bg-[var(--lp-red,#ff5555)] text-white hover:opacity-90">Save Note</Button>
        </div>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReport} onClose={() => setShowReport(false)} title="Report an Issue">
        <form onSubmit={handleReport} className="space-y-4 mt-2">
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Describe the issue</label><textarea name="issue" rows={4} required placeholder="Please describe what went wrong..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowReport(false)}>Cancel</Button>
            <Button type="submit" className="bg-[var(--lp-red,#ff5555)] text-white hover:opacity-90">Submit Report</Button>
          </div>
        </form>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={showDispute} onClose={() => setShowDispute(false)} title="Dispute Transaction">
        <form onSubmit={handleDispute} className="space-y-4 mt-2">
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Reason</label><select name="reason" required className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">
            <option value="">Select a reason...</option>
            <option value="duplicate">Duplicate transaction</option>
            <option value="incorrect">Incorrect amount</option>
            <option value="unauthorized">Unauthorized transaction</option>
            <option value="other">Other</option>
          </select></div>
          <div><label className="text-xs font-medium text-muted-foreground block mb-1">Details</label><textarea name="details" rows={4} placeholder="Provide additional details..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowDispute(false)}>Cancel</Button>
            <Button type="submit" className="bg-red-600 text-white hover:opacity-90">File Dispute</Button>
          </div>
        </form>
      </Dialog>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </div>
  );
}
