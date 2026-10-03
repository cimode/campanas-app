"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";

const nav = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Contactos", href: routes.contactos },
  { label: "Call center", href: routes.callCenter },
  { label: "Informes", href: routes.informes },
  { label: "Configuración", href: routes.configuracion },
];

/** Sidebar from the desktop mockups (08–11). Collapses to a top bar on narrow screens. */
export function DesktopShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas lg:flex-row">
      <nav
        aria-label="Principal"
        className="box-border flex shrink-0 flex-col gap-1.5 px-4 py-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-[232px] lg:py-7"
        style={{ background: theme.ink }}
      >
        <div className="flex items-center justify-between gap-2.5 lg:block">
          <Link href="/" className="flex items-center gap-2.5 px-2.5 pt-1 text-white no-underline hover:text-white lg:pb-[22px]">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.accent, flexShrink: 0 }} />
            <div className="flex flex-col">
              <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 20, lineHeight: 1, textTransform: "uppercase" }}>
                [Candidato]
              </span>
              <span style={{ fontSize: 11, opacity: 0.7, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Control de campaña
              </span>
            </div>
          </Link>
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pt-3 lg:flex-col lg:overflow-visible lg:pt-0">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={active ? undefined : "navlink"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 44,
                  padding: "0 12px",
                  borderRadius: 10,
                  background: active ? theme.primary : "transparent",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: active ? 700 : 600,
                  fontSize: 15,
                  opacity: active ? 1 : 0.75,
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto hidden px-2.5 pt-6 lg:block">
          <Link href="/" style={{ color: "#FFFFFF", opacity: 0.6, fontSize: 13, textDecoration: "none" }}>
            ← Todas las pantallas
          </Link>
        </div>
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
