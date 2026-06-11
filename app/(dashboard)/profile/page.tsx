"use client";

import { ProfileEditor } from "@/src/components/profile/profile-editor";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage the current user profile and access details.
        </p>
      </div>
      <ProfileEditor
        workspaceLabel="Company workspace"
        accessLabel="Role-based permissions"
      />
    </div>
  );
}
