"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { useFetch } from "@/src/hooks/use-fetch";
import { useMutation } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";

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

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: org } = useFetch<{
    name: string;
    logo: string | null;
    email: string | null;
    phone: string | null;
    isActive: boolean;
  }>(`/api/admin/organizations/${id}`);
  const { mutate, isPending } = useMutation({
    mutationFn: (input: typeof form) => api.patch(`/api/admin/organizations/${id}`, input),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const result = await mutate({ ...form, logo: logoUrl });
    if (result.success) router.push(`/admin/companies/${id}`);
  };

  return (
    <PageLayout
      title="Edit Company"
      showBack
      breadcrumbs={[
        { label: "Companies", href: "/admin/companies" },
        { label: org?.name ?? "...", href: `/admin/companies/${id}` },
        { label: "Edit" },
      ]}
    >
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Organization Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/20 p-4">
              <div className="relative">
                <CompanyLogo
                  name={form.name || "Company"}
                  logo={logoPreview ?? form.logo}
                  size={64}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-muted"
                  aria-label="Upload company logo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Company logo</p>
                <p className="text-xs text-muted-foreground">
                  Shown in the sidebar and across the app for this tenant.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change logo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleLogoSelect}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label>Active Status</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isPending || isUploadingLogo}>
                {isUploadingLogo ? "Uploading logo…" : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/companies/${id}`)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
