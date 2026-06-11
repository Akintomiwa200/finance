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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useToast } from "@/src/components/ui/use-toast";
import { Loader2, Save, Send, Mail, Webhook, Bell } from "lucide-react";

const notificationSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.string().min(1, "SMTP port is required"),
  smtpUser: z.string().email("Must be a valid email"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  fromAddress: z.string().email("Must be a valid email"),
  fromName: z.string().min(1, "From name is required"),
  encryption: z.enum(["tls", "ssl", "none"]),
  newCompanyAlerts: z.boolean(),
  supportTicketAlerts: z.boolean(),
  billingFailureAlerts: z.boolean(),
  userSignupAlerts: z.boolean(),
  systemDigestEnabled: z.boolean(),
  weeklyReportEnabled: z.boolean(),
  webhookEnabled: z.boolean(),
  webhookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  webhookSecret: z.string().optional(),
  testEmailAddress: z.string().email("Must be a valid email").optional().or(z.literal("")),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function NotificationsSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      smtpHost: "smtp.sendgrid.net",
      smtpPort: "587",
      smtpUser: "apikey",
      smtpPassword: "",
      fromAddress: "noreply@faas.dev",
      fromName: "FaaS Platform",
      encryption: "tls",
      newCompanyAlerts: true,
      supportTicketAlerts: true,
      billingFailureAlerts: true,
      userSignupAlerts: false,
      systemDigestEnabled: true,
      weeklyReportEnabled: false,
      webhookEnabled: false,
      webhookUrl: "",
      webhookSecret: "",
      testEmailAddress: "",
    },
  });

  async function onSubmit(data: NotificationFormValues) {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast({
        title: "Notification settings saved",
        description: "Email and webhook configuration has been updated.",
      });
      console.log("Notification settings:", data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTestEmail() {
    const address = form.getValues("testEmailAddress");
    if (!address) {
      toast({
        title: "Enter a test email address",
        variant: "destructive",
      });
      return;
    }
    setIsTesting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Test email sent",
        description: `A test message was sent to ${address}.`,
      });
    } catch {
      toast({
        title: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <PageLayout
      title="Notifications"
      description="Email alerts and webhook configuration"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings" },
        { label: "Notifications" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="email" className="space-y-6">
            <TabsList>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <Bell className="mr-2 h-4 w-4" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="webhooks">
                <Webhook className="mr-2 h-4 w-4" />
                Webhooks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SMTP Configuration</CardTitle>
                  <CardDescription>
                    Configure outbound email delivery for platform notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="smtpUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="encryption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Encryption</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select encryption" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fromAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send Test Email</CardTitle>
                  <CardDescription>Verify your SMTP settings before saving</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <FormField
                    control={form.control}
                    name="testEmailAddress"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Test recipient</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" onClick={handleTestEmail} disabled={isTesting}>
                    {isTesting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Test
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Alerts</CardTitle>
                  <CardDescription>Choose which events trigger admin notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(
                    [
                      ["newCompanyAlerts", "New company signups", "When a tenant registers on the platform"],
                      ["supportTicketAlerts", "Support ticket updates", "New tickets and status changes"],
                      ["billingFailureAlerts", "Billing failures", "Failed payments and subscription issues"],
                      ["userSignupAlerts", "User signups", "New users within tenant organizations"],
                      ["systemDigestEnabled", "Daily system digest", "Summary of platform activity each morning"],
                      ["weeklyReportEnabled", "Weekly report", "Analytics and usage report every Monday"],
                    ] as const
                  ).map(([name, title, description]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">{title}</FormLabel>
                            <FormDescription>{description}</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Outbound Webhooks</CardTitle>
                  <CardDescription>
                    Push platform events to external systems in real time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="webhookEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable webhooks</FormLabel>
                          <FormDescription>Send JSON payloads on platform events</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("webhookEnabled") && (
                    <>
                      <FormField
                        control={form.control}
                        name="webhookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://hooks.example.com/events" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="webhookSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Signing Secret</FormLabel>
                            <FormControl>
                              <Textarea rows={2} placeholder="Optional HMAC signing secret" {...field} />
                            </FormControl>
                            <FormDescription>
                              Used to verify webhook payloads on your server
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                Save Notification Settings
              </>
            )}
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
