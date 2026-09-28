"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, ChevronLeft, Truck } from "lucide-react";
import { navItems } from "@/lib/dashboard-data";
import type { ImportRecord } from "@/types/dashboard";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  defaultActive?: string;
  badgeCounts?: Partial<Record<string, number>>;
  lastImport?: ImportRecord;
}

export function Sidebar({ collapsed, onToggle, defaultActive, badgeCounts = {}, lastImport }: SidebarProps) {
  const [active, setActive] = useState(defaultActive ?? navItems[0]?.label);
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white"
          aria-hidden="true"
        >
          <Truck className="h-5 w-5" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">RouteManager</p>
            <p className="truncate text-xs text-slate-500">Gestão de Rotas</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegação principal">
        <ul className="space-y-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = href ? pathname === href : active === label;
            const badgeCount = badgeCounts[label];
            const itemClassName = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`;
            const content = (
              <>
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
                {!collapsed && !!badgeCount && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
                    {badgeCount}
                  </span>
                )}
              </>
            );

            return (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={itemClassName}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActive(label)}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={itemClassName}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {lastImport && !collapsed && (
        <div className="border-t border-slate-100 p-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
              <p className="text-xs font-semibold text-slate-900">Última importação</p>
            </div>
            <p className="mt-2 truncate text-xs text-slate-600" title={lastImport.fileName}>
              {lastImport.fileName}
            </p>
            <p className="text-xs text-slate-500">{lastImport.routesProcessed} rotas processadas</p>
            <Link href="/relatorios" className="mt-1.5 inline-block text-xs font-medium text-blue-600 hover:text-blue-700">
              Ver histórico
            </Link>
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 px-3 py-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        >
          <ChevronLeft
            className={`h-5 w-5 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          {!collapsed && <span>Recolher menu</span>}
        </button>
      </div>
    </aside>
  );
}
