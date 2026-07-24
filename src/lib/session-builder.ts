// ==========================================================================
// Motor de estudos (Etapa 2) — monta sessões de questões a partir do banco
// de dados real, usando o histórico de respostas de cada usuária.
//
// Substitui, para o app autenticado, as funções equivalentes em
// study-engine.ts (que continuam existindo e sendo usadas apenas como
// referência de regras / eventual reaproveitamento em testes).
// ==========================================================================

import {
  getAllApprovedQuestions,
  getWeakTopics,
  getWrongQuestionIds,
  getQuestionsByIds,
  getQuestionsByTopic,
  getQuestionsBySubject,
} from "@/lib/queries";
import type { StudyMode } from "@/lib/types";

type DbQuestion = Awaited<ReturnType<typeof getAllApprovedQuestions>>[number];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function byDifficultyOrder(qs: DbQuestion[]): DbQuestion[] {
  const order = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;
  return [...qs].sort((a, b) => order[a.difficulty as keyof typeof order] - order[b.difficulty as keyof typeof order]);
}

async function buildQuickStudySession(userId: string, examEditionId: string, count = 10) {
  const [all, weakTopics, wrongIds] = await Promise.all([
    getAllApprovedQuestions(examEditionId),
    getWeakTopics(userId),
    getWrongQuestionIds(userId),
  ]);

  const weakTopicIds = new Set(weakTopics.map((t) => t.topicId));
  const weakQuestions = all.filter((q) => weakTopicIds.has(q.topicId));
  const reviewQuestions = all.filter((q) => wrongIds.includes(q.id));
  const rest = all.filter((q) => !weakTopicIds.has(q.topicId) && !wrongIds.includes(q.id));

  const selected: DbQuestion[] = [];
  const seen = new Set<string>();
  const push = (q: DbQuestion) => {
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

async function buildFreeStudySession(params: {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  count?: number;
}) {
  const { subjectId, topicId, difficulty, count = 10 } = params;
  let pool: DbQuestion[];
  if (topicId) pool = await getQuestionsByTopic(topicId);
  else if (subjectId) pool = await getQuestionsBySubject(subjectId, difficulty);
  else pool = [];
  return shuffle(pool).slice(0, count);
}

async function buildErrorReviewSession(userId: string, count = 10) {
  const wrongIds = await getWrongQuestionIds(userId, count * 2);
  const pool = await getQuestionsByIds(wrongIds);
  return shuffle(pool).slice(0, count);
}

async function buildHardQuestionsSession(userId: string, examEditionId: string, count = 10) {
  const [all, weakTopics] = await Promise.all([
    getAllApprovedQuestions(examEditionId),
    getWeakTopics(userId),
  ]);
  const weakTopicIds = new Set(weakTopics.map((t) => t.topicId));
  const pool = all.filter((q) => weakTopicIds.has(q.topicId) || q.difficulty === "HARD");
  return shuffle(pool).slice(0, count);
}

async function buildSmartReviewSession(userId: string, examEditionId: string, count = 10) {
  const [all, weakTopics] = await Promise.all([
    getAllApprovedQuestions(examEditionId),
    getWeakTopics(userId, 6),
  ]);
  const orderedTopicIds = [...weakTopics].sort((a, b) => a.accuracy - b.accuracy).map((t) => t.topicId);
  const selected: DbQuestion[] = [];
  for (const topicId of orderedTopicIds) {
    selected.push(...all.filter((q) => q.topicId === topicId));
    if (selected.length >= count) break;
  }
  return selected.slice(0, count);
}

async function buildVunespTrainingSession(examEditionId: string, count = 10) {
  const all = await getAllApprovedQuestions(examEditionId);
  const oficiais = all.filter((q) => q.origin === "OFICIAL");
  const ineditas = all.filter((q) => q.origin !== "OFICIAL");
  return [...oficiais, ...shuffle(ineditas)].slice(0, count);
}

async function buildDailyChallengeSession(examEditionId: string, count = 5) {
  const all = await getAllApprovedQuestions(examEditionId);
  if (all.length === 0) return [];
  const seedDay = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (const c of seedDay) hash = (hash * 31 + c.charCodeAt(0)) % 997;
  const startIndex = hash % all.length;
  const rotated = [...all.slice(startIndex), ...all.slice(0, startIndex)];
  return rotated.slice(0, count);
}

async function buildTopicTrainingSession(topicId: string, count = 10) {
  const pool = await getQuestionsByTopic(topicId);
  return shuffle(pool).slice(0, count);
}

async function buildSimuladoSession(examEditionId: string, count = 20) {
  const all = await getAllApprovedQuestions(examEditionId);
  return shuffle(all).slice(0, count);
}

export async function buildSessionForMode(
  mode: StudyMode,
  userId: string,
  examEditionId: string,
  params: { subjectId?: string; topicId?: string; difficulty?: string; count?: number } = {}
): Promise<DbQuestion[]> {
  switch (mode) {
    case "QUICK_STUDY":
      return buildQuickStudySession(userId, examEditionId, params.count ?? 10);
    case "FREE":
      return buildFreeStudySession(params);
    case "ERROR_REVIEW":
      return buildErrorReviewSession(userId, params.count ?? 10);
    case "HARD_QUESTIONS":
      return buildHardQuestionsSession(userId, examEditionId, params.count ?? 10);
    case "SMART_REVIEW":
      return buildSmartReviewSession(userId, examEditionId, params.count ?? 10);
    case "VUNESP_TRAINING":
      return buildVunespTrainingSession(examEditionId, params.count ?? 10);
    case "DAILY_CHALLENGE":
      return buildDailyChallengeSession(examEditionId, params.count ?? 5);
    case "TOPIC_TRAINING":
      return params.topicId ? buildTopicTrainingSession(params.topicId, params.count ?? 10) : [];
    case "SIMULADO":
      return buildSimuladoSession(examEditionId, params.count ?? 20);
    default:
      return [];
  }
}
