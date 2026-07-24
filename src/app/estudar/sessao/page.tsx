import { Suspense } from "react";
import SessaoClient from "./SessaoClient";

export default function SessaoPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[var(--muted)]">Carregando questões...</div>}>
      <SessaoClient />
    </Suspense>
  );
}
