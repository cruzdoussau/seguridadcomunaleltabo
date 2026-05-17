import { SectionHeader } from "@/components/SectionHeader";
import { communalSectors, crimeCategories, emergencyContacts, incivilityCategories } from "@/data/catalogs";

export default function ConfiguracionPage() {
  return (
    <div>
      <SectionHeader
        title="Configuración"
        description="Catálogos y parámetros base que luego podrán administrarse desde backend."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Catalog title="Catálogo de delitos" items={crimeCategories} />
        <Catalog title="Catálogo de incivilidades" items={incivilityCategories} />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="text-base font-semibold text-slate-950">Contactos de emergencia</h3>
          <div className="mt-4 divide-y divide-slate-100">
            {emergencyContacts.map((contact) => (
              <div key={contact.nombre} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-slate-950">{contact.nombre}</p>
                  <p className="text-sm text-slate-500">{contact.horario}</p>
                </div>
                <p className="text-lg font-bold text-municipal-700">{contact.telefono}</p>
              </div>
            ))}
          </div>
        </section>
        <Catalog title="Sectores comunales" items={communalSectors} />
      </div>
    </div>
  );
}

function Catalog({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <div className="mt-4 grid gap-2">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-municipal-100 text-xs font-bold text-municipal-700">
              {index + 1}
            </span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
