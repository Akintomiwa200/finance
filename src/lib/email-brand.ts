import { getAppUrl } from "@/src/lib/mail";

export const EMAIL_BRAND = {
  name: process.env.MAIL_APP_NAME?.trim() || "Uifry",
  tagline: process.env.MAIL_APP_TAGLINE?.trim() || "Best Finance App",
  supportEmail: process.env.MAIL_SUPPORT_EMAIL?.trim() || "support@uifry.com",
  companyAddress:
    process.env.MAIL_COMPANY_ADDRESS?.trim() ||
    "Uifry Finance Platform · All rights reserved",
  colors: {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#eff6ff",
    logoRed: "#ff5555",
    logoRedDark: "#cc0000",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
    surface: "#f8fafc",
    success: "#16a34a",
    successBg: "#f0fdf4",
    warning: "#d97706",
    warningBg: "#fffbeb",
    danger: "#dc2626",
    dangerBg: "#fef2f2",
    info: "#2563eb",
    infoBg: "#eff6ff",
  },
} as const;

export function getLogoUrl(): string {
  return `${getAppUrl()}/logo.svg`;
}

/** Inline SVG logo for clients that block remote images */
export function getInlineLogoSvg(size = 32): string {
  const s = size;
  return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
    <path d="M16 0L4 8V24L16 32L28 24V8L16 0Z" fill="${EMAIL_BRAND.colors.logoRed}" />
    <path d="M16 4L8 9V23L16 28L24 23V9L16 4Z" fill="${EMAIL_BRAND.colors.logoRedDark}" />
  </svg>`;
}
