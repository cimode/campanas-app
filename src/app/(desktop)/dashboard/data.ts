// Hardcoded dashboard data. Santander / Todos reproduces the mockup exactly; every other region is a
// deterministic variation scaled from the synthetic per-municipality counts below.

import type { Feature, FeatureCollection, Point } from "geojson";
import { departamentos, municipios, type Municipio } from "@/lib/geo/divipola";

export type Tipo = "Todos" | "Líderes" | "Amigos";
export const tipos: Tipo[] = ["Todos", "Líderes", "Amigos"];

/** Filter selection. `dpto === null` is the whole country; `mpio === null` is the whole department. */
export type Region = { dpto: string | null; mpio: string | null };
export type Nivel = "pais" | "departamento" | "municipio";
export const nivelDe = (r: Region): Nivel => (r.mpio ? "municipio" : r.dpto ? "departamento" : "pais");

export const DEFAULT_REGION: Region = { dpto: "68", mpio: null };

export type Kpi = { label: string; valor: string; sub: string; bg: string; fg: string; borde: string };
export type Puesto = { nombre: string; n: string; w: string };
export type Zona = { nombre: string; n: number; c: [number, number] };

type Base = {
  lideres: number;
  semana: number;
  referidos: number;
  validados: number;
  efectivos: number;
  enMeta: number;
  porAprobar: number;
  estado: [number, number, number, number]; // verde, amarillo, gris, rojo (%)
  crecimiento: number[]; // registros por semana (8)
  puestos: [string, number][];
  gestiones: { llamadas: number; whatsapps: number; notificaciones: number };
};

const santander: Base = {
  lideres: 128,
  semana: 11,
  referidos: 1240,
  validados: 843,
  efectivos: 388,
  enMeta: 31,
  porAprobar: 3,
  estado: [46, 18, 27, 9],
  crecimiento: [40, 62, 87, 130, 170, 217, 260, 310],
  puestos: [["Colegio Santander", 42], ["I.E. Las Américas", 31], ["Coliseo Girón", 19]],
  gestiones: { llamadas: 412, whatsapps: 1038, notificaciones: 276 },
};

const fijos: Record<string, Base> = {
  "68001": {
    lideres: 84,
    semana: 7,
    referidos: 812,
    validados: 548,
    efectivos: 246,
    enMeta: 19,
    porAprobar: 2,
    estado: [44, 20, 27, 9],
    crecimiento: [28, 41, 57, 84, 109, 140, 171, 204],
    puestos: [["Colegio Santander", 42], ["I.E. Las Américas", 31], ["Normal Superior", 17]],
    gestiones: { llamadas: 268, whatsapps: 676, notificaciones: 181 },
  },
  "68307": {
    lideres: 31,
    semana: 3,
    referidos: 296,
    validados: 205,
    efectivos: 104,
    enMeta: 9,
    porAprobar: 1,
    estado: [52, 15, 25, 8],
    crecimiento: [8, 14, 19, 31, 38, 50, 61, 74],
    puestos: [["Coliseo Girón", 19], ["I.E. Juan Pablo II", 14], ["Colegio San Juan", 9]],
    gestiones: { llamadas: 98, whatsapps: 247, notificaciones: 64 },
  },
};

