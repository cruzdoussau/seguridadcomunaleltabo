import { IncidentTable } from "@/components/IncidentTable";
import { SectionHeader } from "@/components/SectionHeader";
import { incidents } from "@/data/incidents";

export default function DenunciasPage() {
  return (
    <div>
      <SectionHeader
        title="Gestión de denuncias"
        description="Consulta, filtra y administra incidentes registrados por la central municipal, inspectores o canales ciudadanos."
      />
      <IncidentTable incidents={incidents} />
    </div>
  );
}
