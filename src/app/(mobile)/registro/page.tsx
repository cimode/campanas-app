import type { Metadata } from "next";
import { RegistroScreen } from "./RegistroScreen";

export const metadata: Metadata = { title: "Registro de líder · Paso 1" };

export default function Page() {
  return <RegistroScreen />;
}
