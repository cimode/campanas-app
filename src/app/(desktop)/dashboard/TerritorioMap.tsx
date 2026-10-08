"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { Map as MlMap, Marker, Popup } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { fmt, nivelDe, puntosCalor, type Region, type Tipo } from "./data";

type Geo = FeatureCollection<Polygon | MultiPolygon, { code: string; name: string; dpto?: string }>;
type Conteo = { code: string; nombre: string; n: number };
export type Ubicacion = { lng: number; lat: number; label: string };

// Same ramp as the old tile grid: light → primary → ink.
export const HEAT_RAMP = ["#E6E9FF", "#8FA0F5", "#1B3DE6", "#0A1033"];
const EMPTY = "#F1F2F8";
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const COLOMBIA: [[number, number], [number, number]] = [[-79.2, -4.3], [-66.8, 12.6]];

function bbox(features: Geo["features"]): [[number, number], [number, number]] {
  let [w, s, e, n] = [180, 90, -180, -90];
  for (const f of features) {
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys)
      for (const [x, y] of poly[0]) {
        w = Math.min(w, x);
        e = Math.max(e, x);
        s = Math.min(s, y);
        n = Math.max(n, y);
      }
  }
  return [[w, s], [e, n]];
}

function bboxPuntos(coords: number[][]): [[number, number], [number, number]] {
  const xs = coords.map((c) => c[0]).sort((a, b) => a - b);
  const ys = coords.map((c) => c[1]).sort((a, b) => a - b);
  // 2nd–98th percentile so a few gaussian outliers don't zoom the camera out.
  const q = (a: number[], p: number) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
  return [[q(xs, 0.02), q(ys, 0.02)], [q(xs, 0.98), q(ys, 0.98)]];
}

/**
 * Choropleth of referidos: departments for the whole country, municipalities inside a department,
 * and a point heat map inside a municipality. Clicking a region drills down one level.
 */
