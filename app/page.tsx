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
import { servicePackages } from "@/content/services";
import { siteConfig } from "@/content/site-config";

export default function Home() {
  const businessId = `${siteConfig.siteUrl}/#business`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: siteConfig.name,
        slogan: siteConfig.tagline,
        description: siteConfig.description,
        url: siteConfig.siteUrl,
        image: `${siteConfig.siteUrl}/og.png`,
        logo: `${siteConfig.siteUrl}/images/ever-after-story-logo-transparent.png`,
        address: {
          "@type": "PostalAddress",
          addressRegion: "Bali",
          addressCountry: "ID",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Bali, Indonesia",
        },
        serviceType: [
          "Wedding content creation",
          "Destination wedding content",
          "Social-ready wedding videos",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Wedding Content Creation Packages",
          itemListElement: servicePackages.map((service) => ({
            "@type": "Offer",
            name: service.name,
            priceCurrency: "IDR",
            price: service.price.replace(/\D/g, ""),
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.features.join(", "),
            },
          })),
        },
        sameAs: [siteConfig.instagramUrl],
        ...(siteConfig.whatsappNumber
          ? {
              telephone: `+${siteConfig.whatsappNumber}`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: `+${siteConfig.whatsappNumber}`,
                contactType: "customer service",
                areaServed: "ID",
                availableLanguage: ["English", "Indonesian"],
              },
            }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en",
        publisher: { "@id": businessId },
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
