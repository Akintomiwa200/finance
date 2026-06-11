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

const securitySchema = z.object({
  sessionTimeout: z.string().min(1, "Required"),
  require2FA: z.boolean(),
  forcePasswordReset: z.boolean(),
  passwordMinLength: z.string().min(1, "Required"),
  passwordRequireSpecialChar: z.boolean(),
  passwordRequireNumber: z.boolean(),
  maxLoginAttempts: z.string().min(1, "Required"),
  lockoutDuration: z.string().min(1, "Required"),
  rateLimiting: z.boolean(),
  maxRequestsPerMinute: z.string().min(1, "Required"),
  enableCORS: z.boolean(),
  allowedOrigins: z.string().optional(),
  ipWhitelisting: z.boolean(),
  sessionIdleTimeout: z.string().min(1, "Required"),
});

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SecuritySettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      sessionTimeout: "60",
      require2FA: true,
      forcePasswordReset: false,
      passwordMinLength: "8",
      passwordRequireSpecialChar: true,
      passwordRequireNumber: true,
      maxLoginAttempts: "5",
      lockoutDuration: "30",
      rateLimiting: true,
      maxRequestsPerMinute: "100",
      enableCORS: false,
      allowedOrigins: "",
      ipWhitelisting: false,
      sessionIdleTimeout: "15",
    },
  });

  async function onSubmit(data: SecurityFormValues) {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Security settings saved",
        description: "Your security configuration has been updated.",
      });

      console.log("Security settings:", data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save security settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout
      title="Security"
      description="Authentication and access policies"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings" },
        { label: "Security" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Policy</CardTitle>
              <CardDescription>Configure how user sessions are managed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sessionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum session duration before re-authentication
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionIdleTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idle Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Auto logout after period of inactivity</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="require2FA"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Require 2FA for Super Admin</FormLabel>
                      <FormDescription>
                        Enforce two-factor authentication for admin accounts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forcePasswordReset"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Force password reset on first login</FormLabel>
                      <FormDescription>
                        Require new users to change their password
                      </FormDescription>
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
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Configure password complexity requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="passwordMinLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Password Length</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordRequireSpecialChar"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Require Special Characters</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordRequireNumber"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Require Numbers</FormLabel>
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
              <CardTitle>Brute Force Protection</CardTitle>
              <CardDescription>Configure login attempt limits and lockouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="maxLoginAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Login Attempts</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lockoutDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lockout Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Security</CardTitle>
              <CardDescription>Configure API access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="rateLimiting"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Rate Limiting</FormLabel>
                      <FormDescription>Limit API requests to prevent abuse</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("rateLimiting") && (
                <FormField
                  control={form.control}
                  name="maxRequestsPerMinute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Requests Per Minute</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="enableCORS"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable CORS</FormLabel>
                      <FormDescription>Allow cross-origin requests</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("enableCORS") && (
                <FormField
                  control={form.control}
                  name="allowedOrigins"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed Origins</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com, https://app.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Comma-separated list of allowed origins</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="ipWhitelisting"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">IP Whitelisting</FormLabel>
                      <FormDescription>Restrict admin access to approved IP ranges</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </>
            )}
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
