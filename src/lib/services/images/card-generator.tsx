import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import type { WrappedStats } from "../../types";

// Load fonts from @fontsource packages
const syneFontPath = path.join(process.cwd(), "node_modules", "@fontsource", "syne", "files", "syne-latin-700-normal.woff");
const syneFontPath800 = path.join(process.cwd(), "node_modules", "@fontsource", "syne", "files", "syne-latin-800-normal.woff");
const syneFontPath500 = path.join(process.cwd(), "node_modules", "@fontsource", "syne", "files", "syne-latin-500-normal.woff");
const syncopateFontPath = path.join(process.cwd(), "node_modules", "@fontsource", "syncopate", "files", "syncopate-latin-700-normal.woff");

let syneFont700: ArrayBuffer | null = null;
let syneFont800: ArrayBuffer | null = null;
let syneFont500: ArrayBuffer | null = null;
let syncopateFont: ArrayBuffer | null = null;

function loadFonts() {
  if (!syneFont700) {
    try {
      const buffer = fs.readFileSync(syneFontPath);
      syneFont700 = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (e) {
      console.warn('Failed to load Syne 700 font, using fallback');
    }
  }
  if (!syneFont800) {
    try {
      const buffer = fs.readFileSync(syneFontPath800);
      syneFont800 = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (e) {
      console.warn('Failed to load Syne 800 font, using fallback');
    }
  }
  if (!syneFont500) {
    try {
      const buffer = fs.readFileSync(syneFontPath500);
      syneFont500 = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (e) {
      console.warn('Failed to load Syne 500 font, using fallback');
    }
  }
  if (!syncopateFont) {
    try {
      const buffer = fs.readFileSync(syncopateFontPath);
      syncopateFont = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (e) {
      console.warn('Failed to load Syncopate font, using fallback');
    }
  }
  return { syneFont700, syneFont800, syneFont500, syncopateFont };
}

interface CardData {
  stats: WrappedStats;
}

// Safe padding from edges
const PADDING_X = 70;
const PADDING_Y = 100;
const CONTENT_WIDTH = 820 - (PADDING_X * 2);

// Balanced gap for vertical spacing between elements
const SECTION_GAP = 70;

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Dynamic font size based on number of characters
function getDynamicFontSize(num: number, baseSize: number, minSize: number = 50): number {
  const formatted = formatNumber(num);
  const charCount = formatted.length;
  
  if (charCount <= 3) return baseSize;
  if (charCount <= 4) return Math.max(baseSize * 0.85, minSize);
  if (charCount <= 5) return Math.max(baseSize * 0.72, minSize);
  if (charCount <= 6) return Math.max(baseSize * 0.62, minSize);
  if (charCount <= 7) return Math.max(baseSize * 0.52, minSize);
  return Math.max(baseSize * 0.45, minSize);
}

// ============================================
// Intelligent Contextual Text Generators
// ============================================
function getGamesOneLiner(stats: WrappedStats): string {
  const games = stats.summary.totalGames;
  const winRate = stats.summary.overallWinRate;
  
  if (games >= 5000 && winRate >= 55) return "A true chess warrior!";
  if (games >= 5000) return "You lived on the board!";
  if (games >= 2000 && winRate >= 60) return "Quality and quantity!";
  if (games >= 2000) return "The grind was real!";
  if (games >= 1000 && winRate >= 55) return "A winning machine!";
  if (games >= 1000) return "A thousand battles fought!";
  if (winRate >= 60) return "Quality over quantity!";
  if (winRate >= 50) return "Solid performance!";
  return "Every game is a lesson!";
}

function getTimeOneLiner(stats: WrappedStats): string {
  const minutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days >= 30) return "More than a month of chess!";
  if (days >= 14) return "Two weeks of dedication!";
  if (days >= 7) return "A whole week on the board!";
  if (hours >= 100) return "Triple digit hours!";
  if (hours >= 50) return "Serious commitment!";
  return "Every minute counts!";
}

function getStyleOneLiner(stats: WrappedStats): string {
  const format = (stats.summary.mostPlayedFormat || "blitz").toLowerCase();
  const games = stats.summary.totalGames;
  
  if (format === "bullet" && games >= 1000) return "Speed is your superpower!";
  if (format === "bullet") return "Living for the adrenaline!";
  if (format === "blitz" && games >= 1000) return "The perfect balance!";
  if (format === "blitz") return "Fast thinking, smart moves!";
  if (format === "rapid") return "Patience is your weapon!";
  return "Versatile and adaptable!";
}

function getJourneyOneLiner(stats: WrappedStats): string {
  const history = stats.ratings.history || [];
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  const allPeaks = history.map(h => h.peak).filter(p => p > 0);
  const highestPeak = allPeaks.length > 0 ? Math.max(...allPeaks) : 0;
  
  if (highestPeak >= 2000) return "Elite territory reached!";
  if (totalChange >= 200) return "Incredible growth!";
  if (totalChange >= 100) return "The grind paid off!";
  if (totalChange >= 50) return "Steady improvement!";
  if (totalChange >= 0) return "Holding strong!";
  return "Resilience builds champions!";
}

function getRatingsOneLiner(stats: WrappedStats): string {
  const history = stats.ratings.history || [];
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  
  if (totalChange >= 200) return "Rising star!";
  if (totalChange >= 100) return "Level up achieved!";
  if (totalChange >= 50) return "Progress made!";
  if (totalChange >= 0) return "Solid foundation!";
  if (totalChange >= -50) return "Keep pushing!";
  return "Comeback loading...";
}

function getBigWinOneLiner(stats: WrappedStats): string {
  const highestDefeated = stats.opponents?.highestRatedDefeated;
  const rating = highestDefeated?.rating || 0;
  const currentRatings = Object.values(stats.ratings.current || {}).filter(r => r > 0);
  const avgRating = currentRatings.length > 0 ? currentRatings.reduce((a, b) => a + b, 0) / currentRatings.length : 1200;
  const diff = rating - avgRating;
  
  if (diff >= 300) return "Giant slayer!";
  if (diff >= 150) return "Impressive upset!";
  if (rating >= 2000) return "Elite takedown!";
  if (rating >= 1500) return "Quality victory!";
  return "Every win counts!";
}

function getStreaksOneLiner(stats: WrappedStats): string {
  const winStreak = stats.streaks?.longestWinStreak || 0;
  const days = stats.activity?.sessions?.total || 0;
  
  if (winStreak >= 15) return "Absolutely unstoppable!";
  if (winStreak >= 10) return "You were on fire!";
  if (winStreak >= 7) return "Pure dominance!";
  if (winStreak >= 5) return "Five in a row!";
  if (days >= 200) return "That's dedication!";
  if (days >= 100) return "Consistency is key!";
  return "Building momentum!";
}

function getNemesisOneLiner(stats: WrappedStats): string {
  const nemesis = stats.opponents?.nemesis;
  if (!nemesis) return "No rival found!";
  
  const record = nemesis.wins - nemesis.losses;
  if (record > 5) return "Rivalry conquered!";
  if (record > 0) return "You have the edge!";
  if (record === 0) return "A worthy opponent!";
  if (record > -5) return "The battle continues!";
  return "Revenge awaits!";
}

function getPersonalityOneLiner(stats: WrappedStats): string {
  const winRate = stats.summary.overallWinRate;
  const format = (stats.summary.mostPlayedFormat || "blitz").toLowerCase();
  
  if (winRate >= 65) return "A dominant force!";
  if (format === "bullet" && winRate >= 50) return "Speed and precision!";
  if (format === "blitz") return "Fast and strategic!";
  if (format === "rapid") return "Deep and calculated!";
  return "Always evolving!";
}

function getSummaryOneLiner(stats: WrappedStats): string {
  const winRate = stats.summary.overallWinRate;
  const games = stats.summary.totalGames;
  const history = stats.ratings.history || [];
  const totalChange = history.reduce((sum, h) => sum + h.change, 0);
  
  if (winRate >= 60 && totalChange >= 100) return "Legendary year!";
  if (winRate >= 55 && games >= 1000) return "Year of dominance!";
  if (totalChange >= 100) return "Year of growth!";
  if (games >= 2000) return "Year of dedication!";
  if (winRate >= 50) return "Solid year!";
  return "The best is ahead!";
}

// ============================================
// Card 1: Game Outcomes (Background 1)
// ============================================
function Card1({ stats }: CardData) {
  const gamesPlayed = stats.summary.totalGames;
  const wins = stats.summary.totalWins;
  const checkmates = stats.checkmates.given;
  const oneLiner = getGamesOneLiner(stats);

  const gamesFontSize = getDynamicFontSize(gamesPlayed, 130);
  const winsFontSize = getDynamicFontSize(wins, 130);
  const checkmatesFontSize = getDynamicFontSize(checkmates, 130);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP - 10,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 10 }}>
        {oneLiner}
      </span>

      {/* Games Played */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Games Played</span>
        <span style={{ fontFamily: "Syncopate", fontSize: gamesFontSize, fontWeight: 700, color: "#EB9719", lineHeight: 1.15, marginTop: 8 }}>
          {formatNumber(gamesPlayed)}
        </span>
      </div>

      {/* Wins */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Wins</span>
        <span style={{ fontFamily: "Syncopate", fontSize: winsFontSize, fontWeight: 700, color: "#E26521", lineHeight: 1.15, marginTop: 8 }}>
          {formatNumber(wins)}
        </span>
      </div>

      {/* Checkmates */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Checkmates</span>
        <span style={{ fontFamily: "Syncopate", fontSize: checkmatesFontSize, fontWeight: 700, color: "#F22E2E", lineHeight: 1.15, marginTop: 8 }}>
          {formatNumber(checkmates)}
        </span>
      </div>
    </div>
  );
}

// ============================================
// Card 2: Time & Moves (Background 2)
// ============================================
function Card2({ stats }: CardData) {
  const totalMinutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const totalDays = Math.floor(totalMinutes / 1440);
  const totalMoves = stats.activity.totalMoves;
  const oneLiner = getTimeOneLiner(stats);

  const minutesFontSize = getDynamicFontSize(totalMinutes, 110, 65);
  const movesFontSize = getDynamicFontSize(totalMoves, 100, 60);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <span style={{ fontFamily: "Syne", fontSize: 48, fontWeight: 800, color: "#CEFFDD", fontStyle: "italic" }}>
        You played
      </span>

      {/* Minutes */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: minutesFontSize, fontWeight: 700, color: "#61DE58", lineHeight: 1.1 }}>
          {formatNumber(totalMinutes)}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 500, color: "#CEFFDD", marginTop: 12 }}>
          {`minutes (that's ${totalDays} days)`}
        </span>
      </div>

      {/* Moves */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: movesFontSize, fontWeight: 700, color: "#61DE58", lineHeight: 1.1 }}>
          {formatNumber(totalMoves)}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 500, color: "#CEFFDD", marginTop: 12 }}>
          moves
        </span>
      </div>

      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "#CEFFDD", fontStyle: "italic" }}>
        {oneLiner}
      </span>
    </div>
  );
}

