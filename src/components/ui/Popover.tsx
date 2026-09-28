"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface PopoverRenderProps {
  open: boolean;
  toggle: () => void;
}

interface PopoverPanelProps {
  close: () => void;
}

interface PopoverProps {
  trigger: (props: PopoverRenderProps) => ReactNode;
  children: (props: PopoverPanelProps) => ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}

export function Popover({ trigger, children, align = "left", panelClassName = "" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          className={`absolute z-20 mt-2 max-w-[calc(100vw-2rem)] ${align === "right" ? "right-0" : "left-0"} ${panelClassName}`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}
