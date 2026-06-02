import { AppShell } from "@/src/components/layout/app-shell";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function PayrollPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Payroll</h1>
          <p className="page-description">Manage payroll runs, compute salaries, and process payments</p>
        </div>
        <Card>
          <div className="p-6 text-center text-muted-foreground">
            <p>Payroll management module — runs, items, payslips.</p>
            <Button className="mt-4">Create Payroll Run</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
