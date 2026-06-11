"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

export interface SettingsCategoryItem {
  title: string;
  href: string;
  description: string;
  icon: React.ElementType;
  tags?: string[];
  comingSoon?: boolean;
}

interface SettingsCategoryCardProps extends SettingsCategoryItem {
  className?: string;
}

export function SettingsCategoryCard({
  title,
  href,
  description,
  icon: Icon,
  tags = [],
  comingSoon = false,
  className,
}: SettingsCategoryCardProps) {
  const content = (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all",
        comingSoon
          ? "cursor-default opacity-75"
          : "hover:border-brand-300 hover:shadow-sm dark:hover:border-brand-700",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        {comingSoon ? (
          <Badge variant="default" className="shrink-0 text-[10px]">
            Soon
          </Badge>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:bg-muted group-hover:text-foreground">
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (comingSoon) {
    return <div className={cn("h-full", className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("block h-full no-underline", className)}>
      {content}
    </Link>
  );
}

interface SettingsCategoryGroupProps {
  title: string;
  description?: string;
  items: SettingsCategoryItem[];
}

export function SettingsCategoryGroup({ title, description, items }: SettingsCategoryGroupProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-1 border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <SettingsCategoryCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