// ============================================
// Card 3: Blitz Wizard (Background 3) - Single Segmented Bar
// ============================================
function Card3({ stats }: CardData) {
  const timeControls = stats.timeControls || [];
  const rapid = timeControls.find(tc => tc.timeClass === "rapid")?.games || 0;
  const blitz = timeControls.find(tc => tc.timeClass === "blitz")?.games || 0;
  const bullet = timeControls.find(tc => tc.timeClass === "bullet")?.games || 0;
  
  const total = rapid + blitz + bullet || 1;
  const mostPlayed = stats.summary.mostPlayedFormat?.toUpperCase() || "BLITZ";
  const mostPlayedPercent = Math.round((Math.max(rapid, blitz, bullet) / total) * 100);
  const oneLiner = getStyleOneLiner(stats);

  const barWidth = 620;
  const rapidWidth = Math.max((rapid / total) * barWidth, rapid > 0 ? 30 : 0);
  const blitzWidth = Math.max((blitz / total) * barWidth, blitz > 0 ? 30 : 0);
  const bulletWidth = Math.max((bullet / total) * barWidth, bullet > 0 ? 30 : 0);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 20 }}>
          You're a
        </span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>
          {mostPlayed}
        </span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>
          WIZARD
        </span>
      </div>

      {/* Bar Chart Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {/* Values above bar */}
        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginBottom: 14 }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#7DD3FC" }}>{rapid}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#FBBF24" }}>{blitz}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#F87171" }}>{bullet}</span>
        </div>

        {/* Single Segmented Bar */}
        <div style={{ display: "flex", width: barWidth, height: 36, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ width: rapidWidth, height: 36, backgroundColor: "#7DD3FC" }} />
          <div style={{ width: blitzWidth, height: 36, backgroundColor: "#FBBF24" }} />
          <div style={{ width: bulletWidth, height: 36, backgroundColor: "#F87171" }} />
        </div>

        {/* Labels below bar */}
        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginTop: 14 }}>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#7DD3FC" }}>Rapid</span>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#FBBF24" }}>Blitz</span>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#F87171" }}>Bullet</span>
        </div>
      </div>

      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>
        {oneLiner}
      </span>
    </div>
  );
}

