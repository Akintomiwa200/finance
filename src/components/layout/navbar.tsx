"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      logout();
      await signOut({ redirect: false, callbackUrl: "/login" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-card border-b border-light h-14 flex items-center justify-between px-4 md:px-6">
        {/* Left Section — Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(
                    `/dashboard/transactions?q=${encodeURIComponent(searchQuery.trim())}`,
                  );
                }
              }}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-primary"
            aria-label="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Notification Icon */}
          <button
            onClick={() => router.push("/dashboard/transactions")}
            className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-primary"
            aria-label="Notifications"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>

          {/* User Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-2 pl-2 md:pl-3 border-l border-light hover:bg-surface-2 rounded-lg transition-colors h-9"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-7 h-7 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 text-[10px] font-medium shrink-0">
                {getInitials()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-primary leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-muted leading-tight truncate max-w-[120px]">
                  {user?.email || ""}
                </p>
              </div>
              <ChevronDown
                className={`w-3 h-3 text-muted shrink-0 hidden md:block transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-light rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-light">
                  <p className="text-sm font-medium text-primary truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {user?.email || ""}
                  </p>
                  <p className="text-xs text-muted mt-1 capitalize">
                    {user?.role?.replace(/_/g, " ").toLowerCase() || "User"}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="border-light my-1" />
                  <button
                    className="flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-surface-2 transition-colors w-full text-left"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setShowMobileMenu(false)}
          />
          <div
            ref={mobileMenuRef}
            className="fixed left-0 top-0 bottom-0 w-64 bg-card z-50 md:hidden animate-in slide-in-from-left duration-300 shadow-xl"
          >
            <div className="flex justify-between items-center p-4 border-b border-light">
              <span className="text-sm font-semibold text-primary">Menu</span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1 rounded-lg hover:bg-surface-2 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-light">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 text-sm font-medium">
                  {getInitials()}
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted">{user?.email || ""}</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-light my-2" />
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                className="flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-surface-2 rounded-lg transition-colors w-full text-left mt-2"
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
