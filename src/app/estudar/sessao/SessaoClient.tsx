"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Home, RotateCcw, Trophy } from "lucide-react";
import { submitAnswer } from "@/lib/actions";
import type { StudyMode } from "@/lib/types";
import type { SessionQuestion } from "@/lib/db-types";
import QuestionCard from "@/components/QuestionCard";

const modeTitles: Record<StudyMode, string> = {
  QUICK_STUDY: "Estudar agora",
  FREE: "Estudo livre",
  ERROR_REVIEW: "Revisão de erros",
  HARD_QUESTIONS: "Questões difíceis",
  SMART_REVIEW: "Revisão inteligente",
  SIMULADO: "Simulado",
  VUNESP_TRAINING: "Treino VUNESP",
  DAILY_CHALLENGE: "Desafio diário",
  TOPIC_TRAINING: "Treino de assunto",
};

export default function SessaoClient({
  mode,
  questions,
  savedQuestionIds,
}: {
  mode: StudyMode;
  questions: SessionQuestion[];
  savedQuestionIds: string[];
}) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const savedSet = new Set(savedQuestionIds);

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="font-semibold">Nenhuma questão encontrada para esta seleção.</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Tente escolher outra matéria, assunto ou modo de estudo.
        </p>
        <Link
          href="/estudar"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] hover:shadow-md active:translate-y-0"
        >
          Voltar para Estudar
        </Link>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="animate-pop-in rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)] shadow-inner">
          <Trophy size={28} />
        </div>
        <h1 className="text-xl font-bold">Sessão concluída!</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{modeTitles[mode]}</p>

        <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
          <div className="rounded-xl bg-[var(--background)] p-4">
            <p className="text-2xl font-bold">{correctCount}/{questions.length}</p>
            <p className="text-xs text-[var(--muted)]">Acertos</p>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <p className="text-2xl font-bold">{accuracy}%</p>
            <p className="text-xs text-[var(--muted)]">Aproveitamento</p>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-xs flex-col gap-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] hover:shadow-md active:translate-y-0"
          >
            <Home size={16} /> Voltar ao início
          </Link>
          <Link
            href="/estudar"
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-3 text-sm font-semibold hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-sm active:translate-y-0"
          >
            <RotateCcw size={16} /> Estudar novamente
          </Link>
        </div>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{modeTitles[mode]}</h1>
        <span className="flex items-center gap-1 text-sm font-medium text-[var(--success)]">
          <CheckCircle2 size={16} />
          {correctCount}/{answeredCount || 0}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-all"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        key={current.id}
        question={current}
        index={index}
        total={questions.length}
        initialSaved={savedSet.has(current.id)}
        onAnswered={(correct, timeSpentSeconds, selectedOptionId) => {
          setAnsweredCount((c) => c + 1);
          if (correct) setCorrectCount((c) => c + 1);
          submitAnswer({
            questionId: current.id,
            selectedOptionId,
            isCorrect: correct,
            timeSpentSeconds,
          }).catch(() => {
            // Falha silenciosa: a resposta já foi mostrada na tela; se o registro
            // no banco falhar, o desempenho pode ficar levemente desatualizado,
            // mas isso não deve travar a experiência de estudo.
          });
        }}
        onNext={() => {
          if (index + 1 >= questions.length) {
            setFinished(true);
          } else {
            setIndex((i) => i + 1);
          }
        }}
      />
    </div>
  );
}
