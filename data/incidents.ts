import type { Incident } from "@/types";

export const incidents: Incident[] = [
  {
    id: "INC-001",
    tipo: "Delito",
    categoria: "Robo en lugar no habitado",
    descripcion: "Vecino reporta ingreso forzado a inmueble durante la tarde.",
    direccion: "Av. Principal 123",
    sector: "El Tabo Centro",
    fecha: "2026-05-17",
    hora: "14:30",
    estado: "Pendiente",
    prioridad: "Alta",
    reportante: { nombre: "Juan Pérez", telefono: "+56912345678" },
    ubicacion: { lat: -33.4571, lng: -71.6676 },
    evidencia: [],
    funcionarioAsignado: null,
    historial: [
      {
        fecha: "2026-05-17 14:32",
        autor: "Central de Seguridad",
        accion: "Ingreso",
        detalle: "Denuncia creada desde atención telefónica."
      }
    ]
  },
  {
    id: "INC-002",
    tipo: "Incivilidad",
    categoria: "Ruidos molestos",
    descripcion: "Música a alto volumen y reunión masiva en vivienda particular.",
    direccion: "Pasaje Los Aromos 44",
    sector: "Las Cruces",
    fecha: "2026-05-17",
    hora: "01:15",
    estado: "En proceso",
    prioridad: "Media",
    reportante: { nombre: "María Contreras", telefono: "+56987654321" },
    ubicacion: { lat: -33.5037, lng: -71.6267 },
    evidencia: ["audio-referencia.mp3"],
    funcionarioAsignado: "Patrulla Norte",
    historial: [
      { fecha: "2026-05-17 01:16", autor: "App Ciudadana", accion: "Ingreso", detalle: "Reporte ciudadano recibido." },
      { fecha: "2026-05-17 01:20", autor: "Supervisor", accion: "Asignación", detalle: "Caso asignado a Patrulla Norte." }
    ]
  },
  {
    id: "INC-003",
    tipo: "Delito",
    categoria: "Robo de objeto de o desde vehículo",
    descripcion: "Sustracción de mochila desde vehículo estacionado frente a comercio.",
    direccion: "Costanera 901",
    sector: "Playas Blancas",
    fecha: "2026-05-16",
    hora: "19:45",
    estado: "Derivado",
    prioridad: "Alta",
    reportante: { nombre: "Roberto Díaz", telefono: "+56922224444" },
    ubicacion: { lat: -33.4726, lng: -71.6442 },
    evidencia: ["foto-vehiculo.jpg"],
    funcionarioAsignado: "Inspector Municipal A. Ruiz",
    historial: [
      { fecha: "2026-05-16 19:49", autor: "Central de Seguridad", accion: "Ingreso", detalle: "Se registra denuncia presencial." },
      { fecha: "2026-05-16 20:05", autor: "Central de Seguridad", accion: "Derivación", detalle: "Derivado a Carabineros por eventual delito." }
    ]
  },
  {
    id: "INC-004",
    tipo: "Incivilidad",
    categoria: "Basura o microbasurales en espacios públicos",
    descripcion: "Acopio irregular de residuos domiciliarios en plaza barrial.",
    direccion: "Plaza Los Maitenes",
    sector: "San Carlos",
    fecha: "2026-05-16",
    hora: "10:10",
    estado: "Cerrado",
    prioridad: "Baja",
    reportante: { nombre: "Ana Silva", telefono: "+56933335555" },
    ubicacion: { lat: -33.4918, lng: -71.6572 },
    evidencia: ["microbasural.jpg"],
    funcionarioAsignado: "Inspector Municipal C. Fuentes",
    historial: [
      { fecha: "2026-05-16 10:13", autor: "Central de Seguridad", accion: "Ingreso", detalle: "Se adjunta fotografía del punto." },
      { fecha: "2026-05-16 15:30", autor: "Inspector Municipal C. Fuentes", accion: "Cierre", detalle: "Aseo municipal retira residuos." }
    ]
  },
  {
    id: "INC-005",
    tipo: "Delito",
    categoria: "Violencia intrafamiliar",
    descripcion: "Llamado por discusión con riesgo para una persona adulta mayor.",
    direccion: "Los Pinos 775",
    sector: "El Triángulo",
    fecha: "2026-05-15",
    hora: "22:05",
    estado: "En proceso",
    prioridad: "Crítica",
    reportante: { nombre: "Reserva identidad", telefono: "+56900001111" },
    ubicacion: { lat: -33.4477, lng: -71.6816 },
    evidencia: [],
    funcionarioAsignado: "Coordinación Turno Noche",
    historial: [
      { fecha: "2026-05-15 22:06", autor: "Central de Seguridad", accion: "Ingreso", detalle: "Caso priorizado por riesgo a integridad física." },
      { fecha: "2026-05-15 22:09", autor: "Supervisor", accion: "Coordinación", detalle: "Se coordina apoyo con Carabineros." }
    ]
  },
  {
    id: "INC-006",
    tipo: "Incivilidad",
    categoria: "Comercio ambulante o clandestino",
    descripcion: "Instalación no autorizada de venta en acceso a playa.",
    direccion: "Acceso Playa Chépica",
    sector: "Las Cruces",
    fecha: "2026-05-15",
    hora: "12:20",
    estado: "Rechazado",
    prioridad: "Media",
    reportante: { nombre: "Patricia Araya", telefono: "+56944446666" },
    ubicacion: { lat: -33.5001, lng: -71.6304 },
    evidencia: [],
    funcionarioAsignado: null,
    historial: [
      { fecha: "2026-05-15 12:23", autor: "Central de Seguridad", accion: "Ingreso", detalle: "Reporte ingresado por formulario web." },
      { fecha: "2026-05-15 12:50", autor: "Inspector Municipal", accion: "Rechazo", detalle: "No se encontró actividad al verificar en terreno." }
    ]
  },
  {
    id: "INC-007",
    tipo: "Delito",
    categoria: "Amenazas",
    descripcion: "Amenazas verbales reiteradas entre vecinos del sector.",
    direccion: "Camino Interior 310",
    sector: "Quillaycillo",
    fecha: "2026-05-14",
    hora: "18:00",
    estado: "Pendiente",
    prioridad: "Media",
    reportante: { nombre: "Carlos Medina", telefono: "+56955557777" },
    ubicacion: { lat: -33.4324, lng: -71.6899 },
    evidencia: ["captura-chat.png"],
    funcionarioAsignado: null,
    historial: [
      { fecha: "2026-05-14 18:04", autor: "Central de Seguridad", accion: "Ingreso", detalle: "Se recibe relato y capturas de conversación." }
    ]
  },
  {
    id: "INC-008",
    tipo: "Incivilidad",
    categoria: "Rayados o grafitis no autorizados",
    descripcion: "Rayados recientes en muro de edificio municipal.",
    direccion: "Edificio Consistorial",
    sector: "El Tabo Centro",
    fecha: "2026-05-14",
    hora: "08:40",
    estado: "Cerrado",
    prioridad: "Baja",
    reportante: { nombre: "Guardia Municipal", telefono: "+56966668888" },
    ubicacion: { lat: -33.4562, lng: -71.6684 },
    evidencia: ["rayado-municipal.jpg"],
    funcionarioAsignado: "Mantención Municipal",
    historial: [
      { fecha: "2026-05-14 08:45", autor: "Guardia Municipal", accion: "Ingreso", detalle: "Se deja registro fotográfico." },
      { fecha: "2026-05-14 16:00", autor: "Mantención Municipal", accion: "Cierre", detalle: "Muro limpiado por equipo municipal." }
    ]
  }
];
