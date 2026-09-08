import { NextResponse } from "next/server";
import { requireDashboardApiSession, unauthorizedDashboardResponse } from "@/lib/dashboard-api-auth";
import type { DashboardData } from "@/lib/dashboard-data";
import { getDashboardData, importDashboardData } from "@/lib/supabase-dashboard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await requireDashboardApiSession())) return unauthorizedDashboardResponse();
  try {
    const existing = await getDashboardData();
    if (existing.inquiries.length || existing.production.length) return NextResponse.json(existing);
    const body = await request.json() as DashboardData;
    if (!Array.isArray(body.inquiries) || !Array.isArray(body.production)) {
      return NextResponse.json({ error: "Data impor tidak valid." }, { status: 400 });
    }
    return NextResponse.json(await importDashboardData(body));
  } catch {
    return NextResponse.json({ error: "Gagal mengimpor data lama." }, { status: 500 });
  }
}

