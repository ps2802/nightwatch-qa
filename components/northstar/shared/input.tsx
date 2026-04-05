import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: ReactNode;
};

export function Input({ leadingIcon, className, ...props }: InputProps) {
  return (
    <label className="flex w-full items-center gap-3 rounded-full border border-line bg-surfaceMuted px-3 py-2 focus-within:border-primary">
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      <input
        {...props}
        className={`w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted ${className ?? ""}`.trim()}
      />
    </label>
  );
}
