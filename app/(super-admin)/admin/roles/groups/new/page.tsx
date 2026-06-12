"use client";

import { useRouter } from "next/navigation";
import { RolesGroupForm } from "@/src/components/admin/roles-group-form";
import { useCreate } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import type { PermissionGroup } from "@/src/types/admin";

export default function NewGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useCreate<
    PermissionGroup,
    { name: string; description: string; permissions: Record<string, string> }
  >("/api/admin/groups");

  return (
    <RolesGroupForm
      mode="create"
      isPending={isPending}
      onSubmit={async (data) => {
        const result = await mutate(data);
        if (result.success && result.data?.id) {
          toast({ title: "Group created" });
          router.push(`/admin/roles/groups/${result.data.id}`);
          return true;
        }
        toast({
          title: "Could not create group",
          description: result.error,
          variant: "destructive",
        });
        return false;
      }}
    />
  );
}
