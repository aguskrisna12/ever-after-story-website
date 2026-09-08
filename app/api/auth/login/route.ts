import { NextResponse } from "next/server";
import {
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
  DASHBOARD_SESSION_SECONDS,
  isDashboardAuthConfigured,
  verifyDashboardCredentials,
} from "@/lib/dashboard-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isDashboardAuthConfigured()) {
    return NextResponse.redirect(new URL("/dashboard/login?error=config", request.url), 303);
  }

  if (!verifyDashboardCredentials(username, password)) {
    return NextResponse.redirect(new URL("/dashboard/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url), 303);
  response.cookies.set(DASHBOARD_SESSION_COOKIE, createDashboardSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DASHBOARD_SESSION_SECONDS,
  });
  return response;
}