// ============================================
// Card 4: Your Journey (Background 4) - Line Graph
// ============================================
function Card4({ stats }: CardData) {
  const ratings = stats.ratings.current || {};
  const history = stats.ratings.history || [];
  const oneLiner = getJourneyOneLiner(stats);
  
  const rapidPeak = history.find(h => h.format === "rapid")?.peak || ratings.rapid || 0;
  const blitzPeak = history.find(h => h.format === "blitz")?.peak || ratings.blitz || 0;
  const bulletPeak = history.find(h => h.format === "bullet")?.peak || ratings.bullet || 0;

  const rapidHistory = history.find(h => h.format === "rapid")?.dataPoints || [];
  const blitzHistory = history.find(h => h.format === "blitz")?.dataPoints || [];
  const bulletHistory = history.find(h => h.format === "bullet")?.dataPoints || [];

  const chartWidth = 600;
  const chartHeight = 250;
  const chartMarginLeft = 60;
  const chartMarginBottom = 40;
  const chartMarginTop = 20;

  // Sample evenly across the entire dataset to show the full journey
  const sampleDataPoints = (dataPoints: { rating: number; date: string }[], sampleSize: number = 20) => {
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

  const createLinePath = (dataPoints: { rating: number }[]) => {
    if (dataPoints.length < 2) return "";
    const range = paddedMax - paddedMin || 1;
    const drawableHeight = chartHeight - chartMarginBottom - chartMarginTop;
    
    const points = dataPoints.map((point, i, arr) => {
      const x = chartMarginLeft + (i / (arr.length - 1)) * chartWidth;
      const y = chartMarginTop + drawableHeight - ((point.rating - paddedMin) / range) * drawableHeight;
      return `${x},${y}`;
    });
    
    return points.join(" ");
  };

  // Generate Y-axis labels
  const yLabelCount = 5;
  const yStep = (paddedMax - paddedMin) / (yLabelCount - 1);
  const yLabels = Array.from({ length: yLabelCount }, (_, i) => Math.round(paddedMax - i * yStep));

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: 40,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header with one-liner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 48, fontWeight: 800, color: "white" }}>
          Your Journey
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
          {oneLiner}
        </span>
      </div>

      {/* Chart Container */}
      <div style={{ display: "flex", position: "relative", width: chartWidth + chartMarginLeft + 10, height: chartHeight + 10 }}>
        {/* Y-axis labels */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: chartHeight - chartMarginBottom, position: "absolute", left: 0, top: chartMarginTop }}>
          {yLabels.map((label, i) => (
            <span key={i} style={{ fontFamily: "Syncopate", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "right", width: chartMarginLeft - 8 }}>{label}</span>
          ))}
        </div>

        {/* Grid and Lines */}
        <svg width={chartWidth + chartMarginLeft + 10} height={chartHeight} style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Horizontal grid lines */}
          {yLabels.map((_, i) => {
            const drawableHeight = chartHeight - chartMarginBottom - chartMarginTop;
            const y = chartMarginTop + (i / (yLabels.length - 1)) * drawableHeight;
            return (
              <line key={i} x1={chartMarginLeft} y1={y} x2={chartWidth + chartMarginLeft} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            );
          })}
          
          {/* Y-axis */}
          <line x1={chartMarginLeft} y1={chartMarginTop} x2={chartMarginLeft} y2={chartHeight - chartMarginBottom} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* X-axis */}
          <line x1={chartMarginLeft} y1={chartHeight - chartMarginBottom} x2={chartWidth + chartMarginLeft} y2={chartHeight - chartMarginBottom} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Data lines */}
          {sampledRapid.length >= 2 && (
            <polyline points={createLinePath(sampledRapid)} fill="none" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {sampledBlitz.length >= 2 && (
            <polyline points={createLinePath(sampledBlitz)} fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {sampledBullet.length >= 2 && (
            <polyline points={createLinePath(sampledBullet)} fill="none" stroke="#F87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>

        {/* X-axis labels */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", bottom: 0, left: chartMarginLeft, width: chartWidth }}>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Jan</span>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Apr</span>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Jul</span>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Oct</span>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Dec</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 35 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 4, backgroundColor: "#7DD3FC", borderRadius: 2 }} />
          <span style={{ fontFamily: "Syne", fontSize: 14, color: "#7DD3FC" }}>Rapid</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 4, backgroundColor: "#FBBF24", borderRadius: 2 }} />
          <span style={{ fontFamily: "Syne", fontSize: 14, color: "#FBBF24" }}>Blitz</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 4, backgroundColor: "#F87171", borderRadius: 2 }} />
          <span style={{ fontFamily: "Syne", fontSize: 14, color: "#F87171" }}>Bullet</span>
        </div>
      </div>

      {/* Peak Ratings */}
      <div style={{ display: "flex", justifyContent: "center", gap: 50 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 36, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>{rapidPeak}</span>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#7DD3FC", marginTop: 6 }}>Peak Rapid</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 36, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>{blitzPeak}</span>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#FBBF24", marginTop: 6 }}>Peak Blitz</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 36, fontWeight: 700, color: "#F87171", lineHeight: 1 }}>{bulletPeak}</span>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#F87171", marginTop: 6 }}>Peak Bullet</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Card 5: Rating Gains (Background 5)
// ============================================
function Card5({ stats }: CardData) {
  const history = stats.ratings.history || [];
  const ratings = stats.ratings.current || {};
  const oneLiner = getRatingsOneLiner(stats);
  
  const rapid = { rating: ratings.rapid || 0, change: history.find(h => h.format === "rapid")?.change || 0 };
  const blitz = { rating: ratings.blitz || 0, change: history.find(h => h.format === "blitz")?.change || 0 };
  const bullet = { rating: ratings.bullet || 0, change: history.find(h => h.format === "bullet")?.change || 0 };

  const formatDelta = (change: number) => change >= 0 ? `+${change}` : String(change);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP - 10,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: 15 }}>
        {oneLiner}
      </span>

      {/* Rapid */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Rapid</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 90, fontWeight: 700, color: "#7DD3FC", lineHeight: 1.1, marginTop: 5 }}>{rapid.rating}</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 30, fontWeight: 700, color: rapid.change >= 0 ? "#61DE58" : "#F87171", marginTop: 5 }}>
          {formatDelta(rapid.change)}
        </span>
      </div>

      {/* Blitz */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Blitz</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 90, fontWeight: 700, color: "#7DD3FC", lineHeight: 1.1, marginTop: 5 }}>{blitz.rating}</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 30, fontWeight: 700, color: blitz.change >= 0 ? "#61DE58" : "#F87171", marginTop: 5 }}>
          {formatDelta(blitz.change)}
        </span>
      </div>

      {/* Bullet */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Bullet</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 90, fontWeight: 700, color: "#7DD3FC", lineHeight: 1.1, marginTop: 5 }}>{bullet.rating}</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 30, fontWeight: 700, color: bullet.change >= 0 ? "#61DE58" : "#F87171", marginTop: 5 }}>
          {formatDelta(bullet.change)}
        </span>
      </div>
    </div>
  );
}

