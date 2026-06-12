"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Key } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { DashCard } from "@/src/components/admin/reports-shared";
import {
  FormFieldRow,
  CompanyFormShell,
} from "@/src/components/admin/company-form-shared";
import {
  formatAreaLabel,
  permissionLevelVariant,
} from "@/src/components/admin/roles-shared";
import {
  PLATFORM_ADMIN_AREAS,
  PERMISSION_LEVELS,
} from "@/src/services/platform-permissions.service";
import { defaultPermissions } from "@/src/services/permission-group.service";
import type { PermissionGroup } from "@/src/types/admin";

type Props = {
  mode: "create" | "edit";
  initial?: PermissionGroup;
  onSubmit: (data: {
    name: string;
    description: string;
    permissions: Record<string, string>;
  }) => Promise<boolean>;
  isPending?: boolean;
};

export function RolesGroupForm({ mode, initial, onSubmit, isPending }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState<Record<string, string>>(
    initial?.permissions ?? defaultPermissions(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onSubmit({ name, description, permissions });
    if (ok && mode === "create") {
      router.push("/admin/roles/groups");
    }
  };

  const grantedCount = Object.values(permissions).filter((l) => l !== "none").length;

  return (
    <CompanyFormShell
      title={mode === "create" ? "Create privilege group" : `Edit ${initial?.name ?? "group"}`}
      description="Bundle admin console permissions for platform team members. Tenant company roles are managed separately."
      onClose={() => router.back()}
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-10 sm:px-10">
        <DashCard>
          <FormFieldRow
            avatar={<Shield className="h-5 w-5 text-brand-600" />}
            title="Group name"
            hint="e.g. Customer Success Lead, Billing Ops"
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Privilege group name"
            />
          </FormFieldRow>
          <FormFieldRow
            avatar={<Key className="h-5 w-5 text-violet-500" />}
            title="Description"
            hint="What this group is for on the platform team"
          >
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the responsibilities..."
              rows={3}
            />
          </FormFieldRow>
        </DashCard>

        <DashCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Admin console permissions</p>
              <p className="text-xs text-muted-foreground">
                {grantedCount} of {PLATFORM_ADMIN_AREAS.length} areas enabled
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPermissions(defaultPermissions())}
            >
              Reset all
            </Button>
          </div>
          <div className="divide-y divide-border">
            {PLATFORM_ADMIN_AREAS.map((area) => (
              <div
                key={area}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{formatAreaLabel(area)}</p>
                  <p className="text-xs text-muted-foreground font-mono">{area}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={permissionLevelVariant(permissions[area] ?? "none")}>
                    {permissions[area] ?? "none"}
                  </Badge>
                  <Select
                    value={permissions[area] ?? "none"}
                    onValueChange={(v) =>
                      setPermissions((p) => ({ ...p, [area]: v }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PERMISSION_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <div className="flex gap-3">
          <Button type="submit" loading={isPending}>
            {mode === "create" ? "Create Group" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </CompanyFormShell>
  );
}
