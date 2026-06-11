"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
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
import { useToast } from "@/src/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";

const schema = z.object({
  dataRetentionDays: z.string().min(1),
  auditLogRetentionDays: z.string().min(1),
  autoDeleteInactiveAccounts: z.boolean(),
  inactiveAccountDays: z.string().optional(),
  gdprEnabled: z.boolean(),
  ccpaEnabled: z.boolean(),
  allowDataExport: z.boolean(),
  allowAccountDeletion: z.boolean(),
  encryptionAtRest: z.boolean(),
  encryptBackups: z.boolean(),
  privacyPolicyUrl: z.string().url().optional().or(z.literal("")),
  dpoEmail: z.string().email().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function PrivacySettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dataRetentionDays: "365",
      auditLogRetentionDays: "730",
      autoDeleteInactiveAccounts: false,
      inactiveAccountDays: "180",
      gdprEnabled: true,
      ccpaEnabled: false,
      allowDataExport: true,
      allowAccountDeletion: true,
      encryptionAtRest: true,
      encryptBackups: true,
      privacyPolicyUrl: "",
      dpoEmail: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Privacy settings saved", description: "Data and compliance rules updated." });
      console.log(data);
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout
      title="Data & Privacy"
      description="Retention rules, compliance, and encryption settings"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings" },
        { label: "Data & Privacy" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
              <CardDescription>How long platform data is kept before purge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
              <CardDescription>GDPR, CCPA, and user data rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Encryption & Backups</CardTitle>
              <CardDescription>Protect data at rest and in backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
