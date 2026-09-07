import { useCallback, useEffect, useRef, useState } from "react";

export function usePageNavigation(total: number, duration = 1.05) {
  const [currentPage, setCurrentPage] = useState(0);
  const animating = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const lock = useCallback(() => {
    animating.current = true;
    setIsAnimating(true);
    window.setTimeout(() => {
      animating.current = false;
      setIsAnimating(false);
    }, duration * 1000);
  }, [duration]);

  const nextPage = useCallback(() => {
    if (animating.current) return;
    setCurrentPage((p) => {
      if (p >= total) return p;
      lock();
      return p + 1;
    });
  }, [lock, total]);

  const previousPage = useCallback(() => {
    if (animating.current) return;
    setCurrentPage((p) => {
      if (p <= 0) return p;
      lock();
      return p - 1;
    });
  }, [lock]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") previousPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, previousPage]);

  return { currentPage, nextPage, previousPage, isAnimating };
}
