"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { fontCondensed, theme } from "@/lib/theme";
import {
  amigos,
  colores,
  departamentos,
  estadoColor,
  lideres,
  municipios,
  totales,
  type Estado,
  type Fila,
  type Periodo,
  type Tipo,
} from "./data";

type Filtros = {
  periodo: Periodo;
  tipo: Tipo;
  departamento: string;
  municipio: string;
  color: string;
};

const inicial: Filtros = {
  periodo: "Últimas 4 semanas",
  tipo: "Líderes",
  departamento: "Santander",
  municipio: "Todos",
  color: "Todos",
};

type SortKey = "nombre" | "lugar" | "estado" | "ref" | "val" | "efe" | "meta";

type FilaVista = {
  nombre: string;
  lugar: string;
  estado: Estado;
  ref: number;
  val: number;
  efe: number;
  pct: number;
};

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.muted,
};

const selectStyle = (minWidth: number): CSSProperties => ({
  height: 44,
  minWidth,
  padding: "0 12px",
  border: `1.5px solid ${theme.border}`,
  borderRadius: 10,
  background: "#FFFFFF",
  font: "inherit",
  fontSize: 15,
  fontWeight: 600,
  textTransform: "none",
  letterSpacing: 0,
  color: theme.ink,
});

const thStyle: CSSProperties = { padding: "10px 12px", fontWeight: 700 };
const tdNum: CSSProperties = { padding: "12px 12px", textAlign: "right", fontWeight: 600 };

/** "1240" -> "1 240" (as in the mockup). */
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function aVista(f: Fila, periodo: Periodo): FilaVista {
  const k = periodo === "Toda la campaña" ? f.hist : 1;
  const ref = Math.round(f.ref * k);
  const val = Math.min(ref, Math.round(f.val * k));
  const efe = Math.min(val, Math.round(f.efe * k * (k > 1 ? 1.05 : 1)));
  return { nombre: f.nombre, lugar: f.lugar, estado: f.estado, ref, val, efe, pct: Math.min(100, Math.round((efe / 12) * 100)) };
}

function filtrar(f: Filtros): Fila[] {
  const base = f.tipo === "Líderes" ? lideres : amigos;
  return base.filter(
    (r) => (f.municipio === "Todos" || r.municipio === f.municipio) && (f.color === "Todos" || r.estado === f.color),
  );
}

