import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";

export default function SuperAdminSettingsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title text-white">Platform Settings</h1>
          <p className="page-description">Configure the Finance as a Service platform</p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card className="!bg-zinc-900 !border-zinc-800">
            <CardHeader>
              <CardTitle className="!text-white">General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-400">
              <p>Platform name, branding, and default configuration for new organizations.</p>
            </CardContent>
          </Card>

          <Card className="!bg-zinc-900 !border-zinc-800">
            <CardHeader>
              <CardTitle className="!text-white">Default Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-400">
              <p>Set default tax brackets and rates applied to new organizations.</p>
            </CardContent>
          </Card>

          <Card className="!bg-zinc-900 !border-zinc-800">
            <CardHeader>
              <CardTitle className="!text-white">Email & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-400">
              <p>Configure SMTP, email templates, and notification preferences.</p>
            </CardContent>
          </Card>
        </div>
      </div>
);
}
