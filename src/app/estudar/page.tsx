import { getActiveEdition, getSubjectsWithTopics } from "@/lib/queries";
import EstudarClient from "./EstudarClient";
import EditalPendente from "@/components/EditalPendente";

export default async function EstudarPage() {
  const edition = await getActiveEdition();
  if (!edition) return <EditalPendente />;

  const subjects = await getSubjectsWithTopics(edition.id);
  return <EstudarClient subjects={subjects} />;
}
