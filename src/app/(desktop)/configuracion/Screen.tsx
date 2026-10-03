"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useToast } from "@/components/Toast";
import { fontCondensed, theme } from "@/lib/theme";

type Campo = { id: string; nombre: string; tipo: string; ob: boolean; un: boolean; custom?: boolean };
type Qr = { id: string; nombre: string; detalle: string; registros: number };
type Config = {
  campos: Campo[];
  hv: "opcional" | "obligatoria";
  tipos: string[];
  comites: string[];
  qrs: Qr[];
};

const TIPOS_CAMPO = ["Texto", "Número", "Teléfono", "Email", "Lista", "Fecha", "Sí / No"];

const initialConfig: Config = {
  campos: [
    { id: "c1", nombre: "Nombre y apellido", tipo: "Texto", ob: true, un: false },
    { id: "c2", nombre: "Cédula", tipo: "Número", ob: true, un: true },
    { id: "c3", nombre: "Teléfono (WhatsApp)", tipo: "Teléfono", ob: true, un: true },
    { id: "c4", nombre: "Email", tipo: "Email", ob: false, un: false },
    { id: "c5", nombre: "Departamento / municipio", tipo: "Lista", ob: true, un: false },
    { id: "c6", nombre: "Puesto de votación", tipo: "Texto", ob: false, un: false },
  ],
  hv: "opcional",
  tipos: ["Líder", "Amigo", "Coordinador de zona"],
  comites: ["Juventudes", "Mujeres", "Comerciantes"],
  qrs: [
    { id: "q1", nombre: "Lanzamiento · Parque Santander", detalle: "Evento · 12 oct 2026", registros: 184 },
    { id: "q2", nombre: "Comuna 5", detalle: "Zona · Bucaramanga", registros: 96 },
    { id: "q3", nombre: "Girón centro", detalle: "Zona · Girón", registros: 41 },
  ],
};

const card: CSSProperties = {
  background: "#FFFFFF",
  border: `1.5px solid ${theme.border}`,
  borderRadius: 18,
  padding: 22,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};
const h2: CSSProperties = {
  margin: 0,
  fontFamily: fontCondensed,
  fontWeight: 800,
  fontSize: 26,
  textTransform: "uppercase",
};
const smallLabel: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.muted,
};
const chip: CSSProperties = {
  position: "relative",
  padding: "8px 12px",
  borderRadius: 999,
  background: theme.primarySoft,
  color: theme.ink,
  fontWeight: 600,
  fontSize: 13,
};
const dashedBtn: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "#FFFFFF",
  border: `1.5px dashed ${theme.muted}`,
  color: theme.ink,
  font: "inherit",
  fontWeight: 600,
  fontSize: 13,
};
const gridCols = "minmax(0, 2fr) minmax(0, 1fr) 90px 80px";
const inputBase: CSSProperties = {
  width: "100%",
  minHeight: 40,
  padding: "0 12px",
  borderRadius: 10,
  border: `1.5px solid ${theme.border}`,
  background: "#FFFFFF",
  color: theme.ink,
  fontSize: 14,
  boxSizing: "border-box",
};

let uid = 100;
const newId = (p: string) => `${p}${++uid}`;

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      style={{
        display: "inline-flex",
        width: 44,
        height: 26,
        borderRadius: 13,
        background: on ? theme.primary : "#C4C8DA",
        padding: 3,
        boxSizing: "border-box",
        justifyContent: on ? "flex-end" : "flex-start",
        border: 0,
        transition: "background 140ms ease",
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF" }} />
    </button>
  );
}

