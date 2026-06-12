"use client";

import { cn } from "@/src/lib/utils";

export async function uploadCompanyLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/organizations/logo", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Logo upload failed");
  }
  return data.url as string;
}

export function FieldAvatar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FormFieldRow({
  avatar,
  title,
  hint,
  children,
  trailing,
}: {
  avatar: React.ReactNode;
  title: string;
  hint?: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/70 py-4 last:border-b-0">
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {hint && (
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            )}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export function CompanyFormShell({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex w-full min-w-0 max-w-5xl justify-center px-0 py-4 sm:py-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at 15% 10%, color-mix(in srgb, var(--accent-400) 16%, transparent), transparent 48%), radial-gradient(ellipse at 85% 20%, color-mix(in srgb, #ec4899 12%, transparent), transparent 42%), radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--info) 10%, transparent), transparent 50%)",
        }}
      />

      <div className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <span className="text-lg leading-none" aria-hidden>×</span>
        </button>

        <div className="px-6 pb-2 pt-10 text-center sm:px-10 sm:pt-12">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            {title}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
