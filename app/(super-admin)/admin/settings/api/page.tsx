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
import { useToast } from "@/src/components/ui/use-toast";
import { Loader2, Save, ExternalLink } from "lucide-react";

const schema = z.object({
  publicApiEnabled: z.boolean(),
  apiVersion: z.enum(["v1", "v2"]),
  docsUrl: z.string().url().optional().or(z.literal("")),
  requireSignedRequests: z.boolean(),
  globalRateLimit: z.string().min(1),
  burstLimit: z.string().min(1),
  ipAllowlist: z.string().optional(),
  webhookSigningSecret: z.string().optional(),
  corsOrigins: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ApiDeveloperSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      publicApiEnabled: true,
      apiVersion: "v1",
      docsUrl: "https://docs.faas.dev/api",
      requireSignedRequests: true,
      globalRateLimit: "1000",
      burstLimit: "50",
      ipAllowlist: "",
      webhookSigningSecret: "",
      corsOrigins: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "API settings saved", description: "Developer platform configuration updated." });
      console.log(data);
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout
      title="API & Developer"
      description="Developer keys, quotas, and platform API tooling"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings" },
        { label: "API & Developer" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform API</CardTitle>
              <CardDescription>Public API access and documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limits & Quotas</CardTitle>
              <CardDescription>Global throttling for API consumers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks & CORS</CardTitle>
              <CardDescription>Outbound events and cross-origin access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