function ChipGroup({
  label,
  items,
  addLabel,
  noun,
  onChange,
  onToast,
}: {
  label: string;
  items: string[];
  addLabel: string;
  noun: string;
  onChange: (items: string[]) => void;
  onToast: (msg: string, tone?: "info" | "success" | "warning" | "error") => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim();
    if (v) {
      if (items.some((i) => i.toLowerCase() === v.toLowerCase())) {
        onToast(`“${v}” ya existe`, "warning");
      } else {
        onChange([...items, v]);
      }
    }
    setDraft("");
    setAdding(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={smallLabel}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((item) => (
          <span key={item} className="fade-up group" style={chip}>
            {item}
            {/* Remove badge floats over the chip corner so chips keep the mockup's exact size. */}
            <button
              type="button"
              aria-label={`Quitar ${noun} ${item}`}
              title="Quitar"
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              onClick={() => onChange(items.filter((i) => i !== item))}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                border: `1.5px solid ${theme.border}`,
                background: "#FFFFFF",
                padding: 0,
                width: 18,
                height: 18,
                borderRadius: "50%",
                color: theme.muted,
                fontSize: 13,
                lineHeight: "14px",
                transition: "opacity 120ms ease",
              }}
            >
              ×
            </button>
          </span>
        ))}
        {adding ? (
          <input
            autoFocus
            className="field"
            aria-label={`Nuevo ${noun}`}
            placeholder={`Nuevo ${noun}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              border: `1.5px solid ${theme.primary}`,
              fontSize: 13,
              fontWeight: 600,
              width: 170,
              color: theme.ink,
            }}
          />
        ) : (
          <button type="button" className="press" style={dashedBtn} onClick={() => setAdding(true)}>
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function Screen() {
  const toast = useToast();
  const [cfg, setCfg] = useState<Config>(initialConfig);
  const [saved, setSaved] = useState<Config>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [qrForm, setQrForm] = useState<{ open: boolean; nombre: string; tipo: "Evento" | "Zona"; detalle: string }>({
    open: false,
    nombre: "",
    tipo: "Evento",
    detalle: "",
  });
  const [focusId, setFocusId] = useState<string | null>(null);

  const dirty = JSON.stringify(cfg) !== JSON.stringify(saved);

  const update = (patch: Partial<Config>) => setCfg((c) => ({ ...c, ...patch }));
  const updateCampo = (id: string, patch: Partial<Campo>) =>
    setCfg((c) => ({ ...c, campos: c.campos.map((f) => (f.id === id ? { ...f, ...patch } : f)) }));

  const save = () => {
    if (!dirty || saving) {
      if (!dirty) toast("No hay cambios por guardar");
      return;
    }
    const empty = cfg.campos.find((f) => !f.nombre.trim());
    if (empty) {
      toast("Hay un campo sin nombre: se guardará como “Campo sin nombre”", "warning");
    }
    const clean: Config = {
      ...cfg,
      campos: cfg.campos.map((f) => (f.nombre.trim() ? f : { ...f, nombre: "Campo sin nombre" })),
    };
    setSaving(true);
    setTimeout(() => {
      // Only normalise empty names; keep any edits made while "saving".
      setCfg((c) => ({
        ...c,
        campos: c.campos.map((f) => (f.nombre.trim() ? f : { ...f, nombre: "Campo sin nombre" })),
      }));
      setSaved(clean);
      setSaving(false);
      toast("Configuración guardada", "success");
    }, 450);
  };

  const discard = () => {
    setCfg(saved);
    toast("Cambios descartados");
  };

  // Ctrl/Cmd+S saves; warn on leaving with unsaved changes.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const addCampo = () => {
    const id = newId("c");
    setFocusId(id);
    setCfg((c) => ({
      ...c,
      campos: [...c.campos, { id, nombre: "", tipo: "Texto", ob: false, un: false, custom: true }],
    }));
  };

  const removeCampo = (f: Campo) => {
    setCfg((c) => ({ ...c, campos: c.campos.filter((x) => x.id !== f.id) }));
    toast(`Campo “${f.nombre || "sin nombre"}” eliminado`);
  };

  const createQr = () => {
    const nombre = qrForm.nombre.trim() || (qrForm.tipo === "Evento" ? "Nuevo evento" : "Nueva zona");
    const detalle = `${qrForm.tipo} · ${qrForm.detalle.trim() || (qrForm.tipo === "Evento" ? "Sin fecha" : "Sin municipio")}`;
    setCfg((c) => ({ ...c, qrs: [{ id: newId("q"), nombre, detalle, registros: 0 }, ...c.qrs] }));
    setQrForm({ open: false, nombre: "", tipo: "Evento", detalle: "" });
    toast(`QR “${nombre}” generado`, "success");
  };

  const copyQr = async (q: Qr) => {
    const link = `https://campana.co/r/${slugify(q.nombre)}`;
    try {
      await navigator.clipboard.writeText(link);
      toast(`Enlace copiado: ${link}`, "success");
    } catch {
      toast(link);
    }
  };

  return (
    <main
      className="px-4 pt-6 pb-10 sm:px-10 sm:pt-9 sm:pb-12"
      style={{ minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.primary,
            }}
          >
            Administrador
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: fontCondensed,
              fontWeight: 800,
              fontSize: 44,
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            Configuración de la campaña
          </h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          {dirty && (
            <>
              <span
                className="fade-up"
                role="status"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent }} />
                Cambios sin guardar
              </span>
              <button
                type="button"
                className="press fade-up"
                onClick={discard}
                style={{
                  minHeight: 48,
                  padding: "0 16px",
                  borderRadius: 12,
                  background: "transparent",
                  color: theme.ink,
                  border: `1.5px solid ${theme.border}`,
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Descartar
              </button>
            </>
          )}
          <button
            type="button"
            className="press"
            onClick={save}
            aria-disabled={!dirty}
            title="Guardar (Ctrl/⌘ + S)"
            style={{
              minHeight: 48,
              padding: "0 22px",
              borderRadius: 12,
              background: theme.accent,
              color: "#FFFFFF",
              border: 0,
              fontWeight: 700,
              fontSize: 16,
              opacity: saving ? 0.8 : 1,
            }}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 20 }}>
        {/* Campos del formulario */}
        <section style={card} aria-labelledby="h-campos">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h2 id="h-campos" style={h2}>
              Campos del formulario
            </h2>
            <button
              type="button"
              className="press"
              onClick={addCampo}
              style={{
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 10,
                background: "#FFFFFF",
                border: `1.5px solid ${theme.ink}`,
                fontWeight: 700,
                fontSize: 14,
                color: theme.ink,
                flexShrink: 0,
              }}
            >
              + Campo
            </button>
          </div>
          <div style={{ overflowX: "auto", margin: "0 -4px", padding: "0 4px" }}>
            <div style={{ minWidth: 440, display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  gap: 10,
                  padding: "0 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.muted,
                }}
              >
                <span>Campo</span>
                <span>Tipo</span>
                <span>Obligatorio</span>
                <span>Único</span>
              </div>
              {cfg.campos.map((f) => (
                <div
                  key={f.id}
                  className="rowhover fade-up"
                  style={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 12px",
                    border: `1.5px solid ${theme.border}`,
                    borderRadius: 12,
                    minHeight: 48,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
                    <input
                      className="field"
                      aria-label="Nombre del campo"
                      placeholder="Nombre del campo"
                      value={f.nombre}
                      autoFocus={focusId === f.id}
                      onFocus={() => {
                        if (focusId === f.id) setFocusId(null);
                      }}
                      onChange={(e) => updateCampo(f.id, { nombre: e.target.value })}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontWeight: 600,
                        fontSize: 15,
                        color: theme.ink,
                        background: "transparent",
                        border: "1.5px solid transparent",
                        borderRadius: 8,
                        padding: "4px 6px",
                        margin: "-4px -7.5px",
                      }}
                    />
                    {f.custom && (
                      <button
                        type="button"
                        aria-label={`Eliminar campo ${f.nombre || "sin nombre"}`}
                        title="Eliminar campo"
                        onClick={() => removeCampo(f)}
                        style={{
                          border: 0,
                          background: "transparent",
                          color: theme.muted,
                          fontSize: 18,
                          lineHeight: 1,
                          padding: "0 2px",
                          marginLeft: 6,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                  <select
                    className="field"
                    aria-label={`Tipo de ${f.nombre || "campo"}`}
                    value={f.tipo}
                    onChange={(e) => updateCampo(f.id, { tipo: e.target.value })}
                    style={{
                      minWidth: 0,
                      width: "100%",
                      fontSize: 13,
                      color: theme.muted,
                      background: "transparent",
                      border: "1.5px solid transparent",
                      borderRadius: 8,
                      padding: "4px 0",
                      margin: "-4px 0",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    {TIPOS_CAMPO.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span>
                    <Toggle
                      on={f.ob}
                      label={`${f.nombre || "Campo"} obligatorio`}
                      onChange={(v) => updateCampo(f.id, { ob: v })}
                    />
                  </span>
                  <span>
                    <Toggle
                      on={f.un}
                      label={`${f.nombre || "Campo"} único`}
                      onChange={(v) => updateCampo(f.id, { un: v })}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* Hoja de vida y tipos */}
          <section style={card} aria-labelledby="h-hv">
            <h2 id="h-hv" style={h2}>
              Hoja de vida y tipos
            </h2>
            <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <legend style={{ ...smallLabel, padding: "0 0 6px 0" }}>Hoja de vida del líder</legend>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(["opcional", "obligatoria"] as const).map((v) => {
                  const sel = cfg.hv === v;
                  return (
                    <label
                      key={v}
                      className="press"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minHeight: 44,
                        padding: "0 14px",
                        borderRadius: 10,
                        border: `2px solid ${sel ? theme.ink : theme.border}`,
                        background: sel ? theme.ink : "#FFFFFF",
                        color: sel ? "#FFFFFF" : theme.ink,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="hv"
                        checked={sel}
                        onChange={() => update({ hv: v })}
                        style={{ accentColor: sel ? "#FFFFFF" : theme.ink, font: "400 13.3333px Arial" }}
                      />
                      {v === "opcional" ? "Opcional" : "Obligatoria"}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <ChipGroup
              label="Tipos de contacto"
              items={cfg.tipos}
              addLabel="+ Tipo"
              noun="tipo"
              onChange={(tipos) => update({ tipos })}
              onToast={toast}
            />
            <ChipGroup
              label="Comités"
              items={cfg.comites}
              addLabel="+ Comité"
              noun="comité"
              onChange={(comites) => update({ comites })}
              onToast={toast}
            />
          </section>

          {/* QR por evento o zona */}
          <section style={card} aria-labelledby="h-qr">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
              <h2 id="h-qr" style={h2}>
                QR por evento o zona
              </h2>
              <button
                type="button"
                className="press"
                aria-expanded={qrForm.open}
                onClick={() => setQrForm((s) => ({ ...s, open: !s.open }))}
                style={{
                  minHeight: 40,
                  padding: "0 14px",
                  borderRadius: 10,
                  background: theme.primary,
                  border: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#FFFFFF",
                  flexShrink: 0,
                }}
              >
                Generar QR
              </button>
            </div>

            {qrForm.open && (
              <form
                className="fade-up"
                onSubmit={(e) => {
                  e.preventDefault();
                  createQr();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 14,
                  borderRadius: 12,
                  background: theme.bg,
                  border: `1.5px solid ${theme.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  {(["Evento", "Zona"] as const).map((t) => {
                    const sel = qrForm.tipo === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={sel}
                        onClick={() => setQrForm((s) => ({ ...s, tipo: t }))}
                        style={{
                          minHeight: 36,
                          padding: "0 14px",
                          borderRadius: 999,
                          border: `1.5px solid ${sel ? theme.ink : theme.border}`,
                          background: sel ? theme.ink : "#FFFFFF",
                          color: sel ? "#FFFFFF" : theme.ink,
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <input
                  autoFocus
                  className="field"
                  aria-label="Nombre del QR"
                  placeholder={qrForm.tipo === "Evento" ? "Nombre del evento" : "Nombre de la zona"}
                  value={qrForm.nombre}
                  onChange={(e) => setQrForm((s) => ({ ...s, nombre: e.target.value }))}
                  style={inputBase}
                />
                <input
                  className="field"
                  aria-label={qrForm.tipo === "Evento" ? "Fecha del evento" : "Municipio"}
                  placeholder={qrForm.tipo === "Evento" ? "Fecha (ej. 20 oct 2026)" : "Municipio"}
                  value={qrForm.detalle}
                  onChange={(e) => setQrForm((s) => ({ ...s, detalle: e.target.value }))}
                  style={inputBase}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setQrForm({ open: false, nombre: "", tipo: "Evento", detalle: "" })}
                    style={{
                      minHeight: 40,
                      padding: "0 14px",
                      borderRadius: 10,
                      background: "transparent",
                      border: `1.5px solid ${theme.border}`,
                      fontWeight: 700,
                      fontSize: 14,
                      color: theme.ink,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="press"
                    style={{
                      minHeight: 40,
                      padding: "0 14px",
                      borderRadius: 10,
                      background: theme.primary,
                      border: 0,
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#FFFFFF",
                    }}
                  >
                    Crear QR
                  </button>
                </div>
              </form>
            )}

            {cfg.qrs.map((q) => (
              <button
                key={q.id}
                type="button"
                className="rowhover fade-up"
                title="Copiar enlace del QR"
                onClick={() => copyQr(q)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: `1.5px solid ${theme.border}`,
                  borderRadius: 12,
                  minHeight: 52,
                  boxSizing: "border-box",
                  background: "#FFFFFF",
                  color: theme.ink,
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ width: 36, height: 36, borderRadius: 8, background: theme.ink, flexShrink: 0 }} />
                <span style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}><span>{q.nombre}</span></span>
                  <span style={{ fontSize: 12, color: theme.muted }}><span>{q.detalle}</span></span>
                </span>
                <span style={{ fontFamily: fontCondensed, fontWeight: 800, fontSize: 22 }}>{q.registros}</span>
                <span
                  style={{ fontSize: 11, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}
                >
                  registros
                </span>
              </button>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
