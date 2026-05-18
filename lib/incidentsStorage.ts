import type { Incident } from "@/types";

export const storedIncidentsKey = "seguridad-comunal-created-incidents";
export const storedIncidentsEvent = "stored-incidents-changed";

export function readStoredIncidents(): Incident[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storedIncidentsKey);
    return raw ? (JSON.parse(raw) as Incident[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredIncidents(incidents: Incident[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(storedIncidentsKey, JSON.stringify(incidents));
  window.dispatchEvent(new Event(storedIncidentsEvent));
}

export function addStoredIncident(incident: Incident) {
  const current = readStoredIncidents();
  writeStoredIncidents([incident, ...current.filter((item) => item.id !== incident.id)]);
}

export function findStoredIncident(id: string) {
  return readStoredIncidents().find((incident) => incident.id === id) ?? null;
}

export function nextIncidentId(baseIds: string[]) {
  const storedIds = readStoredIncidents().map((incident) => incident.id);
  const nextNumber =
    [...baseIds, ...storedIds]
      .map((id) => Number(id.replace("INC-", "")))
      .filter((value) => Number.isFinite(value))
      .reduce((max, value) => Math.max(max, value), 0) + 1;

  return `INC-${String(nextNumber).padStart(3, "0")}`;
}
