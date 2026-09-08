import { NextResponse } from "next/server";
import { requireDashboardApiSession, unauthorizedDashboardResponse } from "@/lib/dashboard-api-auth";
import { inquiryStatuses, type Inquiry } from "@/lib/dashboard-data";
import { createInquiry } from "@/lib/supabase-dashboard";

export const runtime = "nodejs";

function isInquiry(value: unknown): value is Inquiry {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ["id", "couple", "eventDate", "location", "packageName", "source"].every((key) => typeof item[key] === "string" && item[key])
    && inquiryStatuses.includes(item.status as Inquiry["status"]);
}

export async function POST(request: Request) {
  if (!(await requireDashboardApiSession())) return unauthorizedDashboardResponse();
  try {
    const body: unknown = await request.json();
    if (!isInquiry(body)) return NextResponse.json({ error: "Data inquiry tidak lengkap." }, { status: 400 });
    return NextResponse.json(await createInquiry(body), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan inquiry." }, { status: 500 });
  }
}

