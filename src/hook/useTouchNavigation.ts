import { useEffect } from "react";

export function useTouchNavigation(next: () => void, prev: () => void) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    };

    let wheelLock = 0;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - wheelLock < 900) return;
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 24) return;
      wheelLock = now;
      if (d > 0) next();
      else prev();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("wheel", onWheel);
    };
  }, [next, prev]);
}
