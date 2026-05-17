import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, Map, ShieldAlert } from "lucide-react";
import { DashboardChart } from "@/components/DashboardChart";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { incidents } from "@/data/incidents";
import { categoryChartData, topCategories } from "@/lib/stats";

export default function DashboardPage() {
  const pending = incidents.filter((incident) => incident.estado === "Pendiente").length;
  const inProgress = incidents.filter((incident) => incident.estado === "En proceso").length;
  const closed = incidents.filter((incident) => incident.estado === "Cerrado").length;
  const latest = incidents.slice(0, 5);

  return (
    <div>
      <SectionHeader
        title="Dashboard principal"
        description="Vista ejecutiva para seguimiento diario de denuncias, delitos e incivilidades comunales."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total de incidentes" value={incidents.length} detail="Registros mock disponibles" icon={ShieldAlert} />
        <StatCard title="Casos pendientes" value={pending} detail="Requieren primera gestión" icon={AlertTriangle} />
        <StatCard title="En proceso" value={inProgress} detail="Asignados o en coordinación" icon={Clock3} />
        <StatCard title="Cerrados" value={closed} detail="Finalizados por el municipio" icon={CheckCircle2} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <DashboardChart data={categoryChartData(incidents)} />
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="text-base font-semibold text-slate-950">Frecuencia por catálogo</h3>
          <div className="mt-5 space-y-5">
            <CategoryList title="Delitos más frecuentes" data={topCategories(incidents, "Delito")} />
            <CategoryList title="Incivilidades más frecuentes" data={topCategories(incidents, "Incivilidad")} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-lg border border-slate-200 bg-white shadow-panel">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-base font-semibold text-slate-950">Últimos reportes ingresados</h3>
            <p className="text-sm text-slate-500">Actividad reciente de la central municipal.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {latest.map((incident) => (
              <article key={incident.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-bold text-municipal-700">{incident.id}</p>
                  <h4 className="mt-1 font-semibold text-slate-950">{incident.categoria}</h4>
                  <p className="mt-1 text-sm text-slate-500">{incident.sector} · {incident.fecha} {incident.hora}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge kind="status" value={incident.estado} />
                  <Badge kind="priority" value={incident.prioridad} />
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex h-full min-h-80 flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-municipal-50 text-municipal-700">
                <Map className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-950">Mapa operativo</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Vista georreferenciada de El Tabo con pines, calor por sector, filtros por tipo y navegación de mapa.
              </p>
            </div>
            <Link
              href="/mapa"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-municipal-700 px-4 text-sm font-semibold text-white hover:bg-municipal-600"
            >
              Abrir mapa operativo
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryList({ title, data }: { title: string; data: Array<{ name: string; value: number }> }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">{title}</p>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-slate-600">{item.name}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-municipal-600" style={{ width: `${Math.max(22, item.value * 34)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