// Comunas / sectores with centres [lng, lat] (Bucaramanga: OSM comuna centroids); they seed the city-level heat map.
export const zonasCiudad: Record<string, { label: string; zonas: Zona[] }> = {
  "68001": {
    label: "comuna",
    zonas: [
      { nombre: "C1 Norte", n: 48, c: [-73.138, 7.156] },
      { nombre: "C2 Nororiental", n: 27, c: [-73.126, 7.146] },
      { nombre: "C3 San Francisco", n: 71, c: [-73.12, 7.126] },
      { nombre: "C4 Occidental", n: 96, c: [-73.134, 7.123] },
      { nombre: "C5 García Rovira", n: 152, c: [-73.145, 7.108] },
      { nombre: "C6 La Concordia", n: 55, c: [-73.118, 7.109] },
      { nombre: "C7 La Ciudadela", n: 14, c: [-73.124, 7.104] },
      { nombre: "C8 Suroccidente", n: 31, c: [-73.142, 7.093] },
      { nombre: "C9 La Pedregosa", n: 9, c: [-73.109, 7.095] },
      { nombre: "C10 Provenza", n: 43, c: [-73.113, 7.085] },
      { nombre: "C11 Sur", n: 22, c: [-73.133, 7.083] },
      { nombre: "C12 Cabecera", n: 92, c: [-73.109, 7.113] },
    ],
  },
  "68307": {
    label: "sector",
    zonas: [
      { nombre: "Centro", n: 58, c: [-73.169, 7.071] },
      { nombre: "Poblado", n: 47, c: [-73.161, 7.083] },
      { nombre: "El Carmen", n: 31, c: [-73.176, 7.065] },
      { nombre: "Rincón", n: 26, c: [-73.181, 7.077] },
      { nombre: "Arenales", n: 19, c: [-73.158, 7.06] },
      { nombre: "Villampis", n: 22, c: [-73.152, 7.071] },
      { nombre: "Portal", n: 12, c: [-73.188, 7.058] },
      { nombre: "Caneyes", n: 15, c: [-73.166, 7.094] },
    ],
  },
};

// Urban centres for municipalities whose largest polygon is mostly rural.
const centrosUrbanos: Record<string, [number, number]> = {
  "11001": [-74.1, 4.65],
  "05001": [-75.575, 6.247],
  "76001": [-76.525, 3.43],
  "08001": [-74.8, 10.98],
  "13001": [-75.51, 10.4],
  "54001": [-72.505, 7.89],
  "68081": [-73.855, 7.065],
};

// ---- Synthetic referidos per municipality ------------------------------------------------------

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const grandes: Record<string, number> = {
  "11001": 420, "54001": 190, "05001": 160, "76001": 120, "08001": 70, "13001": 60,
  "68081": 12, "68547": 34, "68001": 812, "68307": 296,
};
const vecinos = new Set(["54", "15", "20", "05"]);

/** Referidos per municipality code. Santander adds up to the mockup's 1 240 exactly. */
export const referidosPorMunicipio: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  for (const m of municipios) {
    if (grandes[m.code] !== undefined) out[m.code] = grandes[m.code];
    else if (m.dpto === "68") out[m.code] = hash(m.code) % 2;
    else out[m.code] = hash(m.code) % (vecinos.has(m.dpto) ? 9 : 5);
  }
  // Floridablanca absorbs the remainder so Santander totals 1 240.
  out["68276"] = 0;
  const resto = municipios.filter((m) => m.dpto === "68").reduce((s, m) => s + out[m.code], 0);
  out["68276"] = santander.referidos - resto;
  return out;
})();

export const referidosPorDepartamento: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  for (const m of municipios) out[m.dpto] = (out[m.dpto] ?? 0) + referidosPorMunicipio[m.code];
  return out;
})();

const totalPais = Object.values(referidosPorDepartamento).reduce((a, b) => a + b, 0);

const municipioPorCode = new Map(municipios.map((m) => [m.code, m]));
const departamentoPorCode = new Map(departamentos.map((d) => [d.code, d]));

export const municipiosDe = (dpto: string): Municipio[] => municipios.filter((m) => m.dpto === dpto);
export const nombreMunicipio = (code: string) => municipioPorCode.get(code)?.name ?? code;
export const nombreDepartamento = (code: string) => departamentoPorCode.get(code)?.name ?? code;
export const centroMunicipio = (code: string): [number, number] => centrosUrbanos[code] ?? municipioPorCode.get(code)?.c ?? [-74.3, 4.6];

