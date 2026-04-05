"use client";

import { usePathname } from "next/navigation";
import { NavItem } from "@/components/northstar/shared/nav-item";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/board", label: "Board" },
  { href: "/approvals", label: "Approvals" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-shell border border-line bg-surface px-4 py-4 shadow-shell md:h-full md:px-5 md:py-6">
      <div className="mb-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Northstar
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">
          Founder workspace
        </h2>
      </div>
      <nav aria-label="Primary" className="grid grid-cols-3 gap-2 md:grid-cols-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/campaigns" && pathname.startsWith("/campaigns"));

          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={active}
            />
          );
        })}
      </nav>
    </div>
  );
}
