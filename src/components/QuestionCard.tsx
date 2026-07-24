"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Bookmark, BookmarkCheck, Lightbulb, GraduationCap } from "lucide-react";
import type { Question } from "@/lib/types";
import { OriginBadge, DifficultyBadge } from "./badges";
import { topicName } from "@/lib/study-engine";

// Observação: este componente é remontado a cada questão via `key={question.id}`
// no componente pai (SessaoClient), então o estado local (selectedId, submitted,
// saved) já nasce zerado a cada nova questão — não é necessário resetá-lo em um efeito.
export default function QuestionCard({
  question,
  index,
  total,
  onAnswered,
  onNext,
}: {
  question: Question;
  index: number;
  total: number;
  onAnswered: (correct: boolean, timeSpentSeconds: number) => void;
  onNext: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const selectedOption = question.options.find((o) => o.id === selectedId);
  const correctOption = question.options.find((o) => o.isCorrect);
  const isCorrect = !!selectedOption?.isCorrect;

  function handleSubmit() {
    if (!selectedId || submitted) return;
    setSubmitted(true);
    onAnswered(isCorrect, Math.round((Date.now() - startedAt) / 1000));
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--muted)]">
          Questão {index + 1} de {total}
        </span>
        <button
          onClick={() => setSaved((s) => !s)}
          className="flex items-center gap-1 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
        >
          {saved ? <BookmarkCheck size={16} className="text-[var(--primary)]" /> : <Bookmark size={16} />}
          {saved ? "Salva" : "Salvar"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <OriginBadge origin={question.origin} />
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
          {topicName(question.topicId)}
        </span>
      </div>

      <p className="mb-5 whitespace-pre-line text-[15px] leading-relaxed text-[var(--foreground)]">
        {question.statement}
      </p>

      <div className="space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          let stateClass =
            "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/40";

          if (submitted) {
            if (option.isCorrect) {
              stateClass = "border-[var(--success)] bg-[var(--success-light)]";
            } else if (isSelected && !option.isCorrect) {
              stateClass = "border-[var(--danger)] bg-[var(--danger-light)]";
            } else {
              stateClass = "border-[var(--border)] opacity-60";
            }
          } else if (isSelected) {
            stateClass = "border-[var(--primary)] bg-[var(--primary-light)]";
          }

          return (
            <button
              key={option.id}
              disabled={submitted}
              onClick={() => setSelectedId(option.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors disabled:cursor-default ${stateClass}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold">
                {option.label}
              </span>
              <span className="flex-1 leading-relaxed">{option.text}</span>
              {submitted && option.isCorrect && (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--success)]" />
              )}
              {submitted && isSelected && !option.isCorrect && (
                <XCircle size={18} className="mt-0.5 shrink-0 text-[var(--danger)]" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedId}
          className="mt-5 w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Responder
        </button>
      ) : (
        <div className="mt-5 space-y-4">
          <div
            className={`flex items-center gap-2 rounded-xl p-3.5 text-sm font-semibold ${
              isCorrect ? "bg-[var(--success-light)] text-[var(--success)]" : "bg-[var(--danger-light)] text-[var(--danger)]"
            }`}
          >
            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {isCorrect ? "Você acertou!" : `Você errou. A resposta correta é a alternativa ${correctOption?.label}.`}
          </div>

          <div className="rounded-xl border border-[var(--border)] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <GraduationCap size={16} className="text-[var(--primary)]" />
              Explicação
            </div>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">{question.explanation}</p>
          </div>

          {!isCorrect && selectedOption && (
            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="mb-1 text-sm font-semibold">Por que a alternativa {selectedOption.label} está errada</p>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{selectedOption.rationale}</p>
            </div>
          )}

          {question.examTip && (
            <div className="flex items-start gap-2 rounded-xl bg-[var(--warning-light)] p-4">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-[var(--warning)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--warning)]">Dica de prova</p>
                <p className="text-sm leading-relaxed text-[var(--foreground)]">{question.examTip}</p>
              </div>
            </div>
          )}

          <button
            onClick={onNext}
            className="w-full rounded-xl bg-[var(--foreground)] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            {index + 1 === total ? "Ver resultado" : "Próxima questão"}
          </button>
        </div>
      )}
    </div>
  );
}
