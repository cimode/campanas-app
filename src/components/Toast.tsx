"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastTone = "info" | "success" | "warning" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

const toneColors: Record<ToastTone, string> = {
  info: "#0A1033",
  success: "#15803D",
  warning: "#B45309",
  error: "#DC2626",
};

/** Lightweight toast so mock actions (guardar, exportar, enviar…) give visible feedback. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    const id = nextId.current++;
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 1000,
          pointerEvents: "none",
          width: "min(92vw, 380px)",
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="fade-up"
            style={{
              background: toneColors[t.tone],
              color: "#FFFFFF",
              padding: "12px 16px",
              boxSizing: "border-box",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 8px 24px rgba(10,16,51,0.25)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
