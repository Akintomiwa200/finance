"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { FeaturesHero } from "@/src/components/landing/features/features-hero";
import { FeaturesStats } from "@/src/components/landing/features/features-stats";
import { FeaturesList } from "@/src/components/landing/features/features-list";
import { FeaturesWorkflows } from "@/src/components/landing/features/features-workflows";
import { FeaturesFaq } from "@/src/components/landing/features/features-faq";

export default function FeaturesPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <FeaturesHero />
      <AboutPartners />
      <FeaturesStats />
      <FeaturesList />
      <FeaturesWorkflows />
      <FeaturesFaq />
      <HomeFooter />
    </div>
  );
}
