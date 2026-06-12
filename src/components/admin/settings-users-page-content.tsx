"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_TENANT_ACCESS_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  ssoEnabled: z.boolean(),
  ssoProvider: z.enum(["okta", "azure", "google", "custom"]),
  ssoMetadataUrl: z.string(),
  autoProvisionUsers: z.boolean(),
  defaultRole: z.string().min(1),
  inviteExpiryDays: z.string().min(1),
  allowSelfSignup: z.boolean(),
  requireEmailVerification: z.boolean(),
  apiKeysEnabled: z.boolean(),
  maxApiKeysPerUser: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function SettingsUsersPageContent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_TENANT_ACCESS_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/users",
    form,
    defaults: DEFAULT_TENANT_ACCESS_SETTINGS,
    saveMessage: "Tenant user access settings updated.",
  });

  return (
    <SettingsPageShell
      activeHref="/admin/settings/users"
      title="Tenant user access"
      description="How people at tenant companies sign in and get provisioned — separate from your platform team."
      icon={<Users className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <Tabs defaultValue="sso" className="space-y-5">
            <TabsList>
              <TabsTrigger value="sso">SSO</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
              <TabsTrigger value="api-keys">API keys</TabsTrigger>
            </TabsList>

            <TabsContent value="sso">
              <SettingsSection title="Single sign-on" description="Identity provider for tenant companies">
                <div className="space-y-4">
                  <FormField control={form.control} name="ssoEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <div>
                        <FormLabel>Enable SSO</FormLabel>
                        <FormDescription>Allow sign-in via SAML/OIDC provider</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("ssoEnabled") && (
                    <>
                      <FormField control={form.control} name="ssoProvider" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="okta">Okta</SelectItem>
                              <SelectItem value="azure">Azure AD</SelectItem>
                              <SelectItem value="google">Google Workspace</SelectItem>
                              <SelectItem value="custom">Custom SAML</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="ssoMetadataUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metadata URL</FormLabel>
                          <FormControl><Input placeholder="https://idp.example.com/metadata" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="autoProvisionUsers" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                          <FormLabel>Auto-provision users</FormLabel>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )} />
                    </>
                  )}
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="lifecycle">
              <SettingsSection title="Account lifecycle" description="Invites, sign-up, and default access">
                <div className="space-y-4">
                  <FormField control={form.control} name="defaultRole" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default role for new users</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="EMPLOYEE">Employee</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="inviteExpiryDays" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite expiry (days)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="allowSelfSignup" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Allow self sign-up</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="requireEmailVerification" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Require email verification</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </SettingsSection>
            </TabsContent>

            <TabsContent value="api-keys">
              <SettingsSection title="User API keys" description="Per-user API key limits">
                <div className="space-y-4">
                  <FormField control={form.control} name="apiKeysEnabled" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                      <FormLabel>Allow user API keys</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  {form.watch("apiKeysEnabled") && (
                    <FormField control={form.control} name="maxApiKeysPerUser" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max keys per user</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              </SettingsSection>
            </TabsContent>
          </Tabs>

          <SettingsSaveBar isSaving={isSaving} />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
