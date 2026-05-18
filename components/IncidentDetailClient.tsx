"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin, Route, UserPlus } from "lucide-react";
import { Badge } from "@/components/Badge";
import { SectionHeader } from "@/components/SectionHeader";
import { incidentStatuses } from "@/data/catalogs";
import { applyIncidentUpdate, readIncidentUpdates, writeIncidentUpdate } from "@/lib/incidentUpdates";
import { findStoredIncident } from "@/lib/incidentsStorage";
import type { Incident, IncidentAction, IncidentStatus, MunicipalUser } from "@/types";

type Props = {
  incident: Incident | null;
  incidentId: string;
  users: MunicipalUser[];
};

export function IncidentDetailClient({ incident, incidentId, users }: Props) {
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(incident);
  const [status, setStatus] = useState<IncidentStatus>(incident?.estado ?? "Pendiente");
  const [assigned, setAssigned] = useState<string | null>(incident?.funcionarioAsignado ?? null);
  const [selectedUser, setSelectedUser] = useState("");
  const [history, setHistory] = useState<IncidentAction[]>(incident?.historial ?? []);

  const assignableUsers = useMemo(
    () => users.filter((user) => user.activo && user.rol !== "Visualizador"),
    [users]
  );

  useEffect(() => {
    const baseIncident = incident ?? findStoredIncident(incidentId);
    setCurrentIncident(baseIncident);
    if (!baseIncident) return;

    const updates = readIncidentUpdates();
    const merged = applyIncidentUpdate(baseIncident, updates[baseIncident.id]);
    setStatus(merged.estado);
    setAssigned(merged.funcionarioAsignado);
    setHistory(merged.historial);
  }, [incident, incidentId]);

  if (!currentIncident) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <h2 className="text-xl font-bold text-slate-950">Denuncia no encontrada</h2>
        <p className="mt-2 text-sm text-slate-600">No existe un caso mock o guardado localmente con el ID {incidentId}.</p>
        <Link href="/denuncias" className="mt-5 inline-flex h-10 items-center rounded-lg bg-municipal-700 px-4 text-sm font-semibold text-white">
          Volver a denuncias
        </Link>
      </div>
    );
  }

  const addHistory = (accion: string, detalle: string) => {
    const nextHistory = [
      {
        fecha: new Date().toLocaleString("es-CL", { hour12: false }),
        autor: "Sistema municipal",
        accion,
        detalle
      },
      ...history
    ];
    setHistory(nextHistory);
    return nextHistory;
  };

  const persist = (next: { estado?: IncidentStatus; funcionarioAsignado?: string | null; historial?: IncidentAction[] }) => {
    writeIncidentUpdate(currentIncident.id, next);
  };

  const assignOfficer = () => {
    if (!selectedUser) return;
    const user = assignableUsers.find((item) => item.id === selectedUser);
    if (!user) return;

    const nextHistory = addHistory("Asignación", `Caso asignado a ${user.nombre} (${user.rol}).`);
    setAssigned(user.nombre);
    persist({ funcionarioAsignado: user.nombre, historial: nextHistory });
  };

  const saveStatus = () => {
    const nextHistory = addHistory("Cambio de estado", `Estado actualizado a ${status}.`);
    persist({ estado: status, historial: nextHistory });
  };

  const closeCase = () => {
    const nextHistory = addHistory("Cierre", "Caso cerrado desde la ficha operativa.");
    setStatus("Cerrado");
    persist({ estado: "Cerrado", historial: nextHistory });
  };

  return (
    <div>
      <SectionHeader
        title={`Detalle ${currentIncident.id}`}
        description="Ficha operativa del caso con trazabilidad, ubicación y datos del reportante."
        action={
          <Link href="/denuncias" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex flex-wrap items-center gap-2">
            <Badge kind="neutral" value={currentIncident.tipo} />
            <Badge kind="status" value={status} />
            <Badge kind="priority" value={currentIncident.prioridad} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-950">{currentIncident.categoria}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{currentIncident.descripcion}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Info label="Dirección" value={currentIncident.direccion} />
            <Info label="Sector" value={currentIncident.sector} />
            <Info label="Fecha y hora" value={`${currentIncident.fecha} ${currentIncident.hora}`} />
            <Info label="Funcionario asignado" value={assigned ?? "Sin asignar"} />
            <Info label="Reportante" value={currentIncident.reportante.nombre} />
            <Info label="Teléfono" value={currentIncident.reportante.telefono} />
            <Info label="Coordenadas" value={`${currentIncident.ubicacion.lat}, ${currentIncident.ubicacion.lng}`} />
            <Info label="Evidencia" value={currentIncident.evidencia.length ? `${currentIncident.evidencia.length} archivo(s)` : "Sin archivos"} />
          </div>

          <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_auto]">
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Asignar funcionario</span>
              <select value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)} className="input">
                <option value="">Selecciona un usuario activo</option>
                {assignableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre} · {user.rol}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={assignOfficer}
              className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-lg bg-municipal-700 px-4 text-sm font-semibold text-white hover:bg-municipal-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedUser}
            >
              <UserPlus className="h-4 w-4" aria-hidden />
              Asignar
            </button>
          </div>

          <div className="mt-4 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_auto_auto]">
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Cambiar estado</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as IncidentStatus)} className="input">
                {incidentStatuses.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={saveStatus}
              className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Route className="h-4 w-4" aria-hidden />
              Guardar estado
            </button>
            <button
              type="button"
              onClick={closeCase}
              className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status === "Cerrado"}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Cerrar caso
            </button>
          </div>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-950">Evidencia fotográfica</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentIncident.evidencia.map((src, index) => (
                <figure key={`${src.slice(0, 32)}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <img src={src} alt={`Evidencia ${index + 1} del caso ${currentIncident.id}`} className="h-36 w-full object-cover" />
                  <figcaption className="px-3 py-2 text-xs font-semibold text-slate-600">Evidencia {index + 1}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <h3 className="text-base font-semibold text-slate-950">Ubicación</h3>
            <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-municipal-50 text-municipal-700">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8" aria-hidden />
                <p className="mt-2 text-sm font-semibold">{currentIncident.sector}</p>
                <p className="text-xs text-slate-500">{currentIncident.direccion}</p>
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <h3 className="text-base font-semibold text-slate-950">Historial de acciones</h3>
            <div className="mt-4 space-y-4">
              {history.map((entry) => (
                <div key={`${entry.fecha}-${entry.accion}-${entry.detalle}`} className="border-l-2 border-municipal-500 pl-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-municipal-700">{entry.accion}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{entry.autor}</p>
                  <p className="text-xs text-slate-500">{entry.fecha}</p>
                  <p className="mt-2 text-sm text-slate-600">{entry.detalle}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
