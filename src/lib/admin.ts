import { promises as fs } from "fs";
import path from "path";

/**
 * Server-only helpers for the local admin panel.
 *
 * Writes go straight to the JSON files under src/data so the change is picked
 * up by hot-reload in dev and committed to git for the next deploy. Vercel's
 * filesystem is read-only, so writes are hard-blocked there — the panel is a
 * local authoring tool, not a live CMS.
 */

export type ContentType = "projects" | "experience" | "certifications";

const FILES: Record<ContentType, string> = {
  projects: "projects.json",
  experience: "experience.json",
  certifications: "certifications.json",
};

export function isContentType(v: string): v is ContentType {
  return v === "projects" || v === "experience" || v === "certifications";
}

/** True when running on Vercel (or any forced read-only env). */
export function isReadOnly(): boolean {
  return Boolean(process.env.VERCEL) || process.env.ADMIN_READONLY === "1";
}

/** Constant-time-ish password check against ADMIN_PASSWORD (defaults to "admin" locally). */
export function checkAuth(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD || (isReadOnly() ? "" : "admin");
  if (!expected) return false;
  const given = req.headers.get("x-admin-password") ?? "";
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

function filePath(type: ContentType): string {
  return path.join(process.cwd(), "src", "data", FILES[type]);
}

export async function readContent<T = unknown>(type: ContentType): Promise<T[]> {
  const raw = await fs.readFile(filePath(type), "utf8");
  return JSON.parse(raw) as T[];
}

export async function writeContent(type: ContentType, items: unknown[]): Promise<void> {
  const json = JSON.stringify(items, null, 2) + "\n";
  await fs.writeFile(filePath(type), json, "utf8");
}

/** Persist an uploaded image into /public/images/uploads and return its public path. */
export async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
  const fileName = `${Date.now()}-${safeBase}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), bytes);
  return `/images/uploads/${fileName}`;
}
