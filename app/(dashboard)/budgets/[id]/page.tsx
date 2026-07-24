"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
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
  DollarSign,
  TrendingUp,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { useBudgetStore } from "@/src/store/budget-store";
import { BUDGET_STATUS_OPTIONS, type BudgetStatusType } from "@/src/types/budget";

const STATUS_COLORS: Record<BudgetStatusType, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const getSpentColor = (pct: number) => {
  if (pct > 100) return "bg-red-500";
  if (pct > 90) return "bg-orange-500";
  if (pct > 60) return "bg-yellow-500";
  return "bg-green-500";
};

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { budgets, loading, fetchBudgets, getBudgetById, deleteBudget } = useBudgetStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!budgets.length) fetchBudgets();
  }, [budgets.length, fetchBudgets]);

  const budget = getBudgetById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteBudget(id);
    setDeleting(false);
    router.push("/budgets");
  };

  if (loading && !budget) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/budgets")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Budgets
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Budget not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const remaining = budget.totalAmount - budget.spentAmount;
  const spentPct = budget.totalAmount > 0 ? (budget.spentAmount / budget.totalAmount) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Budgets</span>
        <span>/</span>
        <span className="text-foreground">{budget.departmentName || "General"} - {budget.fiscalYear}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/budgets")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {budget.departmentName || "General"} - {budget.fiscalYear}
              </h1>
              <Badge className={STATUS_COLORS[budget.status]}>
                {budget.status.charAt(0) + budget.status.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/budgets/${id}/edit`)} className="gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" onClick={() => setShowDelete(true)} className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(budget.totalAmount)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(budget.spentAmount)}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(remaining)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{spentPct.toFixed(1)}%</span>
            </div>
            <Progress value={spentPct} className="h-3" indicatorClassName={getSpentColor(spentPct)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items ({budget.lineItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budget.lineItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No line items
                    </TableCell>
                  </TableRow>
                ) : (
                  budget.lineItems.map((item) => {
                    const itemRemaining = item.allocated - item.spent;
                    const itemPct = item.allocated > 0 ? (item.spent / item.allocated) * 100 : 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{item.description || "-"}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.allocated)}</TableCell>
                        <TableCell>{formatCurrency(item.spent)}</TableCell>
                        <TableCell>
                          <span className={itemRemaining >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(itemRemaining)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="w-[100px] space-y-1">
                            <Progress value={itemPct} className="h-2" indicatorClassName={getSpentColor(itemPct)} />
                            <span className="text-xs text-muted-foreground">{itemPct.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
