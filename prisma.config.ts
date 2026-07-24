// ==========================================================================
// Configuração do Prisma 7 (substitui o antigo datasource.url em schema.prisma
// e o campo "prisma.seed" do package.json — ambos removidos nesta versão).
// ==========================================================================

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
