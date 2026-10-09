import { cookies } from "next/headers";
import { SessionPayload, UserRole } from "./types";

export const SESSION_COOKIE = "bt_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

// Secret de signature des sessions : variable d'environnement AUTH_SECRET
// (générée automatiquement dans .env.local par `npm install`, voir
// scripts/ensure-secret.js). En production, il n'existe AUCUNE valeur par
// défaut : sans secret, aucune session ne peut être créée ni validée. Une
// valeur publique par défaut permettrait à n'importe qui de forger un cookie admin.
const DEV_FALLBACK_SECRET = "beach-tennis-benin-dev-only-not-for-production";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET manquant ou trop court (16 caractères minimum). Voir README.");
  }
  return DEV_FALLBACK_SECRET;
}

// Ce module est importé par le middleware (runtime Edge) : il ne doit
// utiliser QUE l'API Web Crypto globale (`crypto.subtle`, disponible nativement
// en Node.js 19+ et en Edge), jamais `import ... from "crypto"` (module Node,
// incompatible avec l'Edge Runtime). Le hachage des mots de passe, qui a
// besoin du module Node, vit séparément dans lib/password.ts.

function base64urlFromBytes(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesFromBase64url(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    input.length + ((4 - (input.length % 4)) % 4),
    "="
  );
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(getAuthSecret());
  return crypto.subtle.importKey(
    "raw",
    enc,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(data: string): Promise<string> {
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64urlFromBytes(new Uint8Array(sig));
}

/** Comparaison en temps constant (évite de déduire la signature par mesure de durée). */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Construit un jeton de session signé (payload base64url + signature HMAC). */
export async function createSessionToken(
  role: UserRole,
  id: string,
  name: string
): Promise<string> {
  const payload: SessionPayload = { role, id, name, exp: Date.now() + SESSION_DURATION_MS };
  const encoded = base64urlFromBytes(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  let expected: string;
  try {
    expected = await sign(encoded);
  } catch {
    return null; // secret absent en production : aucune session valide
  }
  if (!timingSafeEqualStr(expected, signature)) return null;
  try {
    const json = new TextDecoder().decode(bytesFromBase64url(encoded));
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Lit la session courante côté serveur (Server Components, Route Handlers). */
export async function getServerSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getServerSession();
  if (!session || session.role !== "admin") return null;
  return session;
}