export function TerritorioMap({
  tipo,
  region,
  conteos,
  ubicacion,
  onSelect,
}: {
  tipo: Tipo;
  region: Region;
  conteos: Conteo[];
  ubicacion: Ubicacion | null;
  onSelect: (r: Region) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const geoRef = useRef<{ deptos: Geo; mpios: Geo } | null>(null);
  const libRef = useRef<typeof import("maplibre-gl") | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  const regionRef = useRef(region);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
    regionRef.current = region;
  });

  // Create the map once; geometry is fetched alongside the library.
  useEffect(() => {
    let cancelled = false;
    let map: MlMap | null = null;
    (async () => {
      try {
        const [lib, deptos, mpios] = await Promise.all([
          import("maplibre-gl"),
          fetch("/geo/departamentos.json").then((r) => r.json() as Promise<Geo>),
          fetch("/geo/municipios.json").then((r) => r.json() as Promise<Geo>),
        ]);
        if (cancelled || !box.current) return;
        // Turbopack does not emit MapLibre's worker chunk; postinstall copies it into /public.
        lib.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        libRef.current = lib;
        geoRef.current = { deptos, mpios };
        map = new lib.Map({
          container: box.current,
          style: STYLE_URL,
          bounds: COLOMBIA,
          fitBoundsOptions: { padding: 16 },
          attributionControl: { compact: true },
          dragRotate: false,
          pitchWithRotate: false,
        });
        map.addControl(new lib.NavigationControl({ showCompass: false }), "top-right");
        mapRef.current = map;
        const popup: Popup = new lib.Popup({ closeButton: false, closeOnClick: false, offset: 8 });

        map.on("load", () => {
          if (!map) return;
          // Draw choropleth under the basemap labels so place names stay readable.
          const firstSymbol = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
          map.addSource("deptos", { type: "geojson", data: deptos, promoteId: "code" });
          map.addSource("mpios", { type: "geojson", data: mpios, promoteId: "code" });
          map.addSource("puntos", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          const fillColor = [
            "case",
            ["<=", ["coalesce", ["feature-state", "t"], 0], 0],
            EMPTY,
            ["interpolate", ["linear"], ["feature-state", "t"], 0, HEAT_RAMP[0], 0.35, HEAT_RAMP[1], 0.7, HEAT_RAMP[2], 1, HEAT_RAMP[3]],
          ] as const;
          const hoverOpacity = ["case", ["boolean", ["feature-state", "hover"], false], 0.95, 0.8] as const;
          map.addLayer({ id: "deptos-fill", type: "fill", source: "deptos", paint: { "fill-color": fillColor as never, "fill-opacity": hoverOpacity as never } }, firstSymbol);
          map.addLayer({ id: "mpios-fill", type: "fill", source: "mpios", paint: { "fill-color": fillColor as never, "fill-opacity": hoverOpacity as never } }, firstSymbol);
          map.addLayer({ id: "mpios-line", type: "line", source: "mpios", paint: { "line-color": "#FFFFFF", "line-width": 0.7 } }, firstSymbol);
          map.addLayer({ id: "deptos-line", type: "line", source: "deptos", paint: { "line-color": "#0A1033", "line-width": 0.8, "line-opacity": 0.55 } }, firstSymbol);
          map.addLayer(
            {
              id: "heat",
              type: "heatmap",
              source: "puntos",
              paint: {
                // ~800 points share a few km²: keep each one light so comunas stay distinguishable.
                "heatmap-weight": 0.3,
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 6, 15, 26],
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 0.4, 15, 1.2],
                "heatmap-opacity": 0.85,
                "heatmap-color": [
                  "interpolate", ["linear"], ["heatmap-density"],
                  0, "rgba(230,233,255,0)", 0.1, HEAT_RAMP[0], 0.35, HEAT_RAMP[1], 0.7, HEAT_RAMP[2], 1, HEAT_RAMP[3],
                ],
              },
            },
            firstSymbol,
          );

          let hovered: { source: string; id: string } | null = null;
          for (const [layer, source] of [["deptos-fill", "deptos"], ["mpios-fill", "mpios"]] as const) {
            map.on("mousemove", layer, (e) => {
              const f = e.features?.[0];
              if (!map || !f || f.id === undefined) return;
              if (hovered) map.setFeatureState(hovered, { hover: false });
              hovered = { source, id: String(f.id) };
              map.setFeatureState(hovered, { hover: true });
              map.getCanvas().style.cursor = "pointer";
              const n = (map.getFeatureState(hovered).n as number | undefined) ?? 0;
              popup
                .setLngLat(e.lngLat)
                .setHTML(`<strong>${String(f.properties.name)}</strong><br>${fmt(n)} referidos`)
                .addTo(map);
            });
            map.on("mouseleave", layer, () => {
              if (!map) return;
              if (hovered) map.setFeatureState(hovered, { hover: false });
              hovered = null;
              map.getCanvas().style.cursor = "";
              popup.remove();
            });
            map.on("click", layer, (e) => {
              const f = e.features?.[0];
              if (!f) return;
              popup.remove();
              const code = String(f.properties.code);
              onSelectRef.current(source === "deptos" ? { dpto: code, mpio: null } : { dpto: regionRef.current.dpto, mpio: code });
            });
          }
          setReady(true);
        });
        map.on("error", (e) => console.warn("[TerritorioMap]", e.error));
      } catch (err) {
        console.warn("[TerritorioMap]", err);
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync layers, colours and camera with the filters.
  useEffect(() => {
    const map = mapRef.current;
    const geo = geoRef.current;
    if (!ready || !map || !geo) return;
    const nivel = nivelDe(region);
    const vis = (id: string, on: boolean) => map.setLayoutProperty(id, "visibility", on ? "visible" : "none");

    vis("deptos-fill", nivel === "pais");
    vis("mpios-fill", nivel === "departamento");
    vis("mpios-line", nivel === "departamento");
    vis("heat", nivel === "municipio");

    if (nivel !== "pais") map.setFilter("mpios-line", ["==", ["get", "dpto"], region.dpto]);
    map.setFilter("mpios-fill", ["==", ["get", "dpto"], region.dpto ?? ""]);

    // sqrt scale keeps small municipalities visible next to the capital.
    const max = Math.max(1, ...conteos.map((c) => c.n));
    const source = nivel === "pais" ? "deptos" : "mpios";
    for (const c of conteos) {
      if (nivel === "municipio") break;
      map.setFeatureState({ source, id: c.code }, { n: c.n, t: c.n > 0 ? Math.sqrt(c.n) / Math.sqrt(max) : 0 });
    }

    const calor = nivel === "municipio" && region.mpio ? puntosCalor(tipo, region.mpio) : null;
    const puntos = map.getSource("puntos");
    if (puntos && "setData" in puntos) {
      (puntos as { setData: (d: unknown) => void }).setData(calor ?? { type: "FeatureCollection", features: [] });
    }

    // At city level frame the urban area where the referidos are, not the whole (mostly rural) municipality.
    const target =
      nivel === "pais"
        ? COLOMBIA
        : nivel === "departamento"
          ? bbox(geo.deptos.features.filter((f) => f.properties.code === region.dpto))
          : calor && calor.features.length > 0
            ? bboxPuntos(calor.features.map((f) => f.geometry.coordinates))
            : bbox(geo.mpios.features.filter((f) => f.properties.code === region.mpio));
    map.fitBounds(target, { padding: nivel === "municipio" ? 24 : 16, duration: 700, maxZoom: 14 });
  }, [ready, region, tipo, conteos]);

  // Geocoded address marker.
  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    markerRef.current?.remove();
    markerRef.current = null;
    if (!ready || !map || !lib || !ubicacion) return;
    markerRef.current = new lib.Marker({ color: "#E8176F" })
      .setLngLat([ubicacion.lng, ubicacion.lat])
      .setPopup(new lib.Popup({ offset: 24, closeButton: false }).setText(ubicacion.label))
      .addTo(map);
    const t = setTimeout(() => map.flyTo({ center: [ubicacion.lng, ubicacion.lat], zoom: 15, duration: 900 }), 750);
    return () => clearTimeout(t);
  }, [ready, ubicacion]);

  return (
    <div style={{ position: "relative", height: 380, borderRadius: 12, overflow: "hidden", background: "#E9EBF5" }}>
      <div ref={box} style={{ position: "absolute", inset: 0 }} role="region" aria-label="Mapa de calor de referidos" />
      {!ready && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#5B6180" }}>
          {error ? "No se pudo cargar el mapa." : "Cargando mapa…"}
        </div>
      )}
    </div>
  );
}
