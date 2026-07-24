"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useReceivableStore } from "@/src/store/receivable-store";
import {
  CUSTOMER_TYPE_OPTIONS,
  CREDIT_RATING_OPTIONS,
  type CustomerTypeEnum,
  type CustomerStatusType,
  type CreditRatingType,
} from "@/src/types/receivable";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { customers, loading, fetchCustomers, getCustomerById, updateCustomer } = useReceivableStore();
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!customers.length) fetchCustomers();
  }, [customers.length, fetchCustomers]);

  const customer = getCustomerById(id);

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "business" as CustomerTypeEnum,
    status: "active" as CustomerStatusType,
    email: "",
    phone: "",
    website: "",
    taxId: "",
    creditLimit: 0,
    creditRating: "BBB" as CreditRatingType,
    paymentTerms: "Net 30",
    currency: "USD",
    industry: "",
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
  });

  useEffect(() => {
    if (customer && !initialized) {
      setForm({
        name: customer.name,
        code: customer.code,
        type: customer.type,
        status: customer.status,
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        website: customer.website ?? "",
        taxId: customer.taxId ?? "",
        creditLimit: customer.creditLimit,
        creditRating: customer.creditRating,
        paymentTerms: customer.paymentTerms,
        currency: customer.currency,
        industry: customer.industry ?? "",
        notes: customer.notes ?? "",
        contactName: customer.contactName ?? "",
        contactEmail: customer.contactEmail ?? "",
        contactPhone: customer.contactPhone ?? "",
        contactTitle: customer.contactTitle ?? "",
        addressStreet: customer.addressStreet ?? "",
        addressCity: customer.addressCity ?? "",
        addressState: customer.addressState ?? "",
        addressZip: customer.addressZip ?? "",
        addressCountry: customer.addressCountry ?? "",
      });
      setInitialized(true);
    }
  }, [customer, initialized]);

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Customer name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await updateCustomer(id, {
      name: form.name,
      code: form.code,
      type: form.type,
      status: form.status,
      email: form.email || null,
      phone: form.phone || null,
      website: form.website || null,
      taxId: form.taxId || null,
      creditLimit: form.creditLimit,
      creditRating: form.creditRating,
      paymentTerms: form.paymentTerms,
      currency: form.currency,
      industry: form.industry || null,
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
    });
    setSubmitting(false);
    if (result) router.push(`/receivables/customers/${id}`);
  };

  if (loading && !customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <p className="text-muted-foreground">The customer you are trying to edit does not exist.</p>
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
        <button onClick={() => router.push(`/receivables/customers/${id}`)} className="hover:text-foreground">{customer.name}</button>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/receivables/customers/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground mt-1">Update {customer.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>General customer details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Nigerian Breweries PLC" />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Customer Code</Label>
              <Input id="code" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. CUST-001" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPE_OPTIONS.map((t) => (
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
                  {(["active", "inactive", "suspended", "blacklisted"] as const).map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="customer@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 123 4567" />
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
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input id="creditLimit" type="number" min={0} value={form.creditLimit || ""} onChange={(e) => set("creditLimit", parseFloat(e.target.value) || 0)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Credit Rating</Label>
              <Select value={form.creditRating} onValueChange={(v) => set("creditRating", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CREDIT_RATING_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Input id="paymentTerms" value={form.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)} placeholder="Net 30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={(e) => set("currency", e.target.value)} placeholder="USD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Telecommunications" />
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
              <Input id="contactName" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactTitle">Contact Title</Label>
              <Input id="contactTitle" value={form.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Customer mailing address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressStreet">Street Address</Label>
            <Input id="addressStreet" value={form.addressStreet} onChange={(e) => set("addressStreet", e.target.value)} />
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

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push(`/receivables/customers/${id}`)} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