// ============================================
// Card 6: Biggest Win (Background 8)
// ============================================
function Card6({ stats }: CardData) {
  const highestDefeated = stats.opponents?.highestRatedDefeated;
  const bestWin = stats.notableGames?.bestWin;
  const oneLiner = getBigWinOneLiner(stats);
  
  const opponentName = highestDefeated?.username || bestWin?.opponent || "Unknown";
  const opponentRating = highestDefeated?.rating || bestWin?.opponentRating || 0;

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP - 10,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header with one-liner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "white" }}>
          Your Biggest Win
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
          {oneLiner}
        </span>
      </div>

      {/* Avatar Circle */}
      <div style={{ width: 190, height: 190, borderRadius: 95, backgroundColor: "#61DE58", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 70, fontWeight: 700, color: "white" }}>
          {opponentName.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Identity */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 800, color: "white", textAlign: "center", maxWidth: CONTENT_WIDTH }}>{opponentName}</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginTop: 10 }}>
          ({opponentRating})
        </span>
      </div>

      {/* Description */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.95)" }}>You defeated a</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 56, fontWeight: 700, color: "#61DE58", marginTop: 15 }}>
          {opponentRating}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.95)", marginTop: 15 }}>rated player!</span>
      </div>
    </div>
  );
}

// ============================================
// Card 7: Streaks (Background 7)
// ============================================
function Card7({ stats }: CardData) {
  const winStreak = stats.streaks?.longestWinStreak || 0;
  const daysStreak = stats.activity?.sessions?.total || 30;
  const oneLiner = getStreaksOneLiner(stats);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP + 20,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
        {oneLiner}
      </span>

      {/* Days Streak */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 130, fontWeight: 700, color: "#61DE58", lineHeight: 1 }}>
          {daysStreak}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 4, marginTop: 20 }}>
          days in a row
        </span>
      </div>

      {/* Win Streak */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 130, fontWeight: 700, color: "#61DE58", lineHeight: 1 }}>
          {winStreak}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 4, marginTop: 20 }}>
          win streak
        </span>
      </div>
    </div>
  );
}

