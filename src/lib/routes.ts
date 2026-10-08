// Mapping from the mockup's *.dc.html links to app routes.
export const routes = {
  hub: "/",
  qr: "/qr", // Main.dc.html
  registro: "/registro", // RegistroLider.dc.html
  amigo: "/amigo", // FormularioAmigo.dc.html
  validacion: "/validacion", // Validacion.dc.html
  perfilAmigo: "/amigo/perfil",
  perfil: "/lider", // PerfilLider.dc.html
  wallet: "/lider/wallet", // TarjetaWallet.dc.html
  agregar: "/lider/agregar", // AgregarAmigo.dc.html
  dashboard: "/dashboard", // Dashboard.dc.html
  contactos: "/contactos", // "Contactos" nav item
  callCenter: "/call-center", // ColaAgente.dc.html
  informes: "/informes", // Informe.dc.html
  configuracion: "/configuracion", // AdminConfig.dc.html
} as const;

export const screens = [
  { n: "01", title: "Escanea QR", href: routes.qr, kind: "mobile" },
  { n: "02", title: "Registro de líder", href: routes.registro, kind: "mobile" },
  { n: "03", title: "Formulario de amigo", href: routes.amigo, kind: "mobile" },
  { n: "04", title: "Validación WhatsApp", href: routes.validacion, kind: "mobile" },
  { n: "4B", title: "Perfil del amigo", href: routes.perfilAmigo, kind: "mobile" },
  { n: "05", title: "Perfil del líder", href: routes.perfil, kind: "mobile" },
  { n: "06", title: "Tarjeta de wallet", href: routes.wallet, kind: "mobile" },
  { n: "07", title: "Agregar amigos", href: routes.agregar, kind: "mobile" },
  { n: "08", title: "Configuración del administrador", href: routes.configuracion, kind: "desktop" },
  { n: "09", title: "Call center · cola y gestión", href: routes.callCenter, kind: "desktop" },
  { n: "10", title: "Dashboard del candidato", href: routes.dashboard, kind: "desktop" },
  { n: "11", title: "Informe", href: routes.informes, kind: "desktop" },
  { n: "12", title: "Contactos", href: routes.contactos, kind: "desktop" },
] as const;
