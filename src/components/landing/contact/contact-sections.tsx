import { LandingImageHero } from "@/src/components/landing/shared/landing-image-hero";

const heroImages = {
  main: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=680&h=440&fit=crop&q=80",
};

export function ContactHero() {
  return (
    <LandingImageHero
      title="We'd love to"
      highlight="hear from you."
      subtitle="Questions about Audpay, partnerships, or enterprise plans — our team responds within one business day."
      images={heroImages}
      alt={{
        main: "Customer support team at work",
        top: "Business meeting in office",
        bottom: "Team collaborating on laptops",
      }}
    />
  );
}

export const contactStats = [
  { value: "<24h", label: "Average response time" },
  { value: "24/7", label: "Support availability" },
  { value: "98%", label: "Customer satisfaction" },
  { value: "Global", label: "Support coverage" },
];

export const contactFaq = [
  {
    question: "How quickly will I get a response?",
    category: "Support",
    preview: "Most inquiries answered within one day",
    answer:
      "Our team typically responds to contact form submissions and emails within one business day. Enterprise customers receive priority support.",
  },
  {
    question: "Can I schedule a product demo?",
    category: "Sales",
    preview: "Book a walkthrough with our team",
    answer:
      "Yes. Mention demo in your message and include your company size and use case. We will follow up with available times.",
  },
  {
    question: "Where are you located?",
    category: "Company",
    preview: "HQ in San Francisco, team worldwide",
    answer:
      "Audpay is headquartered in San Francisco with team members across North America and Europe serving customers globally.",
  },
];
