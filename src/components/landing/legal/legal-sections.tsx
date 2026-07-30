import { LandingImageHero } from "@/src/components/landing/shared/landing-image-hero";

const heroImages = {
  main: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=680&h=960&fit=crop&q=80",
  top: "https://images.unsplash.com/photo-1589829545855-d10d557cf95f?w=680&h=440&fit=crop&q=80",
  bottom: "https://images.unsplash.com/photo-1505664194772-degucebfae88?w=680&h=440&fit=crop&q=80",
};

export function LegalHero({
  title,
  highlight,
  subtitle,
}: {
  title: string;
  highlight: string;
  subtitle: string;
}) {
  return (
    <LandingImageHero
      title={title}
      highlight={highlight}
      subtitle={subtitle}
      images={heroImages}
      alt={{
        main: "Legal documents and compliance",
        top: "Professional reviewing policy documents",
        bottom: "Secure data and privacy concept",
      }}
    />
  );
}

export const legalFaq = [
  {
    question: "Who should I contact about legal questions?",
    category: "Contact",
    preview: "Reach our legal and privacy teams",
    answer:
      "For terms-related questions email legal@audpay.com. For privacy or GDPR requests email privacy@audpay.com.",
  },
  {
    question: "How often are policies updated?",
    category: "Updates",
    preview: "Reviewed regularly with posted dates",
    answer:
      "We review our legal policies regularly and update this page whenever material changes are made. The last updated date appears at the top of each document.",
  },
  {
    question: "Where is Audpay data stored?",
    category: "Privacy",
    preview: "Secure cloud infrastructure",
    answer:
      "Audpay stores data in secure, SOC 2 compliant data centers. Enterprise customers can discuss regional data residency requirements with our team.",
  },
];
