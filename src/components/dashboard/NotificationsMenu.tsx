"use client";

import { Bell } from "lucide-react";
import { Popover } from "@/components/ui/Popover";

interface NotificationsMenuProps {
  count?: number;
}

export function NotificationsMenu({ count = 0 }: NotificationsMenuProps) {
  return (
    <Popover
      align="right"
      panelClassName="w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Notificações"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </button>
      )}
    >
      {() => (
        <div>
          <p className="text-sm font-semibold text-slate-900">Notificações</p>
          <p className="mt-2 text-sm text-slate-500">
            {count > 0 ? `Você tem ${count} notificações não lidas.` : "Nenhuma notificação no momento."}
          </p>
        </div>
      )}
    </Popover>
  );
}
