"use client";

import { Menu } from "lucide-react";
import { SvcSelect } from "./SvcSelect";
import { DateSelect } from "./DateSelect";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onToggleSidebar: () => void;
  greetingTitle?: string;
  greetingSubtitle?: string;
  defaultSvc?: string;
  defaultDate?: string;
  notificationCount?: number;
  onDateChange?: (isoDate: string) => void;
}

export function Header({
  onToggleSidebar,
  greetingTitle,
  greetingSubtitle,
  defaultSvc,
  defaultDate,
  notificationCount = 0,
  onDateChange,
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Alternar menu lateral"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {greetingTitle && (
        <div className="hidden min-w-0 flex-1 md:block">
          <p className="truncate text-base font-semibold text-slate-900">{greetingTitle}</p>
          {greetingSubtitle && <p className="truncate text-sm text-slate-500">{greetingSubtitle}</p>}
        </div>
      )}

      <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
        <span className="hidden text-sm font-medium text-slate-400 md:inline">SVC:</span>
        <SvcSelect defaultValue={defaultSvc} />
        <DateSelect defaultValue={defaultDate} onChange={onDateChange} />
        <NotificationsMenu count={notificationCount} />
        <UserMenu name="João Silva" role="Administrador" />
      </div>
    </header>
  );
}
