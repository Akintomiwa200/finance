"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Search,
  Building2,
  Link2,
  Mail,
  Phone,
  Loader2,
  Camera,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { useCreate } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import { cn } from "@/src/lib/utils";

type CompanyForm = {
  name: string;
  slug: string;
  email: string;
  phone: string;
  plan: string;
  logo: string;
};

const PLAN_OPTIONS = [
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

function FieldAvatar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FormFieldRow({
  avatar,
  title,
  hint,
  children,
  trailing,
}: {
  avatar: React.ReactNode;
  title: string;
  hint?: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/70 py-4 last:border-b-0">
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {hint && (
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            )}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

async function uploadCompanyLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/organizations/logo", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Logo upload failed");
  }
  return data.url as string;
}

export function AddCompanyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    slug: "",
    email: "",
    phone: "",
    plan: "enterprise",
    logo: "",
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { mutate, isPending } = useCreate<
    { id: string },
    { name: string; slug: string; email: string; phone: string; logo?: string }
  >("/api/admin/organizations");

  const slugPreview = useMemo(() => {
    const s = form.slug.trim() || "company-slug";
    return `${s}.faas.app`;
  }, [form.slug]);

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((f) => ({
      ...f,
      name,
      slug: slugTouched ? f.slug : autoSlug,
    }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please choose a PNG, JPG, WebP, or SVG image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Company logo must be 2MB or smaller.",
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

    if (!form.name.trim() || !form.slug.trim()) {
      toast({
        title: "Missing required fields",
        description: "Company name and slug are required.",
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
      slug: form.slug.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      ...(logoUrl ? { logo: logoUrl } : {}),
    });

    if (result.success && result.data?.id) {
      router.push(`/admin/companies/${result.data.id}`);
      return;
    }

    toast({
      title: "Could not create company",
      description: result.error ?? "Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative mx-auto flex w-full min-w-0 max-w-5xl justify-center px-0 py-4 sm:py-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at 15% 10%, color-mix(in srgb, var(--accent-400) 16%, transparent), transparent 48%), radial-gradient(ellipse at 85% 20%, color-mix(in srgb, #ec4899 12%, transparent), transparent 42%), radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--info) 10%, transparent), transparent 50%)",
        }}
      />

      <div className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-xl">
        <button
          type="button"
          onClick={() => router.push("/admin/companies")}
          className="absolute right-5 top-5 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-2 pt-10 text-center sm:px-10 sm:pt-12">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Add New Company
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Register a new tenant on the platform. The company name, slug, and logo
            will appear across the app for this organization.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 px-6 pb-8 pt-6 sm:px-10">
          <div className="mb-6 flex flex-col items-center gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <CompanyLogo
                  name={form.name || "Company"}
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
                  {form.name.trim() || "Company logo"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  PNG, JPG, WebP or SVG · max 2MB
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveLogo}
                >
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
              aria-label="Company URL preview"
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
              hint="Legal or display name for the tenant"
              trailing={
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Required
                </span>
              }
            >
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
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
              title="Slug"
              hint="Unique identifier used in URLs"
              trailing={
                <Select
                  value={form.plan}
                  onValueChange={(plan) => setForm((f) => ({ ...f, plan }))}
                >
                  <SelectTrigger className="h-8 w-[9.5rem] rounded-lg border-border/80 text-xs">
                    <span>
                      {PLAN_OPTIONS.find((p) => p.value === form.plan)?.label ??
                        "Select plan"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            >
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({
                    ...f,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  }));
                }}
                placeholder="acme-corp"
                required
                className="h-10 rounded-lg border-border/80 bg-card font-mono text-sm"
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="finance@acme.com"
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+234 800 000 0000"
                  className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
                />
              </FormFieldRow>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || isUploadingLogo}
            className="mt-6 h-12 w-full rounded-xl bg-foreground text-base font-medium text-background hover:bg-foreground/90"
          >
            {isPending || isUploadingLogo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingLogo ? "Uploading logo…" : "Creating…"}
              </>
            ) : (
              "Create Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