// ============================================
// Card 8: Nemesis (Background 9)
// ============================================
function Card8({ stats }: CardData) {
  const nemesis = stats.opponents?.nemesis;
  const name = nemesis?.username || "No Nemesis Yet";
  const games = nemesis?.games || 0;
  const oneLiner = getNemesisOneLiner(stats);
  
  const wins = nemesis?.wins || 0;
  const losses = nemesis?.losses || 0;
  const draws = games - wins - losses;

  const total = wins + draws + losses || 1;
  const barWidth = 600;
  const winWidth = Math.max((wins / total) * barWidth, wins > 0 ? 25 : 0);
  const drawWidth = Math.max((draws / total) * barWidth, draws > 0 ? 25 : 0);
  const lossWidth = Math.max((losses / total) * barWidth, losses > 0 ? 25 : 0);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP - 10,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header with one-liner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "#F87171" }}>
          Your Nemesis
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
          {oneLiner}
        </span>
      </div>

      {/* Avatar Circle */}
      <div style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: "#F87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 65, fontWeight: 700, color: "white" }}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Identity */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, color: "white", textAlign: "center", maxWidth: CONTENT_WIDTH }}>{name}</span>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "#D4A574", marginTop: 10 }}>
          {games} games
        </span>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {/* Values */}
        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginBottom: 14 }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 34, fontWeight: 700, color: "#61DE58" }}>{wins}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 34, fontWeight: 700, color: "#9CA3AF" }}>{draws}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 34, fontWeight: 700, color: "#F87171" }}>{losses}</span>
        </div>

        {/* Bar */}
        <div style={{ display: "flex", width: barWidth, height: 32, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ width: winWidth, height: 32, backgroundColor: "#61DE58" }} />
          <div style={{ width: drawWidth, height: 32, backgroundColor: "#9CA3AF" }} />
          <div style={{ width: lossWidth, height: 32, backgroundColor: "#F87171" }} />
        </div>

        {/* Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginTop: 14 }}>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#61DE58" }}>Won</span>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#9CA3AF" }}>Draw</span>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#F87171" }}>Lost</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Card 9: Personality (Background 10)
// ============================================
function Card9({ stats }: CardData) {
  const personalities = [
    { name: "Magnus Carlsen", quote: "I like to calculate deeply and find the truth" },
    { name: "Hikaru Nakamura", quote: "Speed and intuition win the day" },
    { name: "Garry Kasparov", quote: "Attack is the best defense" },
    { name: "Bobby Fischer", quote: "I like to crush my opponents ego" },
  ];
  
  const index = (stats.summary.totalGames + stats.summary.totalWins) % personalities.length;
  const personality = personalities[index];
  const oneLiner = getPersonalityOneLiner(stats);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: SECTION_GAP - 10,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Intelligent One-liner at top */}
      <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
        {oneLiner}
      </span>

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>Your Personality</span>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>is like</span>
      </div>

      {/* Avatar Circle */}
      <div style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: "#FBC4AB", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 72, fontWeight: 700, color: "#1E293B" }}>
          {personality.name.charAt(0)}
        </span>
      </div>

      {/* Identity */}
      <span style={{ fontFamily: "Syne", fontSize: 42, fontWeight: 700, color: "#7DD3FC", textAlign: "center" }}>{personality.name}</span>

      {/* Quote */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: CONTENT_WIDTH }}>
        <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.85)", textAlign: "center", fontStyle: "italic" }}>
          "{personality.quote}"
        </span>
      </div>
    </div>
  );
}

