"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import { theme, fontCondensed } from "@/lib/theme";
import { routes } from "@/lib/routes";
import { useToast } from "@/components/Toast";
import { LegalSheet, type LegalDoc } from "../qr/LegalSheet";

const municipiosPorDepartamento: Record<string, string[]> = {
  Santander: ["Bucaramanga", "Girón", "Floridablanca", "Piedecuesta"],
  Antioquia: ["Medellín", "Envigado", "Bello", "Itagüí"],
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.muted,
};

const uniqueLabelStyle: CSSProperties = { ...labelStyle, display: "flex", justifyContent: "space-between" };

const fieldStyle: CSSProperties = {
  height: 48,
  padding: "0 14px",
  border: `1.5px solid ${theme.border}`,
  borderRadius: 12,
  background: "#FFFFFF",
  font: "inherit",
  fontSize: 16,
  color: theme.ink,
  minWidth: 0,
};

/** Selects are border-box by UA default; stretch them across their grid cell. */
const selectStyle: CSSProperties = { ...fieldStyle, width: "100%", boxSizing: "border-box" };

const col: CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const grid2: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 };

/** Groups digits like the mockup placeholder: "1 020 304 050". */
function formatCedula(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  const head = digits.length % 3 || 3;
  const groups = [digits.slice(0, head)];
  for (let i = head; i < digits.length; i += 3) groups.push(digits.slice(i, i + 3));
  return groups.join(" ");
}

function UniqueTag({ ok }: { ok: boolean }) {
  return <span style={{ color: ok ? theme.green : theme.primary }}>{ok ? "Único · disponible" : "Campo único"}</span>;
}

