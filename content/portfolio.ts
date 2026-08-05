export interface PortfolioStory {
  couple: string;
  location: string;
  category: string;
  alt: string;
  image: string;
  objectPosition: string;
}

export const portfolioStories: PortfolioStory[] = [
  { couple: "Maya & Julian", location: "Uluwatu, Bali", category: "Clifftop Wedding", alt: "Balinese wedding couple walking together in a temple courtyard", image: "/images/bali-wedding-couple-wide.jpg", objectPosition: "75% center" },
  { couple: "Sofia & Liam", location: "Canggu, Bali", category: "Villa Wedding", alt: "Bride in traditional Balinese wedding attire adjusting her earring", image: "/images/bali-wedding-bride-portrait.jpg", objectPosition: "50% 38%" },
  { couple: "Ayu & Theo", location: "Sanur, Bali", category: "Intimate Wedding", alt: "Balinese wedding couple sharing a warm look at golden hour", image: "/images/bali-wedding-couple-portrait.jpg", objectPosition: "56% 42%" },
  { couple: "Elena & Marco", location: "Ubud, Bali", category: "Garden Wedding", alt: "Traditional Balinese bride portrait framed by carved temple details", image: "/images/bali-wedding-bride-portrait.jpg", objectPosition: "50% 55%" },
  { couple: "Amelia & Noah", location: "Nusa Dua, Bali", category: "Destination Wedding", alt: "Newlyweds in Balinese attire standing in a tropical courtyard", image: "/images/bali-wedding-couple-wide.jpg", objectPosition: "82% center" },
  { couple: "Claire & Ben", location: "Seminyak, Bali", category: "Behind the Scenes", alt: "Candid close portrait of a Balinese wedding couple", image: "/images/bali-wedding-couple-portrait.jpg", objectPosition: "62% 58%" },
];
