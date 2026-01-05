import { WrappedStats } from "@/lib/types";

// ============================================
// Intelligent Story Text Generators
// ============================================

export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getGamesIntro(stats: WrappedStats): { hook: string; subtext: string } {
  const games = stats.summary.totalGames;
  const winRate = stats.summary.overallWinRate;
  
  if (games >= 5000) {
    return { hook: "You lived on the board", subtext: "A true chess warrior" };
  }
  if (games >= 2000) {
    return { hook: "The grind was real", subtext: "Let's see what you achieved" };
  }
  if (games >= 1000) {
    return { hook: "A thousand battles", subtext: "Each one shaped you" };
  }
  if (games >= 500) {
    return { hook: "Half a thousand games", subtext: "Every move tells a story" };
  }
  if (winRate >= 60) {
    return { hook: "Quality over quantity", subtext: "And you made them count" };
  }
  return { hook: "The journey begins", subtext: "Every master starts somewhere" };
}

export function getTimeIntro(stats: WrappedStats): { hook: string; comparison: string } {
  const minutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days >= 30) {
    return { hook: "Time well spent", comparison: `More than a month of pure chess` };
  }
  if (days >= 14) {
    return { hook: "Serious dedication", comparison: `${days} full days on the board` };
  }
  if (days >= 7) {
    return { hook: "A week's worth", comparison: `${days} days of chess mastery` };
  }
  if (hours >= 100) {
    return { hook: "Triple digits", comparison: `${hours} hours invested` };
  }
  if (hours >= 50) {
    return { hook: "Building the habit", comparison: `${hours} hours of growth` };
  }
  return { hook: "Every minute counts", comparison: `${hours} hours of learning` };
}

export function getPlayStyleIntro(stats: WrappedStats): { archetype: string; trait: string; description: string } {
  const format = (stats.summary.mostPlayedFormat || "blitz").toLowerCase();
  const games = stats.summary.totalGames;
  const winRate = stats.summary.overallWinRate;
  
  if (format === "bullet") {
    if (winRate >= 55) {
      return { archetype: "SPEED DEMON", trait: "Lightning reflexes", description: "You thrive under pressure" };
    }
    return { archetype: "ADRENALINE JUNKIE", trait: "Quick hands", description: "Living for the rush" };
  }
  
  if (format === "blitz") {
    if (games >= 1000 && winRate >= 50) {
      return { archetype: "BLITZ MASTER", trait: "Perfect balance", description: "Speed meets strategy" };
    }
    return { archetype: "LIGHTNING STRIKER", trait: "Fast thinker", description: "Calculated aggression" };
  }
  
  if (format === "rapid") {
    if (winRate >= 55) {
      return { archetype: "STRATEGIC MIND", trait: "Deep thinker", description: "Patience is your weapon" };
    }
    return { archetype: "METHODICAL PLAYER", trait: "Thoughtful moves", description: "Quality over speed" };
  }
  
  return { archetype: "VERSATILE PLAYER", trait: "Adaptable", description: "Ready for any challenge" };
}

export function getJourneyIntro(stats: WrappedStats): { narrative: string; feeling: string; trend: "up" | "down" | "stable" } {
  const history = stats.ratings.history || [];
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  const avgChange = history.length > 0 ? totalChange / history.length : 0;
  
  if (totalChange >= 200) {
    return { narrative: "A year of breakthroughs", feeling: "You reached new heights", trend: "up" };
  }
  if (totalChange >= 100) {
    return { narrative: "Steady climb", feeling: "The grind paid off", trend: "up" };
  }
  if (totalChange >= 50) {
    return { narrative: "Progress made", feeling: "Every point earned", trend: "up" };
  }
  if (totalChange >= -50) {
    return { narrative: "Holding strong", feeling: "Consistency is key", trend: "stable" };
  }
  if (totalChange >= -100) {
    return { narrative: "A challenging year", feeling: "But you kept fighting", trend: "down" };
  }
  return { narrative: "Tough battles", feeling: "Resilience builds champions", trend: "down" };
}

export function getRatingsIntro(stats: WrappedStats): { headline: string; context: string } {
  const history = stats.ratings.history || [];
  const current = stats.ratings.current || {};
  
  const allPeaks = history.map(h => h.peak).filter(p => p > 0);
  const highestPeak = allPeaks.length > 0 ? Math.max(...allPeaks) : 0;
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  
  if (highestPeak >= 2000) {
    return { headline: "Elite territory", context: "You touched the 2000s" };
  }
  if (highestPeak >= 1500) {
    return { headline: "Above average", context: "Stronger than most" };
  }
  if (totalChange >= 100) {
    return { headline: "Rising star", context: "Your growth was impressive" };
  }
  if (totalChange >= 0) {
    return { headline: "Solid foundation", context: "Building strength" };
  }
  return { headline: "Learning curve", context: "Every setback teaches" };
}

