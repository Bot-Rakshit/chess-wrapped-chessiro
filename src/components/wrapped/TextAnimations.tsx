"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// Text reveal animation - words appear one by one
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function TextReveal({ text, className = "", delay = 0, staggerDelay = 0.08 }: TextRevealProps) {
  const words = text.split(" ");
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    }),
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap justify-center gap-x-2 ${className}`}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="inline-block">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Slide up animation for elements
interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SlideUp({ children, delay = 0, className = "" }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale in animation
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className = "" }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade in animation
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = "" }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1, 
  delay = 0, 
  className = "" 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Typewriter effect
interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function Typewriter({ text, className = "", delay = 0, speed = 50 }: TypewriterProps) {
  return (
    <motion.span
      initial={{ opacity: 1 }}
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * (speed / 1000) }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Flying card animation - cards fly in from random positions
interface FlyingCardProps {
  children: ReactNode;
  index: number;
  total: number;
  delay?: number;
  className?: string;
}

export function FlyingCard({ children, index, total, delay = 0, className = "" }: FlyingCardProps) {
  // Calculate random starting positions outside the viewport
  const startPositions = [
    { x: -300, y: -200, rotate: -45 },
    { x: 300, y: -150, rotate: 30 },
    { x: -250, y: 200, rotate: -30 },
    { x: 350, y: 150, rotate: 45 },
    { x: 0, y: -350, rotate: -20 },
    { x: -400, y: 0, rotate: 25 },
    { x: 400, y: 50, rotate: -35 },
    { x: 150, y: 300, rotate: 40 },
    { x: -150, y: 350, rotate: -25 },
    { x: 0, y: 400, rotate: 15 },
  ];
  
  const pos = startPositions[index % startPositions.length];
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: pos.x, 
        y: pos.y, 
        rotate: pos.rotate,
        scale: 0.5 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0, 
        rotate: 0,
        scale: 1 
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 90,
        delay: delay + index * 0.08,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulsing glow animation
interface PulseGlowProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function PulseGlow({ children, color = "cyan", className = "" }: PulseGlowProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        filter: [
          `drop-shadow(0 0 20px rgba(0,200,255,0.3))`,
          `drop-shadow(0 0 40px rgba(0,200,255,0.5))`,
          `drop-shadow(0 0 20px rgba(0,200,255,0.3))`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating animation
interface FloatProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export function Float({ children, className = "", duration = 3, distance = 10 }: FloatProps) {
  return (
    <motion.div
      animate={{
        y: [-distance/2, distance/2, -distance/2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Cinematic Story Animations
// ============================================

// Dramatic text reveal - letter by letter with blur
interface DramaticRevealProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function DramaticReveal({ text, className = "", delay = 0, speed = 0.05 }: DramaticRevealProps) {
  return (
    <motion.div className={`flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 1.5 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{
            duration: 0.4,
            delay: delay + i * speed,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Glitch text effect for dramatic moments
interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function GlitchText({ text, className = "", delay = 0 }: GlitchTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`relative ${className}`}
    >
      {/* Main text */}
      <span className="relative z-10">{text}</span>
      
      {/* Glitch layers */}
      <motion.span
        className="absolute inset-0 text-cyan-400 z-0"
        animate={{
          x: [-2, 2, -2, 0],
          opacity: [0, 0.8, 0, 0.5, 0],
        }}
        transition={{
          duration: 0.3,
          delay: delay + 0.5,
          repeat: 2,
          repeatDelay: 2,
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-red-400 z-0"
        animate={{
          x: [2, -2, 2, 0],
          opacity: [0, 0.8, 0, 0.5, 0],
        }}
        transition={{
          duration: 0.3,
          delay: delay + 0.55,
          repeat: 2,
          repeatDelay: 2,
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}

// Zoom burst animation for big numbers
interface ZoomBurstProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ZoomBurst({ children, delay = 0, className = "" }: ZoomBurstProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 3, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        damping: 15,
        stiffness: 100,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide from side with rotation
interface SlideRotateProps {
  children: ReactNode;
  delay?: number;
  from?: "left" | "right";
  className?: string;
}

export function SlideRotate({ children, delay = 0, from = "left", className = "" }: SlideRotateProps) {
  const xFrom = from === "left" ? -200 : 200;
  const rotateFrom = from === "left" ? -15 : 15;

  return (
    <motion.div
      initial={{ opacity: 0, x: xFrom, rotate: rotateFrom }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Cascade effect for lists
interface CascadeProps {
  children: ReactNode[];
  delay?: number;
  stagger?: number;
  className?: string;
}

export function Cascade({ children, delay = 0, stagger = 0.1, className = "" }: CascadeProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -50, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            type: "spring",
            damping: 20,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Heartbeat pulse for emphasis
interface HeartbeatProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Heartbeat({ children, delay = 0, className = "" }: HeartbeatProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1.1, 1, 1.05, 1],
        opacity: 1 
      }}
      transition={{
        duration: 0.8,
        delay,
        times: [0, 0.3, 0.5, 0.7, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Spotlight reveal effect
interface SpotlightRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SpotlightReveal({ children, delay = 0, className = "" }: SpotlightRevealProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.9,
        filter: "brightness(0.3) blur(5px)"
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        filter: "brightness(1) blur(0px)"
      }}
      transition={{
        duration: 1,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Counter animation for numbers with overshoot
interface CounterProps {
  value: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export function Counter({ value, delay = 0, duration = 2, className = "" }: CounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}

// Wipe reveal effect
interface WipeRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}

export function WipeReveal({ children, delay = 0, direction = "up", className = "" }: WipeRevealProps) {
  const clipPathStart = {
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
  };

  return (
    <motion.div
      initial={{ clipPath: clipPathStart[direction] }}
      animate={{ clipPath: "inset(0 0 0 0)" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bounce in with rotation
interface BounceInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function BounceIn({ children, delay = 0, className = "" }: BounceInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Shimmer effect for highlighting
interface ShimmerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Shimmer({ children, delay = 0, className = "" }: ShimmerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 1.5,
          delay: delay + 0.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </motion.div>
  );
}
