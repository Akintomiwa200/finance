"use client";

import Link from "next/link";
import { ChevronRight, Mail, Shield } from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";
import { cn } from "@/src/lib/utils";
import { formatRole, getInitials } from "@/src/lib/profile-utils";

interface SidebarProfileFooterProps {
  collapsed?: boolean;
  compact?: boolean;
  variant?: "default" | "admin";
  profileHref?: string;
}

export function SidebarProfileFooter({
  collapsed = false,
  compact = false,
  variant = "default",
  profileHref = "/profile",
}: SidebarProfileFooterProps) {
  const user = useAuthStore((s) => s.user);
  const initials = getInitials(user?.name);
  const roleLabel = formatRole(user?.role);
  const email = user?.email ?? "—";
  const avatarUrl = user?.avatarUrl;

  const textPrimary =
    variant === "admin" ? "text-[var(--admin-nav-item)]" : "text-primary";
  const textMuted =
    variant === "admin" ? "text-[var(--admin-nav-item-muted)]" : "text-muted";

  if (compact) {
    return (
      <div
        className={cn(
          "shrink-0 border-t p-3",
          variant === "admin"
            ? "admin-sidebar-footer border-[var(--admin-nav-border)]"
            : "border-light",
        )}
      >
        <Link
          href={profileHref}
          className="flex items-center gap-3 no-underline hover:opacity-90 transition-opacity"
        >
          <div
            className={cn(
              "relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500 ring-offset-2",
              variant === "admin"
                ? "ring-offset-[var(--admin-nav-bg)]"
                : "ring-offset-card",
            )}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center text-xs font-semibold",
                  variant === "admin"
                    ? "bg-[var(--admin-nav-active-bg)] text-[var(--admin-nav-active-fg)]"
                    : "bg-accent-100 text-accent-700",
                )}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-semibold truncate", textPrimary)}>
              {user?.name ?? "User"}
            </p>
            <p className={cn("text-xs truncate", textMuted)}>{email}</p>
          </div>
          <ChevronRight className={cn("h-4 w-4 shrink-0", textMuted)} />
        </Link>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div
        className={cn(
          "border-t py-3 flex justify-center",
          variant === "admin"
            ? "admin-sidebar-footer border-[var(--admin-nav-border)]"
            : "border-light",
        )}
      >
        <Link
          href={profileHref}
          className={cn(
            "group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-offset-2 no-underline transition-opacity hover:opacity-90",
            variant === "admin"
              ? "bg-[var(--admin-nav-active-bg)] text-[var(--admin-nav-active-fg)] ring-[var(--admin-nav-border)] ring-offset-[var(--admin-nav-bg)]"
              : "bg-accent-100 text-accent-700 ring-border-light ring-offset-card",
          )}
          title={`${user?.name ?? "User"} · ${email}`}
          aria-label="Open profile"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-semibold">{initials}</span>
          )}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t p-3",
        variant === "admin"
          ? "admin-sidebar-footer border-[var(--admin-nav-border)]"
          : "border-light",
      )}
    >
      <div
        className={cn(
          "rounded-xl border p-4 shadow-sm min-h-[220px] flex flex-col",
          variant === "admin"
            ? "border-[var(--admin-nav-border)] bg-[var(--admin-nav-bg)]"
            : "border-light bg-card",
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-semibold truncate leading-tight", textPrimary)}>
              {user?.name ?? "User"}
            </p>
            <p className={cn("text-[11px] truncate mt-1", textMuted)}>{roleLabel}</p>
          </div>
          <Link
            href={profileHref}
            className={cn(
              "shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors no-underline",
              variant === "admin"
                ? "border-[var(--admin-nav-border)] text-[var(--admin-nav-item-muted)] hover:bg-[var(--admin-nav-hover)] hover:text-[var(--admin-nav-item)]"
                : "border-light text-muted hover:bg-surface-2 hover:text-primary",
            )}
            aria-label="Open profile"
            title="View profile"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex flex-col items-center py-2 mb-4">
          <Link
            href={profileHref}
            className={cn(
              "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-[3px] ring-offset-2 no-underline",
              variant === "admin"
                ? "bg-[var(--admin-nav-active-bg)] text-[var(--admin-nav-active-fg)] ring-[var(--admin-nav-border)] ring-offset-[var(--admin-nav-bg)]"
                : "bg-accent-100 text-accent-700 ring-border-light ring-offset-card",
            )}
            aria-label="Open profile"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-base font-semibold">{initials}</span>
            )}
            <span
              className={cn(
                "absolute top-0 right-1 h-2.5 w-2.5 rounded-full border-2",
                variant === "admin"
                  ? "bg-[var(--admin-nav-active-fg)] border-[var(--admin-nav-bg)]"
                  : "bg-accent-600 border-card",
              )}
            />
          </Link>
        </div>

        <div
          className={cn(
            "mt-auto space-y-3 pt-3 border-t border-dashed",
            variant === "admin" ? "border-[var(--admin-nav-border)]" : "border-light",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Mail className={cn("h-3 w-3 shrink-0", textMuted)} />
              <p className={cn("text-[10px] uppercase tracking-wide font-medium", textMuted)}>
                Email
              </p>
            </div>
            <p
              className={cn("text-xs font-medium break-all leading-relaxed", textPrimary)}
              title={email}
            >
              {email}
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className={cn("h-3 w-3 shrink-0", textMuted)} />
              <p className={cn("text-[10px] uppercase tracking-wide font-medium", textMuted)}>
                Role
              </p>
            </div>
            <p className={cn("text-xs font-semibold truncate", textPrimary)}>{roleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
