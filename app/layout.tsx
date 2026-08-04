import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/content/site-config";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const metadataBase = siteConfig.siteUrl
  ? new URL(siteConfig.siteUrl)
  : new URL("https://everafterstory.example");

export const metadata: Metadata = {
  metadataBase,
  title: "Bali Wedding Content Creator | Ever After Story",
  description: siteConfig.description,
  alternates: siteConfig.siteUrl ? { canonical: siteConfig.siteUrl } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: "Bali Wedding Content Creator | Ever After Story",
    description: siteConfig.description,
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Ever After Story — Bali Wedding Content Creator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bali Wedding Content Creator | Ever After Story",
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
