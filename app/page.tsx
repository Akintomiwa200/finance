import { HomeHero } from "@/src/components/landing/home-hero";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFeatures } from "@/src/components/landing/home-features";
import { HomeAdvantages } from "@/src/components/landing/home-advantages";
import HomeTestimonials from "@/src/components/landing/home-testimonials";
import { HomeFaq } from "@/src/components/landing/home-faq";
import { HomeCta } from "@/src/components/landing/home-cta";
import { HomeFooter } from "@/src/components/landing/home-footer";

export default function UifryLandingPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <HomeHero />
      <HomeFeatures />
      <HomeAdvantages />
      <HomeTestimonials />
      <HomeFaq />
      <HomeCta />
      <HomeFooter />
    </div>
  );
}
