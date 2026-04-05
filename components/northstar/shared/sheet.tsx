"use client";

import type { ReactNode } from "react";

export function Sheet({
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
      className={`fixed inset-0 z-40 lg:hidden ${
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
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-x-0 bottom-0 max-h-[92vh] rounded-t-[28px] border-t border-line bg-surface px-5 py-5 shadow-shell transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
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
        <div className="mt-6 max-h-[72vh] overflow-y-auto pb-4">{children}</div>
      </section>
    </div>
  );
}
