import Link from "next/link";

export function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border px-3 py-3 text-center text-sm font-medium transition-colors md:text-left ${
        active
          ? "border-transparent bg-ink text-white"
          : "border-line bg-surface text-ink hover:bg-surfaceMuted"
      }`}
    >
      {label}
    </Link>
  );
}
