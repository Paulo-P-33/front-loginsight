import { list, put } from "@vercel/blob";
import type { ReportBatch } from "@/types/reports";

// O filesystem das funções serverless da Vercel é somente leitura, então os
// relatórios importados são persistidos como um blob no Vercel Blob Storage
// em vez de um arquivo local.
const DATA_BLOB_PATH = "reports/reports.json";

async function findDataBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: DATA_BLOB_PATH, limit: 1 });
  return blobs.find((blob) => blob.pathname === DATA_BLOB_PATH)?.url ?? null;
}

export async function readReportBatches(): Promise<ReportBatch[]> {
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

async function writeReportBatches(batches: ReportBatch[]): Promise<void> {
  await put(DATA_BLOB_PATH, JSON.stringify(batches, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
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
