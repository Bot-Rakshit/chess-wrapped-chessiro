"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ProgressBarProps {
  total: number;
  current: number;
  onSegmentClick?: (index: number) => void;
  compact?: boolean;
  segmentDurations?: number[]; // Duration in seconds for each segment
}

export function ProgressBar({ total, current, onSegmentClick, compact = false, segmentDurations }: ProgressBarProps) {
  return (
    <div className={`flex justify-center w-full ${compact ? 'opacity-60' : ''}`}>
      <div className="flex gap-0.5 w-full max-w-[420px] md:max-w-[480px] lg:max-w-[520px] px-4">
        {Array.from({ length: total }).map((_, i) => {
          // Get duration for this segment (default 5 seconds)
          const duration = segmentDurations?.[i] ?? 5;
          
          return (
            <button
              key={i}
              onClick={() => onSegmentClick?.(i)}
              className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20 cursor-pointer hover:bg-white/30 transition-colors"
            >
              {i < current ? (
                // Completed segments - no animation, instant fill
                <div className="h-full w-full bg-white rounded-full" />
              ) : i === current ? (
                // Current segment - animate fill with dynamic duration
                <motion.div
                  key={`segment-${i}-${current}`}
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: duration, ease: "linear" }}
                />
              ) : (
                // Future segments - empty
                <div className="h-full w-0 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ParticleProps {
  color?: string;
  count?: number;
}

export function Particles({ color = "#ffffff", count = 20 }: ParticleProps) {
  // Memoize particle data to prevent recalculation on every render
  const particles = useMemo(() => {
    // Reduce count on mobile for better performance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const actualCount = isMobile ? Math.min(count, 8) : count;
    
    return Array.from({ length: actualCount }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      yMove: -100 - Math.random() * 100,
      xMove: (Math.random() - 0.5) * 50,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
      repeatDelay: Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full will-change-transform"
          style={{ 
            backgroundColor: color,
            left: particle.left,
            top: particle.top,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, particle.yMove],
            x: [0, particle.xMove],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: particle.repeatDelay,
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
      className="absolute rounded-full pointer-events-none will-change-transform"
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
  const colors = ["#7DD3FC", "#FBBF24", "#F87171", "#61DE58", "#A78BFA"];
  
  // Memoize confetti data
  const confettiPieces = useMemo(() => {
    // Reduce count on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const actualCount = isMobile ? Math.min(count, 30) : count;
    
    return Array.from({ length: actualCount }).map((_, i) => ({
      color: colors[i % colors.length],
      isCircle: Math.random() > 0.5,
      xMove: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 400),
      yMove: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerHeight : 800),
      rotation: Math.random() * 720,
      duration: 2 + Math.random(),
    }));
  }, [count]);
  
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((piece, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 will-change-transform"
          style={{
            backgroundColor: piece.color,
            left: "50%",
            top: "50%",
            borderRadius: piece.isCircle ? "50%" : "0",
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: piece.xMove,
            y: piece.yMove,
            rotate: piece.rotation,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: piece.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
