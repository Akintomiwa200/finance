"use client";

import { PageLayout } from "@/src/components/layout/page-layout";
import { ProfileEditor } from "@/src/components/profile/profile-editor";

export default function AdminProfilePage() {
  return (
    <PageLayout
      title="Profile"
      description="Manage your super admin account details"
    >
      <ProfileEditor
        workspaceLabel="Super admin workspace"
        accessLabel="Platform administration access"
      />
    </PageLayout>
  );
}
