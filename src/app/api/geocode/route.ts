import type { NextRequest } from "next/server";
import { departamentos, municipios } from "@/lib/geo/divipola";
import { municipioEn } from "@/lib/geo/ubicar";

type Component = { long_name: string; types: string[] };
type GoogleResult = {
  formatted_address: string;
  address_components: Component[];
  geometry: { location: { lat: number; lng: number }; location_type: string };
};

const pick = (cs: Component[], ...types: string[]) => {
  for (const t of types) {
    const c = cs.find((x) => x.types.includes(t));
    if (c) return c.long_name;
  }
  return null;
};

/**
 * GET /api/geocode?q=Cra 33 # 44-21, Bucaramanga, Santander
 * → { barrio, municipio, departamento, pais, divipola, lat, lng, precision }
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return Response.json({ error: "Falta la dirección (q)." }, { status: 400 });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Response.json({ error: "Geocodificación no configurada: falta GOOGLE_MAPS_API_KEY." }, { status: 501 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", q);
  url.searchParams.set("components", "country:CO");
  url.searchParams.set("region", "co");
  url.searchParams.set("language", "es");
  url.searchParams.set("key", key);

  const res = await fetch(url, { cache: "no-store" });
  const body = (await res.json()) as { status: string; results: GoogleResult[]; error_message?: string };
  if (body.status === "ZERO_RESULTS") return Response.json({ error: "No encontramos esa dirección." }, { status: 404 });
  if (body.status !== "OK") {
    console.warn("[geocode]", body.status, body.error_message);
    return Response.json({ error: "El servicio de geocodificación falló." }, { status: 502 });
  }

  const r = body.results[0];
  const { lat, lng } = r.geometry.location;
  const cs = r.address_components;
  const dane = municipioEn(lng, lat);

  return Response.json({
    direccion: r.formatted_address,
    lat,
    lng,
    // ROOFTOP / RANGE_INTERPOLATED are address-level; GEOMETRIC_CENTER / APPROXIMATE are not.
    precision: r.geometry.location_type,
    barrio: pick(cs, "neighborhood", "sublocality_level_1", "sublocality"),
    municipio: (dane && municipios.find((m) => m.code === dane.code)?.name) ?? pick(cs, "locality", "administrative_area_level_2"),
    departamento: (dane && departamentos.find((d) => d.code === dane.dpto)?.name) ?? pick(cs, "administrative_area_level_1"),
    pais: pick(cs, "country") ?? "Colombia",
    divipola: dane ? { municipio: dane.code, departamento: dane.dpto } : null,
  });
}
