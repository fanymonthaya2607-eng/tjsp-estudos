import type { Difficulty, QuestionOrigin } from "@/lib/types";

const originConfig: Record<QuestionOrigin, { label: string; className: string }> = {
  OFICIAL: {
    label: "OFICIAL · prova real",
    className: "bg-[var(--success-light)] text-[var(--success)]",
  },
  INEDITA: {
    label: "INÉDITA · gerada para treino",
    className: "bg-[var(--primary-light)] text-[var(--primary-dark)]",
  },
  ADAPTADA: {
    label: "ADAPTADA · mesmo conceito",
    className: "bg-[var(--warning-light)] text-[var(--warning)]",
  },
};

export function OriginBadge({ origin }: { origin: QuestionOrigin }) {
  const cfg = originConfig[origin];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

const difficultyConfig: Record<Difficulty, { label: string; className: string }> = {
  EASY: { label: "Fácil", className: "bg-[var(--success-light)] text-[var(--success)]" },
  MEDIUM: { label: "Médio", className: "bg-[var(--warning-light)] text-[var(--warning)]" },
  HARD: { label: "Difícil", className: "bg-[var(--danger-light)] text-[var(--danger)]" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const cfg = difficultyConfig[difficulty];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
