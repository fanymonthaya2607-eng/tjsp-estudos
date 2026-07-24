import { prisma } from "@/lib/prisma";

// ==========================================================================
// Consultas ao banco de dados real (PostgreSQL via Prisma).
// Substituem os dados de exemplo de src/lib/mock-data.ts a partir da Etapa 2.
// ==========================================================================

/** Garante que toda usuária logada tenha um registro de sequência/XP, criando um zerado na primeira visita. */
export async function getOrCreateUserStreak(userId: string) {
  return prisma.userStreak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

/** Edital vigente (mais recente marcado como ativo). */
export async function getActiveEdition() {
  return prisma.examEdition.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubjectsWithTopics(examEditionId: string) {
  return prisma.subject.findMany({
    where: { examEditionId },
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" } } },
  });
}

const questionWithOptions = {
  options: { orderBy: { order: "asc" as const } },
  topic: { select: { id: true, name: true, subjectId: true } },
};

/** Todas as questões aprovadas do edital vigente, com alternativas e assunto. */
export async function getAllApprovedQuestions(examEditionId: string) {
  return prisma.question.findMany({
    where: {
      status: "APPROVED",
      topic: { subject: { examEditionId } },
    },
    include: questionWithOptions,
  });
}

export async function getQuestionsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.question.findMany({
    where: { id: { in: ids } },
    include: questionWithOptions,
  });
}

export async function getQuestionsByTopic(topicId: string) {
  return prisma.question.findMany({
    where: { topicId, status: "APPROVED" },
    include: questionWithOptions,
  });
}

export async function getQuestionsBySubject(subjectId: string, difficulty?: string) {
  return prisma.question.findMany({
    where: {
      status: "APPROVED",
      topic: { subjectId },
      ...(difficulty && difficulty !== "ALL" ? { difficulty: difficulty as never } : {}),
    },
    include: questionWithOptions,
  });
}

/** Desempenho por assunto, calculado a partir das respostas reais da usuária. */
export async function getUserTopicStats(userId: string) {
  const answers = await prisma.userAnswer.findMany({
    where: { userId },
    select: {
      isCorrect: true,
      question: {
        select: {
          topicId: true,
          topic: { select: { name: true, subjectId: true, subject: { select: { name: true } } } },
        },
      },
    },
  });

  const byTopic = new Map<
    string,
    { topicName: string; subjectId: string; subjectName: string; answered: number; correct: number }
  >();

  for (const a of answers) {
    const topicId = a.question.topicId;
    const entry =
      byTopic.get(topicId) ??
      ({
        topicName: a.question.topic.name,
        subjectId: a.question.topic.subjectId,
        subjectName: a.question.topic.subject.name,
        answered: 0,
        correct: 0,
      } as const);
    byTopic.set(topicId, {
      ...entry,
      answered: entry.answered + 1,
      correct: entry.correct + (a.isCorrect ? 1 : 0),
    });
  }

  return Array.from(byTopic.entries()).map(([topicId, v]) => ({
    topicId,
    ...v,
    accuracy: v.answered > 0 ? Math.round((v.correct / v.answered) * 100) : 0,
  }));
}

/** Desempenho agregado por matéria (soma dos assuntos), a partir de respostas reais. */
export async function getUserSubjectStats(userId: string) {
  const topicStats = await getUserTopicStats(userId);
  const bySubject = new Map<string, { subjectName: string; answered: number; correct: number }>();

  for (const t of topicStats) {
    const entry = bySubject.get(t.subjectId) ?? { subjectName: t.subjectName, answered: 0, correct: 0 };
    bySubject.set(t.subjectId, {
      subjectName: t.subjectName,
      answered: entry.answered + t.answered,
      correct: entry.correct + t.correct,
    });
  }

  return Array.from(bySubject.entries()).map(([subjectId, v]) => ({
    subjectId,
    ...v,
    accuracy: v.answered > 0 ? Math.round((v.correct / v.answered) * 100) : 0,
  }));
}

/** Desempenho por matéria pronto para exibição: inclui TODAS as matérias do edital
 * (mesmo as que a usuária ainda não respondeu, mostrando 0%), já com a cor de cada uma. */
export async function getSubjectPerformance(userId: string, examEditionId: string) {
  const [subjects, stats] = await Promise.all([
    prisma.subject.findMany({
      where: { examEditionId },
      orderBy: { order: "asc" },
      select: { id: true, name: true, color: true },
    }),
    getUserSubjectStats(userId),
  ]);

  const statsBySubjectId = new Map(stats.map((s) => [s.subjectId, s]));

  return subjects.map((s) => {
    const stat = statsBySubjectId.get(s.id);
    return {
      subjectId: s.id,
      subjectName: s.name,
      color: s.color,
      answered: stat?.answered ?? 0,
      correct: stat?.correct ?? 0,
      accuracy: stat?.accuracy ?? 0,
    };
  });
}

/** Assuntos com pior desempenho (mínimo de respostas para entrar na lista). */
export async function getWeakTopics(userId: string, limit = 4, minAnswered = 3) {
  const stats = await getUserTopicStats(userId);
  return stats
    .filter((t) => t.answered >= minAnswered)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

/** IDs das questões que a usuária errou na resposta mais recente (para o modo Revisão de Erros). */
export async function getWrongQuestionIds(userId: string, limit = 30) {
  const wrongAnswers = await prisma.userAnswer.findMany({
    where: { userId, isCorrect: false },
    orderBy: { answeredAt: "desc" },
    select: { questionId: true },
    take: limit * 3, // margem para remover duplicados
  });
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const a of wrongAnswers) {
    if (!seen.has(a.questionId)) {
      seen.add(a.questionId);
      ids.push(a.questionId);
    }
    if (ids.length >= limit) break;
  }
  return ids;
}

export async function getSavedQuestions(userId: string) {
  const saved = await prisma.savedQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { question: { include: questionWithOptions } },
  });
  return saved.map((s) => s.question);
}

export async function getSavedQuestionIds(userId: string) {
  const saved = await prisma.savedQuestion.findMany({ where: { userId }, select: { questionId: true } });
  return new Set(saved.map((s) => s.questionId));
}

/** Resumo geral (para o dashboard): total respondidas, corretas, taxa de acerto. */
export async function getUserOverview(userId: string) {
  const [answered, correct] = await Promise.all([
    prisma.userAnswer.count({ where: { userId } }),
    prisma.userAnswer.count({ where: { userId, isCorrect: true } }),
  ]);
  return {
    questionsAnsweredTotal: answered,
    questionsCorrectTotal: correct,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
  };
}
