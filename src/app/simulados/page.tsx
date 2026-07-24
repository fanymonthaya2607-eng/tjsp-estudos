import Link from "next/link";
import { Clock, FileSpreadsheet, ListChecks } from "lucide-react";

const simuladoTemplates = [
  {
    id: "sim-completo",
    name: "Simulado Completo TJSP",
    description: "Todas as matérias do edital, proporcional ao peso de cada uma",
    totalQuestions: 20,
    timeLimitMinutes: 40,
  },
  {
    id: "sim-portugues",
    name: "Simulado — Língua Portuguesa",
    description: "Foco total em interpretação, crase, concordância e pontuação",
    totalQuestions: 10,
    timeLimitMinutes: 20,
  },
  {
    id: "sim-direito",
    name: "Simulado — Blocos de Direito",
    description: "Constitucional, Administrativo e Processual Civil combinados",
    totalQuestions: 12,
    timeLimitMinutes: 25,
  },
];

export default function SimuladosPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Simulados</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Provas completas para treinar sob condições parecidas com o dia da prova.
        </p>
      </section>

      <section className="space-y-3">
        {simuladoTemplates.map((sim) => (
          <div key={sim.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success-light)] text-[var(--success)]">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <p className="font-semibold">{sim.name}</p>
                  <p className="text-sm text-[var(--muted)]">{sim.description}</p>
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <ListChecks size={14} /> {sim.totalQuestions} questões
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {sim.timeLimitMinutes} minutos
              </span>
            </div>
            <Link
              href={`/estudar/sessao?mode=SIMULADO&count=${sim.totalQuestions}`}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
            >
              Iniciar simulado
            </Link>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
        <p className="font-semibold text-[var(--foreground)]">Em breve</p>
        <p className="mt-1">
          Cronômetro em tela, distribuição configurável por matéria e comparação com simulados
          anteriores chegam na próxima etapa, junto com o banco de dados real.
        </p>
      </section>
    </div>
  );
}
