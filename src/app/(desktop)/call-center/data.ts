// Hardcoded queue for the call-center mockup (screen 09).

export type Estado = "pendiente" | "reprogramada" | "verde" | "amarillo" | "gris";

export type TrazaItem = { texto: string; meta: string; color: string };

export type Contacto = {
  id: string;
  nombre: string;
  iniciales: string;
  lider: string;
  zona: string;
  tiempo: string;
  estado: Estado;
  validado: string;
  ciudad: string;
  telefono: string;
  cedula: string;
  puesto: string;
  verificado: boolean;
  traza: TrazaItem[];
};

export const estadoColor: Record<Estado, string> = {
  pendiente: "#6B7280",
  gris: "#6B7280",
  reprogramada: "#B45309",
  amarillo: "#B45309",
  verde: "#15803D",
};

export const colaInicial: Contacto[] = [
  {
    id: "jorge",
    nombre: "Jorge Pinzón",
    iniciales: "JP",
    lider: "Laura Rincón",
    zona: "Comuna 5",
    tiempo: "ahora",
    estado: "pendiente",
    validado: "validado hace 1 día",
    ciudad: "Bucaramanga",
    telefono: "+57 301 555 0199",
    cedula: "1 098 ••• 221",
    puesto: "Colegio Santander · mesa 12",
    verificado: false,
    traza: [
      { texto: "Mensaje de validación confirmado", meta: "Sistema · WhatsApp · ayer 18:04", color: "#1B3DE6" },
      { texto: "Registrado por enlace del líder", meta: "Laura Rincón · enlace · ayer 17:51", color: "#6B7280" },
    ],
  },
  {
    id: "diana",
    nombre: "Diana Suárez",
    iniciales: "DS",
    lider: "Laura Rincón",
    zona: "reprogramada",
    tiempo: "14:30",
    estado: "reprogramada",
    validado: "validada hace 3 días",
    ciudad: "Bucaramanga",
    telefono: "+57 315 555 0142",
    cedula: "63 512 ••• 908",
    puesto: "Escuela Normal Superior · mesa 4",
    verificado: true,
    traza: [
      { texto: "Amarillo · pidió que la llamaran después de las 2 p. m.", meta: "Mariana P. · llamada · hoy 09:12", color: "#B45309" },
      { texto: "Mensaje de validación confirmado", meta: "Sistema · WhatsApp · lun 11:20", color: "#1B3DE6" },
      { texto: "Registrado por enlace del líder", meta: "Laura Rincón · enlace · lun 11:02", color: "#6B7280" },
    ],
  },
  {
    id: "andres",
    nombre: "Andrés Quintero",
    iniciales: "AQ",
    lider: "Pedro Mora",
    zona: "Girón",
    tiempo: "1 d",
    estado: "pendiente",
    validado: "validado hace 1 día",
    ciudad: "Girón",
    telefono: "+57 310 555 0187",
    cedula: "1 095 ••• 763",
    puesto: "I. E. Francisco Serrano · mesa 7",
    verificado: false,
    traza: [
      { texto: "Mensaje de validación confirmado", meta: "Sistema · WhatsApp · ayer 10:47", color: "#1B3DE6" },
      { texto: "Registrado por QR del evento", meta: "Pedro Mora · QR · ayer 10:31", color: "#6B7280" },
    ],
  },
  {
    id: "sofia",
    nombre: "Sofía Herrera",
    iniciales: "SH",
    lider: "Pedro Mora",
    zona: "Girón",
    tiempo: "1 d",
    estado: "pendiente",
    validado: "validada hace 1 día",
    ciudad: "Girón",
    telefono: "+57 318 555 0126",
    cedula: "1 102 ••• 054",
    puesto: "Colegio Santa Cruz · mesa 3",
    verificado: false,
    traza: [
      { texto: "Mensaje de validación confirmado", meta: "Sistema · WhatsApp · ayer 10:55", color: "#1B3DE6" },
      { texto: "Registrado por QR del evento", meta: "Pedro Mora · QR · ayer 10:33", color: "#6B7280" },
    ],
  },
  {
    id: "camilo",
    nombre: "Camilo Ortiz",
    iniciales: "CO",
    lider: "Nelly Ruiz",
    zona: "Comuna 12",
    tiempo: "2 d",
    estado: "pendiente",
    validado: "validado hace 2 días",
    ciudad: "Bucaramanga",
    telefono: "+57 300 555 0173",
    cedula: "1 098 ••• 610",
    puesto: "UIS · Bloque Camilo Torres · mesa 21",
    verificado: false,
    traza: [
      { texto: "Gris · no contestó", meta: "Andrés L. · llamada · ayer 16:20", color: "#6B7280" },
      { texto: "Mensaje de validación confirmado", meta: "Sistema · WhatsApp · mar 19:08", color: "#1B3DE6" },
      { texto: "Registrado por enlace del líder", meta: "Nelly Ruiz · enlace · mar 18:44", color: "#6B7280" },
    ],
  },
];
