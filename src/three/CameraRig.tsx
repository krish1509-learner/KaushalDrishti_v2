import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMouseParallax } from "../hook/useMouseParallax";

type Props = { open: boolean; ready: boolean };

export function CameraRig({ open, ready }: Props) {
  const { camera, size } = useThree();
  const pointer = useMouseParallax();
  const t = useRef(0);
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (ready) t.current = Math.min(1, t.current + dt / 1.4);
    const ease = 1 - Math.pow(1 - t.current, 3);

    const aspect = size.width / size.height;
    const mobile = size.width < 700;
    const baseZ = mobile ? 3.9 / Math.min(1, aspect / 0.62) : open ? 3.55 : 2.7;
    const z = THREE.MathUtils.lerp(baseZ + 1.15, baseZ, ease);

    const px = pointer.current.x;
    const py = pointer.current.y;

    const desiredX = px * 0.34;
    const desiredY = 0.18 + py * 0.26;

    camera.position.x += (desiredX - camera.position.x) * (1 - Math.exp(-3.2 * dt));
    camera.position.y += (desiredY - camera.position.y) * (1 - Math.exp(-3.2 * dt));
    camera.position.z += (z - camera.position.z) * (1 - Math.exp(-3.5 * dt));

    target.current.set(px * 0.06, py * 0.05 - 0.02, 0);
    camera.lookAt(target.current);
  });

  return null;
}
