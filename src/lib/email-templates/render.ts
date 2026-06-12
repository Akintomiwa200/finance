import { EMAIL_BRAND } from "@/src/lib/email-brand";
import {
  bodyBlock,
  checklistBlock,
  ctaBlock,
  detailsTable,
  escapeHtml,
  heroBlock,
  lineItemsTable,
  promoBanner,
  quoteBlock,
  statsGrid,
  titleBlock,
  wrapEmail,
} from "./blocks";
import type { EmailTemplateData, EmailTemplateKind, RenderedEmail } from "./types";

function greeting(name?: string): string {
  return name ? `Hi ${name},` : "Hi there,";
}

function buildText(data: EmailTemplateData): string {
  const parts = [data.title];
  if (data.subtitle) parts.push(data.subtitle);
  if (data.body) parts.push(data.body);
  if (data.details?.length) {
    parts.push("", ...data.details.map((d) => `${d.label}: ${d.value}`));
  }
  if (data.quote) parts.push("", `"${data.quote}"`, data.quoteAuthor ? `— ${data.quoteAuthor}` : "");
  if (data.actionUrl) parts.push("", `${data.actionLabel ?? "Open"}: ${data.actionUrl}`);
  return parts.join("\n");
}

function renderContent(kind: EmailTemplateKind, data: EmailTemplateData): string {
  const parts: string[] = [];

  switch (kind) {
    case "welcome":
      parts.push(heroBlock("welcome"));
      parts.push(
        titleBlock(
          data.title,
          data.subtitle ?? `${greeting(data.recipientName)} welcome to ${EMAIL_BRAND.name}.`,
          data.badge ?? { label: "Welcome", tone: "success" },
        ),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.checklist?.length) parts.push(checklistBlock(data.checklist));
      break;

    case "payment-success":
      parts.push(heroBlock("payment"));
      parts.push(
        titleBlock(
          data.title,
          data.subtitle ?? "Your payment was processed successfully.",
          data.badge ?? { label: "Payment successful", tone: "success" },
        ),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      if (data.promoText) parts.push(promoBanner(data.promoText, data.promoCode));
      break;

    case "payment-failed":
      parts.push(heroBlock("payment"));
      parts.push(
        titleBlock(
          data.title,
          data.subtitle ?? "We could not process your payment.",
          data.badge ?? { label: "Payment failed", tone: "danger" },
        ),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "invoice":
      parts.push(heroBlock("invoice"));
      parts.push(
        titleBlock(
          data.title,
          data.subtitle,
          data.badge ?? { label: "Invoice", tone: "info" },
        ),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.lineItems?.length) {
        parts.push(
          lineItemsTable(data.lineItems, {
            subtotal: data.subtotal,
            discount: data.discount,
            tax: data.tax,
            total: data.total,
          }),
        );
      } else if (data.details?.length) {
        parts.push(detailsTable(data.details));
      }
      break;

    case "support-ticket":
      parts.push(heroBlock("support"));
      parts.push(
        titleBlock(data.title, data.subtitle, data.badge ?? { label: "Support", tone: "info" }),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "support-reply":
      parts.push(heroBlock("support"));
      parts.push(titleBlock(data.title, data.subtitle, data.badge ?? { label: "New reply", tone: "info" }));
      if (data.quote) parts.push(quoteBlock(data.quote, data.quoteAuthor));
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      break;

    case "live-fix":
      parts.push(heroBlock("live-fix"));
      parts.push(
        titleBlock(data.title, data.subtitle, data.badge ?? { label: "Live support", tone: "info" }),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "report":
      parts.push(heroBlock("report"));
      parts.push(titleBlock(data.title, data.subtitle, data.badge ?? { label: "Report", tone: "neutral" }));
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.stats?.length) parts.push(statsGrid(data.stats));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "alert":
      parts.push(heroBlock("alert"));
      parts.push(
        titleBlock(data.title, data.subtitle, data.badge ?? { label: "Alert", tone: "warning" }),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "security":
      parts.push(heroBlock("security"));
      parts.push(
        titleBlock(data.title, data.subtitle, data.badge ?? { label: "Security", tone: "danger" }),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "approval":
      parts.push(heroBlock("approval"));
      parts.push(
        titleBlock(data.title, data.subtitle, data.badge ?? { label: "Approval required", tone: "warning" }),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "organization":
      parts.push(heroBlock("organization"));
      parts.push(
        titleBlock(data.title, data.subtitle, data.badge ?? { label: "Organization", tone: "info" }),
      );
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      break;

    case "notification":
    default:
      parts.push(heroBlock("report"));
      parts.push(titleBlock(data.title, data.subtitle, data.badge));
      if (data.body) parts.push(bodyBlock(escapeHtml(data.body)));
      if (data.details?.length) parts.push(detailsTable(data.details));
      if (data.quote) parts.push(quoteBlock(data.quote, data.quoteAuthor));
      break;
  }

  parts.push(
    ctaBlock(data.actionLabel, data.actionUrl, data.secondaryActionLabel, data.secondaryActionUrl),
  );

  if (data.footerNote) {
    parts.push(
      `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="padding:0 32px 20px;font-size:12px;color:${EMAIL_BRAND.colors.textMuted};text-align:center">${escapeHtml(data.footerNote)}</td></tr></table>`,
    );
  }

  return parts.join("");
}

export function renderEmailTemplate(
  kind: EmailTemplateKind,
  subject: string,
  data: EmailTemplateData,
  recipientEmail?: string,
): RenderedEmail {
  const content = renderContent(kind, data);
  return {
    subject,
    html: wrapEmail(content, data.preheader ?? data.title, recipientEmail),
    text: buildText(data),
  };
}
