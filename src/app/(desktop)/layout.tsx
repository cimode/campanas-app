import { DesktopShell } from "@/components/DesktopShell";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return <DesktopShell>{children}</DesktopShell>;
}
