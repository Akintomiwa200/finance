"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { SettingsNavGroup, SettingsNavLink } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";

interface SettingsHubProps {
  title: string;
  description: string;
  links: SettingsNavLink[];
  group?: SettingsNavGroup;
  summary?: { label: string; value: string }[];
}

export function SettingsHub({
  title,
  description,
  links,
  group,
  summary,
}: SettingsHubProps) {
  const updatedAt = useTenantSettingsStore((s) => s.settings?.updatedAt);
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const fetchSettings = useTenantSettingsStore((s) => s.fetchSettings);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
          {updatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Last synced {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSettings(true)}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {summary && summary.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-semibold mt-1 truncate">{item.value || "—"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {group && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Synced across settings</CardTitle>
            <CardDescription>
              Changes on any {group.title.toLowerCase()} page save to your organization and refresh on other devices within seconds.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block no-underline group">
            <Card className="h-full transition-all hover:border-brand-300 hover:shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <CardDescription className="mt-1">{link.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="secondary" className="text-xs">
                  Live sync enabled
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
