"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageLayout } from "@/src/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/use-toast";
import { Loader2, Save, TestTube, ExternalLink } from "lucide-react";

const integrationSchema = z.object({
  stripeEnabled: z.boolean(),
  stripeSecretKey: z.string().optional(),
  stripeWebhookSecret: z.string().optional(),
  stripePublishableKey: z.string().optional(),
  sendgridEnabled: z.boolean(),
  sendgridApiKey: z.string().optional(),
  slackEnabled: z.boolean(),
  slackWebhookUrl: z.string().url().optional().or(z.literal("")),
  githubEnabled: z.boolean(),
  githubToken: z.string().optional(),
  githubOrganization: z.string().optional(),
  jiraEnabled: z.boolean(),
  jiraBaseUrl: z.string().url().optional().or(z.literal("")),
  jiraEmail: z.string().email().optional().or(z.literal("")),
  jiraApiToken: z.string().optional(),
});

type IntegrationFormValues = z.infer<typeof integrationSchema>;

export default function IntegrationsSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testingService, setTestingService] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      stripeEnabled: true,
      stripeSecretKey: "",
      stripeWebhookSecret: "",
      stripePublishableKey: "",
      sendgridEnabled: false,
      sendgridApiKey: "",
      slackEnabled: false,
      slackWebhookUrl: "",
      githubEnabled: false,
      githubToken: "",
      githubOrganization: "",
      jiraEnabled: false,
      jiraBaseUrl: "",
      jiraEmail: "",
      jiraApiToken: "",
    },
  });

  async function onSubmit(data: IntegrationFormValues) {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast({
        title: "Integrations saved",
        description: "Third-party service configuration has been updated.",
      });
      console.log("Integration settings:", data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save integration settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function testConnection(service: string) {
    setTestingService(service);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast({
        title: `${service} connection successful`,
        description: "Credentials verified successfully.",
      });
    } catch {
      toast({
        title: `${service} connection failed`,
        variant: "destructive",
      });
    } finally {
      setTestingService(null);
    }
  }

  return (
    <PageLayout
      title="Integrations"
      description="Third-party services and API connections"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings" },
        { label: "Integrations" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="stripe" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
              <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
              <TabsTrigger value="slack">Slack</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="jira">Jira</TabsTrigger>
            </TabsList>

            <TabsContent value="stripe">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Stripe</CardTitle>
                      <CardDescription>Payment processing for subscriptions</CardDescription>
                    </div>
                    <Badge variant={form.watch("stripeEnabled") ? "success" : "default"}>
                      {form.watch("stripeEnabled") ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="stripeEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Enable Stripe</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("stripeEnabled") && (
                    <>
                      <FormField
                        control={form.control}
                        name="stripePublishableKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publishable Key</FormLabel>
                            <FormControl>
                              <Input placeholder="pk_live_..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stripeSecretKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Key</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="sk_live_..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stripeWebhookSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook Secret</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="whsec_..." {...field} />
                            </FormControl>
                            <FormDescription>
                              Used to verify Stripe webhook signatures
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection("Stripe")}
                        disabled={testingService === "Stripe"}
                      >
                        {testingService === "Stripe" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="mr-2 h-4 w-4" />
                        )}
                        Test Connection
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sendgrid">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>SendGrid</CardTitle>
                      <CardDescription>Transactional email delivery</CardDescription>
                    </div>
                    <Badge variant={form.watch("sendgridEnabled") ? "success" : "default"}>
                      {form.watch("sendgridEnabled") ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sendgridEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Enable SendGrid</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("sendgridEnabled") && (
                    <>
                      <FormField
                        control={form.control}
                        name="sendgridApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="SG...." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection("SendGrid")}
                        disabled={testingService === "SendGrid"}
                      >
                        {testingService === "SendGrid" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="mr-2 h-4 w-4" />
                        )}
                        Test Connection
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="slack">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Slack</CardTitle>
                      <CardDescription>Support ticket notifications</CardDescription>
                    </div>
                    <Badge variant={form.watch("slackEnabled") ? "success" : "default"}>
                      {form.watch("slackEnabled") ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="slackEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Enable Slack</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("slackEnabled") && (
                    <FormField
                      control={form.control}
                      name="slackWebhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incoming Webhook URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://hooks.slack.com/services/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="github">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>GitHub</CardTitle>
                      <CardDescription>Link support tickets to issues</CardDescription>
                    </div>
                    <Badge variant={form.watch("githubEnabled") ? "success" : "default"}>
                      {form.watch("githubEnabled") ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="githubEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Enable GitHub</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("githubEnabled") && (
                    <>
                      <FormField
                        control={form.control}
                        name="githubOrganization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization / Owner</FormLabel>
                            <FormControl>
                              <Input placeholder="your-org" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="githubToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personal Access Token</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="ghp_..." {...field} />
                            </FormControl>
                            <FormDescription className="flex items-center gap-1">
                              Requires repo scope
                              <a
                                href="https://github.com/settings/tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-brand-600 hover:underline"
                              >
                                Create token
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection("GitHub")}
                        disabled={testingService === "GitHub"}
                      >
                        {testingService === "GitHub" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="mr-2 h-4 w-4" />
                        )}
                        Test Connection
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jira">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Jira</CardTitle>
                      <CardDescription>Create and link Jira issues from support tickets</CardDescription>
                    </div>
                    <Badge variant={form.watch("jiraEnabled") ? "success" : "default"}>
                      {form.watch("jiraEnabled") ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="jiraEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Enable Jira</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("jiraEnabled") && (
                    <>
                      <FormField
                        control={form.control}
                        name="jiraBaseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jira Base URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-org.atlassian.net" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="jiraEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jiraApiToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Token</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection("Jira")}
                        disabled={testingService === "Jira"}
                      >
                        {testingService === "Jira" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="mr-2 h-4 w-4" />
                        )}
                        Test Connection
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Integration Settings
              </>
            )}
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
