"use client";

import { useEffect, useState, useMemo } from "react";
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
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  FileText,
  DollarSign,
  AlertCircle,
  Star,
} from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CUSTOMER_TYPE_OPTIONS,
  CREDIT_RATING_OPTIONS,
  type CustomerStatusType,
  type CreditRatingType,
} from "@/src/types/receivable";

const STATUS_COLORS: Record<CustomerStatusType, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  suspended: "bg-yellow-100 text-yellow-700",
  blacklisted: "bg-red-100 text-red-700",
};

const RATING_COLORS: Record<CreditRatingType, string> = {
  AAA: "bg-green-100 text-green-700",
  AA: "bg-green-50 text-green-600",
  A: "bg-blue-100 text-blue-700",
  BBB: "bg-yellow-100 text-yellow-700",
  BB: "bg-orange-100 text-orange-700",
  B: "bg-red-100 text-red-700",
  CCC: "bg-red-200 text-red-800",
  D: "bg-red-300 text-red-900",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { customers, loading, fetchCustomers, getCustomerById, deleteCustomer } = useReceivableStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!customers.length) fetchCustomers();
  }, [customers.length, fetchCustomers]);

  const customer = getCustomerById(id);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteCustomer(id);
    setDeleting(false);
    router.push("/receivables/customers");
  };

  if (loading && !customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/receivables/customers")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Customer not found</p>
              <p className="text-muted-foreground">The customer you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Receivables</span>
        <span>/</span>
        <button onClick={() => router.push("/receivables/customers")} className="hover:text-foreground">Customers</button>
        <span>/</span>
        <span className="text-foreground">{customer.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/receivables/customers")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{customer.name}</h1>
              <Badge className={STATUS_COLORS[customer.status]}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">{customer.code}</span>
              <Badge variant="outline" className="capitalize">
                {CUSTOMER_TYPE_OPTIONS.find((t) => t.value === customer.type)?.label ?? customer.type}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/receivables/customers/${id}/edit`)} className="gap-2">
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
                <p className="text-sm text-muted-foreground">Credit Limit</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: customer.currency, minimumFractionDigits: 0 }).format(customer.creditLimit)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: customer.currency, minimumFractionDigits: 0 }).format(customer.currentBalance)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credit Rating</p>
                <p className="mt-1">
                  <Badge variant="outline" className={RATING_COLORS[customer.creditRating]}>
                    {customer.creditRating}
                  </Badge>
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Email" value={customer.email} />
            <InfoRow label="Phone" value={customer.phone} />
            <InfoRow label="Website" value={customer.website} />
            <InfoRow label="Tax ID" value={customer.taxId} />
            <InfoRow label="Payment Terms" value={customer.paymentTerms} />
            <InfoRow label="Currency" value={customer.currency} />
            <InfoRow label="Industry" value={customer.industry} />
          </div>
          {customer.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{customer.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Contact Name" value={customer.contactName} />
            <InfoRow label="Title" value={customer.contactTitle} />
            <InfoRow label="Email" value={customer.contactEmail} />
            <InfoRow label="Phone" value={customer.contactPhone} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {customer.addressStreet && <p>{customer.addressStreet}</p>}
            {[customer.addressCity, customer.addressState].filter(Boolean).length > 0 && (
              <p>{[customer.addressCity, customer.addressState].filter(Boolean).join(", ")}</p>
            )}
            {[customer.addressZip, customer.addressCountry].filter(Boolean).length > 0 && (
              <p>{[customer.addressZip, customer.addressCountry].filter(Boolean).join(", ")}</p>
            )}
            {!customer.addressStreet && !customer.addressCity && !customer.addressState && !customer.addressZip && !customer.addressCountry && (
              <p className="text-muted-foreground">No address on file</p>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{customer.name}&quot;? This action cannot be undone.
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
