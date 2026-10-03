import type { Metadata } from "next";
import { QrScreen } from "./QrScreen";

export const metadata: Metadata = { title: "Escanea QR · Entrada a la red" };

export default function Page() {
  return <QrScreen />;
}
