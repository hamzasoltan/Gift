import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "gift_admin_session"; const MAX_AGE = 28800;
function secret() { const s = process.env.ADMIN_SESSION_SECRET; if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters."); return s; }
function equal(a: string, b: string) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function sign(v: string) { return createHmac("sha256", secret()).update(v).digest("base64url"); }
export function verifyPassword(v: string) { const p = process.env.ADMIN_PASSWORD; if (!p || p.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters."); return equal(v, p); }
export function createSession() { const p = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000, aud: "gift-admin" })).toString("base64url"); return p + "." + sign(p); }
export function verifySession(t?: string) { if (!t) return false; const a = t.split("."); if (a.length !== 2) return false; try { if (!equal(sign(a[0]), a[1])) return false; const p = JSON.parse(Buffer.from(a[0], "base64url").toString("utf8")); return p.aud === "gift-admin" && Number(p.exp) > Date.now(); } catch { return false; } }
export async function isAdmin() { try { return verifySession((await cookies()).get(COOKIE)?.value); } catch { return false; } }
export async function setAdminCookie(t: string) { (await cookies()).set(COOKIE, t, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: MAX_AGE }); }
export async function clearAdminCookie() { (await cookies()).set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 }); }
export function sameOrigin(r: Request) { const o = r.headers.get("origin"); return !!o && o === new URL(r.url).origin; }