import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function NotificationSettingsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Notification Preferences</h1>
          <p className="page-description">Configure email and in-app notification settings</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Payroll Run Completed", desc: "Notify when a payroll run is processed" },
                { label: "Expense Report Submitted", desc: "Notify when an employee submits an expense report" },
                { label: "Approval Request", desc: "Notify when your approval is required" },
                { label: "Invoice Overdue", desc: "Notify when a customer invoice becomes overdue" },
                { label: "Budget Threshold Reached", desc: "Notify when a department budget exceeds 80%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                    <div className="w-9 h-5 bg-muted-foreground rounded-full peer peer-checked:bg-brand-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Configure SMTP server for sending emails. Contact your IT administrator.
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Preferences</Button>
          </div>
        </div>
      </div>
);
}
