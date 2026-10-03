"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useToast } from "@/components/Toast";
import { routes } from "@/lib/routes";
import { fontCondensed, theme } from "@/lib/theme";
import { ContactDrawer, type Traza } from "./ContactDrawer";
import {
  contactos,
  estados,
  estadoStyle,
  fecha,
  iniciales,
  municipiosContacto,
  type Contacto,
  type Estado,
  type MunicipioContacto,
} from "./data";
import { h2Style, labelStyle, pill, selectStyle } from "./styles";

type SortKey = "nombre" | "tipo" | "municipio" | "lider" | "estado" | "registro";
type Sort = { key: SortKey; dir: "asc" | "desc" };
type TipoFiltro = "Todos" | "Líderes" | "Amigos";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const estadoOrden: Record<Estado, number> = { Verde: 0, Amarillo: 1, Gris: 2, Rojo: 3 };

const columns: { key: SortKey | null; label: string; align?: "right"; padL?: number }[] = [
  { key: "nombre", label: "Contacto", padL: 22 },
  { key: "tipo", label: "Tipo" },
  { key: "municipio", label: "Municipio · zona" },
  { key: "lider", label: "Líder" },
  { key: "estado", label: "Estado" },
  { key: null, label: "Puesto de votación" },
  { key: "registro", label: "Registro" },
];

