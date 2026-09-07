type Props = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  current: number;
  total: number;
  onComplete?: () => void;
};

export function Navigation({
  onPrev,
  onNext,
  canPrev,
  canNext,
  current,
  total,
  onComplete,
}: Props) {
  const isFinalPage = current === total;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-7 md:px-12 md:pb-10">
      <button
        type="button"
        aria-label="Previous page"
        onClick={onPrev}
        disabled={!canPrev}
        className="edge-btn pointer-events-auto"
      >
        <span aria-hidden>←</span> Prev
      </button>

      <p className="hidden select-none font-display text-[11px] uppercase tracking-[0.42em] text-paper/40 sm:block">
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>

      <button
        type="button"
        aria-label={isFinalPage ? "Get started" : "Next page"}
        onClick={isFinalPage ? onComplete : onNext}
        disabled={isFinalPage ? !onComplete : !canNext}
        className={`${isFinalPage ? "completion-btn" : "edge-btn"} pointer-events-auto`}
      >
        {isFinalPage ? "Get started" : current === 0 ? "Open book" : "Next"}{" "}
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
