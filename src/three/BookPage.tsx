import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Sheet } from "../data/pages";
import { faceTexture } from "./pageArt";

export const PAGE_W = 1.0;
export const PAGE_H = 1.4;
export const SHEET_GAP = 0.006;
const HALF_T = 0.0022;

export type PageHandle = { t: number; lift: number };

type Props = {
  sheet: Sheet;
  index: number;
  handle: PageHandle;
  targetZ: number;
  isTop: boolean;
  isCover: boolean;
  onCornerHover: (v: number) => void;
};

function BookPageImpl({ sheet, handle, targetZ, isTop, isCover, onCornerHover }: Props) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 28, 2);
    g.translate(PAGE_W / 2, 0, 0);
    const pos = g.attributes["position"] as THREE.BufferAttribute;
    g.setAttribute("basePosition", pos.clone());
    return g;
  }, []);

  const [frontTex, backTex] = useMemo(() => {
    const f = faceTexture(sheet.front);
    const b = faceTexture(sheet.back);
    b.wrapS = THREE.RepeatWrapping;
    b.repeat.x = -1;
    b.offset.x = 1;
    return [f, b];
  }, [sheet]);

  const [frontMat, backMat] = useMemo(() => {
    const common = {
      roughness: isCover ? 0.72 : 0.94,
      metalness: 0,
      sheen: isCover ? 0.25 : 0.05,
    } as const;
    const f = new THREE.MeshPhysicalMaterial({
      map: frontTex,
      side: THREE.FrontSide,
      ...common,
    });
    const b = new THREE.MeshPhysicalMaterial({
      map: backTex,
      side: THREE.BackSide,
      ...common,
    });
    return [f, b];
  }, [frontTex, backTex, isCover]);

  const smoothZ = useRef(targetZ);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);

    g.rotation.y = -Math.PI * handle.t - handle.lift;

    smoothZ.current += (targetZ - smoothZ.current) * (1 - Math.exp(-9 * dt));
    g.position.z = smoothZ.current;

    const p = Math.sin(Math.PI * Math.min(1, Math.max(0, handle.t)));
    const curl = p * 0.22 + handle.lift * 0.35;
    const base = geometry.getAttribute("basePosition") as THREE.BufferAttribute;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x0 = base.getX(i);
      const y0 = base.getY(i);
      const u = x0 / PAGE_W;
      const bend = Math.sin(Math.PI * u) * curl;
      const tipDroop = u * u * curl * 0.25 * (y0 / (PAGE_H / 2));
      pos.setXYZ(i, x0 * (1 - 0.05 * p * u), y0 - tipDroop * 0.2, bend);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group ref={group}>
      <mesh
        geometry={geometry}
        material={frontMat}
        position={[0, 0, HALF_T]}
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          if (!isTop || !e.uv) return;
          const near = e.uv.x > 0.82 && e.uv.y < 0.22;
          if (near !== hovered) {
            setHovered(near);
            onCornerHover(near ? 0.16 : 0);
          }
        }}
        onPointerOut={() => {
          if (hovered) {
            setHovered(false);
            onCornerHover(0);
          }
        }}
      />
      <mesh geometry={geometry} material={backMat} position={[0, 0, -HALF_T]} castShadow receiveShadow />
    </group>
  );
}

export const BookPage = memo(BookPageImpl);
