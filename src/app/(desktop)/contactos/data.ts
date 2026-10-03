// Hardcoded contacts (líderes y amigos) — names consistent with mockups 09 (call center) and 11 (informe).

export type TipoContacto = "Líder" | "Amigo";
export type Estado = "Verde" | "Amarillo" | "Gris" | "Rojo";
export type MunicipioContacto = "Bucaramanga" | "Girón" | "Floridablanca" | "Piedecuesta";

export type Contacto = {
  id: string;
  nombre: string;
  tipo: TipoContacto;
  municipio: MunicipioContacto;
  zona: string;
  lider: string | null;
  estado: Estado;
  telefono: string;
  cedula: string;
  puesto: string;
  registro: string; // ISO date
  origen: "QR" | "Enlace del líder" | "Formulario web";
  ultimaGestion: string;
  meta?: { ref: number; val: number; efe: number };
};

export const estados: Estado[] = ["Verde", "Amarillo", "Gris", "Rojo"];
export const municipiosContacto: MunicipioContacto[] = ["Bucaramanga", "Girón", "Floridablanca", "Piedecuesta"];

export const estadoStyle: Record<Estado, { bg: string; fg: string; label: string }> = {
  Verde: { bg: "#15803D", fg: "#FFFFFF", label: "Interesado · efectivo" },
  Amarillo: { bg: "#FACC15", fg: "#0A1033", label: "Más o menos · reprogramar" },
  Gris: { bg: "#6B7280", fg: "#FFFFFF", label: "Sin gestionar · reintentar" },
  Rojo: { bg: "#DC2626", fg: "#FFFFFF", label: "No interesado" },
};

const L = (
  id: string,
  nombre: string,
  municipio: MunicipioContacto,
  zona: string,
  estado: Estado,
  telefono: string,
  cedula: string,
  puesto: string,
  registro: string,
  ultimaGestion: string,
  meta: { ref: number; val: number; efe: number },
): Contacto => ({ id, nombre, tipo: "Líder", municipio, zona, lider: null, estado, telefono, cedula, puesto, registro, origen: "QR", ultimaGestion, meta });

const A = (
  id: string,
  nombre: string,
  lider: string,
  municipio: MunicipioContacto,
  zona: string,
  estado: Estado,
  telefono: string,
  cedula: string,
  puesto: string,
  registro: string,
  origen: Contacto["origen"],
  ultimaGestion: string,
): Contacto => ({ id, nombre, tipo: "Amigo", municipio, zona, lider, estado, telefono, cedula, puesto, registro, origen, ultimaGestion });

