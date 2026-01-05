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
  nextSlide?: () => void;
  onStart?: () => void;
}

// Helper to format numbers
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Slide 0: Intro (No matching card - just greeting)
// ============================================
export function IntroSlide({ stats, isActive, nextSlide, onStart }: SlideProps) {
  if (!isActive) return null;

  // Calculate years playing
  const joinedYear = stats.profile.joined 
    ? new Date(stats.profile.joined * 1000).getFullYear() 
    : null;
  const currentYear = 2025;
  const yearsPlaying = joinedYear ? currentYear - joinedYear : null;
  const isFirstYear = yearsPlaying === 0;

  // Get display name
  const displayName = stats.profile.name || stats.username;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-black to-slate-900" />
      
      {/* Subtle animated glow */}
      <GlowOrb color="rgba(251, 191, 36, 0.15)" size={400} x="50%" y="30%" blur={150} />
      <GlowOrb color="rgba(6, 182, 212, 0.1)" size={300} x="30%" y="70%" blur={120} />
      
      {/* Particles */}
      <Particles color="#FBBF24" count={12} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">
        {/* Capsule 2025 Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", damping: 15 }}
          className="mb-8"
        >
          <Image
            src="/capsule-2025.png"
            alt="Capsule 2025"
            width={280}
            height={80}
            className="w-[280px] h-auto"
            priority
          />
        </motion.div>

        {/* Player Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", damping: 12 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="w-[140px] h-[140px] rounded-full overflow-hidden border border-white/30">
              {stats.profile.avatar ? (
                <Image
                  src={stats.profile.avatar}
                  alt={stats.username}
                  width={140}
                  height={140}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <span className="font-syncopate text-5xl font-bold text-black">
                    {stats.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Player Name & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center gap-2 mb-2"
        >
          <div className="flex items-center gap-2">
            {stats.profile.title && (
              <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded">
                {stats.profile.title}
              </span>
            )}
            <span className="text-4xl font-bold text-white font-syne">{displayName}</span>
          </div>
        </motion.div>

        {/* Playing Since */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-10"
        >
          {isFirstYear ? (
            <p className="text-white text-base">
              Your first year on chess.com!
            </p>
          ) : yearsPlaying && joinedYear ? (
            <p className="text-white text-base">
              Playing since {joinedYear} · {yearsPlaying} {yearsPlaying === 1 ? 'year' : 'years'} of chess
            </p>
          ) : (
            <p className="text-white text-base">
              @{stats.username}
            </p>
          )}
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.button
            onClick={onStart}
            className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full text-base tracking-wide shadow-lg shadow-amber-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start now
          </motion.button>
        </motion.div>

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-6 text-white/40 text-xs"
        >
        </motion.p>
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
      
      <div className="relative z-10 flex flex-col items-center text-center gap-17 mt-10">
        {/* Games Played */}
        <div className="flex flex-col items-center">
          <ZoomBurst delay={0.2}>
            <AnimatedNumber
              value={gamesPlayed}
              className="font-syncopate text-7xl md:text-8xl font-bold text-[#EB9719]"
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
         
          <Heartbeat delay={1.1}>
            <AnimatedNumber
              value={wins}
              className="font-syncopate text-6xl md:text-7xl font-bold text-[#E26521]"
              delay={1.2}
              duration={2}
            />
          </Heartbeat>
          <SlideUp delay={1.6}>
            <span className="text-xl text-white/80 mt-4">glorious victories</span>
          </SlideUp>
        </div>

        {/* Checkmates */}
        <div className="flex flex-col items-center">
            <AnimatedNumber
              value={checkmates}
              className="font-syncopate text-6xl md:text-7xl font-bold text-[#F22E2E]"
              delay={2.2}
              duration={2}
            />
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
      
      <div className="relative z-10 flex flex-col items-center text-center gap-18">
        <SlideUp delay={0.1}>
          <span className="text-2xl text-[#CEFFDD] font-extrabold w">You played</span>
        </SlideUp>

        {/* Minutes */}
        <FloatingElements>
          <div className="flex flex-col items-center">
            <AnimatedNumber
              value={totalMinutes}
              className="font-syncopate text-6xl md:text-7xl font-bold text-[#61DE58]"
              delay={0.3}
              duration={2}
            />
            <SlideUp delay={0.8}>
              <span className="text-xl text-[#CEFFDD] mt-2">
                minutes (that&apos;s {totalDays} day{totalDays === 1 ? '' : 's'}) 
              </span>
            </SlideUp>
          </div>
        </FloatingElements>

        {/* Moves */}
        <div className="flex flex-col items-center">
          <AnimatedNumber
            value={totalMoves}
            className="font-syncopate text-5xl md:text-6xl font-bold text-[#61DE58]"
            delay={1}
            duration={2}
          />
          <SlideUp delay={1.5}>
            <span className="text-xl text-[#CEFFDD] mt-2">moves</span>
          </SlideUp>
        </div>

        <SlideUp delay={1.8}>
          <span className="text-2xl text-[#CEFFDD] font-bold">Now that&apos;s Impressive!</span>
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
      
      <div className="relative z-10 flex flex-col items-center text-center gap-18">
        <SlideUp delay={0.1}>
          <span className="text-xl text-white/80 font-extrabold">You&apos;re a</span>
        </SlideUp>
        
        <SlideUp delay={0.3}>
          <div className="flex flex-col items-center">
            <span className="font-syncopate text-6xl md:text-7xl font-bold text-[#7DD3FC]">
              {mostPlayed.charAt(0) + mostPlayed.slice(1).toLowerCase()}
            </span>
            <span className="font-syncopate text-6xl md:text-7xl font-bold text-[#7DD3FC]">
              {mostPlayed === "RAPID"
                ? "Champion"
                : mostPlayed === "BLITZ"
                ? "Wizard"
                : mostPlayed === "BULLET"
                ? "King"
                : ""}
            </span>
          </div>
        </SlideUp>

        {/* Bar Chart */}
        <SlideUp delay={0.6}>
          <div className="flex flex-col items-center gap-3">
            {/* Values */}
            <div className="flex justify-between w-[280px]">
              <span className="font-syncopate text-xl font-bold text-[#43B0F0]">{rapid}</span>
              <span className="font-syncopate text-xl font-bold text-[#FBBF24]">{blitz}</span>
              <span className="font-syncopate text-xl font-bold text-[#E76845]">{bullet}</span>
            </div>
            
            {/* Segmented Bar */}
            <div className="flex w-[280px] h-4 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#43B0F0]"
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
                className="h-full bg-[#E76845]"
                initial={{ width: 0 }}
                animate={{ width: bulletWidth }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between w-[280px]">
              <span className="text-sm font-bold text-[#43B0F0]">Rapid</span>
              <span className="text-sm font-bold text-[#FBBF24]">Blitz</span>
              <span className="text-sm font-bold text-[#E76845]">Bullet</span>
            </div>
          </div>
        </SlideUp>

        <FadeIn delay={1.5}>
          <span className="text-lg text-white/90 font-bold">
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

  // Find best month based on data points
  const allDataPoints = [...rapidHistory, ...blitzHistory, ...bulletHistory];
  let bestMonth = "";
  let biggestGain = 0;
  
  if (allDataPoints.length > 0) {
    // Try to extract month from date string
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthRatings: Record<string, number[]> = {};
    
    allDataPoints.forEach(dp => {
      if (dp.date) {
        const date = new Date(dp.date);
        const monthName = months[date.getMonth()];
        if (!monthRatings[monthName]) monthRatings[monthName] = [];
        monthRatings[monthName].push(dp.rating);
      }
    });
    
    // Find month with highest average rating
    let highestAvg = 0;
    Object.entries(monthRatings).forEach(([month, rats]) => {
      const avg = rats.reduce((a, b) => a + b, 0) / rats.length;
      if (avg > highestAvg) {
        highestAvg = avg;
        bestMonth = month;
      }
    });
  }

  // Generate intelligent insight text
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  const overallGrowth = totalChange >= 0;
  const getJourneyInsight = () => {
    if (!history.length) return "Your chess journey begins!";
    if (totalChange >= 300) return "Incredible growth trajectory!";
    if (totalChange >= 150) return "Major breakthroughs achieved!";
    if (totalChange >= 50) return "Steady improvement all year!";
    if (totalChange >= 0) return "Solid foundation built!";
    if (totalChange >= -50) return "Resilience shown this year!";
    return "Comeback story loading...";
  };

  const getMonthInsight = () => {
    if (bestMonth) return `${bestMonth.charAt(0).toUpperCase() + bestMonth.slice(1)} was your strongest month!`;
    if (overallGrowth) return "Your ratings trended upward!";
    return "Every game builds experience!";
  };

  const chartWidth = 340;
  const chartHeight = 200;
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
          <span className="text-2xl font-extrabold text-white">Journey in 2025</span>
        </SlideUp>

        {/* Intelligent Insight */}
        <FadeIn delay={0.4}>
          <span className="text-white/80 text-sm font-bold italic">
            {getJourneyInsight()}
          </span>
        </FadeIn>

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
                  stroke="#43B0F0"
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
                  stroke="#E76845"
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
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[12px] text-white" style={{ height: chartHeight - chartMarginBottom }}>
              <span className="font-syncopate">{paddedMax}</span>
              <span className="font-syncopate">{Math.round((paddedMax + paddedMin) / 2)}</span>
              <span className="font-syncopate">{paddedMin}</span>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[12px] text-white">
              <span>Jan</span>
              <span>Jul</span>
              <span>Dec</span>
            </div>
          </div>
        </SlideUp>


              <div className="flex gap-6"></div>
        {/* Peak Ratings */}
        <SlideUp delay={1.8}>
          <span className="font-syne text-2xl font-bold text-[#CDFAFF]">Your Peaks</span>
        </SlideUp>

        <StaggerContainer delay={2} staggerDelay={0.2} className="flex gap-8">
          <StaggerItem className="flex flex-col items-center">
            <AnimatedNumber
              value={rapidPeak}
              className="font-syncopate text-3xl font-bold text-[#43B0F0]"
              delay={2.1}
              duration={1.5}
            />
            <span className="text-sm font-bold text-[#43B0F0]">Rapid</span>
          </StaggerItem>
          
          <StaggerItem className="flex flex-col items-center">
            <AnimatedNumber
              value={blitzPeak}
              className="font-syncopate text-3xl font-bold text-[#FBBF24]"
              delay={2.3}
              duration={1.5}
            />
            <span className="text-sm font-bold text-[#FBBF24]">Blitz</span>
          </StaggerItem>
          
          <StaggerItem className="flex flex-col items-center">
            <AnimatedNumber
              value={bulletPeak}
              className="font-syncopate text-3xl font-bold text-[#E76845]"
              delay={2.5}
              duration={1.5}
            />
            <span className="text-sm font-bold text-[#E76845]">Bullet</span>
          </StaggerItem>
        </StaggerContainer>

        {/* Month Insight */}
        <FadeIn delay={2.8}>
          <span className="text-white/80 text-sm font-bold italic">
            {getMonthInsight()}
          </span>
        </FadeIn>
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
  
  const rapid = { rating: ratings.rapid || 0, change: history.find(h => h.format === "rapid")?.change || 0, peak: history.find(h => h.format === "rapid")?.peak || 0 };
  const blitz = { rating: ratings.blitz || 0, change: history.find(h => h.format === "blitz")?.change || 0, peak: history.find(h => h.format === "blitz")?.peak || 0 };
  const bullet = { rating: ratings.bullet || 0, change: history.find(h => h.format === "bullet")?.change || 0, peak: history.find(h => h.format === "bullet")?.peak || 0 };

  const getPositiveMessage = (change: number, format: string) => {
    if (change >= 200) return "Breakthrough year!";
    if (change >= 100) return "Major improvement!";
    if (change >= 50) return "Strong growth!";
    if (change > 0) return "Steady progress!";
    return "New format explored!";
  };

  const formats = [
    { ...rapid, name: "Rapid", color: "#54D8E7" },
    { ...blitz, name: "Blitz", color: "#66E6B3" },
    { ...bullet, name: "Bullet", color: "#66E688" },
  ].filter(f => f.rating > 0);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(125, 211, 252, 0.3)" size={350} x="50%" y="50%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-12">
        {/* Header */}
        
        {/* Current Ratings */}
        <div className="flex flex-col items-center gap-12">
          {formats.map((format, index) => (
            <motion.div
              key={format.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
              className="flex flex-col items-center"
            >
              <span className="font-syne font-bold text-xs uppercase tracking-wider mb-2">
                {format.name.toLowerCase()}
              </span>
              <AnimatedNumber
                value={format.rating}
                className="font-syncopate text-7xl md:text-6xl font-bold"
                style={{ color: format.color }}
                delay={0.3 + index * 0.15}
                duration={1.5}
              />
              {/* Show positive change only */}
              {format.change > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                  className="flex items-center gap-2 mt-3 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20"
                >
                  <motion.span
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </motion.span>
                  <span className="font-syncopate text-lg font-bold text-green-400">
                    +{format.change}
                  </span>
                </motion.div>
              )}
              {/* Encouraging message for positive change */}
              {format.change > 0 && (
                <FadeIn delay={0.7 + index * 0.15}>
                  <p className="text-white/40 text-xs mt-1">{getPositiveMessage(format.change, format.name)}</p>
                </FadeIn>
              )}
            </motion.div>
          ))}
        </div>

        {/* Encouraging footer for formats with no positive change */}
        {formats.some(f => f.change <= 0) && (
          <FadeIn delay={0.8}>
            <p className="text-white/90 text-sm italic">
              {formats.some(f => f.change > 0) 
                ? "Every format tells a story!" 
                : "New challenges await in 2026!"}
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

// ============================================
// Slide 7 = Card 6: Biggest Win - Giant Slayer
// ============================================
export function Card6WinSlide({ stats, isActive }: SlideProps) {
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
          <span className="text-2xl font-extrabold text-white">Your Biggest Win</span>
        </FadeIn>

        {/* Avatar Circle with trophy effect */}
        <ScaleIn delay={0.3}>
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#61DE58] to-[#22C55E] flex items-center justify-center">
            <span className="font-syncopate text-5xl font-bold text-white">
              {opponentName.charAt(0).toUpperCase()}
            </span>
          </div>
        </ScaleIn>

        {/* Opponent info */}
        <SlideUp delay={0.6}>
          <span className="text-2xl font-bold text-white">{opponentName}</span>
        </SlideUp>

        {/* Rating highlight */}
        <SlideUp delay={0.8}>
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/80 text-lg">You defeated a</span>
            <div className="px-8 py-4 bg-[#61DE58]/20 rounded-2xl border border-[#61DE58]/30">
              <span className="font-syncopate text-5xl font-bold text-[#61DE58]">
                {opponentRating}
              </span>
            </div>
            <span className="text-white/80 text-lg">rated player</span>
          </div>
        </SlideUp>

        <FadeIn delay={1.3}>
          <span className="text-white/90 text-lg font-bold italic">Impressive upset!</span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 8 = Card 7: Streaks - Celebratory
// ============================================
export function Card7Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const winStreak = stats.streaks?.longestWinStreak || 0;
  const playStreak = stats.activity?.longestPlayStreak || 1;

  const getStreakMessage = (streak: number) => {
    if (streak >= 20) return "LEGENDARY!";
    if (streak >= 15) return "Unstoppable!";
    if (streak >= 10) return "Amazing!";
    if (streak >= 7) return "Week of Dominance!";
    if (streak >= 5) return "High Five Worthy!";
    return "Keep Building!";
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(97, 222, 88, 0.25)" size={400} x="50%" y="50%" blur={120} />
      <Particles color="#61DE58" count={15} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-14">
        {/* Longest Win Streak */}
        <div className="flex flex-col items-center">
          <FadeIn delay={0.1}>
            <span className="text-xl font-bold text-[#34D399] mb-2">Longest Win Streak</span>
          </FadeIn>
          <AnimatedNumber
            value={winStreak}
            className="font-syncopate text-8xl font-bold text-[#34D399]"
            delay={0.3}
            duration={2}
          />
          <SlideUp delay={0.8}>
            <span className="text-xl text-white/80 mt-3 tracking-wide">wins in a row</span>
          </SlideUp>
          <FadeIn delay={1.2}>
            <span className="text-amber-400 text-lg font-bold mt-2">{getStreakMessage(winStreak)}</span>
          </FadeIn>
        </div>

        {/* Longest Play Streak */}
        <div className="flex flex-col items-center">
          <FadeIn delay={1.5}>
            <span className="text-xl font-bold text-[#61DE58] mb-2">Longest Play Streak</span>
          </FadeIn>
          <AnimatedNumber
            value={playStreak}
            className="font-syncopate text-8xl font-bold text-[#61DE58]"
            delay={1.6}
            duration={1.5}
          />
          <SlideUp delay={2}>
            <span className="text-lg text-white/80 mt-2 tracking-wide">days in a row playing</span>
          </SlideUp>
          <FadeIn delay={2.4}>
            <span className="text-yellow-400 text-lg mt-2 font-medium">
              {winStreak >= 10 ? "You're on fire!" : "Every streak starts somewhere"}
            </span>
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
  const barWidth = 280;
  const winWidth = (wins / total) * barWidth;
  const drawWidth = (draws / total) * barWidth;
  const lossWidth = (losses / total) * barWidth;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(248, 113, 113, 0.4)" size={300} x="50%" y="40%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <SlideUp delay={0.1}>
          <span className="text-2xl font-extrabold text-[#F87171]">Your Nemesis</span>
        </SlideUp>

        {/* Avatar */}
        <ScaleIn delay={0.3}>
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F87171] to-[#DC2626] flex items-center justify-center">
            <span className="font-syncopate text-4xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        </ScaleIn>

        {/* Name and games */}
        <SlideUp delay={0.5}>
          <span className="text-2xl font-bold text-white">{name}</span>
          <span className="text-lg text-[#D4A574] block">{games} games</span>
        </SlideUp>

        {/* Stats Bar */}
        <SlideUp delay={0.7}>
          <div className="flex flex-col items-center gap-4">
            {/* Segmented Bar */}
            <div className="flex w-[280px] h-5 rounded-full overflow-hidden">
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

            {/* Values */}
            <div className="flex justify-between w-[280px]">
              <span className="font-syncopate text-2xl font-bold text-[#61DE58]">{wins}</span>
              <span className="font-syncopate text-2xl font-bold text-[#9CA3AF]">{draws}</span>
              <span className="font-syncopate text-2xl font-bold text-[#F87171]">{losses}</span>
            </div>
            
            {/* Labels */}
            <div className="flex justify-between w-[280px]">
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
    { name: "Magnus Carlsen", quote: "I like to calculate deeply and find the truth", image: "magnus.jpg" },
    { name: "Hikaru Nakamura", quote: "Speed and intuition win the day", image: "hikaru.jpg" },
    { name: "Garry Kasparov", quote: "Attack is the best defense", image: "garry.jpg" },
    { name: "Bobby Fischer", quote: "I like to crush my opponent's ego", image: "bobby.jpg" },
  ] as const;
  
  const index = (stats.summary.totalGames + stats.summary.totalWins) % personalities.length;
  const personality = personalities[index];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(251, 196, 171, 0.3)" size={300} x="50%" y="50%" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <SlideUp delay={0.1}>
          <span className="text-xl font-extrabold text-white">Your Personality</span>
        </SlideUp>

        {/* Avatar */}
        <ScaleIn delay={0.3}>
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#FBC4AB]/30">
            <Image
              src={`/${personality.image}`}
              alt={personality.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
        </ScaleIn>

        {/* Name */}
        <SlideUp delay={0.6}>
          <span className="text-3xl font-bold text-[#7DD3FC]">{personality.name}</span>
        </SlideUp>

        {/* Quote */}
        <FadeIn delay={0.9}>
          <p className="text-lg text-white/90 italic max-w-xs font-medium">
            "{personality.quote}"
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 6 = New Card: Total Openings Explored
// ============================================
export function Card6Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const totalUnique = stats.openings?.totalUnique || 0;
  
  const getOpeningsInsight = (count: number) => {
    if (count >= 100) return "A true opening explorer!";
    if (count >= 50) return "Diverse repertoire!";
    if (count >= 20) return "Building depth!";
    if (count >= 10) return "Finding your style!";
    return "Just getting started!";
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(251, 191, 36, 0.2)" size={350} x="50%" y="50%" blur={100} />
      <Particles color="#FBBF24" count={12} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-20">
        <SlideUp delay={0.1}>
          <span className="font-syne text-3xl md:text-4xl font-extrabold text-white">You explored</span>
        </SlideUp>

        {/* Total Openings Count */}
        <div className="flex flex-col items-center">
          <ZoomBurst delay={0.5}>
            <span className="font-syncopate text-8xl md:text-9xl font-bold text-[#FBBF24]">
              {totalUnique}
            </span>
          </ZoomBurst>
          <SlideUp delay={0.8}>
            <span className="text-xl text-white/80 mt-2 tracking-wide">unique openings</span>
          </SlideUp>
        </div>

        {/* Insight */}
        <FadeIn delay={1.3}>
          <span className="text-white/90 text-xl font-medium italic">
            {getOpeningsInsight(totalUnique)}
          </span>
        </FadeIn>

        <FadeIn delay={1.6}>
          <span className="text-white/60 text-lg">
            Let's see your favorites →
          </span>
        </FadeIn>
      </div>
    </div>
  );
}

// ============================================
// Slide 10 = Card 11: Top Openings (moved before Biggest Win)
// ============================================
export function Card11Slide({ stats, isActive }: SlideProps) {
  if (!isActive) return null;

  const topOpeningsWhite = stats.openings?.asWhite?.slice(0, 3) || [];
  const topOpeningsBlack = stats.openings?.asBlack?.slice(0, 3) || [];
  const allOpeningsUnknown = [...topOpeningsWhite, ...topOpeningsBlack].every(o => o.name === "Unknown");
  
  if (allOpeningsUnknown) return null;

  const bestWhite = stats.openings?.bestAsWhite;
  const bestBlack = stats.openings?.bestAsBlack;

  // Get first two words of opening name
  const formatOpening = (name: string) => {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return words.slice(0, 2).join(' ');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden px-6 py-20">
      <GlowOrb color="rgba(235, 151, 25, 0.2)" size={350} x="30%" y="40%" blur={100} />
      <GlowOrb color="rgba(226, 101, 33, 0.15)" size={300} x="70%" y="60%" blur={100} />
      
      {/* Header */}
      <SlideUp delay={0.1}>
        <span className="relative z-10 font-syne text-3xl md:text-4xl font-extrabold text-white">Your Openings</span>
      </SlideUp>

      {/* Best as White */}
      {bestWhite && (
        <SlideUp delay={0.4}>
          <div className="relative z-10 flex flex-col items-center gap-5 bg-white/[0.06] rounded-3xl p-7 border border-white/[0.12] w-[300px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="font-syncopate text-xl font-bold text-slate-900">W</span>
              </div>
              <span className="text-white font-bold text-lg">Best as White</span>
            </div>
            <span className="font-syncopate text-2xl font-bold text-[#EB9719] text-center whitespace-nowrap">{formatOpening(bestWhite.name)}</span>
            <div className="flex gap-8 items-center">
              <span className="font-syncopate text-3xl font-bold text-[#61DE58]">{Math.round(bestWhite.winRate)}%</span>
              <span className="font-syncopate text-sm text-white/50">{bestWhite.games} games</span>
            </div>
          </div>
        </SlideUp>
      )}

      {/* Best as Black */}
      {bestBlack && (
        <SlideUp delay={0.8}>
          <div className="relative z-10 flex flex-col items-center gap-5 bg-white/[0.06] rounded-3xl p-7 border border-white/[0.12] w-[300px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                <span className="font-syncopate text-xl font-bold text-white">B</span>
              </div>
              <span className="text-white font-bold text-lg">Best as Black</span>
            </div>
            <span className="font-syncopate text-2xl font-bold text-[#E26521] text-center whitespace-nowrap">{formatOpening(bestBlack.name)}</span>
            <div className="flex gap-8 items-center">
              <span className="font-syncopate text-3xl font-bold text-[#61DE58]">{Math.round(bestBlack.winRate)}%</span>
              <span className="font-syncopate text-sm text-white/50">{bestBlack.games} games</span>
            </div>
          </div>
        </SlideUp>
      )}

      {/* Empty spacer for balance */}
      <div />
    </div>
  );
}

// ============================================
// Slide 9 = Card 12: Activity Patterns
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
    if (hour >= 17 && hour < 21) return { label: "Evening Gladiator", color: "#8B5CF6" };
    return { label: "Night Owl", color: "#7DD3FC" };
  };

  const timeCategory = getTimeCategory(mostActiveHour);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <GlowOrb color="rgba(139, 92, 246, 0.25)" size={400} x="50%" y="50%" blur={120} />
      <Particles color="#A78BFA" count={10} />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-12">
  
        <FadeIn delay={0.3}>
          <span className="font-syncopate text-3xl font-bold" style={{ color: timeCategory.color }}>{timeCategory.label}</span>
        </FadeIn>

        {/* Peak Hour */}
        <div className="flex flex-col items-center gap-3">
          <FadeIn delay={0.5}>
            <span className="text-white/80 text-lg uppercase tracking-wider">Peak Hour</span>
          </FadeIn>
          <ZoomBurst delay={0.6}>
            <span className="font-syncopate text-4xl md:text-7xl font-bold text-[#F8B88D]">
              {formatHour(mostActiveHour)}
            </span>
          </ZoomBurst>
        </div>

        {/* Favorite Day */}
        <div className="flex flex-col items-center gap-3">
          <FadeIn delay={1}>
            <span className="text-white/80 text-lg uppercase tracking-wider">Favorite Day</span>
          </FadeIn>
          <Heartbeat delay={1.1}>
            <span className="font-syncopate text-4xl md:text-5xl font-bold text-[#F8B88D]">
              {mostActiveDay.toUpperCase()}
            </span>
          </Heartbeat>
        </div>

        <FadeIn delay={1.6}>
          <span className="text-white/90 text-lg font-medium italic">
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
    "Total Openings",
    "Openings",
    "Streaks",
    "Biggest Win",
    "Activity",
    "Nemesis",
    "Personality",
    "Summary",
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-black to-cyan-950/20" />
      <GlowOrb color="rgba(139, 92, 246, 0.15)" size={300} x="20%" y="30%" blur={100} />
      <GlowOrb color="rgba(6, 182, 212, 0.1)" size={250} x="80%" y="70%" blur={80} />
      
      <div className="relative z-10 flex flex-col items-center w-full h-full px-3 py-4">
        {/* Cards Grid - Flying in from random positions */}
        <div className="flex-1 w-full overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 w-full">
            {cardTitles.map((title, i) => {
              // Map display index to actual card number for API (new order with Total Openings)
              const cardNumbers = [1, 2, 3, 4, 5, 6, 11, 7, 6, 12, 8, 9, 10];
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
// Order: Intro → Games → Time → Style → Journey → Ratings → Total Openings → Openings Details → Streaks → Biggest Win → Activity → Nemesis → Personality → Gallery
export const SLIDES = [
  IntroSlide,      // 0 - Intro (greeting)
  Card1Slide,      // 1 = Card 1: Games, Wins, Checkmates
  Card2Slide,      // 2 = Card 2: Time & Moves
  Card3Slide,      // 3 = Card 3: Play Style (Wizard)
  Card4Slide,      // 4 = Card 4: Journey/Peaks
  Card5Slide,      // 5 = Card 5: Rating Gains
  Card6Slide,      // 6 = Card 6: Total Openings Explored (NEW)
  Card11Slide,     // 7 = Card 11: Openings Details
  Card7Slide,      // 8 = Card 7: Streaks
  Card6WinSlide,   // 9 = Card 6: Biggest Win
  Card12Slide,     // 10 = Card 12: Activity Patterns
  Card8Slide,      // 11 = Card 8: Nemesis
  Card9Slide,      // 12 = Card 9: Personality
  GallerySlide,    // 13 = Gallery (browse all)
];

export const SLIDE_BACKGROUNDS = [
  "from-slate-900 to-black",      // 0 - Intro
  "from-amber-950 to-black",      // 1 - Card 1
  "from-green-950 to-black",      // 2 - Card 2
  "from-cyan-950 to-black",       // 3 - Card 3
  "from-slate-900 to-black",      // 4 - Card 4
  "from-blue-950 to-black",       // 5 - Card 5
  "from-amber-950 to-black",      // 6 - Total Openings (new)
  "from-amber-950 to-black",      // 7 - Openings Details
  "from-green-950 to-black",      // 8 - Streaks
  "from-emerald-950 to-black",    // 9 - Biggest Win
  "from-purple-950 to-black",     // 10 - Activity
  "from-rose-950 to-black",       // 11 - Nemesis
  "from-orange-950 to-black",     // 12 - Personality
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
    6: 6,   // Total Openings (new card 6)
    7: 11,  // Openings Details
    8: 7,   // Streaks
    9: 6,   // Biggest Win
    10: 12, // Activity
    11: 8,  // Nemesis
    12: 9,  // Personality
  };
  return cardMap[slideIndex] ?? null;
}

// All slides use same duration for consistent pacing
export function getSlideDuration(slideIndex: number): number {
  if (slideIndex === 0) return 4000; // Intro
  if (slideIndex === SLIDES.length - 1) return 0; // Gallery - no auto advance
  return 6000; // All content slides
}

// ============================================
// Not Enough Games View - Shown when < 50 games
// ============================================
interface NotEnoughGamesViewProps {
  stats: WrappedStats;
  onShare: () => void;
  onHome: () => void;
}

export function NotEnoughGamesView({ stats, onShare, onHome }: NotEnoughGamesViewProps) {
  const displayName = stats.profile.name || stats.username;
  const joinedYear = stats.profile.joined 
    ? new Date(stats.profile.joined * 1000).getFullYear() 
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-black to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <GlowOrb color="rgba(251, 191, 36, 0.15)" size={400} x="50%" y="30%" blur={150} />
      <Particles color="#FBBF24" count={15} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Image
            src="/capsule-2025.png"
            alt="Capsule 2025"
            width={200}
            height={60}
            className="w-[200px] h-auto"
          />
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-3">Welcome Back</p>
          
          {/* Avatar */}
          <div className="relative mb-4 mx-auto w-20 h-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400 rounded-full blur-sm opacity-80" />
            <div className="absolute -inset-2 rounded-full bg-black/60 backdrop-blur-sm" />
            {stats.profile.avatar ? (
              <Image
                src={stats.profile.avatar}
                alt={stats.username}
                width={80}
                height={80}
                className="relative rounded-full border-2 border-amber-500/30"
              />
            ) : (
              <div className="relative w-[80px] h-[80px] rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center border-2 border-amber-500/30">
                <span className="font-syncopate text-3xl font-bold text-black">
                  {stats.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">{displayName}</h1>
          {joinedYear && (
            <p className="text-white/50 text-sm">Playing since {joinedYear}</p>
          )}
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Keep Playing!</h2>
          <p className="text-white/60 text-sm">
            You need <span className="text-amber-400 font-bold">{50 - stats.summary.totalGames}</span> more games to unlock your full Capsule 2025 experience.
          </p>
          <p className="text-white/40 text-xs mt-3">
            Come back when you've played 50+ games!
          </p>
        </motion.div>

        {/* Mini Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-6 mb-10"
        >
          <div className="text-center">
            <span className="font-syncopate text-2xl font-bold text-cyan-400">{stats.summary.totalGames}</span>
            <p className="text-white/40 text-[10px] uppercase mt-1">Games</p>
          </div>
          <div className="text-center">
            <span className="font-syncopate text-2xl font-bold text-green-400">{stats.summary.totalWins}</span>
            <p className="text-white/40 text-[10px] uppercase mt-1">Wins</p>
          </div>
          <div className="text-center">
            <span className="font-syncopate text-2xl font-bold text-amber-400">{stats.summary.overallWinRate.toFixed(0)}%</span>
            <p className="text-white/40 text-[10px] uppercase mt-1">Win Rate</p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col gap-3 w-full"
        >
          <motion.button
            onClick={onShare}
            className="w-full py-3 bg-white text-black font-bold rounded-full text-sm tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Share These Stats
          </motion.button>
          
          <motion.button
            onClick={onHome}
            className="w-full py-3 bg-white/10 text-white font-medium rounded-full text-sm border border-white/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
