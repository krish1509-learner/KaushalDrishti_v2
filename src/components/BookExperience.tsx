import { useEffect, useState } from "react";
import { BookScene } from "../three/Scene";
import { Loader } from "./KaushalDrishti/Loader";
import { Navigation } from "./KaushalDrishti/Navigation";
import { usePageNavigation } from "../hook/usePageNavigation";
import { useTouchNavigation } from "../hook/useTouchNavigation";
import { TOTAL_SHEETS } from "../data/pages";

export function BookExperience() {
  const [fontsReady, setFontsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { currentPage, nextPage, previousPage } = usePageNavigation(TOTAL_SHEETS);
  useTouchNavigation(nextPage, previousPage);

  const handleComplete = () => {
    window.location.assign("/dashboard");
  };

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    let raf = 0;
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + (100 - p) * 0.06 + 0.7);
      setProgress(p);
      if (p < 99.4) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const done = () => {
      setFontsReady(true);
      window.setTimeout(() => {
        setProgress(100);
        setReady(true);
      }, 350);
    };
    if (fonts) fonts.ready.then(done).catch(done);
    else done();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#050505]">
      <div className="absolute inset-0">
        {fontsReady && (
          <BookScene currentPage={currentPage} ready={ready} reducedMotion={reducedMotion} />
        )}
      </div>

      <div className="vignette pointer-events-none absolute inset-0 z-10" />
      <div className="grain pointer-events-none absolute inset-0 z-10" />

      <header
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-7 transition-opacity duration-1000 md:px-12 md:pt-10 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="max-w-[15ch] font-display text-[11px] uppercase leading-[1.7] tracking-[0.42em] text-paper/55">
          KAUSHALDRISHTI SKILL &amp; OUTCOME TRACKING SYSTEM GUIDE
        </h1>
        <p className="hidden font-display text-[11px] uppercase tracking-[0.42em] text-paper/35 sm:block">
          AN INTERACTIVE GUIDE
        </p>
      </header>

      <div
        className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <Navigation
          onPrev={previousPage}
          onNext={nextPage}
          canPrev={currentPage > 0}
          canNext={currentPage < TOTAL_SHEETS}
          current={currentPage}
          total={TOTAL_SHEETS}
          onComplete={handleComplete}
        />
      </div>

      <Loader visible={!ready} progress={progress} />
    </div>
  );
}
