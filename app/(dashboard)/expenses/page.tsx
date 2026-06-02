import { AppShell } from "@/src/components/layout/app-shell";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function ExpensesPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Expenses</h1>
          <p className="page-description">Track and approve employee expense reports</p>
        </div>
        <Card>
          <div className="p-6 text-center text-muted-foreground">
            <p>Expense management module — reports, approvals, reimbursements.</p>
            <Button className="mt-4">New Expense Report</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
