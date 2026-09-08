import { NextResponse } from "next/server";
import { requireDashboardApiSession, unauthorizedDashboardResponse } from "@/lib/dashboard-api-auth";
import { inquiryStatuses, type Inquiry } from "@/lib/dashboard-data";
import { deleteInquiry, updateInquiry } from "@/lib/supabase-dashboard";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function isInquiryUpdate(value: unknown): value is Omit<Inquiry, "id"> {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ["couple", "eventDate", "location", "packageName", "source"].every((key) => typeof item[key] === "string" && item[key])
    && inquiryStatuses.includes(item.status as Inquiry["status"]);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await requireDashboardApiSession())) return unauthorizedDashboardResponse();
  try {
    const body: unknown = await request.json();
    if (!isInquiryUpdate(body)) return NextResponse.json({ error: "Data inquiry tidak lengkap." }, { status: 400 });
    const { id } = await params;
    return NextResponse.json(await updateInquiry(id, body));
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui inquiry." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await requireDashboardApiSession())) return unauthorizedDashboardResponse();
  try {
    const { id } = await params;
    await deleteInquiry(id);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus inquiry." }, { status: 500 });
  }
}

