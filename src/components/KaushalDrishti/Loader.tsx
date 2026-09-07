type Props = { visible: boolean; progress: number };

export function Loader({ visible, progress }: Props) {
  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#050505] transition-opacity duration-[900ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center">
        <p className="font-display text-[13px] uppercase tracking-[0.55em] text-paper/60">
          Loading
        </p>
        <p className="mt-6 font-display text-[42px] leading-none text-paper/85 tabular-nums">
          {String(Math.round(progress)).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
