"use client";

import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, min = 0, max = 100, step = 1, className }, ref) => {
    const current = value[0] ?? min;

    return (
      <div ref={ref} className={cn("relative w-full h-2", className)}>
        <div className="absolute inset-0 rounded-full bg-muted" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent-500 transition-all"
          style={{ width: `${((current - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onValueChange([Number(e.target.value)])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";
