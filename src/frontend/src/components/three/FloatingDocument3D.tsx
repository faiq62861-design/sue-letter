import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";

function Document() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.005;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
  });

  const lineOffsets = [0.28, 0.14, 0.01, -0.12, -0.25] as const;

  return (
    <group ref={groupRef}>
      {/* Document base */}
      <mesh>
        <boxGeometry args={[1.0, 1.3, 0.06]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Header strip */}
      <mesh position={[0, 0.46, 0.035]}>
        <boxGeometry args={[0.7, 0.1, 0.01]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Text lines */}
      {lineOffsets.map((yOffset) => (
        <mesh key={yOffset} position={[0.03, yOffset - 0.08, 0.035]}>
          <boxGeometry args={[0.6, 0.04, 0.008]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.8}
            opacity={0.5}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingDocument3D({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} color="#ffe8cc" />
        <directionalLight
          position={[3, 4, 2]}
          intensity={0.9}
          color="#e0f0ff"
        />
        <pointLight position={[-2, 1, 2]} intensity={0.4} color="#16a34a" />
        <Suspense fallback={null}>
          <Document />
        </Suspense>
      </Canvas>
    </div>
  );
}
