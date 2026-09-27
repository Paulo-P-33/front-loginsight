"use client";

import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ImportPanel } from "@/components/dashboard/ImportPanel";
import { OnboardingSteps } from "@/components/dashboard/OnboardingSteps";
import { RecentImportsPanel } from "@/components/dashboard/RecentImportsPanel";

export default function Home() {
  const router = useRouter();

  return (
    <DashboardShell onDateChange={(isoDate) => router.push(`/dashboard?date=${isoDate}`)}>
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
