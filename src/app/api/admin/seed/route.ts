// ==========================================================================
// Rota administrativa para popular o banco de dados em produção.
//
// Existe porque o ambiente de desenvolvimento (sandbox) usado para gerar
// este código não consegue baixar os binários do Prisma (bloqueio de rede),
// então rodar `prisma db push` / `npm run db:seed` só é possível de um
// ambiente com internet normal — como a própria Vercel.
//
// Protegida por AUTH_SECRET (o mesmo segredo do NextAuth) via query param
// `?key=`. Chame uma vez após configurar DATABASE_URL, depois pode
// remover esta rota se quiser.
// ==========================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-database";

// Popular ~280 questões envolve várias escritas no banco; o padrão de
// alguns planos da Vercel é bem curto (10s), então damos mais fôlego aqui.
export const maxDuration = 120;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const expected = process.env.AUTH_SECRET;

  if (!expected) {
    return NextResponse.json({ error: "AUTH_SECRET não configurado no servidor." }, { status: 500 });
  }
  if (!key || key !== expected) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const summary = await seedDatabase(prisma);
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
