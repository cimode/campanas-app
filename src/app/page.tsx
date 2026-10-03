import Link from "next/link";
import { screens } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";

const groups = [
  { title: "App móvil · líderes y amigos", kind: "mobile", note: "Flujo de entrada por QR, registro, validación y gestión de la red." },
  { title: "Plataforma web · equipo de campaña", kind: "desktop", note: "Configuración, call center, dashboard e informes." },
] as const;

export default function Hub() {
  return (
    <div style={{ minHeight: "100dvh", background: theme.bg }}>
      <header style={{ background: theme.primary, color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
        <div
          style={{ position: "absolute", right: -120, top: -140, width: 360, height: 360, borderRadius: "50%", background: theme.accent, opacity: 0.9 }}
        />
        <div className="relative mx-auto box-border max-w-6xl px-6 py-14 sm:px-10">
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
            Mockup navegable · v1
          </span>
          <h1
            style={{ margin: "10px 0 12px", fontFamily: fontCondensed, fontWeight: 800, fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 0.92, textTransform: "uppercase" }}
          >
            App de control de campañas
          </h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 17, lineHeight: 1.45, fontWeight: 500, opacity: 0.92 }}>
            Todas las pantallas del mockup, conectadas entre sí con datos de ejemplo. Empieza por el QR para recorrer el flujo
            del líder, o entra directo a la plataforma web.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/qr"
              className="press"
              style={{ display: "inline-flex", alignItems: "center", minHeight: 52, padding: "0 22px", borderRadius: 14, background: "#FFFFFF", color: theme.ink, fontWeight: 700, fontSize: 16, textDecoration: "none" }}
            >
              Recorrer flujo móvil →
            </Link>
            <Link
              href="/dashboard"
              className="press"
              style={{ display: "inline-flex", alignItems: "center", minHeight: 52, padding: "0 22px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.7)", color: "#FFFFFF", fontWeight: 700, fontSize: 16, textDecoration: "none" }}
            >
              Abrir plataforma web
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto box-border flex max-w-6xl flex-col gap-12 px-6 py-12 sm:px-10">
        {groups.map((g) => (
          <section key={g.kind} className="flex flex-col gap-4">
            <div>
              <h2 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, textTransform: "uppercase" }}>{g.title}</h2>
              <p style={{ margin: "4px 0 0", color: theme.muted, fontSize: 15 }}>{g.note}</p>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
              {screens
                .filter((s) => s.kind === g.kind)
                .map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="press"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 18px",
                      borderRadius: 16,
                      background: "#FFFFFF",
                      border: `1.5px solid ${theme.border}`,
                      color: theme.ink,
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: g.kind === "mobile" ? theme.primarySoft : "#FDE7F1",
                        color: g.kind === "mobile" ? theme.primary : theme.accent,
                        fontFamily: fontCondensed,
                        fontWeight: 800,
                        fontSize: 20,
                      }}
                    >
                      {s.n}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{s.title}</span>
                      <span style={{ fontSize: 13, color: theme.muted }}>{s.href}</span>
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
