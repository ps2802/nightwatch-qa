import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-card border border-line bg-surfaceMuted/70 p-5 shadow-card ${className ?? ""}`.trim()}
    >
      {children}
    </section>
  );
}
