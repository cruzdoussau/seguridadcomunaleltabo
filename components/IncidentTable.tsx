"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { incidentPriorities, incidentStatuses } from "@/data/catalogs";
import { applyIncidentUpdate, incidentUpdatesEvent, readIncidentUpdates, type IncidentUpdate } from "@/lib/incidentUpdates";
import { readStoredIncidents, storedIncidentsEvent } from "@/lib/incidentsStorage";
import type { Incident, IncidentPriority, IncidentStatus, IncidentType } from "@/types";
import { Badge } from "@/components/Badge";

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  const [updates, setUpdates] = useState<Record<string, IncidentUpdate>>({});
  const [createdIncidents, setCreatedIncidents] = useState<Incident[]>([]);
  const [type, setType] = useState<"Todos" | IncidentType>("Todos");
  const [status, setStatus] = useState<"Todos" | IncidentStatus>("Todos");
  const [priority, setPriority] = useState<"Todos" | IncidentPriority>("Todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const syncUpdates = () => {
      setUpdates(readIncidentUpdates());
      setCreatedIncidents(readStoredIncidents());
    };

    syncUpdates();
    window.addEventListener(incidentUpdatesEvent, syncUpdates);
    window.addEventListener(storedIncidentsEvent, syncUpdates);
    window.addEventListener("storage", syncUpdates);

    return () => {
      window.removeEventListener(incidentUpdatesEvent, syncUpdates);
      window.removeEventListener(storedIncidentsEvent, syncUpdates);
      window.removeEventListener("storage", syncUpdates);
    };
  }, []);

  const displayIncidents = useMemo(
    () => [...createdIncidents, ...incidents].map((incident) => applyIncidentUpdate(incident, updates[incident.id])),
    [createdIncidents, incidents, updates]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return displayIncidents.filter((incident) => {
      const matchesQuery =
        !normalized ||
        [incident.sector, incident.descripcion, incident.categoria, incident.direccion].some((value) =>
          value.toLowerCase().includes(normalized)
        );

      return (
        (type === "Todos" || incident.tipo === type) &&
        (status === "Todos" || incident.estado === status) &&
        (priority === "Todos" || incident.prioridad === priority) &&
        matchesQuery
      );
    });
  }, [displayIncidents, priority, query, status, type]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 p-4">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(3,180px)_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por sector, descripción o categoría"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-municipal-500 focus:ring-2 focus:ring-municipal-100"
            />
          </label>
          <select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm">
            <option>Todos</option>
            <option>Delito</option>
            <option>Incivilidad</option>
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm">
            <option>Todos</option>
            {incidentStatuses.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm">
            <option>Todos</option>
            {incidentPriorities.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <Link
            href="/denuncias/nueva"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-municipal-700 px-4 text-sm font-semibold text-white hover:bg-municipal-600"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nueva denuncia
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tipo y categoría</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filtered.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-municipal-700">
                  <Link href={`/denuncias/${incident.id}`}>{incident.id}</Link>
                </td>
                <td className="min-w-72 px-4 py-4">
                  <p className="font-semibold text-slate-950">{incident.categoria}</p>
                  <p className="mt-1 text-xs text-slate-500">{incident.tipo}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700">{incident.sector}</td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700">{incident.fecha} {incident.hora}</td>
                <td className="whitespace-nowrap px-4 py-4"><Badge kind="status" value={incident.estado} /></td>
                <td className="whitespace-nowrap px-4 py-4"><Badge kind="priority" value={incident.prioridad} /></td>
                <td className="whitespace-nowrap px-4 py-4">
                  <Link
                    href={`/denuncias/${incident.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-municipal-700 hover:bg-municipal-50"
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
