import { IncidentForm } from "@/components/IncidentForm";
import { SectionHeader } from "@/components/SectionHeader";

export default function NuevaDenunciaPage() {
  return (
    <div>
      <SectionHeader
        title="Nueva denuncia"
        description="Formulario administrativo preparado para conectarse luego con backend, evidencia real y georreferenciación."
      />
      <IncidentForm />
    </div>
  );
}
