// ==========================================================================
// SEED — popula o banco PostgreSQL com o edital, matérias, assuntos e
// questões de exemplo definidos em src/lib/mock-data.ts.
//
// A lógica em si vive em src/lib/seed-database.ts, compartilhada com a
// rota /api/admin/seed (usada para popular o banco direto pela Vercel,
// já que este sandbox não consegue baixar os binários do Prisma).
//
// Como rodar (na sua máquina, ou onde houver acesso de rede normal):
//   1. Configure DATABASE_URL no .env com sua string de conexão PostgreSQL
//   2. npx prisma db push
//   3. npm run db:seed
// ==========================================================================

import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seed-database";

const prisma = new PrismaClient();

seedDatabase(prisma)
  .then((summary) => {
    console.log(
      `Concluído: edital "${summary.edition}", ${summary.subjects} matérias, ${summary.topics} assuntos, ${summary.questionsCreated} questões novas inseridas.`
    );
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
