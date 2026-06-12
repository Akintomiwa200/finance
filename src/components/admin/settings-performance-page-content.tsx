"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Zap } from "lucide-react";
import {
  SettingsPageShell,
  SettingsSection,
  SettingsSaveBar,
} from "@/src/components/admin/settings-shared";
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
import { useAdminSettingsForm } from "@/src/hooks/use-admin-settings-form";
import { DEFAULT_PERFORMANCE_SETTINGS } from "@/src/types/platform-admin-settings";

const schema = z.object({
  cachingEnabled: z.boolean(),
  cacheTtlSeconds: z.string().min(1),
  cacheStrategy: z.enum(["memory", "redis", "edge"]),
  cdnEnabled: z.boolean(),
  cdnProvider: z.enum(["cloudflare", "fastly", "aws", "custom"]),
  cdnUrl: z.union([z.string().url(), z.literal("")]),
  gzipEnabled: z.boolean(),
  imageOptimization: z.boolean(),
  lazyLoadAssets: z.boolean(),
  prefetchRoutes: z.boolean(),
  maxUploadSizeMb: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function SettingsPerformancePageContent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_PERFORMANCE_SETTINGS,
  });

  const { isLoading, isSaving, save } = useAdminSettingsForm({
    endpoint: "/api/admin/settings/performance",
    form,
    defaults: DEFAULT_PERFORMANCE_SETTINGS,
    saveMessage: "Caching and CDN configuration updated.",
  });

  return (
    <SettingsPageShell
      activeHref="/admin/settings/performance"
      title="Performance settings"
      description="Caching, CDN, compression, and resource optimization controls for the platform."
      icon={<Zap className="h-10 w-10 text-brand-600" />}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} className="space-y-5">
          <SettingsSection title="Caching" description="Response cache and TTL policies">
            <div className="space-y-4">
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
            </div>
          </SettingsSection>

          <SettingsSection title="CDN" description="Static assets and global delivery">
            <div className="space-y-4">
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
            </div>
          </SettingsSection>

          <SettingsSection
            title="Optimization"
            description="Compression and frontend delivery tweaks"
          >
            <div className="space-y-4">
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
            </div>
          </SettingsSection>

          <SettingsSaveBar isSaving={isSaving} />
        </form>
      </Form>
    </SettingsPageShell>
  );
}
