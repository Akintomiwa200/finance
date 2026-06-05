"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-light px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 pl-10 md:pl-0">
        <Link
          href="/dashboard"
          className="shrink-0 no-underline flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center hidden md:flex justify-center text-white font-bold text-sm shadow-sm">
            F
          </div>
          <span className="text-sm font-semibold text-primary hidden md:inline">
            Finance App
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button className="relative p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-primary">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        <Link
          href="/settings"
          className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-primary"
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5" />
        </Link>

        <div className="relative user-menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUserMenu(!showUserMenu);
            }}
            className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-light hover:bg-surface-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 text-xs font-medium">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-primary leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted leading-tight">
                {user?.email || ""}
              </p>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-muted transition-transform duration-200 hidden sm:block ${
                showUserMenu ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-light rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-light">
                <p className="text-sm font-medium text-primary">{user?.name || "User"}</p>
                <p className="text-xs text-muted">{user?.email || ""}</p>
                <p className="text-xs text-muted mt-1 capitalize">
                  {user?.role?.replace(/_/g, " ").toLowerCase() || ""}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-surface-2 hover:text-primary transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
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
  );
}
