"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { theme, fontCondensed } from "@/lib/theme";
import { routes } from "@/lib/routes";
import { LegalSheet, type LegalDoc } from "./LegalSheet";

const choiceBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 64,
  padding: "14px 20px",
  boxSizing: "border-box",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 18,
};

function Arrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function QrScreen() {
  const [legal, setLegal] = useState<LegalDoc | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          background: theme.primary,
          position: "relative",
        }}
      >
        <div
          style={{
            minHeight: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: -120,
              top: -80,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: theme.accent,
              opacity: 0.9,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: -90,
              top: 240,
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "28px solid #FFFFFF",
              opacity: 0.12,
              boxSizing: "border-box",
            }}
          />
          <div
            className="fade-up"
            style={{
              position: "relative",
              padding: "72px 28px 0 28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" />
                <rect x="7" y="7" width="4" height="4" />
                <rect x="13" y="7" width="4" height="4" />
                <rect x="7" y="13" width="4" height="4" />
                <path d="M13 13h4v4" />
              </svg>
              <span>QR escaneado</span>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: fontCondensed,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 0.92,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              Súmate a la red de [NOMBRE DEL CANDIDATO]
            </h1>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.4, fontWeight: 500, maxWidth: 300 }}>
              Llegaste desde el QR de <strong>[EVENTO O ZONA]</strong>. Toma menos de un minuto.
            </p>
          </div>
          <div
            style={{
              position: "relative",
              marginTop: "auto",
            }}
          >
            {/* spacer keeps a gap between hero and card when content is taller than the viewport */}
            <div style={{ height: 32 }} />
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "28px 28px 0 0",
                padding: "28px 24px 36px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontFamily: fontCondensed,
                  fontWeight: 800,
                  fontSize: 30,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: theme.ink,
                }}
              >
                ¿Vienes referido por un líder?
              </h2>
              <Link
                href={routes.amigo}
                className="press"
                style={{ ...choiceBase, background: theme.primary, color: "#FFFFFF" }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span>Sí, me invitó un líder</span>
                  <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.85 }}>Formulario corto de amigo</span>
                </span>
                <Arrow />
              </Link>
              <Link
                href={routes.registro}
                className="press rowhover"
                style={{ ...choiceBase, background: "#FFFFFF", border: `2px solid ${theme.ink}`, color: theme.ink }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span>No, quiero ser líder</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: theme.muted }}>Registro de líder · meta 1×12</span>
                </span>
                <Arrow />
              </Link>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: theme.muted,
                  textAlign: "center",
                }}
              >
                Al continuar aceptas los{" "}
                <a
                  href="#terminos"
                  onClick={(e) => {
                    e.preventDefault();
                    setLegal("terminos");
                  }}
                >
                  términos y la política de datos
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <LegalSheet doc={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
