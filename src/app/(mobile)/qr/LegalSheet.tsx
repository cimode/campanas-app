"use client";

import { useEffect } from "react";
import { theme, fontCondensed } from "@/lib/theme";

export type LegalDoc = "terminos" | "datos";

const docs: Record<LegalDoc, { title: string; body: string[] }> = {
  terminos: {
    title: "Términos de uso",
    body: [
      "Esta plataforma organiza la red de apoyo de [NOMBRE DEL CANDIDATO]. Al registrarte aceptas recibir mensajes de la campaña por WhatsApp.",
      "Cada persona se registra una sola vez: la cédula y el teléfono se verifican contra la red para evitar duplicados.",
      "Puedes solicitar la baja de tu registro en cualquier momento.",
    ],
  },
  datos: {
    title: "Política de tratamiento de datos",
    body: [
      "Tus datos se tratan conforme a la Ley 1581 de 2012 (Habeas Data) y solo se usan para fines de organización de la campaña.",
      "No compartimos tu información con terceros. Puedes conocer, actualizar o suprimir tus datos escribiendo a la campaña.",
    ],
  },
};

/** Bottom sheet that stands in for the mockup's #terminos / #datos anchor links. */
export function LegalSheet({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc, onClose]);

  if (!doc) return null;
  const d = docs[doc];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "rgba(10,16,51,0.55)",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        className="fade-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "80%",
          overflowY: "auto",
          boxSizing: "border-box",
          background: theme.white,
          borderRadius: "28px 28px 0 0",
          padding: "24px 24px 32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          color: theme.ink,
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 999, background: theme.border, alignSelf: "center" }} />
        <h2
          id="legal-title"
          style={{
            margin: 0,
            fontFamily: fontCondensed,
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {d.title}
        </h2>
        {d.body.map((p) => (
          <p key={p} style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: theme.muted }}>
            {p}
          </p>
        ))}
        <button
          type="button"
          autoFocus
          className="press"
          onClick={onClose}
          style={{
            marginTop: 8,
            minHeight: 52,
            border: "none",
            borderRadius: 14,
            background: theme.primary,
            color: theme.white,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
