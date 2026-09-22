const COOKIE = "circuit_session";
const MAX_AGE = 60 * 60 * 24 * 180;

function toBytes(s) {
  return new TextEncoder().encode(s);
}

export async function hmacSign(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    toBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, toBytes(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function timingSafeEqual(a, b) {
  const aa = toBytes(a);
  const bb = toBytes(b);
  if (aa.length !== bb.length) return false;
  let out = 0;
  for (let i = 0; i < aa.length; i++) out |= aa[i] ^ bb[i];
  return out === 0;
}

export async function makeSession(env) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `ok.${exp}`;
  const sig = await hmacSign(env.SESSION_SECRET, payload);
  return `${payload}.${sig}`;
}

export async function readSession(request, env) {
  const raw = cookie(request, COOKIE);
  if (!raw || !env.SESSION_SECRET) return null;
  const parts = raw.split(".");
  if (parts.length < 3) return null;
  const exp = parts[1];
  const payload = `${parts[0]}.${exp}`;
  const sig = parts.slice(2).join(".");
  const expect = await hmacSign(env.SESSION_SECRET, payload);
  if (!timingSafeEqual(sig, expect)) return null;
  if (Number(exp) < Date.now()) return null;
  return { ok: true, exp: Number(exp) };
}

export function setSessionCookie(token) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function checkPassphrase(env, given) {
  if (!env.APP_PASSPHRASE || !given) return false;
  return timingSafeEqual(String(env.APP_PASSPHRASE), String(given));
}

function cookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const parts = header.split(";").map((s) => s.trim());
  for (const p of parts) {
    if (p.startsWith(name + "=")) return p.slice(name.length + 1);
  }
  return "";
}
