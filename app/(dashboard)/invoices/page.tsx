import { AppShell } from "@/src/components/layout/app-shell";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function InvoicesPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Invoices</h1>
          <p className="page-description">Customer invoices (AR) and vendor invoices (AP)</p>
        </div>
        <Card>
          <div className="p-6 text-center text-muted-foreground">
            <p>Invoice management module — create, send, track payments.</p>
            <Button className="mt-4">New Invoice</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
