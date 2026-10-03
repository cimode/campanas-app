"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { getDashboard, municipios, tipos, type Municipio, type Tipo } from "./data";

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5B6180",
};

const selectStyle = (minWidth: number): CSSProperties => ({
  height: 44,
  minWidth,
  padding: "0 12px",
  border: "1.5px solid #D8DBEA",
  borderRadius: 10,
  background: "#FFFFFF",
  font: "inherit",
  fontSize: 15,
  fontWeight: 600,
  textTransform: "none",
  letterSpacing: 0,
  color: "#0A1033",
});

const card: CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #D8DBEA",
  borderRadius: 18,
  padding: 22,
  display: "flex",
  flexDirection: "column",
};

const h2Style: CSSProperties = {
  margin: 0,
  fontFamily: fontCondensed,
  fontWeight: 800,
  fontSize: 24,
  textTransform: "uppercase",
};

const eyebrowSmall: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5B6180",
};

const estadoColors = ["#15803D", "#FACC15", "#6B7280", "#DC2626"];
const estadoNames = ["efectivos", "reprogramar", "sin gestionar", "no interesados"];
const estadoAria = ["Verde", "amarillo", "gris", "rojo"];

export function DashboardScreen() {
  const toast = useToast();
  const [tipo, setTipo] = useState<Tipo>("Todos");
  const [municipio, setMunicipio] = useState<Municipio>("Todos");
  const data = useMemo(() => getDashboard(tipo, municipio), [tipo, municipio]);
  const viewKey = `${tipo}-${municipio}`;

  const announce = (t: Tipo, m: Municipio) =>
    toast(`Mostrando ${t === "Todos" ? "toda la red" : t.toLowerCase()} · ${m === "Todos" ? "Santander" : m}`);

  return (
    <main
      className="px-4 pt-6 pb-10 sm:px-10 sm:pt-9 sm:pb-12"
      style={{ minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.primary }}>
            Fase 5 · Consolidación
          </span>
          <h1 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 44, lineHeight: 0.95, textTransform: "uppercase" }}>
            Dashboard del candidato
          </h1>
        </div>
        <form style={{ display: "flex", flexWrap: "wrap", gap: 8 }} onSubmit={(e) => e.preventDefault()}>
          <label style={labelStyle}>
            Tipo
            <select
              className="field"
              style={selectStyle(140)}
              value={tipo}
              onChange={(e) => {
                const v = e.target.value as Tipo;
                setTipo(v);
                announce(v, municipio);
              }}
            >
              {tipos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            Departamento
            <select className="field" style={selectStyle(150)} defaultValue="Santander">
              <option>Santander</option>
            </select>
          </label>
          <label style={labelStyle}>
            Municipio
            <select
              className="field"
              style={selectStyle(150)}
              value={municipio}
              onChange={(e) => {
                const v = e.target.value as Municipio;
                setMunicipio(v);
                announce(tipo, v);
              }}
            >
              {municipios.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
        </form>
      </div>

      <div
        key={`kpis-${viewKey}`}
        className="fade-up"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 14 }}
      >
        {data.kpis.map((k) => (
          <div
            key={k.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: "18px 20px",
              borderRadius: 16,
              background: k.bg,
              color: k.fg,
              border: `1.5px solid ${k.borde}`,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85 }}>{k.label}</span>
            <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 44, lineHeight: 1 }}>{k.valor}</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>{k.sub}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: 20, alignItems: "start" }}>
        <section style={{ ...card, gap: 16 }}>
          <h2 style={h2Style}>Estado de la red</h2>
          <div
            style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden" }}
            role="img"
            aria-label={data.estado.map((v, i) => `${estadoAria[i]} ${v} %`).join(", ")}
          >
            {data.estado.map((v, i) => (
              <div key={i} style={{ width: `${v}%`, background: estadoColors[i], transition: "width 300ms ease" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(120px, 100%), 1fr))", gap: 10 }}>
            {data.estado.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: estadoColors[i], flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>
                  <strong>{v} %</strong> {estadoNames[i]}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 6, borderTop: "1.5px solid #D8DBEA" }}>
            <span style={eyebrowSmall}>Crecimiento de la red · últimas 8 semanas</span>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: 6, alignItems: "end", height: 120 }}
              role="img"
              aria-label={`Registros por semana, creciendo de ${data.primeraSemana} a ${data.ultimaSemana}`}
            >
              {data.barras.map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: h,
                    background: i === data.barras.length - 1 ? theme.primary : "#C4C8DA",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 300ms ease",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5B6180" }}>
              <span>Sem 1</span>
              <span>Sem 8 · {data.ultimaSemana} registros</span>
            </div>
          </div>
        </section>

        <section style={{ ...card, gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <h2 style={h2Style}>Territorio</h2>
            <span style={{ fontSize: 12, color: "#5B6180" }}>{data.zonaLabel}</span>
          </div>
          <div
            key={`zonas-${viewKey}`}
            className="fade-up"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}
            role="img"
            aria-label={`${municipio === "Girón" ? "Sectores" : "Comunas"} por cantidad de contactos, de clara a oscura`}
          >
            {data.zonas.map((c) => (
              <div
                key={c.nombre}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 72,
                  padding: 10,
                  borderRadius: 10,
                  background: c.bg,
                  color: c.fg,
                  minWidth: 0,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nombre}</span>
                <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{c.n}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 6, borderTop: "1.5px solid #D8DBEA" }}>
            <span style={eyebrowSmall}>Puestos de votación con más amigos efectivos</span>
            {data.puestos.map((p) => (
              <div key={p.nombre} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flexGrow: 1, fontSize: 14, fontWeight: 600, minWidth: 0 }}>{p.nombre}</span>
                <span style={{ width: 120, flexShrink: 0, height: 8, borderRadius: 4, background: "#E6E9FF", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: p.w, background: "#15803D", transition: "width 300ms ease" }} />
                </span>
                <span style={{ width: 32, textAlign: "right", fontWeight: 700, fontSize: 14 }}>{p.n}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #D8DBEA",
          borderRadius: 18,
          padding: "18px 22px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 18,
        }}
      >
        <h2 style={h2Style}>Gestiones</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, flexGrow: 1 }}>
          {data.gestiones.map((g) => (
            <span key={g.label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{g.valor}</span>
              <span style={{ fontSize: 12, color: "#5B6180" }}>{g.label}</span>
            </span>
          ))}
        </div>
        <Link
          href={routes.informes}
          className="press"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
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
          Generar informe
        </Link>
      </section>
    </main>
  );
}
