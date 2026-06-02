import { AppShell } from "@/src/components/layout/app-shell";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function EmployeesPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Employees</h1>
          <p className="page-description">Manage employee records and compensation</p>
        </div>

        <Card>
          <div className="p-6 text-center text-muted-foreground">
            <p>Employee management module — implement with data table and CRUD forms.</p>
            <Button className="mt-4">Add Employee</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
