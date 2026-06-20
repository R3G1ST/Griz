import { ReactNode } from "react";
import NeonNav from "@/components/NeonNav";
import NeonFooter from "@/components/NeonFooter";

type NeonPageProps = {
  children: ReactNode;
  /** Optional hero/banner area rendered between nav and the main content. */
  hero?: ReactNode;
  /** Eyebrow text shown above the page title. */
  eyebrow?: string;
  /** Big page title (will be auto-sized & colored neon). */
  title?: ReactNode;
  /** Lead paragraph under the title. */
  lead?: ReactNode;
};

/**
 * Standard neon page layout: NeonNav → smoke/grid hero with title → content → NeonFooter.
 * Pages that need a fully custom hero (like Home) should NOT use this and compose directly.
 */
export default function NeonPage({ children, hero, eyebrow, title, lead }: NeonPageProps) {
  return (
    <main className="min-h-screen bg-black text-white gn-root gn-sans">
      <NeonNav />

      {hero ?? (title ? (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gn-smoke opacity-80" />
          <div className="absolute inset-0 gn-grid opacity-50" />
          <div className="absolute inset-0 gn-scan opacity-60 pointer-events-none" />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14">
            {eyebrow && <div className="gn-chip mb-4 inline-flex">{eyebrow}</div>}
            <h1
              className="gn-display leading-[0.85] tracking-tighter"
              style={{ fontSize: "clamp(44px, 11vw, 120px)" }}
            >
              {title}
            </h1>
            {lead && (
              <p className="mt-5 sm:mt-6 max-w-[640px] text-[15px] sm:text-[17px] text-[#F5F1E8]/70 leading-relaxed">
                {lead}
              </p>
            )}
          </div>
          <div className="gn-divider opacity-70" />
        </section>
      ) : null)}

      <div className="relative">
        {children}
      </div>

      <NeonFooter />
    </main>
  );
}
