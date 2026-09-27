import { DashboardIllustration } from "./DashboardIllustration";

export function WelcomeBanner() {
  return (
    <section className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Bem-vindo ao RouteManager! 👋</h1>
        <p className="mt-2 text-slate-500">Ainda não há dados disponíveis para exibição.</p>
        <p className="text-slate-500">
          Faça o upload do seu primeiro relatório para começar a acompanhar suas operações.
        </p>
      </div>
      <DashboardIllustration />
    </section>
  );
}
