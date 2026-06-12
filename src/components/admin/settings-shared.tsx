"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Save } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { DashCard } from "@/src/components/admin/reports-shared";
import { AdminSettingsFormSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";

export const SETTINGS_TABS = [
  { label: "Overview", href: "/admin/settings" },
  { label: "General", href: "/admin/settings/general" },
  { label: "Security", href: "/admin/settings/security" },
  { label: "Notifications", href: "/admin/settings/notifications" },
  { label: "Integrations", href: "/admin/settings/integrations" },
  { label: "Tenant Access", href: "/admin/settings/users" },
  { label: "Privacy", href: "/admin/settings/privacy" },
  { label: "API", href: "/admin/settings/api" },
  { label: "Performance", href: "/admin/settings/performance" },
] as const;

function settingsTabClassName(isActive: boolean) {
  return cn(
    "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium no-underline transition-colors snap-start",
    isActive
      ? "bg-foreground text-background shadow-sm"
      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function SettingsTabs({ activeHref }: { activeHref: string }) {
  const router = useRouter();
  const activeTab =
    SETTINGS_TABS.find((tab) => tab.href === activeHref) ?? SETTINGS_TABS[0];

  return (
    <div className="sticky top-0 z-20 -mx-1 bg-background/95 px-1 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
      {/* Mobile: sticky section picker */}
      <div className="md:hidden">
        <div className="rounded-[18px] border border-border bg-card p-2.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Settings
            </p>
            <span className="truncate text-[10px] font-medium text-muted-foreground">
              {SETTINGS_TABS.length} sections
            </span>
          </div>
          <Select value={activeHref} onValueChange={(href) => router.push(href)}>
            <SelectTrigger className="h-12 rounded-xl border-0 bg-muted/50 px-3.5 shadow-none focus:ring-brand-500/30">
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left">
                <span className="truncate text-sm font-semibold text-foreground">
                  {activeTab.label}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-[min(20rem,70vh)] overflow-y-auto">
              {SETTINGS_TABS.map((tab) => (
                <SelectItem key={tab.href} value={tab.href}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop: wrapped pill bar */}
      <div className="hidden rounded-[22px] border border-border bg-card p-2 shadow-sm md:block">
        <div className="flex flex-wrap gap-1.5">
          {SETTINGS_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.href === activeHref ? "page" : undefined}
              className={settingsTabClassName(tab.href === activeHref)}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsPageShell({
  activeHref,
  title,
  description,
  icon,
  action,
  children,
  isLoading,
}: {
  activeHref: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="space-y-5">
      <SettingsTabs activeHref={activeHref} />
      <DashCard className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-5 sm:w-[120px]">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </DashCard>
      {isLoading ? <AdminSettingsFormSkeleton /> : children}
    </div>
  );
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DashCard className={className}>
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </DashCard>
  );
}

export function SettingsSaveBar({
  isSaving,
  label = "Save settings",
}: {
  isSaving: boolean;
  label?: string;
}) {
  return (
    <div className="flex justify-end">
      <Button type="submit" variant="primary" disabled={isSaving} className="min-w-[140px]">
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSaving ? "Saving…" : label}
      </Button>
    </div>
  );
}
