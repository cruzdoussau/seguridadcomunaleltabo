import { IncidentDetailClient } from "@/components/IncidentDetailClient";
import { incidents } from "@/data/incidents";
import { users } from "@/data/users";

export function generateStaticParams() {
  return incidents.map((incident) => ({ id: incident.id }));
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = incidents.find((item) => item.id === id) ?? null;

  return <IncidentDetailClient incident={incident} incidentId={id} users={users} />;
}
