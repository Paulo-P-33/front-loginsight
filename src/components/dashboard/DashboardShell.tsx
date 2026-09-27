"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { isAuthenticated } from "@/lib/auth";
import type { ImportRecord } from "@/types/dashboard";

interface DashboardShellProps {
  children: ReactNode;
  sidebarActive?: string;
  sidebarBadgeCounts?: Partial<Record<string, number>>;
  lastImport?: ImportRecord;
  greetingTitle?: string;
  greetingSubtitle?: string;
  defaultSvc?: string;
  defaultDate?: string;
  notificationCount?: number;
  onDateChange?: (isoDate: string) => void;
}

export function DashboardShell({
  children,
  sidebarActive,
  sidebarBadgeCounts,
  lastImport,
  greetingTitle,
  greetingSubtitle,
  defaultSvc,
  defaultDate,
  notificationCount,
  onDateChange,
}: DashboardShellProps) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated">("checking");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthStatus("authenticated");
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (authStatus === "checking") {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
        defaultActive={sidebarActive}
        badgeCounts={sidebarBadgeCounts}
        lastImport={lastImport}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
          greetingTitle={greetingTitle}
          greetingSubtitle={greetingSubtitle}
          defaultSvc={defaultSvc}
          defaultDate={defaultDate}
          notificationCount={notificationCount}
          onDateChange={onDateChange}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
