import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ReportBatch } from "@/types/reports";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reports.json");

async function ensureDataFile(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function readReportBatches(): Promise<ReportBatch[]> {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as ReportBatch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addReportBatch(batch: ReportBatch): Promise<void> {
  const batches = await readReportBatches();
  batches.unshift(batch);
  await writeFile(DATA_FILE, JSON.stringify(batches, null, 2), "utf-8");
}

export async function deleteReportBatch(id: string): Promise<void> {
  const batches = await readReportBatches();
  const filtered = batches.filter((batch) => batch.id !== id);
  await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
}
