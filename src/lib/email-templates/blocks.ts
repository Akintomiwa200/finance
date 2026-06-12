import { EMAIL_BRAND, getInlineLogoSvg, getLogoUrl } from "@/src/lib/email-brand";
import type { EmailBadgeTone, EmailDetailRow, EmailHeroIcon, EmailLineItem, EmailStatCard } from "./types";

const { colors, name, tagline, supportEmail, companyAddress } = EMAIL_BRAND;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function badgeColors(tone: EmailBadgeTone = "info") {
  switch (tone) {
    case "success":
      return { bg: colors.successBg, text: colors.success };
    case "warning":
      return { bg: colors.warningBg, text: colors.warning };
    case "danger":
      return { bg: colors.dangerBg, text: colors.danger };
    case "neutral":
      return { bg: colors.surface, text: colors.textMuted };
    default:
      return { bg: colors.infoBg, text: colors.info };
  }
}

const HERO_ICONS: Record<EmailHeroIcon, { emoji: string; bg: string }> = {
  welcome: { emoji: "👋", bg: colors.primaryLight },
  payment: { emoji: "💳", bg: colors.successBg },
  invoice: { emoji: "🧾", bg: colors.primaryLight },
  support: { emoji: "🎧", bg: colors.infoBg },
  "live-fix": { emoji: "🖥️", bg: "#f3e8ff" },
  report: { emoji: "📊", bg: colors.primaryLight },
  alert: { emoji: "⚠️", bg: colors.warningBg },
  security: { emoji: "🔒", bg: colors.dangerBg },
  approval: { emoji: "✅", bg: colors.successBg },
  organization: { emoji: "🏢", bg: colors.primaryLight },
};

