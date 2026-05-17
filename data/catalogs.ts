import type { IncidentPriority, IncidentStatus } from "@/types";

export const crimeCategories = [
  "Robo con violencia o intimidación",
  "Robo por sorpresa",
  "Robo de vehículo motorizado",
  "Robo de objeto de o desde vehículo",
  "Robo en lugar habitado",
  "Robo en lugar no habitado",
  "Otros robos con fuerza",
  "Hurtos",
  "Lesiones menos graves, graves o gravísimas",
  "Lesiones leves",
  "Homicidios",
  "Violaciones",
  "Violencia intrafamiliar",
  "Amenazas",
  "Daños",
  "Infracción a la ley de drogas",
  "Infracción a la ley de armas",
  "Abusos sexuales y otros delitos sexuales",
  "Abigeato",
  "Receptación",
  "Hallazgo de cuerpo y otras muertes"
];

export const incivilityCategories = [
  "Comercio ambulante o clandestino",
  "Ebriedad y consumo de alcohol en la vía pública",
  "Desórdenes",
  "Riñas",
  "Ruidos molestos",
  "Consumo de drogas en la vía pública",
  "Rayados o grafitis no autorizados",
  "Basura o microbasurales en espacios públicos",
  "Orinar en la vía pública",
  "Mal uso de espacios públicos",
  "Ocupación indebida de espacios comunes",
  "Conductas disruptivas sin violencia",
  "Tenencia irresponsable de mascotas"
];

export const incidentStatuses: IncidentStatus[] = [
  "Pendiente",
  "En proceso",
  "Derivado",
  "Cerrado",
  "Rechazado"
];

export const incidentPriorities: IncidentPriority[] = ["Baja", "Media", "Alta", "Crítica"];

export const communalSectors = [
  "El Tabo Centro",
  "Las Cruces",
  "San Carlos",
  "Playas Blancas",
  "El Triángulo",
  "Quillaycillo",
  "Litoral Alto"
];

export const emergencyContacts = [
  { nombre: "Central Municipal de Seguridad", telefono: "1452", horario: "24/7" },
  { nombre: "Carabineros", telefono: "133", horario: "24/7" },
  { nombre: "Bomberos", telefono: "132", horario: "24/7" },
  { nombre: "SAMU", telefono: "131", horario: "24/7" }
];
