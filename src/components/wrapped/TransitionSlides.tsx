"use client";

import { motion } from "framer-motion";
import { WrappedStats } from "@/lib/types";
import { GlowOrb, Particles } from "./Effects";

interface TransitionSlideProps {
  stats: WrappedStats;
  isActive: boolean;
}

// ============================================
// Intelligent Text Generators
// ============================================

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGamesPlayedReaction(games: number): { text: string; subtext: string } {
  if (games >= 5000) return { text: "You're a chess machine!", subtext: "That's some serious dedication" };
  if (games >= 2000) return { text: "Wow, you've been busy!", subtext: "Let's see what you achieved" };
  if (games >= 1000) return { text: "A thousand battles fought!", subtext: "Here's your story" };
  if (games >= 500) return { text: "Half a thousand games!", subtext: "Every move tells a story" };
  if (games >= 100) return { text: "You've been learning!", subtext: "Let's explore your journey" };
  return { text: "Every master was once a beginner", subtext: "Your journey has just begun" };
}

function getWinRateReaction(winRate: number): { text: string; emoji: string } {
  if (winRate >= 70) return { text: "You're absolutely crushing it", emoji: "fire" };
  if (winRate >= 60) return { text: "You're winning more than losing", emoji: "star" };
  if (winRate >= 50) return { text: "Balanced, as all things should be", emoji: "balance" };
  if (winRate >= 40) return { text: "Every loss is a lesson learned", emoji: "growth" };
  return { text: "The comeback story is the best story", emoji: "heart" };
}

function getTimeSpentReaction(minutes: number): { text: string; comparison: string } {
  const hours = Math.floor(minutes / 60);
  if (hours >= 500) return { text: "You've achieved mastery hours!", comparison: "That's more than a month of chess" };
  if (hours >= 200) return { text: "Serious commitment detected", comparison: "That's a full work month" };
  if (hours >= 100) return { text: "Time well invested", comparison: "That's over 4 full days" };
  if (hours >= 50) return { text: "Building that chess muscle", comparison: "That's 2 full days of focus" };
  return { text: "Every minute counts", comparison: "Keep going!" };
}

function getRatingJourneyText(change: number, peak: number): { text: string; feeling: string } {
  if (change >= 200) return { text: "Incredible growth!", feeling: "You're on fire" };
  if (change >= 100) return { text: "Solid improvement!", feeling: "The grind is paying off" };
  if (change >= 50) return { text: "Steady progress!", feeling: "Consistency is key" };
  if (change >= 0) return { text: "Holding strong!", feeling: "Maintaining is winning" };
  if (change >= -50) return { text: "A challenging year", feeling: "But you kept playing" };
  return { text: "Tough battles", feeling: "Resilience builds champions" };
}

function getPlayStylePersonality(mostPlayed: string, gamesCount: number): { archetype: string; description: string } {
  const format = mostPlayed.toLowerCase();
  if (format === "bullet") {
    if (gamesCount > 2000) return { archetype: "Speed Demon", description: "You live for the adrenaline" };
    return { archetype: "Quick Draw", description: "Fast thinking, faster clicking" };
  }
  if (format === "blitz") {
    if (gamesCount > 2000) return { archetype: "Blitz Master", description: "The perfect balance of speed and thought" };
    return { archetype: "Lightning Player", description: "Quick decisions, calculated risks" };
  }
  if (format === "rapid") {
    if (gamesCount > 1000) return { archetype: "Strategic Mind", description: "You prefer to think things through" };
    return { archetype: "Thoughtful Player", description: "Quality over quantity" };
  }
  return { archetype: "Versatile Player", description: "You adapt to any challenge" };
}

function getCheckmateStyle(checkmates: number, games: number): { text: string; style: string } {
  const ratio = checkmates / (games || 1);
  if (ratio >= 0.4) return { text: "Checkmate hunter!", style: "You finish with authority" };
  if (ratio >= 0.25) return { text: "Decisive finisher!", style: "When you win, you win big" };
  if (ratio >= 0.1) return { text: "Clean wins!", style: "Efficient and effective" };
  return { text: "The win is what matters!", style: "Results over style" };
}

