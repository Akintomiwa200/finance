import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function ApprovalsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Approvals</h1>
          <p className="page-description">Pending and historical approval requests</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <div className="p-6 text-center text-muted-foreground">
            <p>No pending approvals</p>
          </div>
        </Card>
      </div>
);
}
