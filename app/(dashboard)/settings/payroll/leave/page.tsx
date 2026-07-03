"use client";

import { useEffect, useState } from "react";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

export default function settings_payroll_leave() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Leave Policies</h1>
        <p className="text-muted-foreground">Define employee leave policies</p>
      </div>
    </div>
  );
}
