"use client";

import type { ReactNode } from "react";
import {
  LaptopDashboardPreview,
  PhoneDashboardPreview,
  PhoneSecurityPreview,
  TabletDashboardPreview,
} from "@/src/components/landing/app-dashboard-preview";

type DeviceVariant = "laptop" | "tablet" | "phone";

type DeviceMockupProps = {
  device: DeviceVariant;
  activeMonth?: number;
  onMonthChange?: (index: number) => void;
  interactive?: boolean;
  variant?: "dashboard" | "security";
};

function LaptopShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[500px] transition-transform duration-300 hover:scale-[1.02]">
      <div
        className="pointer-events-none absolute -bottom-5 left-1/2 h-8 w-[72%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-xl"
        aria-hidden="true"
      />

      {/* MacBook Pro — front-facing silver shell */}
      <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-b from-[#ececf1] via-[#dddee3] to-[#c8c9ce] p-[11px] pb-[10px] shadow-[0_28px_70px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.06)]">
        {/* Top edge highlight */}
        <div className="pointer-events-none absolute inset-x-8 top-[1px] h-px bg-white/70" />

        {/* Display bezel */}
        <div className="relative rounded-[10px] bg-[#080808] p-[7px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="relative overflow-hidden rounded-[6px] bg-black">
            {/* Notch */}
            <div className="absolute left-1/2 top-0 z-30 h-[15px] w-[84px] -translate-x-1/2 rounded-b-[11px] bg-[#080808]">
              <div className="absolute left-1/2 top-[5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#101012] ring-[0.5px] ring-[#2a2a2e]" />
            </div>

            <div className="relative h-[288px] w-full overflow-hidden bg-[#fafafa]">
              {children}
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[6px] bg-gradient-to-br from-white/[0.05] via-transparent to-black/[0.03]" />
          </div>
        </div>

        {/* Bottom chin + thumb groove */}
        <div className="relative mt-[8px] h-[20px]">
          <div className="absolute left-1/2 top-[7px] h-[5px] w-[54px] -translate-x-1/2 rounded-full bg-[#b6b6bc]/55 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />
        </div>
      </div>

      {/* Rubber feet */}
      <div className="absolute bottom-[1px] left-[11%] h-[3px] w-[18px] rounded-full bg-[#2b2b2e]/75" aria-hidden="true" />
      <div className="absolute bottom-[1px] right-[11%] h-[3px] w-[18px] rounded-full bg-[#2b2b2e]/75" aria-hidden="true" />
    </div>
  );
}

function TabletShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[440px] transition-transform duration-300 hover:scale-[1.02]">
      <div
        className="pointer-events-none absolute -bottom-4 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/12 blur-lg"
        aria-hidden="true"
      />

      {/* iPad Pro — landscape, silver */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#ececf1] via-[#dddee3] to-[#c8c9ce] p-[10px] shadow-[0_22px_56px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="pointer-events-none absolute inset-x-6 top-px h-px bg-white/70" />

        <div className="relative rounded-[12px] bg-[#080808] p-[7px]">
          <div className="absolute left-1/2 top-[9px] z-20 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#101012] ring-[0.5px] ring-[#333]" />

          <div className="relative overflow-hidden rounded-[8px] bg-[#fafafa]">
            <div className="relative h-[252px] w-full overflow-hidden">{children}</div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-[10px] left-1/2 z-20 h-[4px] w-[96px] -translate-x-1/2 rounded-full bg-black/25" />
        </div>
      </div>
    </div>
  );
}

function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[204px] transition-transform duration-300 hover:scale-[1.02]">
      <div
        className="pointer-events-none absolute -bottom-4 left-1/2 h-6 w-[68%] -translate-x-1/2 rounded-[100%] bg-black/12 blur-lg"
        aria-hidden="true"
      />

      {/* iPhone — silver, front-facing */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-b from-[#ececf1] via-[#dddee3] to-[#c8c9ce] p-[8px] shadow-[0_24px_58px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.92)]">
        <div className="pointer-events-none absolute inset-x-5 top-px h-px bg-white/70" />

        <div className="relative overflow-hidden rounded-[30px] bg-[#080808] p-[3px]">
          <div className="relative overflow-hidden rounded-[27px] bg-[#fafafa]">
            <div className="absolute left-1/2 top-[8px] z-30 h-[21px] w-[76px] -translate-x-1/2 rounded-full bg-black shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              <div className="absolute left-[14px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[#1a1a2e] ring-[0.5px] ring-[#333]" />
            </div>

            <div className="relative h-[392px] w-full overflow-hidden">{children}</div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

            <div className="absolute bottom-[7px] left-1/2 z-20 h-[4px] w-[96px] -translate-x-1/2 rounded-full bg-black/25" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeviceMockup({
  device,
  activeMonth = 0,
  onMonthChange,
  interactive = false,
  variant = "dashboard",
}: DeviceMockupProps) {
  if (device === "laptop") {
    return (
      <div aria-hidden="true">
        <LaptopShell>
          <LaptopDashboardPreview />
        </LaptopShell>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div aria-hidden="true">
        <TabletShell>
          <TabletDashboardPreview
            activeMonth={activeMonth}
            onMonthChange={onMonthChange}
            interactive={interactive}
          />
        </TabletShell>
      </div>
    );
  }

  if (device === "phone") {
    return (
      <div aria-hidden="true">
        <PhoneShell>
          {variant === "security" ? <PhoneSecurityPreview /> : <PhoneDashboardPreview />}
        </PhoneShell>
      </div>
    );
  }

  return null;
}
