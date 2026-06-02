"use client";

import { cn } from "@/src/lib/utils";

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Avatar({ className, children }: AvatarProps) {
  return (
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full w-10 h-10", className)}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return <img src={src} alt={alt || ""} className="aspect-square h-full w-full" />;
}

export function AvatarFallback({ className, children, style }: AvatarProps) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium", className)} style={style}>
      {children}
    </div>
  );
}
