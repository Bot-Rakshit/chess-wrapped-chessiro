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
const PADDING_Y = 40;
const CONTENT_WIDTH = 820 - (PADDING_X * 2);

// Vertical spacing between elements (adjust this one value to control all spacing)
const VERTICAL_SPACING = 30;

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
  const playStreak = stats.activity?.longestPlayStreak || 0;
  
  if (winStreak >= 15) return "Absolutely unstoppable!";
  if (winStreak >= 10) return "You were on fire!";
  if (winStreak >= 7) return "Pure dominance!";
  if (winStreak >= 5) return "Five in a row!";
  if (playStreak >= 30) return "Month-long dedication!";
  if (playStreak >= 14) return "Two weeks strong!";
  if (playStreak >= 7) return "Week-long warrior!";
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
      justifyContent: "space-between",
      padding: PADDING_Y,
      
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
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

      {/* Empty spacer for bottom balance */}
      <div style={{ display: "flex" }} />
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
      justifyContent: "space-between",
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
          {`minutes (${totalDays} days)`}
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
      justifyContent: "space-between",
      padding: PADDING_Y,
      
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 1200, color: "rgba(255,255,255,0.95)", marginBottom: 20 , fontStyle: "extrabold"}}>
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
      justifyContent: "space-between",
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
      <div style={{ display: "flex", justifyContent: "center",
      gap: 50 }}>
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

  const showPositiveDelta = (change: number) => change > 0;
  const displayDelta = (change: number) => change > 0 ? `+${change}` : "";

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "space-between",
      padding: PADDING_Y,
      
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header with one-liner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 48, fontWeight: 800, color: "white" }}>
          Rating Gains
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
          {oneLiner}
        </span>
      </div>

      {/* Rapid */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 3 }}>RAPID</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 100, fontWeight: 700, color: "#7DD3FC", lineHeight: 1, marginTop: 8 }}>{rapid.rating}</span>
        {showPositiveDelta(rapid.change) && (
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#61DE58", marginTop: 8 }}>
            {displayDelta(rapid.change)}
          </span>
        )}
      </div>

      {/* Blitz */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 3 }}>BLITZ</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 100, fontWeight: 700, color: "#FBBF24", lineHeight: 1, marginTop: 8 }}>{blitz.rating}</span>
        {showPositiveDelta(blitz.change) && (
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#61DE58", marginTop: 8 }}>
            {displayDelta(blitz.change)}
          </span>
        )}
      </div>

      {/* Bullet */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 3 }}>BULLET</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 100, fontWeight: 700, color: "#F87171", lineHeight: 1, marginTop: 8 }}>{bullet.rating}</span>
        {showPositiveDelta(bullet.change) && (
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#61DE58", marginTop: 8 }}>
            {displayDelta(bullet.change)}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// Card 6: Total Openings Explored (NEW - Background 4)
// ============================================
function Card6({ stats }: CardData) {
  const totalUnique = stats.openings?.totalUnique || 0;
  
  const getOpeningsInsight = (count: number) => {
    if (count >= 100) return "A true opening explorer!";
    if (count >= 50) return "Diverse repertoire!";
    if (count >= 20) return "Building depth!";
    if (count >= 10) return "Finding your style!";
    return "Just getting started!";
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "space-between",
      padding: PADDING_Y,
      
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
        <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "white" }}>
          Opening Explorer
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
          You explored
        </span>
      </div>

      {/* Total Openings Count */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 140, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>
          {totalUnique}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 2, marginTop: 10 }}>
          UNIQUE OPENINGS
        </span>
      </div>

      {/* Insight */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontStyle: "italic" }}>
          {getOpeningsInsight(totalUnique)}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
          Let's see your favorites →
        </span>
      </div>
    </div>
  );
}

