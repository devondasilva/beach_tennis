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

  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${extFromMime(file.type)}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${subdir}/${filename}`;
}

/** Supprime un fichier référencé par son chemin public (ex. "/uploads/beaches/xxx.jpg"). */
export function deleteUploadedFile(publicPath: string): void {
  if (!publicPath.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", publicPath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
