"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { privacyContent } from "@/src/components/landing/legal/legal-content";
import { LegalBodySection } from "@/src/components/landing/legal/legal-body-section";
import { LegalHero, legalFaq } from "@/src/components/landing/legal/legal-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

const stats = [
  { value: "Private", label: "Your data stays yours" },
  { value: "Encrypted", label: "Industry-standard security" },
  { value: "No sale", label: "Of personal information" },
  { value: "Control", label: "Export and delete anytime" },
];

export default function PrivacyPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <LegalHero
        title="Your privacy"
        highlight="matters to us."
        subtitle="Learn how Audpay collects, uses, and protects your personal and financial information."
      />
      <AboutPartners />
      <LandingStatsSection stats={stats} />
      <LegalBodySection
        lastUpdated={privacyContent.lastUpdated}
        intro={privacyContent.intro}
        sections={privacyContent.sections}
      />
      <LandingFaqSection idPrefix="privacy" items={legalFaq} />
      <HomeFooter />
    </div>
  );
}
