import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "danger";
}) {
  const accentClass = {
    primary: "bg-[var(--primary-light)] text-[var(--primary-dark)]",
    success: "bg-[var(--success-light)] text-[var(--success)]",
    warning: "bg-[var(--warning-light)] text-[var(--warning)]",
    danger: "bg-[var(--danger-light)] text-[var(--danger)]",
  }[accent];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${accentClass}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold leading-tight">{value}</p>
      <p className="text-sm text-[var(--muted)]">{label}</p>
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
