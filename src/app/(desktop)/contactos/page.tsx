import type { Metadata } from "next";
import { ContactosScreen } from "./ContactosScreen";

export const metadata: Metadata = { title: "Contactos" };

export default function ContactosPage() {
  return <ContactosScreen />;
}
