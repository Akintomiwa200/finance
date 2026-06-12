"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield } from "lucide-react";
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
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_SECURITY_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  sessionTimeout: z.string().min(1),
  require2FA: z.boolean(),
  forcePasswordReset: z.boolean(),
  passwordMinLength: z.string().min(1),
  passwordRequireSpecialChar: z.boolean(),
  passwordRequireNumber: z.boolean(),
  maxLoginAttempts: z.string().min(1),
  lockoutDuration: z.string().min(1),
  rateLimiting: z.boolean(),
  maxRequestsPerMinute: z.string().min(1),
  enableCORS: z.boolean(),
  allowedOrigins: z.string(),
  ipWhitelisting: z.boolean(),
  sessionIdleTimeout: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function SettingsSecurityPageContent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_SECURITY_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/security",
    form,
    defaults: DEFAULT_SECURITY_SETTINGS,
    saveMessage: "Security configuration updated.",
  });

  return (
    <SettingsPageShell
      activeHref="/admin/settings/security"
      title="Security"
      description="Authentication, session policy, and API protection for the platform."
      icon={<Shield className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <SettingsSection title="Session policy" description="How platform team sessions are managed">
            <div className="space-y-4">
              <FormField control={form.control} name="sessionTimeout" render={({ field }) => (
                <FormItem>
                  <FormLabel>Session timeout (minutes)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormDescription>Maximum session duration before re-authentication</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sessionIdleTimeout" render={({ field }) => (
                <FormItem>
                  <FormLabel>Idle timeout (minutes)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="require2FA" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <div>
                    <FormLabel>Require 2FA for super admin</FormLabel>
                    <FormDescription>Enforce two-factor for platform team accounts</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="forcePasswordReset" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <div>
                    <FormLabel>Force password reset on first login</FormLabel>
                    <FormDescription>New users must change their password</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </SettingsSection>

          <SettingsSection title="Password policy" description="Complexity requirements for tenant users">
            <div className="space-y-4">
              <FormField control={form.control} name="passwordMinLength" render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum length</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="passwordRequireSpecialChar" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <FormLabel>Require special characters</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="passwordRequireNumber" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <FormLabel>Require numbers</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </SettingsSection>

          <SettingsSection title="Brute force protection" description="Login attempt limits">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="maxLoginAttempts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Max login attempts</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="lockoutDuration" render={({ field }) => (
                <FormItem>
                  <FormLabel>Lockout duration (minutes)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </SettingsSection>

          <SettingsSection title="API security" description="Rate limits and access controls">
            <div className="space-y-4">
              <FormField control={form.control} name="rateLimiting" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <div>
                    <FormLabel>Rate limiting</FormLabel>
                    <FormDescription>Limit API requests to prevent abuse</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              {form.watch("rateLimiting") && (
                <FormField control={form.control} name="maxRequestsPerMinute" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max requests per minute</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="enableCORS" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <FormLabel>Enable CORS</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              {form.watch("enableCORS") && (
                <FormField control={form.control} name="allowedOrigins" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed origins</FormLabel>
                    <FormControl><Input placeholder="https://app.example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="ipWhitelisting" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <FormLabel>IP whitelisting for admin</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </SettingsSection>

          <SettingsSaveBar isSaving={isSaving} label="Save security settings" />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
