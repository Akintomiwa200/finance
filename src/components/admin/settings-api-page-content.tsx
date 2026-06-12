"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExternalLink, Key } from "lucide-react";
import {
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_API_DEVELOPER_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  publicApiEnabled: z.boolean(),
  apiVersion: z.enum(["v1", "v2"]),
  docsUrl: z.union([z.string().url(), z.literal("")]),
  requireSignedRequests: z.boolean(),
  globalRateLimit: z.string().min(1),
  burstLimit: z.string().min(1),
  ipAllowlist: z.string(),
  webhookSigningSecret: z.string(),
  corsOrigins: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function SettingsApiPageContent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_API_DEVELOPER_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/api-config",
    form,
    defaults: DEFAULT_API_DEVELOPER_SETTINGS,
    saveMessage: "Developer platform configuration updated.",
  });

  return (
    <SettingsPageShell
      activeHref="/admin/settings/api"
      title="API & developer"
      description="Public API access, rate limits, CORS, and webhook signing for platform developers."
      icon={<Key className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <SettingsSection
            title="Platform API"
            description="Public API access and documentation"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="publicApiEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Enable public API</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="apiVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default API version</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="v1">v1 (stable)</SelectItem>
                          <SelectItem value="v2">v2 (beta)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="docsUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documentation URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://docs.example.com/api" {...field} />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Linked from developer portal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="requireSignedRequests"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel className="text-base">Require signed requests</FormLabel>
                      <FormDescription>HMAC signature on all API calls</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Rate limits & quotas"
            description="Global throttling for API consumers"
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="globalRateLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requests per minute (global)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="burstLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Burst limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="ipAllowlist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP allowlist (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="203.0.113.0/24, 198.51.100.42" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated CIDR blocks</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Webhooks & CORS"
            description="Outbound events and cross-origin access"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="webhookSigningSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook signing secret</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="whsec_..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="corsOrigins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed CORS origins</FormLabel>
                    <FormControl>
                      <Input placeholder="https://app.example.com" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated origins for browser API access</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSaveBar isSaving={isSaving} />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