// ============================================
// Card 10: Summary (Enhanced - Ultimate Shareable Card)
// ============================================
function Card10({ stats }: CardData) {
  const totalGames = stats.summary.totalGames;
  const totalWins = stats.summary.totalWins;
  const totalLosses = stats.summary.totalLosses;
  const totalDraws = stats.summary.totalDraws;
  const totalMinutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const totalHours = Math.round(totalMinutes / 60);
  const totalMoves = stats.activity.totalMoves;
  const oneLiner = getSummaryOneLiner(stats);
  
  const checkmates = stats.checkmates.given;
  const winStreak = stats.streaks?.longestWinStreak || 0;
  const currentStreak = stats.streaks?.currentStreak?.count || 0;
  const winRate = stats.summary.overallWinRate;
  
  // Get peak rating
  const history = stats.ratings.history || [];
  const allPeaks = history.map(h => h.peak).filter(p => p > 0);
  const peakRating = allPeaks.length > 0 ? Math.max(...allPeaks) : 0;
  
  // Get current ratings
  const ratings = stats.ratings.current || {};
  const currentRapid = ratings.rapid || 0;
  const currentBlitz = ratings.blitz || 0;
  const currentBullet = ratings.bullet || 0;
  
  // Calculate rating changes
  const rapidChange = history.find(h => h.format === "rapid")?.change || 0;
  const blitzChange = history.find(h => h.format === "blitz")?.change || 0;
  const bulletChange = history.find(h => h.format === "bullet")?.change || 0;
  
  // Fun stats
  const gamesPerDay = totalGames > 0 ? (totalGames / 365).toFixed(1) : 0;
  const totalUnique = stats.opponents?.mostPlayed?.length || 0;
  const daysPlayed = stats.activity?.sessions?.total || 0;
  const bestOpening = stats.openings?.bestAsWhite || stats.openings?.bestAsBlack;
  const mostPlayedFormat = (stats.summary.mostPlayedFormat || "blitz").toUpperCase();
  
  // Get avatar URL
  const avatarUrl = stats.profile.avatar;
  const username = stats.username;
  const title = stats.profile.title;

  // Player title based on peak rating
  const getPlayerTitle = (rating: number) => {
    if (rating >= 2400) return "MASTER";
    if (rating >= 2200) return "EXPERT";
    if (rating >= 2000) return "ADVANCED";
    if (rating >= 1800) return "INTERMEDIATE";
    return "RISING STAR";
  };

  // Fun tagline based on achievements
  const getFunTagline = () => {
    if (checkmates >= 200) return "Checkmate Machine";
    if (checkmates >= 100) return "Finisher";
    if (winStreak >= 20) return "On Fire!";
    if (winStreak >= 10) return "Unstoppable!";
    if (totalGames >= 3000) return "Grind Mode";
    if (totalGames >= 2000) return "Dedicated!";
    if (totalHours >= 300) return "Time Invested";
    if (totalHours >= 200) return "Serious Player";
    if (totalDraws >= 100) return "The Diplomat";
    if (totalLosses > totalWins) return "Resilient";
    return "Keep Growing";
  };

  // Format opening name
  const formatOpening = (name: string) => {
    if (!name) return "";
    if (name.length > 22) return name.substring(0, 19) + "...";
    return name;
  };

  // Get best time format
  const getBestFormat = () => {
    const formats = [
      { name: "RAPID", rating: currentRapid, change: rapidChange, color: "#60A5FA" },
      { name: "BLITZ", rating: currentBlitz, change: blitzChange, color: "#FBBF24" },
      { name: "BULLET", rating: currentBullet, change: bulletChange, color: "#F87171" },
    ].filter(f => f.rating > 0);
    return formats.sort((a, b) => b.rating - a.rating)[0] || formats[0];
  };
  const bestFormat = getBestFormat();

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "flex-start",
      gap: 12,
      padding: 40,
      paddingTop: 30,
      paddingBottom: 30,
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#0a0a0a",
    }}>
      {/* Content container */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: 10,
        width: "100%",
      }}>
        {/* Profile Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {/* Avatar */}
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 40, 
            backgroundColor: "#1E293B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "white" }}>
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Username with title */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {title && (
              <span style={{ 
                fontFamily: "Syne", 
                fontSize: 12, 
                fontWeight: 700, 
                color: "#000", 
                backgroundColor: "#FBBF24",
                padding: "3px 8px",
                borderRadius: 4,
                letterSpacing: 1,
              }}>
                {title}
              </span>
            )}
            <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 700, color: "white", letterSpacing: 1 }}>
              {username.toUpperCase()}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 11, fontWeight: 600, color: "#FBBF24", letterSpacing: 2 }}>
              {getPlayerTitle(peakRating)}
            </span>
          </div>
        </div>

        {/* Year Badge */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 10,
          paddingBottom: 8,
          width: "100%",
        }}>
          <span style={{ fontFamily: "Syne", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 4 }}>
            CAPSULE 2025
          </span>
          <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "#FBBF24", fontStyle: "italic", marginTop: 4 }}>
            {oneLiner}
          </span>
        </div>

        {/* Fun Tagline */}
        <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#34D399", letterSpacing: 2 }}>
          {getFunTagline().toUpperCase()}
        </span>

        {/* Best Format Highlight */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8,
          backgroundColor: `${bestFormat.color}15`,
          padding: "8px 16px",
          borderRadius: 20,
          border: `1px solid ${bestFormat.color}30`,
        }}>
          <span style={{ fontFamily: "Syne", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
            BEST FORMAT
          </span>
          <span style={{ fontFamily: "Syncopate", fontSize: 16, fontWeight: 700, color: bestFormat.color }}>
            {bestFormat.name} {bestFormat.rating}
          </span>
          {bestFormat.change !== 0 && (
            <span style={{ 
              fontFamily: "Syncopate", 
              fontSize: 12, 
              fontWeight: 700, 
              color: bestFormat.change > 0 ? "#4ADE80" : "#F87171",
            }}>
              {bestFormat.change > 0 ? "+" : ""}{bestFormat.change}
            </span>
          )}
        </div>

        {/* Current Ratings Row */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {currentRapid > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "#60A5FA" }}>{currentRapid}</span>
              <span style={{ fontFamily: "Syne", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>RAPID</span>
            </div>
          )}
          {currentBlitz > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "#FBBF24" }}>{currentBlitz}</span>
              <span style={{ fontFamily: "Syne", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>BLITZ</span>
            </div>
          )}
          {currentBullet > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "#F87171" }}>{currentBullet}</span>
              <span style={{ fontFamily: "Syne", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>BULLET</span>
            </div>
          )}
        </div>

        {/* Main Stats Grid - 3x2 */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 8, 
          width: "100%",
          marginTop: 4,
        }}>
          {/* Games */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.03)",
            padding: "10px 4px",
            borderRadius: 12,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 700, color: "#22D3EE", lineHeight: 1 }}>
              {formatNumber(totalGames)}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              GAMES
            </span>
          </div>
          
          {/* Wins */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.03)",
            padding: "10px 4px",
            borderRadius: 12,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 700, color: "#4ADE80", lineHeight: 1 }}>
              {formatNumber(totalWins)}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              WINS
            </span>
          </div>
          
          {/* Win Rate */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.03)",
            padding: "10px 4px",
            borderRadius: 12,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>
              {winRate.toFixed(0)}%
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              WIN RATE
            </span>
          </div>
          
          {/* Peak Rating */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.03)",
            padding: "10px 4px",
            borderRadius: 12,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>
              {peakRating}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              PEAK
            </span>
          </div>
          
          {/* Checkmates */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.03)",
            padding: "10px 4px",
            borderRadius: 12,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 700, color: "#F87171", lineHeight: 1 }}>
              {formatNumber(checkmates)}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              MATES
            </span>
          </div>
          
          {/* Best Streak */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.03)",
            padding: "10px 4px",
            borderRadius: 12,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 700, color: "#34D399", lineHeight: 1 }}>
              {winStreak}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              BEST STREAK
            </span>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", fontFamily: "Syne", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
          <span style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 8 }}>
            {gamesPerDay}/day
          </span>
          <span style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 8 }}>
            {totalHours}h played
          </span>
          <span style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 8 }}>
            {daysPlayed} days
          </span>
          <span style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 8 }}>
            {totalDraws} draws
          </span>
          <span style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 8 }}>
            {formatNumber(totalMoves)} moves
          </span>
        </div>

        {/* Additional Highlights Row */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", width: "100%" }}>
          {/* Best Opening */}
          {bestOpening && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(251, 191, 36, 0.2)",
              flex: 1,
            }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 14, fontWeight: 700, color: "#FBBF24", textAlign: "center" }}>
                {formatOpening(bestOpening.name)}
              </span>
              <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                BEST OPENING
              </span>
            </div>
          )}
          
          {/* Current Streak */}
          {currentStreak > 0 && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(52, 211, 153, 0.2)",
              flex: 1,
            }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 18, fontWeight: 700, color: "#34D399" }}>
                {currentStreak}
              </span>
              <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                CURRENT STREAK
              </span>
            </div>
          )}
          
          {/* Total Moves */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: "rgba(34, 211, 238, 0.1)",
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(34, 211, 238, 0.2)",
            flex: 1,
          }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 16, fontWeight: 700, color: "#22D3EE" }}>
              {formatNumber(totalMoves)}
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              TOTAL MOVES
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: 2,
          marginTop: 4,
        }}>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "white", fontStyle: "italic" }}>
            Keep conquering!
          </span>
          <span style={{ fontFamily: "Syne", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
            chessiro.com/@{(username || "").toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Card 11: Top Openings (New card)
// ============================================
function Card11({ stats }: CardData) {
  const bestWhite = stats.openings?.bestAsWhite;
  const bestBlack = stats.openings?.bestAsBlack;
  const totalUnique = stats.openings?.totalUnique || 0;
  
  // Get opening name without ECO code for cleaner display
  const formatOpening = (name: string) => {
    if (name.length > 25) return name.substring(0, 22) + "...";
    return name;
  };

  const whiteOneLiner = bestWhite && bestWhite.winRate >= 60 
    ? "Your secret weapon!" 
    : bestWhite && bestWhite.games >= 50 
      ? "A trusted friend!" 
      : "Your go-to choice!";

  const blackOneLiner = bestBlack && bestBlack.winRate >= 60 
    ? "Defense turned offense!" 
    : bestBlack && bestBlack.games >= 50 
      ? "Solid and reliable!" 
      : "Counter-attack ready!";

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: 50,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "white" }}>
          Your Openings
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
          {totalUnique} unique openings explored
        </span>
      </div>

      {/* Best as White */}
      {bestWhite && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>W</span>
            </div>
            <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "#FBBF24" }}>Best as White</span>
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "white", textAlign: "center" }}>
            {formatOpening(bestWhite.name)}
          </span>
          <div style={{ display: "flex", gap: 30 }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 26, fontWeight: 700, color: "#61DE58" }}>
              {Math.round(bestWhite.winRate)}% wins
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
              {bestWhite.games} games
            </span>
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
            {whiteOneLiner}
          </span>
        </div>
      )}

      {/* Best as Black */}
      {bestBlack && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#1E293B", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 20, fontWeight: 700, color: "white" }}>B</span>
            </div>
            <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "#7DD3FC" }}>Best as Black</span>
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "white", textAlign: "center" }}>
            {formatOpening(bestBlack.name)}
          </span>
          <div style={{ display: "flex", gap: 30 }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 26, fontWeight: 700, color: "#61DE58" }}>
              {Math.round(bestBlack.winRate)}% wins
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
              {bestBlack.games} games
            </span>
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
            {blackOneLiner}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Card 12: Activity Patterns (New card)
