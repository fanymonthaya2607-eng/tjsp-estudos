import Link from "next/link";
import { RotateCcw, Bookmark, ChevronRight } from "lucide-react";
import { getQuestionById, wrongQuestionIds, savedQuestionIds } from "@/lib/mock-data";
import { OriginBadge, DifficultyBadge } from "@/components/badges";
import { topicName } from "@/lib/study-engine";

export default function RevisarPage() {
  const wrongQuestions = wrongQuestionIds.map(getQuestionById).filter(Boolean);
  const savedQuestions = savedQuestionIds.map(getQuestionById).filter(Boolean);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Revisar</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Suas questões erradas e salvas para revisão.</p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--danger-light)] text-[var(--danger)]">
              <RotateCcw size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Questões erradas</h2>
              <p className="text-xs text-[var(--muted)]">{wrongQuestions.length} questões para revisar</p>
            </div>
          </div>
          <Link
            href="/estudar/sessao?mode=ERROR_REVIEW"
            className="flex items-center gap-1 rounded-xl bg-[var(--primary)] px-3.5 py-2 text-xs font-semibold text-white"
          >
            Revisar tudo <ChevronRight size={14} />
          </Link>
        </div>

        <ul className="space-y-2">
          {wrongQuestions.map((q) => (
            <li key={q!.id} className="rounded-xl border border-[var(--border)] p-3.5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <OriginBadge origin={q!.origin} />
                <DifficultyBadge difficulty={q!.difficulty} />
                <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                  {topicName(q!.topicId)}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-[var(--foreground)]">{q!.statement}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary-dark)]">
            <Bookmark size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold">Questões salvas</h2>
            <p className="text-xs text-[var(--muted)]">{savedQuestions.length} questões marcadas para depois</p>
          </div>
        </div>

        <ul className="space-y-2">
          {savedQuestions.map((q) => (
            <li key={q!.id} className="rounded-xl border border-[var(--border)] p-3.5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <OriginBadge origin={q!.origin} />
                <DifficultyBadge difficulty={q!.difficulty} />
                <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                  {topicName(q!.topicId)}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-[var(--foreground)]">{q!.statement}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
