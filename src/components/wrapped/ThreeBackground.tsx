"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
  opacity?: number;
}

function ParticleField({ count = 500, color = "#ffffff", speed = 0.1, opacity = 0.3 }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.08;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={opacity}
      />
    </Points>
  );
}

interface FloatingOrbProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
}

function FloatingOrb({ position, color = "#7DD3FC", scale = 1, speed = 1 }: FloatingOrbProps) {
  const ref = useRef<THREE.Mesh>(null);
  const initialPos = useRef(position);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.y = initialPos.current[1] + Math.sin(t * 0.5) * 0.3;
      ref.current.position.x = initialPos.current[0] + Math.cos(t * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[scale, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

interface ThreeBackgroundProps {
  variant?: "intro" | "journey" | "celebration";
  intensity?: number;
}

export function ThreeBackground({ variant = "journey", intensity = 1 }: ThreeBackgroundProps) {
  // Much fewer particles for subtlety
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 200 : 400;
  
  const colors = {
    intro: { particles: "#7DD3FC", orbs: ["#7DD3FC", "#FBBF24", "#F87171"] },
    journey: { particles: "#ffffff", orbs: ["#7DD3FC", "#61DE58", "#FBBF24"] },
    celebration: { particles: "#FBBF24", orbs: ["#A78BFA", "#61DE58", "#FBBF24"] },
  };

  const colorScheme = colors[variant];

  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        {/* Subtle particle field */}
        <ParticleField 
          count={Math.floor(particleCount * intensity)} 
          color={colorScheme.particles} 
          speed={0.1 * intensity}
          opacity={0.25}
        />
        
        {/* Soft floating orbs - very subtle */}
        <FloatingOrb position={[-4, 2, -8]} color={colorScheme.orbs[0]} scale={2} speed={0.5} />
        <FloatingOrb position={[4, -1, -10]} color={colorScheme.orbs[1]} scale={2.5} speed={0.3} />
        <FloatingOrb position={[0, -3, -12]} color={colorScheme.orbs[2]} scale={3} speed={0.4} />
      </Canvas>
    </div>
  );
}

// Loading animation - cleaner, more elegant
export function ThreeLoader() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <LoaderAnimation />
      </Canvas>
    </div>
  );
}

function LoaderAnimation() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.2;
    }
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 1.5;
      ring1Ref.current.rotation.y = t * 0.5;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 1.2;
      ring2Ref.current.rotation.x = t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central pulsing dot */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.9} />
      </mesh>
      
      {/* Orbiting rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.6, 0.02, 16, 64]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.5} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.9, 0.015, 16, 64]} />
        <meshBasicMaterial color="#FBBF24" transparent opacity={0.4} />
      </mesh>
      
      {/* Subtle particles */}
      <ParticleField count={100} color="#ffffff" speed={0.5} opacity={0.2} />
    </group>
  );
}

// 3D Gallery with floating cards
interface GalleryCard3DProps {
  index: number;
  total: number;
  isSelected: boolean;
  onClick: () => void;
}

function GalleryCard3D({ index, total, isSelected, onClick }: GalleryCard3DProps) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3;
  
  const baseX = Math.sin(angle) * radius;
  const baseZ = Math.cos(angle) * radius - 2;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      // Gentle floating
      ref.current.position.y = Math.sin(t * 0.5 + index) * 0.1;
      // Always face camera slightly
      ref.current.rotation.y = -angle + Math.PI;
      // Scale on hover/select
      const targetScale = isSelected ? 1.2 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const colors = ["#7DD3FC", "#FBBF24", "#F87171", "#61DE58", "#A78BFA", "#7DD3FC", "#FBBF24", "#F87171", "#61DE58", "#A78BFA"];

  return (
    <mesh
      ref={ref}
      position={[baseX, 0, baseZ]}
      onClick={onClick}
    >
      <planeGeometry args={[0.8, 1.4]} />
      <meshBasicMaterial color={colors[index % colors.length]} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface ThreeGalleryProps {
  onSelectCard: (index: number) => void;
  selectedCard: number | null;
}

export function ThreeGallery({ onSelectCard, selectedCard }: ThreeGalleryProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Rotating gallery */}
        <group rotation={[0, 0, 0]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <GalleryCard3D
              key={i}
              index={i}
              total={10}
              isSelected={selectedCard === i}
              onClick={() => onSelectCard(i + 1)}
            />
          ))}
        </group>
        
        {/* Background particles */}
        <ParticleField count={200} color="#ffffff" speed={0.05} opacity={0.15} />
      </Canvas>
    </div>
  );
}
