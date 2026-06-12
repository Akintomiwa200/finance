"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExternalLink, Loader2, Plug, TestTube } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";
import {
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_INTEGRATION_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  stripeEnabled: z.boolean(),
  stripeSecretKey: z.string(),
  stripeWebhookSecret: z.string(),
  stripePublishableKey: z.string(),
  sendgridEnabled: z.boolean(),
  sendgridApiKey: z.string(),
  slackEnabled: z.boolean(),
  slackWebhookUrl: z.union([z.string().url(), z.literal("")]),
  githubEnabled: z.boolean(),
  githubToken: z.string(),
  githubOrganization: z.string(),
  jiraEnabled: z.boolean(),
  jiraBaseUrl: z.union([z.string().url(), z.literal("")]),
  jiraEmail: z.union([z.string().email(), z.literal("")]),
  jiraApiToken: z.string(),
});

type FormValues = z.infer<typeof schema>;

function IntegrationHeader({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Badge variant={enabled ? "success" : "default"}>{enabled ? "Enabled" : "Disabled"}</Badge>
    </div>
  );
}

export function SettingsIntegrationsPageContent() {
  const [testingService, setTestingService] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_INTEGRATION_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/integrations",
    form,
    defaults: DEFAULT_INTEGRATION_SETTINGS,
    saveMessage: "Integration settings updated.",
  });

  async function testConnection(service: string) {
    setTestingService(service);
    try {
      const result = await api.post("/api/admin/settings/integrations", { service });
      if (!result.success) throw new Error(result.error);
      toast({ title: `${service} connection successful` });
    } catch {
      toast({ title: `${service} connection failed`, variant: "destructive" });
    } finally {
      setTestingService(null);
    }
  }

  return (
    <SettingsPageShell
      activeHref="/admin/settings/integrations"
      title="Integrations"
      description="Third-party services for billing, email, support, and developer workflows."
      icon={<Plug className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <Tabs defaultValue="stripe" className="space-y-5">
            <TabsList className="flex h-auto flex-wrap gap-1">
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
              <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
              <TabsTrigger value="slack">Slack</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="jira">Jira</TabsTrigger>
            </TabsList>

            <TabsContent value="stripe">
              <SettingsSection title="Stripe" description="Payment processing for subscriptions">
                <IntegrationHeader title="Stripe" description="Subscriptions and billing" enabled={form.watch("stripeEnabled")} />
                <div className="space-y-4">
                  <FormField control={form.control} name="stripeEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Enable Stripe</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("stripeEnabled") && (
                    <>
                      <FormField control={form.control} name="stripePublishableKey" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publishable key</FormLabel>
                          <FormControl><Input placeholder="pk_live_..." {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="stripeSecretKey" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret key</FormLabel>
                          <FormControl><Input type="password" placeholder="sk_live_..." {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="stripeWebhookSecret" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook secret</FormLabel>
                          <FormControl><Input type="password" placeholder="whsec_..." {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <Button type="button" variant="outline" size="sm" onClick={() => testConnection("Stripe")} disabled={testingService === "Stripe"}>
                        {testingService === "Stripe" ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                        Test connection
                      </Button>
                    </>
                  )}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="sendgrid">
              <SettingsSection title="SendGrid" description="Transactional email delivery">
                <IntegrationHeader title="SendGrid" description="Email delivery" enabled={form.watch("sendgridEnabled")} />
                <div className="space-y-4">
                  <FormField control={form.control} name="sendgridEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Enable SendGrid</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("sendgridEnabled") && (
                    <>
                      <FormField control={form.control} name="sendgridApiKey" render={({ field }) => (
                        <FormItem>
                          <FormLabel>API key</FormLabel>
                          <FormControl><Input type="password" placeholder="SG...." {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <Button type="button" variant="outline" size="sm" onClick={() => testConnection("SendGrid")} disabled={testingService === "SendGrid"}>
                        {testingService === "SendGrid" ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                        Test connection
                      </Button>
                    </>
                  )}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="slack">
              <SettingsSection title="Slack" description="Support ticket notifications">
                <IntegrationHeader title="Slack" description="Incoming webhooks" enabled={form.watch("slackEnabled")} />
                <div className="space-y-4">
                  <FormField control={form.control} name="slackEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Enable Slack</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("slackEnabled") && (
                    <FormField control={form.control} name="slackWebhookUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incoming webhook URL</FormLabel>
                        <FormControl><Input placeholder="https://hooks.slack.com/..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="github">
              <SettingsSection title="GitHub" description="Link support tickets to issues">
                <IntegrationHeader title="GitHub" description="Issue linking" enabled={form.watch("githubEnabled")} />
                <div className="space-y-4">
                  <FormField control={form.control} name="githubEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Enable GitHub</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("githubEnabled") && (
                    <>
                      <FormField control={form.control} name="githubOrganization" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization / owner</FormLabel>
                          <FormControl><Input placeholder="your-org" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="githubToken" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal access token</FormLabel>
                          <FormControl><Input type="password" placeholder="ghp_..." {...field} /></FormControl>
                          <FormDescription className="flex items-center gap-1">
                            Requires repo scope
                            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-600 hover:underline">
                              Create token <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </FormDescription>
                        </FormItem>
                      )} />
                      <Button type="button" variant="outline" size="sm" onClick={() => testConnection("GitHub")} disabled={testingService === "GitHub"}>
                        {testingService === "GitHub" ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                        Test connection
                      </Button>
                    </>
                  )}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="jira">
              <SettingsSection title="Jira" description="Create and link Jira issues from support">
                <IntegrationHeader title="Jira" description="Issue sync" enabled={form.watch("jiraEnabled")} />
                <div className="space-y-4">
                  <FormField control={form.control} name="jiraEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Enable Jira</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("jiraEnabled") && (
                    <>
                      <FormField control={form.control} name="jiraBaseUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jira base URL</FormLabel>
                          <FormControl><Input placeholder="https://your-org.atlassian.net" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="jiraEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account email</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="jiraApiToken" render={({ field }) => (
                          <FormItem>
                            <FormLabel>API token</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => testConnection("Jira")} disabled={testingService === "Jira"}>
                        {testingService === "Jira" ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                        Test connection
                      </Button>
                    </>
                  )}
                </div>
              </SettingsSection>
            </TabsContent>
          </Tabs>

          <SettingsSaveBar isSaving={isSaving} label="Save integration settings" />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
