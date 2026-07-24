// ==========================================================================
// MOTOR DE ESTUDOS — regras para montar sessões de questões.
// ==========================================================================
// Nesta etapa 1 (mock), o motor opera sobre os dados de exemplo em
// mock-data.ts. Na próxima etapa (banco real), a mesma lógica de seleção
// será portada para consultas Prisma, mantendo as mesmas regras:
//
//  - Priorizar assuntos com pior desempenho (weakTopics)
//  - Misturar questões de revisão (erros antigos) com questões novas
//  - Variar a dificuldade progressivamente
// ==========================================================================

import {
  questions,
  weakTopics,
  wrongQuestionIds,
  topics,
} from "./mock-data";
import type { Question, StudyMode } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function byDifficultyOrder(qs: Question[]): Question[] {
  const order = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;
  return [...qs].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
}

/** Monta a sessão "Estudar agora": mistura de assuntos, foco em pontos fracos,
 * questões de revisão e questões novas, com dificuldade progressiva. */
export function buildQuickStudySession(count = 10): Question[] {
  const weakTopicIds = new Set(weakTopics.map((t) => t.topicId));
  const weakQuestions = questions.filter((q) => weakTopicIds.has(q.topicId));
  const reviewQuestions = questions.filter((q) => wrongQuestionIds.includes(q.id));
  const rest = questions.filter(
    (q) => !weakTopicIds.has(q.topicId) && !wrongQuestionIds.includes(q.id)
  );

  const selected: Question[] = [];
  const seen = new Set<string>();
  const push = (q: Question) => {
    if (!seen.has(q.id) && selected.length < count) {
      seen.add(q.id);
      selected.push(q);
    }
  };

  shuffle(reviewQuestions).slice(0, Math.ceil(count * 0.3)).forEach(push);
  shuffle(weakQuestions).slice(0, Math.ceil(count * 0.4)).forEach(push);
  shuffle(rest).forEach(push);

  return byDifficultyOrder(selected).slice(0, count);
}

export function buildFreeStudySession(params: {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  count?: number;
}): Question[] {
  const { subjectId, topicId, difficulty, count = 10 } = params;
  let pool = questions;
  if (topicId) pool = pool.filter((q) => q.topicId === topicId);
  else if (subjectId) pool = pool.filter((q) => q.subjectId === subjectId);
  if (difficulty && difficulty !== "ALL") {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  return shuffle(pool).slice(0, count);
}

export function buildErrorReviewSession(count = 10): Question[] {
  const pool = questions.filter((q) => wrongQuestionIds.includes(q.id));
  return shuffle(pool).slice(0, count);
}

export function buildHardQuestionsSession(count = 10): Question[] {
  const weakTopicIds = new Set(weakTopics.map((t) => t.topicId));
  const pool = questions.filter(
    (q) => weakTopicIds.has(q.topicId) || q.difficulty === "HARD"
  );
  return shuffle(pool).slice(0, count);
}

export function buildSmartReviewSession(count = 10): Question[] {
  // Assuntos com menor incidência de acerto recente entram primeiro
  const orderedTopicIds = [...weakTopics]
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((t) => t.topicId);
  const selected: Question[] = [];
  for (const topicId of orderedTopicIds) {
    const qs = questions.filter((q) => q.topicId === topicId);
    selected.push(...qs);
    if (selected.length >= count) break;
  }
  return selected.slice(0, count);
}

export function buildVunespTrainingSession(count = 10): Question[] {
  // Mistura questões oficiais disponíveis (quando houver) com inéditas no estilo da banca
  const oficiais = questions.filter((q) => q.origin === "OFICIAL");
  const ineditas = questions.filter((q) => q.origin !== "OFICIAL");
  const selected = [...oficiais, ...shuffle(ineditas)];
  return selected.slice(0, count);
}

export function buildDailyChallengeSession(count = 5): Question[] {
  // Determinística por dia, para todos verem o mesmo desafio no mesmo dia
  const seedDay = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (const c of seedDay) hash = (hash * 31 + c.charCodeAt(0)) % 997;
  const startIndex = hash % questions.length;
  const rotated = [
    ...questions.slice(startIndex),
    ...questions.slice(0, startIndex),
  ];
  return rotated.slice(0, count);
}

export function buildTopicTrainingSession(topicId: string, count = 10): Question[] {
  return shuffle(questions.filter((q) => q.topicId === topicId)).slice(0, count);
}

export function buildSessionForMode(
  mode: StudyMode,
  params: { subjectId?: string; topicId?: string; difficulty?: string; count?: number } = {}
): Question[] {
  switch (mode) {
    case "QUICK_STUDY":
      return buildQuickStudySession(params.count ?? 10);
    case "FREE":
      return buildFreeStudySession(params);
    case "ERROR_REVIEW":
      return buildErrorReviewSession(params.count ?? 10);
    case "HARD_QUESTIONS":
      return buildHardQuestionsSession(params.count ?? 10);
    case "SMART_REVIEW":
      return buildSmartReviewSession(params.count ?? 10);
    case "VUNESP_TRAINING":
      return buildVunespTrainingSession(params.count ?? 10);
    case "DAILY_CHALLENGE":
      return buildDailyChallengeSession(params.count ?? 5);
    case "TOPIC_TRAINING":
      return params.topicId ? buildTopicTrainingSession(params.topicId, params.count ?? 10) : [];
    case "SIMULADO":
      return shuffle(questions).slice(0, params.count ?? 20);
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Repetição espaçada — regra simples baseada no desempenho na questão.
// Usada futuramente para calcular `nextReviewAt` em UserQuestionProgress.
// ---------------------------------------------------------------------------
export function nextReviewInDays(result: "wrong" | "hard" | "normal" | "easy"): number {
  switch (result) {
    case "wrong":
      return 1;
    case "hard":
      return 3;
    case "normal":
      return 7;
    case "easy":
      return 21;
  }
}

export function topicName(topicId: string): string {
  return topics.find((t) => t.id === topicId)?.name ?? "Assunto";
}
