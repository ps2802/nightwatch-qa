"use client";

import type { ReactNode } from "react";
import { SideNav } from "@/components/northstar/shell/side-nav";
import { TopBar } from "@/components/northstar/shell/top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-3 py-3 md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-5 md:px-5 md:py-5">
        <aside className="mb-4 md:mb-0">
          <SideNav />
        </aside>
        <div className="flex min-h-[calc(100vh-2rem)] min-w-0 flex-col">
          <TopBar />
          <main className="mt-3 min-w-0 rounded-shell border border-line bg-surface px-4 py-4 shadow-shell md:mt-5 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
