import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function SettingsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">System configuration and preferences</p>
        </div>
        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              Manage organization profile, branding, and preferences.
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              Configure tax brackets, rates, and thresholds.
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              Configure email and in-app notifications.
            </div>
          </Card>
        </div>
      </div>
);
}
