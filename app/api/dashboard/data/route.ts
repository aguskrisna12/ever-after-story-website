import { NextResponse } from "next/server";
import { requireDashboardApiSession, unauthorizedDashboardResponse } from "@/lib/dashboard-api-auth";
import { getDashboardData, SupabaseConfigurationError } from "@/lib/supabase-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireDashboardApiSession())) return unauthorizedDashboardResponse();
  try {
    return NextResponse.json(await getDashboardData());
  } catch (error) {
    const status = error instanceof SupabaseConfigurationError ? 503 : 500;
    return NextResponse.json({ error: status === 503 ? "Database belum dikonfigurasi." : "Gagal mengambil data dashboard." }, { status });
  }
}

