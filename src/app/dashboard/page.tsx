"use client";
// import { RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
// import { CycleBreakdownCard } from "@/components/dashboard/CycleBreakdownCard";
// import { DailyEvolutionCard } from "@/components/dashboard/DailyEvolutionCard";
// import { DeliveryStatusCard } from "@/components/dashboard/DeliveryStatusCard";
// import { TopDriversCard } from "@/components/dashboard/TopDriversCard";
// import { TopFailureRoutesCard } from "@/components/dashboard/TopFailureRoutesCard";
// import { OperationSummaryCard } from "@/components/dashboard/OperationSummaryCard";
// import { AlertsCard } from "@/components/dashboard/AlertsCard";
// import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
// import { dashboardStats, formatIsoToBr, lastImport } from "@/lib/dashboard-data";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ImportPanel } from "@/components/dashboard/ImportPanel";
import { OnboardingSteps } from "@/components/dashboard/OnboardingSteps";
import { RecentImportsPanel } from "@/components/dashboard/RecentImportsPanel";
import { useRouter } from "next/navigation";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  // const params = await searchParams;
  // const defaultDate = (params.date && formatIsoToBr(params.date)) || "21/08/2026";
  const router = useRouter();

  return (
    // <DashboardShell
    //   sidebarActive="Dashboard"
    //   sidebarBadgeCounts={{ Alertas: 12 }}
    //   lastImport={lastImport}
    //   greetingTitle="Bom dia, João Silva! 👋"
    //   greetingSubtitle="Aqui está o resumo da operação de hoje."
    //   defaultSvc="SJP1 - Conde"
    //   defaultDate={defaultDate}
    //   notificationCount={3}
    // >
    //   <div className="mx-auto flex max-w-7xl flex-col gap-6">
    //     <div className="flex items-center justify-end">
    //       <button
    //         type="button"
    //         className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50"
    //       >
    //         <RefreshCw className="h-4 w-4" aria-hidden="true" />
    //         Atualizar dados
    //       </button>
    //     </div>

    //     <StatsGrid metrics={dashboardStats} />

    //     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    //       <div className="min-w-0">
    //         <CycleBreakdownCard />
    //       </div>
    //       <div className="min-w-0">
    //         <DailyEvolutionCard />
    //       </div>
    //       <div className="min-w-0">
    //         <DeliveryStatusCard />
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    //       <div className="min-w-0">
    //         <TopDriversCard />
    //       </div>
    //       <div className="min-w-0">
    //         <TopFailureRoutesCard />
    //       </div>
    //       <div className="min-w-0">
    //         <OperationSummaryCard />
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    //       <AlertsCard />
    //       <QuickActionsCard />
    //     </div>
    //   </div>
    // </DashboardShell>
    <DashboardShell
      onDateChange={(isoDate) => router.push(`/dashboard?date=${isoDate}`)}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <WelcomeBanner />
        <StatsGrid />
        <ImportPanel />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OnboardingSteps />
          </div>
          <RecentImportsPanel />
        </div>
      </div>
    </DashboardShell>
  );
}
