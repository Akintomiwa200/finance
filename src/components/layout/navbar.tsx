"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NotificationBell } from "@/src/components/layout/notification-bell";
import { NavbarSearch } from "@/src/components/layout/navbar-search";
import { getNavbarTitle } from "@/src/lib/navbar-title";
import { NavbarProfile } from "@/src/components/layout/navbar-profile";
import { MobileSidebarTrigger } from "@/src/components/layout/mobile-sidebar-trigger";
import { useOrganization } from "@/src/hooks/use-organization";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { cn } from "@/src/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const pageTitle = getNavbarTitle(pathname ?? "/dashboard", "dashboard");
  const { data: organization } = useOrganization();

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
    router.push(`/dashboard/transactions?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-30 shrink-0 bg-background px-4 md:px-6 transition-all duration-300 ease-out",
        searchOpen ? "py-3" : "flex h-14 items-center",
      )}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3">
          <MobileSidebarTrigger />

          {!searchOpen && (
            <div className="min-w-0 flex-1">
              {organization?.name && (
                <div className="mb-0.5 flex items-center gap-2">
                  <CompanyLogo
                    name={organization.name}
                    logo={organization.logo}
                    size={22}
                  />
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {organization.name}
                  </span>
                </div>
              )}
              <h1 className="truncate text-lg font-semibold text-foreground">
                {pageTitle}
              </h1>
            </div>
          )}

          {searchOpen && <div className="min-w-0 flex-1" aria-hidden />}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavbarSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search transactions..."
            />
            <NotificationBell scope="dashboard" />
            <NavbarProfile href="/profile" />
          </div>
        </div>

        {searchOpen && (
          <div className="pl-11 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="truncate text-sm font-medium text-muted-foreground">{pageTitle}</p>
          </div>
        )}
      </div>
    </header>
  );
}
