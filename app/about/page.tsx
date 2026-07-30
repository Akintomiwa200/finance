"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutHero } from "@/src/components/landing/about/about-hero";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { AboutStats } from "@/src/components/landing/about/about-stats";
import { AboutTeam } from "@/src/components/landing/about/about-team";
import { AboutGlobal } from "@/src/components/landing/about/about-global";
import { AboutFaq } from "@/src/components/landing/about/about-faq";

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <AboutHero />
      <AboutPartners />
      <AboutStats />
      <AboutTeam />
      <AboutGlobal />
      <AboutFaq />
      <HomeFooter />
    </div>
  );
}
