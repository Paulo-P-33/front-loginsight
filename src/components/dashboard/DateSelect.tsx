"use client";

import { useId, useState } from "react";
import { Calendar } from "lucide-react";

interface DateSelectProps {
  defaultValue?: string;
  onChange?: (isoDate: string) => void;
}

function toInputDate(brDate: string) {
  const [day, month, year] = brDate.split("/");
  return `${year}-${month}-${day}`;
}

export function DateSelect({ defaultValue, onChange }: DateSelectProps) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue ? toInputDate(defaultValue) : "");

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 focus-within:border-blue-400">
      <Calendar className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <label htmlFor={inputId} className="sr-only">
        Selecione uma data
      </label>
      <input
        id={inputId}
        type="date"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (event.target.value) {
            onChange?.(event.target.value);
          }
        }}
        className="w-28 bg-transparent text-sm text-slate-600 outline-none sm:w-32"
      />
    </div>
  );
}
