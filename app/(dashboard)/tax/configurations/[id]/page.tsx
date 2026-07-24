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
  Percent,
  DollarSign,
  ToggleLeft,
  AlertCircle,
  Clock,
  CheckCircle,
  Edit2,
} from "lucide-react";
import { useTaxStore } from "@/src/store/tax-store";

const formatCurrency = (amount: number | null) => {
  if (amount === null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function TaxConfigurationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { configurations, loading, fetchConfigurations, getConfigurationById, deleteConfiguration } = useTaxStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { if (!configurations.length) fetchConfigurations(); }, [configurations.length, fetchConfigurations]);

  const config = getConfigurationById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteConfiguration(id);
    setDeleting(false);
    router.push("/tax/configurations");
  };

  if (loading && !config) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/tax/configurations")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Configurations
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Configuration not found</p>
              <p className="text-muted-foreground">The tax configuration you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Tax</span>
        <span>/</span>
        <button onClick={() => router.push("/tax/configurations")} className="hover:text-foreground">Configurations</button>
        <span>/</span>
        <span className="text-foreground">{config.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/tax/configurations")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{config.name}</h1>
              <Badge className={config.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {config.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Tax rate: {config.rate}%</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/tax/configurations/${id}/edit`)} className="gap-2">
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
                <p className="text-sm text-muted-foreground">Tax Rate</p>
                <p className="text-2xl font-bold text-blue-600">{config.rate}%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threshold</p>
                <p className="text-2xl font-bold">{formatCurrency(config.threshold)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-2xl font-bold ${config.isActive ? "text-green-600" : "text-gray-600"}`}>
                  {config.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${config.isActive ? "bg-green-50" : "bg-gray-50"}`}>
                <ToggleLeft className={`h-5 w-5 ${config.isActive ? "text-green-600" : "text-gray-600"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" /> Configuration Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{config.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rate</p>
              <p className="font-medium">{config.rate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Threshold</p>
              <p className="font-medium">{config.threshold !== null ? formatCurrency(config.threshold) : "No threshold"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={config.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {config.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Created on {formatDateTime(config.createdAt)}</span>
            </div>
            {config.updatedAt !== config.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <Edit2 className="h-4 w-4 text-blue-600" />
                <span>Last updated on {formatDateTime(config.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tax Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{config.name}&quot;? This action cannot be undone.
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
