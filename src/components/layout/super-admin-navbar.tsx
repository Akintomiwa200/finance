"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NotificationBell } from "@/src/components/layout/notification-bell";
import { NavbarSearch } from "@/src/components/layout/navbar-search";
import { getNavbarTitle } from "@/src/lib/navbar-title";
import { NavbarProfile } from "@/src/components/layout/navbar-profile";
import { MobileSidebarTrigger } from "@/src/components/layout/mobile-sidebar-trigger";
import { cn } from "@/src/lib/utils";

export function SuperAdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const pageTitle = getNavbarTitle(pathname ?? "/admin/dashboard", "admin");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/support?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-30 shrink-0 bg-background px-[2em] transition-all duration-300 ease-out",
        searchOpen ? "py-3 md:py-3.5" : "flex h-16 items-center md:h-[4.75rem]",
      )}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3 md:gap-4">
          <MobileSidebarTrigger variant="admin" />

          {!searchOpen && (
            <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-foreground">
              {pageTitle}
            </h1>
          )}

          {searchOpen && <div className="min-w-0 flex-1" aria-hidden />}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavbarSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search support..."
            />
            <NotificationBell scope="admin" />
            <NavbarProfile href="/admin/profile" />
          </div>
        </div>

        {searchOpen && (
          <div className="pl-11 animate-in fade-in slide-in-from-top-1 duration-200 md:pl-12">
            <p className="truncate text-sm font-medium text-muted-foreground">{pageTitle}</p>
          </div>
        )}
      </div>
    </header>
  );
}
