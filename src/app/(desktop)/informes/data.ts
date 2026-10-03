// Hardcoded report data for the "Informe de la red" mockup (screen 11).

export type Estado = "Verde" | "Amarillo" | "Rojo" | "Gris";
export type Tipo = "Líderes" | "Amigos";
export type Periodo = "Últimas 4 semanas" | "Toda la campaña";

export const estadoColor: Record<Estado, string> = {
  Verde: "#15803D",
  Amarillo: "#B45309",
  Rojo: "#DC2626",
  Gris: "#6B7280",
};

export type Fila = {
  nombre: string;
  municipio: string;
  lugar: string;
  estado: Estado;
  ref: number;
  val: number;
  efe: number;
  /** multiplier applied when the period is "Toda la campaña" */
  hist: number;
};

const f = (nombre: string, lugar: string, estado: Estado, ref: number, val: number, efe: number, hist: number): Fila => ({
  nombre,
  municipio: lugar.split(" · ")[0],
  lugar,
  estado,
  ref,
  val,
  efe,
  hist,
});

export const lideres: Fila[] = [
  f("Laura Rincón", "Bucaramanga · C5", "Verde", 14, 10, 7, 2.4),
  f("Pedro Mora", "Girón · centro", "Verde", 18, 15, 12, 2.1),
  f("Nelly Ruiz", "Bucaramanga · C12", "Amarillo", 9, 6, 3, 2.8),
  f("Óscar Vera", "Bucaramanga · C4", "Verde", 13, 12, 9, 2.2),
  f("Marcela Díaz", "Floridablanca · C3", "Gris", 5, 2, 0, 3.2),
  f("Hernán Lozano", "Bucaramanga · C1", "Amarillo", 11, 8, 4, 2.6),
  f("Paola Castro", "Piedecuesta", "Rojo", 6, 4, 1, 3.0),
  f("Andrés Niño", "Girón · Poblado", "Verde", 16, 13, 11, 1.9),
];

export const amigos: Fila[] = [
  f("Camila Ortiz", "Bucaramanga · C5", "Verde", 6, 5, 4, 2.0),
  f("Jhon Fredy Silva", "Girón · centro", "Verde", 5, 5, 3, 2.3),
  f("Luz Marina Pabón", "Floridablanca · C3", "Amarillo", 3, 2, 1, 2.7),
  f("Diego Quintero", "Bucaramanga · C12", "Rojo", 2, 1, 0, 3.0),
  f("Sandra Peña", "Piedecuesta", "Verde", 7, 6, 5, 1.8),
  f("Wilmer Arenas", "Bucaramanga · C4", "Gris", 1, 0, 0, 4.0),
  f("Yesenia Gómez", "Girón · Poblado", "Amarillo", 4, 3, 2, 2.4),
  f("Carlos Rueda", "Bucaramanga · C1", "Verde", 5, 4, 4, 2.1),
];

/** Network-wide totals for the default view (shown in the section header). */
export const totales: Record<Tipo, { n: number; ref: number; efe: number }> = {
  Líderes: { n: 128, ref: 1240, efe: 388 },
  Amigos: { n: 1240, ref: 512, efe: 176 },
};

export const departamentos = ["Santander"] as const;
export const municipios = ["Todos", "Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"] as const;
export const colores = ["Todos", "Verde", "Amarillo", "Rojo", "Gris"] as const;