export function nombreRegion(r: Region) {
  if (r.mpio) return nombreMunicipio(r.mpio);
  if (r.dpto) return nombreDepartamento(r.dpto);
  return "Colombia";
}

const tipoFactor: Record<Tipo, number> = { Todos: 1, Líderes: 0.1, Amigos: 0.9 };
const estadoDelta: Record<Tipo, [number, number, number, number]> = {
  Todos: [0, 0, 0, 0],
  Líderes: [12, -4, -7, -1],
  Amigos: [-2, 1, 1, 0],
};

export const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const pct = (a: number, b: number) => Math.round((a / Math.max(1, b)) * 100);

/** Referidos for the region's children (departments, municipalities or comunas), scaled by tipo. */
export function conteosHijos(tipo: Tipo, r: Region): { code: string; nombre: string; n: number }[] {
  const f = tipoFactor[tipo];
  const scale = (n: number) => Math.round(n * f);
  if (r.mpio) {
    return (zonasCiudad[r.mpio]?.zonas ?? []).map((z) => ({ code: z.nombre, nombre: z.nombre, n: scale(z.n) }));
  }
  if (r.dpto) {
    return municipiosDe(r.dpto).map((m) => ({ code: m.code, nombre: m.name, n: scale(referidosPorMunicipio[m.code]) }));
  }
  return departamentos.map((d) => ({ code: d.code, nombre: d.name, n: scale(referidosPorDepartamento[d.code] ?? 0) }));
}

function baseDe(r: Region): Base {
  if (r.mpio && fijos[r.mpio]) return fijos[r.mpio];
  if (r.dpto === "68" && !r.mpio) return santander;
  const total = r.mpio ? referidosPorMunicipio[r.mpio] : r.dpto ? referidosPorDepartamento[r.dpto] : totalPais;
  const k = total / santander.referidos;
  const s = (n: number, min = 0) => Math.max(min, Math.round(n * k));
  const lugar = nombreRegion(r);
  return {
    ...santander,
    lideres: s(santander.lideres, total > 0 ? 1 : 0),
    semana: s(santander.semana),
    referidos: total,
    validados: s(santander.validados),
    efectivos: s(santander.efectivos),
    enMeta: s(santander.enMeta),
    porAprobar: s(santander.porAprobar),
    crecimiento: santander.crecimiento.map((v) => s(v)),
    puestos: santander.puestos.map(([, n], i) => [`Puesto ${i + 1} · ${lugar}`, s(n)] as [string, number]),
    gestiones: {
      llamadas: s(santander.gestiones.llamadas),
      whatsapps: s(santander.gestiones.whatsapps),
      notificaciones: s(santander.gestiones.notificaciones),
    },
  };
}

const dark = { bg: "#0A1033", fg: "#FFFFFF", borde: "#0A1033" };
const light = { bg: "#FFFFFF", fg: "#0A1033", borde: "#D8DBEA" };
const green = { bg: "#15803D", fg: "#FFFFFF", borde: "#15803D" };

