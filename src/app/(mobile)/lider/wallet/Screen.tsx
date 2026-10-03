"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { BackIcon, copyText, LEADER_LINK, LEADER_URL, QrMark } from "../_components/shared";

type WalletKind = "apple" | "google";

const statBox: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  background: "rgba(10,16,51,0.28)",
  borderRadius: 12,
  padding: "10px 12px",
};
const statNum: CSSProperties = { fontFamily: fontCondensed, fontWeight: 800, fontSize: 32, lineHeight: 1 };
const statLabel: CSSProperties = { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.9 };

const notificaciones = [
  { texto: "Carlos Rojas pasó a Verde", cuando: "hace 2 h" },
  { texto: "Diana Suárez quedó para reprogramar", cuando: "ayer" },
  { texto: "Paola Mantilla pasó a Verde", cuando: "ayer" },
];

function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18M8 14h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

export function Screen() {
  const toast = useToast();
  const [added, setAdded] = useState<Record<WalletKind, boolean>>({ apple: false, google: false });
  const [loading, setLoading] = useState<WalletKind | null>(null);
  const [verHistorial, setVerHistorial] = useState(false);

  function addToWallet(kind: WalletKind) {
    const name = kind === "apple" ? "Apple Wallet" : "Google Wallet";
    if (added[kind]) {
      toast(`Tu tarjeta ya está en ${name}`, "info");
      return;
    }
    setLoading(kind);
    setTimeout(() => {
      setLoading(null);
      setAdded((prev) => ({ ...prev, [kind]: true }));
      toast(`Tarjeta añadida a ${name}`, "success");
    }, 700);
  }

  async function copiarQr() {
    const ok = await copyText(LEADER_URL);
    toast(ok ? "Enlace copiado: " + LEADER_LINK : "No se pudo copiar el enlace", ok ? "success" : "error");
  }

  const walletBtn = (kind: WalletKind): CSSProperties => {
    const done = added[kind];
    const base: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      minHeight: 56,
      borderRadius: 14,
      font: "inherit",
      fontWeight: 700,
      fontSize: 17,
      opacity: loading === kind ? 0.7 : 1,
    };
    if (done) return { ...base, background: "#15803D", color: "#FFFFFF", border: "2px solid #15803D" };
    return kind === "apple"
      ? { ...base, background: "#FFFFFF", color: theme.ink, border: 0 }
      : { ...base, background: "transparent", color: "#FFFFFF", border: "2px solid #FFFFFF" };
  };

  const label = (kind: WalletKind) => {
    const name = kind === "apple" ? "Apple Wallet" : "Google Wallet";
    if (loading === kind) return "Añadiendo…";
    return added[kind] ? `En ${name}` : `Añadir a ${name}`;
  };

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", background: theme.ink }}>
      <div style={{ minHeight: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", background: theme.ink, padding: "56px 24px 32px 24px", gap: 20, color: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href={routes.perfil}
            aria-label="Volver al perfil"
            className="press"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "#FFFFFF", textDecoration: "none" }}
          >
            <BackIcon />
          </Link>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>Se actualiza sola</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 40, lineHeight: 0.95, textTransform: "uppercase" }}>Tu tarjeta de líder</h1>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, opacity: 0.8 }}>Cada gestión del call center recalcula tu color y tu avance, y te llega una notificación.</p>
        </div>

        <div className="fade-up" style={{ borderRadius: 22, background: theme.primary, padding: 20, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 24px 48px rgba(0,0,0,0.45)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ position: "absolute", right: -60, bottom: -80, width: 220, height: 220, borderRadius: "50%", background: theme.accent, opacity: 0.85 }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.85 }}>[NOMBRE DEL CANDIDATO] · 2026</span>
              <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 30, lineHeight: 1, textTransform: "uppercase" }}>Laura Rincón</span>
              <span style={{ fontSize: 13, opacity: 0.9 }}>Líder · Comuna 5 · Bucaramanga</span>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: "#15803D", padding: "7px 10px", borderRadius: 999, flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFFFFF" }} />
              Verde
            </span>
          </div>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            <div style={statBox}>
              <span style={statNum}>10</span>
              <span style={statLabel}>Validados</span>
            </div>
            <div style={statBox}>
              <span style={statNum}>7</span>
              <span style={statLabel}>Efectivos</span>
            </div>
            <div style={statBox}>
              <span style={statNum}>
                58<span style={{ fontSize: 16 }}>%</span>
              </span>
              <span style={statLabel}>Meta 1×12</span>
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexGrow: 1 }}>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(10,16,51,0.3)", overflow: "hidden" }} role="progressbar" aria-valuenow={58} aria-valuemin={0} aria-valuemax={100} aria-label="Avance meta 1×12">
                <div style={{ width: "58%", height: "100%", background: "#FFFFFF", borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, opacity: 0.9 }}>Faltan 5 amigos efectivos</span>
            </div>
            <button
              type="button"
              onClick={copiarQr}
              title="Copiar enlace del QR"
              className="press"
              style={{ padding: 0, border: 0, background: "transparent", lineHeight: 0, flexShrink: 0, borderRadius: 10 }}
            >
              <QrMark size={84} label="QR del líder" style={{ background: "#FFFFFF", borderRadius: 10, padding: 6, boxSizing: "border-box" }} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(["apple", "google"] as const).map((kind) => (
            <button key={kind} type="button" className="press" disabled={loading !== null} onClick={() => addToWallet(kind)} style={walletBtn(kind)}>
              {added[kind] ? <CheckIcon /> : <CardIcon />}
              {label(kind)}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-expanded={verHistorial}
          onClick={() => setVerHistorial((v) => !v)}
          className="press"
          style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 14px", border: 0, color: "#FFFFFF", font: "inherit", textAlign: "left" }}
        >
          {(verHistorial ? notificaciones : notificaciones.slice(0, 1)).map((n, i) => (
            <span key={n.texto} className={i > 0 ? "fade-up" : undefined} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, opacity: i === 0 ? 1 : 0.6 }}>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21a2 2 0 0 0 4 0" />
              </svg>
              <span style={{ margin: 0, fontSize: 13, lineHeight: 1.4, opacity: 0.9 }}>
                {i === 0 && <><strong>Última notificación:</strong>{" "}</>}
                {n.texto} · {n.cuando}
              </span>
            </span>
          ))}
        </button>
      </div>
    </div>
  );
}
