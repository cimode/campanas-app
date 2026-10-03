"use client";

import { useState, type CSSProperties } from "react";
import { useToast } from "@/components/Toast";
import { fontCondensed, theme } from "@/lib/theme";
import { colaInicial, estadoColor, type Contacto, type Estado, type TrazaItem } from "./data";

type Resultado = "verde" | "amarillo" | "rojo" | "gris";

const resultados: { key: Resultado; titulo: string; texto: string; bg: string; fg: string }[] = [
  { key: "verde", titulo: "Verde", texto: "Interesado · amigo efectivo", bg: "#15803D", fg: "#FFFFFF" },
  { key: "amarillo", titulo: "Amarillo", texto: "Más o menos · reprogramar", bg: "#FACC15", fg: "#0A1033" },
  { key: "rojo", titulo: "Rojo", texto: "No interesado · sale de la cola", bg: "#DC2626", fg: "#FFFFFF" },
  { key: "gris", titulo: "Gris", texto: "No efectiva · reintentar", bg: "#6B7280", fg: "#FFFFFF" },
];

const resultadoTraza: Record<Resultado, { texto: string; color: string }> = {
  verde: { texto: "Verde · interesado, amigo efectivo", color: "#15803D" },
  amarillo: { texto: "Amarillo · reprogramado", color: "#B45309" },
  rojo: { texto: "Rojo · no interesado, sale de la cola", color: "#DC2626" },
  gris: { texto: "Gris · no efectiva, reintentar", color: "#6B7280" },
};

const AGENTE = "Mariana P.";

function horaActual(offsetMin = 0) {
  const d = new Date(Date.now() + offsetMin * 60_000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.muted,
};

const infoLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.muted,
};

const condensed = (size: number): CSSProperties => ({
  fontFamily: fontCondensed,
  fontWeight: 800,
  fontSize: size,
  textTransform: "uppercase",
});

const enCola = (e: Estado) => e !== "verde";

