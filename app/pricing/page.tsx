"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { PricingHero } from "@/src/components/landing/pricing/pricing-hero";
import { PricingPlans } from "@/src/components/landing/pricing/pricing-plans";
import { PricingStats } from "@/src/components/landing/pricing/pricing-stats";
import { PricingBenefits } from "@/src/components/landing/pricing/pricing-benefits";
import { PricingFaq } from "@/src/components/landing/pricing/pricing-faq";

export default function PricingPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <PricingHero />
      <AboutPartners />
      <PricingPlans />
      <PricingStats />
      <PricingBenefits />
      <PricingFaq />
      <HomeFooter />
    </div>
  );
}
