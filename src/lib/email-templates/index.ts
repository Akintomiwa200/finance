export type {
  EmailTemplateKind,
  EmailTemplateData,
  EmailDetailRow,
  EmailLineItem,
  EmailStatCard,
  RenderedEmail,
} from "./types";

export { renderEmailTemplate } from "./render";
export { EMAIL_BRAND, getLogoUrl } from "@/src/lib/email-brand";
