"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { WrappedStats } from "@/lib/types";
import { AnimatedNumber } from "./AnimatedNumber";
import { TextReveal, SlideUp, ScaleIn, FadeIn, StaggerContainer, StaggerItem, FlyingCard, Float, PulseGlow, DramaticReveal, ZoomBurst, Heartbeat, Shimmer, WipeReveal, SpotlightReveal } from "./TextAnimations";
import { GlowOrb, Particles, FloatingElements, PulseRing } from "./Effects";
import * as StoryContext from "./StoryContext";

interface SlideProps {
  stats: WrappedStats;
  isActive: boolean;
}

// Helper to format numbers
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// ============================================
// Slide 0: Intro (No matching card - just greeting)
// ============================================
export function IntroSlide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-black to-amber-950/20" />
      
      {/* Pulsing orbs */}
      <GlowOrb color="rgba(6, 182, 212, 0.2)" size={400} x="30%" y="25%" blur={120} />
      <GlowOrb color="rgba(251, 191, 36, 0.15)" size={350} x="70%" y="75%" blur={100} />
      
      {/* Particles */}
      <Particles color="#7DD3FC" count={15} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Year label - flies down */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", damping: 15 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="text-cyan-400 text-lg font-bold tracking-[0.2em]">2025</span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
          <span className="text-white/60 text-sm tracking-[0.2em]">CHESS</span>
        </motion.div>
        
        {/* Capsule Logo - scales in with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", damping: 12 }}
        >
          <PulseGlow>
            <Image
              src="/capsule-logo.svg"
              alt="Capsule"
              width={260}
              height={75}
              className="brightness-0 invert"
            />
          </PulseGlow>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mt-6 mb-8"
        />

        {/* Profile Card - flies up */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, type: "spring", damping: 15 }}
          className="flex flex-col items-center"
        >
          {/* Avatar with animated ring */}
          <div className="relative mb-4">
            <motion.div 
              className="absolute -inset-2 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #7DD3FC, #FBBF24, #F87171, #7DD3FC)"
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute -inset-2 rounded-full bg-black/50 backdrop-blur-sm" />
            {stats.profile.avatar ? (
              <Image
                src={stats.profile.avatar}
                alt={stats.username}
                width={90}
                height={90}
                className="relative rounded-full border-2 border-black z-10"
              />
            ) : (
              <div className="relative w-[90px] h-[90px] rounded-full bg-gradient-to-br from-cyan-500 to-amber-500 flex items-center justify-center z-10">
                <span className="font-[var(--font-syncopate)] text-3xl font-bold text-black">
                  {stats.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Username */}
          <div className="flex items-center gap-2">
            {stats.profile.title && (
              <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded">
                {stats.profile.title}
              </span>
            )}
            <span className="text-xl font-semibold text-white">{stats.username}</span>
          </div>
        </motion.div>

        {/* Tap prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <Float distance={6} duration={2}>
            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Float>
          <span className="text-white/30 text-xs tracking-wide">tap to begin</span>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Slide 1 = Card 1: Game Outcomes (Games, Wins, Checkmates)
// ============================================
export function Card1Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const gamesPlayed = stats.summary.totalGames;
  const wins = stats.summary.totalWins;
  const checkmates = stats.checkmates.given;

  // Intelligent reaction based on performance
  const winRate = stats.summary.overallWinRate;
  const performanceText = winRate >= 60 
    ? "You dominated the board!" 
    : winRate >= 50 
      ? "Solid performance!" 
      : "Every game is a lesson!";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(235, 151, 25, 0.2)" size={350} x="50%" y="35%" blur={100} />
      <Particles color="#EB9719" count={12} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-10">
        {/* Games Played */}
        <div className="flex flex-col items-center">
          <FadeIn delay={0.1}>
            <span className="text-sm text-white/60 tracking-[0.2em] uppercase mb-2">You played</span>
          </FadeIn>
          <ZoomBurst delay={0.2}>
            <AnimatedNumber
              value={gamesPlayed}
              className="font-[var(--font-syncopate)] text-7xl md:text-8xl font-bold text-[#EB9719]"
              delay={0.3}
              duration={2}
            />
          </ZoomBurst>
          <SlideUp delay={0.8}>
            <span className="text-xl text-white/80 mt-2">games of chess</span>
          </SlideUp>
        </div>

        {/* Wins */}
        <div className="flex flex-col items-center">
          <FadeIn delay={1}>
            <span className="text-sm text-white/60 tracking-[0.2em] uppercase mb-2">And claimed</span>
          </FadeIn>
          <Heartbeat delay={1.1}>
            <AnimatedNumber
              value={wins}
              className="font-[var(--font-syncopate)] text-6xl md:text-7xl font-bold text-[#E26521]"
              delay={1.2}
              duration={2}
            />
          </Heartbeat>
          <SlideUp delay={1.6}>
            <span className="text-xl text-white/80 mt-2">glorious victories</span>
          </SlideUp>
        </div>

        {/* Checkmates */}
        <div className="flex flex-col items-center">
          <FadeIn delay={2}>
            <span className="text-sm text-white/60 tracking-[0.2em] uppercase mb-2">Delivering</span>
          </FadeIn>
          <Shimmer delay={2.1}>
            <AnimatedNumber
              value={checkmates}
              className="font-[var(--font-syncopate)] text-6xl md:text-7xl font-bold text-[#F22E2E]"
              delay={2.2}
              duration={2}
            />
          </Shimmer>
          <SlideUp delay={2.6}>
            <span className="text-xl text-white/80 mt-2">crushing checkmates</span>
          </SlideUp>
        </div>

        {/* Intelligent performance text */}
        <FadeIn delay={3}>
          <span className="text-white/50 text-sm italic mt-2">{performanceText}</span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 2 = Card 2: Time & Moves
// ============================================
export function Card2Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const totalMinutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const totalDays = Math.floor(totalMinutes / 1440);
  const totalMoves = stats.activity.totalMoves;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(97, 222, 88, 0.4)" size={350} x="50%" y="50%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-12">
        <SlideUp delay={0.1}>
          <span className="text-2xl text-[#CEFFDD] font-bold italic">You played</span>
        </SlideUp>

        {/* Minutes */}
        <FloatingElements>
          <div className="flex flex-col items-center">
            <AnimatedNumber
              value={totalMinutes}
              className="font-[var(--font-syncopate)] text-6xl md:text-7xl font-bold text-[#61DE58]"
              delay={0.3}
              duration={2}
            />
            <SlideUp delay={0.8}>
              <span className="text-xl text-[#CEFFDD] mt-2">
                minutes (that&apos;s {totalDays} days)
              </span>
            </SlideUp>
          </div>
        </FloatingElements>

        {/* Moves */}
        <div className="flex flex-col items-center">
          <AnimatedNumber
            value={totalMoves}
            className="font-[var(--font-syncopate)] text-5xl md:text-6xl font-bold text-[#61DE58]"
            delay={1}
            duration={2}
          />
          <SlideUp delay={1.5}>
            <span className="text-xl text-[#CEFFDD] mt-2">moves</span>
          </SlideUp>
        </div>

        <SlideUp delay={1.8}>
          <span className="text-2xl text-[#CEFFDD] font-bold italic">Now that&apos;s Impressive!</span>
        </SlideUp>
      </div>
    </div>
  );
}

