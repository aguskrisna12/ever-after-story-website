import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

export const DASHBOARD_SESSION_COOKIE = "eas_dashboard_session";
export const DASHBOARD_SESSION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  return process.env.DASHBOARD_SESSION_SECRET ?? "";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isDashboardAuthConfigured() {
  return Boolean(
    process.env.DASHBOARD_USERNAME &&
      process.env.DASHBOARD_PASSWORD_HASH &&
      getSessionSecret().length >= 32,
  );
}

export function verifyDashboardCredentials(username: string, password: string) {
  const expectedUsername = process.env.DASHBOARD_USERNAME ?? "";
  const passwordHash = process.env.DASHBOARD_PASSWORD_HASH ?? "";
  const [salt, expectedHash] = passwordHash.split(":");

  if (!expectedUsername || !salt || !expectedHash || !safeEqual(username, expectedUsername)) {
    return false;
  }

  try {
    const actualHash = scryptSync(password, salt, 64).toString("hex");
    return safeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}

export function createDashboardSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + DASHBOARD_SESSION_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyDashboardSession(token?: string) {
  if (!token || !isDashboardAuthConfigured()) return false;

  const [expiresAt, signature] = token.split(".");
  const expiresAtNumber = Number(expiresAt);
  if (!expiresAt || !signature || !Number.isFinite(expiresAtNumber)) return false;
  if (expiresAtNumber <= Math.floor(Date.now() / 1000)) return false;

  return safeEqual(signature, sign(expiresAt));
}

