import type { Metadata } from "next";
import { DashboardClient } from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Studio Dashboard",
  description: "Workspace operasional Ever After Story untuk inquiry, jadwal wedding, dan progres produksi konten.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