export const contactos: Contacto[] = [
  L("l1", "Laura Rincón", "Bucaramanga", "C5", "Verde", "+57 300 555 0142", "63 541 ••• 908", "Colegio Santander · mesa 4", "2026-08-03", "Notificación de meta · hace 2 d", { ref: 14, val: 10, efe: 7 }),
  L("l2", "Pedro Mora", "Girón", "Centro", "Verde", "+57 311 555 0187", "91 238 ••• 114", "Coliseo Girón · mesa 7", "2026-08-01", "Llamada efectiva · hace 1 d", { ref: 18, val: 15, efe: 12 }),
  L("l3", "Nelly Ruiz", "Bucaramanga", "C12", "Amarillo", "+57 315 555 0163", "37 822 ••• 450", "I.E. Las Américas · mesa 9", "2026-08-09", "Reprogramada · mañana 10:00", { ref: 9, val: 6, efe: 3 }),
  L("l4", "Óscar Vera", "Bucaramanga", "C4", "Verde", "+57 318 555 0121", "13 742 ••• 067", "Normal Superior · mesa 2", "2026-08-05", "WhatsApp leído · hace 3 d", { ref: 13, val: 12, efe: 9 }),
  L("l5", "Marcela Díaz", "Floridablanca", "C3", "Gris", "+57 320 555 0175", "63 498 ••• 331", "Colegio La Salle · mesa 11", "2026-09-02", "Sin gestión", { ref: 5, val: 2, efe: 0 }),
  L("l6", "Hernán Lozano", "Bucaramanga", "C1", "Amarillo", "+57 301 555 0138", "91 476 ••• 285", "Colegio Santander · mesa 15", "2026-08-14", "No contestó · hace 4 d", { ref: 11, val: 8, efe: 4 }),
  L("l7", "Paola Castro", "Piedecuesta", "Centro", "Rojo", "+57 316 555 0194", "1 102 ••• 778", "Colegio Balbino García · mesa 3", "2026-08-20", "No interesada · hace 6 d", { ref: 6, val: 4, efe: 1 }),
  L("l8", "Andrés Niño", "Girón", "Poblado", "Verde", "+57 313 555 0156", "1 098 ••• 642", "I.E. Juan Pablo II · mesa 5", "2026-08-07", "Llamada efectiva · hoy 09:12", { ref: 16, val: 13, efe: 11 }),

  A("a1", "Jorge Pinzón", "Laura Rincón", "Bucaramanga", "C5", "Gris", "+57 301 555 0199", "1 098 ••• 221", "Colegio Santander · mesa 12", "2026-10-01", "Enlace del líder", "Validado por WhatsApp · ayer 18:04"),
  A("a2", "Diana Suárez", "Laura Rincón", "Bucaramanga", "C5", "Amarillo", "+57 310 555 0117", "1 095 ••• 803", "Colegio Santander · mesa 6", "2026-09-24", "QR", "Reprogramada · hoy 14:30"),
  A("a3", "Andrés Quintero", "Pedro Mora", "Girón", "Centro", "Gris", "+57 312 555 0170", "1 100 ••• 349", "Coliseo Girón · mesa 3", "2026-09-30", "Enlace del líder", "En cola · hace 1 d"),
  A("a4", "Sofía Herrera", "Pedro Mora", "Girón", "Centro", "Gris", "+57 317 555 0128", "1 005 ••• 712", "Coliseo Girón · mesa 8", "2026-09-30", "QR", "En cola · hace 1 d"),
  A("a5", "Camilo Ortiz", "Nelly Ruiz", "Bucaramanga", "C12", "Gris", "+57 304 555 0183", "1 098 ••• 590", "I.E. Las Américas · mesa 2", "2026-09-29", "Enlace del líder", "En cola · hace 2 d"),
  A("a6", "Valentina Gómez", "Laura Rincón", "Bucaramanga", "C5", "Verde", "+57 302 555 0161", "1 098 ••• 017", "Colegio Santander · mesa 4", "2026-09-12", "QR", "Llamada efectiva · hace 5 d"),
  A("a7", "Luis Fernando Arias", "Óscar Vera", "Bucaramanga", "C4", "Verde", "+57 314 555 0109", "91 512 ••• 436", "Normal Superior · mesa 2", "2026-09-08", "Enlace del líder", "Llamada efectiva · hace 1 sem"),
  A("a8", "Carolina Mejía", "Óscar Vera", "Bucaramanga", "C4", "Verde", "+57 319 555 0146", "1 096 ••• 284", "Normal Superior · mesa 6", "2026-09-10", "Formulario web", "WhatsApp efectivo · hace 6 d"),
  A("a9", "Julián Rueda", "Hernán Lozano", "Bucaramanga", "C1", "Rojo", "+57 305 555 0132", "1 098 ••• 955", "Colegio Santander · mesa 15", "2026-09-15", "QR", "No interesado · hace 4 d"),
  A("a10", "Natalia Pabón", "Marcela Díaz", "Floridablanca", "C3", "Gris", "+57 321 555 0177", "1 098 ••• 403", "Colegio La Salle · mesa 11", "2026-09-27", "Enlace del líder", "No contestó · hace 3 d"),
  A("a11", "Santiago Becerra", "Andrés Niño", "Girón", "Poblado", "Verde", "+57 316 555 0114", "1 102 ••• 167", "I.E. Juan Pablo II · mesa 5", "2026-09-05", "QR", "Llamada efectiva · hace 1 sem"),
  A("a12", "Daniela Cárdenas", "Paola Castro", "Piedecuesta", "Centro", "Rojo", "+57 300 555 0190", "1 101 ••• 528", "Colegio Balbino García · mesa 3", "2026-09-18", "Enlace del líder", "No interesada · hace 6 d"),
  A("a13", "Mauricio Delgado", "Paola Castro", "Piedecuesta", "Cabecera", "Amarillo", "+57 311 555 0124", "1 101 ••• 096", "Colegio Balbino García · mesa 7", "2026-09-21", "QR", "Reprogramado · viernes 16:00"),
  A("a14", "Yesenia Prada", "Nelly Ruiz", "Bucaramanga", "C12", "Verde", "+57 318 555 0153", "1 098 ••• 731", "I.E. Las Américas · mesa 9", "2026-09-11", "Formulario web", "Llamada efectiva · hace 1 sem"),
  A("a15", "Fabián Serrano", "Pedro Mora", "Girón", "Centro", "Verde", "+57 313 555 0168", "1 100 ••• 812", "Coliseo Girón · mesa 7", "2026-09-03", "Enlace del líder", "WhatsApp efectivo · hace 2 sem"),
  A("a16", "Lina Jaimes", "Marcela Díaz", "Floridablanca", "Cañaveral", "Amarillo", "+57 320 555 0102", "1 095 ••• 664", "Colegio La Salle · mesa 13", "2026-09-26", "QR", "Reprogramada · lunes 11:00"),
  A("a17", "Ricardo Ardila", "Andrés Niño", "Girón", "Poblado", "Verde", "+57 315 555 0187", "1 098 ••• 349", "I.E. Juan Pablo II · mesa 1", "2026-09-07", "Enlace del líder", "Llamada efectiva · hace 9 d"),
];

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const fecha = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${meses[m - 1]} ${y}`;
};

export const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
