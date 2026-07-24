// ==========================================================================
// Rota administrativa ÚNICA para remover questões duplicadas (mesmo
// enunciado + mesmo assunto). Aconteceu de chamadas concorrentes ao seed
// criarem duplicatas em uma corrida — esta rota limpa isso com segurança:
// mantém a questão mais antiga de cada grupo duplicado e apaga o resto
// (as opções/respostas/progresso associados vão junto via cascade, mas
// não deve haver nenhum UserAnswer real ainda apontando pras duplicatas
// recém-criadas).
// Protegida por AUTH_SECRET via query param `?key=`.
// ==========================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

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
    const all = await prisma.question.findMany({
      select: { id: true, topicId: true, statement: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const seen = new Set<string>();
    const idsToDelete: string[] = [];
    for (const q of all) {
      const key = `${q.topicId}::${q.statement}`;
      if (seen.has(key)) {
        idsToDelete.push(q.id);
      } else {
        seen.add(key);
      }
    }

    if (idsToDelete.length > 0) {
      await prisma.question.deleteMany({ where: { id: { in: idsToDelete } } });
    }

    const remaining = await prisma.question.count();
    return NextResponse.json({ ok: true, deleted: idsToDelete.length, remaining });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
