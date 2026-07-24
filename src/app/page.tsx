import Link from "next/link";
import {
  Flame,
  Target,
  BookOpenCheck,
  ArrowRight,
  RotateCcw,
  Swords,
  PlayCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getActiveEdition,
  getOrCreateUserStreak,
  getUserOverview,
  getSubjectPerformance,
  getWeakTopics,
  getWrongQuestionIds,
} from "@/lib/queries";
import StatCard from "@/components/StatCard";
import SubjectBar from "@/components/SubjectBar";
import EditalPendente from "@/components/EditalPendente";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;
  const userId = session.user.id;
  const firstName = (session.user.name ?? "").split(" ")[0] || "por aí";

  const edition = await getActiveEdition();
  if (!edition) return <EditalPendente />;

  const [streak, overview, subjectPerformance, weakTopics, wrongIds] = await Promise.all([
    getOrCreateUserStreak(userId),
    getUserOverview(userId),
    getSubjectPerformance(userId, edition.id),
    getWeakTopics(userId),
    getWrongQuestionIds(userId, 200),
  ]);

  const hasAnswered = overview.questionsAnsweredTotal > 0;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-[var(--muted)]">{greeting()}, {firstName} 👋</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Vamos estudar?</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {edition.examName} · {edition.edition} · Banca {edition.organizer}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Sequência atual" value={`${streak.currentStreak} dias`} accent="warning" />
        <StatCard icon={Target} label="Taxa de acerto" value={`${overview.accuracy}%`} accent="success" />
        <StatCard icon={BookOpenCheck} label="Questões respondidas" value={`${overview.questionsAnsweredTotal}`} accent="primary" />
        <StatCard icon={Swords} label="Nível" value={`${streak.level}`} hint={`${streak.xp} XP`} accent="danger" />
      </section>

      <section>
        <Link
          href="/estudar/sessao?mode=QUICK_STUDY"
          className="group flex items-center justify-between rounded-2xl bg-[var(--primary)] p-5 text-white shadow-lg shadow-[var(--primary)]/20 transition-transform active:scale-[0.99]"
        >
          <div>
            <p className="flex items-center gap-2 text-lg font-bold">
              <PlayCircle size={22} /> Estudar agora
            </p>
            <p className="mt-1 text-sm text-white/85">
              Sessão personalizada de 10 questões, com foco nos seus pontos fracos
            </p>
          </div>
          <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/revisar"
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--danger-light)] text-[var(--danger)]">
                <RotateCcw size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Revisar erros</p>
                <p className="text-xs text-[var(--muted)]">{wrongIds.length} questões para revisar</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[var(--muted)]" />
          </Link>

          <Link
            href="/estudar/sessao?mode=DAILY_CHALLENGE"
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--warning-light)] text-[var(--warning)]">
                <Swords size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Desafio diário</p>
                <p className="text-xs text-[var(--muted)]">5 questões · vale XP em dobro</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[var(--muted)]" />
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Seu desempenho</h2>
          <Link href="/desempenho" className="text-xs font-semibold text-[var(--primary)]">
            Ver tudo
          </Link>
        </div>
        <div className="space-y-4">
          {subjectPerformance.map((s) => (
            <SubjectBar key={s.subjectId} item={s} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-3 text-base font-semibold">Seus pontos fracos</h2>
        {weakTopics.length > 0 ? (
          <ul className="space-y-2">
            {weakTopics.map((t, i) => (
              <li key={t.topicId} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--danger-light)] text-[10px] font-bold text-[var(--danger)]">
                    {i + 1}
                  </span>
                  <span>{t.topicName}</span>
                </div>
                <span className="text-[var(--muted)]">{t.accuracy}% de acerto</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            {hasAnswered
              ? "Continue respondendo questões para identificarmos seus pontos fracos com mais precisão."
              : "Responda algumas questões para começarmos a identificar seus pontos fracos."}
          </p>
        )}
      </section>
    </div>
  );
}
