"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "lucide-react";
import {
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_PRIVACY_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  dataRetentionDays: z.string().min(1),
  auditLogRetentionDays: z.string().min(1),
  autoDeleteInactiveAccounts: z.boolean(),
  inactiveAccountDays: z.string(),
  gdprEnabled: z.boolean(),
  ccpaEnabled: z.boolean(),
  allowDataExport: z.boolean(),
  allowAccountDeletion: z.boolean(),
  encryptionAtRest: z.boolean(),
  encryptBackups: z.boolean(),
  privacyPolicyUrl: z.union([z.string().url(), z.literal("")]),
  dpoEmail: z.union([z.string().email(), z.literal("")]),
});

type FormValues = z.infer<typeof schema>;

export function SettingsPrivacyPageContent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_PRIVACY_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/privacy",
    form,
    defaults: DEFAULT_PRIVACY_SETTINGS,
    saveMessage: "Data and compliance rules updated.",
  });

  return (
    <SettingsPageShell
      activeHref="/admin/settings/privacy"
      title="Data & privacy"
      description="Retention rules, GDPR/CCPA compliance, encryption, and data export policies."
      icon={<Database className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <SettingsSection
            title="Data retention"
            description="How long platform data is kept before purge"
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dataRetentionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General data retention (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="auditLogRetentionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit log retention (days)</FormLabel>
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
                name="autoDeleteInactiveAccounts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel className="text-base">Auto-delete inactive accounts</FormLabel>
                      <FormDescription>Remove dormant tenant users after a period</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("autoDeleteInactiveAccounts") && (
                <FormField
                  control={form.control}
                  name="inactiveAccountDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inactive period (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </SettingsSection>

          <SettingsSection
            title="Compliance"
            description="GDPR, CCPA, and user data rights"
          >
            <div className="space-y-4">
              {(
                [
                  ["gdprEnabled", "GDPR compliance mode", "EU data subject rights and consent"],
                  ["ccpaEnabled", "CCPA compliance mode", "California consumer privacy"],
                  ["allowDataExport", "Allow data export", "Users can request a data export"],
                  ["allowAccountDeletion", "Allow account deletion", "Users can request erasure"],
                ] as const
              ).map(([name, label, desc]) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">{label}</FormLabel>
                        <FormDescription>{desc}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="privacyPolicyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy policy URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourdomain.com/privacy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dpoEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data protection officer email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="dpo@yourdomain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Encryption & backups"
            description="Protect data at rest and in backups"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="encryptionAtRest"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Encryption at rest</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="encryptBackups"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Encrypt automated backups</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Backup notes</Label>
                <Textarea rows={2} placeholder="Optional internal notes on backup policy" />
              </div>
            </div>
          </SettingsSection>

          <SettingsSaveBar isSaving={isSaving} />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
