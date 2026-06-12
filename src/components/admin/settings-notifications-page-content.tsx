"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Bell, Loader2, Mail, Send, Webhook } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";
import {
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  smtpHost: z.string().min(1),
  smtpPort: z.string().min(1),
  smtpUser: z.string().email(),
  smtpPassword: z.string(),
  fromAddress: z.string().email(),
  fromName: z.string().min(1),
  encryption: z.enum(["tls", "ssl", "none"]),
  newCompanyAlerts: z.boolean(),
  supportTicketAlerts: z.boolean(),
  billingFailureAlerts: z.boolean(),
  userSignupAlerts: z.boolean(),
  systemDigestEnabled: z.boolean(),
  weeklyReportEnabled: z.boolean(),
  webhookEnabled: z.boolean(),
  webhookUrl: z.union([z.string().url(), z.literal("")]),
  webhookSecret: z.string(),
});

type FormValues = z.infer<typeof schema>;

const ALERT_FIELDS = [
  ["newCompanyAlerts", "New company signups", "When a tenant registers"],
  ["supportTicketAlerts", "Support ticket updates", "New tickets and status changes"],
  ["billingFailureAlerts", "Billing failures", "Failed payments and subscription issues"],
  ["userSignupAlerts", "User signups", "New users within tenant organizations"],
  ["systemDigestEnabled", "Daily system digest", "Summary each morning"],
  ["weeklyReportEnabled", "Weekly report", "Analytics every Monday"],
] as const;

function FieldDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

export function SettingsNotificationsPageContent() {
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_NOTIFICATION_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/notifications",
    form,
    defaults: DEFAULT_NOTIFICATION_SETTINGS,
    saveMessage: "Notification settings updated.",
  });

  async function handleTestEmail() {
    if (!testEmail) {
      toast({ title: "Enter a test email address", variant: "destructive" });
      return;
    }
    setIsTesting(true);
    try {
      const result = await api.post("/api/admin/settings/notifications", { to: testEmail });
      if (!result.success) throw new Error(result.error);
      toast({ title: "Test email sent", description: `Message sent to ${testEmail}.` });
    } catch {
      toast({ title: "Failed to send test email", variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <SettingsPageShell
      activeHref="/admin/settings/notifications"
      title="Notifications"
      description="SMTP email delivery, platform alerts, and outbound webhooks."
      icon={<Bell className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <Tabs defaultValue="email" className="space-y-5">
            <TabsList>
              <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" />Email</TabsTrigger>
              <TabsTrigger value="alerts"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
              <TabsTrigger value="webhooks"><Webhook className="mr-2 h-4 w-4" />Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-5">
              <SettingsSection title="SMTP configuration" description="Outbound email for platform notifications">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="smtpHost" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="smtp-host">SMTP host</Label>
                        <FormControl><Input id="smtp-host" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="smtpPort" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="smtp-port">SMTP port</Label>
                        <FormControl><Input id="smtp-port" type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="smtpUser" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="smtp-user">SMTP username</Label>
                        <FormControl><Input id="smtp-user" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="smtpPassword" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="smtp-password">SMTP password</Label>
                        <FormControl><Input id="smtp-password" type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="encryption" render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="smtp-encryption">Encryption</Label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger id="smtp-encryption">
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
                  )} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="fromAddress" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="from-address">From address</Label>
                        <FormControl><Input id="from-address" type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="fromName" render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="from-name">From name</Label>
                        <FormControl><Input id="from-name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection title="Send test email" description="Verify SMTP before saving">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="test-email-recipient">Test recipient</Label>
                    <Input
                      id="test-email-recipient"
                      type="email"
                      placeholder="you@company.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={handleTestEmail} disabled={isTesting}>
                    {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send test
                  </Button>
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="alerts">
              <SettingsSection title="Platform alerts" description="Events that trigger admin notifications">
                <div className="space-y-4">
                  {ALERT_FIELDS.map(([name, title, desc]) => {
                    const switchId = `alert-${name}`;
                    return (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
                            <div className="space-y-1">
                              <Label htmlFor={switchId}>{title}</Label>
                              <FieldDescription>{desc}</FieldDescription>
                            </div>
                            <Switch
                              id={switchId}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="webhooks">
              <SettingsSection title="Outbound webhooks" description="Push platform events to external systems">
                <div className="space-y-4">
                  <FormField control={form.control} name="webhookEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
                      <div className="space-y-1">
                        <Label htmlFor="webhook-enabled">Enable webhooks</Label>
                        <FieldDescription>Send JSON payloads on platform events</FieldDescription>
                      </div>
                      <Switch
                        id="webhook-enabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )} />
                  {form.watch("webhookEnabled") && (
                    <>
                      <FormField control={form.control} name="webhookUrl" render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="webhook-url">Webhook URL</Label>
                          <FormControl>
                            <Input id="webhook-url" placeholder="https://hooks.example.com/events" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="webhookSecret" render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="webhook-secret">Signing secret</Label>
                          <FormControl><Textarea id="webhook-secret" rows={2} {...field} /></FormControl>
                          <FieldDescription>Used to verify webhook payloads on your server</FieldDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </>
                  )}
                </div>
              </SettingsSection>
            </TabsContent>
          </Tabs>

          <SettingsSaveBar isSaving={isSaving} label="Save notification settings" />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
