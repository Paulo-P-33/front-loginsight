// DS (Desempenho do Serviço de entrega) = entregas com sucesso / total de paradas.
// O DS por rota compara entregas x paradas de uma rota específica; o DS geral da
// placa compara o total de entregas com sucesso x o total de paradas somando
// todas as rotas daquela placa.
export const DS_MINIMUM_THRESHOLD = 0.95;
export const DS_TARGET_THRESHOLD = 0.985;

export type DsTier = "below" | "target" | "normal";

export function getDsTier(ds: number): DsTier {
  if (ds < DS_MINIMUM_THRESHOLD) return "below";
  if (ds >= DS_TARGET_THRESHOLD) return "target";
  return "normal";
}

export function calculateDs(deliveries: number, stops: number): number {
  return stops > 0 ? deliveries / stops : 0;
}