// ============================================
// Card 6b: Biggest Win (Background 8) - renamed from Card6
// ============================================
function Card6Win({ stats }: CardData) {
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
      justifyContent: "space-between",
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
  const playStreak = stats.activity?.longestPlayStreak || 1;
  const oneLiner = getStreaksOneLiner(stats);

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "space-between",
      padding: PADDING_Y,
      
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Intelligent One-liner */}
      <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
        {oneLiner}
      </span>

      {/* Longest Win Streak */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 130, fontWeight: 700, color: "#61DE58", lineHeight: 1 }}>
          {winStreak}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 4, marginTop: 15 }}>
          longest win streak
        </span>
      </div>

      {/* Longest Play Streak */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 130, fontWeight: 700, color: "#34D399", lineHeight: 1 }}>
          {playStreak}
        </span>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 4, marginTop: 15 }}>
          days in a row
        </span>
      </div>

      {/* Empty spacer for bottom balance */}
      <div style={{ display: "flex" }} />
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
      justifyContent: "space-between",
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
    { name: "Magnus Carlsen", quote: "I like to calculate deeply and find the truth", image: "/magnus.jpg" },
    { name: "Hikaru Nakamura", quote: "Speed and intuition win the day", image: "/hikaru.jpg" },
    { name: "Garry Kasparov", quote: "Attack is the best defense", image: "/garry.jpg" },
    { name: "Bobby Fischer", quote: "I like to crush my opponents ego", image: "/bobby.jpg" },
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
      justifyContent: "space-between",
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

      {/* Player Image */}
      <img 
        src={personality.image}
        alt={personality.name}
        style={{ 
          width: 200, 
          height: 200, 
          borderRadius: 100, 
          objectFit: "cover",
          border: "4px solid rgba(255,255,255,0.2)"
        }} 
      />

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
// Card 11: Top Openings (New card)
// ============================================
function Card11({ stats }: CardData) {
  const bestWhite = stats.openings?.bestAsWhite;
  const bestBlack = stats.openings?.bestAsBlack;
  
  // Get first two words of opening name for cleaner display
  const formatOpening = (name: string) => {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return words.slice(0, 2).join(' ');
  };

  const BOX_WIDTH = 600;
  const BOX_HEIGHT = 280;

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "space-between",
      padding: PADDING_Y,
      
      paddingLeft: PADDING_X,
      paddingRight: PADDING_X,
    }}>
      {/* Header */}
      <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "white" }}>
        Your Openings
      </span>

      {/* Best as White */}
      {bestWhite && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          gap: 20,
          width: BOX_WIDTH, 
          height: BOX_HEIGHT,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "#1E293B" }}>W</span>
            </div>
            <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 700, color: "white" }}>Best as White</span>
          </div>
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#EB9719", textAlign: "center", whiteSpace: "nowrap" }}>
            {formatOpening(bestWhite.name)}
          </span>
          <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 36, fontWeight: 700, color: "#61DE58" }}>
              {Math.round(bestWhite.winRate)}%
            </span>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
              {bestWhite.games} games
            </span>
          </div>
        </div>
      )}

      {/* Best as Black */}
      {bestBlack && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          gap: 20, 
          width: BOX_WIDTH, 
          height: BOX_HEIGHT,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#0F172A", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "white" }}>B</span>
            </div>
            <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 700, color: "white" }}>Best as Black</span>
          </div>
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#E26521", textAlign: "center", whiteSpace: "nowrap" }}>
            {formatOpening(bestBlack.name)}
          </span>
          <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 36, fontWeight: 700, color: "#61DE58" }}>
              {Math.round(bestBlack.winRate)}%
            </span>
            <span style={{ fontFamily: "Syncopate", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
              {bestBlack.games} games
            </span>
          </div>
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
      justifyContent: "space-between",
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
    case "6": case "openings": CardComponent = <Card6 stats={stats} />; break; // Total Openings (new)
    case "6b": case "bestwin": CardComponent = <Card6Win stats={stats} />; break;
    case "7": case "streaks": CardComponent = <Card7 stats={stats} />; break;
    case "8": case "nemesis": CardComponent = <Card8 stats={stats} />; break;
    case "9": case "personality": CardComponent = <Card9 stats={stats} />; break;
    case "11": case "openings-detail": CardComponent = <Card11 stats={stats} />; break;
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

export function getBackgroundImagePath(cardType: string): string {
  const backgrounds: Record<string, string> = {
    "1": "Background 1.png",
    "2": "Background 2.png", 
    "3": "Background 3.png",
    "4": "Background 4.png",
    "5": "Background 5.png",
    "6": "Background 4.png", // Total Openings uses same background as journey
    "6b": "Background 8.png",
    "7": "Background 7.png",
    "8": "Background 9.png",
    "9": "Background 10.png",
    "11": "Background 4.png",
    "12": "Background 6.png",
  };
  return path.join(process.cwd(), "public", "base", backgrounds[cardType] || "Background 1.png");
}
