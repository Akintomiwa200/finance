import type { LegalSection } from "@/src/components/landing/shared/landing-legal-types";

type LegalPageContent = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const termsContent: LegalPageContent = {
  title: "Terms of Service",
  lastUpdated: "March 1, 2026",
  intro:
    "These Terms of Service govern your access to and use of Audpay's platform, website, and related services. By using Audpay, you agree to these terms.",
  sections: [
    {
      title: "1. Acceptance of Terms",
      paragraphs: [
        "By creating an account or using Audpay, you confirm that you have the authority to bind your organization to these terms and that you will comply with all applicable laws.",
      ],
    },
    {
      title: "2. Use of the Service",
      paragraphs: [
        "You may use Audpay only for lawful business purposes. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
        "You agree not to misuse the platform, attempt unauthorized access, or interfere with the security or performance of our services.",
      ],
    },
    {
      title: "3. Subscriptions and Billing",
      paragraphs: [
        "Paid plans renew according to the billing cycle selected at checkout unless cancelled before the renewal date. Fees are non-refundable except where required by law.",
        "We may update pricing with reasonable notice. Continued use after a pricing change constitutes acceptance of the new rates.",
      ],
    },
    {
      title: "4. Data and Privacy",
      paragraphs: [
        "Your use of Audpay is also governed by our Privacy Policy. You retain ownership of your business data and grant Audpay a limited license to process it solely to provide the service.",
      ],
    },
    {
      title: "5. Limitation of Liability",
      paragraphs: [
        "Audpay is provided on an 'as is' basis. To the fullest extent permitted by law, Audpay is not liable for indirect, incidental, or consequential damages arising from your use of the platform.",
      ],
    },
    {
      title: "6. Contact",
      paragraphs: [
        "Questions about these terms can be sent to legal@audpay.com.",
      ],
    },
  ] satisfies LegalPageContent["sections"],
};

export const privacyContent: LegalPageContent = {
  title: "Privacy Policy",
  lastUpdated: "March 1, 2026",
  intro:
    "Audpay respects your privacy. This policy explains what information we collect, how we use it, and the choices you have regarding your data.",
  sections: [
    {
      title: "Information We Collect",
      paragraphs: [
        "We collect information you provide directly, such as account details, billing information, and financial records you upload to the platform.",
        "We also collect usage data, device information, and log data to improve security, performance, and product experience.",
      ],
    },
    {
      title: "How We Use Information",
      paragraphs: [
        "We use your information to operate and improve Audpay, process transactions, provide customer support, and communicate product updates.",
        "We do not sell your personal information to third parties.",
      ],
    },
    {
      title: "Data Sharing",
      paragraphs: [
        "We may share data with trusted service providers who help us deliver the platform, such as hosting, payment processing, and analytics partners, under strict confidentiality obligations.",
        "We may disclose information when required by law or to protect the rights and safety of Audpay and its users.",
      ],
    },
    {
      title: "Your Rights",
      paragraphs: [
        "Depending on your location, you may have the right to access, correct, delete, or export your personal data. Contact privacy@audpay.com to submit a request.",
      ],
    },
    {
      title: "Data Retention",
      paragraphs: [
        "We retain account and financial data for as long as your subscription is active and for a reasonable period afterward to comply with legal and accounting obligations.",
      ],
    },
  ] satisfies LegalPageContent["sections"],
};

export const cookiesContent: LegalPageContent = {
  title: "Cookie Policy",
  lastUpdated: "March 1, 2026",
  intro:
    "This Cookie Policy explains how Audpay uses cookies and similar technologies when you visit our website or use our application.",
  sections: [
    {
      title: "What Are Cookies",
      paragraphs: [
        "Cookies are small text files stored on your device. They help websites remember preferences, keep you signed in, and understand how the product is used.",
      ],
    },
    {
      title: "Types of Cookies We Use",
      paragraphs: [
        "Essential cookies are required for authentication, security, and core platform functionality.",
        "Analytics cookies help us understand usage patterns so we can improve performance and user experience.",
        "Preference cookies remember settings such as language, theme, and display options.",
      ],
    },
    {
      title: "Managing Cookies",
      paragraphs: [
        "You can control cookies through your browser settings. Disabling essential cookies may limit your ability to use certain features of Audpay.",
        "Where required, we will request consent before placing non-essential cookies.",
      ],
    },
    {
      title: "Updates",
      paragraphs: [
        "We may update this policy from time to time. Material changes will be posted on this page with an updated effective date.",
      ],
    },
  ] satisfies LegalPageContent["sections"],
};

export const gdprContent: LegalPageContent = {
  title: "GDPR Compliance",
  lastUpdated: "March 1, 2026",
  intro:
    "Audpay is committed to compliance with the General Data Protection Regulation (GDPR) for customers and users in the European Economic Area and United Kingdom.",
  sections: [
    {
      title: "Legal Basis for Processing",
      paragraphs: [
        "We process personal data based on contractual necessity, legitimate interests, legal obligations, and consent where applicable.",
      ],
    },
    {
      title: "Data Subject Rights",
      paragraphs: [
        "Under GDPR, you have the right to access, rectify, erase, restrict, or object to processing of your personal data, as well as the right to data portability.",
        "You may also withdraw consent at any time where processing is based on consent, without affecting the lawfulness of prior processing.",
      ],
    },
    {
      title: "International Transfers",
      paragraphs: [
        "When personal data is transferred outside the EEA or UK, Audpay uses appropriate safeguards such as Standard Contractual Clauses approved by relevant authorities.",
      ],
    },
    {
      title: "Data Protection Officer",
      paragraphs: [
        "For GDPR-related inquiries, contact our privacy team at privacy@audpay.com or write to Audpay, 100 Market Street, Suite 400, San Francisco, CA 94105.",
      ],
    },
    {
      title: "Supervisory Authority",
      paragraphs: [
        "You have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.",
      ],
    },
  ] satisfies LegalPageContent["sections"],
};
