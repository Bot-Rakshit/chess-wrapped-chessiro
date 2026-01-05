"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
}

function ParticleField({ count = 2000, color = "#ffffff", speed = 0.2 }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.15;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

interface FloatingRingProps {
  radius?: number;
  color?: string;
  rotationSpeed?: number;
  delay?: number;
}

function FloatingRing({ radius = 2, color = "#7DD3FC", rotationSpeed = 0.5, delay = 0 }: FloatingRingProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay;
      ref.current.rotation.x = Math.sin(t * rotationSpeed) * 0.3;
      ref.current.rotation.y = t * rotationSpeed;
      ref.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

interface GlowingSphereProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
}

function GlowingSphere({ position, color = "#FBBF24", scale = 0.5 }: GlowingSphereProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(scale * (1 + Math.sin(t * 2) * 0.1));
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

interface ThreeBackgroundProps {
  variant?: "intro" | "journey" | "celebration";
  intensity?: number;
}

export function ThreeBackground({ variant = "journey", intensity = 1 }: ThreeBackgroundProps) {
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 2000;
  
  const colors = {
    intro: { particles: "#7DD3FC", rings: "#FBBF24", spheres: "#F87171" },
    journey: { particles: "#61DE58", rings: "#7DD3FC", spheres: "#FBBF24" },
    celebration: { particles: "#FBBF24", rings: "#A78BFA", spheres: "#61DE58" },
  };

  const colorScheme = colors[variant];

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        
        <ParticleField 
          count={Math.floor(particleCount * intensity)} 
          color={colorScheme.particles} 
          speed={0.2 * intensity}
        />
        
        <FloatingRing radius={2.5} color={colorScheme.rings} rotationSpeed={0.3} />
        <FloatingRing radius={3} color={colorScheme.rings} rotationSpeed={0.2} delay={Math.PI} />
        <FloatingRing radius={3.5} color={colorScheme.spheres} rotationSpeed={0.15} delay={Math.PI / 2} />
        
        <GlowingSphere position={[-3, 2, -2]} color={colorScheme.spheres} scale={0.8} />
        <GlowingSphere position={[3, -1, -3]} color={colorScheme.rings} scale={0.6} />
        <GlowingSphere position={[0, -2, -4]} color={colorScheme.particles} scale={1} />
      </Canvas>
    </div>
  );
}

// Loading animation with 3D elements
export function ThreeLoader() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <LoaderAnimation />
      </Canvas>
    </div>
  );
}

function LoaderAnimation() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
    }
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 2;
      ring1Ref.current.rotation.z = t * 0.5;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 1.5;
      ring2Ref.current.rotation.z = -t * 0.3;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 1.2;
      ring3Ref.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central pulsing sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.8} />
      </mesh>
      
      {/* Orbiting rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.8, 0.03, 16, 100]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.6} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#FBBF24" transparent opacity={0.5} />
      </mesh>
      
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.4, 0.015, 16, 100]} />
        <meshBasicMaterial color="#F87171" transparent opacity={0.4} />
      </mesh>
      
      {/* Floating particles */}
      <ParticleField count={300} color="#ffffff" speed={1} />
    </group>
  );
}
