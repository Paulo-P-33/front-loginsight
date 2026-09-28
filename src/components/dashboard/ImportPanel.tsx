"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Inbox, Loader2, Upload } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";
import type { ReportBatch } from "@/types/reports";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export function ImportPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ReportBatch | null>(null);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/reports", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível processar a planilha.");
        return;
      }

      setResult(data.batch as ReportBatch);
    } catch {
      setError("Falha de conexão ao enviar o arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const hasValidExtension = ACCEPTED_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension)
    );

    if (!hasValidExtension) {
      setError("Formato inválido. Envie um arquivo .xlsx, .xls ou .csv.");
      setFileName(null);
      setResult(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("O arquivo excede o limite de 20MB.");
      setFileName(null);
      setResult(null);
      return;
    }

    setError(null);
    setFileName(file.name);
    void uploadFile(file);
  }

  const skippedRowsNote =
    result && result.skippedRowCount > 0 ? ` (${result.skippedRowCount} linhas ignoradas por dados incompletos)` : "";
  const resultDescription = result
    ? `${result.routeCount} rotas processadas${skippedRowsNote}. Valor total a pagar: ${formatCurrencyBRL(result.totalValue)}.`
    : "Você ainda não importou nenhum relatório. Faça o upload do seu arquivo para calcular os valores a pagar por placa.";

  let uploadButtonLabel = "Importar Relatório";
  if (isUploading) uploadButtonLabel = "Processando...";
  else if (result) uploadButtonLabel = "Importar outro relatório";

  return (
    <section className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          result ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"
        }`}
        aria-hidden="true"
      >
        {result ? <CheckCircle2 className="h-7 w-7" /> : <Inbox className="h-7 w-7" />}
      </span>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        {result ? "Relatório importado com sucesso" : "Nenhum dado disponível"}
      </h2>
      <p className="max-w-md text-sm text-slate-500">{resultDescription}</p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4" aria-hidden="true" />
        )}
        {uploadButtonLabel}
      </button>

      <div aria-live="polite" className="mt-3 min-h-5 text-sm">
        {error && <p className="text-red-600">{error}</p>}
        {!error && !result && fileName && !isUploading && (
          <p className="text-slate-500">
            Arquivo selecionado: <span className="font-medium text-slate-700">{fileName}</span>
          </p>
        )}
        {!error && result && (
          <Link href={`/relatorios?batch=${result.id}`} className="font-medium text-blue-600 hover:text-blue-700">
            Ver relatório de pagamentos
          </Link>
        )}
      </div>
    </section>
  );
}
