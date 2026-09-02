"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { servicePackages } from "@/content/services";
import styles from "@/app/dashboard/dashboard.module.css";

type InquiryStatus = "Baru" | "Tindak lanjut" | "Proposal dikirim" | "Dipesan";
type ProductionStatus = "Materi masuk" | "Editing" | "Review" | "Siap dikirim" | "Terkirim";

interface Inquiry {
  id: string;
  couple: string;
  eventDate: string;
  location: string;
  packageName: string;
  source: string;
  status: InquiryStatus;
}

interface ProductionItem {
  id: string;
  couple: string;
  deliverable: string;
  dueDate: string;
  progress: number;
  status: ProductionStatus;
}

interface DashboardData {
  inquiries: Inquiry[];
  production: ProductionItem[];
}

const STORAGE_KEY = "ever-after-story-dashboard-v1";

const statusOptions: InquiryStatus[] = ["Baru", "Tindak lanjut", "Proposal dikirim", "Dipesan"];
const productionFlow: ProductionStatus[] = ["Materi masuk", "Editing", "Review", "Siap dikirim", "Terkirim"];

const sampleData: DashboardData = {
  inquiries: [
    { id: "inq-1", couple: "Amelia & Noah", eventDate: "2026-09-12", location: "Uluwatu", packageName: "The Signature Story", source: "Instagram", status: "Dipesan" },
    { id: "inq-2", couple: "Sofia & Liam", eventDate: "2026-09-27", location: "Canggu", packageName: "The Intimate Story", source: "WhatsApp", status: "Proposal dikirim" },
    { id: "inq-3", couple: "Ayu & Theo", eventDate: "2026-10-08", location: "Sanur", packageName: "The Complete Story", source: "Referral", status: "Tindak lanjut" },
    { id: "inq-4", couple: "Elena & Marco", eventDate: "2026-11-15", location: "Ubud", packageName: "The Signature Story", source: "Website", status: "Baru" },
  ],
  production: [
    { id: "prd-1", couple: "Maya & Julian", deliverable: "2 Reels + curated clips", dueDate: "2026-09-05", progress: 72, status: "Editing" },
    { id: "prd-2", couple: "Claire & Ben", deliverable: "Highlight Reel", dueDate: "2026-09-07", progress: 90, status: "Review" },
    { id: "prd-3", couple: "Olivia & Daniel", deliverable: "3 Reels + ceremony clips", dueDate: "2026-09-10", progress: 45, status: "Editing" },
  ],
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData>(sampleData);
  const [hydrated, setHydrated] = useState(false);
  const [todayLabel, setTodayLabel] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "Semua">("Semua");
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setData(JSON.parse(saved) as DashboardData);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setTodayLabel(new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    if (!formOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFormOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [formOpen]);

  const filteredInquiries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.inquiries.filter((inquiry) => {
      const matchesStatus = statusFilter === "Semua" || inquiry.status === statusFilter;
      const matchesQuery = !normalized || `${inquiry.couple} ${inquiry.location} ${inquiry.packageName}`.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [data.inquiries, query, statusFilter]);

  const booked = data.inquiries.filter((item) => item.status === "Dipesan");
  const needsReply = data.inquiries.filter((item) => item.status === "Baru" || item.status === "Tindak lanjut").length;
  const delivered = data.production.filter((item) => item.status === "Terkirim").length;

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const addInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const inquiry: Inquiry = {
      id: makeId("inq"),
      couple: String(form.get("couple")),
      eventDate: String(form.get("eventDate")),
      location: String(form.get("location")),
      packageName: String(form.get("packageName")),
      source: String(form.get("source")),
      status: "Baru",
    };
    setData((current) => ({ ...current, inquiries: [inquiry, ...current.inquiries] }));
    event.currentTarget.reset();
    setFormOpen(false);
    announce("Inquiry baru tersimpan di perangkat ini.");
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setData((current) => ({
      ...current,
      inquiries: current.inquiries.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
    announce("Status inquiry diperbarui.");
  };

  const advanceProduction = (id: string) => {
    setData((current) => ({
      ...current,
      production: current.production.map((item) => {
        if (item.id !== id) return item;
        const nextIndex = Math.min(productionFlow.indexOf(item.status) + 1, productionFlow.length - 1);
        const nextStatus = productionFlow[nextIndex];
        const nextProgress = nextStatus === "Terkirim" ? 100 : Math.min(item.progress + 18, 96);
        return { ...item, status: nextStatus, progress: nextProgress };
      }),
    }));
    announce("Progres produksi diperbarui.");
  };

  const exportCsv = () => {
    const rows = [
      ["Couple", "Event date", "Location", "Package", "Source", "Status"],
      ...data.inquiries.map((item) => [item.couple, item.eventDate, item.location, item.packageName, item.source, item.status]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ever-after-story-inquiries.csv";
    link.click();
    URL.revokeObjectURL(url);
    announce("Data inquiry berhasil diekspor.");
  };

  return (
    <div className={styles.dashboardShell}>
      <aside className={styles.sidebar}>
        <Link className={styles.dashboardBrand} href="/" aria-label="Kembali ke website Ever After Story">
          <span className={styles.dashboardLogo} aria-hidden="true" />
          <span>Studio workspace</span>
        </Link>
        <nav className={styles.sidebarNav} aria-label="Navigasi dashboard">
          <a href="#overview"><span>01</span>Ringkasan</a>
          <a href="#inquiries"><span>02</span>Inquiry</a>
          <a href="#schedule"><span>03</span>Jadwal</a>
          <a href="#production"><span>04</span>Produksi</a>
        </nav>
        <div className={styles.sidebarFoot}>
          <span className={styles.localDot} aria-hidden="true" />
          <div><strong>Workspace lokal</strong><small>Data tersimpan di browser ini</small></div>
        </div>
      </aside>

      <main className={styles.dashboardMain}>
        <header className={styles.dashboardTopbar}>
          <div>
            <p className={styles.kicker}>Ever After Story · Bali</p>
            <h1>Studio dashboard</h1>
            <p className={styles.dateLabel}>{todayLabel || "Memuat tanggal…"}</p>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.secondaryButton} type="button" onClick={exportCsv}>Ekspor CSV</button>
            <button className={styles.primaryButton} type="button" onClick={() => setFormOpen(true)}>+ Inquiry baru</button>
          </div>
        </header>

        <section className={styles.localNotice} aria-label="Informasi penyimpanan">
          <strong>Mode perangkat pribadi</strong>
          <span>Dashboard ini belum terhubung ke form website atau akun tim. Gunakan untuk pencatatan awal tanpa mengirim data klien ke server.</span>
        </section>

        <section className={styles.overviewSection} id="overview" aria-labelledby="overview-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.sectionEyebrow}>Hari ini</p><h2 id="overview-title">Ringkasan studio</h2></div>
            <p>Pantau peluang, booking, dan pekerjaan yang membutuhkan perhatian.</p>
          </div>
          <div className={styles.metricGrid}>
            <article className={styles.metricCard}><span>Inquiry aktif</span><strong>{data.inquiries.length}</strong><small>Semua peluang tersimpan</small></article>
            <article className={styles.metricCard}><span>Wedding dipesan</span><strong>{booked.length}</strong><small>Siap masuk kalender</small></article>
            <article className={`${styles.metricCard} ${needsReply ? styles.metricAttention : ""}`}><span>Perlu dibalas</span><strong>{needsReply}</strong><small>Baru dan tindak lanjut</small></article>
            <article className={styles.metricCard}><span>Konten terkirim</span><strong>{delivered}</strong><small>Dari antrean saat ini</small></article>
          </div>
        </section>

        <section className={styles.inquirySection} id="inquiries" aria-labelledby="inquiries-title">
          <div className={styles.sectionHeadingCompact}>
            <div><p className={styles.sectionEyebrow}>Pipeline</p><h2 id="inquiries-title">Inquiry terbaru</h2></div>
            <span>{filteredInquiries.length} dari {data.inquiries.length}</span>
          </div>
          <div className={styles.filterBar}>
            <label className={styles.searchField}>
              <span className={styles.srOnly}>Cari inquiry</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari couple, lokasi, atau paket…" />
            </label>
            <label className={styles.filterSelect}>
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as InquiryStatus | "Semua")}>
                <option value="Semua">Semua status</option>
                {statusOptions.map((status) => <option value={status} key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.inquiryTable}>
              <thead><tr><th>Couple</th><th>Tanggal & lokasi</th><th>Paket</th><th>Sumber</th><th>Status</th></tr></thead>
              <tbody>
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td><strong>{inquiry.couple}</strong><small>#{inquiry.id.slice(-4)}</small></td>
                    <td><strong>{formatDate(inquiry.eventDate)}</strong><small>{inquiry.location}, Bali</small></td>
                    <td>{inquiry.packageName}</td>
                    <td>{inquiry.source}</td>
                    <td>
                      <select className={`${styles.statusSelect} ${styles[`status${inquiry.status.replaceAll(" ", "")}`] ?? ""}`} value={inquiry.status} onChange={(event) => updateInquiryStatus(inquiry.id, event.target.value as InquiryStatus)} aria-label={`Status ${inquiry.couple}`}>
                        {statusOptions.map((status) => <option value={status} key={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {!filteredInquiries.length ? <tr><td colSpan={5}><div className={styles.emptyState}>Tidak ada inquiry yang sesuai filter.</div></td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>

        <div className={styles.twoColumnGrid}>
          <section className={styles.panel} id="schedule" aria-labelledby="schedule-title">
            <div className={styles.panelHeading}><div><p className={styles.sectionEyebrow}>Kalender</p><h2 id="schedule-title">Jadwal mendatang</h2></div><span>{booked.length} booking</span></div>
            <div className={styles.scheduleList}>
              {booked.map((item) => (
                <article className={styles.scheduleItem} key={item.id}>
                  <time dateTime={item.eventDate}><strong>{new Date(`${item.eventDate}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(`${item.eventDate}T12:00:00`))}</span></time>
                  <div><strong>{item.couple}</strong><span>{item.location} · {item.packageName}</span></div>
                </article>
              ))}
              {!booked.length ? <div className={styles.emptyState}>Belum ada booking yang dikonfirmasi.</div> : null}
            </div>
          </section>

          <section className={styles.panel} id="production" aria-labelledby="production-title">
            <div className={styles.panelHeading}><div><p className={styles.sectionEyebrow}>Delivery</p><h2 id="production-title">Antrean produksi</h2></div><span>{data.production.length} proyek</span></div>
            <div className={styles.productionList}>
              {data.production.map((item) => (
                <article className={styles.productionItem} key={item.id}>
                  <div className={styles.productionMeta}><div><strong>{item.couple}</strong><span>{item.deliverable}</span></div><small>Due {formatDate(item.dueDate)}</small></div>
                  <div className={styles.progressTrack} aria-label={`Progres ${item.couple}: ${item.progress}%`}><span style={{ width: `${item.progress}%` }} /></div>
                  <div className={styles.productionFooter}><span>{item.status} · {item.progress}%</span><button type="button" onClick={() => advanceProduction(item.id)} disabled={item.status === "Terkirim"}>{item.status === "Terkirim" ? "Selesai" : "Lanjutkan →"}</button></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {formOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="new-inquiry-title">
            <div className={styles.modalHeading}><div><p className={styles.sectionEyebrow}>Pipeline</p><h2 id="new-inquiry-title">Tambah inquiry</h2></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Tutup form">×</button></div>
            <form className={styles.inquiryForm} onSubmit={addInquiry}>
              <label><span>Nama couple</span><input name="couple" required placeholder="Contoh: Anna & Luca" /></label>
              <label><span>Tanggal wedding</span><input name="eventDate" type="date" required /></label>
              <label><span>Lokasi</span><input name="location" required placeholder="Uluwatu" /></label>
              <label><span>Paket</span><select name="packageName" required>{servicePackages.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
              <label><span>Sumber inquiry</span><select name="source" required><option>Instagram</option><option>WhatsApp</option><option>Website</option><option>Referral</option></select></label>
              <div className={styles.formActions}><button className={styles.secondaryButton} type="button" onClick={() => setFormOpen(false)}>Batal</button><button className={styles.primaryButton} type="submit">Simpan inquiry</button></div>
            </form>
          </section>
        </div>
      ) : null}

      <p className={`${styles.toast} ${notice ? styles.toastVisible : ""}`} role="status" aria-live="polite">{notice}</p>
    </div>
  );
}
