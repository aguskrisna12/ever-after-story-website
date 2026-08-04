export interface ServicePackage {
  id: string;
  name: string;
  featured?: boolean;
  features: string[];
}

export const servicePackages: ServicePackage[] = [
  { id: "intimate", name: "The Intimate Story", features: ["Up to 4 hours coverage", "One wedding content creator", "Curated vertical clips", "One edited highlight Reel", "Fast preview delivery"] },
  { id: "signature", name: "The Signature Story", featured: true, features: ["Up to 8 hours coverage", "One dedicated content creator", "Curated vertical clips", "Two edited Reels", "Behind-the-scenes moments", "Fast preview delivery"] },
  { id: "complete", name: "The Complete Story", features: ["Up to 12 hours coverage", "Extended wedding-day coverage", "Curated vertical clips", "Three edited Reels", "Ceremony and reception moments", "Priority content delivery"] },
];
