import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Hosts a 390×844 mobile screen. On a phone it fills the viewport;
 * on wider screens it renders inside a phone-shaped frame.
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-4 sm:bg-[#E9EBF5] sm:py-6">
      <div className="hidden sm:block">
        <Link href="/" className="text-[13px] font-semibold text-muted no-underline hover:text-ink">
          ← Todas las pantallas
        </Link>
      </div>
      <div
        className="relative h-dvh w-full overflow-hidden bg-canvas sm:h-[min(844px,calc(100dvh-130px))] sm:min-h-[560px] sm:w-[390px] sm:rounded-[44px] sm:shadow-[0_30px_80px_rgba(10,16,51,0.28),0_0_0_10px_#0A1033]"
      >
        {children}
      </div>
    </div>
  );
}
