"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { estados, estadoStyle, fecha, iniciales, type Contacto, type Estado } from "./data";
import { eyebrowSmall, infoLabel, pill } from "./styles";

export type Traza = { texto: string; meta: string; color: string };

type Props = {
  contacto: Contacto;
  todos: Contacto[];
  notas: Traza[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onEstado: (e: Estado) => void;
  onNota: (texto: string) => void;
};

const infoBox: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "12px 14px",
  background: "#F4F5FB",
  borderRadius: 12,
  minWidth: 0,
};

const actionBtn = (bg: string): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 12,
  background: bg,
  color: "#FFFFFF",
  border: 0,
  font: "inherit",
  fontWeight: 700,
  fontSize: 15,
  flex: "1 1 0",
});

export function ContactDrawer({ contacto: c, todos, notas, onClose, onSelect, onEstado, onNota }: Props) {
  const toast = useToast();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [nota, setNota] = useState("");
  const st = estadoStyle[c.estado];
  const amigos = c.tipo === "Líder" ? todos.filter((a) => a.lider === c.nombre) : [];
  const lider = c.lider ? todos.find((l) => l.nombre === c.lider) : undefined;

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      if (opener && opener.isConnected && !opener.closest("[role=dialog]")) opener.focus();
    };
  }, [onClose]);

  const traza: Traza[] = [
    ...notas,
    { texto: c.ultimaGestion, meta: "Última gestión registrada", color: st.bg },
    {
      texto: c.tipo === "Líder" ? "Registrado como líder por QR" : `Registrado por ${c.origen === "QR" ? "QR" : c.origen === "Formulario web" ? "formulario web" : "enlace del líder"}`,
      meta: `${c.lider ?? "Sistema"} · ${fecha(c.registro)}`,
      color: "#6B7280",
    },
  ];

  const efe = c.meta?.efe ?? 0;
  const metaPct = Math.min(100, Math.round((efe / 12) * 100));

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${what} copiado`, "success");
    } catch {
      toast(`No se pudo copiar el ${what.toLowerCase()}`, "error");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", justifyContent: "flex-end" }}>
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(10,16,51,0.45)" }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="contacto-nombre"
        className="fade-up"
        style={{
          position: "relative",
          width: "min(460px, 100vw)",
          height: "100%",
          background: "#FFFFFF",
          boxShadow: "-12px 0 40px rgba(10,16,51,0.25)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <span
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: c.tipo === "Líder" ? "#0A1033" : "#E6E9FF",
                  color: c.tipo === "Líder" ? "#FFFFFF" : "#0A1033",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fontCondensed,
                  fontWeight: 800,
                  fontSize: 22,
                  border: `4px solid ${st.bg}`,
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {iniciales(c.nombre)}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <span
                  id="contacto-nombre"
                  style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, lineHeight: 1, textTransform: "uppercase" }}
                >
                  {c.nombre}
                </span>
                <span style={{ fontSize: 13, color: "#5B6180" }}>
                  {c.tipo === "Amigo" ? (
                    <>
                      Amigo de <strong style={{ color: "#0A1033" }}>{c.lider}</strong> · {c.municipio}
                    </>
                  ) : (
                    <>
                      Líder · {c.municipio} · {c.zona}
                    </>
                  )}
                </span>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle"
              className="press"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "1.5px solid #D8DBEA",
                background: "#FFFFFF",
                color: "#0A1033",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={pill(c.tipo === "Líder" ? "#0A1033" : "#E6E9FF", c.tipo === "Líder" ? "#FFFFFF" : theme.primary)}>{c.tipo}</span>
            <span style={pill(st.bg, st.fg)}>{c.estado}</span>
            <span style={pill("#F4F5FB", "#5B6180")}>{c.origen}</span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="press" style={actionBtn("#0A1033")} onClick={() => toast(`Llamando a ${c.nombre}…`)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
              </svg>
              Llamar
            </button>
            <button
              type="button"
              className="press"
              style={actionBtn("#25D366")}
              onClick={() => toast(`WhatsApp enviado a ${c.nombre}`, "success")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
              </svg>
              WhatsApp
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 10 }}>
            <div style={infoBox}>
              <span style={infoLabel}>Teléfono</span>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{c.telefono}</span>
                <button
                  type="button"
                  aria-label="Copiar teléfono"
                  onClick={() => copy(c.telefono, "Teléfono")}
                  style={{ background: "transparent", border: 0, padding: 4, color: theme.primary, display: "flex" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                </button>
              </span>
            </div>
            <div style={infoBox}>
              <span style={infoLabel}>Cédula</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{c.cedula}</span>
            </div>
            <div style={{ ...infoBox, gridColumn: "1 / -1" }}>
              <span style={infoLabel}>Puesto de votación</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{c.puesto}</span>
            </div>
            <div style={infoBox}>
              <span style={infoLabel}>Registro</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{fecha(c.registro)}</span>
            </div>
            <div style={infoBox}>
              <span style={infoLabel}>Zona</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                {c.municipio} · {c.zona}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={eyebrowSmall}>Estado del contacto</span>
            <div role="radiogroup" aria-label="Estado del contacto" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
              {estados.map((e) => {
                const on = c.estado === e;
                const s = estadoStyle[e];
                return (
                  <button
                    key={e}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className="press"
                    onClick={() => onEstado(e)}
                    style={{
                      minHeight: 44,
                      borderRadius: 10,
                      background: on ? s.bg : "#FFFFFF",
                      color: on ? s.fg : "#0A1033",
                      border: `1.5px solid ${on ? s.bg : "#D8DBEA"}`,
                      font: "inherit",
                      fontFamily: fontCondensed,
                      fontWeight: 800,
                      fontSize: 17,
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {!on && <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.bg }} />}
                    {e}
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: 13, color: "#5B6180" }}>{st.label}</span>
          </div>

          {c.tipo === "Líder" && c.meta && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6, borderTop: "1.5px solid #D8DBEA" }}>
              <span style={eyebrowSmall}>Meta 1×12</span>
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  [c.meta.ref, "Referidos"],
                  [c.meta.val, "Validados"],
                  [c.meta.efe, "Efectivos"],
                ].map(([n, l]) => (
                  <span key={l} style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{n}</span>
                    <span style={{ fontSize: 12, color: "#5B6180" }}>{l}</span>
                  </span>
                ))}
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, height: 8, borderRadius: 4, background: "#E6E9FF", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${metaPct}%`, background: metaPct >= 100 ? "#15803D" : "#0A1033" }} />
                </span>
                <span style={{ fontSize: 12, color: "#5B6180" }}>{metaPct} %</span>
              </span>
            </div>
          )}

          {c.tipo === "Líder" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={eyebrowSmall}>Sus amigos en la lista · {amigos.length}</span>
              {amigos.length === 0 && <span style={{ fontSize: 14, color: "#5B6180" }}>Aún no hay amigos de este líder en la lista.</span>}
              {amigos.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="rowhover"
                  onClick={() => onSelect(a.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "1.5px solid #D8DBEA",
                    borderRadius: 12,
                    minHeight: 52,
                    font: "inherit",
                    color: "#0A1033",
                    textAlign: "left",
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: estadoStyle[a.estado].bg, flexShrink: 0 }} />
                  <span style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{a.nombre}</span>
                    <span style={{ fontSize: 12, color: "#5B6180" }}>{a.ultimaGestion}</span>
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#5B6180" }}>{a.estado}</span>
                </button>
              ))}
            </div>
          )}

          {lider && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={eyebrowSmall}>Líder que lo registró</span>
              <button
                type="button"
                className="rowhover"
                onClick={() => onSelect(lider.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: "1.5px solid #D8DBEA",
                  borderRadius: 12,
                  minHeight: 52,
                  font: "inherit",
                  color: "#0A1033",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#0A1033",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {iniciales(lider.nombre)}
                </span>
                <span style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{lider.nombre}</span>
                  <span style={{ fontSize: 12, color: "#5B6180" }}>
                    {lider.municipio} · {lider.zona} · {lider.meta?.efe ?? 0}/12 efectivos
                  </span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B6180" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="nota-contacto" style={eyebrowSmall}>
              Nota
            </label>
            <textarea
              id="nota-contacto"
              rows={3}
              className="field"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Qué dijo, cuándo volver a llamar…"
              style={{
                padding: "12px 14px",
                border: "1.5px solid #D8DBEA",
                borderRadius: 12,
                font: "inherit",
                fontSize: 15,
                color: "#0A1033",
                resize: "vertical",
              }}
            />
            <button
              type="button"
              className="press"
              onClick={() => {
                if (!nota.trim()) {
                  toast("Escribe una nota antes de guardar", "warning");
                  return;
                }
                onNota(nota.trim());
                setNota("");
              }}
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
              Guardar nota
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={eyebrowSmall}>Trazabilidad</span>
            {traza.map((t, i) => (
              <div
                key={`${t.texto}-${i}`}
                style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #D8DBEA" }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, marginTop: 5, flexShrink: 0 }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{t.texto}</span>
                  <span style={{ fontSize: 12, color: "#5B6180" }}>{t.meta}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1.5px solid #D8DBEA", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href={routes.callCenter}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "1 1 auto",
              minHeight: 48,
              padding: "0 20px",
              borderRadius: 12,
              background: theme.accent,
              color: "#FFFFFF",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Abrir en call center
          </Link>
        </div>
      </aside>
    </div>
  );
}
