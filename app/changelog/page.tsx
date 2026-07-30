"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import {
  ChangelogHero,
  changelogFaq,
  changelogStats,
} from "@/src/components/landing/changelog/changelog-sections";
import { ChangelogTimelineLive } from "@/src/components/landing/changelog/changelog-timeline-live";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

export default function ChangelogPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <ChangelogHero />
      <AboutPartners />
      <LandingStatsSection stats={changelogStats} />
      <ChangelogTimelineLive />
      <LandingFaqSection idPrefix="changelog" items={changelogFaq} />
      <HomeFooter />
    </div>
  );
}