function getStreakMessage(streak: number): { text: string; hype: string } {
  if (streak >= 15) return { text: "LEGENDARY STREAK!", hype: "Absolutely unstoppable" };
  if (streak >= 10) return { text: "Double digits!", hype: "You were on fire" };
  if (streak >= 7) return { text: "A week of wins!", hype: "Pure dominance" };
  if (streak >= 5) return { text: "High five!", hype: "Five in a row" };
  if (streak >= 3) return { text: "Hat trick!", hype: "Triple threat" };
  return { text: "Building momentum!", hype: "Every streak starts somewhere" };
}

function getNemesisNarrative(nemesis: { username: string; wins: number; losses: number; games: number } | null): { text: string; drama: string } {
  if (!nemesis) return { text: "No rival found...", drama: "You stand alone" };
  const record = nemesis.wins - nemesis.losses;
  if (record > 5) return { text: "You've conquered your nemesis!", drama: `${nemesis.username} fears you now` };
  if (record > 0) return { text: "You have the edge!", drama: `${nemesis.username} is a worthy opponent` };
  if (record === 0) return { text: "Perfectly matched!", drama: `${nemesis.username} is your equal` };
  if (record > -5) return { text: "A fierce rivalry!", drama: `${nemesis.username} leads... for now` };
  return { text: "Your nemesis awaits revenge!", drama: `${nemesis.username} has your number` };
}