export function emailHeader(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:24px 32px 16px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="vertical-align:middle">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle">${getInlineLogoSvg(28)}</td>
                  <td style="vertical-align:middle">
                    <span style="font-size:20px;font-weight:700;color:${colors.text};letter-spacing:-0.02em">${escapeHtml(name)}</span>
                    <span style="color:${colors.logoRed}">.</span>
                  </td>
                </tr>
              </table>
            </td>
            <td align="right" style="vertical-align:middle;font-size:12px;color:${colors.textMuted}">${escapeHtml(tagline)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export function emailFooter(recipientEmail?: string): string {
  const year = new Date().getFullYear();
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${colors.surface};border-top:1px solid ${colors.border}">
    <tr>
      <td style="padding:24px 32px;font-size:12px;line-height:1.6;color:${colors.textMuted}">
        <p style="margin:0 0 8px">Questions? Contact us at <a href="mailto:${escapeHtml(supportEmail)}" style="color:${colors.primary};text-decoration:none">${escapeHtml(supportEmail)}</a></p>
        ${recipientEmail ? `<p style="margin:0 0 8px">This email was sent to ${escapeHtml(recipientEmail)}</p>` : ""}
        <p style="margin:0 0 4px">${escapeHtml(companyAddress)}</p>
        <p style="margin:0">© ${year} ${escapeHtml(name)}. All rights reserved.</p>
      </td>
    </tr>
  </table>`;
}

export function heroBlock(icon: EmailHeroIcon = "report"): string {
  const hero = HERO_ICONS[icon] ?? HERO_ICONS.report;
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:8px 32px 20px">
        <div style="width:72px;height:72px;border-radius:20px;background:${hero.bg};line-height:72px;font-size:32px;text-align:center">${hero.emoji}</div>
      </td>
    </tr>
  </table>`;
}

export function titleBlock(title: string, subtitle?: string, badge?: { label: string; tone?: EmailBadgeTone }): string {
  const badgeHtml = badge
    ? (() => {
        const c = badgeColors(badge.tone);
        return `<span style="display:inline-block;margin-bottom:12px;padding:4px 10px;border-radius:999px;background:${c.bg};color:${c.text};font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase">${escapeHtml(badge.label)}</span>`;
      })()
    : "";

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 12px;text-align:center">
        ${badgeHtml}
        <h1 style="margin:0 0 8px;font-size:26px;line-height:1.25;font-weight:700;color:${colors.text}">${escapeHtml(title)}</h1>
        ${subtitle ? `<p style="margin:0;font-size:15px;line-height:1.6;color:${colors.textMuted}">${escapeHtml(subtitle)}</p>` : ""}
      </td>
    </tr>
  </table>`;
}

export function bodyBlock(body: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:8px 32px 20px;font-size:15px;line-height:1.7;color:#334155">${body.replace(/\n/g, "<br />")}</td>
    </tr>
  </table>`;
}

export function detailsTable(rows: EmailDetailRow[]): string {
  const rowsHtml = rows
    .map(
      (row) => `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${colors.border};font-size:13px;color:${colors.textMuted};width:40%">${escapeHtml(row.label)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid ${colors.border};font-size:14px;color:${row.highlight ? colors.primary : colors.text};font-weight:${row.highlight ? "700" : "500"};text-align:right">${escapeHtml(row.value)}</td>
      </tr>`,
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ${colors.border};border-radius:12px;overflow:hidden;background:#fff">
          ${rowsHtml}
        </table>
      </td>
    </tr>
  </table>`;
}

export function lineItemsTable(items: EmailLineItem[], summary?: { subtotal?: string; discount?: string; tax?: string; total?: string }): string {
  const itemsHtml = items
    .map(
      (item) => `<tr>
        <td style="padding:14px 16px;border-bottom:1px solid ${colors.border}">
          <div style="font-size:14px;font-weight:600;color:${colors.text}">${escapeHtml(item.name)}</div>
          ${item.description ? `<div style="font-size:12px;color:${colors.textMuted};margin-top:2px">${escapeHtml(item.description)}</div>` : ""}
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid ${colors.border};font-size:13px;color:${colors.textMuted};text-align:center;white-space:nowrap">${escapeHtml(item.quantity ?? "1")}</td>
        <td style="padding:14px 16px;border-bottom:1px solid ${colors.border};font-size:14px;font-weight:600;color:${colors.text};text-align:right;white-space:nowrap">${escapeHtml(item.amount)}</td>
      </tr>`,
    )
    .join("");

  const summaryRows = [
    summary?.subtotal ? { label: "Subtotal", value: summary.subtotal } : null,
    summary?.discount ? { label: "Discount", value: summary.discount } : null,
    summary?.tax ? { label: "Tax", value: summary.tax } : null,
    summary?.total ? { label: "Total", value: summary.total, bold: true } : null,
  ].filter(Boolean) as { label: string; value: string; bold?: boolean }[];

  const summaryHtml =
    summaryRows.length > 0
      ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:4px">
          ${summaryRows
            .map(
              (row) => `<tr>
                <td style="padding:8px 16px;font-size:13px;color:${colors.textMuted}">${escapeHtml(row.label)}</td>
                <td style="padding:8px 16px;font-size:${row.bold ? "18" : "14"}px;font-weight:${row.bold ? "700" : "500"};color:${colors.text};text-align:right">${escapeHtml(row.value)}</td>
              </tr>`,
            )
            .join("")}
        </table>`
      : "";

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ${colors.border};border-radius:12px;overflow:hidden">
          <tr style="background:${colors.surface}">
            <th align="left" style="padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${colors.textMuted}">Item</th>
            <th style="padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${colors.textMuted}">Qty</th>
            <th align="right" style="padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${colors.textMuted}">Amount</th>
          </tr>
          ${itemsHtml}
        </table>
        ${summaryHtml}
      </td>
    </tr>
  </table>`;
}

export function statsGrid(stats: EmailStatCard[]): string {
  const toneBg = { blue: colors.primaryLight, green: colors.successBg, amber: colors.warningBg, red: colors.dangerBg };
  const toneText = { blue: colors.primary, green: colors.success, amber: colors.warning, red: colors.danger };

  const cells = stats
    .map((stat) => {
      const tone = stat.tone ?? "blue";
      return `<td width="50%" style="padding:6px;vertical-align:top">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${toneBg[tone]};border-radius:12px">
          <tr>
            <td style="padding:16px">
              <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${colors.textMuted}">${escapeHtml(stat.label)}</div>
              <div style="margin-top:6px;font-size:24px;font-weight:700;color:${toneText[tone]}">${escapeHtml(stat.value)}</div>
            </td>
          </tr>
        </table>
      </td>`;
    })
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>${cells}</tr></table>
      </td>
    </tr>
  </table>`;
}

export function quoteBlock(quote: string, author?: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${colors.surface};border-left:4px solid ${colors.primary};border-radius:0 12px 12px 0">
          <tr>
            <td style="padding:16px 20px;font-size:14px;line-height:1.7;color:#334155;font-style:italic">${escapeHtml(quote).replace(/\n/g, "<br />")}</td>
          </tr>
          ${author ? `<tr><td style="padding:0 20px 16px;font-size:12px;font-weight:600;color:${colors.textMuted}">— ${escapeHtml(author)}</td></tr>` : ""}
        </table>
      </td>
    </tr>
  </table>`;
}

export function checklistBlock(items: string[]): string {
  const itemsHtml = items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;vertical-align:top;width:24px;color:${colors.success};font-size:16px">✓</td>
        <td style="padding:8px 0;font-size:14px;line-height:1.5;color:#334155">${escapeHtml(item)}</td>
      </tr>`,
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${itemsHtml}</table>
      </td>
    </tr>
  </table>`;
}

export function promoBanner(text: string, code?: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:0 32px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:linear-gradient(135deg,${colors.primary} 0%,${colors.primaryDark} 100%);border-radius:12px">
          <tr>
            <td style="padding:20px 24px;text-align:center;color:#fff">
              <div style="font-size:15px;font-weight:600">${escapeHtml(text)}</div>
              ${code ? `<div style="margin-top:8px;display:inline-block;padding:6px 14px;background:rgba(255,255,255,.2);border-radius:8px;font-size:14px;font-weight:700;letter-spacing:.08em">${escapeHtml(code)}</div>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export function ctaBlock(
  primaryLabel?: string,
  primaryUrl?: string,
  secondaryLabel?: string,
  secondaryUrl?: string,
): string {
  if (!primaryUrl && !secondaryUrl) return "";

  const primary = primaryUrl
    ? `<a href="${escapeHtml(primaryUrl)}" style="display:inline-block;background:${colors.primary};color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;margin:4px 6px">${escapeHtml(primaryLabel ?? "Open in app")}</a>`
    : "";

  const secondary = secondaryUrl
    ? `<a href="${escapeHtml(secondaryUrl)}" style="display:inline-block;background:#fff;color:${colors.text};text-decoration:none;padding:13px 26px;border-radius:10px;font-size:14px;font-weight:600;border:1px solid ${colors.border};margin:4px 6px">${escapeHtml(secondaryLabel ?? "Learn more")}</a>`
    : "";

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:4px 32px 28px">${primary}${secondary}</td>
    </tr>
  </table>`;
}

export function wrapEmail(content: string, preheader?: string, recipientEmail?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(name)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:${colors.text}">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(preheader ?? "")}</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#eef2f7;padding:32px 16px">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08)">
          <tr><td>${emailHeader()}</td></tr>
          <tr><td>${content}</td></tr>
          <tr><td>${emailFooter(recipientEmail)}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:${colors.textMuted}">
          <img src="${escapeHtml(getLogoUrl())}" width="16" height="16" alt="" style="vertical-align:middle;margin-right:4px" />
          Powered by ${escapeHtml(name)}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