export function InformeScreen() {
  const toast = useToast();
  const [borrador, setBorrador] = useState<Filtros>(inicial);
  const [aplicados, setAplicados] = useState<Filtros>(inicial);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  const pendiente = (Object.keys(borrador) as (keyof Filtros)[]).some((k) => borrador[k] !== aplicados[k]);

  const filas = useMemo(() => {
    const vista = filtrar(aplicados).map((r) => aVista(r, aplicados.periodo));
    if (!sort) return vista;
    const key = sort.key === "meta" ? "pct" : sort.key;
    const mult = sort.dir === "asc" ? 1 : -1;
    return [...vista].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * mult;
      return String(x).localeCompare(String(y), "es") * mult;
    });
  }, [aplicados, sort]);

  const resumen = useMemo(() => {
    const base = aplicados.tipo === "Líderes" ? lideres : amigos;
    const t = totales[aplicados.tipo];
    const sel = filtrar(aplicados);
    const hist = aplicados.periodo === "Toda la campaña";
    const sum = (rows: Fila[], k: "ref" | "efe", h: boolean) =>
      rows.reduce((acc, r) => acc + r[k] * (h ? r.hist : 1), 0);
    const nRatio = (sel.length / base.length) * (hist ? 1.45 : 1);
    return {
      n: Math.round(t.n * nRatio),
      ref: Math.round((t.ref * sum(sel, "ref", hist)) / sum(base, "ref", false)),
      efe: Math.round((t.efe * sum(sel, "efe", hist)) / sum(base, "efe", false) * (hist ? 1.05 : 1)),
    };
  }, [aplicados]);

  const set = <K extends keyof Filtros>(k: K, v: Filtros[K]) => setBorrador((prev) => ({ ...prev, [k]: v }));

  const aplicar = (e?: FormEvent) => {
    e?.preventDefault();
    setAplicados(borrador);
    const n = filtrar(borrador).length;
    toast(n ? `Filtros aplicados · ${n} ${n === 1 ? "registro" : "registros"}` : "Filtros aplicados · sin resultados", n ? "success" : "warning");
  };

  const ordenar = (key: SortKey) =>
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: key === "nombre" || key === "lugar" || key === "estado" ? "asc" : "desc" };
      if (prev.dir === "desc" && !(key === "nombre" || key === "lugar" || key === "estado")) return { key, dir: "asc" };
      if (prev.dir === "asc" && (key === "nombre" || key === "lugar" || key === "estado")) return { key, dir: "desc" };
      return null;
    });

  const ambito = aplicados.municipio === "Todos" ? aplicados.departamento : aplicados.municipio;
  const titulo = [aplicados.tipo, ambito, aplicados.periodo.toLowerCase(), aplicados.color !== "Todos" ? aplicados.color.toLowerCase() : null]
    .filter(Boolean)
    .join(" · ");
  const singular = aplicados.tipo === "Líderes" ? "Líder" : "Amigo";
  const archivo = `informe-${aplicados.tipo === "Líderes" ? "lideres" : "amigos"}-${ambito.toLowerCase().replace(/\s+/g, "-")}`;

  const exportarExcel = () => {
    if (!filas.length) {
      toast("No hay filas para exportar con estos filtros", "warning");
      return;
    }
    const cols = [singular, "Municipio · comuna", "Color", "Referidos", "Validados", "Efectivos", "Meta 1×12 (%)"];
    const esc = (v: string | number) => {
      const s = String(v);
      return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lineas = [
      cols.map(esc).join(";"),
      ...filas.map((r) => [r.nombre, r.lugar, r.estado, r.ref, r.val, r.efe, r.pct].map(esc).join(";")),
    ];
    const blob = new Blob(["\uFEFF" + lineas.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${archivo}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`Exportado ${archivo}.csv · ${filas.length} filas`, "success");
  };

  const descargarPdf = () => {
    toast("Generando PDF del informe…", "info");
    setTimeout(() => toast(`${archivo}.pdf listo (simulado)`, "success"), 1100);
  };

  const sortHeader = (key: SortKey, label: string, align: "left" | "right" = "left") => {
    const activo = sort?.key === key;
    return (
      <button
        type="button"
        onClick={() => ordenar(key)}
        title={`Ordenar por ${label}`}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          color: activo ? theme.ink : "inherit",
        }}
      >
        {label}
        {activo && (
          <span aria-hidden="true" style={{ fontSize: 9 }}>
            {sort?.dir === "asc" ? "▲" : "▼"}
          </span>
        )}
      </button>
    );
  };

  const ariaSort = (key: SortKey) =>
    sort?.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined;

  return (
    <main
      className="fade-up"
      style={{
        flex: "1 1 600px",
        minWidth: 0,
        padding: "clamp(20px, 4vw, 36px) clamp(16px, 3.5vw, 40px) 48px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.primary }}>
            Fase 5 · Salida
          </span>
          <h1 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 44, lineHeight: 0.95, textTransform: "uppercase" }}>
            Informe de la red
          </h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            className="press"
            onClick={exportarExcel}
            style={{
              minHeight: 48,
              padding: "0 18px",
              borderRadius: 12,
              background: "#FFFFFF",
              border: `1.5px solid ${theme.ink}`,
              color: theme.ink,
              font: "inherit",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Exportar Excel
          </button>
          <button
            type="button"
            className="press"
            onClick={descargarPdf}
            style={{
              minHeight: 48,
              padding: "0 18px",
              borderRadius: 12,
              background: theme.accent,
              border: 0,
              color: "#FFFFFF",
              font: "inherit",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Descargar PDF
          </button>
        </div>
      </div>

      <form
        onSubmit={aplicar}
        aria-label="Filtros del informe"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "flex-end",
          background: "#FFFFFF",
          border: `1.5px solid ${theme.border}`,
          borderRadius: 16,
          padding: "14px 16px",
        }}
      >
        <label style={labelStyle}>
          Periodo
          <select className="field" style={selectStyle(160)} value={borrador.periodo} onChange={(e) => set("periodo", e.target.value as Periodo)}>
            <option>Últimas 4 semanas</option>
            <option>Toda la campaña</option>
          </select>
        </label>
        <label style={labelStyle}>
          Tipo
          <select className="field" style={selectStyle(130)} value={borrador.tipo} onChange={(e) => set("tipo", e.target.value as Tipo)}>
            <option>Líderes</option>
            <option>Amigos</option>
          </select>
        </label>
        <label style={labelStyle}>
          Departamento
          <select className="field" style={selectStyle(150)} value={borrador.departamento} onChange={(e) => set("departamento", e.target.value)}>
            {departamentos.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Municipio
          <select className="field" style={selectStyle(150)} value={borrador.municipio} onChange={(e) => set("municipio", e.target.value)}>
            {municipios.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Color
          <select className="field" style={selectStyle(130)} value={borrador.color} onChange={(e) => set("color", e.target.value)}>
            {colores.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="press"
          style={{
            minHeight: 44,
            padding: "0 18px",
            borderRadius: 10,
            background: theme.primary,
            border: 0,
            color: "#FFFFFF",
            font: "inherit",
            fontWeight: 700,
            fontSize: 15,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Aplicar
          {pendiente && (
            <span
              aria-label="cambios sin aplicar"
              style={{ width: 8, height: 8, borderRadius: 999, background: theme.accent, display: "inline-block" }}
            />
          )}
        </button>
      </form>

      <section
        aria-label="Resultados del informe"
        style={{
          background: "#FFFFFF",
          border: `1.5px solid ${theme.border}`,
          borderRadius: 18,
          padding: "6px 0 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "14px 22px 10px 22px",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 24, textTransform: "uppercase" }}>{titulo}</h2>
          <span style={{ fontSize: 13, color: theme.muted }}>
            {fmt(resumen.n)} {aplicados.tipo.toLowerCase()} · {fmt(resumen.ref)} referidos · {fmt(resumen.efe)} efectivos
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr
                style={{
                  background: theme.bg,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.muted,
                  textAlign: "left",
                }}
              >
                <th style={{ ...thStyle, padding: "10px 22px" }} aria-sort={ariaSort("nombre")}>
                  {sortHeader("nombre", singular)}
                </th>
                <th style={thStyle} aria-sort={ariaSort("lugar")}>
                  {sortHeader("lugar", "Municipio · comuna")}
                </th>
                <th style={thStyle} aria-sort={ariaSort("estado")}>
                  {sortHeader("estado", "Color")}
                </th>
                <th style={{ ...thStyle, textAlign: "right" }} aria-sort={ariaSort("ref")}>
                  {sortHeader("ref", "Referidos", "right")}
                </th>
                <th style={{ ...thStyle, textAlign: "right" }} aria-sort={ariaSort("val")}>
                  {sortHeader("val", "Validados", "right")}
                </th>
                <th style={{ ...thStyle, textAlign: "right" }} aria-sort={ariaSort("efe")}>
                  {sortHeader("efe", "Efectivos", "right")}
                </th>
                <th style={{ ...thStyle, padding: "10px 22px" }} aria-sort={ariaSort("meta")}>
                  {sortHeader("meta", "Meta 1×12")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filas.map((r) => (
                <tr key={r.nombre} className="rowhover" style={{ borderTop: `1px solid ${theme.border}`, fontSize: 14 }}>
                  <td style={{ padding: "12px 22px", fontWeight: 700 }}><span>{r.nombre}</span></td>
                  <td style={{ padding: "12px 12px", color: theme.muted }}><span>{r.lugar}</span></td>
                  <td style={{ padding: "12px 12px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#FFFFFF",
                        background: estadoColor[r.estado],
                        padding: "4px 10px",
                        borderRadius: 999,
                      }}
                    >
                      <span>{r.estado}</span>
                    </span>
                  </td>
                  <td style={tdNum}><span>{r.ref}</span></td>
                  <td style={tdNum}><span>{r.val}</span></td>
                  <td style={{ ...tdNum, fontWeight: 700 }}><span>{r.efe}</span></td>
                  <td style={{ padding: "12px 22px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        role="progressbar"
                        aria-label={`Meta 1×12 de ${r.nombre}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={r.pct}
                        style={{ width: 110, height: 8, borderRadius: 4, background: theme.primarySoft, overflow: "hidden" }}
                      >
                        <span
                          style={{
                            display: "block",
                            height: "100%",
                            width: `${r.pct}%`,
                            background: theme.ink,
                            transition: "width 300ms ease",
                          }}
                        />
                      </span>
                      <span style={{ fontSize: 12, color: theme.muted }}>{r.pct} %</span>
                    </span>
                  </td>
                </tr>
              ))}
              {filas.length === 0 && (
                <tr style={{ borderTop: `1px solid ${theme.border}` }}>
                  <td colSpan={7} style={{ padding: "28px 22px", textAlign: "center", color: theme.muted, fontSize: 14 }}>
                    No hay {aplicados.tipo.toLowerCase()} con estos filtros.{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setBorrador(inicial);
                        setAplicados(inicial);
                        toast("Filtros restablecidos", "info");
                      }}
                      style={{ all: "unset", cursor: "pointer", color: theme.primary, fontWeight: 700, textDecoration: "underline" }}
                    >
                      Restablecer filtros
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
