// Hardcoded dashboard data. "Todos / Todos" reproduces the mockup exactly; the rest are plausible variations.

export type Tipo = "Todos" | "Líderes" | "Amigos";
export type Municipio = "Todos" | "Bucaramanga" | "Girón";

export const tipos: Tipo[] = ["Todos", "Líderes", "Amigos"];
export const municipios: Municipio[] = ["Todos", "Bucaramanga", "Girón"];

export type Kpi = { label: string; valor: string; sub: string; bg: string; fg: string; borde: string };
export type Tile = { nombre: string; n: string; bg: string; fg: string };
export type Puesto = { nombre: string; n: string; w: string };

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
  zonaLabel: string;
  zonas: [string, number][];
  puestos: [string, number][];
  gestiones: { llamadas: number; whatsapps: number; notificaciones: number };
};

const base: Record<Municipio, Base> = {
  Todos: {
    lideres: 128,
    semana: 11,
    referidos: 1240,
    validados: 843,
    efectivos: 388,
    enMeta: 31,
    porAprobar: 3,
    estado: [46, 18, 27, 9],
    crecimiento: [40, 62, 87, 130, 170, 217, 260, 310],
    zonaLabel: "Mapa de calor por comuna",
    zonas: [
      ["C1", 62], ["C2", 38], ["C3", 95], ["C4", 120], ["C5", 184], ["C6", 71],
      ["C7", 22], ["C8", 44], ["C9", 15], ["C10", 58], ["C11", 33], ["C12", 101],
    ],
    puestos: [["Colegio Santander", 42], ["I.E. Las Américas", 31], ["Coliseo Girón", 19]],
    gestiones: { llamadas: 412, whatsapps: 1038, notificaciones: 276 },
  },
  Bucaramanga: {
    lideres: 84,
    semana: 7,
    referidos: 812,
    validados: 548,
    efectivos: 246,
    enMeta: 19,
    porAprobar: 2,
    estado: [44, 20, 27, 9],
    crecimiento: [28, 41, 57, 84, 109, 140, 171, 204],
    zonaLabel: "Mapa de calor por comuna",
    zonas: [
      ["C1", 48], ["C2", 27], ["C3", 71], ["C4", 96], ["C5", 152], ["C6", 55],
      ["C7", 14], ["C8", 31], ["C9", 9], ["C10", 43], ["C11", 22], ["C12", 92],
    ],
    puestos: [["Colegio Santander", 42], ["I.E. Las Américas", 31], ["Normal Superior", 17]],
    gestiones: { llamadas: 268, whatsapps: 676, notificaciones: 181 },
  },
  Girón: {
    lideres: 31,
    semana: 3,
    referidos: 296,
    validados: 205,
    efectivos: 104,
    enMeta: 9,
    porAprobar: 1,
    estado: [52, 15, 25, 8],
    crecimiento: [8, 14, 19, 31, 38, 50, 61, 74],
    zonaLabel: "Mapa de calor por sector",
    zonas: [
      ["Centro", 58], ["Poblado", 47], ["El Carmen", 31], ["Rincón", 26],
      ["Arenales", 19], ["Villampis", 22], ["Portal", 12], ["Caneyes", 15],
    ],
    puestos: [["Coliseo Girón", 19], ["I.E. Juan Pablo II", 14], ["Colegio San Juan", 9]],
    gestiones: { llamadas: 98, whatsapps: 247, notificaciones: 64 },
  },
};

const tipoFactor: Record<Tipo, number> = { Todos: 1, Líderes: 0.1, Amigos: 0.9 };
const estadoDelta: Record<Tipo, [number, number, number, number]> = {
  Todos: [0, 0, 0, 0],
  Líderes: [12, -4, -7, -1],
  Amigos: [-2, 1, 1, 0],
};

export const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const pct = (a: number, b: number) => Math.round((a / b) * 100);

const heat = (n: number) =>
  n >= 150
    ? { bg: "#0A1033", fg: "#FFFFFF" }
    : n >= 90
      ? { bg: "#1B3DE6", fg: "#FFFFFF" }
      : n >= 40
        ? { bg: "#8FA0F5", fg: "#0A1033" }
        : { bg: "#E6E9FF", fg: "#0A1033" };

const dark = { bg: "#0A1033", fg: "#FFFFFF", borde: "#0A1033" };
const light = { bg: "#FFFFFF", fg: "#0A1033", borde: "#D8DBEA" };
const green = { bg: "#15803D", fg: "#FFFFFF", borde: "#15803D" };

export function getDashboard(tipo: Tipo, municipio: Municipio) {
  const b = base[municipio];
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

  const zonas: Tile[] = b.zonas.map(([nombre, n]) => ({
    nombre,
    n: fmt(Math.max(tipo === "Líderes" ? 1 : 0, Math.round(n * f))),
    ...heat(municipio === "Girón" ? n * 2.6 : n),
  }));

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
    zonaLabel: b.zonaLabel,
    zonas,
    puestos,
    gestiones,
  };
}