export function Screen() {
  const toast = useToast();
  const [cola, setCola] = useState<Contacto[]>(colaInicial);
  const [activeId, setActiveId] = useState<string | null>(colaInicial[0].id);
  const [nota, setNota] = useState("");
  const [enLlamada, setEnLlamada] = useState(false);
  const [gestionados, setGestionados] = useState<string[]>([]);
  const [gestionesHoy, setGestionesHoy] = useState(23);
  const [pendientes, setPendientes] = useState(14);

  const activo = cola.find((c) => c.id === activeId) ?? null;

  function seleccionar(id: string) {
    if (id === activeId) return;
    setActiveId(id);
    setNota("");
    setEnLlamada(false);
  }

  function agregarTraza(id: string, item: TrazaItem) {
    setCola((prev) => prev.map((c) => (c.id === id ? { ...c, traza: [item, ...c.traza] } : c)));
  }

  /** Picks the next contact still to manage, after the current one (wrapping). */
  function siguienteId(lista: Contacto[], actualId: string, yaGestionados: string[]) {
    const idx = Math.max(0, Math.min(lista.length, cola.findIndex((c) => c.id === actualId)));
    const ordenados = [...lista.slice(idx), ...lista.slice(0, idx)];
    const pendiente = ordenados.find((c) => c.id !== actualId && !yaGestionados.includes(c.id) && enCola(c.estado));
    return pendiente?.id ?? null;
  }

  function avanzar(lista: Contacto[], actualId: string, yaGestionados: string[]) {
    const sig = siguienteId(lista, actualId, yaGestionados);
    setNota("");
    setEnLlamada(false);
    if (sig) {
      setActiveId(sig);
      return lista.find((c) => c.id === sig)?.nombre ?? null;
    }
    // Nothing left: stay on the current contact if it is still in the queue, else show "¡Cola al día!".
    setActiveId(lista.some((c) => c.id === actualId) ? actualId : null);
    return null;
  }

  function registrarResultado(r: Resultado) {
    if (!activo) return;
    const notaLimpia = nota.trim();
    const entrada: TrazaItem = {
      texto: notaLimpia ? `${resultadoTraza[r].texto} — “${notaLimpia}”` : resultadoTraza[r].texto,
      meta: `${AGENTE} · ${enLlamada ? "llamada" : "gestión"} · hoy ${horaActual()}`,
      color: resultadoTraza[r].color,
    };

    let nueva: Contacto[];
    if (r === "rojo") {
      nueva = cola.filter((c) => c.id !== activo.id);
    } else {
      nueva = cola.map((c) => {
        if (c.id !== activo.id) return c;
        const base = { ...c, traza: [entrada, ...c.traza] };
        if (r === "verde") return { ...base, estado: "verde" as const, tiempo: "efectivo" };
        if (r === "amarillo") return { ...base, estado: "amarillo" as const, zona: "reprogramada", tiempo: horaActual(120) };
        return { ...base, estado: "gris" as const, tiempo: "reintentar" };
      });
    }
    const yaGestionados = gestionados.includes(activo.id) ? gestionados : [...gestionados, activo.id];
    setCola(nueva);
    setGestionados(yaGestionados);
    setGestionesHoy((n) => n + 1);
    if (r === "verde" || r === "rojo") setPendientes((n) => Math.max(0, n - 1));

    const siguiente = avanzar(nueva, activo.id, yaGestionados);
    const tono = r === "verde" ? "success" : r === "rojo" ? "error" : r === "amarillo" ? "warning" : "info";
    const etiqueta = resultados.find((x) => x.key === r)?.titulo ?? r;
    toast(
      `${activo.nombre}: ${etiqueta.toLowerCase()} registrado.${siguiente ? ` Siguiente: ${siguiente}` : " ¡Cola al día!"}`,
      tono,
    );
  }

  function guardarYSiguiente() {
    if (!activo) return;
    const notaLimpia = nota.trim();
    const entrada: TrazaItem = {
      texto: notaLimpia ? `Nota: “${notaLimpia}”` : "Gestión guardada sin nota",
      meta: `${AGENTE} · nota · hoy ${horaActual()}`,
      color: theme.primary,
    };
    const nueva = cola.map((c) => (c.id === activo.id ? { ...c, traza: [entrada, ...c.traza] } : c));
    const yaGestionados = gestionados.includes(activo.id) ? gestionados : [...gestionados, activo.id];
    setCola(nueva);
    setGestionados(yaGestionados);
    setGestionesHoy((n) => n + 1);
    const siguiente = avanzar(nueva, activo.id, yaGestionados);
    toast(`Gestión guardada.${siguiente ? ` Siguiente: ${siguiente}` : " ¡Cola al día!"}`, "success");
  }

  function llamar() {
    if (!activo) return;
    if (enLlamada) {
      setEnLlamada(false);
      agregarTraza(activo.id, { texto: "Llamada finalizada", meta: `${AGENTE} · llamada · hoy ${horaActual()}`, color: theme.ink });
      toast("Llamada finalizada. Registra el resultado de la gestión.");
      return;
    }
    setEnLlamada(true);
    agregarTraza(activo.id, { texto: "Llamada saliente iniciada", meta: `${AGENTE} · llamada · hoy ${horaActual()}`, color: theme.ink });
    toast(`Llamando a ${activo.nombre} · ${activo.telefono}…`);
  }

  function whatsapp() {
    if (!activo) return;
    agregarTraza(activo.id, { texto: "Mensaje de WhatsApp enviado", meta: `${AGENTE} · WhatsApp · hoy ${horaActual()}`, color: "#25D366" });
    toast(`WhatsApp abierto con ${activo.nombre}`, "success");
  }

  function toggleVerificado(checked: boolean) {
    if (!activo) return;
    setCola((prev) =>
      prev.map((c) =>
        c.id === activo.id
          ? {
              ...c,
              verificado: checked,
              traza: checked
                ? [{ texto: "Puesto de votación verificado", meta: `${AGENTE} · gestión · hoy ${horaActual()}`, color: theme.primary }, ...c.traza]
                : c.traza,
            }
          : c,
      ),
    );
    if (checked) toast("Puesto de votación verificado con el contacto", "success");
  }

  const actionBtn: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 12,
    color: "#FFFFFF",
    border: 0,
    font: "inherit",
    fontWeight: 700,
    fontSize: 15,
  };

  return (
    <main
      className="px-4 pt-6 pb-10 sm:px-6 lg:px-10 lg:pt-9 lg:pb-12"
      style={{ minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.primary }}>
            Fase 4 · Gestión y seguimiento
          </span>
          <h1 style={{ margin: 0, ...condensed(44), lineHeight: 0.95 }}>Cola del agente</h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#FFFFFF",
            border: `1.5px solid ${theme.border}`,
            borderRadius: 12,
            padding: "8px 14px",
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: theme.ink,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            MP
          </span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Agente: {AGENTE}</span>
            <span style={{ fontSize: 12, color: theme.muted }}>
              {gestionesHoy} gestiones hoy · {pendientes} pendientes
            </span>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        {/* Cola */}
        <section
          aria-label="Cola de pendientes"
          style={{
            flex: "1 1 300px",
            minWidth: 0,
            background: "#FFFFFF",
            border: `1.5px solid ${theme.border}`,
            borderRadius: 18,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, ...condensed(24) }}>Pendientes</h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", background: "#6B7280", padding: "5px 10px", borderRadius: 999 }}>
              {pendientes} en gris
            </span>
          </div>
          <style href="cc-rowhover" precedence="default">
            {'.cc-row[aria-pressed="false"]:hover{background:#F8F9FF !important}'}
          </style>
          {cola.length === 0 && (
            <p style={{ margin: 0, fontSize: 14, color: theme.muted, padding: "12px 0" }}>No quedan contactos en la cola.</p>
          )}
          {cola.map((k) => {
            const sel = k.id === activeId;
            const hecho = k.estado === "verde";
            return (
              <button
                key={k.id}
                type="button"
                className="rowhover press cc-row"
                aria-pressed={sel}
                onClick={() => seleccionar(k.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: `1.5px solid ${sel ? theme.primary : theme.border}`,
                  // Inline white matches the mockup; the scoped .cc-row rule below restores the hover tint.
                  background: sel ? "#E6E9FF" : "#FFFFFF",
                  borderRadius: 12,
                  minHeight: 56,
                  boxSizing: "border-box",
                  textAlign: "left",
                  font: "inherit",
                  color: theme.ink,
                  opacity: hecho && !sel ? 0.6 : 1,
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: estadoColor[k.estado], flexShrink: 0 }} />
                <span style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{k.nombre}</span>
                  <span style={{ fontSize: 12, color: theme.muted }}>
                    Líder: {k.lider} · {k.zona}
                  </span>
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.muted }}>{sel && k.estado === "pendiente" ? "ahora" : k.tiempo}</span>
              </button>
            );
          })}
        </section>

        {/* Gestión */}
        <section
          aria-label="Gestión del contacto"
          style={{
            flex: "3 1 560px",
            minWidth: 0,
            background: "#FFFFFF",
            border: `1.5px solid ${theme.border}`,
            borderRadius: 18,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {!activo ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: theme.muted }}>
              <p style={{ margin: 0, ...condensed(28), color: theme.ink }}>¡Cola al día!</p>
              <p style={{ margin: "6px 0 0", fontSize: 14 }}>No hay contactos pendientes por gestionar.</p>
            </div>
          ) : (
            <div key={activo.id} className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#E6E9FF",
                      color: theme.ink,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...condensed(22),
                      textTransform: "none",
                      border: `4px solid ${estadoColor[activo.estado]}`,
                      boxSizing: "border-box",
                      flexShrink: 0,
                    }}
                  >
                    {activo.iniciales}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ ...condensed(28), lineHeight: 1 }}>{activo.nombre}</span>
                    <span style={{ fontSize: 13, color: theme.muted }}>
                      Amigo de <strong style={{ color: theme.ink }}>{activo.lider}</strong> · {activo.validado} · {activo.ciudad}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="press"
                    onClick={llamar}
                    aria-pressed={enLlamada}
                    style={{ ...actionBtn, background: enLlamada ? "#DC2626" : theme.ink }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                    {enLlamada ? "Colgar" : "Llamar"}
                  </button>
                  <button type="button" className="press" onClick={whatsapp} style={{ ...actionBtn, background: "#25D366" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "12px 14px", background: theme.bg, borderRadius: 12 }}>
                  <span style={infoLabel}>Teléfono</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{activo.telefono}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "12px 14px", background: theme.bg, borderRadius: 12 }}>
                  <span style={infoLabel}>Cédula</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{activo.cedula}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "12px 14px",
                    background: "#FFF4D6",
                    border: "1.5px solid #FACC15",
                    borderRadius: 12,
                  }}
                >
                  <span style={infoLabel}>Puesto de votación</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{activo.puesto}</span>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={activo.verificado}
                      onChange={(e) => toggleVerificado(e.target.checked)}
                      style={{ width: 20, height: 20, accentColor: theme.primary }}
                    />
                    Verificado con el contacto
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={labelStyle}>Resultado de la gestión</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", gap: 10 }}>
                  {resultados.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      className="press"
                      onClick={() => registrarResultado(r.key)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 6,
                        minHeight: 84,
                        padding: 14,
                        borderRadius: 14,
                        background: r.bg,
                        color: r.fg,
                        border: 0,
                        font: "inherit",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ ...condensed(24), lineHeight: 1 }}>{r.titulo}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{r.texto}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 14, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="nota" style={labelStyle}>
                    Nota de la gestión
                  </label>
                  <textarea
                    id="nota"
                    rows={3}
                    className="field"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Qué dijo, cuándo volver a llamar…"
                    style={{
                      padding: "12px 14px",
                      border: `1.5px solid ${theme.border}`,
                      borderRadius: 12,
                      font: "inherit",
                      fontSize: 15,
                      color: theme.ink,
                      resize: "vertical",
                    }}
                  />
                  <button
                    type="button"
                    className="press"
                    onClick={guardarYSiguiente}
                    style={{
                      alignSelf: "flex-start",
                      minHeight: 44,
                      padding: "0 18px",
                      borderRadius: 12,
                      background: theme.primary,
                      color: "#FFFFFF",
                      border: 0,
                      font: "inherit",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    Guardar gestión y pasar al siguiente
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={labelStyle}>Trazabilidad</span>
                  {activo.traza.map((t, i) => (
                    <div
                      key={`${activo.traza.length - i}-${t.texto}`}
                      className={i === 0 ? "fade-up" : undefined}
                      style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{t.texto}</span>
                        <span style={{ fontSize: 12, color: theme.muted }}>{t.meta}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
