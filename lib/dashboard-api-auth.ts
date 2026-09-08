import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_SESSION_COOKIE, verifyDashboardSession } from "@/lib/dashboard-auth";

export async function requireDashboardApiSession() {
  const cookieStore = await cookies();
  return verifyDashboardSession(cookieStore.get(DASHBOARD_SESSION_COOKIE)?.value);
}

export function unauthorizedDashboardResponse() {
  return NextResponse.json({ error: "Sesi login tidak valid atau sudah berakhir." }, { status: 401 });
}

