"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { fontCondensed, theme } from "@/lib/theme";
import { routes } from "@/lib/routes";

// Hardcoded "already in the network" IDs so the duplicate-block state can be demoed.
const CEDULAS_EN_RED = ["1020304050", "79845120", "52123987"];

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.muted,
};

const labelSplitStyle: CSSProperties = { ...labelStyle, display: "flex", justifyContent: "space-between" };

const inputStyle: CSSProperties = {
  height: 48,
  padding: "0 14px",
  border: `1.5px solid ${theme.border}`,
  borderRadius: 12,
  background: theme.white,
  font: "inherit",
  fontSize: 16,
  color: theme.ink,
};

const fieldWrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

/** Groups digits by thousands like the placeholder: "1 020 304 050". */
function formatCedula(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

type Sheet = null | "terminos" | "datos";

const sheetCopy: Record<Exclude<Sheet, null>, { title: string; body: string[] }> = {
  terminos: {
    title: "Términos",
    body: [
      "Al registrarte aceptas que la campaña te contacte por WhatsApp, llamada o mensaje de texto para informarte sobre actividades y el día de la elección.",
      "Puedes pedir que te retiremos de la red en cualquier momento escribiendo a tu líder o respondiendo BAJA al mensaje de WhatsApp.",
    ],
  },
  datos: {
    title: "Política de tratamiento de datos",
    body: [
      "Tus datos se tratan conforme a la Ley 1581 de 2012 (Habeas Data). Solo se usan para la organización de la campaña y no se venden ni se comparten con terceros.",
      "Tienes derecho a conocer, actualizar, rectificar y suprimir tu información en cualquier momento.",
    ],
  },
};

export function Screen() {
  const router = useRouter();
  const toast = useToast();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [puesto, setPuesto] = useState("");
  const [terminos, setTerminos] = useState(true);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [sending, setSending] = useState(false);

  const cedulaBloqueada = CEDULAS_EN_RED.includes(cedula);

  // Escape closes the términos / datos sheet.
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheet(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (sending) return;
    if (cedulaBloqueada) {
      toast("Registro bloqueado: esta cédula ya está en la red.", "error");
      return;
    }
    if (!terminos) {
      toast("Debes aceptar los términos y la política de datos para continuar.", "warning");
      return;
    }
    setSending(true);
    toast(
      telefono.trim()
        ? `Código enviado por WhatsApp a ${telefono.trim()}`
        : "Código enviado por WhatsApp",
      "success",
    );
    setTimeout(() => router.push(routes.validacion), 450);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            background: theme.ink,
            color: theme.white,
            padding: "60px 24px 22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Link
              href={routes.qr}
              aria-label="Volver"
              className="press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.14)",
                color: theme.white,
                textDecoration: "none",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </Link>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: theme.primary,
                padding: "6px 10px",
                borderRadius: 999,
              }}
            >
              Formulario corto
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "50%",
                background: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fontCondensed,
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              LR
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>Te invita</span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>[NOMBRE DEL LÍDER] · Comuna 5</span>
            </div>
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: fontCondensed,
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            Deja tus datos y listo
          </h1>
        </div>

        <form
          id="form-amigo"
          onSubmit={submit}
          noValidate
          style={{ flexGrow: 1, padding: "20px 24px 0 24px", display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div style={fieldWrap}>
            <label htmlFor="nombre" style={labelStyle}>Nombre completo</label>
            <input
              id="nombre"
              type="text"
              autoComplete="name"
              placeholder="Carlos Rojas"
              className="field"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="carlos@correo.com"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label htmlFor="telefono" style={labelSplitStyle}>
              <span>Teléfono (WhatsApp)</span>
              <span style={{ color: theme.primary }}>Campo único</span>
            </label>
            <input
              id="telefono"
              type="tel"
              autoComplete="tel"
              placeholder="+57 300 000 0000"
              className="field"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/[^\d+\s]/g, ""))}
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label htmlFor="cedula" style={labelSplitStyle}>
              <span>Cédula</span>
              <span style={{ color: theme.primary }}>Campo único</span>
            </label>
            <input
              id="cedula"
              type="text"
              inputMode="numeric"
              placeholder="1 020 304 050"
              className="field"
              aria-invalid={cedulaBloqueada}
              aria-describedby={cedulaBloqueada ? "cedula-error" : undefined}
              value={formatCedula(cedula)}
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, "").slice(0, 12))}
              style={{ ...inputStyle, border: `1.5px solid ${cedulaBloqueada ? theme.red : theme.border}` }}
            />
            {cedulaBloqueada && (
              <p
                id="cedula-error"
                role="alert"
                className="fade-up"
                style={{
                  margin: "2px 0 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#B91C1C",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
                Registro bloqueado: esta cédula ya está en la red.
              </p>
            )}
          </div>
          <div style={fieldWrap}>
            <label htmlFor="puesto" style={labelSplitStyle}>
              <span>Puesto de votación</span>
              <span style={{ color: theme.muted, fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>Campo configurado</span>
            </label>
            <input
              id="puesto"
              type="text"
              placeholder="Colegio Santander, mesa 12"
              className="field"
              value={puesto}
              onChange={(e) => setPuesto(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingTop: 4 }}>
            <input
              id="terminos"
              type="checkbox"
              checked={terminos}
              onChange={(e) => setTerminos(e.target.checked)}
              style={{ width: 22, height: 22, margin: "2px 0 0 0", accentColor: theme.primary, font: "13.3333px Arial" }}
            />
            <label htmlFor="terminos" style={{ fontSize: 13, lineHeight: 1.4, color: theme.ink }}>
              Acepto los{" "}
              <a
                href="#terminos"
                onClick={(e) => {
                  e.preventDefault();
                  setSheet("terminos");
                }}
              >
                términos
              </a>{" "}
              y la{" "}
              <a
                href="#datos"
                onClick={(e) => {
                  e.preventDefault();
                  setSheet("datos");
                }}
              >
                política de tratamiento de datos
              </a>
              .
            </label>
          </div>
        </form>
      </div>

      <div style={{ padding: "12px 24px 32px 24px", background: theme.bg, flexShrink: 0 }}>
        <button
          type="submit"
          form="form-amigo"
          className="press"
          disabled={sending}
          style={{
            width: "100%",
            boxSizing: "content-box",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            minHeight: 56,
            border: "none",
            borderRadius: 14,
            background: theme.accent,
            color: theme.white,
            fontWeight: 700,
            fontSize: 18,
            opacity: sending ? 0.85 : 1,
          }}
        >
          {sending ? "Enviando…" : "Enviar y validar por WhatsApp"}
        </button>
      </div>

      {sheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          onClick={() => setSheet(null)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,16,51,0.45)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 20,
          }}
        >
          <div
            className="fade-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              background: theme.white,
              borderRadius: "24px 24px 0 0",
              padding: "20px 24px 32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              boxSizing: "border-box",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 999, background: theme.border, alignSelf: "center" }} />
            <h2
              id="sheet-title"
              style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, lineHeight: 1, textTransform: "uppercase" }}
            >
              {sheetCopy[sheet].title}
            </h2>
            {sheetCopy[sheet].body.map((p) => (
              <p key={p} style={{ margin: 0, fontSize: 15, lineHeight: 1.45, color: theme.muted }}>
                {p}
              </p>
            ))}
            <button
              type="button"
              className="press"
              onClick={() => {
                setTerminos(true);
                setSheet(null);
              }}
              style={{
                marginTop: 4,
                minHeight: 52,
                border: "none",
                borderRadius: 14,
                background: theme.primary,
                color: theme.white,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Entendido, acepto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
