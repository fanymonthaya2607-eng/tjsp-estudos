import type { SubjectPerformance } from "@/lib/types";

export default function SubjectBar({ item }: { item: SubjectPerformance }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{item.subjectName}</span>
        <span className="text-[var(--muted)]">{item.accuracy}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${item.accuracy}%`, backgroundColor: item.color }}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">{item.answered} questões respondidas</p>
    </div>
  );
}
