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
import realData from "@/data/real-questions.json";

type RealSubject = { slug: string; name: string; color: string; order: number };
type RealTopic = { subjectSlug: string; slug: string; name: string };
type RealOption = { label: string; text: string; isCorrect: boolean };
type RealQuestion = {
  subjectSlug: string;
  topicSlug: string;
  topicName: string;
  statement: string;
  options: RealOption[];
  explanation: string;
  examTip?: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  examYear: number;
  examNumber: number;
};

const real = realData as {
  subjects: RealSubject[];
  topics: RealTopic[];
  questions: RealQuestion[];
};

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

  // ------------------------------------------------------------------------
  // Questões OFICIAIS reais (transcritas de provas VUNESP TJSP anteriores,
  // ver src/data/real-questions.json). Matérias/assuntos próprios dessa
  // fonte são upsertados separadamente, podendo criar matérias/assuntos
  // novos além dos 6/14 de exemplo definidos em mock-data.ts.
  // ------------------------------------------------------------------------
  const realSubjectIdMap = new Map<string, string>(); // slug -> id
  for (const s of real.subjects) {
    const created = await prisma.subject.upsert({
      where: { examEditionId_slug: { examEditionId: edition.id, slug: s.slug } },
      update: { name: s.name, order: s.order, color: s.color },
      create: {
        examEditionId: edition.id,
        name: s.name,
        slug: s.slug,
        order: s.order,
        weight: 1,
        color: s.color,
      },
    });
    realSubjectIdMap.set(s.slug, created.id);
  }

  const realTopicIdMap = new Map<string, string>(); // "subjectSlug|topicSlug" -> id
  for (const t of real.topics) {
    const realSubjectId = realSubjectIdMap.get(t.subjectSlug);
    if (!realSubjectId) continue;
    const created = await prisma.topic.upsert({
      where: { subjectId_slug: { subjectId: realSubjectId, slug: t.slug } },
      update: { name: t.name },
      create: {
        subjectId: realSubjectId,
        name: t.name,
        slug: t.slug,
        incidence: 50,
      },
    });
    realTopicIdMap.set(`${t.subjectSlug}|${t.slug}`, created.id);
  }

  let createdRealQuestions = 0;
  for (const q of real.questions) {
    const realTopicId = realTopicIdMap.get(`${q.subjectSlug}|${q.topicSlug}`);
    if (!realTopicId) continue;

    const existing = await prisma.question.findFirst({
      where: { statement: q.statement, topicId: realTopicId },
    });
    if (existing) continue;

    await prisma.question.create({
      data: {
        topicId: realTopicId,
        statement: q.statement,
        origin: "OFICIAL",
        difficulty: q.difficulty,
        explanation: q.explanation,
        examTip: q.examTip ?? null,
        examBoard: "VUNESP",
        examName: "TJSP Escrevente Técnico Judiciário",
        examYear: q.examYear,
        source: `Prova VUNESP TJSP ${q.examYear} - Escrevente Técnico Judiciário (questão ${q.examNumber})`,
        tags: [q.subjectSlug, q.topicSlug, String(q.examYear)],
        status: "APPROVED",
        generatedBy: null,
        options: {
          create: q.options.map((o, i) => ({
            label: o.label,
            text: o.text,
            isCorrect: o.isCorrect,
            rationale: null,
            order: i,
          })),
        },
      },
    });
    createdRealQuestions++;
  }

  return {
    edition: `${edition.examName} ${edition.edition}`,
    subjects: subjectIdMap.size + realSubjectIdMap.size,
    topics: topicIdMap.size + realTopicIdMap.size,
    questionsCreated: createdQuestions,
    realQuestionsCreated: createdRealQuestions,
  };
}
