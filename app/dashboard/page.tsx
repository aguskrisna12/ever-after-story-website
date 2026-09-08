import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/DashboardClient";
import { DASHBOARD_SESSION_COOKIE, verifyDashboardSession } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Studio Dashboard",
  description: "Workspace operasional Ever After Story untuk inquiry, jadwal wedding, dan progres produksi konten.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!verifyDashboardSession(cookieStore.get(DASHBOARD_SESSION_COOKIE)?.value)) {
    redirect("/dashboard/login");
  }

  return <DashboardClient username={process.env.DASHBOARD_USERNAME ?? "Admin"} />;
}
