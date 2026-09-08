"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { servicePackages } from "@/content/services";
import {
  emptyDashboardData,
  inquiryStatuses,
  productionStatuses,
  type DashboardData,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/dashboard-data";
import styles from "@/app/dashboard/dashboard.module.css";

const STORAGE_KEY = "ever-after-story-dashboard-v1";
const statusOptions: InquiryStatus[] = [...inquiryStatuses];
const productionFlow = [...productionStatuses];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function dashboardRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  if (response.status === 401) {
    window.location.assign("/dashboard/login");
    throw new Error("Sesi login berakhir.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Koneksi database gagal." })) as { error?: string };
    throw new Error(body.error ?? "Koneksi database gagal.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function DashboardClient({ username }: { username: string }) {
  const [data, setData] = useState<DashboardData>(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState("");
  const [saving, setSaving] = useState(false);
  const [todayLabel, setTodayLabel] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "Semua">("Semua");
  const [formOpen, setFormOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [notice, setNotice] = useState("");

  const refreshData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      let latest = await dashboardRequest<DashboardData>("/api/dashboard/data");
      if (!latest.inquiries.length && !latest.production.length) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const localData = JSON.parse(saved) as DashboardData;
            latest = await dashboardRequest<DashboardData>("/api/dashboard/import", {
              method: "POST",
              body: JSON.stringify(localData),
            });
          } catch {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
      setData(latest);
      setSyncError("");
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Koneksi database gagal.");
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const startup = window.setTimeout(() => {
      setTodayLabel(new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()));
      void refreshData();
    }, 0);
    const interval = window.setInterval(() => void refreshData(true), 15_000);
    return () => {
      window.clearTimeout(startup);
      window.clearInterval(interval);
    };
  }, [refreshData]);

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

  const saveInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const inquiry: Inquiry = {
      id: editingInquiry?.id ?? makeId("inq"),
      couple: String(form.get("couple")),
      eventDate: String(form.get("eventDate")),
      location: String(form.get("location")),
      packageName: String(form.get("packageName")),
      source: String(form.get("source")),
      status: String(form.get("status")) as InquiryStatus,
    };
    try {
      const savedInquiry = editingInquiry
        ? await dashboardRequest<Inquiry>(`/api/dashboard/inquiries/${encodeURIComponent(inquiry.id)}`, {
            method: "PATCH",
            body: JSON.stringify({ ...inquiry, id: undefined }),
          })
        : await dashboardRequest<Inquiry>("/api/dashboard/inquiries", { method: "POST", body: JSON.stringify(inquiry) });
      setData((current) => ({
        ...current,
        inquiries: editingInquiry
          ? current.inquiries.map((item) => (item.id === savedInquiry.id ? savedInquiry : item))
          : [savedInquiry, ...current.inquiries],
      }));
      event.currentTarget.reset();
      closeForm();
      announce(editingInquiry ? "Perubahan inquiry tersinkron ke semua perangkat." : "Inquiry baru tersinkron ke semua perangkat.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Gagal menyimpan inquiry.");
    } finally {
      setSaving(false);
    }
  };

  const openCreateForm = () => {
    setEditingInquiry(null);
    setFormOpen(true);
  };

  const openEditForm = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingInquiry(null);
  };

  const deleteInquiry = async (inquiry: Inquiry) => {
    if (!window.confirm(`Hapus inquiry ${inquiry.couple}? Data yang dihapus tidak dapat dikembalikan.`)) return;
    try {
      await dashboardRequest<void>(`/api/dashboard/inquiries/${encodeURIComponent(inquiry.id)}`, { method: "DELETE" });
      setData((current) => ({ ...current, inquiries: current.inquiries.filter((item) => item.id !== inquiry.id) }));
      announce(`Inquiry ${inquiry.couple} dihapus dari semua perangkat.`);
    } catch (error) {
      announce(error instanceof Error ? error.message : "Gagal menghapus inquiry.");
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    const existing = data.inquiries.find((item) => item.id === id);
    if (!existing) return;
    try {
      const updated = await dashboardRequest<Inquiry>(`/api/dashboard/inquiries/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ ...existing, id: undefined, status }),
      });
      setData((current) => ({ ...current, inquiries: current.inquiries.map((item) => (item.id === id ? updated : item)) }));
      announce("Status inquiry tersinkron.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Gagal memperbarui status.");
    }
  };

  const advanceProduction = async (id: string) => {
    const existing = data.production.find((item) => item.id === id);
    if (!existing) return;
    const nextIndex = Math.min(productionFlow.indexOf(existing.status) + 1, productionFlow.length - 1);
    const nextStatus = productionFlow[nextIndex];
    const nextProgress = nextStatus === "Terkirim" ? 100 : Math.min(existing.progress + 18, 96);
    try {
      const updated = await dashboardRequest<(typeof data.production)[number]>(`/api/dashboard/production/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus, progress: nextProgress }),
      });
      setData((current) => ({ ...current, production: current.production.map((item) => (item.id === id ? updated : item)) }));
      announce("Progres produksi tersinkron.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Gagal memperbarui produksi.");
    }
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
          <div className={styles.workspaceStatus}>
            <span className={styles.localDot} aria-hidden="true" />
            <div><strong>Supabase terhubung</strong><small>Sinkron otomatis tiap 15 detik</small></div>
          </div>
          <div className={styles.accountRow}>
            <div><small>Masuk sebagai</small><strong>{username}</strong></div>
            <form action="/api/auth/logout" method="post"><button type="submit">Keluar</button></form>
          </div>
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
            <button className={styles.secondaryButton} type="button" onClick={() => void refreshData()} disabled={loading}>{loading ? "Menyinkronkan…" : "Sinkronkan"}</button>
            <button className={styles.secondaryButton} type="button" onClick={exportCsv}>Ekspor CSV</button>
            <button className={styles.primaryButton} type="button" onClick={openCreateForm}>+ Inquiry baru</button>
          </div>
        </header>

        <section className={`${styles.localNotice} ${syncError ? styles.syncError : ""}`} aria-label="Status sinkronisasi">
          <strong>{syncError ? "Sinkronisasi terganggu" : "Data tersinkron"}</strong>
          <span>{syncError || "Perubahan disimpan di Supabase dan akan muncul di perangkat lain maksimal dalam 15 detik."}</span>
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
              <thead><tr><th>Couple</th><th>Tanggal & lokasi</th><th>Paket</th><th>Sumber</th><th>Status</th><th>Aksi</th></tr></thead>
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
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => openEditForm(inquiry)} aria-label={`Edit inquiry ${inquiry.couple}`}>Edit</button>
                        <button className={styles.deleteButton} type="button" onClick={() => deleteInquiry(inquiry)} aria-label={`Hapus inquiry ${inquiry.couple}`}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredInquiries.length ? <tr><td colSpan={6}><div className={styles.emptyState}>{loading ? "Memuat data dari Supabase…" : "Tidak ada inquiry yang sesuai filter."}</div></td></tr> : null}
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
              {!booked.length ? <div className={styles.emptyState}>{loading ? "Memuat jadwal…" : "Belum ada booking yang dikonfirmasi."}</div> : null}
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
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="new-inquiry-title">
            <div className={styles.modalHeading}><div><p className={styles.sectionEyebrow}>Pipeline</p><h2 id="new-inquiry-title">{editingInquiry ? "Edit inquiry" : "Tambah inquiry"}</h2></div><button type="button" onClick={closeForm} aria-label="Tutup form">×</button></div>
            <form className={styles.inquiryForm} onSubmit={saveInquiry}>
              <label><span>Nama couple</span><input name="couple" required placeholder="Contoh: Anna & Luca" defaultValue={editingInquiry?.couple} /></label>
              <label><span>Tanggal wedding</span><input name="eventDate" type="date" required defaultValue={editingInquiry?.eventDate} /></label>
              <label><span>Lokasi</span><input name="location" required placeholder="Uluwatu" defaultValue={editingInquiry?.location} /></label>
              <label><span>Paket</span><select name="packageName" required defaultValue={editingInquiry?.packageName ?? servicePackages[0]?.name}>{servicePackages.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
              <label><span>Sumber inquiry</span><select name="source" required defaultValue={editingInquiry?.source ?? "Instagram"}><option>Instagram</option><option>WhatsApp</option><option>Website</option><option>Referral</option></select></label>
              <label><span>Status</span><select name="status" required defaultValue={editingInquiry?.status ?? "Baru"}>{statusOptions.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
              <div className={styles.formActions}><button className={styles.secondaryButton} type="button" onClick={closeForm} disabled={saving}>Batal</button><button className={styles.primaryButton} type="submit" disabled={saving}>{saving ? "Menyimpan…" : editingInquiry ? "Simpan perubahan" : "Simpan inquiry"}</button></div>
            </form>
          </section>
        </div>
      ) : null}

      <p className={`${styles.toast} ${notice ? styles.toastVisible : ""}`} role="status" aria-live="polite">{notice}</p>
    </div>
  );
}
