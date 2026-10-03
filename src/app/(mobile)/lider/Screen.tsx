"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { copyText, LEADER_LINK, LEADER_URL, QrMark, RowHoverStyle } from "./_components/shared";

type Amigo = { nombre: string; estado: "Efectivo" | "Reprogramar" | "Sin gestionar"; color: string; detalle: string };

const VERDE = "#15803D";
const AMBAR = "#B45309";
const GRIS = "#6B7280";

// 10 validados · 7 efectivos · 2 por reprogramar · 1 sin gestionar
const amigos: Amigo[] = [
  { nombre: "Carlos Rojas", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · hace 2 h" },
  { nombre: "Diana Suárez", estado: "Reprogramar", color: AMBAR, detalle: "No contestó · se llama mañana" },
  { nombre: "Jorge Pinzón", estado: "Sin gestionar", color: GRIS, detalle: "En cola del call center" },
  { nombre: "Paola Mantilla", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · ayer" },
  { nombre: "Andrés Becerra", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · ayer" },
  { nombre: "Luisa Fernanda Ortiz", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · hace 2 días" },
  { nombre: "Camilo Arenas", estado: "Reprogramar", color: AMBAR, detalle: "Pidió llamar después de las 6 p. m." },
  { nombre: "Sandra Villamizar", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · hace 3 días" },
  { nombre: "Hernán Duarte", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · hace 4 días" },
  { nombre: "Natalia Serrano", estado: "Efectivo", color: VERDE, detalle: "Confirmó voto · hace 5 días" },
];

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.muted,
};
const inputStyle: CSSProperties = {
  height: 48,
  padding: "0 14px",
  border: `1.5px solid ${theme.border}`,
  borderRadius: 12,
  background: "#FFFFFF",
  font: "inherit",
  fontSize: 16,
  color: theme.ink,
  boxSizing: "border-box",
  width: "100%",
};

export function Screen() {
  const toast = useToast();
  const [verTodos, setVerTodos] = useState(false);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [paso2, setPaso2] = useState(false);

  // Escape closes the Paso 2 sheet even when focus is still on the trigger outside it.
  useEffect(() => {
    if (!paso2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaso2(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paso2]);

  const [perfil, setPerfil] = useState({ comite: "", direccion: "", comuna: "Comuna 5", ocupacion: "", hojaVida: "", foto: "" });
  const [perfilGuardado, setPerfilGuardado] = useState(false);

  const visibles = verTodos ? amigos : amigos.slice(0, 3);

  async function copiar() {
    const ok = await copyText(LEADER_URL);
    toast(ok ? "Enlace copiado: " + LEADER_LINK : "No se pudo copiar el enlace", ok ? "success" : "error");
  }

  async function compartir() {
    const data = { title: "Únete a mi red", text: "Súmate a la red del candidato con mi enlace:", url: LEADER_URL };
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        toast("Enlace compartido", "success");
        return;
      } catch {
        // cancelled or unsupported — fall back to copy
      }
    }
    const ok = await copyText(`${data.text} ${LEADER_URL}`);
    toast(ok ? "Mensaje con tu enlace copiado para compartir" : "No se pudo compartir", ok ? "success" : "error");
  }

  function guardarPerfil(e: FormEvent) {
    e.preventDefault();
    setPerfilGuardado(true);
    setPaso2(false);
    toast("Perfil actualizado · Paso 2 completado", "success");
  }

  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", background: theme.bg, overflow: "hidden", position: "relative" }}>
      <RowHoverStyle />
      <div style={{ background: theme.primary, color: "#FFFFFF", padding: "56px 24px 20px 24px", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFFFFF", color: theme.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontCondensed, fontWeight: 800, fontSize: 24, border: "4px solid #15803D", boxSizing: "border-box", flexShrink: 0 }}
          >
            LR
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1, minWidth: 0 }}>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 26, lineHeight: 1, textTransform: "uppercase" }}>Laura Rincón</span>
            <span style={{ fontSize: 13, opacity: 0.9 }}>Líder · Bucaramanga · Comuna 5</span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: "#15803D", padding: "6px 10px", borderRadius: 999, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFFFFF" }} />
            Verde
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Meta 1×12</span>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 34, lineHeight: 1 }}>
              7<span style={{ fontSize: 18, opacity: 0.8 }}> / 12 efectivos</span>
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 4 }} role="img" aria-label="7 de 12 amigos efectivos">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ height: 10, borderRadius: 3, background: i < 7 ? "#4ADE80" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 12, opacity: 0.9 }}>
            <span>10 validados</span>
            <span>7 efectivos</span>
            <span>2 por reprogramar</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 24px 24px 24px", display: "flex", flexDirection: "column", gap: 12, flexGrow: 1, overflowY: "auto", minHeight: 0 }}>
        <div style={{ display: "flex", gap: 12, background: "#FFFFFF", border: `1.5px solid ${theme.border}`, borderRadius: 16, padding: 14, flexShrink: 0 }}>
          <QrMark size={76} label="QR personal del líder" style={{ flexShrink: 0, background: "#FFFFFF" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexGrow: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.muted }}>Tu enlace y QR personal</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{LEADER_LINK}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="press"
                onClick={copiar}
                style={{ flexGrow: 1, minHeight: 40, borderRadius: 10, background: theme.ink, color: "#FFFFFF", border: 0, font: "inherit", fontWeight: 700, fontSize: 14 }}
              >
                Copiar enlace
              </button>
              <button
                type="button"
                className="press"
                onClick={compartir}
                style={{ flexGrow: 1, minHeight: 40, borderRadius: 10, background: "#FFFFFF", color: theme.ink, border: `1.5px solid ${theme.ink}`, font: "inherit", fontWeight: 700, fontSize: 14 }}
              >
                Compartir
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, flexShrink: 0 }}>
          <Link
            href={routes.agregar}
            className="press"
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10, minHeight: 92, padding: 14, borderRadius: 16, background: theme.accent, color: "#FFFFFF", textDecoration: "none" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="8" r="4" />
              <path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6" />
            </svg>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 22, lineHeight: 1, textTransform: "uppercase" }}>Agregar amigos</span>
          </Link>
          <Link
            href={routes.wallet}
            className="press"
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10, minHeight: 92, padding: 14, borderRadius: 16, background: theme.ink, color: "#FFFFFF", textDecoration: "none" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20M6 15h4" />
            </svg>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 22, lineHeight: 1, textTransform: "uppercase" }}>Mi tarjeta wallet</span>
          </Link>
        </div>

        <a
          href="#paso2"
          className="press"
          onClick={(e) => {
            e.preventDefault();
            setPaso2(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 14,
            background: perfilGuardado ? "#E7F6EC" : "#FFF4D6",
            border: `1.5px solid ${perfilGuardado ? "#15803D" : "#FACC15"}`,
            color: theme.ink,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{perfilGuardado ? "Paso 2 completado · perfil al día" : "Paso 2 opcional · completa tu perfil"}</span>
            <span style={{ fontSize: 12, color: theme.muted }}>Comité, dirección, comuna, datos laborales, hoja de vida y foto</span>
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </a>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 22, textTransform: "uppercase" }}>Mis amigos</span>
            <a
              href="#todos"
              aria-expanded={verTodos}
              onClick={(e) => {
                e.preventDefault();
                setVerTodos((v) => !v);
              }}
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              {verTodos ? "Ver menos" : "Ver los 10"}
            </a>
          </div>
          {visibles.map((a, i) => {
            const open = abierto === a.nombre;
            return (
              <button
                key={a.nombre}
                type="button"
                className={i >= 3 ? "rowhover lider-row fade-up" : "rowhover lider-row"}
                aria-expanded={open}
                onClick={() => setAbierto(open ? null : a.nombre)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 4,
                  background: "#FFFFFF",
                  border: `1.5px solid ${open ? theme.primary : theme.border}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  minHeight: 52,
                  boxSizing: "border-box",
                  textAlign: "left",
                  color: theme.ink,
                  font: "inherit",
                  justifyContent: "center",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                  <span style={{ flexGrow: 1, fontWeight: 600, fontSize: 15 }}>{a.nombre}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: a.color }}>{a.estado}</span>
                </span>
                {open && (
                  <span className="fade-up" style={{ paddingLeft: 24, fontSize: 12, color: theme.muted }}>
                    {a.detalle}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {paso2 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paso2-titulo"
          onClick={() => setPaso2(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(10,16,51,0.55)", display: "flex", alignItems: "flex-end", zIndex: 20 }}
        >
          <form
            className="fade-up"
            onSubmit={guardarPerfil}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxHeight: "88%", overflowY: "auto", background: "#FFFFFF", borderRadius: "22px 22px 0 0", padding: "20px 24px 28px 24px", display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}
          >
            <div style={{ width: 44, height: 5, borderRadius: 3, background: theme.border, alignSelf: "center" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 id="paso2-titulo" style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 26, textTransform: "uppercase", lineHeight: 1 }}>
                Completa tu perfil
              </h2>
              <button type="button" aria-label="Cerrar" onClick={() => setPaso2(false)} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${theme.border}`, background: "#FFFFFF", color: theme.ink, fontSize: 18, lineHeight: 1 }}>
                ×
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: theme.muted, lineHeight: 1.4 }}>Es opcional. Puedes completarlo cuando quieras.</p>
            <Campo id="comite" label="Comité">
              <select id="comite" className="field" value={perfil.comite} onChange={(e) => setPerfil({ ...perfil, comite: e.target.value })} style={inputStyle}>
                <option value="">Selecciona un comité</option>
                <option>Juventudes</option>
                <option>Mujeres</option>
                <option>Comunal</option>
                <option>Gremios y comercio</option>
              </select>
            </Campo>
            <Campo id="direccion" label="Dirección">
              <input id="direccion" className="field" type="text" placeholder="Cra 27 # 45-12" value={perfil.direccion} onChange={(e) => setPerfil({ ...perfil, direccion: e.target.value })} style={inputStyle} />
            </Campo>
            <Campo id="comuna" label="Comuna">
              <select id="comuna" className="field" value={perfil.comuna} onChange={(e) => setPerfil({ ...perfil, comuna: e.target.value })} style={inputStyle}>
                {["Comuna 1", "Comuna 2", "Comuna 3", "Comuna 4", "Comuna 5", "Comuna 6", "Comuna 7"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Campo>
            <Campo id="ocupacion" label="Datos laborales">
              <input id="ocupacion" className="field" type="text" placeholder="Ocupación / empresa" value={perfil.ocupacion} onChange={(e) => setPerfil({ ...perfil, ocupacion: e.target.value })} style={inputStyle} />
            </Campo>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              <ArchivoBtn label="Hoja de vida" nombre={perfil.hojaVida} onPick={() => setPerfil({ ...perfil, hojaVida: "hoja-de-vida.pdf" })} />
              <ArchivoBtn label="Foto" nombre={perfil.foto} onPick={() => setPerfil({ ...perfil, foto: "foto-perfil.jpg" })} />
            </div>
            <button type="submit" className="press" style={{ minHeight: 52, borderRadius: 12, background: theme.accent, color: "#FFFFFF", border: 0, font: "inherit", fontWeight: 700, fontSize: 16, marginTop: 4 }}>
              Guardar perfil
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Campo({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ArchivoBtn({ label, nombre, onPick }: { label: string; nombre: string; onPick: () => void }) {
  return (
    <button
      type="button"
      className="press"
      onClick={onPick}
      style={{
        minHeight: 64,
        borderRadius: 12,
        border: `1.5px dashed ${nombre ? "#15803D" : "#9CA3AF"}`,
        background: nombre ? "#E7F6EC" : "#FFFFFF",
        color: theme.ink,
        font: "inherit",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 8,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 12, color: theme.muted }}>{nombre || "Subir archivo"}</span>
    </button>
  );
}
