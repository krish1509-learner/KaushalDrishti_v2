import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PAGE_H, PAGE_W } from "./BookPage";

type Props = { count: number; side: "left" | "right"; zBase: number };

export function PageStack({ count, side, zBase }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#efe7d8",
        roughness: 0.95,
        metalness: 0,
        sheen: 0.05,
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.BoxGeometry(PAGE_W, PAGE_H, 1), []);
  const depth = Math.max(0.001, count * 0.0075);
  const target = useRef({ d: depth, z: zBase });

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    target.current.d += (depth - target.current.d) * (1 - Math.exp(-8 * dt));
    m.scale.z = target.current.d;
    m.position.z = zBase - target.current.d / 2;
    m.visible = count > 0;
  });

  const x = side === "right" ? PAGE_W / 2 : -PAGE_W / 2;

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      position={[x, 0, zBase]}
      castShadow
      receiveShadow
    />
  );
}
