import { DatabaseZap } from "lucide-react";

export default function EditalPendente() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary-dark)]">
        <DatabaseZap size={22} />
      </div>
      <p className="font-semibold">O banco de dados ainda não tem questões cadastradas</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--muted)]">
        Rode <code className="rounded bg-[var(--background)] px-1.5 py-0.5">npm run db:migrate</code> e{" "}
        <code className="rounded bg-[var(--background)] px-1.5 py-0.5">npm run db:seed</code> para
        criar as tabelas e popular o edital e as questões de exemplo.
      </p>
    </div>
  );
}
