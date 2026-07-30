"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { CareersContentLive } from "@/src/components/landing/careers/careers-content-live";
import {
  CareersHero,
  careersFaq,
  careersStats,
} from "@/src/components/landing/careers/careers-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

export default function CareersPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <CareersHero />
      <AboutPartners />
      <LandingStatsSection stats={careersStats} />
      <CareersContentLive />
      <LandingFaqSection idPrefix="careers" items={careersFaq} />
      <HomeFooter />
    </div>
  );
}
