"use client";

import type { ReactNode } from "react";

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 hidden lg:block ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-[rgba(23,32,51,0.18)] transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute right-0 top-0 h-full w-full max-w-[520px] border-l border-line bg-surface px-6 py-6 shadow-shell transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-3 py-2 text-sm text-muted hover:bg-surfaceMuted"
          >
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </aside>
    </div>
  );
}
