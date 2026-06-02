import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function OrganizationSettingsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Organization Settings</h1>
          <p className="page-description">Manage your organization profile and branding</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Organization Name" defaultValue="Acme Corp" />
              <Input label="Email" defaultValue="finance@acmecorp.com" />
              <Input label="Phone" defaultValue="+234 800 000 0000" />
              <Input label="Address" defaultValue="123 Business District, Lagos" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Organization Logo URL" placeholder="https://..." />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
);
}
