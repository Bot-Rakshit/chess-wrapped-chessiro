"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  formatNumber?: boolean;
  style?: CSSProperties;
}

export function AnimatedNumber({
  value,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
  formatNumber = true,
  style,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const timer = setTimeout(() => {
      const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTime - delay * 1000) / 1000;
        
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }

        const progress = Math.min(elapsed / duration, 1);
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, duration, delay, isInView]);

  const formattedValue = formatNumber
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
      style={style}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
}
