"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  RotateCcw,
  Flame,
  BrainCircuit,
  FileSpreadsheet,
  Landmark,
  Swords,
  BookMarked,
  ChevronRight,
} from "lucide-react";

const modes = [
  {
    href: "/estudar/sessao?mode=ERROR_REVIEW",
    icon: RotateCcw,
    title: "Revisão de Erros",
    description: "Questões que você errou anteriormente",
    color: "text-[var(--danger)] bg-[var(--danger-light)]",
  },
  {
    href: "/estudar/sessao?mode=HARD_QUESTIONS",
    icon: Flame,
    title: "Questões Difíceis",
    description: "Assuntos com baixo desempenho",
    color: "text-[var(--warning)] bg-[var(--warning-light)]",
  },
  {
    href: "/estudar/sessao?mode=SMART_REVIEW",
    icon: BrainCircuit,
    title: "Revisão Inteligente",
    description: "Assuntos selecionados automaticamente",
    color: "text-[var(--primary)] bg-[var(--primary-light)]",
  },
  {
    href: "/simulados",
    icon: FileSpreadsheet,
    title: "Simulado",
    description: "Prova completa cronometrada",
    color: "text-[var(--success)] bg-[var(--success-light)]",
  },
  {
    href: "/estudar/sessao?mode=VUNESP_TRAINING",
    icon: Landmark,
    title: "Treino VUNESP",
    description: "Estilo de cobrança da banca",
    color: "text-[var(--primary)] bg-[var(--primary-light)]",
  },
  {
    href: "/estudar/sessao?mode=DAILY_CHALLENGE",
    icon: Swords,
    title: "Desafio Diário",
    description: "5 questões, uma vez por dia",
    color: "text-[var(--warning)] bg-[var(--warning-light)]",
  },
];

type SubjectWithTopics = {
  id: string;
  name: string;
  topics: { id: string; name: string }[];
};

export default function EstudarClient({ subjects }: { subjects: SubjectWithTopics[] }) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [topicId, setTopicId] = useState<string>("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [count, setCount] = useState(10);

  const topicsForSubject = useMemo(
    () => subjects.find((s) => s.id === subjectId)?.topics ?? [],
    [subjects, subjectId]
  );

  const freeStudyHref = `/estudar/sessao?mode=FREE&subjectId=${subjectId}${
    topicId ? `&topicId=${topicId}` : ""
  }&difficulty=${difficulty}&count=${count}`;

  const topicTrainingHref = topicId
    ? `/estudar/sessao?mode=TOPIC_TRAINING&topicId=${topicId}&count=${count}`
    : undefined;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Estudar</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Escolha um modo de estudo ou monte sua sessão livre.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {modes.map((m) => (
          <Link
            key={m.title}
            href={m.href}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.color}`}>
              <m.icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">{m.title}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{m.description}</p>
            </div>
          </Link>
        ))}
      </section>

      {subjects.length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary-dark)]">
              <BookMarked size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Estudo Livre / Treino de um Assunto</h2>
              <p className="text-xs text-[var(--muted)]">Escolha matéria, assunto, dificuldade e quantidade</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Matéria</span>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setTopicId("");
                }}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium">Assunto (opcional)</span>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
              >
                <option value="">Todos os assuntos</option>
                {topicsForSubject.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium">Dificuldade</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
              >
                <option value="ALL">Todas</option>
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Médio</option>
                <option value="HARD">Difícil</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium">Quantidade de questões</span>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
              >
                {[5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} questões
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={freeStudyHref}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
            >
              <Sparkles size={16} />
              Começar estudo livre
              <ChevronRight size={16} />
            </Link>
            {topicTrainingHref && (
              <Link
                href={topicTrainingHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-3 text-sm font-semibold transition-colors hover:border-[var(--primary)]"
              >
                Treinar só este assunto
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
