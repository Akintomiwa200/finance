"use client";

import { cn } from "@/src/lib/utils";
import { PageHeader, type BreadcrumbItem } from "./page-header";

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBack?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  actions,
  breadcrumbs,
  showBack,
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        title={title}
        description={description}
        actions={actions}
        breadcrumbs={breadcrumbs}
        showBack={showBack}
      />
      {children}
    </div>
  );
}
