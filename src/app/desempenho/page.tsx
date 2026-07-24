import { Target, BookOpenCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { mockUser, subjectPerformance, weakTopics } from "@/lib/mock-data";
import StatCard from "@/components/StatCard";
import SubjectBar from "@/components/SubjectBar";

export default function DesempenhoPage() {
  const overallAccuracy = Math.round(
    (mockUser.questionsCorrectTotal / mockUser.questionsAnsweredTotal) * 100
  );
  const wrongTotal = mockUser.questionsAnsweredTotal - mockUser.questionsCorrectTotal;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Desempenho</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Acompanhe sua evolução por matéria e assunto.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Target} label="Taxa geral de acerto" value={`${overallAccuracy}%`} accent="success" />
        <StatCard icon={BookOpenCheck} label="Questões respondidas" value={`${mockUser.questionsAnsweredTotal}`} accent="primary" />
        <StatCard icon={TrendingUp} label="Questões corretas" value={`${mockUser.questionsCorrectTotal}`} accent="success" />
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
      </section>
    </div>
  );
}
