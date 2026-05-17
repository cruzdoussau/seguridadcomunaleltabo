import { MapPlaceholder } from "@/components/MapPlaceholder";
import { SectionHeader } from "@/components/SectionHeader";

export default function MapaPage() {
  return (
    <div>
      <SectionHeader
        title="Mapa operativo"
        description="Visualización territorial de incidentes en El Tabo con base cartográfica real, calor mock por sector y filtros por tipo."
      />
      <MapPlaceholder className="min-h-[calc(100vh-10rem)]" />
    </div>
  );
}
