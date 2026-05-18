import type { Incident, IncidentAction, IncidentStatus } from "@/types";

export type IncidentUpdate = {
  estado?: IncidentStatus;
  funcionarioAsignado?: string | null;
  historial?: IncidentAction[];
};

export const incidentUpdatesKey = "seguridad-comunal-incident-updates";
export const incidentUpdatesEvent = "incident-updates-changed";

export function readIncidentUpdates(): Record<string, IncidentUpdate> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(incidentUpdatesKey);
    return raw ? (JSON.parse(raw) as Record<string, IncidentUpdate>) : {};
  } catch {
    return {};
  }
}

export function writeIncidentUpdate(id: string, update: IncidentUpdate) {
  if (typeof window === "undefined") return;

  const current = readIncidentUpdates();
  current[id] = { ...current[id], ...update };
  window.localStorage.setItem(incidentUpdatesKey, JSON.stringify(current));
  window.dispatchEvent(new Event(incidentUpdatesEvent));
}

export function applyIncidentUpdate(incident: Incident, update?: IncidentUpdate): Incident {
  if (!update) return incident;

  return {
    ...incident,
    estado: update.estado ?? incident.estado,
    funcionarioAsignado:
      update.funcionarioAsignado === undefined ? incident.funcionarioAsignado : update.funcionarioAsignado,
    historial: update.historial ?? incident.historial
  };
}
