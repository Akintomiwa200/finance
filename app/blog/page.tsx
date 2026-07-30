"use client";

import { HomeNavbar } from "@/src/components/landing/home-navbar";
import { HomeFooter } from "@/src/components/landing/home-footer";
import { AboutPartners } from "@/src/components/landing/about/about-partners";
import { BlogPostsLive } from "@/src/components/landing/blog/blog-posts-live";
import {
  BlogHero,
  blogFaq,
  blogStats,
} from "@/src/components/landing/blog/blog-sections";
import { LandingFaqSection } from "@/src/components/landing/shared/landing-faq-section";
import { LandingStatsSection } from "@/src/components/landing/shared/landing-stats-section";

export default function BlogPage() {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      <BlogHero />
      <AboutPartners />
      <LandingStatsSection stats={blogStats} />
      <BlogPostsLive />
      <LandingFaqSection idPrefix="blog" items={blogFaq} />
      <HomeFooter />
    </div>
  );
}
