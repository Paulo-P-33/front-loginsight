"use client";

import { useState } from "react";
import { ChevronDown, Truck } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { svcOptions } from "@/lib/dashboard-data";

interface SvcSelectProps {
  defaultValue?: string;
}

export function SvcSelect({ defaultValue }: SvcSelectProps) {
  const [selected, setSelected] = useState<string | null>(defaultValue ?? null);

  return (
    <Popover
      panelClassName="w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        >
          <Truck className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span className="max-w-24 truncate sm:max-w-40">{selected ?? "Selecione um SVC"}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </button>
      )}
    >
      {({ close }) => (
        <ul role="listbox" aria-label="Selecione um SVC">
          {svcOptions.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={selected === option}
                onClick={() => {
                  setSelected(option);
                  close();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
