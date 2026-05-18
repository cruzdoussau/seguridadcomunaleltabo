"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Save } from "lucide-react";
import { communalSectors, crimeCategories, incidentPriorities, incivilityCategories } from "@/data/catalogs";
import { incidents } from "@/data/incidents";
import { addStoredIncident, nextIncidentId } from "@/lib/incidentsStorage";
import type { Incident, IncidentPriority, IncidentType } from "@/types";

export function IncidentForm() {
  const router = useRouter();
  const [type, setType] = useState<IncidentType>("Delito");
  const categories = useMemo(() => (type === "Delito" ? crimeCategories : incivilityCategories), [type]);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [sector, setSector] = useState(communalSectors[0]);
  const [date, setDate] = useState("2026-05-17");
  const [time, setTime] = useState("14:30");
  const [priority, setPriority] = useState<IncidentPriority>("Media");
  const [reporter, setReporter] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("-33.456000, -71.666000");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleTypeChange = (value: IncidentType) => {
    setType(value);
    setCategory((value === "Delito" ? crimeCategories : incivilityCategories)[0]);
  };

  const captureCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Este navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Solicitando permiso GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLocationStatus(`Ubicación capturada con precisión aproximada de ${Math.round(accuracy)} m.`);
        setIsLocating(false);
      },
      (error) => {
        setLocationStatus(error.message || "No fue posible obtener la ubicación.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  const handleEvidenceUpload = (files: FileList | null) => {
    if (!files?.length) return;

    Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 4)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setEvidence((current) => [...current, reader.result as string].slice(0, 4));
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const parseLocation = () => {
    const [latRaw, lngRaw] = location.split(",").map((value) => value.trim());
    const lat = Number(latRaw);
    const lng = Number(lngRaw);

    return {
      lat: Number.isFinite(lat) ? lat : -33.456,
      lng: Number.isFinite(lng) ? lng : -71.666
    };
  };

  const saveIncident = () => {
    if (!description.trim() || !address.trim() || !reporter.trim()) {
      setSaveStatus("Completa descripción, dirección y nombre del reportante antes de guardar.");
      return;
    }

    const id = nextIncidentId(incidents.map((incident) => incident.id));
    const now = new Date().toLocaleString("es-CL", { hour12: false });
    const newIncident: Incident = {
      id,
      tipo: type,
      categoria: category,
      descripcion: description.trim(),
      direccion: address.trim(),
      sector,
      fecha: date,
      hora: time,
      estado: "Pendiente",
      prioridad: priority,
      reportante: {
        nombre: reporter.trim(),
        telefono: phone.trim() || "Sin teléfono"
      },
      ubicacion: parseLocation(),
      evidencia: evidence.length ? evidence : ["/evidencias/procedimiento.svg"],
      funcionarioAsignado: null,
      historial: [
        {
          fecha: now,
          autor: "Formulario web",
          accion: "Ingreso",
          detalle: "Denuncia creada desde el formulario administrativo."
        }
      ]
    };

    addStoredIncident(newIncident);
    setSaveStatus(`Denuncia ${id} guardada correctamente.`);
    router.push(`/denuncias/${id}`);
  };

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-panel lg:grid-cols-2">
      <Field label="Tipo">
        <select value={type} onChange={(event) => handleTypeChange(event.target.value as IncidentType)} className="input">
          <option>Delito</option>
          <option>Incivilidad</option>
        </select>
      </Field>
      <Field label="Categoría">
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="input">
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </Field>
      <Field label="Dirección o referencia">
        <input value={address} onChange={(event) => setAddress(event.target.value)} className="input" placeholder="Ej: Av. Principal 123" />
      </Field>
      <Field label="Sector">
        <select value={sector} onChange={(event) => setSector(event.target.value)} className="input">
          {communalSectors.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </Field>
      <Field label="Fecha">
        <input type="date" className="input" value={date} onChange={(event) => setDate(event.target.value)} />
      </Field>
      <Field label="Hora">
        <input type="time" className="input" value={time} onChange={(event) => setTime(event.target.value)} />
      </Field>
      <Field label="Prioridad">
        <select value={priority} onChange={(event) => setPriority(event.target.value as IncidentPriority)} className="input">
          {incidentPriorities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </Field>
      <Field label="Ubicación GPS / mock">
        <div className="flex gap-2">
          <input className="input" value={location} onChange={(event) => setLocation(event.target.value)} />
          <button
            type="button"
            onClick={captureCurrentLocation}
            disabled={isLocating}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-municipal-700 hover:bg-municipal-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Capturar ubicación GPS"
          >
            <MapPin className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {locationStatus ? <p className="mt-2 text-xs font-medium text-slate-500">{locationStatus}</p> : null}
      </Field>
      <Field label="Nombre del reportante">
        <input value={reporter} onChange={(event) => setReporter(event.target.value)} className="input" placeholder="Nombre completo" />
      </Field>
      <Field label="Teléfono">
        <input value={phone} onChange={(event) => setPhone(event.target.value)} className="input" placeholder="+56912345678" />
      </Field>
      <Field label="Descripción" wide>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="input min-h-32 resize-y py-3"
          placeholder="Describe los hechos reportados, personas involucradas y antecedentes útiles."
        />
      </Field>
      <Field label="Evidencia fotográfica" wide>
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          <Camera className="mx-auto h-7 w-7 text-slate-400" aria-hidden />
          <p className="mt-2 text-sm font-medium text-slate-700">Adjuntar evidencia</p>
          <p className="text-xs text-slate-500">Puedes cargar hasta 4 imágenes para este caso.</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => handleEvidenceUpload(event.target.files)}
            className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-municipal-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          {evidence.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {evidence.map((src, index) => (
                <img key={`${src.slice(0, 24)}-${index}`} src={src} alt={`Evidencia ${index + 1}`} className="h-24 w-full rounded-lg object-cover" />
              ))}
            </div>
          ) : null}
        </div>
      </Field>
      <div className="flex flex-col items-end gap-2 lg:col-span-2">
        {saveStatus ? <p className="text-sm font-medium text-slate-600">{saveStatus}</p> : null}
        <button type="button" onClick={saveIncident} className="inline-flex h-11 items-center gap-2 rounded-lg bg-municipal-700 px-5 text-sm font-semibold text-white hover:bg-municipal-600">
          <Save className="h-4 w-4" aria-hidden />
          Guardar denuncia
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={wide ? "lg:col-span-2" : ""}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
