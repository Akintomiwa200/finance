"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Camera,
  Link2,
  Loader2,
  Mail,
  Phone,
  Power,
  Search,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { useFetch } from "@/src/hooks/use-fetch";
import { useMutation } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import {
  CompanyFormShell,
  FieldAvatar,
  FormFieldRow,
  uploadCompanyLogo,
} from "@/src/components/admin/company-form-shared";

interface OrgEditData {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export function EditCompanyForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: org, isLoading } = useFetch<OrgEditData>(
    `/api/admin/organizations/${companyId}`,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (input: {
      name: string;
      email: string;
      phone: string;
      logo: string;
      isActive: boolean;
    }) => api.patch(`/api/admin/organizations/${companyId}`, input),
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    logo: "",
    isActive: true,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name,
        email: org.email ?? "",
        phone: org.phone ?? "",
        logo: org.logo ?? "",
        isActive: org.isActive,
      });
    }
  }, [org]);

  const slugPreview = org ? `${org.slug}.faas.app` : "company-slug.faas.app";

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      toast({
        title: "Invalid image",
        description: "Use PNG, JPG, WebP, or SVG under 2MB.",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setForm((f) => ({ ...f, logo: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast({
        title: "Company name required",
        description: "Enter a display name for this tenant.",
        variant: "destructive",
      });
      return;
    }

    let logoUrl = form.logo;
    if (logoFile) {
      setIsUploadingLogo(true);
      try {
        logoUrl = await uploadCompanyLogo(logoFile);
      } catch (err) {
        toast({
          title: "Logo upload failed",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        });
        setIsUploadingLogo(false);
        return;
      }
      setIsUploadingLogo(false);
    }

    const result = await mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      logo: logoUrl,
      isActive: form.isActive,
    });

    if (result.success) {
      toast({ title: "Company updated", description: "Changes saved successfully." });
      router.push(`/admin/companies/${companyId}`);
      return;
    }

    toast({
      title: "Could not save changes",
      description: result.error ?? "Please try again.",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <CompanyFormShell
        title="Edit Company"
        description="Loading organization details…"
        onClose={() => router.push(`/admin/companies/${companyId}`)}
      >
        <div className="flex min-h-[320px] items-center justify-center px-6 pb-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CompanyFormShell>
    );
  }

  if (!org) {
    return (
      <CompanyFormShell
        title="Company not found"
        description="This organization may have been removed."
        onClose={() => router.push("/admin/companies")}
      >
        <div className="px-6 pb-10 text-center">
          <Button variant="outline" onClick={() => router.push("/admin/companies")}>
            Back to companies
          </Button>
        </div>
      </CompanyFormShell>
    );
  }

  return (
    <CompanyFormShell
      title="Edit Company"
      description="Update tenant profile, contact details, and access status. The slug cannot be changed after creation."
      onClose={() => router.push(`/admin/companies/${companyId}`)}
    >
      <form onSubmit={handleSubmit} className="min-w-0 px-6 pb-8 pt-6 sm:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Joined {formatDate(org.createdAt, "long")}</span>
            <span aria-hidden>·</span>
            <span className="font-mono text-xs">@{org.slug}</span>
          </div>
          <StatusBadge status={form.isActive ? "active" : "suspended"} />
        </div>

        <div className="mb-6 flex flex-col items-center gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative shrink-0">
              <CompanyLogo
                name={form.name || org.name}
                logo={logoPreview ?? form.logo}
                size={72}
                className="ring-4 ring-background shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Upload company logo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-foreground">
                {form.name.trim() || org.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Shown in the tenant sidebar and across the app
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload logo
            </Button>
            {(logoPreview || form.logo) && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveLogo}>
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleLogoSelect}
          />
        </div>

        <div className="relative mb-5 min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            value={slugPreview}
            className="h-11 w-full min-w-0 rounded-xl border-border/80 bg-muted/30 pl-9 text-sm text-muted-foreground"
            aria-label="Tenant URL"
          />
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-background/40 px-4 sm:px-6">
          <FormFieldRow
            avatar={
              <FieldAvatar className="bg-accent-500/15 text-accent-600">
                <Building2 className="h-5 w-5" />
              </FieldAvatar>
            }
            title="Company name"
            hint="Legal or display name for this tenant"
            trailing={
              <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Required
              </span>
            }
          >
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Acme Corp"
              required
              className="h-10 rounded-lg border-border/80 bg-card"
            />
          </FormFieldRow>

          <FormFieldRow
            avatar={
              <FieldAvatar className="bg-brand-600/10 text-brand-600">
                <Link2 className="h-5 w-5" />
              </FieldAvatar>
            }
            title="Tenant slug"
            hint="Permanent identifier — contact support to change"
          >
            <Input
              readOnly
              value={org.slug}
              className="h-10 rounded-lg border-border/80 bg-muted/40 font-mono text-sm text-muted-foreground"
            />
          </FormFieldRow>

          <div className="grid min-w-0 gap-0 border-t border-border/70 md:grid-cols-2 md:gap-x-6">
            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="Contact email"
              hint="Primary billing or admin email"
            >
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="finance@company.com"
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="Phone number"
              hint="Optional support or billing line"
            >
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+234 800 000 0000"
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>
          </div>

          <FormFieldRow
            avatar={
              <FieldAvatar className={form.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}>
                <Power className="h-4 w-4" />
              </FieldAvatar>
            }
            title="Tenant access"
            hint={
              form.isActive
                ? "Users can sign in and use the platform"
                : "Suspended — users cannot access this organization"
            }
            trailing={
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                aria-label="Active status"
              />
            }
          >
            <p className="text-sm text-muted-foreground">
              {form.isActive
                ? "This tenant is active on the platform."
                : "This tenant is suspended. Billing and modules remain configured but users are blocked."}
            </p>
          </FormFieldRow>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl sm:min-w-[120px]"
            onClick={() => router.push(`/admin/companies/${companyId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || isUploadingLogo}
            className="h-11 min-w-[160px] rounded-xl bg-foreground text-base font-medium text-background hover:bg-foreground/90"
          >
            {isPending || isUploadingLogo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingLogo ? "Uploading logo…" : "Saving…"}
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </CompanyFormShell>
  );
}
