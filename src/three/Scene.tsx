import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { Book } from "./Book";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";

type Props = { currentPage: number; ready: boolean; reducedMotion: boolean };

export function BookScene({ currentPage, ready, reducedMotion }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 34, position: [0, 0.18, 4.4], near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 6.5, 13]} />
      <Suspense fallback={null}>
        <Lighting />
        <Book currentPage={currentPage} ready={ready} reducedMotion={reducedMotion} />
      </Suspense>
      <CameraRig open={currentPage > 0} ready={ready} />
    </Canvas>
  );
}
