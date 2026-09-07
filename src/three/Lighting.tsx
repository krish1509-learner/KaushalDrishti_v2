import { Environment, Lightformer } from "@react-three/drei";

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#b9c2d0" />
      <directionalLight
        position={[3.2, 4.4, 3.6]}
        intensity={2.6}
        color="#fff4e2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0008}
      />
      <pointLight position={[-3.4, 1.2, 2.2]} intensity={6} color="#5f6f8a" distance={12} decay={2} />
      <pointLight position={[0, -1.8, 2.6]} intensity={2.2} color="#c9a37a" distance={9} decay={2} />
      <Environment resolution={128}>
        <Lightformer intensity={1.4} position={[0, 3.5, 2]} scale={[8, 4, 1]} color="#ffffff" />
        <Lightformer
          intensity={0.5}
          color="#6d7c92"
          position={[-4, 0.5, 1]}
          rotation-y={Math.PI / 2}
          scale={[10, 4, 1]}
        />
        <Lightformer
          intensity={0.35}
          color="#3b3630"
          position={[4, 0, 1]}
          rotation-y={-Math.PI / 2}
          scale={[10, 4, 1]}
        />
      </Environment>
    </>
  );
}
