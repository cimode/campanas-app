"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useToast } from "@/components/Toast";
import { fontCondensed, theme } from "@/lib/theme";
import { routes } from "@/lib/routes";

const LENGTH = 6;
const RESEND_SECONDS = 30;
const DEMO_CODE = "481920";
const INITIAL_FOCUS = 3;

const secondaryBtn: CSSProperties = {
  minHeight: 48,
  borderRadius: 12,
  background: theme.white,
  border: `1.5px solid ${theme.border}`,
  font: "inherit",
  fontWeight: 600,
  fontSize: 15,
  color: theme.ink,
};

export function Screen() {
  const router = useRouter();
  const toast = useToast();

  // Same starting state as the mockup: "4 8 1" typed, cursor on the 4th box.
  const [digits, setDigits] = useState<string[]>(() => ["4", "8", "1", "", "", ""]);
  const [focused, setFocused] = useState(INITIAL_FOCUS);
  const [cooldown, setCooldown] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown ticks once per second while active.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    refs.current[INITIAL_FOCUS]?.focus();
  }, []);

  const code = digits.join("");
  const complete = code.length === LENGTH;

  function focusBox(i: number) {
    const el = refs.current[Math.max(0, Math.min(LENGTH - 1, i))];
    el?.focus();
    el?.select();
  }

  function fillFrom(start: number, chars: string) {
    const clean = chars.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    let i = start;
    for (const ch of clean) {
      if (i >= LENGTH) break;
      next[i] = ch;
      i++;
    }
    setDigits(next);
    focusBox(Math.min(i, LENGTH - 1));
  }

  function onChange(i: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[i] = "";
      setDigits(next);
      return;
    }
    // Typing over a filled box or autofill (several chars) -> spread across boxes.
    const chars = clean.length > 1 && digits[i] && clean.startsWith(digits[i]) ? clean.slice(1) : clean;
    fillFrom(i, chars);
  }

  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!digits[i] && i > 0) {
        e.preventDefault();
        const next = [...digits];
        next[i - 1] = "";
        setDigits(next);
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      confirm();
    } else if (/^\d$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // Typing over a selected box: handle here, since retyping the same digit
      // leaves the value unchanged and React would skip onChange (no advance).
      const el = e.currentTarget;
      if (!el.value || (el.selectionStart === 0 && el.selectionEnd === el.value.length)) {
        e.preventDefault();
        fillFrom(i, e.key);
      }
    }
  }

  function onPaste(i: number, e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!/\d/.test(text)) return;
    e.preventDefault();
    const clean = text.replace(/\D/g, "");
    // A full-length code always fills from the first box.
    fillFrom(clean.length >= LENGTH ? 0 : i, clean);
  }

  function confirm() {
    if (confirming) return;
    setConfirming(true);
    if (!complete) {
      setDigits(DEMO_CODE.split(""));
      toast("Demo: completamos el código por ti.", "info");
    }
    toast("Número validado. ¡Ya sumas a la meta del líder!", "success");
    setTimeout(() => router.push(routes.perfilAmigo), 600);
  }

  function resend() {
    if (cooldown > 0) return;
    setDigits(Array(LENGTH).fill(""));
    focusBox(0);
    setCooldown(RESEND_SECONDS);
    toast("Nuevo código enviado por WhatsApp al +57 300 ••• 4421", "success");
  }

  function boxBorder(i: number) {
    if (focused === i) return `2px solid ${theme.primary}`;
    if (digits[i]) return `2px solid ${theme.ink}`;
    return `1.5px solid ${theme.border}`;
  }

  const mm = Math.floor(cooldown / 60);
  const ss = String(cooldown % 60).padStart(2, "0");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        padding: "60px 24px 32px 24px",
        gap: 24,
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href={routes.amigo}
          aria-label="Volver"
          className="press"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 12,
            background: theme.white,
            border: `1.5px solid ${theme.border}`,
            color: theme.ink,
            textDecoration: "none",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
        </Link>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.primary }}>
          Fase 2 · Validación
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.white,
          }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
            <path d="M9 10c.5 2 2 3.5 4 4l1.5-1.5 2 1-.5 2c-4 .5-8-3.5-7.5-7.5l2-.5 1 2z" />
          </svg>
        </div>
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
          Te enviamos un código por WhatsApp
        </h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.45, color: theme.muted }}>
          Lo mandamos al <strong style={{ color: theme.ink }}>+57 300 ••• 4421</strong>. Escríbelo aquí para confirmar que el número es tuyo.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          confirm();
        }}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <label
          htmlFor="c1"
          style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: theme.muted }}
        >
          Código de 6 dígitos
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              id={i === 0 ? "c1" : undefined}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              pattern="[0-9]*"
              maxLength={i === 0 ? LENGTH : 2}
              value={d}
              aria-label={`Dígito ${i + 1}`}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={(e) => onPaste(i, e)}
              onFocus={(e) => {
                setFocused(i);
                e.currentTarget.select();
              }}
              onBlur={() => setFocused((f) => (f === i ? -1 : f))}
              style={{
                height: 60,
                textAlign: "center",
                border: boxBorder(i),
                borderRadius: 12,
                background: theme.white,
                fontFamily: fontCondensed,
                fontWeight: 800,
                fontSize: 30,
                color: theme.ink,
                minWidth: 0,
                outline: "none",
                caretColor: theme.primary,
                transition: "border-color 120ms ease",
              }}
            />
          ))}
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          onClick={confirm}
          className="press"
          disabled={confirming}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 56,
            padding: 0,
            boxSizing: "content-box",
            border: "none",
            borderRadius: 14,
            background: theme.primary,
            color: theme.white,
            fontWeight: 700,
            fontSize: 18,
            opacity: confirming ? 0.85 : 1,
          }}
        >
          {confirming ? "Confirmando…" : "Confirmar código"}
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          <button
            type="button"
            className="press"
            onClick={resend}
            disabled={cooldown > 0}
            aria-live="polite"
            style={{ ...secondaryBtn, color: cooldown > 0 ? theme.muted : theme.ink }}
          >
            {cooldown > 0 ? `Reenviar en ${mm}:${ss}` : "Reenviar código"}
          </button>
          <button
            type="button"
            className="press"
            onClick={() => {
              toast("Corrige tu número de WhatsApp y vuelve a enviar.", "info");
              router.push(routes.amigo);
            }}
            style={secondaryBtn}
          >
            Corregir número
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          background: theme.white,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 16,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: confirming ? theme.green : "#9CA3AF",
            marginTop: 5,
            flexShrink: 0,
            transition: "background 160ms ease",
          }}
        />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: theme.muted }}>
          Mientras no confirmes, tu contacto queda en <strong style={{ color: theme.ink }}>estado gris · sin validar</strong> y no suma a la meta del líder.
        </p>
      </div>
    </div>
  );
}
