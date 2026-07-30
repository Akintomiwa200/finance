"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { termsContent } from "@/src/components/landing/legal/legal-content";
import { LegalBodySection } from "@/src/components/landing/legal/legal-body-section";
import { LegalHero, legalFaq } from "@/src/components/landing/legal/legal-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

const stats = [
  { value: "Transparent", label: "Terms for all users" },
  { value: "Updated", label: "March 2026" },
  { value: "Fair", label: "Usage policies" },
  { value: "Secure", label: "Data ownership" },
];

export default function TermsPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <LegalHero
        title="Clear terms for"
        highlight="every user."
        subtitle="Understand the rules, rights, and responsibilities that apply when you use Audpay."
      />
      <AboutPartners />
      <LandingStatsSection stats={stats} />
      <LegalBodySection
        lastUpdated={termsContent.lastUpdated}
        intro={termsContent.intro}
        sections={termsContent.sections}
      />
      <LandingFaqSection idPrefix="terms" items={legalFaq} />
      <HomeFooter />
    </div>
  );
}