// ============================================
// Slide 3 = Card 3: Play Style (Wizard)
// ============================================
export function Card3Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const timeControls = stats.timeControls || [];
  
  // Aggregate by timeClass to avoid duplicates
  const aggregated: Record<string, number> = {};
  timeControls.forEach(tc => {
    const key = tc.timeClass;
    aggregated[key] = (aggregated[key] || 0) + tc.games;
  });
  
  const rapid = aggregated["rapid"] || 0;
  const blitz = aggregated["blitz"] || 0;
  const bullet = aggregated["bullet"] || 0;
  
  const total = rapid + blitz + bullet || 1;
  const mostPlayed = stats.summary.mostPlayedFormat?.toUpperCase() || "BLITZ";
  const mostPlayedPercent = Math.round((Math.max(rapid, blitz, bullet) / total) * 100);

  const barWidth = 280;
  const rapidWidth = (rapid / total) * barWidth;
  const blitzWidth = (blitz / total) * barWidth;
  const bulletWidth = (bullet / total) * barWidth;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(125, 211, 252, 0.3)" size={300} x="50%" y="40%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-10">
        <SlideUp delay={0.1}>
          <span className="text-xl text-white/80">You&apos;re a</span>
        </SlideUp>
        
        <SlideUp delay={0.3}>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-syncopate)] text-6xl md:text-7xl font-bold text-[#7DD3FC]">
              {mostPlayed}
            </span>
            <span className="font-[var(--font-syncopate)] text-6xl md:text-7xl font-bold text-[#7DD3FC]">
              WIZARD
            </span>
          </div>
        </SlideUp>

        {/* Bar Chart */}
        <SlideUp delay={0.6}>
          <div className="flex flex-col items-center gap-3">
            {/* Values */}
            <div className="flex justify-between w-[280px]">
              <span className="font-[var(--font-syncopate)] text-xl font-bold text-[#7DD3FC]">{rapid}</span>
              <span className="font-[var(--font-syncopate)] text-xl font-bold text-[#FBBF24]">{blitz}</span>
              <span className="font-[var(--font-syncopate)] text-xl font-bold text-[#F87171]">{bullet}</span>
            </div>
            
            {/* Segmented Bar */}
            <div className="flex w-[280px] h-8 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#7DD3FC]"
                initial={{ width: 0 }}
                animate={{ width: rapidWidth }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              <motion.div
                className="h-full bg-[#FBBF24]"
                initial={{ width: 0 }}
                animate={{ width: blitzWidth }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              <motion.div
                className="h-full bg-[#F87171]"
                initial={{ width: 0 }}
                animate={{ width: bulletWidth }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between w-[280px]">
              <span className="text-sm font-bold text-[#7DD3FC]">Rapid</span>
              <span className="text-sm font-bold text-[#FBBF24]">Blitz</span>
              <span className="text-sm font-bold text-[#F87171]">Bullet</span>
            </div>
          </div>
        </SlideUp>

        <FadeIn delay={1.5}>
          <span className="text-lg text-white/80">
            {mostPlayedPercent}% of your games are {mostPlayed.charAt(0) + mostPlayed.slice(1).toLowerCase()}
          </span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 4 = Card 4: Your Journey (Ratings History with Line Graph)
// ============================================
export function Card4Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const history = stats.ratings.history || [];
  const ratings = stats.ratings.current || {};
  
  const rapidPeak = history.find(h => h.format === "rapid")?.peak || ratings.rapid || 0;
  const blitzPeak = history.find(h => h.format === "blitz")?.peak || ratings.blitz || 0;
  const bulletPeak = history.find(h => h.format === "bullet")?.peak || ratings.bullet || 0;

  const rapidHistory = history.find(h => h.format === "rapid")?.dataPoints || [];
  const blitzHistory = history.find(h => h.format === "blitz")?.dataPoints || [];
  const bulletHistory = history.find(h => h.format === "bullet")?.dataPoints || [];

  // Sample evenly across the entire dataset
  const sampleDataPoints = (dataPoints: { rating: number }[], sampleSize: number = 20) => {
    if (dataPoints.length <= sampleSize) return dataPoints;
    const step = (dataPoints.length - 1) / (sampleSize - 1);
    const sampled = [];
    for (let i = 0; i < sampleSize; i++) {
      const index = Math.round(i * step);
      sampled.push(dataPoints[index]);
    }
    return sampled;
  };

  const sampledRapid = sampleDataPoints(rapidHistory);
  const sampledBlitz = sampleDataPoints(blitzHistory);
  const sampledBullet = sampleDataPoints(bulletHistory);

  const allRatings = [
    ...sampledRapid.map(p => p.rating),
    ...sampledBlitz.map(p => p.rating),
    ...sampledBullet.map(p => p.rating),
  ].filter(r => r > 0);
  
  const maxRating = allRatings.length > 0 ? Math.max(...allRatings) : 2000;
  const minRating = allRatings.length > 0 ? Math.min(...allRatings) : 1000;
  const ratingRange = maxRating - minRating || 500;
  const paddedMin = Math.floor((minRating - ratingRange * 0.15) / 50) * 50;
  const paddedMax = Math.ceil((maxRating + ratingRange * 0.15) / 50) * 50;

  const chartWidth = 300;
  const chartHeight = 150;
  const chartMarginLeft = 40;
  const chartMarginBottom = 25;
  const chartMarginTop = 10;

  const createLinePath = (dataPoints: { rating: number }[]) => {
    if (dataPoints.length < 2) return "";
    const range = paddedMax - paddedMin || 1;
    const drawableHeight = chartHeight - chartMarginBottom - chartMarginTop;
    
    const points = dataPoints.map((point, i, arr) => {
      const x = chartMarginLeft + (i / (arr.length - 1)) * (chartWidth - chartMarginLeft);
      const y = chartMarginTop + drawableHeight - ((point.rating - paddedMin) / range) * drawableHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(125, 211, 252, 0.2)" size={300} x="30%" y="40%" />
      <GlowOrb color="rgba(251, 191, 36, 0.2)" size={250} x="70%" y="50%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <SlideUp delay={0.1}>
          <span className="text-3xl font-bold text-white">Your Journey</span>
        </SlideUp>

        {/* Line Chart */}
        <SlideUp delay={0.3}>
          <div className="relative" style={{ width: chartWidth, height: chartHeight }}>
            <svg width={chartWidth} height={chartHeight} className="overflow-visible">
              {/* Grid lines */}
              <line x1={chartMarginLeft} y1={chartMarginTop} x2={chartMarginLeft} y2={chartHeight - chartMarginBottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1={chartMarginLeft} y1={chartHeight - chartMarginBottom} x2={chartWidth} y2={chartHeight - chartMarginBottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              
              {/* Animated lines */}
              {sampledRapid.length >= 2 && (
                <motion.path
                  d={createLinePath(sampledRapid)}
                  fill="none"
                  stroke="#7DD3FC"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                />
              )}
              {sampledBlitz.length >= 2 && (
                <motion.path
                  d={createLinePath(sampledBlitz)}
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
                />
              )}
              {sampledBullet.length >= 2 && (
                <motion.path
                  d={createLinePath(sampledBullet)}
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.9, ease: "easeOut" }}
                />
              )}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-white/50 font-[var(--font-syncopate)]" style={{ height: chartHeight - chartMarginBottom }}>
              <span>{paddedMax}</span>
              <span>{Math.round((paddedMax + paddedMin) / 2)}</span>
              <span>{paddedMin}</span>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] text-white/50">
              <span>Jan</span>
              <span>Jul</span>
              <span>Dec</span>
            </div>
          </div>
        </SlideUp>

        {/* Legend */}
        <FadeIn delay={1.5}>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#7DD3FC] rounded" />
              <span className="text-xs text-[#7DD3FC]">Rapid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#FBBF24] rounded" />
              <span className="text-xs text-[#FBBF24]">Blitz</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#F87171] rounded" />
              <span className="text-xs text-[#F87171]">Bullet</span>
            </div>
          </div>
        </FadeIn>

        {/* Peak Ratings */}
        <SlideUp delay={1.8}>
          <span className="text-xl font-bold text-white mb-2">Your Peaks</span>
        </SlideUp>

        <StaggerContainer delay={2} staggerDelay={0.2} className="flex gap-8">
          <StaggerItem className="flex flex-col items-center">
            <AnimatedNumber
              value={rapidPeak}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#7DD3FC]"
              delay={2.1}
              duration={1.5}
            />
            <span className="text-sm font-bold text-[#7DD3FC] mt-1">Rapid</span>
          </StaggerItem>
          
          <StaggerItem className="flex flex-col items-center">
            <AnimatedNumber
              value={blitzPeak}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#FBBF24]"
              delay={2.3}
              duration={1.5}
            />
            <span className="text-sm font-bold text-[#FBBF24] mt-1">Blitz</span>
          </StaggerItem>
          
          <StaggerItem className="flex flex-col items-center">
            <AnimatedNumber
              value={bulletPeak}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#F87171]"
              delay={2.5}
              duration={1.5}
            />
            <span className="text-sm font-bold text-[#F87171] mt-1">Bullet</span>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}

// ============================================
// Slide 5 = Card 5: Rating Gains
// ============================================
export function Card5Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const history = stats.ratings.history || [];
  const ratings = stats.ratings.current || {};
  
  const rapid = { rating: ratings.rapid || 0, change: history.find(h => h.format === "rapid")?.change || 0 };
  const blitz = { rating: ratings.blitz || 0, change: history.find(h => h.format === "blitz")?.change || 0 };
  const bullet = { rating: ratings.bullet || 0, change: history.find(h => h.format === "bullet")?.change || 0 };

  const formatDelta = (change: number) => change >= 0 ? `+${change}` : String(change);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(125, 211, 252, 0.3)" size={350} x="50%" y="50%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-14">
        {/* Rapid */}
        <div className="flex flex-col items-center">
          <SlideUp delay={0.1}>
            <span className="text-lg text-white/80 tracking-widest uppercase">Rapid</span>
          </SlideUp>
          <AnimatedNumber
            value={rapid.rating}
            className="font-[var(--font-syncopate)] text-6xl font-bold text-[#7DD3FC]"
            delay={0.2}
            duration={1.5}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`font-[var(--font-syncopate)] text-xl font-bold ${rapid.change >= 0 ? "text-[#61DE58]" : "text-[#F87171]"}`}
          >
            {formatDelta(rapid.change)}
          </motion.span>
        </div>

        {/* Blitz */}
        <div className="flex flex-col items-center">
          <SlideUp delay={0.4}>
            <span className="text-lg text-white/80 tracking-widest uppercase">Blitz</span>
          </SlideUp>
          <AnimatedNumber
            value={blitz.rating}
            className="font-[var(--font-syncopate)] text-6xl font-bold text-[#7DD3FC]"
            delay={0.5}
            duration={1.5}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`font-[var(--font-syncopate)] text-xl font-bold ${blitz.change >= 0 ? "text-[#61DE58]" : "text-[#F87171]"}`}
          >
            {formatDelta(blitz.change)}
          </motion.span>
        </div>

        {/* Bullet */}
        <div className="flex flex-col items-center">
          <SlideUp delay={0.7}>
            <span className="text-lg text-white/80 tracking-widest uppercase">Bullet</span>
          </SlideUp>
          <AnimatedNumber
            value={bullet.rating}
            className="font-[var(--font-syncopate)] text-6xl font-bold text-[#7DD3FC]"
            delay={0.8}
            duration={1.5}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={`font-[var(--font-syncopate)] text-xl font-bold ${bullet.change >= 0 ? "text-[#61DE58]" : "text-[#F87171]"}`}
          >
            {formatDelta(bullet.change)}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Slide 6 = Card 6: Biggest Win - Giant Slayer
// ============================================
export function Card6Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const highestDefeated = stats.opponents?.highestRatedDefeated;
  const bestWin = stats.notableGames?.bestWin;
  
  const opponentName = highestDefeated?.username || bestWin?.opponent || "Unknown";
  const opponentRating = highestDefeated?.rating || bestWin?.opponentRating || 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(97, 222, 88, 0.2)" size={350} x="50%" y="50%" blur={100} />
      <Particles color="#61DE58" count={12} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <FadeIn delay={0.1}>
          <span className="text-sm text-white/60 tracking-[0.2em] uppercase">Giant Slayer</span>
        </FadeIn>
        
        <SlideUp delay={0.2}>
          <span className="text-2xl font-bold text-white">Your Biggest Win</span>
        </SlideUp>

        {/* Avatar Circle with trophy effect */}
        <ScaleIn delay={0.4}>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#61DE58] to-[#22C55E] rounded-full blur-md opacity-50" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#61DE58] to-[#22C55E] flex items-center justify-center">
              <span className="font-[var(--font-syncopate)] text-5xl font-bold text-white">
                {opponentName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </ScaleIn>

        {/* Opponent info */}
        <SlideUp delay={0.7}>
          <span className="text-2xl font-bold text-white">{opponentName}</span>
        </SlideUp>

        {/* Rating highlight */}
        <SlideUp delay={0.9}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-sm">You defeated a</span>
            <div className="px-6 py-3 bg-[#61DE58]/20 rounded-2xl border border-[#61DE58]/30">
              <span className="font-[var(--font-syncopate)] text-4xl font-bold text-[#61DE58]">
                {opponentRating}
              </span>
            </div>
            <span className="text-white/60 text-sm">rated player</span>
          </div>
        </SlideUp>

        <FadeIn delay={1.3}>
          <span className="text-white/50 text-sm italic mt-2">Impressive upset!</span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 7 = Card 7: Streaks - Celebratory
// ============================================
export function Card7Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const winStreak = stats.streaks?.longestWinStreak || 0;
  const daysStreak = stats.activity?.sessions?.total || 30;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(97, 222, 88, 0.25)" size={400} x="50%" y="50%" blur={120} />
      <Particles color="#61DE58" count={15} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-14">
        {/* Days Dedication */}
        <div className="flex flex-col items-center">
          <FadeIn delay={0.1}>
            <span className="text-sm text-white/60 tracking-[0.2em] uppercase mb-2">You showed up</span>
          </FadeIn>
          <FloatingElements>
            <AnimatedNumber
              value={daysStreak}
              className="font-[var(--font-syncopate)] text-8xl font-bold text-[#61DE58]"
              delay={0.2}
              duration={2}
            />
          </FloatingElements>
          <SlideUp delay={0.8}>
            <span className="text-xl text-white/80 mt-3 tracking-wide">days this year</span>
          </SlideUp>
          <FadeIn delay={1.2}>
            <span className="text-white/50 text-sm mt-1 italic">That&apos;s dedication!</span>
          </FadeIn>
        </div>

        {/* Win Streak */}
        <div className="flex flex-col items-center">
          <FadeIn delay={1.5}>
            <span className="text-sm text-white/60 tracking-[0.2em] uppercase mb-2">Best win streak</span>
          </FadeIn>
          <FloatingElements>
            <AnimatedNumber
              value={winStreak}
              className="font-[var(--font-syncopate)] text-8xl font-bold text-[#34D399]"
              delay={1.6}
              duration={2}
            />
          </FloatingElements>
          <SlideUp delay={2.2}>
            <span className="text-xl text-white/80 mt-3 tracking-wide">wins in a row</span>
          </SlideUp>
          <FadeIn delay={2.6}>
            <span className="text-white/50 text-sm mt-1 italic">Unstoppable!</span>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Slide 8 = Card 8: Nemesis
// ============================================
export function Card8Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const nemesis = stats.opponents?.nemesis;
  const name = nemesis?.username || "No Nemesis Yet";
  const games = nemesis?.games || 0;
  
  const wins = nemesis?.wins || 0;
  const losses = nemesis?.losses || 0;
  const draws = games - wins - losses;

  const total = wins + draws + losses || 1;
  const barWidth = 260;
  const winWidth = (wins / total) * barWidth;
  const drawWidth = (draws / total) * barWidth;
  const lossWidth = (losses / total) * barWidth;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(248, 113, 113, 0.4)" size={300} x="50%" y="40%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <SlideUp delay={0.1}>
          <span className="text-2xl font-bold text-[#F87171]">Your Nemesis</span>
        </SlideUp>

        {/* Avatar */}
        <ScaleIn delay={0.3}>
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F87171] to-[#DC2626] flex items-center justify-center">
            <span className="font-[var(--font-syncopate)] text-4xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        </ScaleIn>

        {/* Name */}
        <SlideUp delay={0.5}>
          <span className="text-2xl font-bold text-white">{name}</span>
          <span className="text-lg text-[#D4A574] block">{games} games</span>
        </SlideUp>

        {/* Stats Bar */}
        <SlideUp delay={0.7}>
          <div className="flex flex-col items-center gap-3">
            {/* Values */}
            <div className="flex justify-between w-[260px]">
              <span className="font-[var(--font-syncopate)] text-2xl font-bold text-[#61DE58]">{wins}</span>
              <span className="font-[var(--font-syncopate)] text-2xl font-bold text-[#9CA3AF]">{draws}</span>
              <span className="font-[var(--font-syncopate)] text-2xl font-bold text-[#F87171]">{losses}</span>
            </div>
            
            {/* Bar */}
            <div className="flex w-[260px] h-6 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#61DE58]"
                initial={{ width: 0 }}
                animate={{ width: winWidth }}
                transition={{ delay: 0.9, duration: 0.5 }}
              />
              <motion.div
                className="h-full bg-[#9CA3AF]"
                initial={{ width: 0 }}
                animate={{ width: drawWidth }}
                transition={{ delay: 1.1, duration: 0.5 }}
              />
              <motion.div
                className="h-full bg-[#F87171]"
                initial={{ width: 0 }}
                animate={{ width: lossWidth }}
                transition={{ delay: 1.3, duration: 0.5 }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between w-[260px]">
              <span className="text-sm font-bold text-[#61DE58]">Won</span>
              <span className="text-sm font-bold text-[#9CA3AF]">Draw</span>
              <span className="text-sm font-bold text-[#F87171]">Lost</span>
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
}

// ============================================
// Slide 9 = Card 9: Personality
// ============================================
export function Card9Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const personalities = [
    { name: "Magnus Carlsen", quote: "I like to calculate deeply and find the truth" },
    { name: "Hikaru Nakamura", quote: "Speed and intuition win the day" },
    { name: "Garry Kasparov", quote: "Attack is the best defense" },
    { name: "Bobby Fischer", quote: "I like to crush my opponent's ego" },
  ];
  
  const index = (stats.summary.totalGames + stats.summary.totalWins) % personalities.length;
  const personality = personalities[index];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(251, 196, 171, 0.3)" size={300} x="50%" y="50%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <SlideUp delay={0.1}>
          <div className="flex flex-col items-center">
            <span className="text-2xl text-white/90">Your Personality</span>
            <span className="text-2xl text-white/90">is like</span>
          </div>
        </SlideUp>

        {/* Avatar */}
        <ScaleIn delay={0.3}>
          <div className="w-40 h-40 rounded-full bg-[#FBC4AB] flex items-center justify-center">
            <span className="font-[var(--font-syncopate)] text-5xl font-bold text-[#1E293B]">
              {personality.name.charAt(0)}
            </span>
          </div>
        </ScaleIn>

        {/* Name */}
        <SlideUp delay={0.6}>
          <span className="text-3xl font-bold text-[#7DD3FC]">{personality.name}</span>
        </SlideUp>

        {/* Quote */}
        <FadeIn delay={0.9}>
          <p className="text-lg text-white/80 italic max-w-xs">
            &quot;{personality.quote}&quot;
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 10 = Card 10: Summary - Celebratory Trophy Card
// ============================================
export function Card10Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const totalGames = stats.summary.totalGames;
  const totalWins = stats.summary.totalWins;
  const totalMinutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const totalHours = Math.round(totalMinutes / 60);
  
  // Get peak rating (the highest achievement)
  const history = stats.ratings.history || [];
  const allPeaks = history.map(h => h.peak).filter(p => p > 0);
  const peakRating = allPeaks.length > 0 ? Math.max(...allPeaks) : 0;
  
  const checkmates = stats.checkmates.given;
  const winStreak = stats.streaks?.longestWinStreak || 0;

  // Intelligent year summary based on stats
  const winRate = stats.summary.overallWinRate;
  const yearSummary = winRate >= 65 
    ? "Absolutely Dominant" 
    : winRate >= 55 
      ? "Strong Performance" 
      : winRate >= 45 
        ? "Competitive Spirit"
        : "Never Give Up";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      {/* Celebration effects */}
      <GlowOrb color="rgba(125, 211, 252, 0.15)" size={400} x="20%" y="30%" blur={120} />
      <GlowOrb color="rgba(251, 191, 36, 0.15)" size={350} x="80%" y="60%" blur={120} />
      <Particles color="#FBBF24" count={20} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        {/* Profile Section */}
        <SpotlightReveal delay={0.2}>
          <div className="flex flex-col items-center gap-3">
            {/* Avatar with gradient ring */}
            {stats.profile.avatar ? (
              <div className="relative">
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-[#7DD3FC] via-[#FBBF24] to-[#F87171] rounded-full blur-sm opacity-80"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <Image
                  src={stats.profile.avatar}
                  alt={stats.username}
                  width={90}
                  height={90}
                  className="relative rounded-full border-2 border-black"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7DD3FC] via-[#FBBF24] to-[#F87171] flex items-center justify-center">
                <span className="font-[var(--font-syncopate)] text-2xl font-bold text-black">
                  {stats.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Username */}
            <div className="flex items-center gap-2">
              {stats.profile.title && (
                <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded">
                  {stats.profile.title}
                </span>
              )}
              <span className="text-xl font-bold text-white">{stats.username}</span>
            </div>
          </div>
        </SpotlightReveal>

        {/* Year Badge with shimmer */}
        <Shimmer delay={0.4}>
          <div className="border-t border-b border-white/10 py-3 px-8">
            <span className="text-white/50 text-xs tracking-[0.3em] uppercase">
              2025 Chess Wrapped
            </span>
          </div>
        </Shimmer>

        {/* Year Summary Tag */}
        <WipeReveal delay={0.5} direction="up">
          <div className="px-4 py-2 bg-gradient-to-r from-[#7DD3FC]/20 via-[#FBBF24]/20 to-[#F87171]/20 rounded-full border border-white/10">
            <span className="font-[var(--font-syncopate)] text-lg font-bold bg-gradient-to-r from-[#7DD3FC] via-[#FBBF24] to-[#F87171] text-transparent bg-clip-text">
              {yearSummary}
            </span>
          </div>
        </WipeReveal>

        {/* Stats Grid - Only Positive */}
        <StaggerContainer delay={0.6} staggerDelay={0.1} className="grid grid-cols-2 gap-x-12 gap-y-5">
          <StaggerItem className="text-center">
            <AnimatedNumber
              value={totalGames}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#7DD3FC]"
              delay={0.7}
              duration={1.5}
            />
            <p className="text-white/60 text-xs mt-1">games played</p>
          </StaggerItem>
          
          <StaggerItem className="text-center">
            <AnimatedNumber
              value={totalWins}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#61DE58]"
              delay={0.8}
              duration={1.5}
            />
            <p className="text-white/60 text-xs mt-1">victories</p>
          </StaggerItem>
          
          <StaggerItem className="text-center">
            <AnimatedNumber
              value={peakRating}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#FBBF24]"
              delay={0.9}
              duration={1.5}
            />
            <p className="text-white/60 text-xs mt-1">peak rating</p>
          </StaggerItem>
          
          <StaggerItem className="text-center">
            <AnimatedNumber
              value={checkmates}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#F87171]"
              delay={1}
              duration={1.5}
            />
            <p className="text-white/60 text-xs mt-1">checkmates</p>
          </StaggerItem>
          
          <StaggerItem className="text-center">
            <span className="font-[var(--font-syncopate)] text-3xl font-bold text-[#A78BFA]">
              {totalHours}h
            </span>
            <p className="text-white/60 text-xs mt-1">dedicated</p>
          </StaggerItem>
          
          <StaggerItem className="text-center">
            <AnimatedNumber
              value={winStreak}
              className="font-[var(--font-syncopate)] text-3xl font-bold text-[#34D399]"
              delay={1.2}
              duration={1.5}
            />
            <p className="text-white/60 text-xs mt-1">best streak</p>
          </StaggerItem>
        </StaggerContainer>

        {/* Footer */}
        <FadeIn delay={1.8}>
          <div className="flex flex-col items-center gap-2 mt-4">
            <motion.span 
              className="text-lg font-bold text-white italic"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Keep conquering!
            </motion.span>
            <span className="text-white/40 text-xs">chessiro.com</span>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 11 = Card 11: Top Openings
// ============================================
export function Card11Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const bestWhite = stats.openings?.bestAsWhite;
  const bestBlack = stats.openings?.bestAsBlack;
  const totalUnique = stats.openings?.totalUnique || 0;

  const formatOpening = (name: string) => {
    if (name.length > 30) return name.substring(0, 27) + "...";
    return name;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(251, 191, 36, 0.2)" size={350} x="30%" y="40%" blur={100} />
      <GlowOrb color="rgba(125, 211, 252, 0.15)" size={300} x="70%" y="60%" blur={100} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <SlideUp delay={0.1}>
            <span className="font-[var(--font-syncopate)] text-3xl md:text-4xl font-bold text-white">Your Openings</span>
          </SlideUp>
          <FadeIn delay={0.3}>
            <span className="text-white/50 text-sm">{totalUnique} unique openings explored</span>
          </FadeIn>
        </div>

        {/* Best as White */}
        {bestWhite && (
          <SlideUp delay={0.5}>
            <div className="flex flex-col items-center gap-3 bg-white/5 rounded-xl p-5 border border-[#FBBF24]/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center">
                  <span className="font-[var(--font-syncopate)] text-sm font-bold text-black">W</span>
                </div>
                <span className="text-[#FBBF24] font-bold">Best as White</span>
              </div>
              <span className="text-white text-lg font-semibold text-center">{formatOpening(bestWhite.name)}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-[#61DE58] font-bold">{Math.round(bestWhite.winRate)}% wins</span>
                <span className="text-white/60">{bestWhite.games} games</span>
              </div>
            </div>
          </SlideUp>
        )}

        {/* Best as Black */}
        {bestBlack && (
          <SlideUp delay={0.8}>
            <div className="flex flex-col items-center gap-3 bg-white/5 rounded-xl p-5 border border-[#7DD3FC]/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E293B] border-2 border-white flex items-center justify-center">
                  <span className="font-[var(--font-syncopate)] text-sm font-bold text-white">B</span>
                </div>
                <span className="text-[#7DD3FC] font-bold">Best as Black</span>
              </div>
              <span className="text-white text-lg font-semibold text-center">{formatOpening(bestBlack.name)}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-[#61DE58] font-bold">{Math.round(bestBlack.winRate)}% wins</span>
                <span className="text-white/60">{bestBlack.games} games</span>
              </div>
            </div>
          </SlideUp>
        )}

        <FadeIn delay={1.2}>
          <span className="text-white/40 text-sm italic">Your secret weapons!</span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 12 = Card 12: Activity Patterns
// ============================================
export function Card12Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const playTime = stats.playTime;
  const mostActiveHour = playTime?.mostActiveHour || 20;
  const mostActiveDay = playTime?.mostActiveDay || "Saturday";

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getTimeCategory = (hour: number) => {
    if (hour >= 5 && hour < 12) return { label: "Morning Player", color: "#FBBF24" };
    if (hour >= 12 && hour < 17) return { label: "Afternoon Warrior", color: "#F97316" };
    if (hour >= 17 && hour < 21) return { label: "Evening Grinder", color: "#8B5CF6" };
    return { label: "Night Owl", color: "#7DD3FC" };
  };

  const timeCategory = getTimeCategory(mostActiveHour);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(139, 92, 246, 0.25)" size={400} x="50%" y="50%" blur={120} />
      <Particles color="#A78BFA" count={10} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <SlideUp delay={0.1}>
            <span className="font-[var(--font-syncopate)] text-3xl md:text-4xl font-bold text-white">When You Play</span>
          </SlideUp>
          <FadeIn delay={0.3}>
            <span className="text-lg font-bold" style={{ color: timeCategory.color }}>{timeCategory.label}</span>
          </FadeIn>
        </div>

        {/* Peak Hour */}
        <div className="flex flex-col items-center gap-3">
          <FadeIn delay={0.5}>
            <span className="text-white/60 text-sm tracking-[0.2em] uppercase">Peak Hour</span>
          </FadeIn>
          <ZoomBurst delay={0.6}>
            <span className="font-[var(--font-syncopate)] text-6xl md:text-7xl font-bold text-[#7DD3FC]">
              {formatHour(mostActiveHour)}
            </span>
          </ZoomBurst>
        </div>

        {/* Favorite Day */}
        <div className="flex flex-col items-center gap-3">
          <FadeIn delay={1}>
            <span className="text-white/60 text-sm tracking-[0.2em] uppercase">Favorite Day</span>
          </FadeIn>
          <Heartbeat delay={1.1}>
            <span className="font-[var(--font-syncopate)] text-4xl md:text-5xl font-bold text-[#FBBF24]">
              {mostActiveDay.toUpperCase()}
            </span>
          </Heartbeat>
        </div>

        <FadeIn delay={1.6}>
          <span className="text-white/40 text-sm italic">
            {mostActiveHour >= 21 || mostActiveHour < 5 
              ? "Burning the midnight oil!" 
              : mostActiveHour < 12 
                ? "Early bird catches the win!" 
                : "Peak performance hours!"}
          </span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 13 = Gallery View - Flying cards animation
// ============================================
interface GallerySlideProps extends SlideProps {
  onSelectCard?: (cardNumber: number) => void;
  username?: string;
}

export function GallerySlide({ stats, isActive, onSelectCard, username }: GallerySlideProps) {
  if (!isActive) return null;

  const cardTitles = [
    "Games & Wins",
    "Time Spent",
    "Play Style",
    "Your Journey",
    "Ratings",
    "Biggest Win",
    "Streaks",
    "Nemesis",
    "Personality",
    "Openings",
    "Activity",
    "Summary",
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-black to-cyan-950/20" />
      <GlowOrb color="rgba(139, 92, 246, 0.15)" size={300} x="20%" y="30%" blur={100} />
      <GlowOrb color="rgba(6, 182, 212, 0.1)" size={250} x="80%" y="70%" blur={80} />
      
      <div className="relative z-10 flex flex-col items-center w-full h-full px-3 py-4">
        {/* Header - flies down */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center gap-1 mb-4"
        >
          <span className="text-lg font-bold text-white">Your 2025 Capsule</span>
          <p className="text-white/40 text-xs">Tap to view & download</p>
        </motion.div>

        {/* Cards Grid - Flying in from random positions */}
        <div className="flex-1 w-full overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 w-full">
            {cardTitles.map((title, i) => {
              // Map display index to actual card number for API
              const cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 10];
              const cardNum = cardNumbers[i];
              
              return (
                <FlyingCard key={i} index={i} total={cardTitles.length} delay={0.2}>
                  <motion.button
                    onClick={() => onSelectCard?.(i + 1)}
                    className="relative w-full aspect-[9/16] rounded-lg overflow-hidden group bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Card image preview */}
                    {username && (
                      <img
                        src={`/api/wrapped/${username}/image/${cardNum}`}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Bottom gradient with title */}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2">
                      <span className="text-white text-[10px] font-medium">{title}</span>
                    </div>
                    
                    {/* Card number */}
                    <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">{i + 1}</span>
                    </div>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg ring-1 ring-white/30" />
                  </motion.button>
                </FlyingCard>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/20 text-[10px] mt-3"
        >
          chessiro.com
        </motion.p>
      </div>
    </div>
  );
}

// Export all slides - Clean structure with integrated story intros
// Each slide has its own intelligent contextual intro built-in
export const SLIDES = [
  IntroSlide,    // 0 - Intro (greeting)
  Card1Slide,    // 1 = Card 1: Games, Wins, Checkmates
  Card2Slide,    // 2 = Card 2: Time & Moves
  Card3Slide,    // 3 = Card 3: Play Style (Wizard)
  Card4Slide,    // 4 = Card 4: Journey/Peaks
  Card5Slide,    // 5 = Card 5: Rating Gains
  Card6Slide,    // 6 = Card 6: Biggest Win
  Card7Slide,    // 7 = Card 7: Streaks
  Card8Slide,    // 8 = Card 8: Nemesis
  Card9Slide,    // 9 = Card 9: Personality
  Card11Slide,   // 10 = Card 11: Openings
  Card12Slide,   // 11 = Card 12: Activity
  Card10Slide,   // 12 = Card 10: Summary (moved to end before gallery)
  GallerySlide,  // 13 = Gallery (browse all)
];

export const SLIDE_BACKGROUNDS = [
  "from-slate-900 to-black",      // 0 - Intro
  "from-amber-950 to-black",      // 1 - Card 1
  "from-green-950 to-black",      // 2 - Card 2
  "from-cyan-950 to-black",       // 3 - Card 3
  "from-slate-900 to-black",      // 4 - Card 4
  "from-blue-950 to-black",       // 5 - Card 5
  "from-emerald-950 to-black",    // 6 - Card 6
  "from-green-950 to-black",      // 7 - Card 7
  "from-rose-950 to-black",       // 8 - Card 8
  "from-orange-950 to-black",     // 9 - Card 9
  "from-amber-950 to-black",      // 10 - Openings
  "from-purple-950 to-black",     // 11 - Activity
  "from-violet-950 to-black",     // 12 - Summary
  "from-slate-900 to-black",      // 13 - Gallery
];

// Map slide index to card number for download
export function getCardNumberFromSlide(slideIndex: number): number | null {
  const cardMap: Record<number, number> = {
    1: 1,   // Games
    2: 2,   // Time
    3: 3,   // Style
    4: 4,   // Journey
    5: 5,   // Ratings
    6: 6,   // Big Win
    7: 7,   // Streaks
    8: 8,   // Nemesis
    9: 9,   // Personality
    10: 11, // Openings
    11: 12, // Activity
    12: 10, // Summary
  };
  return cardMap[slideIndex] ?? null;
}

// All slides use same duration for consistent pacing
export function getSlideDuration(slideIndex: number): number {
  if (slideIndex === 0) return 4000; // Intro
  if (slideIndex === SLIDES.length - 1) return 0; // Gallery - no auto advance
  return 6000; // All content slides
}
