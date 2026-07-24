import { Target, BookOpenCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { getActiveEdition, getUserOverview, getSubjectPerformance, getWeakTopics } from "@/lib/queries";
import StatCard from "@/components/StatCard";
import SubjectBar from "@/components/SubjectBar";
import EditalPendente from "@/components/EditalPendente";

export default async function DesempenhoPage() {
  const session = await auth();
  if (!session?.user) return null;

  const edition = await getActiveEdition();
  if (!edition) return <EditalPendente />;

  const [overview, subjectPerformance, weakTopics] = await Promise.all([
    getUserOverview(session.user.id),
    getSubjectPerformance(session.user.id, edition.id),
    getWeakTopics(session.user.id, 10, 1),
  ]);

  const wrongTotal = overview.questionsAnsweredTotal - overview.questionsCorrectTotal;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Desempenho</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Acompanhe sua evolução por matéria e assunto.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Target} label="Taxa geral de acerto" value={`${overview.accuracy}%`} accent="success" />
        <StatCard icon={BookOpenCheck} label="Questões respondidas" value={`${overview.questionsAnsweredTotal}`} accent="primary" />
        <StatCard icon={TrendingUp} label="Questões corretas" value={`${overview.questionsCorrectTotal}`} accent="success" />
        <StatCard icon={AlertTriangle} label="Questões erradas" value={`${wrongTotal}`} accent="danger" />
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 text-base font-semibold">Desempenho por matéria</h2>
        <div className="space-y-5">
          {subjectPerformance.map((s) => (
            <SubjectBar key={s.subjectId} item={s} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 text-base font-semibold">Pontos fracos por assunto</h2>
        {weakTopics.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--background)] text-left text-xs text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">Assunto</th>
                  <th className="px-3 py-2 font-medium">Matéria</th>
                  <th className="px-3 py-2 text-right font-medium">Acerto</th>
                </tr>
              </thead>
              <tbody>
                {weakTopics.map((t) => (
                  <tr key={t.topicId} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2.5 font-medium">{t.topicName}</td>
                    <td className="px-3 py-2.5 text-[var(--muted)]">{t.subjectName}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-[var(--danger)]">{t.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Ainda não há dados suficientes. Responda algumas questões em cada assunto para vermos seus pontos fracos aqui.
          </p>
        )}
      </section>
    </div>
  );
}
