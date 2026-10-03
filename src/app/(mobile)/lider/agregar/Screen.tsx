"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { BackIcon, copyText, LEADER_LINK, LEADER_URL, RowHoverStyle } from "../_components/shared";

const labelStyle: CSSProperties = { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: theme.muted };
const inputStyle: CSSProperties = {
  height: 48,
  padding: "0 14px",
  border: `1.5px solid ${theme.border}`,
  borderRadius: 12,
  background: "#FFFFFF",
  font: "inherit",
  fontSize: 16,
  color: theme.ink,
};

const INVITE_TEXT = "¡Hola! Súmate a nuestra red. Llena este formulario corto y valida tu número:";

export function Screen() {
  const toast = useToast();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  function porWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(`${INVITE_TEXT} ${LEADER_URL}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast("Abriendo WhatsApp con tu invitación", "success");
  }

  async function copiar() {
    const ok = await copyText(LEADER_URL);
    toast(ok ? "Enlace copiado: " + LEADER_LINK : "No se pudo copiar el enlace", ok ? "success" : "error");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    const quien = nombre.trim() || "tu amigo";
    const tel = telefono.trim();
    toast(`Código enviado a ${quien}${tel ? ` (${tel})` : ""} por WhatsApp`, "success");
    router.push(routes.validacion);
  }

  function reenviar() {
    setReenviado(true);
    toast("Código reenviado a Andrés Quintero", "success");
  }

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", background: theme.bg }}>
      <RowHoverStyle />
      <div style={{ minHeight: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", background: theme.bg, padding: "56px 24px 32px 24px", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href={routes.perfil}
            aria-label="Volver al perfil"
            className="press"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "#FFFFFF", border: `1.5px solid ${theme.border}`, color: theme.ink, textDecoration: "none" }}
          >
            <BackIcon />
          </Link>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.primary }}>Fase 3 · Multiplicación</span>
        </div>

        <h1 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 44, lineHeight: 0.95, textTransform: "uppercase" }}>Suma amigos a tu red</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          <button
            type="button"
            className="press"
            onClick={porWhatsApp}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 56, borderRadius: 14, background: "#25D366", color: "#FFFFFF", border: 0, font: "inherit", fontWeight: 700, fontSize: 15 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
            </svg>
            Por WhatsApp
          </button>
          <button
            type="button"
            className="press"
            onClick={copiar}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 56, borderRadius: 14, background: "#FFFFFF", color: theme.ink, border: `2px solid ${theme.ink}`, font: "inherit", fontWeight: 700, fontSize: 15 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
            </svg>
            Copiar enlace
          </button>
        </div>
        <p style={{ margin: "-6px 0 0 0", fontSize: 13, lineHeight: 1.4, color: theme.muted }}>Con el enlace, tu amigo llena el formulario corto y valida su número él mismo.</p>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flexGrow: 1, height: 1.5, background: theme.border }} />
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.muted }}>o agrégalo manualmente</span>
          <div style={{ flexGrow: 1, height: 1.5, background: theme.border }} />
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, background: "#FFFFFF", border: `1.5px solid ${theme.border}`, borderRadius: 16, padding: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor="nombre" style={labelStyle}>
              Nombre completo
            </label>
            <input id="nombre" className="field" type="text" autoComplete="name" placeholder="María Gómez" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor="telefono" style={labelStyle}>
              Teléfono (WhatsApp)
            </label>
            <input id="telefono" className="field" type="tel" autoComplete="tel" placeholder="+57 300 000 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor="cedula" style={labelStyle}>
              Cédula
            </label>
            <input
              id="cedula"
              className="field"
              type="text"
              inputMode="numeric"
              placeholder="1 020 304 050"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/[^\d ]/g, ""))}
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            className="press"
            disabled={enviando}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 52, borderRadius: 12, background: theme.accent, color: "#FFFFFF", border: 0, padding: 0, boxSizing: "content-box", font: "inherit", fontWeight: 700, fontSize: 16, marginTop: 4, opacity: enviando ? 0.8 : 1 }}
          >
            {enviando ? "Enviando código…" : "Agregar y enviarle el código"}
          </button>
        </form>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.muted }}>Pendientes de confirmar</span>
          <button
            type="button"
            className="rowhover lider-row"
            onClick={reenviar}
            title="Reenviar código"
            style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFFFFF", border: "1.5px dashed #9CA3AF", borderRadius: 12, padding: "10px 12px", minHeight: 52, boxSizing: "border-box", font: "inherit", color: theme.ink, textAlign: "left" }}
          >
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#9CA3AF", flexShrink: 0 }} />
            <span style={{ flexGrow: 1, fontWeight: 600, fontSize: 15 }}>Andrés Quintero</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: theme.muted }}>{reenviado ? "Código reenviado · ahora" : "Código enviado · 10 min"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
