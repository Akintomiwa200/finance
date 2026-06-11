"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type ThemeMode } from "@/src/context/theme-context";
import { cn } from "@/src/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const modes: { value: ThemeMode; icon: React.ElementType; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { mode, setMode, toggleTheme, resolvedTheme } = useTheme();

  if (showLabel) {
    return (
      <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-muted border border-border", className)}>
        {modes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              mode === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={`${label} theme`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
