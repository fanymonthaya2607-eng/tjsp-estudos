// ==========================================================================
// Rota administrativa somente leitura para checar rapidamente o estado do
// banco (contagens), sem disparar nenhuma escrita — útil para acompanhar
// o progresso de um seed grande sem correr risco de timeout.
// Protegida por AUTH_SECRET via query param `?key=`.
// ==========================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const [subjects, topics, questions, byOrigin] = await Promise.all([
      prisma.subject.count(),
      prisma.topic.count(),
      prisma.question.count(),
      prisma.question.groupBy({ by: ["origin"], _count: true }),
    ]);
    return NextResponse.json({ ok: true, subjects, topics, questions, byOrigin });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
