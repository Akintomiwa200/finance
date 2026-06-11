"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { useFetch } from "@/src/hooks/use-fetch";
import { useMutation } from "@/src/hooks/use-mutation";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { api } from "@/src/lib/api";
import type { LiveFixSession } from "@/src/types/admin";
import {
  LiveFixSessionView,
  LiveFixSessionHeader,
} from "@/src/components/support/live-fix-session-view";
import { Loader2 } from "lucide-react";

export default function AdminLiveFixSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: session, isLoading, refetch } = useFetch<LiveFixSession>(
    `/api/admin/support/live-fix/${id}`,
  );
  const joinedRef = useRef(false);
  useAdminRealtime(refetch);

  useEffect(() => {
    if (!session || session.status !== "waiting" || joinedRef.current) return;
    joinedRef.current = true;
    void api
      .post<LiveFixSession>("/api/admin/support/live-fix", {
        action: "start",
        sessionId: id,
      })
      .then(() => refetch());
  }, [session, id, refetch]);

  const { mutate: endSession, isPending: isEnding } = useMutation({
    mutationFn: () => api.post(`/api/admin/support/live-fix/${id}`),
    onSuccess: () => router.push("/admin/support/live-fix"),
  });

  if (isLoading) {
    return (
      <PageLayout title="Connecting..." showBack>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </PageLayout>
    );
  }

  const isConnected = session?.status === "active";

  return (
    <PageLayout
      title="Live Fix Session"
      description={
        session
          ? `${session.organizationName} · Code ${session.sessionCode}`
          : "Session"
      }
      showBack
      breadcrumbs={[
        { label: "Support", href: "/admin/support" },
        { label: "Live Fix", href: "/admin/support/live-fix" },
        { label: "Session" },
      ]}
      actions={<LiveFixSessionHeader session={session ?? undefined} isConnected={isConnected} />}
    >
      <LiveFixSessionView
        session={session ?? undefined}
        mode="admin"
        breadcrumbs={[]}
        onEndSession={() => endSession(undefined)}
        isEnding={isEnding}
      />
    </PageLayout>
  );
}
