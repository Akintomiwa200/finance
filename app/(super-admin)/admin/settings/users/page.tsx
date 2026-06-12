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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";

const schema = z.object({
  ssoEnabled: z.boolean(),
  ssoProvider: z.enum(["okta", "azure", "google", "custom"]),
  ssoMetadataUrl: z.string().optional(),
  autoProvisionUsers: z.boolean(),
  defaultRole: z.string().min(1),
  inviteExpiryDays: z.string().min(1),
  allowSelfSignup: z.boolean(),
  requireEmailVerification: z.boolean(),
  apiKeysEnabled: z.boolean(),
  maxApiKeysPerUser: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function UserManagementSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ssoEnabled: false,
      ssoProvider: "okta",
      ssoMetadataUrl: "",
      autoProvisionUsers: true,
      defaultRole: "EMPLOYEE",
      inviteExpiryDays: "7",
      allowSelfSignup: false,
      requireEmailVerification: true,
      apiKeysEnabled: true,
      maxApiKeysPerUser: "5",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "User management settings saved", description: "Configuration updated." });
      console.log(data);
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout
      title="Tenant User Access"
      description="How people at tenant companies sign in and get provisioned — separate from your platform team under Team and Team Roles"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings/general" },
        { label: "Tenant User Access" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="sso" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sso">SSO</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="sso" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Single Sign-On</CardTitle>
                  <CardDescription>Connect your identity provider for tenant admins</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ssoEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <FormLabel className="text-base">Enable SSO</FormLabel>
                          <FormDescription>Allow sign-in via SAML/OIDC provider</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("ssoEnabled") && (
                    <>
                      <FormField
                        control={form.control}
                        name="ssoProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="okta">Okta</SelectItem>
                                <SelectItem value="azure">Azure AD</SelectItem>
                                <SelectItem value="google">Google Workspace</SelectItem>
                                <SelectItem value="custom">Custom SAML</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ssoMetadataUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metadata URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://idp.example.com/metadata" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="autoProvisionUsers"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <FormLabel className="text-base">Auto-provision users</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lifecycle" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Lifecycle</CardTitle>
                  <CardDescription>Invites, sign-up, and default access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default role for new users</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EMPLOYEE">Employee</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inviteExpiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invite expiry (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowSelfSignup"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Allow self sign-up</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requireEmailVerification"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Require email verification</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User API Keys</CardTitle>
                  <CardDescription>Per-user API key limits for programmatic access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="apiKeysEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">Allow user API keys</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("apiKeysEnabled") && (
                    <FormField
                      control={form.control}
                      name="maxApiKeysPerUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max keys per user</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
