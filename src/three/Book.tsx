import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SHEETS } from "../data/pages";
import { BookPage, PAGE_H, PAGE_W, SHEET_GAP, type PageHandle } from "./BookPage";
import { PageStack } from "./PageStack";
import { useMouseParallax } from "../hook/useMouseParallax";

type Props = {
  currentPage: number;
  ready: boolean;
  turnDuration?: number;
  reducedMotion?: boolean;
};

export function Book({ currentPage, ready, turnDuration = 1.05, reducedMotion = false }: Props) {
  const root = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const pointer = useMouseParallax();

  const handles = useMemo<PageHandle[]>(
    () => SHEETS.map(() => ({ t: 0, lift: 0 })),
    [],
  );
  const liftTargets = useRef<number[]>(SHEETS.map(() => 0));
  const prev = useRef(0);
  const turn = useRef<{ i: number; from: number; to: number; elapsed: number } | null>(null);

  useEffect(() => {
    const from = prev.current;
    if (from === currentPage) return;
    prev.current = currentPage;
    const changed = from < currentPage ? currentPage - 1 : currentPage;
    const target = from < currentPage ? 1 : 0;
    handles.forEach((h, i) => {
      if (i === changed) return;
      h.t = i < currentPage ? 1 : 0;
    });
    const h = handles[changed];
    if (!h) return;
    if (reducedMotion) {
      h.t = target;
      turn.current = null;
      return;
    }
    turn.current = { i: changed, from: h.t, to: target, elapsed: 0 };
  }, [currentPage, handles, reducedMotion]);

  useEffect(() => {
    if (!ready || !root.current || reducedMotion) return;
    const g = root.current;
    g.scale.setScalar(0.94);
    gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: "power3.out" });
    gsap.fromTo(
      g.position,
      { y: -0.16 },
      { y: 0, duration: 1.4, ease: "power3.out" },
    );
    gsap.fromTo(
      g.rotation,
      { y: -0.55 },
      { y: 0, duration: 1.6, ease: "power3.out" },
    );
  }, [ready, reducedMotion]);

  const open = currentPage > 0;
  const offsetX = useRef(-PAGE_W / 2);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = inner.current;
    if (!g) return;
    const desired = open ? 0 : -PAGE_W / 2;
    offsetX.current += (desired - offsetX.current) * (1 - Math.exp(-4.5 * dt));
    g.position.x = offsetX.current;

    const px = pointer.current.x;
    const py = pointer.current.y;
    g.rotation.y += (-px * 0.16 - g.rotation.y) * (1 - Math.exp(-3 * dt));
    g.rotation.x += (py * 0.1 + 0.06 - g.rotation.x) * (1 - Math.exp(-3 * dt));

    handles.forEach((h, i) => {
      const lt = liftTargets.current[i] ?? 0;
      h.lift += (lt - h.lift) * (1 - Math.exp(-7 * dt));
    });

    const tn = turn.current;
    if (tn) {
      tn.elapsed += dt;
      const p = Math.min(1, tn.elapsed / turnDuration);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const h = handles[tn.i];
      if (h) h.t = tn.from + (tn.to - tn.from) * eased;
      if (p >= 1) turn.current = null;
    }
  });

  const turned = currentPage;
  const remaining = SHEETS.length - currentPage;

  return (
    <group ref={root}>
      <group ref={inner}>
        <PageStack count={Math.max(0, remaining - 1)} side="right" zBase={-remaining * SHEET_GAP} />
        <PageStack count={Math.max(0, turned - 1)} side="left" zBase={-turned * SHEET_GAP} />
        {SHEETS.map((sheet, i) => {
          const isTurned = i < currentPage;
          const z = isTurned
            ? -(currentPage - 1 - i) * SHEET_GAP
            : -(i - currentPage) * SHEET_GAP;
          const handle = handles[i]!;
          return (
            <BookPage
              key={i}
              index={i}
              sheet={sheet}
              handle={handle}
              targetZ={z}
              isCover={i === 0 || i === SHEETS.length - 1}
              isTop={i === currentPage}
              onCornerHover={(v) => {
                liftTargets.current[i] = v;
              }}
            />
          );
        })}
        <mesh position={[0, 0, -(SHEETS.length * SHEET_GAP) / 2]} castShadow>
          <boxGeometry args={[0.035, PAGE_H + 0.01, SHEETS.length * SHEET_GAP + 0.02]} />
          <meshPhysicalMaterial color="#201d19" roughness={0.85} metalness={0} />
        </mesh>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -PAGE_H / 2 - 0.35, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <shadowMaterial opacity={0.42} />
      </mesh>
    </group>
  );
}
