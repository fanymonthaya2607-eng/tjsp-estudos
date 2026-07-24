// ==========================================================================
// SEED — popula o banco PostgreSQL com o edital, matérias, assuntos e
// questões de exemplo definidos em src/lib/mock-data.ts.
//
// Reutiliza a mesma fonte de dados que alimenta a interface na Etapa 1,
// então o que você vê na tela hoje (com dados mockados) é exatamente o
// que será inserido no banco real quando você rodar este script.
//
// Como rodar (na sua máquina, ou onde houver acesso de rede normal):
//   1. Configure DATABASE_URL no .env com sua string de conexão PostgreSQL
//   2. npx prisma migrate dev --name init
//   3. npm run db:seed
// ==========================================================================

import { PrismaClient } from "@prisma/client";
import {
  activeEdition,
  subjects,
  topics,
  questions,
} from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding banco de dados...");

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
      update: { name: s.name, order: s.order, weight: s.weight },
      create: {
        examEditionId: edition.id,
        name: s.name,
        slug: s.slug,
        order: s.order,
        weight: s.weight,
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

  let created = 0;
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
    created++;
  }

  console.log(`Concluído: edital "${edition.examName} ${edition.edition}", ${subjectIdMap.size} matérias, ${topicIdMap.size} assuntos, ${created} questões novas inseridas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
