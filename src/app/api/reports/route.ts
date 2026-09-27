import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { parseRouteReport, summarizeByPlate } from "@/lib/parse-report";
import { addReportBatch, deleteReportBatch, readReportBatches } from "@/lib/report-store";
import type { ReportBatch } from "@/types/reports";

export async function GET() {
  const batches = await readReportBatches();
  return NextResponse.json({ batches });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let entries;
  let skippedRowCount;
  try {
    ({ entries, skippedRowCount } = parseRouteReport(buffer));
  } catch {
    return NextResponse.json(
      { error: "Não foi possível ler o arquivo. Verifique se é uma planilha Excel (.xlsx, .xls) ou .csv válida." },
      { status: 400 }
    );
  }

  if (entries.length === 0) {
    return NextResponse.json(
      {
        error:
          "Nenhuma linha válida foi encontrada na planilha. Verifique as colunas de data, placa e tipo de veículo (VAN, UTILITÁRIOS ou VUC).",
      },
      { status: 422 }
    );
  }

  const plateSummaries = summarizeByPlate(entries);
  const totalValue = Number(plateSummaries.reduce((sum, plate) => sum + plate.totalValue, 0).toFixed(2));

  const batch: ReportBatch = {
    id: randomUUID(),
    fileName: file.name,
    importedAt: new Date().toISOString(),
    routeCount: entries.length,
    skippedRowCount,
    totalValue,
    plateSummaries,
    entries,
  };

  await addReportBatch(batch);

  return NextResponse.json({ batch });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID do relatório não informado." }, { status: 400 });
  }

  await deleteReportBatch(id);
  return NextResponse.json({ success: true });
}
