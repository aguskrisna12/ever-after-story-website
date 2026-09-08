import { NextResponse } from "next/server";
import { requireDashboardApiSession, unauthorizedDashboardResponse } from "@/lib/dashboard-api-auth";
import { productionStatuses, type ProductionItem } from "@/lib/dashboard-data";
import { updateProductionItem } from "@/lib/supabase-dashboard";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await requireDashboardApiSession())) return unauthorizedDashboardResponse();
  try {
    const body = await request.json() as Partial<ProductionItem>;
    if (!productionStatuses.includes(body.status as ProductionItem["status"]) || typeof body.progress !== "number" || body.progress < 0 || body.progress > 100) {
      return NextResponse.json({ error: "Progres produksi tidak valid." }, { status: 400 });
    }
    const { id } = await params;
    return NextResponse.json(await updateProductionItem(id, { status: body.status as ProductionItem["status"], progress: body.progress }));
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui produksi." }, { status: 500 });
  }
}

