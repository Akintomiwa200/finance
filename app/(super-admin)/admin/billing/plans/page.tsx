"use client";

import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { formatCurrency } from "@/src/lib/utils";

const plans = [
  { name: "Startup", price: 25000, users: 10, modules: 5, popular: false },
  { name: "Business", price: 75000, users: 50, modules: 12, popular: true },
  { name: "Enterprise", price: 200000, users: -1, modules: -1, popular: false },
];

export default function BillingPlansPage() {
  return (
    <PageLayout
      title="Pricing Plans"
      description="Platform subscription tiers available to tenant companies"
      showBack
      breadcrumbs={[
        { label: "Billing", href: "/admin/billing" },
        { label: "Plans" },
      ]}
      actions={<Button variant="primary">Create Plan</Button>}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "border-brand-600 ring-1 ring-brand-600/20" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge variant="info">Popular</Badge>}
              </div>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">{formatCurrency(plan.price)}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{plan.users === -1 ? "Unlimited users" : `Up to ${plan.users} users`}</p>
              <p>{plan.modules === -1 ? "All modules" : `${plan.modules} modules`}</p>
              <Button variant="outline" className="w-full mt-2">Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
