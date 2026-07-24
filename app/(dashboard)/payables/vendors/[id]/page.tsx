"use client";

import { useEffect, useMemo } from "react";
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
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Users,
  FileText,
  DollarSign,
  Star,
  StarOff,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { usePayableStore } from "@/src/store/payable-store";
import {
  VENDOR_TYPE_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  type VendorStatusType,
} from "@/src/types/payable";

const STATUS_COLORS: Record<VendorStatusType, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  suspended: "bg-yellow-100 text-yellow-700",
  pending: "bg-blue-100 text-blue-700",
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
    } else if (i === full + 1 && half) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500/50 text-yellow-500" />);
    } else {
      stars.push(<StarOff key={i} className="h-4 w-4 text-gray-300" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { vendors, bills, loading, fetchVendors, fetchBills, getVendorById, deleteVendor } = usePayableStore();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!vendors.length) fetchVendors();
    if (!bills.length) fetchBills();
  }, [vendors.length, bills.length, fetchVendors, fetchBills]);

  const vendor = getVendorById(id);

  const vendorBills = useMemo(() => {
    if (!vendor) return [];
    return bills.filter((b) => b.vendorId === vendor.id);
  }, [bills, vendor]);

  const totalAmount = useMemo(() => vendorBills.reduce((s, b) => s + b.totalAmount, 0), [vendorBills]);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteVendor(id);
    setDeleting(false);
    router.push("/payables/vendors");
  };

  if (loading && !vendor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/payables/vendors")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Vendors
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Vendor not found</p>
              <p className="text-muted-foreground">The vendor you are looking for does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Payables</span>
        <span>/</span>
        <button onClick={() => router.push("/payables/vendors")} className="hover:text-foreground">Vendors</button>
        <span>/</span>
        <span className="text-foreground">{vendor.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/payables/vendors")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{vendor.name}</h1>
              <Badge className={STATUS_COLORS[vendor.status]}>
                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">{vendor.code}</span>
              <Badge variant="outline" className="capitalize">
                {VENDOR_TYPE_OPTIONS.find((t) => t.value === vendor.type)?.label ?? vendor.type}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/payables/vendors/${id}/edit`)} className="gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" onClick={() => setShowDelete(true)} className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StarRating rating={vendor.rating} />
        <span className="text-sm text-muted-foreground ml-1">{vendor.rating} / 5</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bills</p>
                <p className="text-2xl font-bold">{vendorBills.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: vendor.currency }).format(totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{vendor.categories.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Email" value={vendor.email} />
            <InfoRow label="Phone" value={vendor.phone} />
            <InfoRow label="Website" value={vendor.website} />
            <InfoRow label="Tax ID" value={vendor.taxId} />
            <InfoRow label="Payment Terms" value={PAYMENT_TERMS_OPTIONS.find((t) => t.value === vendor.paymentTerms)?.label} />
            <InfoRow label="Currency" value={vendor.currency} />
          </div>
          {vendor.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{vendor.notes}</p>
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
            <InfoRow label="Contact Name" value={vendor.contactName} />
            <InfoRow label="Title" value={vendor.contactTitle} />
            <InfoRow label="Email" value={vendor.contactEmail} />
            <InfoRow label="Phone" value={vendor.contactPhone} />
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
            {vendor.addressStreet && <p>{vendor.addressStreet}</p>}
            {[vendor.addressCity, vendor.addressState].filter(Boolean).length > 0 && (
              <p>{[vendor.addressCity, vendor.addressState].filter(Boolean).join(", ")}</p>
            )}
            {[vendor.addressZip, vendor.addressCountry].filter(Boolean).length > 0 && (
              <p>{[vendor.addressZip, vendor.addressCountry].filter(Boolean).join(", ")}</p>
            )}
            {!vendor.addressStreet && !vendor.addressCity && !vendor.addressState && !vendor.addressZip && !vendor.addressCountry && (
              <p className="text-muted-foreground">No address on file</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Bank Name" value={vendor.bankName} />
            <InfoRow label="Account Name" value={vendor.bankAccountName} />
            <InfoRow label="Account Number" value={vendor.bankAccountNumber} />
            <InfoRow label="Routing Number" value={vendor.bankRoutingNumber} />
            <InfoRow label="SWIFT Code" value={vendor.bankSwift} />
          </div>
        </CardContent>
      </Card>

      {vendor.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map((cat) => (
                <Badge key={cat} variant="secondary">{cat}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{vendor.name}&quot;? This action cannot be undone.
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