export function getBiggestWinIntro(stats: WrappedStats): { buildup: string; drama: string } {
  const highestDefeated = stats.opponents?.highestRatedDefeated;
  const rating = highestDefeated?.rating || 0;
  const currentRatings = Object.values(stats.ratings.current || {}).filter(r => r > 0);
  const avgRating = currentRatings.length > 0 ? currentRatings.reduce((a, b) => a + b, 0) / currentRatings.length : 1200;
  
  const ratingDiff = rating - avgRating;
  
  if (ratingDiff >= 300) {
    return { buildup: "Giant slayer moment", drama: "You defeated a titan" };
  }
  if (ratingDiff >= 150) {
    return { buildup: "Punching above weight", drama: "A memorable upset" };
  }
  if (rating >= 2000) {
    return { buildup: "Elite takedown", drama: "You beat a 2000+ player" };
  }
  if (rating >= 1500) {
    return { buildup: "Strong scalp", drama: "Quality victory" };
  }
  return { buildup: "Every win matters", drama: "Your best conquest" };
}

export function getStreaksIntro(stats: WrappedStats): { hype: string; context: string } {
  const winStreak = stats.streaks?.longestWinStreak || 0;
  const days = stats.activity?.sessions?.total || 0;
  
  if (winStreak >= 15) {
    return { hype: "LEGENDARY RUN", context: "Absolutely unstoppable" };
  }
  if (winStreak >= 10) {
    return { hype: "Double digits", context: "You were on fire" };
  }
  if (winStreak >= 7) {
    return { hype: "Week of dominance", context: "Seven straight wins" };
  }
  if (winStreak >= 5) {
    return { hype: "High five worthy", context: "Five in a row" };
  }
  if (days >= 100) {
    return { hype: "Dedication unlocked", context: `${days} days played` };
  }
  return { hype: "Momentum builder", context: "Every streak starts somewhere" };
}

export function getNemesisIntro(stats: WrappedStats): { drama: string; narrative: string; verdict: "winning" | "losing" | "tied" } {
  const nemesis = stats.opponents?.nemesis;
  
  if (!nemesis) {
    return { drama: "Lone wolf", narrative: "No rival emerged this year", verdict: "tied" };
  }
  
  const record = nemesis.wins - nemesis.losses;
  const games = nemesis.games;
  
  if (record > 3) {
    return { drama: "Rivalry conquered", narrative: `You own ${nemesis.username}`, verdict: "winning" };
  }
  if (record > 0) {
    return { drama: "Slight edge", narrative: "The rivalry tilts your way", verdict: "winning" };
  }
  if (record === 0) {
    return { drama: "Perfect balance", narrative: "An even match", verdict: "tied" };
  }
  if (record > -3) {
    return { drama: "Close contest", narrative: "They have a slight lead", verdict: "losing" };
  }
  return { drama: "The nemesis leads", narrative: "Revenge awaits in 2025", verdict: "losing" };
}

export function getPersonalityIntro(stats: WrappedStats): { reveal: string; trait: string } {
  const winRate = stats.summary.overallWinRate;
  const games = stats.summary.totalGames;
  const format = (stats.summary.mostPlayedFormat || "blitz").toLowerCase();
  
  if (winRate >= 65 && games >= 500) {
    return { reveal: "Your chess DNA is...", trait: "DOMINANT" };
  }
  if (format === "bullet" && games >= 1000) {
    return { reveal: "Your chess soul is...", trait: "FEARLESS" };
  }
  if (winRate >= 55) {
    return { reveal: "Your chess spirit is...", trait: "COMPETITIVE" };
  }
  if (games >= 2000) {
    return { reveal: "Your chess heart is...", trait: "DEDICATED" };
  }
  return { reveal: "Your chess essence is...", trait: "EVOLVING" };
}

export function getSummaryIntro(stats: WrappedStats): { headline: string; subtitle: string; vibe: string } {
  const winRate = stats.summary.overallWinRate;
  const games = stats.summary.totalGames;
  const history = stats.ratings.history || [];
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  
  if (winRate >= 60 && totalChange >= 100) {
    return { headline: "LEGENDARY", subtitle: "Year of domination", vibe: "You crushed it" };
  }
  if (winRate >= 55 || totalChange >= 50) {
    return { headline: "IMPRESSIVE", subtitle: "A year to remember", vibe: "Strong performance" };
  }
  if (games >= 1000) {
    return { headline: "DEDICATED", subtitle: "Year of commitment", vibe: "The grind was real" };
  }
  if (winRate >= 50) {
    return { headline: "SOLID", subtitle: "Year of consistency", vibe: "Well played" };
  }
  return { headline: "GROWING", subtitle: "Year of learning", vibe: "The best is ahead" };
}
