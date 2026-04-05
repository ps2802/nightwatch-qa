import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "success" | "warning" | "danger";

type BadgeProps = {
  variant: BadgeVariant;
  children: ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surfaceMuted text-muted",
  success: "bg-[rgba(31,143,95,0.12)] text-success",
  warning: "bg-[rgba(183,121,31,0.14)] text-warning",
  danger: "bg-[rgba(194,65,61,0.12)] text-danger",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
