import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";
import type { ReportBatch } from "@/types/reports";

// O filesystem das funções serverless da Vercel é somente leitura, então em
// produção os relatórios são persistidos como um blob no Vercel Blob Storage.
// Localmente, sem BLOB_READ_WRITE_TOKEN configurado, cai para um arquivo em
// disco (gitignored) para permitir testar sem depender do storage de produção.
const DATA_BLOB_PATH = "reports/reports.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), ".local-data", "reports.json");
const useLocalStorage = !process.env.BLOB_READ_WRITE_TOKEN;

async function readLocalBatches(): Promise<ReportBatch[]> {
  try {
    const raw = await readFile(LOCAL_DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as ReportBatch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalBatches(batches: ReportBatch[]): Promise<void> {
  await mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await writeFile(LOCAL_DATA_FILE, JSON.stringify(batches, null, 2), "utf-8");
}

async function findDataBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: DATA_BLOB_PATH, limit: 1 });
  return blobs.find((blob) => blob.pathname === DATA_BLOB_PATH)?.url ?? null;
}

async function readBlobBatches(): Promise<ReportBatch[]> {
  const url = await findDataBlobUrl();
  if (!url) return [];

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return [];

  try {
    const parsed = (await response.json()) as ReportBatch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBlobBatches(batches: ReportBatch[]): Promise<void> {
  await put(DATA_BLOB_PATH, JSON.stringify(batches, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readReportBatches(): Promise<ReportBatch[]> {
  return useLocalStorage ? readLocalBatches() : readBlobBatches();
}

async function writeReportBatches(batches: ReportBatch[]): Promise<void> {
  await (useLocalStorage ? writeLocalBatches(batches) : writeBlobBatches(batches));
}

export async function addReportBatch(batch: ReportBatch): Promise<void> {
  const batches = await readReportBatches();
  batches.unshift(batch);
  await writeReportBatches(batches);
}

export async function deleteReportBatch(id: string): Promise<void> {
  const batches = await readReportBatches();
  const filtered = batches.filter((existing) => existing.id !== id);
  await writeReportBatches(filtered);
}
