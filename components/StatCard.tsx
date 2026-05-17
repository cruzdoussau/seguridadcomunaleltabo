import type { LucideIcon } from "lucide-react";

export function StatCard({ title, value, detail, icon: Icon }: { title: string; value: string | number; detail: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{detail}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-municipal-50 text-municipal-700">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </article>
  );
}
