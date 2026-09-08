export const inquiryStatuses = ["Baru", "Tindak lanjut", "Proposal dikirim", "Dipesan"] as const;
export const productionStatuses = ["Materi masuk", "Editing", "Review", "Siap dikirim", "Terkirim"] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];
export type ProductionStatus = (typeof productionStatuses)[number];

export interface Inquiry {
  id: string;
  couple: string;
  eventDate: string;
  location: string;
  packageName: string;
  source: string;
  status: InquiryStatus;
}

export interface ProductionItem {
  id: string;
  couple: string;
  deliverable: string;
  dueDate: string;
  progress: number;
  status: ProductionStatus;
}

export interface DashboardData {
  inquiries: Inquiry[];
  production: ProductionItem[];
}

export const emptyDashboardData: DashboardData = { inquiries: [], production: [] };

