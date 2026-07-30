"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { ContactFormSection } from "@/src/components/landing/contact/contact-form-section";
import {
  ContactHero,
  contactFaq,
  contactStats,
} from "@/src/components/landing/contact/contact-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <ContactHero />
      <AboutPartners />
      <LandingStatsSection stats={contactStats} />
      <ContactFormSection />
      <LandingFaqSection idPrefix="contact" items={contactFaq} />
      <HomeFooter />
    </div>
  );
}
