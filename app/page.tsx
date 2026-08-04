import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimonialSection } from "@/components/TestimonialSection";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Bali Wedding Content Creator | Ever After Story",
  description:
    "Ever After Story creates natural, emotional, and social-ready wedding content for couples celebrating their love in Bali.",
};

export default function Home() {
  const structuredData = siteConfig.siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.siteUrl,
        areaServed: "Bali, Indonesia",
        sameAs: [siteConfig.instagramUrl],
      }
    : null;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <BenefitsSection />
        <ServicesSection />
        <ProcessSection />
        <TestimonialSection />
        <ContactSection />
      </main>
      <SiteFooter />
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}
    </>
  );
}
