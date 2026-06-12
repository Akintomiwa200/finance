"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useSupportRealtime } from "@/src/hooks/use-support-realtime";
import { PageLayout } from "@/src/components/layout/page-layout";
import { useFetch } from "@/src/hooks/use-fetch";
import type { LiveFixSession } from "@/src/types/admin";
import {
  LiveFixSessionView,
  LiveFixSessionHeader,
} from "@/src/components/support/live-fix-session-view";
import { LiveFixSessionSkeleton } from "@/src/components/layout/dashboard-skeletons";

export default function CustomerLiveFixSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: session, isLoading, refetch } = useFetch<LiveFixSession>(
    `/api/support/live-fix/${id}`,
  );
  useSupportRealtime(refetch);

  if (isLoading) {
    return (
      <PageLayout title="Live Fix Session" showBack>
        <LiveFixSessionSkeleton />
      </PageLayout>
    );
  }

  const isConnected = session?.status === "active";

  return (
    <PageLayout
      title="Live Fix Session"
      description={
        session
          ? `Session code ${session.sessionCode}`
          : "Remote assistance session"
      }
      showBack
      breadcrumbs={[
        { label: "Support", href: "/support" },
        { label: "Live Fix", href: "/support/live" },
        { label: "Session" },
      ]}
      actions={<LiveFixSessionHeader session={session ?? undefined} isConnected={isConnected} />}
    >
      <LiveFixSessionView
        session={session ?? undefined}
        mode="customer"
        breadcrumbs={[]}
        onEndSession={() => router.push("/support/live")}
      />
    </PageLayout>
  );
}
