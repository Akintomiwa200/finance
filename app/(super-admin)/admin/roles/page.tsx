"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { Shield, Layers, Key, UserCheck } from "lucide-react";

export default function RolesPage() {
  return (
    <SectionPage
      title="Roles & Permissions"
      description="Manage privilege groups — only super admin can create groups; companies assign staff to groups"
      links={[
        { label: "Privilege Groups", href: "/admin/roles/groups", description: "Create and manage permission groups for tenant staff", icon: Layers },
        { label: "Permission Matrix", href: "/admin/roles/permissions", description: "View module-level permissions across all groups", icon: Key },
        { label: "Group Assignments", href: "/admin/roles/assignments", description: "See which employees are assigned to which groups", icon: UserCheck },
        { label: "System Roles", href: "/admin/roles/system", description: "Built-in role definitions and defaults", icon: Shield },
      ]}
    />
  );
}
