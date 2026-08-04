import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.siteUrl ? [{ url: siteConfig.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }] : [];
}
