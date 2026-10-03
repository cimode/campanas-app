import type { CSSProperties } from "react";
import { fontCondensed } from "@/lib/theme";

// Style fragments copied from the desktop mockups (09–11) so this page shares their visual language.

export const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5B6180",
};

export const selectStyle = (minWidth: number): CSSProperties => ({
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

export const h2Style: CSSProperties = {
  margin: 0,
  fontFamily: fontCondensed,
  fontWeight: 800,
  fontSize: 24,
  textTransform: "uppercase",
};

export const eyebrowSmall: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5B6180",
};

export const infoLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5B6180",
};

export const pill = (bg: string, fg: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: fg,
  background: bg,
  padding: "4px 10px",
  borderRadius: 999,
  whiteSpace: "nowrap",
});
