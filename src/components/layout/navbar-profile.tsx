"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { formatRole, getInitials } from "@/src/lib/profile-utils";
import { User, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface NavbarProfileProps {
  profileHref?: string;
  settingsHref?: string;
  helpHref?: string;
  onLogout?: () => void;
}

export function NavbarProfile({
  profileHref = "/profile",
  settingsHref = "/settings",
  helpHref = "/help",
  onLogout,
}: NavbarProfileProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(user?.name);
  const roleLabel = user?.jobTitle || formatRole(user?.role);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      logout();
      router.push("/login");
    }
  }

  const menuItems = [
    {
      label: "View Profile",
      icon: User,
      onClick: () => {
        setIsOpen(false);
        router.push(profileHref);
      },
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        setIsOpen(false);
        router.push(settingsHref);
      },
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      onClick: () => {
        setIsOpen(false);
        router.push(helpHref);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted/50",
          isOpen && "bg-muted/50",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-background">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-[10px] font-semibold text-foreground">
              {initials}
            </div>
          )}
        </div>
        <div className="hidden sm:block min-w-0 text-left">
          <p className="text-sm font-medium text-foreground leading-tight truncate max-w-[120px]">
            {user?.name ?? "User"}
          </p>
          <p className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">
            {roleLabel}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "hidden sm:block h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {/* User info section */}
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ?? ""}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/50"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-border py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
