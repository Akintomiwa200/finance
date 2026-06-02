import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function BudgetPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Budget</h1>
          <p className="page-description">Plan and monitor departmental budgets</p>
        </div>
        <Card>
          <div className="p-6 text-center text-muted-foreground">
            <p>Budget management module — fiscal year planning, line items, variance tracking.</p>
            <Button className="mt-4">Create Budget</Button>
          </div>
        </Card>
      </div>
);
}
