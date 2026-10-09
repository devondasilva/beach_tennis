import fs from "fs";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 Mo

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

/** Vérifie la signature binaire réelle : le type MIME déclaré par le client ne suffit pas. */
function matchesMagicBytes(buf: Buffer, mime: string): boolean {
  const startsWith = (...bytes: number[]) => bytes.every((b, i) => buf[i] === b);
  switch (mime) {
    case "image/jpeg": return startsWith(0xff, 0xd8, 0xff);
    case "image/png": return startsWith(0x89, 0x50, 0x4e, 0x47);
    case "image/gif": return buf.subarray(0, 4).toString("ascii") === "GIF8";
    case "image/webp": return buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
    default: return false;
  }
}

/**
 * Enregistre un fichier image envoyé via FormData dans /public/uploads/<subdir>/
 * et renvoie son chemin public (ex. "/uploads/beaches/xxx.jpg").
 * Lève une erreur si le type ou la taille ne sont pas acceptés.
 */
export async function saveUploadedImage(file: File, subdir: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format d'image non supporté (JPEG, PNG, WEBP ou GIF uniquement).");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image trop volumineuse (8 Mo maximum).");
  }

  if (!/^[a-z0-9-]+$/i.test(subdir)) throw new Error("Dossier invalide.");
  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${extFromMime(file.type)}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesMagicBytes(buffer, file.type)) {
    throw new Error("Le contenu du fichier ne correspond pas à une image valide.");
  }
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${subdir}/${filename}`;
}

/** Supprime un fichier référencé par son chemin public (ex. "/uploads/beaches/xxx.jpg"). */
export function deleteUploadedFile(publicPath: string): void {
  const base = path.join(process.cwd(), "public", "uploads");
  const filePath = path.resolve(process.cwd(), "public", "." + publicPath);
  // Refuse toute sortie du dossier uploads (ex. "/uploads/../../data/players.json")
  if (!publicPath.startsWith("/uploads/") || !filePath.startsWith(base + path.sep)) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
