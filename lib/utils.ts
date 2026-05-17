import type { IncidentPriority, IncidentStatus } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function statusClass(status: IncidentStatus) {
  const styles: Record<IncidentStatus, string> = {
    Pendiente: "bg-amber-50 text-amber-800 ring-amber-200",
    "En proceso": "bg-blue-50 text-blue-800 ring-blue-200",
    Derivado: "bg-violet-50 text-violet-800 ring-violet-200",
    Cerrado: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    Rechazado: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return styles[status];
}

export function priorityClass(priority: IncidentPriority) {
  const styles: Record<IncidentPriority, string> = {
    Baja: "bg-slate-50 text-slate-700 ring-slate-200",
    Media: "bg-sky-50 text-sky-800 ring-sky-200",
    Alta: "bg-orange-50 text-orange-800 ring-orange-200",
    Crítica: "bg-red-50 text-red-800 ring-red-200"
  };

  return styles[priority];
}
