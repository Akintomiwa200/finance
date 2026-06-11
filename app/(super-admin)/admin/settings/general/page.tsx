"use client";

import { PageLayout } from "@/src/components/layout/page-layout";
import { GeneralSettingsForm } from "@/src/components/settings/GeneralSettingsForm";

export default function GeneralSettingsPage() {
  return (
    <PageLayout
      title="General Settings"
      description="Platform-wide configuration for FaaS Platform"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings/general" },
        { label: "General" },
      ]}
    >
      <GeneralSettingsForm />
    </PageLayout>
  );
}