export function RegistroScreen() {
  const router = useRouter();
  const toast = useToast();
  const termsRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("Santander");
  const [municipio, setMunicipio] = useState("Bucaramanga");
  const [clave, setClave] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [legal, setLegal] = useState<LegalDoc | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cedulaOk = cedula.replace(/\D/g, "").length >= 6;
  const telefonoOk = telefono.replace(/\D/g, "").length >= 10;
  const claveCorta = clave.length > 0 && clave.length < 8;

  function onDepartamento(value: string) {
    setDepartamento(value);
    setMunicipio(municipiosPorDepartamento[value][0]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!terminos) {
      setTermsError(true);
      termsRef.current?.focus();
      toast("Debes aceptar los términos y la política de datos para crear el registro.", "warning");
      return;
    }
    if (claveCorta) {
      toast("La clave de acceso debe tener mínimo 8 caracteres.", "warning");
      return;
    }
    setSubmitting(true);
    const quien = nombre.trim() ? `, ${nombre.trim()}` : "";
    toast(`Registro creado${quien}. Te enviamos un código por WhatsApp.`, "success");
    router.push(routes.validacion);
  }

  const openLegal = (doc: LegalDoc) => (e: MouseEvent) => {
    e.preventDefault();
    setLegal(doc);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        overflow: "hidden",
        color: theme.ink,
      }}
    >
      <div
        style={{
          background: theme.primary,
          color: "#FFFFFF",
          padding: "60px 24px 22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flexShrink: 0,
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
              background: "rgba(255,255,255,0.16)",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
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
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </Link>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: theme.accent,
              padding: "6px 10px",
              borderRadius: 999,
            }}
          >
            Paso 1 de 2
          </span>
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
          Regístrate como líder
        </h1>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, opacity: 0.9 }}>
          Los datos marcados como únicos se verifican contra la red para evitar duplicados.
        </p>
      </div>

      <form
        id="registro-lider"
        onSubmit={onSubmit}
        noValidate
        className="fade-up"
        style={{
          flexGrow: 1,
          minHeight: 0,
          padding: "20px 24px 12px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
        }}
      >
        <div style={grid2}>
          <div style={col}>
            <label htmlFor="nombre" style={labelStyle}>
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Ana"
              autoComplete="given-name"
              className="field"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={fieldStyle}
            />
          </div>
          <div style={col}>
            <label htmlFor="apellido" style={labelStyle}>
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              placeholder="Pérez"
              autoComplete="family-name"
              className="field"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              style={fieldStyle}
            />
          </div>
        </div>

        <div style={col}>
          <label htmlFor="cedula" style={uniqueLabelStyle}>
            <span>Cédula</span>
            <UniqueTag ok={cedulaOk} />
          </label>
          <input
            id="cedula"
            type="text"
            inputMode="numeric"
            placeholder="1 020 304 050"
            className="field"
            value={cedula}
            onChange={(e) => setCedula(formatCedula(e.target.value))}
            style={{ ...fieldStyle, borderColor: cedulaOk ? theme.green : theme.border }}
          />
        </div>

        <div style={col}>
          <label htmlFor="telefono" style={uniqueLabelStyle}>
            <span>Teléfono (WhatsApp)</span>
            <UniqueTag ok={telefonoOk} />
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="+57 300 000 0000"
            autoComplete="tel"
            className="field"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/[^\d+ ]/g, "").slice(0, 16))}
            style={{ ...fieldStyle, borderColor: telefonoOk ? theme.green : theme.border }}
          />
        </div>

        <div style={grid2}>
          <div style={col}>
            <label htmlFor="departamento" style={labelStyle}>
              Departamento
            </label>
            <select
              id="departamento"
              className="field"
              value={departamento}
              onChange={(e) => onDepartamento(e.target.value)}
              style={selectStyle}
            >
              {Object.keys(municipiosPorDepartamento).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div style={col}>
            <label htmlFor="municipio" style={labelStyle}>
              Municipio
            </label>
            <select
              id="municipio"
              className="field"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              style={selectStyle}
            >
              {municipiosPorDepartamento[departamento].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={col}>
          <label htmlFor="clave" style={labelStyle}>
            Clave de acceso
          </label>
          <input
            id="clave"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            className="field"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            aria-invalid={claveCorta}
            aria-describedby={claveCorta ? "clave-hint" : undefined}
            style={{ ...fieldStyle, borderColor: claveCorta ? theme.red : theme.border }}
          />
          {claveCorta && (
            <span id="clave-hint" style={{ fontSize: 12, color: theme.red, fontWeight: 600 }}>
              Faltan {8 - clave.length} caracteres.
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            paddingTop: 4,
            borderRadius: 12,
            outline: termsError && !terminos ? `2px solid ${theme.accent}` : "none",
            outlineOffset: 6,
          }}
        >
          <input
            ref={termsRef}
            id="terminos"
            type="checkbox"
            checked={terminos}
            onChange={(e) => {
              setTerminos(e.target.checked);
              if (e.target.checked) setTermsError(false);
            }}
            style={{ width: 22, height: 22, margin: "2px 0 0 0", accentColor: theme.primary, font: "13.3333px Arial" }}
          />
          <label htmlFor="terminos" style={{ fontSize: 13, lineHeight: 1.4, color: theme.ink }}>
            Acepto los{" "}
            <a href="#terminos" onClick={openLegal("terminos")}>
              términos
            </a>{" "}
            y la{" "}
            <a href="#datos" onClick={openLegal("datos")}>
              política de tratamiento de datos
            </a>
            . Sin esta aceptación no se crea el registro.
          </label>
        </div>
      </form>

      <div style={{ padding: "12px 24px 32px 24px", background: theme.bg, flexShrink: 0 }}>
        <button
          type="submit"
          form="registro-lider"
          className="press"
          disabled={submitting}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            boxSizing: "content-box",
            padding: 0,
            minHeight: 56,
            border: "none",
            borderRadius: 14,
            background: theme.accent,
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {submitting ? "Creando registro…" : "Crear mi registro"}
        </button>
      </div>

      <LegalSheet doc={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
