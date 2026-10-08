import type { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import municipiosGeo from "../../../public/geo/municipios.json";

type Props = { code: string; name: string; dpto: string; dptoName: string };
const geo = municipiosGeo as unknown as FeatureCollection<Polygon | MultiPolygon, Props>;

function inRing([x, y]: Position, ring: Position[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPolygon(p: Position, rings: Position[][]) {
  return inRing(p, rings[0]) && !rings.slice(1).some((hole) => inRing(p, hole));
}

/**
 * Point-in-polygon against the official DANE municipal boundaries. This, not the geocoder's
 * free-text admin names, is the source of truth for the DIVIPOLA code of an address.
 */
export function municipioEn(lng: number, lat: number): Props | null {
  const p: Position = [lng, lat];
  for (const f of geo.features) {
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    if (polys.some((rings) => inPolygon(p, rings))) return f.properties;
  }
  return null;
}
