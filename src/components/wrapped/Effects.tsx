"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  total: number;
  current: number;
  onSegmentClick?: (index: number) => void;
}

export function ProgressBar({ total, current, onSegmentClick }: ProgressBarProps) {
  return (
    <div className="flex gap-1.5 w-full max-w-md px-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSegmentClick?.(i)}
          className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 cursor-pointer hover:bg-white/30 transition-colors"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ 
              width: i < current ? "100%" : i === current ? "100%" : "0%" 
            }}
            transition={{ 
              duration: i === current ? 5 : 0.3,
              ease: i === current ? "linear" : "easeOut"
            }}
          />
        </button>
      ))}
    </div>
  );
}

interface ParticleProps {
  color?: string;
  count?: number;
}

export function Particles({ color = "#ffffff", count = 20 }: ParticleProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -100 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 50],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

interface FloatingElementsProps {
  children: React.ReactNode;
}

export function FloatingElements({ children }: FloatingElementsProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

interface PulseRingProps {
  color?: string;
  size?: number;
  delay?: number;
}

export function PulseRing({ color = "#7DD3FC", size = 200, delay = 0 }: PulseRingProps) {
  return (
    <motion.div
      className="absolute rounded-full border-2"
      style={{
        borderColor: color,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{
        opacity: [0.8, 0],
        scale: [0.8, 1.5],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

interface GlowOrbProps {
  color: string;
  size?: number;
  x?: string;
  y?: string;
  blur?: number;
}

export function GlowOrb({ color, size = 300, x = "50%", y = "50%", blur = 100 }: GlowOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: color,
        width: size,
        height: size,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        filter: `blur(${blur}px)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Confetti explosion for celebrations
interface ConfettiProps {
  active: boolean;
  count?: number;
}

export function Confetti({ active, count = 50 }: ConfettiProps) {
  if (!active) return null;

  const colors = ["#7DD3FC", "#FBBF24", "#F87171", "#61DE58", "#A78BFA"];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3"
          style={{
            backgroundColor: colors[i % colors.length],
            left: "50%",
            top: "50%",
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * window.innerWidth,
            y: (Math.random() - 0.5) * window.innerHeight,
            rotate: Math.random() * 720,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
