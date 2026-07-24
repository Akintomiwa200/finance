"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  Loader2,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useLedgerStore } from "@/src/store/ledger-store";
import type { JournalEntry, JournalStatus } from "@/src/types/ledger";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status: JournalStatus) {
  const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    posted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    pending_approval: "Pending Approval",
    approved: "Approved",
    posted: "Posted",
    rejected: "Rejected",
  };
  return <Badge className={styles[status] || ""}>{labels[status] || status}</Badge>;
}

export default function JournalEntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const fetchJournalEntries = useLedgerStore((s) => s.fetchJournalEntries);
  const entries = useLedgerStore((s) => s.journalEntries);
  const updateJournalEntry = useLedgerStore((s) => s.updateJournalEntry);
  const deleteJournalEntry = useLedgerStore((s) => s.deleteJournalEntry);

  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) fetchJournalEntries();
  }, [entries.length, fetchJournalEntries]);

  const entry = entries.find((e) => e.id === id);

  const handlePost = async () => {
    setPosting(true);
    setError(null);
    try {
      const result = await updateJournalEntry(id, { status: "POSTED" });
      if (result) {
        setShowPostDialog(false);
      } else {
        setError("Failed to post entry");
      }
    } catch {
      setError("An error occurred while posting");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const result = await deleteJournalEntry(id);
      if (result) {
        router.push("/ledger/journal-entries");
      } else {
        setError("Failed to delete entry");
        setDeleting(false);
      }
    } catch {
      setError("An error occurred while deleting");
      setDeleting(false);
    }
  };

  if (!entry && entries.length > 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Journal entry not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/ledger/journal-entries")}>
            Back to Journal Entries
          </Button>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const isDraft = entry.status === "draft";
  const isPosted = entry.status === "posted";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              {entry.entryNumber}
              {getStatusBadge(entry.status)}
            </h1>
            <p className="text-muted-foreground mt-1">
              Created {formatDate(entry.createdAt)} by {entry.createdBy || "System"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isDraft && (
            <Button variant="outline" onClick={() => router.push(`/ledger/journal-entries/${id}/edit`)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          {(isDraft || entry.status === "approved") && (
            <Button onClick={() => setShowPostDialog(true)} className="gap-2">
              <Send className="h-4 w-4" />
              Post Entry
            </Button>
          )}
          {isDraft && (
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(entry.date)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium capitalize">{entry.type}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Debit</p>
            <p className="font-bold text-blue-600">{formatCurrency(entry.totalDebit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Credit</p>
            <p className="font-bold text-green-600">{formatCurrency(entry.totalCredit)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entry Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Description</span>
            <span className="font-medium text-right max-w-[400px]">{entry.description || "-"}</span>
          </div>
          {entry.reference && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-medium">{entry.reference}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created At</span>
            <span>{formatDate(entry.createdAt)}</span>
          </div>
          {entry.approvedBy && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approved By</span>
              <span>{entry.approvedBy}</span>
            </div>
          )}
          {entry.postedBy && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Posted By</span>
              <span>{entry.postedBy}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal Lines</CardTitle>
          <CardDescription>{entry.lines.length} line{entry.lines.length !== 1 ? "s" : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <span className="font-mono text-xs">{line.accountCode}</span>
                      <span className="ml-2 text-sm">{line.accountName}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{line.description || "-"}</TableCell>
                    <TableCell className="text-right font-medium text-blue-600">
                      {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-bold">
                  <TableCell colSpan={2} className="text-right">Totals</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(entry.totalDebit)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(entry.totalCredit)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Post &quot;{entry.entryNumber}&quot;? This will update account balances and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePost} disabled={posting} className="bg-green-600 hover:bg-green-700">
              {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Post Entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete &quot;{entry.entryNumber}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
