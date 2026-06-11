"use client";

import { PageLayout } from "@/src/components/layout/page-layout";
import { BillingPlansPageContent } from "@/src/components/admin/billing-plans-page-content";

export default function BillingPlansPage() {
  return (
    <PageLayout
      title="Tenant Pricing Plans"
      description="Subscription tiers you offer to companies using your software"
      showBack
      breadcrumbs={[
        { label: "Billing", href: "/admin/billing/plans" },
        { label: "Plans" },
      ]}
    >
      <BillingPlansPageContent />
    </PageLayout>
  );
}
