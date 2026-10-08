// Hardcoded friend-profile data. In production this comes from the friend record and the campaign config.

export type Propuesta = {
  id: string;
  eje: string;
  titulo: string;
  resumen: string;
  detalle: string;
  imagen?: { src: string; alt: string };
};

export const AMIGO_NOMBRE_KEY = "amigo:nombre";
export const AMIGO_DEFAULT = "Carlos Rojas";
export const AMIGO_ID = "AM-68001-0427";
export const PARTIDO = "[NOMBRE DEL PARTIDO]";

export const candidato = {
  nombre: "[NOMBRE DEL CANDIDATO]",
  cargo: "Candidato a la Alcaldía de Bucaramanga · 2026",
  lema: "Bucaramanga se cuida entre todos",
};

export const propuestas: Propuesta[] = [
  {
    id: "seguridad",
    eje: "Seguridad",
    titulo: "Barrios con frentes de seguridad conectados",
    resumen: "Cámaras, alarmas comunitarias y un cuadrante de policía por comuna.",
    detalle:
      "Instalar 600 cámaras conectadas al centro de monitoreo, entregar alarmas comunitarias a las juntas de acción comunal y asignar un cuadrante fijo por comuna con rendición de cuentas mensual.",
    imagen: { src: "/propuestas/seguridad.svg", alt: "Ilustración de barrio con escudo de seguridad" },
  },
  {
    id: "movilidad",
    eje: "Movilidad",
    titulo: "Metrolínea renovado y rutas alimentadoras",
    resumen: "Buses nuevos, tarifa diferencial para estudiantes y 12 rutas alimentadoras.",
    detalle:
      "Renovar la flota de Metrolínea, crear tarifa diferencial para estudiantes y adultos mayores, y abrir 12 rutas alimentadoras hacia los barrios de ladera.",
    imagen: { src: "/propuestas/movilidad.svg", alt: "Ilustración de bus urbano en una vía" },
  },
  {
    id: "empleo",
    eje: "Empleo",
    titulo: "Primer empleo para jóvenes",
    resumen: "Incentivos a empresas que contraten jóvenes de 18 a 28 años sin experiencia.",
    detalle:
      "Descuentos en el impuesto de industria y comercio para las empresas que vinculen jóvenes sin experiencia, más formación técnica gratuita con el SENA y las universidades locales.",
  },
  {
    id: "salud",
    eje: "Salud",
    titulo: "Puestos de salud con horario extendido",
    resumen: "Atención hasta las 10 p. m. en los puestos de salud de cada comuna.",
    detalle: "Ampliar el horario de los puestos de salud de primer nivel y habilitar citas por WhatsApp para reducir filas.",
  },
];
