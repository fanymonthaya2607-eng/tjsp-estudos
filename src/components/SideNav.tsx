"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BarChart3, RotateCcw, FileText, Scale, Flame } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/estudar", label: "Estudar", icon: BookOpen },
  { href: "/revisar", label: "Revisar erros", icon: RotateCcw },
  { href: "/simulados", label: "Simulados", icon: FileText },
  { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
          <Scale size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">TJSP Estudos</p>
          <p className="text-xs text-[var(--muted)] leading-tight">Escrevente Técnico</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--primary-light)] text-[var(--primary-dark)]"
                      : "text-[var(--foreground)] hover:bg-[var(--background)]"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
        <div className="flex items-center gap-2 text-sm">
          <Flame size={16} className="text-[var(--warning)]" />
          <span className="font-semibold">{mockUser.currentStreakDays} dias seguidos</span>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Nível {mockUser.level} · {mockUser.xp} XP
        </p>
      </div>
    </aside>
  );
}
