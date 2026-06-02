import { AppShell } from "@/src/components/layout/app-shell";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function DepartmentsPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Departments</h1>
          <p className="page-description">Manage departments and cost centers</p>
        </div>
        <Card>
          <div className="p-6 text-center text-muted-foreground">
            <p>Department management module — structure, heads, budgets.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
