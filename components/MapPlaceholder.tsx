"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, LocateFixed, MapPin, Minus, Navigation, Plus } from "lucide-react";
import { incidents } from "@/data/incidents";
import { applyIncidentUpdate, incidentUpdatesEvent, readIncidentUpdates, type IncidentUpdate } from "@/lib/incidentUpdates";
import { readStoredIncidents, storedIncidentsEvent } from "@/lib/incidentsStorage";
import { cn } from "@/lib/utils";
import type { Incident, IncidentType } from "@/types";

type MapFilter = "Todos" | IncidentType;
type LatLng = { lat: number; lng: number };

const tileSize = 256;
const defaultViewport = { width: 980, height: 560 };
const defaultCenter = { lat: -33.472, lng: -71.646 };

const sectorCenters = [
  { name: "El Tabo Centro", center: { lat: -33.456, lng: -71.666 } },
  { name: "Las Cruces", center: { lat: -33.502, lng: -71.622 } },
  { name: "San Carlos", center: { lat: -33.492, lng: -71.655 } },
  { name: "Playas Blancas", center: { lat: -33.471, lng: -71.641 } },
  { name: "El Triángulo", center: { lat: -33.448, lng: -71.681 } },
  { name: "Quillaycillo", center: { lat: -33.431, lng: -71.691 } },
  { name: "Litoral Alto", center: { lat: -33.462, lng: -71.602 } }
];

const priorityWeight: Record<Incident["prioridad"], number> = {
  Baja: 1,
  Media: 1.25,
  Alta: 1.7,
  Crítica: 2.2
};

function latLngToWorld({ lat, lng }: LatLng, zoom: number) {
  const scale = tileSize * 2 ** zoom;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSinLat = Math.min(Math.max(sinLat, -0.9999), 0.9999);

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + clampedSinLat) / (1 - clampedSinLat)) / (4 * Math.PI)) * scale
  };
}

function worldToLatLng({ x, y }: { x: number; y: number }, zoom: number) {
  const scale = tileSize * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat, lng };
}

function projectToViewport(point: LatLng, center: LatLng, zoom: number, viewport: { width: number; height: number }) {
  const world = latLngToWorld(point, zoom);
  const centerWorld = latLngToWorld(center, zoom);

  return {
    x: viewport.width / 2 + world.x - centerWorld.x,
    y: viewport.height / 2 + world.y - centerWorld.y
  };
}

function buildTiles(center: LatLng, zoom: number, viewport: { width: number; height: number }) {
  const centerWorld = latLngToWorld(center, zoom);
  const topLeft = {
    x: centerWorld.x - viewport.width / 2,
    y: centerWorld.y - viewport.height / 2
  };
  const minTileX = Math.floor(topLeft.x / tileSize);
  const maxTileX = Math.floor((topLeft.x + viewport.width) / tileSize);
  const minTileY = Math.floor(topLeft.y / tileSize);
  const maxTileY = Math.floor((topLeft.y + viewport.height) / tileSize);
  const tiles = [];

  for (let x = minTileX; x <= maxTileX; x += 1) {
    for (let y = minTileY; y <= maxTileY; y += 1) {
      tiles.push({
        key: `${zoom}-${x}-${y}`,
        src: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
        left: x * tileSize - topLeft.x,
        top: y * tileSize - topLeft.y
      });
    }
  }

  return tiles;
}

function heatColor(filter: MapFilter, delitos: number, incivilidades: number) {
  if (filter === "Delito") return "rgba(220, 38, 38, 0.64)";
  if (filter === "Incivilidad") return "rgba(5, 150, 105, 0.58)";
  return delitos >= incivilidades ? "rgba(220, 38, 38, 0.58)" : "rgba(5, 150, 105, 0.54)";
}

function getWeightedCenter(items: Incident[], fallback: LatLng) {
  if (!items.length) return fallback;

  const totals = items.reduce(
    (acc, incident) => {
      const weight = priorityWeight[incident.prioridad];
      acc.lat += incident.ubicacion.lat * weight;
      acc.lng += incident.ubicacion.lng * weight;
      acc.weight += weight;
      return acc;
    },
    { lat: 0, lng: 0, weight: 0 }
  );

  return {
    lat: totals.lat / totals.weight,
    lng: totals.lng / totals.weight
  };
}

