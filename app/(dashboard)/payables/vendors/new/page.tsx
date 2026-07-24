"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { usePayableStore } from "@/src/store/payable-store";
import {
  VENDOR_TYPE_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  type VendorTypeEnum,
  type VendorStatusType,
  type PaymentTermsType,
} from "@/src/types/payable";

export default function NewVendorPage() {
  const router = useRouter();
  const { addVendor } = usePayableStore();
  const [submitting, setSubmitting] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "supplier" as VendorTypeEnum,
    status: "active" as VendorStatusType,
    email: "",
    phone: "",
    website: "",
    taxId: "",
    paymentTerms: "net_30" as PaymentTermsType,
    currency: "USD",
    rating: 0,
    notes: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactTitle: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
    addressCountry: "",
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    bankSwift: "",
    categories: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Vendor name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addVendor({
      name: form.name,
      code: form.code,
      type: form.type,
      status: form.status,
      email: form.email || null,
      phone: form.phone || null,
      website: form.website || null,
      taxId: form.taxId || null,
      paymentTerms: form.paymentTerms,
      currency: form.currency,
      rating: form.rating,
      notes: form.notes || null,
      contactName: form.contactName || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
      contactTitle: form.contactTitle || null,
      addressStreet: form.addressStreet || null,
      addressCity: form.addressCity || null,
      addressState: form.addressState || null,
      addressZip: form.addressZip || null,
      addressCountry: form.addressCountry || null,
      bankName: form.bankName || null,
      bankAccountName: form.bankAccountName || null,
      bankAccountNumber: form.bankAccountNumber || null,
      bankRoutingNumber: form.bankRoutingNumber || null,
      bankSwift: form.bankSwift || null,
      categories: form.categories,
    });
    setSubmitting(false);
    if (result) router.push("/payables/vendors");
  };

  const addCategory = () => {
    const parts = categoryInput.split(",").map((s) => s.trim()).filter(Boolean);
    const newCats = parts.filter((c) => !form.categories.includes(c));
    if (newCats.length) {
      set("categories", [...form.categories, ...newCats]);
      setCategoryInput("");
    }
  };

  const removeCategory = (cat: string) => {
    set("categories", form.categories.filter((c) => c !== cat));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Payables</span>
        <span>/</span>
        <button onClick={() => router.push("/payables/vendors")} className="hover:text-foreground">Vendors</button>
        <span>/</span>
        <span className="text-foreground">New Vendor</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/payables/vendors")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Vendor</h1>
          <p className="text-muted-foreground mt-1">Add a new vendor to your directory</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>General vendor details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Acme Corp" />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Vendor Code</Label>
              <Input id="code" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. VEN-001" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VENDOR_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["active", "inactive", "suspended", "pending"] as const).map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vendor@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="www.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" value={form.taxId} onChange={(e) => set("taxId", e.target.value)} placeholder="Tax ID number" />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select value={form.paymentTerms} onValueChange={(v) => set("paymentTerms", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={(e) => set("currency", e.target.value)} placeholder="USD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" type="number" min={0} max={5} step={0.5} value={form.rating} onChange={(e) => set("rating", parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Primary contact person</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input id="contactName" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactTitle">Contact Title</Label>
              <Input id="contactTitle" value={form.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} placeholder="Job title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+1 234 567 890" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Vendor mailing address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressStreet">Street Address</Label>
            <Input id="addressStreet" value={form.addressStreet} onChange={(e) => set("addressStreet", e.target.value)} placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressCity">City</Label>
              <Input id="addressCity" value={form.addressCity} onChange={(e) => set("addressCity", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressState">State / Province</Label>
              <Input id="addressState" value={form.addressState} onChange={(e) => set("addressState", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressZip">Zip / Postal Code</Label>
              <Input id="addressZip" value={form.addressZip} onChange={(e) => set("addressZip", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressCountry">Country</Label>
              <Input id="addressCountry" value={form.addressCountry} onChange={(e) => set("addressCountry", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
          <CardDescription>Payment account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountName">Account Name</Label>
              <Input id="bankAccountName" value={form.bankAccountName} onChange={(e) => set("bankAccountName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Account Number</Label>
              <Input id="bankAccountNumber" value={form.bankAccountNumber} onChange={(e) => set("bankAccountNumber", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankRoutingNumber">Routing Number</Label>
              <Input id="bankRoutingNumber" value={form.bankRoutingNumber} onChange={(e) => set("bankRoutingNumber", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankSwift">SWIFT Code</Label>
              <Input id="bankSwift" value={form.bankSwift} onChange={(e) => set("bankSwift", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Add categories (comma-separated or one at a time)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="e.g. Office Supplies, IT Services"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
            />
            <Button type="button" variant="outline" onClick={addCategory} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          {form.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.categories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                  {cat}
                  <button onClick={() => removeCategory(cat)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/payables/vendors")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Vendor"}
        </Button>
      </div>
    </div>
  );
}
