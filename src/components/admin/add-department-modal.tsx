"use client";

import { useMemo, useState } from "react";
import {
  X,
  Search,
  FolderKanban,
  Hash,
  Building2,
  UserRound,
  FileText,
  Loader2,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";
import { FieldAvatar, FormFieldRow } from "@/src/components/admin/admin-form-fields";
import { useFetch } from "@/src/hooks/use-fetch";
import { useCreate } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import type { AdminOrganization } from "@/src/types/admin";

type DepartmentForm = {
  name: string;
  code: string;
  organizationId: string;
  head: string;
  description: string;
};

interface AddDepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function AddDepartmentModal({
  open,
  onClose,
  onCreated,
}: AddDepartmentModalProps) {
  const { toast } = useToast();
  const { data: organizations } = useFetch<AdminOrganization[]>(
    open ? "/api/admin/organizations" : null,
  );

  const [form, setForm] = useState<DepartmentForm>({
    name: "",
    code: "",
    organizationId: "",
    head: "",
    description: "",
  });
  const [codeTouched, setCodeTouched] = useState(false);

  const { mutate, isPending } = useCreate<
    { id: string },
    {
      name: string;
      code: string;
      organizationId?: string;
      head?: string;
      description?: string;
    }
  >("/api/admin/departments");

  const selectedOrg = useMemo(
    () => organizations?.find((o) => o.id === form.organizationId),
    [organizations, form.organizationId],
  );

  const codePreview = useMemo(() => {
    const code = form.code.trim() || "DEPT-CODE";
    return selectedOrg
      ? `${selectedOrg.name} · #${code}`
      : `Platform department · #${code}`;
  }, [form.code, selectedOrg]);

  const handleNameChange = (name: string) => {
    const autoCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 12);
    setForm((f) => ({
      ...f,
      name,
      code: codeTouched ? f.code : autoCode,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
      organizationId: "",
      head: "",
      description: "",
    });
    setCodeTouched(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.code.trim()) {
      toast({
        title: "Missing required fields",
        description: "Department name and code are required.",
        variant: "destructive",
      });
      return;
    }

    const result = await mutate({
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      ...(form.organizationId ? { organizationId: form.organizationId } : {}),
      head: form.head.trim() || undefined,
      description: form.description.trim() || undefined,
    });

    if (result.success) {
      toast({ title: "Department created" });
      resetForm();
      onCreated?.();
      onClose();
      return;
    }

    toast({
      title: "Could not create department",
      description: result.error ?? "Please try again.",
      variant: "destructive",
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={handleClose}
    >
      <div
        className="relative my-auto w-full min-w-0 max-w-5xl overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-department-title"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 15% 10%, color-mix(in srgb, var(--accent-400) 16%, transparent), transparent 48%), radial-gradient(ellipse at 85% 20%, color-mix(in srgb, #ec4899 12%, transparent), transparent 42%)",
          }}
        />

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-2 pt-10 text-center sm:px-10 sm:pt-12">
          <h2
            id="add-department-title"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Add New Department
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Register a department on the platform. Company and employees are
            optional and can be linked later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 px-6 pb-8 pt-6 sm:px-10">
          <div className="relative mb-5 min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              value={codePreview}
              className="h-11 w-full min-w-0 rounded-xl border-border/80 bg-muted/30 pl-9 text-sm text-muted-foreground"
              aria-label="Department preview"
            />
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-background/40 px-4 sm:px-6">
            <FormFieldRow
              avatar={
                <FieldAvatar className="bg-brand-600/10 text-brand-600">
                  <Building2 className="h-5 w-5" />
                </FieldAvatar>
              }
              title="Company"
              hint="Optional — link to a tenant company later if needed"
            >
              <Select
                value={form.organizationId}
                onValueChange={(organizationId) =>
                  setForm((f) => ({ ...f, organizationId }))
                }
              >
                <SelectTrigger className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card text-sm">
                  <span className="truncate text-muted-foreground">
                    {selectedOrg?.name ?? "No company (optional)"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No company</SelectItem>
                  {(organizations ?? []).map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar className="bg-accent-500/15 text-accent-600">
                  <FolderKanban className="h-5 w-5" />
                </FieldAvatar>
              }
              title="Department name"
              hint="Display name for this department"
              trailing={
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Required
                </span>
              }
            >
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Finance"
                required
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="Department code"
              hint="Unique code across the platform"
              trailing={
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Required
                </span>
              }
            >
              <Input
                value={form.code}
                onChange={(e) => {
                  setCodeTouched(true);
                  setForm((f) => ({
                    ...f,
                    code: e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9-]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  }));
                }}
                placeholder="FIN-001"
                required
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card font-mono text-sm"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="Department head"
              hint="Optional — can be assigned later"
            >
              <Input
                value={form.head}
                onChange={(e) =>
                  setForm((f) => ({ ...f, head: e.target.value }))
                }
                placeholder="Jane Doe"
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="Description"
              hint="Optional notes about this department"
            >
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Handles accounts payable and receivable..."
                rows={3}
                className="min-w-0 resize-none rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-6 h-12 w-full rounded-xl bg-foreground text-base font-medium text-background hover:bg-foreground/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create Department"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
