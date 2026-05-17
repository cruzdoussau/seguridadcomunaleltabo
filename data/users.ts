import type { MunicipalUser } from "@/types";

export const users: MunicipalUser[] = [
  { id: "USR-001", nombre: "Camila Rojas", correo: "camila.rojas@municipio.cl", rol: "Administrador", activo: true },
  { id: "USR-002", nombre: "Felipe Vargas", correo: "felipe.vargas@municipio.cl", rol: "Central de Seguridad", activo: true },
  { id: "USR-003", nombre: "Andrea Ruiz", correo: "andrea.ruiz@municipio.cl", rol: "Inspector Municipal", activo: true },
  { id: "USR-004", nombre: "Patrulla Norte", correo: "patrulla.norte@municipio.cl", rol: "Personal en Terreno", activo: true },
  { id: "USR-005", nombre: "Observatorio Comunal", correo: "observatorio@municipio.cl", rol: "Visualizador", activo: false }
];
