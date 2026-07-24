import { PrismaClient } from "@prisma/client";

// Evita criar múltiplas instâncias do PrismaClient durante hot-reload em
// desenvolvimento (padrão recomendado pela documentação do Prisma para Next.js).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
