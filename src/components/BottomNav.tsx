"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BarChart3, RotateCcw, FileText } from "lucide-react";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/estudar", label: "Estudar", icon: BookOpen },
  { href: "/revisar", label: "Revisar", icon: RotateCcw },
  { href: "/simulados", label: "Simulados", icon: FileText },
  { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/80 md:hidden">
      <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
