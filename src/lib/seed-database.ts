// ==========================================================================
// Lógica de seed compartilhada — usada tanto pelo script `prisma/seed.ts`
// (para rodar localmente) quanto pela rota `/api/admin/seed` (para rodar
// direto no ambiente da Vercel, que tem acesso de rede completo).
//
// Popula o banco com o edital, matérias, assuntos e questões de exemplo
// definidos em src/lib/mock-data.ts. Idempotente: pode ser executada mais
// de uma vez sem duplicar dados (usa upsert / verificação de existência).
// ==========================================================================

import type { PrismaClient } from "@prisma/client";
import { activeEdition, subjects, topics, questions } from "@/lib/mock-data";

export async function seedDatabase(prisma: PrismaClient) {
  const edition = await prisma.examEdition.upsert({
    where: { examName_edition: { examName: activeEdition.examName, edition: activeEdition.edition } },
    update: {},
    create: {
      examName: activeEdition.examName,
      edition: activeEdition.edition,
      organizer: activeEdition.organizer,
      isActive: activeEdition.isActive,
      description:
        "Edição de exemplo criada pela etapa 1 do MVP. Atualize o conteúdo programático conforme o edital oficial publicado.",
    },
  });

  const subjectIdMap = new Map<string, string>();
  for (const s of subjects) {
    const created = await prisma.subject.upsert({
      where: { examEditionId_slug: { examEditionId: edition.id, slug: s.slug } },
      update: { name: s.name, order: s.order, weight: s.weight, color: s.color },
      create: {
        examEditionId: edition.id,
        name: s.name,
        slug: s.slug,
        order: s.order,
        weight: s.weight,
        color: s.color,
      },
    });
    subjectIdMap.set(s.id, created.id);
  }

  const topicIdMap = new Map<string, string>();
  for (const t of topics) {
    const realSubjectId = subjectIdMap.get(t.subjectId);
    if (!realSubjectId) continue;
    const created = await prisma.topic.upsert({
      where: { subjectId_slug: { subjectId: realSubjectId, slug: t.slug } },
      update: { name: t.name, incidence: t.incidence },
      create: {
        subjectId: realSubjectId,
        name: t.name,
        slug: t.slug,
        incidence: t.incidence,
      },
    });
    topicIdMap.set(t.id, created.id);
  }

  let createdQuestions = 0;
  for (const q of questions) {
    const realTopicId = topicIdMap.get(q.topicId);
    if (!realTopicId) continue;

    const existing = await prisma.question.findFirst({
      where: { statement: q.statement, topicId: realTopicId },
    });
    if (existing) continue;

    await prisma.question.create({
      data: {
        topicId: realTopicId,
        statement: q.statement,
        origin: q.origin,
        difficulty: q.difficulty,
        explanation: q.explanation,
        examTip: q.examTip,
        examBoard: q.examBoard,
        examYear: q.examYear,
        source: q.source,
        tags: q.tags,
        status: "APPROVED",
        generatedBy: q.origin !== "OFICIAL" ? "seed-inicial" : null,
        options: {
          create: q.options.map((o, i) => ({
            label: o.label,
            text: o.text,
            isCorrect: o.isCorrect,
            rationale: o.rationale,
            order: i,
          })),
        },
      },
    });
    createdQuestions++;
  }

  return {
    edition: `${edition.examName} ${edition.edition}`,
    subjects: subjectIdMap.size,
    topics: topicIdMap.size,
    questionsCreated: createdQuestions,
  };
}
