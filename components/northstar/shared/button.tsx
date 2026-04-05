import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "destructive";

type ButtonProps = {
  variant: ButtonVariant;
  children: ReactNode;
  href?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-white hover:bg-[#1f4cc0] focus-visible:outline-primary",
  secondary:
    "border-line bg-surface text-ink hover:bg-surfaceMuted focus-visible:outline-primary",
  destructive:
    "border-transparent bg-danger text-white hover:bg-[#ab342f] focus-visible:outline-danger",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function Button({
  variant,
  children,
  href,
  onClick,
  type = "button",
}: ButtonProps) {
  const className = `${baseClasses} ${variantClasses[variant]}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
