import type { DashboardData, Inquiry, ProductionItem } from "@/lib/dashboard-data";

type InquiryRow = {
  id: string;
  couple: string;
  event_date: string;
  location: string;
  package_name: string;
  source: string;
  status: Inquiry["status"];
};

type ProductionRow = {
  id: string;
  couple: string;
  deliverable: string;
  due_date: string;
  progress: number;
  status: ProductionItem["status"];
};

export class SupabaseConfigurationError extends Error {}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new SupabaseConfigurationError("Supabase belum dikonfigurasi.");
  return { url, key };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const { url, key } = getSupabaseConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("accept", "application/json");
  if (init.body) headers.set("content-type", "application/json");
  if (key.startsWith("eyJ")) headers.set("authorization", `Bearer ${key}`);

  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${message.slice(0, 300)}`);
  }
  const responseBody = await response.text();
  if (!responseBody) return undefined as T;
  return JSON.parse(responseBody) as T;
}

function toInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    couple: row.couple,
    eventDate: row.event_date,
    location: row.location,
    packageName: row.package_name,
    source: row.source,
    status: row.status,
  };
}

function toInquiryRow(inquiry: Inquiry): InquiryRow {
  return {
    id: inquiry.id,
    couple: inquiry.couple,
    event_date: inquiry.eventDate,
    location: inquiry.location,
    package_name: inquiry.packageName,
    source: inquiry.source,
    status: inquiry.status,
  };
}

function toProduction(row: ProductionRow): ProductionItem {
  return {
    id: row.id,
    couple: row.couple,
    deliverable: row.deliverable,
    dueDate: row.due_date,
    progress: row.progress,
    status: row.status,
  };
}

function toProductionRow(item: ProductionItem): ProductionRow {
  return {
    id: item.id,
    couple: item.couple,
    deliverable: item.deliverable,
    due_date: item.dueDate,
    progress: item.progress,
    status: item.status,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const inquirySelect = "inquiries?select=id,couple,event_date,location,package_name,source,status&order=created_at.desc";
  const productionSelect = "production_items?select=id,couple,deliverable,due_date,progress,status&order=created_at.desc";
  const [inquiries, production] = await Promise.all([
    supabaseRequest<InquiryRow[]>(inquirySelect),
    supabaseRequest<ProductionRow[]>(productionSelect),
  ]);
  return { inquiries: inquiries.map(toInquiry), production: production.map(toProduction) };
}

export async function createInquiry(inquiry: Inquiry) {
  const rows = await supabaseRequest<InquiryRow[]>("inquiries", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(toInquiryRow(inquiry)),
  });
  return toInquiry(rows[0]);
}

export async function updateInquiry(id: string, inquiry: Omit<Inquiry, "id">) {
  const rows = await supabaseRequest<InquiryRow[]>(`inquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(toInquiryRow({ ...inquiry, id })),
  });
  if (!rows[0]) throw new Error("Inquiry tidak ditemukan.");
  return toInquiry(rows[0]);
}

export async function deleteInquiry(id: string) {
  await supabaseRequest<void>(`inquiries?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function updateProductionItem(id: string, item: Pick<ProductionItem, "progress" | "status">) {
  const rows = await supabaseRequest<ProductionRow[]>(`production_items?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ progress: item.progress, status: item.status }),
  });
  if (!rows[0]) throw new Error("Proyek produksi tidak ditemukan.");
  return toProduction(rows[0]);
}

export async function importDashboardData(data: DashboardData) {
  if (data.inquiries.length) {
    await supabaseRequest<InquiryRow[]>("inquiries?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(data.inquiries.map(toInquiryRow)),
    });
  }
  if (data.production.length) {
    await supabaseRequest<ProductionRow[]>("production_items?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(data.production.map(toProductionRow)),
    });
  }
  return getDashboardData();
}
