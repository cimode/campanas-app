# App de control de campañas · Mockup en vivo

Mockup navegable (Next.js 16, App Router) construido a partir de `App de control de campañas · Mockup v1.html`.
Todo está hardcodeado: no hay backend, base de datos ni servicios externos.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Pantallas

| # | Pantalla | Ruta |
|---|---|---|
| — | Índice de pantallas | `/` |
| 01 | Escanea QR | `/qr` |
| 02 | Registro de líder | `/registro` |
| 03 | Formulario de amigo | `/amigo` |
| 04 | Validación WhatsApp | `/validacion` |
| 05 | Perfil del líder | `/lider` |
| 06 | Tarjeta de wallet | `/lider/wallet` |
| 07 | Agregar amigos | `/lider/agregar` |
| 08 | Configuración del administrador | `/configuracion` |
| 09 | Call center · cola y gestión | `/call-center` |
| 10 | Dashboard del candidato | `/dashboard` |
| 11 | Informe | `/informes` |
| 12 | Contactos (nueva, mismo lenguaje visual) | `/contactos` |

Las pantallas móviles se muestran dentro de un marco de teléfono en escritorio y a pantalla completa en el celular.

## Estructura

- `src/app/(mobile)/…` — flujo móvil (líderes y amigos), envuelto en `MobileFrame`.
- `src/app/(desktop)/…` — plataforma web, envuelta en `DesktopShell` (barra lateral).
- `src/lib/theme.ts`, `src/lib/routes.ts` — tokens de diseño y mapa de rutas.
- `src/components/Toast.tsx` — feedback de acciones simuladas.
- `design/mockup/*.html` — fuentes originales extraídas del mockup, como referencia.

El preflight de Tailwind está desactivado a propósito (`globals.css`): el mockup está diseñado sobre los estilos por defecto del navegador.
