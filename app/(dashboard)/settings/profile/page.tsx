"use client";

import { ProfileEditor } from "@/src/components/profile/profile-editor";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and preferences
        </p>
      </div>
      <ProfileEditor
        workspaceLabel="Company workspace"
        accessLabel="Role-based permissions"
      />
    </div>
  );
}
