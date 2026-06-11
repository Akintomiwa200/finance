"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { useCreate } from "@/src/hooks/use-mutation";
import { MODULE_PERMISSIONS, PERMISSION_LEVELS } from "@/src/services/permission-group.service";
import type { PermissionGroup } from "@/src/types/admin";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Record<string, string>>({});
  const { mutate, isPending } = useCreate<
    PermissionGroup,
    { name: string; description: string; permissions: Record<string, string> }
  >("/api/admin/groups");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await mutate({ name, description, permissions });
    if (result.success && result.data?.id) router.push(`/admin/roles/groups/${result.data.id}`);
  };

  return (
    <PageLayout title="Create Privilege Group" showBack breadcrumbs={[{ label: "Roles", href: "/admin/roles/groups" }, { label: "Groups", href: "/admin/roles/groups" }, { label: "New" }]}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Group Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Finance Manager" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this group can do..." /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Module Permissions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {MODULE_PERMISSIONS.map((mod) => (
              <div key={mod} className="flex items-center justify-between gap-4">
                <span className="text-sm capitalize">{mod.replace(/-/g, " ")}</span>
                <Select value={permissions[mod] ?? "none"} onValueChange={(v) => setPermissions((p) => ({ ...p, [mod]: v }))}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERMISSION_LEVELS.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button type="submit" loading={isPending}>Create Group</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </PageLayout>
  );
}
