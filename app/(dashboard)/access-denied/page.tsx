"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { moduleLabel } from "@/src/lib/tenant-module-catalog";
import type { ModuleId } from "@/src/lib/permissions";
import { useTenantAccess } from "@/src/hooks/use-tenant-access";

export default function AccessDeniedPage() {
  const searchParams = useSearchParams();
  const moduleParam = searchParams.get("module") as ModuleId | null;
  const { planName } = useTenantAccess();

  const moduleName = moduleParam ? moduleLabel(moduleParam) : "this area";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldOff className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Access denied</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">{moduleName}</span> is not included in your
        company&apos;s subscription
        {planName ? (
          <>
            {" "}
            (<span className="font-medium text-foreground">{planName}</span> plan)
          </>
        ) : null}
        . Contact your administrator or upgrade your plan to unlock this module.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard" className="no-underline">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/support" className="no-underline">
          <Button variant="primary">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
