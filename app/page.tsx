import { HomeHero } from "@/src/components/landing/home-hero";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFeatures } from "@/src/components/landing/home-features";
import { HomeAdvantages } from "@/src/components/landing/home-advantages";
import { HomeCustomizable } from "@/src/components/landing/home-customizable";
import { HomeTestimonials } from "@/src/components/landing/home-testimonials";
import { HomeFaq } from "@/src/components/landing/home-faq";
import { HomeCta } from "@/src/components/landing/home-cta";
import { HomeFooter } from "@/src/components/landing/home-footer";
import "@/src/styles/uifry-landing-sections.css";

export default function UifryLandingPage() {
  return (
    <div className="uifry-landing font-sans">
      <div className="uifry-top bg-white">
        <HomeNavbar />
        <HomeHero />
      </div>
      <HomeFeatures />
      <HomeAdvantages />
      <HomeCustomizable />
      <HomeTestimonials />
      <HomeFaq />
      <HomeCta />
      <HomeFooter />
    </div>
  );
}
