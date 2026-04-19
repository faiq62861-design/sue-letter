import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

// Floating document mesh
function LegalDocument({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {/* Document body */}
      <boxGeometry args={[0.7, 0.9, 0.04]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
    </mesh>
  );
}

// Document text lines
function DocumentLines({
  position,
}: {
  position: [number, number, number];
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.003;
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  const lines = [
    [0, 0.28, 0.025],
    [-0.05, 0.14, 0.025],
    [0.03, 0.01, 0.025],
    [-0.02, -0.12, 0.025],
    [0.05, -0.25, 0.025],
  ] as const;

  return (
    <group ref={groupRef} position={position}>
      {lines.map((lp) => (
        <mesh key={`${lp[0]}-${lp[1]}`} position={lp}>
          <boxGeometry args={[0.42, 0.03, 0.005]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.8}
            opacity={0.6}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// Simplified gavel
function Gavel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.1 + 1) * 0.12;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, 0.4, 0.3]}>
      {/* Gavel head */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.55, 0.22, 0.22]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.055, 0.7, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Floating particles
function Particles() {
  const particlePositions: [number, number, number][] = [
    [-2.5, 1.2, -1],
    [2.8, -0.8, -1.5],
    [-1.8, -1.5, -0.5],
    [3.2, 1.8, -2],
    [-3.0, 0.5, -1.8],
    [1.5, 2.2, -1.2],
    [-0.8, -2.0, -0.8],
    [2.0, -1.8, -2.5],
  ];

  return (
    <>
      {particlePositions.map((pos) => (
        <ParticleOrb key={`${pos[0]}-${pos[1]}`} position={pos} />
      ))}
    </>
  );
}

function ParticleOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.008;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial
        color="#16a34a"
        emissive="#16a34a"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffe8cc" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={0.8}
        color="#e0f0ff"
        castShadow
      />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#16a34a" />

      <LegalDocument position={[-1.2, 0.2, 0]} />
      <DocumentLines position={[-1.2, 0.2, 0]} />

      <LegalDocument position={[1.0, -0.3, -0.5]} />
      <DocumentLines position={[1.0, -0.3, -0.5]} />

      <Gavel position={[0.3, 0.4, 0.2]} />

      <Particles />
    </>
  );
}

export function HeroScene3D({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
