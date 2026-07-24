"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

async function requireUserId() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado");
  return session.user.id;
}

async function updateStreakAndXp(userId: string, isCorrect: boolean) {
  const streak = await prisma.userStreak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  let currentStreak = streak.currentStreak;
  if (!last || last.getTime() !== today.getTime()) {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const isConsecutiveDay = last ? today.getTime() - last.getTime() === oneDayMs : false;
    currentStreak = isConsecutiveDay ? currentStreak + 1 : 1;
  }

  const xpGain = isCorrect ? 10 : 2;
  const newXp = streak.xp + xpGain;
  const newLevel = Math.floor(newXp / 500) + 1;

  await prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak,
      longestStreak: Math.max(streak.longestStreak, currentStreak),
      lastStudyDate: new Date(),
      xp: newXp,
      level: newLevel,
    },
  });
}

/** Regra simples de repetição espaçada: define quando a questão volta a aparecer. */
function reviewPlan(isCorrect: boolean, timeSpentSeconds: number) {
  if (!isCorrect) return { days: 1, stage: "LEARNING" as const };
  if (timeSpentSeconds > 45) return { days: 3, stage: "REVIEW" as const };
  if (timeSpentSeconds > 15) return { days: 7, stage: "REVIEW" as const };
  return { days: 21, stage: "MASTERED" as const };
}

export async function submitAnswer(input: {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}) {
  const userId = await requireUserId();

  await prisma.userAnswer.create({
    data: {
      userId,
      questionId: input.questionId,
      selectedOptionId: input.selectedOptionId,
      isCorrect: input.isCorrect,
      timeSpentSeconds: input.timeSpentSeconds,
    },
  });

  const existing = await prisma.userQuestionProgress.findUnique({
    where: { userId_questionId: { userId, questionId: input.questionId } },
  });

  const timesAnswered = (existing?.timesAnswered ?? 0) + 1;
  const timesCorrect = (existing?.timesCorrect ?? 0) + (input.isCorrect ? 1 : 0);
  const { days, stage } = reviewPlan(input.isCorrect, input.timeSpentSeconds);
  const nextReviewAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.userQuestionProgress.upsert({
    where: { userId_questionId: { userId, questionId: input.questionId } },
    update: {
      timesAnswered,
      timesCorrect,
      lastAnsweredAt: new Date(),
      nextReviewAt,
      stage,
      easeIntervalDays: days,
    },
    create: {
      userId,
      questionId: input.questionId,
      timesAnswered,
      timesCorrect,
      lastAnsweredAt: new Date(),
      nextReviewAt,
      stage,
      easeIntervalDays: days,
    },
  });

  await updateStreakAndXp(userId, input.isCorrect);
  revalidatePath("/");
  revalidatePath("/desempenho");
  revalidatePath("/revisar");
}

export async function toggleSaveQuestion(questionId: string) {
  const userId = await requireUserId();

  const existing = await prisma.savedQuestion.findUnique({
    where: { userId_questionId: { userId, questionId } },
  });

  if (existing) {
    await prisma.savedQuestion.delete({ where: { id: existing.id } });
    revalidatePath("/revisar");
    return { saved: false };
  }

  await prisma.savedQuestion.create({ data: { userId, questionId } });
  revalidatePath("/revisar");
  return { saved: true };
}
