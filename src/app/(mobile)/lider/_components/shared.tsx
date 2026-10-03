import type { CSSProperties } from "react";

export const LEADER_LINK = "red.candidato.co/r/laura-rincon";
export const LEADER_URL = `https://${LEADER_LINK}`;

/** Copies text to the clipboard, with a textarea fallback for non-secure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** The hardcoded personal QR used across the leader screens. */
export function QrMark({
  size,
  label,
  style,
}: {
  size: number;
  label: string;
  style?: CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 19 19" aria-label={label} role="img" style={style}>
      <path
        fill="#0A1033"
        d="M0 0h7v7H0zM12 0h7v7h-7zM0 12h7v7H0zM8 0h1v2H8zM10 1h1v3h-1zM8 3h2v1H8zM8 5h1v2H8zM10 6h1v1h-1zM0 8h1v1H0zM2 8h2v1H2zM5 8h3v1H5zM9 8h1v1H9zM11 8h2v1h-2zM14 8h1v1h-1zM16 8h3v1h-3zM1 10h2v1H1zM4 10h1v1H4zM6 10h2v1H6zM9 10h2v1H9zM12 10h1v1h-1zM14 10h2v1h-2zM17 10h2v1h-2zM8 12h2v1H8zM11 12h1v1h-1zM13 12h2v2h-2zM16 12h1v1h-1zM18 12h1v2h-1zM8 14h1v2H8zM10 14h1v1h-1zM12 14h1v3h-1zM15 14h2v1h-2zM9 16h2v1H9zM14 16h1v1h-1zM16 16h3v1h-3zM8 18h3v1H8zM13 18h2v1h-2zM17 18h1v1h-1z"
      />
      <path fill="#FFFFFF" d="M1 1h5v5H1zM13 1h5v5h-5zM1 13h5v5H1z" />
      <path fill="#0A1033" d="M2 2h3v3H2zM14 2h3v3h-3zM2 14h3v3H2z" />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

/**
 * Inline row styles set background:#FFFFFF, which beats the global `.rowhover:hover`
 * rule. This scoped rule restores the hover tint for rows on the leader screens.
 */
export function RowHoverStyle() {
  return (
    <style href="lider-rowhover" precedence="default">
      {".lider-row:hover{background:#F8F9FF !important}"}
    </style>
  );
}
