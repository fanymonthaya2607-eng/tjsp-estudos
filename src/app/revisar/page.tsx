import Link from "next/link";
import { RotateCcw, Bookmark, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { getWrongQuestionIds, getQuestionsByIds, getSavedQuestions } from "@/lib/queries";
import { OriginBadge, DifficultyBadge } from "@/components/badges";

export default async function RevisarPage() {
  const session = await auth();
  if (!session?.user) return null;

  const wrongIds = await getWrongQuestionIds(session.user.id, 50);
  const [wrongQuestions, savedQuestions] = await Promise.all([
    getQuestionsByIds(wrongIds),
    getSavedQuestions(session.user.id),
  ]);

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
          {wrongQuestions.length > 0 && (
            <Link
              href="/estudar/sessao?mode=ERROR_REVIEW"
              className="group flex items-center gap-1 rounded-xl bg-[var(--primary)] px-3.5 py-2 text-xs font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] hover:shadow-md active:translate-y-0"
            >
              Revisar tudo <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {wrongQuestions.length > 0 ? (
          <ul className="space-y-2">
            {wrongQuestions.map((q) => (
              <li key={q.id} className="themeable rounded-xl border border-[var(--border)] p-3.5 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <OriginBadge origin={q.origin} />
                  <DifficultyBadge difficulty={q.difficulty} />
                  <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                    {q.topic.name}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-[var(--foreground)]">{q.statement}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted)]">Nenhuma questão errada por aqui — continue assim!</p>
        )}
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

        {savedQuestions.length > 0 ? (
          <ul className="space-y-2">
            {savedQuestions.map((q) => (
              <li key={q.id} className="themeable rounded-xl border border-[var(--border)] p-3.5 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <OriginBadge origin={q.origin} />
                  <DifficultyBadge difficulty={q.difficulty} />
                  <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                    {q.topic.name}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-[var(--foreground)]">{q.statement}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Toque no ícone de marcador em qualquer questão para salvá-la aqui.
          </p>
        )}
      </section>
    </div>
  );
}
