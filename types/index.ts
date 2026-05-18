export type IncidentType = "Delito" | "Incivilidad";
export type IncidentStatus = "Pendiente" | "En proceso" | "Derivado" | "Cerrado" | "Rechazado";
export type IncidentPriority = "Baja" | "Media" | "Alta" | "Crítica";

export type Reporter = {
  nombre: string;
  telefono: string;
};

export type LocationPoint = {
  lat: number;
  lng: number;
};

export type IncidentAction = {
  fecha: string;
  autor: string;
  accion: string;
  detalle: string;
};

export type Incident = {
  id: string;
  tipo: IncidentType;
  categoria: string;
  descripcion: string;
  direccion: string;
  sector: string;
  fecha: string;
  hora: string;
  origen?: string;
  estado: IncidentStatus;
  prioridad: IncidentPriority;
  reportante: Reporter;
  ubicacion: LocationPoint;
  evidencia: string[];
  funcionarioAsignado: string | null;
  historial: IncidentAction[];
};

export type UserRole =
  | "Administrador"
  | "Central de Seguridad"
  | "Personal en Terreno"
  | "Inspector Municipal"
  | "Visualizador";

export type MunicipalUser = {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  activo: boolean;
};
