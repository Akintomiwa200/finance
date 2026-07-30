"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { cookiesContent } from "@/src/components/landing/legal/legal-content";
import { LegalBodySection } from "@/src/components/landing/legal/legal-body-section";
import { LegalHero, legalFaq } from "@/src/components/landing/legal/legal-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

const stats = [
  { value: "Essential", label: "Cookies for core features" },
  { value: "Optional", label: "Analytics with consent" },
  { value: "Control", label: "Browser settings" },
  { value: "Transparent", label: "Clear cookie policy" },
];

export default function CookiesPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <LegalHero
        title="How we use"
        highlight="cookies."
        subtitle="Understand what cookies Audpay uses and how you can manage your preferences."
      />
      <AboutPartners />
      <LandingStatsSection stats={stats} />
      <LegalBodySection
        lastUpdated={cookiesContent.lastUpdated}
        intro={cookiesContent.intro}
        sections={cookiesContent.sections}
      />
      <LandingFaqSection idPrefix="cookies" items={legalFaq} />
      <HomeFooter />
    </div>
  );
}