// ============================================
function Card12({ stats }: CardData) {
  const playTime = stats.playTime;
  const mostActiveHour = playTime?.mostActiveHour || 20;
  const mostActiveDay = playTime?.mostActiveDay || "Saturday";
  
  // Format hour nicely
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };
  
  // Get time of day category
  const getTimeCategory = (hour: number) => {
    if (hour >= 5 && hour < 12) return { label: "Morning Player", emoji: "Early bird catches the win!" };
    if (hour >= 12 && hour < 17) return { label: "Afternoon Warrior", emoji: "Peak performance hours!" };
    if (hour >= 17 && hour < 21) return { label: "Evening Grinder", emoji: "After-hours dedication!" };
    return { label: "Night Owl", emoji: "Burning the midnight oil!" };
  };
  
  const timeCategory = getTimeCategory(mostActiveHour);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: 60,
      padding: PADDING_Y,
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "white" }}>
          When You Play
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 700, color: "#A78BFA", fontStyle: "italic" }}>
          {timeCategory.label}
        </span>
      </div>

      {/* Most Active Hour */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
          Peak Hour
        </span>
        <span style={{ fontFamily: "Syncopate", fontSize: 80, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>
          {formatHour(mostActiveHour)}
        </span>
      </div>

      {/* Most Active Day */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
          Favorite Day
        </span>
        <span style={{ fontFamily: "Syncopate", fontSize: 60, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>
          {mostActiveDay.toUpperCase()}
        </span>
      </div>

      {/* One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic", textAlign: "center" }}>
        {timeCategory.emoji}
      </span>
    </div>
  );
}

// ============================================
// Main Export Function
// ============================================
export async function generateCardImage(
  stats: WrappedStats,
  backgroundPath: string,
  cardType: string
): Promise<Buffer> {
  const width = 820;
  const height = 1456;

  const { syneFont700, syneFont800, syneFont500, syncopateFont } = loadFonts();

  let CardComponent: React.ReactNode;
  switch (cardType) {
    case "1": case "games": CardComponent = <Card1 stats={stats} />; break;
    case "2": case "time": CardComponent = <Card2 stats={stats} />; break;
    case "3": case "wizard": CardComponent = <Card3 stats={stats} />; break;
    case "4": case "journey": CardComponent = <Card4 stats={stats} />; break;
    case "5": case "rating": CardComponent = <Card5 stats={stats} />; break;
    case "6": case "bestwin": CardComponent = <Card6 stats={stats} />; break;
    case "7": case "streaks": CardComponent = <Card7 stats={stats} />; break;
    case "8": case "nemesis": CardComponent = <Card8 stats={stats} />; break;
    case "9": case "personality": CardComponent = <Card9 stats={stats} />; break;
    case "10": case "summary": CardComponent = <Card10 stats={stats} />; break;
    case "11": case "openings": CardComponent = <Card11 stats={stats} />; break;
    case "12": case "activity": CardComponent = <Card12 stats={stats} />; break;
    default: CardComponent = <Card1 stats={stats} />;
  }

  const fontOptions = [];
  if (syneFont500) fontOptions.push({ name: "Syne", data: syneFont500, weight: 500 as const, style: "normal" as const });
  if (syneFont700) fontOptions.push({ name: "Syne", data: syneFont700, weight: 700 as const, style: "normal" as const });
  if (syneFont800) fontOptions.push({ name: "Syne", data: syneFont800, weight: 800 as const, style: "normal" as const });
  if (syncopateFont) fontOptions.push({ name: "Syncopate", data: syncopateFont, weight: 700 as const, style: "normal" as const });

  const svg = await satori(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {CardComponent}
    </div>,
    {
      width,
      height,
      fonts: fontOptions,
    }
  );

  const backgroundBuffer = fs.readFileSync(backgroundPath);
  const svgBuffer = Buffer.from(svg);

  const image = await sharp(backgroundBuffer)
    .resize(width, height)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .png()
    .toBuffer();

  return image;
}

export function getBackgroundImagePath(index: number): string {
  const backgrounds = [
    "Background 1.png", "Background 2.png", "Background 3.png", "Background 4.png", "Background 5.png",
    "Background 6.png", "Background 7.png", "Background 8.png", "Background 9.png", "Background 10.png",
  ];
  return path.join(process.cwd(), "public", "base", backgrounds[index % backgrounds.length]);
}