export function MapPlaceholder({ className }: { className?: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startCenterWorld: { x: number; y: number };
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [filter, setFilter] = useState<MapFilter>("Todos");
  const [selectedSector, setSelectedSector] = useState("El Tabo Centro");
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState(defaultCenter);
  const [viewport, setViewport] = useState(defaultViewport);
  const [isDragging, setIsDragging] = useState(false);
  const [createdIncidents, setCreatedIncidents] = useState<Incident[]>([]);
  const [updates, setUpdates] = useState<Record<string, IncidentUpdate>>({});

  useEffect(() => {
    if (!mapRef.current) return;

    const updateSize = () => {
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;
      setViewport({
        width: Math.max(320, Math.round(rect.width)),
        height: Math.max(520, Math.round(rect.height))
      });
    };
    const observer = new ResizeObserver(updateSize);

    updateSize();
    observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncIncidents = () => {
      setCreatedIncidents(readStoredIncidents());
      setUpdates(readIncidentUpdates());
    };

    syncIncidents();
    window.addEventListener(storedIncidentsEvent, syncIncidents);
    window.addEventListener(incidentUpdatesEvent, syncIncidents);
    window.addEventListener("storage", syncIncidents);

    return () => {
      window.removeEventListener(storedIncidentsEvent, syncIncidents);
      window.removeEventListener(incidentUpdatesEvent, syncIncidents);
      window.removeEventListener("storage", syncIncidents);
    };
  }, []);

  const tiles = useMemo(() => buildTiles(center, zoom, viewport), [center, viewport, zoom]);
  const mapIncidents = useMemo(
    () => [...createdIncidents, ...incidents].map((incident) => applyIncidentUpdate(incident, updates[incident.id])),
    [createdIncidents, updates]
  );
  const sectors = useMemo(() => {
    return sectorCenters.map((sector) => {
      const sectorIncidents = mapIncidents.filter((incident) => incident.sector === sector.name);
      const filteredIncidents = sectorIncidents.filter((incident) => filter === "Todos" || incident.tipo === filter);
      const delitos = sectorIncidents.filter((incident) => incident.tipo === "Delito").length;
      const incivilidades = sectorIncidents.filter((incident) => incident.tipo === "Incivilidad").length;
      const intensity = filteredIncidents.reduce((sum, incident) => sum + priorityWeight[incident.prioridad], 0);

      return {
        ...sector,
        allIncidents: sectorIncidents,
        incidents: filteredIncidents,
        delitos,
        incivilidades,
        intensity,
        heatCenter: getWeightedCenter(filteredIncidents, sector.center),
        labelCenter: getWeightedCenter(sectorIncidents, sector.center)
      };
    });
  }, [filter, mapIncidents]);

  const maxIntensity = Math.max(...sectors.map((sector) => sector.intensity), 1);
  const selected = sectors.find((sector) => sector.name === selectedSector) ?? sectors[0];
  const visibleIncidents = mapIncidents.filter((incident) => filter === "Todos" || incident.tipo === filter);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-map-control='true']")) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCenterWorld: latLngToWorld(center, zoom),
      moved: false
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      drag.moved = true;
      setIsDragging(true);
    }

    setCenter(
      worldToLatLng(
        {
          x: drag.startCenterWorld.x - dx,
          y: drag.startCenterWorld.y - dy
        },
        zoom
      )
    );
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId === event.pointerId) {
      if (drag.moved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  const shouldIgnoreClick = () => suppressClickRef.current;

  return (
    <div
      ref={mapRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "relative min-h-[620px] touch-none overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-panel",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      <div className="absolute inset-0">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            className="absolute h-64 w-64 select-none"
            draggable={false}
            style={{ left: tile.left, top: tile.top }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-municipal-900/5" />

      {sectors.map((sector) => {
        const point = projectToViewport(sector.heatCenter, center, zoom, viewport);
        const ratio = sector.intensity / maxIntensity;
        const size = sector.intensity === 0 ? 46 : 80 + ratio * 112;
        const color = heatColor(filter, sector.delitos, sector.incivilidades);

        return (
          <button
            key={`${sector.name}-heat`}
            type="button"
            onClick={() => {
              if (!shouldIgnoreClick()) setSelectedSector(sector.name);
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
            style={{ left: point.x, top: point.y, width: size, height: size }}
            aria-label={`Seleccionar ${sector.name}`}
          >
            <span
              className="absolute inset-0 rounded-full blur-md transition"
              style={{
                background: `radial-gradient(circle, ${color} 0%, ${color} 34%, rgba(255,255,255,0) 72%)`,
                opacity: sector.intensity === 0 ? 0.2 : 0.44 + ratio * 0.26
              }}
            />
          </button>
        );
      })}

      {visibleIncidents.map((incident) => {
        const point = projectToViewport(incident.ubicacion, center, zoom, viewport);

        return (
          <Link
            key={incident.id}
            href={`/denuncias/${incident.id}`}
            data-map-control="true"
            className={`absolute z-30 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-4 ${
              incident.tipo === "Delito" ? "text-red-600 ring-red-100" : "text-emerald-600 ring-emerald-100"
            } transition hover:scale-110`}
            style={{ left: point.x, top: point.y }}
            title={`${incident.id} · ${incident.categoria}`}
            aria-label={`Ver denuncia ${incident.id}`}
          >
            <MapPin className="h-4 w-4" aria-hidden />
          </Link>
        );
      })}

      {sectors.map((sector) => {
        const point = projectToViewport(sector.labelCenter, center, zoom, viewport);
        const active = selectedSector === sector.name;

        return (
          <button
            key={sector.name}
            type="button"
            onClick={() => {
              if (shouldIgnoreClick()) return;
              setSelectedSector(sector.name);
              setCenter(sector.center);
            }}
            className={`absolute z-20 min-w-24 -translate-x-1/2 translate-y-6 rounded-lg bg-white/95 px-3 py-2 text-center text-xs font-bold shadow-sm ring-1 transition hover:translate-y-5 ${
              active ? "ring-2 ring-municipal-700" : "ring-slate-200"
            }`}
            style={{ left: point.x, top: point.y }}
          >
            <span className="block text-slate-900">{sector.name}</span>
            <span className="block text-municipal-700">{sector.incidents.length} casos</span>
          </button>
        );
      })}

      <div data-map-control="true" className="absolute left-4 right-4 top-4 z-40 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="max-w-xl rounded-lg bg-white/95 p-4 shadow-panel ring-1 ring-slate-200">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-municipal-50 text-municipal-700">
              <LocateFixed className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-municipal-700">Mapa operativo de El Tabo</p>
              <p className="mt-1 text-sm text-slate-600">Base real OSM con heatmap y mocks proyectados sobre coordenadas.</p>
            </div>
          </div>
        </div>
        <div className="flex rounded-lg bg-white/95 p-1 shadow-panel ring-1 ring-slate-200">
          {(["Todos", "Delito", "Incivilidad"] as MapFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`h-9 rounded-md px-3 text-xs font-bold transition ${
                filter === value ? "bg-municipal-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div data-map-control="true" className="absolute right-4 top-24 z-40 flex flex-col overflow-hidden rounded-lg bg-white/95 shadow-panel ring-1 ring-slate-200">
        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(15, value + 1))}
          className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-100"
          aria-label="Acercar mapa"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(12, value - 1))}
          className="flex h-10 w-10 items-center justify-center border-t border-slate-200 text-slate-700 hover:bg-slate-100"
          aria-label="Alejar mapa"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setCenter(defaultCenter)}
          className="flex h-10 w-10 items-center justify-center border-t border-slate-200 text-slate-700 hover:bg-slate-100"
          aria-label="Recentrar en El Tabo"
        >
          <Navigation className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div data-map-control="true" className="absolute bottom-4 left-4 z-40 w-[min(390px,calc(100%-2rem))] rounded-lg bg-white/95 p-4 shadow-panel ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-municipal-700">Sector seleccionado</p>
            <h3 className="mt-1 text-base font-bold text-slate-950">{selected.name}</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <HeatMetric label="Total" value={selected.allIncidents.length} />
          <HeatMetric label="Delitos" value={selected.delitos} />
          <HeatMetric label="Incivil." value={selected.incivilidades} />
        </div>
        <div className="mt-4 space-y-2">
          {selected.incidents.length ? (
            selected.incidents.slice(0, 3).map((incident) => (
              <Link
                key={incident.id}
                href={`/denuncias/${incident.id}`}
                className="block rounded-md bg-slate-50 px-3 py-2 transition hover:bg-municipal-50"
              >
                <p className="text-xs font-bold text-slate-900">
                  {incident.id} · {incident.tipo}
                </p>
                <p className="truncate text-xs text-slate-600">{incident.categoria}</p>
              </Link>
            ))
          ) : (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">Sin casos para el filtro actual.</p>
          )}
        </div>
      </div>

      <div data-map-control="true" className="absolute bottom-4 right-4 z-40 hidden rounded-lg bg-white/95 p-3 text-xs shadow-panel ring-1 ring-slate-200 sm:block">
        <div className="mb-2 font-bold text-slate-800">Leyenda</div>
        <LegendItem color="bg-red-600" label="Delitos" />
        <LegendItem color="bg-emerald-600" label="Incivilidades" />
        <LegendItem color="bg-municipal-600" label="Mayor tamaño = más intensidad" />
        <p className="mt-2 text-[11px] text-slate-500">© OpenStreetMap contributors</p>
      </div>
    </div>
  );
}

function HeatMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-2">
      <p className="text-lg font-bold text-slate-950">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 py-1 text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}
