import { Download, FileSpreadsheet } from "lucide-react";
import { DashboardChart } from "@/components/DashboardChart";
import { SectionHeader } from "@/components/SectionHeader";
import { incidents } from "@/data/incidents";
import { categoryChartData, countBy } from "@/lib/stats";

export default function ReportesPage() {
  const bySector = Object.entries(countBy(incidents, (incident) => incident.sector));
  const byStatus = Object.entries(countBy(incidents, (incident) => incident.estado));

  return (
    <div>
      <SectionHeader
        title="Reportes"
        description="Resumen estadístico para control interno, coordinación operativa y rendición municipal."
        action={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <FileSpreadsheet className="h-4 w-4" aria-hidden />
              Exportar Excel
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-municipal-700 px-3 text-sm font-semibold text-white hover:bg-municipal-600">
              <Download className="h-4 w-4" aria-hidden />
              Exportar PDF
            </button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <DashboardChart data={categoryChartData(incidents)} />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="text-base font-semibold text-slate-950">Resumen estadístico</h3>
          <div className="mt-5 grid gap-3">
            <Metric label="Total casos" value={incidents.length} />
            <Metric label="Delitos" value={incidents.filter((incident) => incident.tipo === "Delito").length} />
            <Metric label="Incivilidades" value={incidents.filter((incident) => incident.tipo === "Incivilidad").length} />
            <Metric label="Prioridad crítica" value={incidents.filter((incident) => incident.prioridad === "Crítica").length} />
          </div>
        </section>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Breakdown title="Casos por sector" rows={bySector} />
        <Breakdown title="Casos por estado" rows={byStatus} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-bold text-slate-950">{value}</span>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  const max = Math.max(...rows.map((row) => row[1]), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <div className="mt-5 space-y-4">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-600">{label}</span>
              <span className="font-semibold text-slate-950">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-municipal-600" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