export function getDashboard(tipo: Tipo, region: Region) {
  const b = baseDe(region);
  const f = tipoFactor[tipo];

  let kpis: Kpi[];
  if (tipo === "Líderes") {
    const conRef = Math.round(b.lideres * 0.81);
    const val = Math.round(b.lideres * 0.94);
    const efe = Math.round(b.lideres * 0.58);
    kpis = [
      { label: "Líderes", valor: fmt(b.lideres), sub: `+${b.semana} esta semana`, ...dark },
      { label: "Con referidos", valor: fmt(conRef), sub: "al menos 1 amigo registrado", ...light },
      { label: "Validados", valor: fmt(val), sub: `${pct(val, b.lideres)} % de líderes`, ...light },
      { label: "Líderes efectivos", valor: fmt(efe), sub: `${pct(efe, val)} % de validados`, ...green },
      { label: "Líderes en meta", valor: fmt(b.enMeta), sub: "ya llegaron a 1×12", ...light },
    ];
  } else if (tipo === "Amigos") {
    const rep = Math.round(b.validados * 0.18);
    const gris = Math.round(b.validados * 0.27);
    kpis = [
      { label: "Referidos", valor: fmt(b.referidos), sub: "desde QR y enlaces", ...dark },
      { label: "Validados", valor: fmt(b.validados), sub: `${pct(b.validados, b.referidos)} % de referidos`, ...light },
      { label: "Por gestionar", valor: fmt(gris), sub: "en gris en la cola", ...light },
      { label: "Amigos efectivos", valor: fmt(b.efectivos), sub: `${pct(b.efectivos, b.validados)} % de validados`, ...green },
      { label: "Reprogramados", valor: fmt(rep), sub: "en amarillo · volver a llamar", ...light },
    ];
  } else {
    kpis = [
      { label: "Líderes", valor: fmt(b.lideres), sub: `+${b.semana} esta semana`, ...dark },
      { label: "Referidos", valor: fmt(b.referidos), sub: "desde QR y enlaces", ...light },
      { label: "Validados", valor: fmt(b.validados), sub: `${pct(b.validados, b.referidos)} % de referidos`, ...light },
      { label: "Amigos efectivos", valor: fmt(b.efectivos), sub: `${pct(b.efectivos, b.validados)} % de validados`, ...green },
      { label: "Líderes en meta", valor: fmt(b.enMeta), sub: "ya llegaron a 1×12", ...light },
    ];
  }

  const d = estadoDelta[tipo];
  const estado = b.estado.map((v, i) => v + d[i]) as [number, number, number, number];

  const semanas = b.crecimiento.map((v) => Math.max(1, Math.round(v * f)));
  const maxSemana = Math.max(...semanas);
  const barras = semanas.map((v) => `${Math.round((v / maxSemana) * 100)}%`);

  const puestosN = b.puestos.map(([nombre, n]) => [nombre, Math.max(1, Math.round(n * (tipo === "Líderes" ? 0.25 : f)))] as const);
  const maxP = Math.max(...puestosN.map(([, n]) => n));
  const puestos: Puesto[] = puestosN.map(([nombre, n]) => ({ nombre, n: String(n), w: `${Math.round((n / maxP) * 100)}%` }));

  const gf = tipo === "Todos" ? 1 : tipo === "Líderes" ? 0.22 : 0.78;
  const gestiones = [
    { valor: fmt(Math.round(b.gestiones.llamadas * gf)), label: "Llamadas" },
    { valor: fmt(Math.round(b.gestiones.whatsapps * gf)), label: "WhatsApps" },
    { valor: fmt(b.gestiones.notificaciones), label: "Notificaciones a líderes" },
    { valor: String(b.porAprobar), label: "Amigos por aprobar como líder" },
  ];

  return {
    kpis,
    estado,
    barras,
    ultimaSemana: semanas[semanas.length - 1],
    primeraSemana: semanas[0],
    puestos,
    gestiones,
  };
}

// ---- City-level heat points ---------------------------------------------------------------------

/** Seeded scatter of one point per referido around comuna centres (or the urban centre). */
export function puntosCalor(tipo: Tipo, mpio: string): FeatureCollection<Point> {
  let seed = hash(mpio + tipo);
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  const f = tipoFactor[tipo];
  const zonas = zonasCiudad[mpio]?.zonas ?? [{ nombre: "", n: referidosPorMunicipio[mpio] ?? 0, c: centroMunicipio(mpio) }];
  const spread = zonasCiudad[mpio] ? 0.0028 : 0.012;
  const features: Feature<Point>[] = [];
  for (const z of zonas) {
    const n = Math.min(1500, Math.round(z.n * f));
    for (let i = 0; i < n; i++) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [z.c[0] + gauss() * spread, z.c[1] + gauss() * spread] },
      });
    }
  }
  return { type: "FeatureCollection", features };
}
