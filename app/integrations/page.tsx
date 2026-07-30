"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { IntegrationsGridLive } from "@/src/components/landing/integrations/integrations-grid-live";
import {
  IntegrationsHero,
  integrationsFaq,
  integrationsStats,
} from "@/src/components/landing/integrations/integrations-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

export default function IntegrationsPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <IntegrationsHero />
      <AboutPartners />
      <LandingStatsSection stats={integrationsStats} />
      <IntegrationsGridLive />
      <LandingFaqSection idPrefix="integrations" items={integrationsFaq} />
      <HomeFooter />
    </div>
  );
}
