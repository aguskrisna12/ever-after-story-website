export interface ServicePackage {
  id: string;
  name: string;
  featured?: boolean;
  originalPrice: string;
  price: string;
  features: string[];
}

export const servicePackages: ServicePackage[] = [
  {
    id: "short-event",
    name: "Short Event",
    originalPrice: "Rp700.000",
    price: "Rp500.000",
    features: [
      "2.5 hours standby",
      "1 edited video (15–30 seconds)",
      "1 content creator",
      "Instagram takeover",
      "7 real-time Story posts",
      "All unedited videos via Google Drive",
    ],
  },
  {
    id: "half-event",
    name: "Half Event",
    originalPrice: "Rp1.000.000",
    price: "Rp800.000",
    features: [
      "4.5 hours standby",
      "2 edited videos (15–30 seconds)",
      "1–2 content creators",
      "Instagram takeover",
      "10 real-time Story posts",
      "All unedited videos via Google Drive",
    ],
  },
  {
    id: "full-event",
    name: "Full Event",
    originalPrice: "Rp1.600.000",
    price: "Rp1.300.000",
    features: [
      "8 hours standby",
      "3 edited videos (15–30 seconds)",
      "1–2 content creators",
      "Instagram takeover",
      "15 real-time Story posts",
      "All unedited videos via Google Drive",
    ],
  },
];