export function ContactosScreen() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState<TipoFiltro>("Todos");
  const [municipio, setMunicipio] = useState<"Todos" | MunicipioContacto>("Todos");
  const [estado, setEstado] = useState<"Todos" | Estado>("Todos");
  const [sort, setSort] = useState<Sort>({ key: "registro", dir: "desc" });
  const [overrides, setOverrides] = useState<Record<string, Estado>>({});
  const [notas, setNotas] = useState<Record<string, Traza[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = useMemo<Contacto[]>(
    () => contactos.map((c) => (overrides[c.id] ? { ...c, estado: overrides[c.id] } : c)),
    [overrides],
  );

  // Filtered by everything except estado (so the estado chips can show counts).
  const base = useMemo(() => {
    const q = norm(query.trim());
    const qDigits = query.replace(/\D/g, "");
    return all.filter((c) => {
      if (tipo === "Líderes" && c.tipo !== "Líder") return false;
      if (tipo === "Amigos" && c.tipo !== "Amigo") return false;
      if (municipio !== "Todos" && c.municipio !== municipio) return false;
      if (!q) return true;
      const hay = norm(`${c.nombre} ${c.lider ?? ""} ${c.puesto} ${c.zona} ${c.municipio}`);
      if (hay.includes(q)) return true;
      if (qDigits.length >= 3 && (c.telefono.replace(/\D/g, "").includes(qDigits) || c.cedula.replace(/\D/g, "").includes(qDigits))) return true;
      return false;
    });
  }, [all, query, tipo, municipio]);

  const rows = useMemo(() => {
    const filtered = estado === "Todos" ? base : base.filter((c) => c.estado === estado);
    const sign = sort.dir === "asc" ? 1 : -1;
    const val = (c: Contacto): string | number => {
      switch (sort.key) {
        case "estado":
          return estadoOrden[c.estado];
        case "lider":
          return c.lider ?? "";
        case "municipio":
          return `${c.municipio} ${c.zona}`;
        default:
          return c[sort.key];
      }
    };
    return [...filtered].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "es");
      return r !== 0 ? r * sign : a.nombre.localeCompare(b.nombre, "es");
    });
  }, [base, estado, sort]);

  const counts = useMemo(() => {
    const r: Record<Estado, number> = { Verde: 0, Amarillo: 0, Gris: 0, Rojo: 0 };
    base.forEach((c) => (r[c.estado] += 1));
    return r;
  }, [base]);

  const nLideres = rows.filter((c) => c.tipo === "Líder").length;
  const selected = selectedId ? all.find((c) => c.id === selectedId) ?? null : null;
  const hasFilters = query !== "" || tipo !== "Todos" || municipio !== "Todos" || estado !== "Todos";

  const closeDrawer = useCallback(() => setSelectedId(null), []);

  const clear = () => {
    setQuery("");
    setTipo("Todos");
    setMunicipio("Todos");
    setEstado("Todos");
  };

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "registro" ? "desc" : "asc" }));

  const changeEstado = (c: Contacto, e: Estado) => {
    if (c.estado === e) return;
    setOverrides((o) => ({ ...o, [c.id]: e }));
    setNotas((n) => ({
      ...n,
      [c.id]: [{ texto: `Estado cambiado a ${e.toLowerCase()}`, meta: "Coordinación · ahora", color: estadoStyle[e].bg }, ...(n[c.id] ?? [])],
    }));
    toast(`${c.nombre} quedó en ${e.toLowerCase()}`, e === "Rojo" ? "warning" : "success");
  };

  const addNota = (c: Contacto, texto: string) => {
    setNotas((n) => ({ ...n, [c.id]: [{ texto, meta: "Coordinación · nota · ahora", color: theme.primary }, ...(n[c.id] ?? [])] }));
    toast("Nota guardada en la trazabilidad", "success");
  };

  return (
    <main
      className="px-4 pt-6 pb-10 sm:px-10 sm:pt-9 sm:pb-12"
      style={{ minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.primary }}>
            Fase 4 · Red de contactos
          </span>
          <h1 style={{ margin: 0, fontFamily: fontCondensed, fontWeight: 800, fontSize: 44, lineHeight: 0.95, textTransform: "uppercase" }}>
            Contactos
          </h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            className="press"
            onClick={() => toast(`Exportando ${rows.length} contactos a Excel…`, "success")}
            style={{
              minHeight: 48,
              padding: "0 18px",
              borderRadius: 12,
              background: "#FFFFFF",
              border: "1.5px solid #0A1033",
              color: "#0A1033",
              font: "inherit",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Exportar Excel
          </button>
          <Link
            href={routes.agregar}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: 48,
              padding: "0 18px",
              borderRadius: 12,
              background: theme.accent,
              color: "#FFFFFF",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Agregar contacto
          </Link>
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "flex-end",
          background: "#FFFFFF",
          border: "1.5px solid #D8DBEA",
          borderRadius: 16,
          padding: "14px 16px",
        }}
      >
        <label style={{ ...labelStyle, flex: "1 1 240px" }}>
          Buscar
          <span style={{ position: "relative", display: "flex" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5B6180"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ position: "absolute", left: 12, top: 13 }}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              className="field"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre, líder, teléfono o cédula"
              style={{ ...selectStyle(0), width: "100%", paddingLeft: 38, boxSizing: "border-box", fontWeight: 500 }}
            />
          </span>
        </label>
        <label style={labelStyle}>
          Tipo
          <select className="field" style={selectStyle(130)} value={tipo} onChange={(e) => setTipo(e.target.value as TipoFiltro)}>
            <option>Todos</option>
            <option>Líderes</option>
            <option>Amigos</option>
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
            onChange={(e) => setMunicipio(e.target.value as "Todos" | MunicipioContacto)}
          >
            <option>Todos</option>
            {municipiosContacto.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Estado
          <select className="field" style={selectStyle(130)} value={estado} onChange={(e) => setEstado(e.target.value as "Todos" | Estado)}>
            <option>Todos</option>
            {estados.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="press"
          onClick={clear}
          disabled={!hasFilters}
          style={{
            minHeight: 44,
            padding: "0 18px",
            borderRadius: 10,
            background: hasFilters ? theme.primary : "#C4C8DA",
            border: 0,
            color: "#FFFFFF",
            font: "inherit",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Limpiar
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))", gap: 10 }}>
        {estados.map((s) => {
          const active = estado === s;
          const st = estadoStyle[s];
          return (
            <button
              key={s}
              type="button"
              className="press"
              aria-pressed={active}
              onClick={() => setEstado(active ? "Todos" : s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 14,
                background: active ? st.bg : "#FFFFFF",
                color: active ? st.fg : "#0A1033",
                border: `1.5px solid ${active ? st.bg : "#D8DBEA"}`,
                font: "inherit",
                textAlign: "left",
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, background: active ? st.fg : st.bg, flexShrink: 0 }} />
              <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{counts[s]}</span>
                <span style={{ fontSize: 12, fontWeight: 600, opacity: active ? 0.9 : 1, color: active ? st.fg : "#5B6180" }}>
                  {s} · {st.label.split(" · ")[0].toLowerCase()}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <section
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #D8DBEA",
          borderRadius: 18,
          padding: "6px 0 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 22px 10px 22px", gap: 10, flexWrap: "wrap" }}>
          <h2 style={h2Style}>
            {tipo === "Todos" ? "Líderes y amigos" : tipo} · {municipio === "Todos" ? "Santander" : municipio}
          </h2>
          <span style={{ fontSize: 13, color: "#5B6180" }} aria-live="polite">
            {rows.length} de {contactos.length} contactos · {nLideres} líderes · {rows.length - nLideres} amigos
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr
                style={{
                  background: "#F4F5FB",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#5B6180",
                  textAlign: "left",
                }}
              >
                {columns.map((col) => {
                  const active = col.key !== null && sort.key === col.key;
                  return (
                    <th
                      key={col.label}
                      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                      style={{ padding: `10px 12px 10px ${col.padL ?? 12}px`, fontWeight: 700, whiteSpace: "nowrap" }}
                    >
                      {col.key ? (
                        <SortButton active={active} dir={sort.dir} onClick={() => toggleSort(col.key as SortKey)}>
                          {col.label}
                        </SortButton>
                      ) : (
                        col.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody key={`${tipo}-${municipio}-${estado}`} className="fade-up">
              {rows.map((c) => {
                const isSel = c.id === selectedId;
                const st = estadoStyle[c.estado];
                return (
                  <tr
                    key={c.id}
                    className={isSel ? undefined : "rowhover"}
                    onClick={() => setSelectedId(c.id)}
                    style={{ borderTop: "1px solid #D8DBEA", fontSize: 14, cursor: "pointer", background: isSel ? "#E6E9FF" : undefined }}
                  >
                    <td style={{ padding: "10px 12px 10px 22px", boxShadow: isSel ? `inset 4px 0 0 ${theme.primary}` : undefined }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(c.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          font: "inherit",
                          color: "#0A1033",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: c.tipo === "Líder" ? "#0A1033" : "#E6E9FF",
                            color: c.tipo === "Líder" ? "#FFFFFF" : "#0A1033",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 12,
                            flexShrink: 0,
                            border: `3px solid ${st.bg}`,
                            boxSizing: "border-box",
                          }}
                          aria-hidden="true"
                        >
                          {iniciales(c.nombre)}
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontWeight: 700 }}>{c.nombre}</span>
                          <span style={{ fontSize: 12, color: "#5B6180" }}>{c.telefono}</span>
                        </span>
                      </button>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={pill(c.tipo === "Líder" ? "#0A1033" : "#E6E9FF", c.tipo === "Líder" ? "#FFFFFF" : theme.primary)}
                      >
                        {c.tipo}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#5B6180", whiteSpace: "nowrap" }}>
                      {c.municipio} · {c.zona}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {c.lider ?? <span style={{ color: "#5B6180", fontWeight: 400 }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={pill(st.bg, st.fg)}>{c.estado}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#5B6180" }}>{c.puesto}</td>
                    <td style={{ padding: "10px 22px 10px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>{fecha(c.registro)}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr style={{ borderTop: "1px solid #D8DBEA" }}>
                  <td colSpan={columns.length} style={{ padding: "36px 22px", textAlign: "center", color: "#5B6180", fontSize: 15 }}>
                    Ningún contacto coincide con los filtros.{" "}
                    <button
                      type="button"
                      onClick={clear}
                      style={{ background: "none", border: 0, padding: 0, font: "inherit", fontWeight: 700, color: theme.primary, textDecoration: "underline" }}
                    >
                      Limpiar filtros
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <ContactDrawer
          key={selected.id}
          contacto={selected}
          todos={all}
          notas={notas[selected.id] ?? []}
          onClose={closeDrawer}
          onSelect={setSelectedId}
          onEstado={(e) => changeEstado(selected, e)}
          onNota={(t) => addNota(selected, t)}
        />
      )}
    </main>
  );
}

function SortButton({ active, dir, onClick, children }: { active: boolean; dir: "asc" | "desc"; onClick: () => void; children: ReactNode }) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "transparent",
    border: 0,
    padding: 0,
    font: "inherit",
    fontWeight: 700,
    textTransform: "inherit",
    letterSpacing: "inherit",
    color: active ? "#0A1033" : "#5B6180",
  };
  return (
    <button type="button" onClick={onClick} style={style}>
      {children}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {active ? (
          dir === "asc" ? (
            <path d="m6 15 6-6 6 6" />
          ) : (
            <path d="m6 9 6 6 6-6" />
          )
        ) : (
          <path d="m8 9 4-4 4 4M8 15l4 4 4-4" opacity="0.6" />
        )}
      </svg>
    </button>
  );
}
