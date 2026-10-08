"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { QrMark } from "../../lider/_components/shared";
import { AMIGO_DEFAULT, AMIGO_ID, AMIGO_NOMBRE_KEY, candidato, PARTIDO, propuestas } from "./data";

type WalletKind = "apple" | "google";

const eyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.muted,
};

const tile: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 10,
  minHeight: 92,
  padding: 14,
  borderRadius: 16,
  border: 0,
  color: "#FFFFFF",
  font: "inherit",
  textAlign: "left",
};

const tileLabel: CSSProperties = { fontFamily: fontCondensed, fontWeight: 800, fontSize: 22, lineHeight: 1, textTransform: "uppercase" };

// The name typed in the friend form survives the WhatsApp step through sessionStorage.
const subscribe = () => () => {};
function readNombre() {
  try {
    return sessionStorage.getItem(AMIGO_NOMBRE_KEY)?.trim() || AMIGO_DEFAULT;
  } catch {
    return AMIGO_DEFAULT;
  }
}

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Screen() {
  const toast = useToast();
  const nombre = useSyncExternalStore(subscribe, readNombre, () => AMIGO_DEFAULT);
  const [walletOpen, setWalletOpen] = useState(false);
  const [added, setAdded] = useState<Record<WalletKind, boolean>>({ apple: false, google: false });
  const [loading, setLoading] = useState<WalletKind | null>(null);
  const [abierta, setAbierta] = useState<string | null>(null);
  const propuestasRef = useRef<HTMLDivElement>(null);

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
      setWalletOpen(false);
      toast(`Tarjeta de amigo añadida a ${name}`, "success");
    }, 700);
  }

  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", background: theme.bg, overflow: "hidden", position: "relative" }}>
      <div style={{ background: theme.primary, color: "#FFFFFF", padding: "56px 24px 20px 24px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -70, top: -90, width: 220, height: 220, borderRadius: "50%", background: theme.accent, opacity: 0.85 }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFFFFF", color: theme.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontCondensed, fontWeight: 800, fontSize: 24, flexShrink: 0 }}
          >
            {iniciales(nombre)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, lineHeight: 1, textTransform: "uppercase", overflowWrap: "anywhere" }}>{nombre}</h1>
            <span style={{ fontSize: 13, opacity: 0.9 }}>
              Militante de <strong>{PARTIDO}</strong>
            </span>
          </div>
        </div>
        <Link
          href={routes.registro}
          className="press"
          style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, borderRadius: 12, background: "#FFFFFF", color: theme.ink, textDecoration: "none", fontWeight: 700, fontSize: 16 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l3 6 6.5 1-4.7 4.6 1.1 6.4L12 17l-5.9 3 1.1-6.4L2.5 9 9 8z" />
          </svg>
          Convertirse en líder
        </Link>
      </div>

      <div style={{ padding: "16px 24px 28px 24px", display: "flex", flexDirection: "column", gap: 14, flexGrow: 1, overflowY: "auto", minHeight: 0 }}>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", border: `1.5px solid ${theme.border}`, borderRadius: 16, padding: 14, flexShrink: 0 }}>
          <QrMark size={104} label={`QR de identificación de ${nombre}`} style={{ flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
            <span style={eyebrow}>Tu QR de amigo</span>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 22, lineHeight: 1, letterSpacing: "0.04em" }}>{AMIGO_ID}</span>
            <span style={{ fontSize: 13, lineHeight: 1.35, color: theme.muted }}>Muéstralo en eventos y el día de elecciones para identificarte.</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, flexShrink: 0 }}>
          <button
            type="button"
            className="press"
            onClick={() => propuestasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            style={{ ...tile, background: theme.accent }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16v12H8l-4 4z" />
              <path d="M8 9h8M8 12h5" />
            </svg>
            <span style={tileLabel}>Propuestas</span>
          </button>
          <button
            type="button"
            className="press"
            aria-haspopup="dialog"
            onClick={() => setWalletOpen(true)}
            style={{ ...tile, background: added.apple || added.google ? theme.green : theme.ink }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20M6 15h4" />
            </svg>
            <span style={tileLabel}>{added.apple || added.google ? "En tu wallet" : "Tarjeta wallet"}</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0 4px", borderTop: `1.5px solid ${theme.border}`, flexShrink: 0 }}>
          <div
            aria-hidden="true"
            style={{ width: 64, height: 64, borderRadius: 16, background: theme.ink, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontCondensed, fontWeight: 800, fontSize: 26, flexShrink: 0 }}
          >
            NC
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
            <span style={eyebrow}>Tu candidato</span>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 24, lineHeight: 1, textTransform: "uppercase" }}>{candidato.nombre}</span>
            <span style={{ fontSize: 13, color: theme.muted }}>{candidato.cargo}</span>
          </div>
        </div>

        <div ref={propuestasRef} style={{ display: "flex", flexDirection: "column", gap: 10, scrollMarginTop: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 22, textTransform: "uppercase" }}>Propuestas</span>
          {propuestas.map((p) => {
            const open = abierta === p.id;
            return (
              <article key={p.id} style={{ background: "#FFFFFF", border: `1.5px solid ${open ? theme.primary : theme.border}`, borderRadius: 16, overflow: "hidden" }}>
                {p.imagen && (
                  // Plain <img>: proposal images come from the campaign CMS with arbitrary sizes.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imagen.src} alt={p.imagen.alt} style={{ display: "block", width: "100%", aspectRatio: "2 / 1", objectFit: "cover" }} />
                )}
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setAbierta(open ? null : p.id)}
                  style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", padding: "12px 14px", border: 0, background: "transparent", color: theme.ink, font: "inherit", textAlign: "left" }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.accent }}>{p.eje}</span>
                  <span style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.25 }}>{p.titulo}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.4, color: theme.muted }}>{open ? p.detalle : p.resumen}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.primary }}>{open ? "Ver menos" : "Leer propuesta"}</span>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {walletOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wallet-titulo"
          onClick={() => loading === null && setWalletOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && loading === null && setWalletOpen(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(10,16,51,0.55)", display: "flex", alignItems: "flex-end", zIndex: 20 }}
        >
          <div
            className="fade-up"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: "#FFFFFF", borderRadius: "22px 22px 0 0", padding: "20px 24px 28px 24px", display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}
          >
            <div style={{ width: 44, height: 5, borderRadius: 3, background: theme.border, alignSelf: "center" }} />
            <h2 id="wallet-titulo" style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 26, textTransform: "uppercase", lineHeight: 1 }}>
              Guarda tu tarjeta
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: theme.muted, lineHeight: 1.4 }}>Lleva tu QR de amigo en el celular, sin abrir la app.</p>
            {(["apple", "google"] as const).map((kind) => {
              const name = kind === "apple" ? "Apple Wallet" : "Google Wallet";
              return (
                <button
                  key={kind}
                  type="button"
                  className="press"
                  autoFocus={kind === "apple"}
                  disabled={loading !== null}
                  onClick={() => addToWallet(kind)}
                  style={{
                    minHeight: 52,
                    borderRadius: 12,
                    font: "inherit",
                    fontWeight: 700,
                    fontSize: 16,
                    opacity: loading === kind ? 0.7 : 1,
                    ...(added[kind]
                      ? { background: theme.green, color: "#FFFFFF", border: `2px solid ${theme.green}` }
                      : kind === "apple"
                        ? { background: theme.ink, color: "#FFFFFF", border: 0 }
                        : { background: "#FFFFFF", color: theme.ink, border: `2px solid ${theme.ink}` }),
                  }}
                >
                  {loading === kind ? "Añadiendo…" : added[kind] ? `En ${name}` : `Añadir a ${name}`}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