// ============================================
// Transition Slide: Before Games Stats
// ============================================
export function TransitionToGames({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const greeting = getTimeOfDayGreeting();
  const reaction = getGamesPlayedReaction(stats.summary.totalGames);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-black to-black" />
      <GlowOrb color="rgba(99, 102, 241, 0.3)" size={400} x="50%" y="50%" blur={150} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-8">
        {/* Greeting */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-[var(--font-syne)] text-white/60 text-lg"
        >
          {greeting}, {stats.username}
        </motion.span>

        {/* Main text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex flex-col gap-2"
        >
          <span className="font-syne text-3xl md:text-4xl font-bold text-white">
            {reaction.text}
          </span>
          <span className="font-[var(--font-syne)] text-white/50 text-lg">
            {reaction.subtext}
          </span>
        </motion.div>

        {/* Animated arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 5, 0] }}
          transition={{ 
            opacity: { delay: 1.2, duration: 0.5 },
            y: { delay: 1.2, duration: 1.5, repeat: Infinity }
          }}
          className="mt-8"
        >
          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Time Stats
// ============================================
export function TransitionToTime({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const minutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const reaction = getTimeSpentReaction(minutes);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-black to-black" />
      <GlowOrb color="rgba(16, 185, 129, 0.25)" size={350} x="50%" y="50%" blur={120} />
      <Particles color="#10B981" count={10} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-[var(--font-syne)] text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          Time flies when you're playing chess
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex flex-col gap-3"
        >
          <span className="font-syne text-3xl md:text-4xl font-bold text-[#10B981]">
            {reaction.text}
          </span>
          <span className="font-[var(--font-syne)] text-white/60 text-base">
            {reaction.comparison}
          </span>
        </motion.div>

        {/* Clock animation */}
        <motion.div
          initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, type: "spring" }}
          className="mt-4"
        >
          <div className="w-16 h-16 rounded-full border-2 border-[#10B981]/50 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-0.5 bg-[#10B981] origin-left"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Play Style
// ============================================
export function TransitionToStyle({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const personality = getPlayStylePersonality(
    stats.summary.mostPlayedFormat || "blitz",
    stats.summary.totalGames
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-black to-black" />
      <GlowOrb color="rgba(139, 92, 246, 0.3)" size={400} x="50%" y="50%" blur={130} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-[var(--font-syne)] text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          Every player has a style
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex flex-col gap-2"
        >
          <span className="font-[var(--font-syne)] text-white/70 text-xl">You are a</span>
          <span className="font-syne text-4xl md:text-5xl font-bold text-[#8B5CF6]">
            {personality.archetype}
          </span>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="font-[var(--font-syne)] text-white/50 text-base italic"
        >
          "{personality.description}"
        </motion.span>

        {/* Animated lightning bolt for speed */}
        <motion.svg
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3, type: "spring" }}
          className="w-12 h-12 text-[#8B5CF6] mt-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </motion.svg>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Ratings Journey
// ============================================
export function TransitionToJourney({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const history = stats.ratings.history || [];
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  const highestPeak = Math.max(...history.map(h => h.peak).filter(p => p > 0), 0);
  const journey = getRatingJourneyText(totalChange, highestPeak);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-black to-black" />
      <GlowOrb color="rgba(14, 165, 233, 0.25)" size={350} x="30%" y="40%" blur={100} />
      <GlowOrb color="rgba(251, 191, 36, 0.2)" size={300} x="70%" y="60%" blur={100} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-[var(--font-syne)] text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          Your Rating Journey
        </motion.span>

        {/* Animated path line */}
        <motion.svg
          className="w-64 h-16"
          viewBox="0 0 256 64"
        >
          <motion.path
            d="M 0 50 Q 64 20, 128 35 T 256 15"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
          </defs>
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-col gap-2"
        >
          <span className="font-syne text-3xl md:text-4xl font-bold text-white">
            {journey.text}
          </span>
          <span className="font-[var(--font-syne)] text-white/50 text-base">
            {journey.feeling}
          </span>
        </motion.div>

        {/* Rating change indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className={`px-4 py-2 rounded-full ${totalChange >= 0 ? 'bg-[#61DE58]/20 text-[#61DE58]' : 'bg-[#F87171]/20 text-[#F87171]'}`}
        >
          <span className="font-syncopate text-2xl font-bold">
            {totalChange >= 0 ? '+' : ''}{totalChange} ELO
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Victories
// ============================================
export function TransitionToVictories({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const winRate = stats.summary.overallWinRate;
  const reaction = getWinRateReaction(winRate);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-black to-black" />
      <GlowOrb color="rgba(251, 191, 36, 0.3)" size={400} x="50%" y="50%" blur={140} />
      <Particles color="#FBBF24" count={15} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-[var(--font-syne)] text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          The Scoreboard
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex flex-col gap-3"
        >
          <span className="font-syncopate text-[#FBBF24] text-6xl font-bold">
            {Math.round(winRate)}%
          </span>
          <span className="font-[var(--font-syne)] text-white/80 text-xl">
            win rate
          </span>
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="font-[var(--font-syne)] text-2xl font-bold text-white"
        >
          {reaction.text}
        </motion.span>

        {/* Trophy animation */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.5, type: "spring" }}
        >
          <svg className="w-16 h-16 text-[#FBBF24]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3h14v2H5V3zm0 4h2v4a5 5 0 0 0 3.07 4.62A3 3 0 0 1 9 18v1H7v2h10v-2h-2v-1a3 3 0 0 1-1.07-2.38A5 5 0 0 0 17 11V7h2V5H5v2zm2 0h10v4a3 3 0 0 1-6 0V9h2v2a1 1 0 0 0 2 0V7H7v4z"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Streaks
// ============================================
export function TransitionToStreaks({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const streak = stats.streaks?.longestWinStreak || 0;
  const message = getStreakMessage(streak);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-black to-black" />
      <GlowOrb color="rgba(249, 115, 22, 0.3)" size={400} x="50%" y="50%" blur={130} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-[var(--font-syne)] text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          Momentum Matters
        </motion.span>

        {/* Fire animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            opacity: { duration: 0.5, delay: 0.5 },
            scale: { duration: 1.5, delay: 0.5, repeat: Infinity }
          }}
          className="text-6xl"
        >
          <svg className="w-20 h-20 text-[#F97316]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.67 1.66-5.06 4.16-6.53.54-.32 1.23-.14 1.56.4.32.54.14 1.23-.4 1.56C6.34 11.57 5 13.38 5 15c0 3.31 3.13 6 7 6s7-2.69 7-6c0-2.38-1.98-4.72-4.3-6.12-.54-.32-.72-1.02-.4-1.56.33-.54 1.02-.72 1.56-.4C18.34 8.94 21 11.83 21 15c0 4.42-4.03 8-9 8zm-1-4c-2.76 0-5-2.01-5-4.5 0-1.63 1.16-3.13 2.82-4.06.5-.28 1.14-.1 1.42.4.28.5.1 1.14-.4 1.42C8.78 13.01 8 14.2 8 14.5c0 1.38 1.35 2.5 3 2.5s3-1.12 3-2.5c0-.73-.47-1.46-1.28-2-.5-.33-.64-.99-.31-1.49s.99-.64 1.49-.31C15.25 11.59 16 12.98 16 14.5c0 2.49-2.24 4.5-5 4.5z"/>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col gap-2"
        >
          <span className="font-syne text-3xl md:text-4xl font-bold text-[#F97316]">
            {message.text}
          </span>
          <span className="text-white/50 text-base">
            {message.hype}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Nemesis
// ============================================
export function TransitionToNemesis({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const nemesis = stats.opponents?.nemesis;
  const narrative = getNemesisNarrative(nemesis ? {
    username: nemesis.username,
    wins: nemesis.wins,
    losses: nemesis.losses,
    games: nemesis.games
  } : null);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/50 via-black to-black" />
      <GlowOrb color="rgba(239, 68, 68, 0.35)" size={400} x="50%" y="50%" blur={140} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          Every Hero Has A Rival
        </motion.span>

        {/* Crossed swords animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        >
          <svg className="w-24 h-24 text-[#EF4444]" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="3">
            <motion.line
              x1="20" y1="80" x2="80" y2="20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            <motion.line
              x1="20" y1="20" x2="80" y2="80"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex flex-col gap-2"
        >
          <span className="font-syne text-2xl md:text-3xl font-bold text-white">
            {narrative.text}
          </span>
          <span className="text-[#EF4444] text-base italic">
            {narrative.drama}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Transition Slide: Before Finale/Summary
// ============================================
export function TransitionToFinale({ stats, isActive }: TransitionSlideProps) {
  if (!isActive) return null;

  const checkmates = stats.checkmates.given;
  const games = stats.summary.totalGames;
  const style = getCheckmateStyle(checkmates, games);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-black to-black" />
      <GlowOrb color="rgba(168, 85, 247, 0.25)" size={300} x="30%" y="30%" blur={100} />
      <GlowOrb color="rgba(236, 72, 153, 0.2)" size={300} x="70%" y="70%" blur={100} />
      <Particles color="#A855F7" count={20} />
      
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          The Grand Finale
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex flex-col gap-2"
        >
          <span className="text-white/70 text-lg">Your 2025 was</span>
          <span className="font-syne text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#FBBF24] text-transparent bg-clip-text">
            LEGENDARY
          </span>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-white/60 text-base"
        >
          {style.text}
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-white/40 text-sm italic"
        >
          "{style.style}"
        </motion.span>

        {/* Crown animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2, type: "spring" }}
        >
          <svg className="w-16 h-16 text-[#FBBF24]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// Export all transition slides
export const TRANSITION_SLIDES = {
  TransitionToGames,
  TransitionToTime,
  TransitionToStyle,
  TransitionToJourney,
  TransitionToVictories,
  TransitionToStreaks,
  TransitionToNemesis,
  TransitionToFinale,
};
