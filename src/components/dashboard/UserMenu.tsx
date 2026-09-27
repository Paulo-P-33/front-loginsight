"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { logout } from "@/lib/auth";

interface UserMenuProps {
  name: string;
  role: string;
}

export function UserMenu({ name, role }: UserMenuProps) {
  const router = useRouter();
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Popover
      align="right"
      panelClassName="w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-slate-900">{name}</span>
            <span className="block text-xs text-slate-500">{role}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </button>
      )}
    >
      {() => (
        <ul role="menu" aria-label="Menu do usuário">
          <li role="none">
            <button
              role="menuitem"
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Meu perfil
            </button>
          </li>
          <li role="none">
            <button
              role="menuitem"
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Configurações
            </button>
          </li>
          <li role="none" className="my-1 border-t border-slate-100" />
          <li role="none">
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </li>
        </ul>
      )}
    </Popover>
  );
}
