"use client";

import { useMemo, useState } from "react";
import { Camera, MapPin, Save } from "lucide-react";
import { communalSectors, crimeCategories, incidentPriorities, incivilityCategories } from "@/data/catalogs";
import type { IncidentType } from "@/types";

export function IncidentForm() {
  const [type, setType] = useState<IncidentType>("Delito");
  const categories = useMemo(() => (type === "Delito" ? crimeCategories : incivilityCategories), [type]);

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-panel lg:grid-cols-2">
      <Field label="Tipo">
        <select value={type} onChange={(event) => setType(event.target.value as IncidentType)} className="input">
          <option>Delito</option>
          <option>Incivilidad</option>
        </select>
      </Field>
      <Field label="Categoría">
        <select className="input">
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </Field>
      <Field label="Dirección o referencia">
        <input className="input" placeholder="Ej: Av. Principal 123" />
      </Field>
      <Field label="Sector">
        <select className="input">
          {communalSectors.map((sector) => (
            <option key={sector}>{sector}</option>
          ))}
        </select>
      </Field>
      <Field label="Fecha">
        <input type="date" className="input" defaultValue="2026-05-17" />
      </Field>
      <Field label="Hora">
        <input type="time" className="input" defaultValue="14:30" />
      </Field>
      <Field label="Prioridad">
        <select className="input">
          {incidentPriorities.map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>
      </Field>
      <Field label="Ubicación mock">
        <div className="flex gap-2">
          <input className="input" defaultValue="-33.456, -71.666" />
          <button type="button" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-municipal-700">
            <MapPin className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </Field>
      <Field label="Nombre del reportante">
        <input className="input" placeholder="Nombre completo" />
      </Field>
      <Field label="Teléfono">
        <input className="input" placeholder="+56912345678" />
      </Field>
      <Field label="Descripción" wide>
        <textarea className="input min-h-32 resize-y py-3" placeholder="Describe los hechos reportados, personas involucradas y antecedentes útiles." />
      </Field>
      <Field label="Evidencia fotográfica mock" wide>
        <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
          <div>
            <Camera className="mx-auto h-7 w-7 text-slate-400" aria-hidden />
            <p className="mt-2 text-sm font-medium text-slate-700">Adjuntar evidencia</p>
            <p className="text-xs text-slate-500">Campo visual preparado para integración posterior.</p>
          </div>
        </div>
      </Field>
      <div className="flex justify-end lg:col-span-2">
        <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg bg-municipal-700 px-5 text-sm font-semibold text-white hover:bg-municipal-600">
          <Save className="h-4 w-4" aria-hidden />
          Guardar denuncia
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={wide ? "lg:col-span-2" : ""}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
