"use client";

import { Globe } from "lucide-react";
import { GeneralSettingsForm } from "@/src/components/settings/GeneralSettingsForm";
import { SettingsPageShell } from "@/src/components/admin/settings-shared";

export default function GeneralSettingsPage() {
  return (
    <SettingsPageShell
      activeHref="/admin/settings/general"
      title="General settings"
      description="Platform identity, appearance, and regional defaults for the super admin console and tenant-facing surfaces."
      icon={<Globe className="h-10 w-10 text-brand-600" />}
    >
      <GeneralSettingsForm />
    </SettingsPageShell>
  );
}
