'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial, OrbitControls } from '@react-three/drei';

interface CrystalSceneProps {
  score: number; // 0-100, drives color + rotation speed
}

function getColorForScore(score: number): string {
  if (score >= 80) return '#22c55e'; // green - top performer
  if (score >= 55) return '#eab308'; // yellow - average
  return '#ef4444'; // red - needs attention
}

function Crystal({ score }: CrystalSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(getColorForScore(score)), [score]);
  // Lower scores spin faster/more erratically to visually read as "unstable"
  const speed = useMemo(() => 0.15 + ((100 - score) / 100) * 0.5, [score]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * speed * 0.6;
    meshRef.current.rotation.y += delta * speed;

    const { pointer } = state;
    meshRef.current.rotation.x += pointer.y * 0.01;
    meshRef.current.rotation.y += pointer.x * 0.01;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <Icosahedron ref={meshRef} args={[1.6, 1]}>
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={2}
          roughness={0.15}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </Icosahedron>
    </Float>
  );
}

function OrbitRings({ score }: CrystalSceneProps) {
  const color = useMemo(() => new THREE.Color(getColorForScore(score)), [score]);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.2;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.15;
  });

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[2.6, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[3.1, 0.015, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export default function CrystalScene({ score }: CrystalSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#6366f1" />
      <Crystal score={score} />
      <OrbitRings score={score} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
