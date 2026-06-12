export type EmailTemplateKind =
  | "welcome"
  | "notification"
  | "payment-success"
  | "payment-failed"
  | "invoice"
  | "support-ticket"
  | "support-reply"
  | "live-fix"
  | "report"
  | "alert"
  | "organization"
  | "approval"
  | "security";

export type EmailHeroIcon =
  | "welcome"
  | "payment"
  | "invoice"
  | "support"
  | "live-fix"
  | "report"
  | "alert"
  | "security"
  | "approval"
  | "organization";

export type EmailBadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface EmailDetailRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface EmailLineItem {
  name: string;
  description?: string;
  quantity?: string;
  amount: string;
}

export interface EmailStatCard {
  label: string;
  value: string;
  tone?: "blue" | "green" | "amber" | "red";
}

export interface EmailTemplateData {
  recipientName?: string;
  preheader?: string;
  title: string;
  subtitle?: string;
  body?: string;
  heroIcon?: EmailHeroIcon;
  badge?: { label: string; tone?: EmailBadgeTone };
  details?: EmailDetailRow[];
  lineItems?: EmailLineItem[];
  subtotal?: string;
  discount?: string;
  tax?: string;
  total?: string;
  stats?: EmailStatCard[];
  quote?: string;
  quoteAuthor?: string;
  checklist?: string[];
  promoText?: string;
  promoCode?: string;
  actionLabel?: string;
  actionUrl?: string;
  secondaryActionLabel?: string;
  secondaryActionUrl?: string;
  footerNote?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}
