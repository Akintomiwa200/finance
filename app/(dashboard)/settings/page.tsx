import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function SettingsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">System configuration and preferences</p>
        </div>
        <div className="grid gap-6 max-w-2xl">
          <Link href="/settings/general" className="block no-underline">
            <Card className="hover:border-brand-300 hover:shadow-sm transition-all">
              <CardHeader>
                <CardTitle>General</CardTitle>
              </CardHeader>
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                Manage general application settings.
              </div>
            </Card>
          </Link>
          <Link href="/settings/profile" className="block no-underline">
            <Card className="hover:border-brand-300 hover:shadow-sm transition-all">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                Manage your profile information.
              </div>
            </Card>
          </Link>
          <Link href="/settings/appearance" className="block no-underline">
            <Card className="hover:border-brand-300 hover:shadow-sm transition-all">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <div className="px-6 pb-6 text-sm text-muted-foreground">
                Customize the look and feel of the application.
              </div>
            </Card>
          </Link>
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
