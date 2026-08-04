export const siteConfig = {
  name: "Ever After Story",
  tagline: "Every Love Has a Story",
  location: "Bali, Indonesia",
  description:
    "Ever After Story creates natural, emotional, and social-ready wedding content for couples celebrating their love in Bali.",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/everafterstory.id/",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "",
} as const;

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;
