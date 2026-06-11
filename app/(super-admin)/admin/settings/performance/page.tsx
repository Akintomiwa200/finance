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
import { Loader2, Save } from "lucide-react";

const schema = z.object({
  cachingEnabled: z.boolean(),
  cacheTtlSeconds: z.string().min(1),
  cacheStrategy: z.enum(["memory", "redis", "edge"]),
  cdnEnabled: z.boolean(),
  cdnProvider: z.enum(["cloudflare", "fastly", "aws", "custom"]),
  cdnUrl: z.string().url().optional().or(z.literal("")),
  gzipEnabled: z.boolean(),
  imageOptimization: z.boolean(),
  lazyLoadAssets: z.boolean(),
  prefetchRoutes: z.boolean(),
  maxUploadSizeMb: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function PerformanceSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cachingEnabled: true,
      cacheTtlSeconds: "300",
      cacheStrategy: "redis",
      cdnEnabled: false,
      cdnProvider: "cloudflare",
      cdnUrl: "",
      gzipEnabled: true,
      imageOptimization: true,
      lazyLoadAssets: true,
      prefetchRoutes: false,
      maxUploadSizeMb: "25",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Performance settings saved", description: "Caching and CDN configuration updated." });
      console.log(data);
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout
      title="Performance"
      description="Caching, CDN, and resource optimization controls"
      showBack
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings/general" },
        { label: "Performance" },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Caching</CardTitle>
              <CardDescription>Response cache and TTL policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cachingEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Enable caching</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("cachingEnabled") && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cacheStrategy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cache backend</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="memory">In-memory</SelectItem>
                            <SelectItem value="redis">Redis</SelectItem>
                            <SelectItem value="edge">Edge (CDN)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cacheTtlSeconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default TTL (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CDN</CardTitle>
              <CardDescription>Static assets and global delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cdnEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Enable CDN</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("cdnEnabled") && (
                <>
                  <FormField
                    control={form.control}
                    name="cdnProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CDN provider</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cloudflare">Cloudflare</SelectItem>
                            <SelectItem value="fastly">Fastly</SelectItem>
                            <SelectItem value="aws">AWS CloudFront</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cdnUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CDN base URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://cdn.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization</CardTitle>
              <CardDescription>Compression and frontend delivery tweaks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  ["gzipEnabled", "Gzip compression", "Compress text responses"],
                  ["imageOptimization", "Image optimization", "Auto-resize and WebP delivery"],
                  ["lazyLoadAssets", "Lazy-load assets", "Defer non-critical scripts and images"],
                  ["prefetchRoutes", "Prefetch routes", "Warm common navigation paths"],
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
                name="maxUploadSizeMb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max upload size (MB)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
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
