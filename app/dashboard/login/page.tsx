import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DASHBOARD_SESSION_COOKIE, verifyDashboardSession } from "@/lib/dashboard-auth";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Login Studio Dashboard",
  description: "Login aman untuk workspace operasional Ever After Story.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DashboardLoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  if (verifyDashboardSession(cookieStore.get(DASHBOARD_SESSION_COOKIE)?.value)) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;
  const errorMessage = error === "invalid"
    ? "Username atau password belum sesuai. Silakan coba kembali."
    : error === "config"
      ? "Login dashboard belum dikonfigurasi. Hubungi administrator website."
      : "";

  return (
    <main className={styles.loginPage}>
      <section className={styles.storyPanel} aria-label="Ever After Story">
        <Link className={styles.brand} href="/" aria-label="Kembali ke website Ever After Story">
          <span className={styles.logo} aria-hidden="true" />
        </Link>
        <div>
          <p className={styles.eyebrow}>Private studio workspace</p>
          <h1>Every story,<br />beautifully managed.</h1>
          <p>Kelola inquiry, jadwal wedding, dan proses delivery dalam satu ruang kerja.</p>
        </div>
        <p className={styles.location}>Bali · Indonesia</p>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formWrap}>
          <p className={styles.eyebrow}>Akses tim</p>
          <h2>Masuk ke dashboard</h2>
          <p className={styles.intro}>Gunakan akun admin Ever After Story untuk melanjutkan.</p>

          {errorMessage ? <p className={styles.error} role="alert">{errorMessage}</p> : null}

          <form className={styles.loginForm} action="/api/auth/login" method="post">
            <label>
              <span>Username</span>
              <input name="username" autoComplete="username" required autoFocus />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit">Masuk ke dashboard <span aria-hidden="true">→</span></button>
          </form>

          <Link className={styles.backLink} href="/">← Kembali ke website</Link>
          <p className={styles.securityNote}>Sesi aman akan berakhir otomatis setelah 8 jam.</p>
        </div>
      </section>
    </main>
  );
}

