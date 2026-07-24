import type { getAllApprovedQuestions } from "@/lib/queries";

/** Formato de uma questão vinda do banco (com alternativas e assunto), usado pela UI. */
export type SessionQuestion = Awaited<ReturnType<typeof getAllApprovedQuestions>>[number];
