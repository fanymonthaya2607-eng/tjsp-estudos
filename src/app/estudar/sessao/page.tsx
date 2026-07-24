import { auth } from "@/lib/auth";
import { getActiveEdition, getSavedQuestionIds } from "@/lib/queries";
import { buildSessionForMode } from "@/lib/session-builder";
import type { StudyMode } from "@/lib/types";
import SessaoClient from "./SessaoClient";
import EditalPendente from "@/components/EditalPendente";

export default async function SessaoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) return null;

  const edition = await getActiveEdition();
  if (!edition) return <EditalPendente />;

  const mode = (params.mode as StudyMode) || "QUICK_STUDY";
  const subjectId = typeof params.subjectId === "string" ? params.subjectId : undefined;
  const topicId = typeof params.topicId === "string" ? params.topicId : undefined;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const count = params.count ? Number(params.count) : undefined;

  const [questions, savedIds] = await Promise.all([
    buildSessionForMode(mode, session.user.id, edition.id, { subjectId, topicId, difficulty, count }),
    getSavedQuestionIds(session.user.id),
  ]);

  return (
    <SessaoClient
      mode={mode}
      questions={questions}
      savedQuestionIds={Array.from(savedIds)}
    />
  );
}
