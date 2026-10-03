import type { Metadata } from "next";
import { InformeScreen } from "./Screen";

export const metadata: Metadata = { title: "Informe de campaña" };

export default function InformePage() {
  return <InformeScreen />;
}
