import type { IncidentPriority, IncidentStatus } from "@/types";
import { cn, priorityClass, statusClass } from "@/lib/utils";

type Props =
  | { kind: "status"; value: IncidentStatus }
  | { kind: "priority"; value: IncidentPriority }
  | { kind: "neutral"; value: string };

export function Badge(props: Props) {
  const className =
    props.kind === "status"
      ? statusClass(props.value)
      : props.kind === "priority"
        ? priorityClass(props.value)
        : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", className)}>
      {props.value}
    </span>
  );
}
