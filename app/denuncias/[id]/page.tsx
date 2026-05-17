import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin, Route, UserPlus } from "lucide-react";
import { Badge } from "@/components/Badge";
import { SectionHeader } from "@/components/SectionHeader";
import { incidents } from "@/data/incidents";

export function generateStaticParams() {
  return incidents.map((incident) => ({ id: incident.id }));
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = incidents.find((item) => item.id === id);

  if (!incident) {
    notFound();
  }

  return (
    <div>
      <SectionHeader
        title={`Detalle ${incident.id}`}
        description="Ficha operativa del caso con trazabilidad, ubicación y datos del reportante."
        action={
          <Link href="/denuncias" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex flex-wrap items-center gap-2">
            <Badge kind="neutral" value={incident.tipo} />
            <Badge kind="status" value={incident.estado} />
            <Badge kind="priority" value={incident.prioridad} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-950">{incident.categoria}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{incident.descripcion}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Info label="Dirección" value={incident.direccion} />
            <Info label="Sector" value={incident.sector} />
            <Info label="Fecha y hora" value={`${incident.fecha} ${incident.hora}`} />
            <Info label="Funcionario asignado" value={incident.funcionarioAsignado ?? "Sin asignar"} />
            <Info label="Reportante" value={incident.reportante.nombre} />
            <Info label="Teléfono" value={incident.reportante.telefono} />
            <Info label="Coordenadas" value={`${incident.ubicacion.lat}, ${incident.ubicacion.lng}`} />
            <Info label="Evidencia" value={incident.evidencia.length ? `${incident.evidencia.length} archivo(s) mock` : "Sin archivos"} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-municipal-700 px-4 text-sm font-semibold text-white hover:bg-municipal-600">
              <UserPlus className="h-4 w-4" aria-hidden />
              Asignar funcionario
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Route className="h-4 w-4" aria-hidden />
              Cambiar estado
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-600">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Cerrar caso
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <h3 className="text-base font-semibold text-slate-950">Ubicación</h3>
            <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-municipal-50 text-municipal-700">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8" aria-hidden />
                <p className="mt-2 text-sm font-semibold">{incident.sector}</p>
                <p className="text-xs text-slate-500">{incident.direccion}</p>
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <h3 className="text-base font-semibold text-slate-950">Historial de acciones</h3>
            <div className="mt-4 space-y-4">
              {incident.historial.map((entry) => (
                <div key={`${entry.fecha}-${entry.accion}`} className="border-l-2 border-municipal-500 pl-4">
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
