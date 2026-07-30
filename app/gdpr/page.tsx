"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { gdprContent } from "@/src/components/landing/legal/legal-content";
import { LegalBodySection } from "@/src/components/landing/legal/legal-body-section";
import { LegalHero, legalFaq } from "@/src/components/landing/legal/legal-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

const stats = [
  { value: "GDPR", label: "Compliant processing" },
  { value: "EEA", label: "User rights supported" },
  { value: "DPA", label: "Available on request" },
  { value: "SCCs", label: "For data transfers" },
];

export default function GdprPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <LegalHero
        title="GDPR"
        highlight="compliance."
        subtitle="How Audpay protects the rights of users in the European Economic Area and United Kingdom."
      />
      <AboutPartners />
      <LandingStatsSection stats={stats} />
      <LegalBodySection
        lastUpdated={gdprContent.lastUpdated}
        intro={gdprContent.intro}
        sections={gdprContent.sections}
      />
      <LandingFaqSection idPrefix="gdpr" items={legalFaq} />
      <HomeFooter />
    </div>
  );
}
