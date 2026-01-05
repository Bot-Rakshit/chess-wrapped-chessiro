import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import type { WrappedStats } from "../../types";

const PADDING_X = 70;
const CONTENT_WIDTH = 820 - (PADDING_X * 2);

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

function Card1({ stats }: { stats: WrappedStats }) {
  const gamesPlayed = stats.summary.totalGames;
  const wins = stats.summary.totalWins;
  const checkmates = stats.checkmates.given;
  const oneLiner = getGamesOneLiner(stats);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 50 }}>
      <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
        {oneLiner}
      </span>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Games Played</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 110, fontWeight: 700, color: "#EB9719", lineHeight: 1.1 }}>{formatNumber(gamesPlayed)}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Wins</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 110, fontWeight: 700, color: "#E26521", lineHeight: 1.1 }}>{formatNumber(wins)}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 38, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Checkmates</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 110, fontWeight: 700, color: "#F22E2E", lineHeight: 1.1 }}>{formatNumber(checkmates)}</span>
      </div>
    </div>
  );
}

function Card2({ stats }: { stats: WrappedStats }) {
  const totalMinutes = Math.floor(stats.activity.totalTimePlayedSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalMinutes / 1440);
  const totalMoves = stats.activity.totalMoves;
  const oneLiner = getTimeOneLiner(stats);

  const timeDisplay = totalDays === 0 
    ? `that's ${totalHours} ${totalHours === 1 ? 'hour' : 'hours'}`
    : `that's ${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 55 }}>
      <span style={{ fontFamily: "Syne", fontSize: 48, fontWeight: 800, color: "#CEFFDD", fontStyle: "italic" }}>
        You played
      </span>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 100, fontWeight: 700, color: "#61DE58", lineHeight: 1.1 }}>{formatNumber(totalMinutes)}</span>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 500, color: "#CEFFDD", marginTop: 10 }}>{`minutes (${timeDisplay})`}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 100, fontWeight: 700, color: "#61DE58", lineHeight: 1.1 }}>{formatNumber(totalMoves)}</span>
        <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 500, color: "#CEFFDD", marginTop: 10 }}>moves</span>
      </div>

      <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "#CEFFDD", fontStyle: "italic" }}>{oneLiner}</span>
    </div>
  );
}

function Card3({ stats }: { stats: WrappedStats }) {
  const timeControls = stats.timeControls || [];
  const rapid = timeControls.find(tc => tc.timeClass === "rapid")?.games || 0;
  const blitz = timeControls.find(tc => tc.timeClass === "blitz")?.games || 0;
  const bullet = timeControls.find(tc => tc.timeClass === "bullet")?.games || 0;
  
  const total = rapid + blitz + bullet || 1;
  const mostPlayed = stats.summary.mostPlayedFormat?.toUpperCase() || "BLITZ";
  const oneLiner = getStyleOneLiner(stats);

  const barWidth = 580;
  const rapidWidth = Math.max((rapid / total) * barWidth, rapid > 0 ? 30 : 0);
  const blitzWidth = Math.max((blitz / total) * barWidth, blitz > 0 ? 30 : 0);
  const bulletWidth = Math.max((bullet / total) * barWidth, bullet > 0 ? 30 : 0);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 15 }}>You're a</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>{mostPlayed.charAt(0) + mostPlayed.slice(1).toLowerCase()}</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>
          {mostPlayed === "RAPID"
            ? "Champion"
            : mostPlayed === "BLITZ"
            ? "Wizard"
            : mostPlayed === "BULLET"
            ? "King"
            : ""}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginBottom: 12 }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#7DD3FC" }}>{rapid}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#FBBF24" }}>{blitz}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#F87171" }}>{bullet}</span>
        </div>

        <div style={{ display: "flex", width: barWidth, height: 36, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ width: rapidWidth, height: 36, backgroundColor: "#7DD3FC" }} />
          <div style={{ width: blitzWidth, height: 36, backgroundColor: "#FBBF24" }} />
          <div style={{ width: bulletWidth, height: 36, backgroundColor: "#F87171" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginTop: 12 }}>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#7DD3FC" }}>Rapid</span>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#FBBF24" }}>Blitz</span>
          <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#F87171" }}>Bullet</span>
        </div>
      </div>

      <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>{oneLiner}</span>
    </div>
  );
}

function Card4({ stats }: { stats: WrappedStats }) {
  const ratings = stats.ratings.current || {};
  const history = stats.ratings.history || [];
  const oneLiner = getJourneyOneLiner(stats);
  
  const rapidPeak = history.find(h => h.format === "rapid")?.peak || ratings.rapid || 0;
  const blitzPeak = history.find(h => h.format === "blitz")?.peak || ratings.blitz || 0;
  const bulletPeak = history.find(h => h.format === "bullet")?.peak || ratings.bullet || 0;

  const rapidHistory = history.find(h => h.format === "rapid")?.dataPoints || [];
  const blitzHistory = history.find(h => h.format === "blitz")?.dataPoints || [];
  const bulletHistory = history.find(h => h.format === "bullet")?.dataPoints || [];

  const chartWidth = 550;
  const chartHeight = 220;
  const chartMarginLeft = 55;
  const chartMarginBottom = 35;
  const chartMarginTop = 15;

  const sampleDataPoints = (dataPoints: { rating: number }[], sampleSize: number = 18) => {
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

  const allRatings = [...sampledRapid.map(p => p.rating), ...sampledBlitz.map(p => p.rating), ...sampledBullet.map(p => p.rating)].filter(r => r > 0);
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

  const yLabelCount = 4;
  const yStep = (paddedMax - paddedMin) / (yLabelCount - 1);
  const yLabels = Array.from({ length: yLabelCount }, (_, i) => Math.round(paddedMax - i * yStep));

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 30 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "Syne", fontSize: 46, fontWeight: 800, color: "white" }}>Your Journey</span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{oneLiner}</span>
      </div>

      <div style={{ display: "flex", position: "relative", width: chartWidth + chartMarginLeft + 10, height: chartHeight + 10 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: chartHeight - chartMarginBottom, position: "absolute", left: 0, top: chartMarginTop }}>
          {yLabels.map((label, i) => (
            <span key={i} style={{ fontFamily: "Syncopate", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "right", width: chartMarginLeft - 8 }}>{label}</span>
          ))}
        </div>

        <svg width={chartWidth + chartMarginLeft + 10} height={chartHeight} style={{ position: "absolute", top: 0, left: 0 }}>
          <line x1={chartMarginLeft} y1={chartMarginTop} x2={chartMarginLeft} y2={chartHeight - chartMarginBottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1={chartMarginLeft} y1={chartHeight - chartMarginBottom} x2={chartWidth + chartMarginLeft} y2={chartHeight - chartMarginBottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {sampledRapid.length >= 2 && <polyline points={createLinePath(sampledRapid)} fill="none" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {sampledBlitz.length >= 2 && <polyline points={createLinePath(sampledBlitz)} fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {sampledBullet.length >= 2 && <polyline points={createLinePath(sampledBullet)} fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>

        <div style={{ display: "flex", justifyContent: "center", position: "absolute", bottom: 0, left: chartMarginLeft, width: chartWidth }}>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Jan</span>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 40 }}>Jul</span>
          <span style={{ fontFamily: "Syne", fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 40 }}>Dec</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 34, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>{rapidPeak}</span>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#7DD3FC", marginTop: 6 }}>Peak Rapid</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 34, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>{blitzPeak}</span>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#FBBF24", marginTop: 6 }}>Peak Blitz</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 34, fontWeight: 700, color: "#F87171", lineHeight: 1 }}>{bulletPeak}</span>
          <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "#F87171", marginTop: 6 }}>Peak Bullet</span>
        </div>
      </div>
    </div>
  );
}

function Card5({ stats }: { stats: WrappedStats }) {
  const history = stats.ratings.history || [];
  const ratings = stats.ratings.current || {};
  const oneLiner = getRatingsOneLiner(stats);

  const rapid = { rating: ratings.rapid || 0, change: history.find(h => h.format === "rapid")?.change || 0 };
  const blitz = { rating: ratings.blitz || 0, change: history.find(h => h.format === "blitz")?.change || 0 };
  const bullet = { rating: ratings.bullet || 0, change: history.find(h => h.format === "bullet")?.change || 0 };

  const formatDelta = (change: number) => change >= 0 ? `+${change}` : null;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 45 }}>
      <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>{oneLiner}</span>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Rapid</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1.1 }}>{rapid.rating}</span>
        {rapid.change >= 0 && (
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#61DE58", marginTop: 5 }}>{formatDelta(rapid.change)}</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Blitz</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1.1 }}>{blitz.rating}</span>
        {blitz.change >= 0 && (
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#61DE58", marginTop: 5 }}>{formatDelta(blitz.change)}</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2 }}>Bullet</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 85, fontWeight: 700, color: "#7DD3FC", lineHeight: 1.1 }}>{bullet.rating}</span>
        {bullet.change >= 0 && (
          <span style={{ fontFamily: "Syncopate", fontSize: 28, fontWeight: 700, color: "#61DE58", marginTop: 5 }}>{formatDelta(bullet.change)}</span>
        )}
      </div>
    </div>
  );
}

function Card6({ stats }: { stats: WrappedStats }) {
  const totalUnique = stats.openings?.totalUnique || 0;

  const getOpeningsOneLiner = (count: number) => {
    if (count >= 500) return "A true opening theorist!";
    if (count >= 200) return "Exploration at its finest!";
    if (count >= 100) return "Diverse repertoire!";
    if (count >= 50) return "Building your opening toolbox!";
    if (count >= 20) return "Finding your style!";
    return "Just getting started!";
  };

  const oneLiner = getOpeningsOneLiner(totalUnique);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 45 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "Syne", fontSize: 44, fontWeight: 800, color: "white" }}>Openings Explored</span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{oneLiner}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 120, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>{formatNumber(totalUnique)}</span>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 2, marginTop: 10 }}>Unique Openings</span>
      </div>
    </div>
  );
}

function Card6b({ stats }: { stats: WrappedStats }) {
  const highestDefeated = stats.opponents?.highestRatedDefeated;
  const bestWin = stats.notableGames?.bestWin;
  const oneLiner = getBigWinOneLiner(stats);
  
  const opponentName = highestDefeated?.username || bestWin?.opponent || "Unknown";
  const opponentRating = highestDefeated?.rating || bestWin?.opponentRating || 0;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 45 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "Syne", fontSize: 44, fontWeight: 800, color: "white" }}>Your Biggest Win</span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{oneLiner}</span>
      </div>

      <div style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: "#61DE58", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 65, fontWeight: 700, color: "white" }}>{opponentName.charAt(0).toUpperCase()}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, color: "white", textAlign: "center", maxWidth: CONTENT_WIDTH }}>{opponentName}</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>({opponentRating})</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.95)" }}>You defeated a</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 52, fontWeight: 700, color: "#61DE58", marginTop: 12 }}>{opponentRating}</span>
        <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.95)", marginTop: 12 }}>rated player!</span>
      </div>
    </div>
  );
}

function Card7({ stats }: { stats: WrappedStats }) {
  const winStreak = stats.streaks?.longestWinStreak || 0;
  const playStreak = stats.activity?.sessions?.total || 30;
  const oneLiner = getStreaksOneLiner(stats);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 70 }}>
      <span style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>{oneLiner}</span>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 125, fontWeight: 700, color: "#61DE58", lineHeight: 1 }}>{winStreak}</span>
        <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 4, marginTop: 12 }}>longest win streak</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 125, fontWeight: 700, color: "#34D399", lineHeight: 1 }}>{playStreak}</span>
        <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: 4, marginTop: 12 }}>longest play streak</span>
      </div>
    </div>
  );
}

function Card8({ stats }: { stats: WrappedStats }) {
  const nemesis = stats.opponents?.nemesis;
  const name = nemesis?.username || "No Nemesis Yet";
  const games = nemesis?.games || 0;
  const oneLiner = getNemesisOneLiner(stats);
  
  const wins = nemesis?.wins || 0;
  const losses = nemesis?.losses || 0;
  const draws = games - wins - losses;
  const total = wins + draws + losses || 1;
  const barWidth = 550;
  const winWidth = Math.max((wins / total) * barWidth, wins > 0 ? 25 : 0);
  const drawWidth = Math.max((draws / total) * barWidth, draws > 0 ? 25 : 0);
  const lossWidth = Math.max((losses / total) * barWidth, losses > 0 ? 25 : 0);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 45 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "Syne", fontSize: 44, fontWeight: 800, color: "#F87171" }}>Your Nemesis</span>
        <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{oneLiner}</span>
      </div>

      <div style={{ width: 155, height: 155, borderRadius: 78, backgroundColor: "#F87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 60, fontWeight: 700, color: "white" }}>{name.charAt(0).toUpperCase()}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 34, fontWeight: 800, color: "white", textAlign: "center", maxWidth: CONTENT_WIDTH }}>{name}</span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "#D4A574", marginTop: 8 }}>{games} games</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginBottom: 12 }}>
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#61DE58" }}>{wins}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#9CA3AF" }}>{draws}</span>
          <span style={{ fontFamily: "Syncopate", fontSize: 32, fontWeight: 700, color: "#F87171" }}>{losses}</span>
        </div>

        <div style={{ display: "flex", width: barWidth, height: 30, borderRadius: 15, overflow: "hidden" }}>
          <div style={{ width: winWidth, height: 30, backgroundColor: "#61DE58" }} />
          <div style={{ width: drawWidth, height: 30, backgroundColor: "#9CA3AF" }} />
          <div style={{ width: lossWidth, height: 30, backgroundColor: "#F87171" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: barWidth, marginTop: 12 }}>
          <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "#61DE58" }}>Won</span>
          <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "#9CA3AF" }}>Draw</span>
          <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "#F87171" }}>Lost</span>
        </div>
      </div>
    </div>
  );
}

function Card9({ stats }: { stats: WrappedStats }) {
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
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 45 }}>
      <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>{oneLiner}</span>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "Syne", fontSize: 34, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>Your Personality</span>
        <span style={{ fontFamily: "Syne", fontSize: 34, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>is like</span>
      </div>

      <div style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: "#FBC4AB", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syncopate", fontSize: 68, fontWeight: 700, color: "#1E293B" }}>{personality.name.charAt(0)}</span>
      </div>

      <span style={{ fontFamily: "Syne", fontSize: 40, fontWeight: 700, color: "#7DD3FC", textAlign: "center" }}>{personality.name}</span>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: CONTENT_WIDTH }}>
        <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.85)", textAlign: "center", fontStyle: "italic" }}>"{personality.quote}"</span>
      </div>
    </div>
  );
}

function Card11({ stats }: { stats: WrappedStats }) {
  const bestWhite = stats.openings?.bestAsWhite;
  const bestBlack = stats.openings?.bestAsBlack;
  const totalUnique = stats.openings?.totalUnique || 0;
  
  const formatOpening = (name: string) => {
    if (!name || name === "Unknown") return "—";
    if (name.length > 22) return name.substring(0, 20) + "...";
    return name;
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Syne", fontSize: 44, fontWeight: 800, color: "white" }}>Your Openings</span>
        <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}><span style={{ fontFamily: "Syncopate" }}>{totalUnique}</span> unique openings explored</span>
      </div>

      {bestWhite && bestWhite.name !== "Unknown" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 18, fontWeight: 700, color: "#1E293B" }}>W</span>
            </div>
            <span style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700, color: "#FBBF24" }}>Best as White</span>
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "white", textAlign: "center" }}>{formatOpening(bestWhite.name)}</span>
          <div style={{ display: "flex", gap: 25 }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "#61DE58" }}>{Math.round(bestWhite.winRate)}% wins</span>
            <span style={{ fontFamily: "Syncopate", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{bestWhite.games} games</span>
          </div>
        </div>
      )}

      {bestBlack && bestBlack.name !== "Unknown" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#1E293B", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syncopate", fontSize: 18, fontWeight: 700, color: "white" }}>B</span>
            </div>
            <span style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700, color: "#7DD3FC" }}>Best as Black</span>
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, color: "white", textAlign: "center" }}>{formatOpening(bestBlack.name)}</span>
          <div style={{ display: "flex", gap: 25 }}>
            <span style={{ fontFamily: "Syncopate", fontSize: 24, fontWeight: 700, color: "#61DE58" }}>{Math.round(bestBlack.winRate)}% wins</span>
            <span style={{ fontFamily: "Syncopate", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{bestBlack.games} games</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Card12({ stats }: { stats: WrappedStats }) {
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
    if (hour >= 5 && hour < 12) return { label: "Morning Player", emoji: "Early bird catches the win!" };
    if (hour >= 12 && hour < 17) return { label: "Afternoon Warrior", emoji: "Peak performance hours!" };
    if (hour >= 17 && hour < 21) return { label: "Evening Grinder", emoji: "After-hours dedication!" };
    return { label: "Night Owl", emoji: "Burning the midnight oil!" };
  };
  
  const timeCategory = getTimeCategory(mostActiveHour);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: PADDING_X, paddingRight: PADDING_X, gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "Syne", fontSize: 44, fontWeight: 800, color: "white" }}>When You Play</span>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#A78BFA", fontStyle: "italic" }}>{timeCategory.label}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>Peak Hour</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 75, fontWeight: 700, color: "#7DD3FC", lineHeight: 1 }}>{formatHour(mostActiveHour)}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>Favorite Day</span>
        <span style={{ fontFamily: "Syncopate", fontSize: 55, fontWeight: 700, color: "#FBBF24", lineHeight: 1 }}>{mostActiveDay.toUpperCase()}</span>
      </div>

      <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontStyle: "italic", textAlign: "center" }}>{timeCategory.emoji}</span>
    </div>
  );
}

export async function generateCardImage(
  stats: WrappedStats,
  backgroundPath: string,
  cardType: string
): Promise<Buffer> {
  const width = 820;
  const height = 1456;

  const syneFontPath = path.join(process.cwd(), "node_modules", "@fontsource", "syne", "files", "syne-latin-700-normal.woff");
  const syneFontPath800 = path.join(process.cwd(), "node_modules", "@fontsource", "syne", "files", "syne-latin-800-normal.woff");
  const syncopateFontPath = path.join(process.cwd(), "node_modules", "@fontsource", "syncopate", "files", "syncopate-latin-700-normal.woff");

  let syneFont700: ArrayBuffer | null = null;
  let syneFont800: ArrayBuffer | null = null;
  let syncopateFont: ArrayBuffer | null = null;

  try {
    const buffer = fs.readFileSync(syneFontPath);
    syneFont700 = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  } catch (e) { console.warn('Failed to load Syne 700 font'); }
  
  try {
    const buffer = fs.readFileSync(syneFontPath800);
    syneFont800 = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  } catch (e) { console.warn('Failed to load Syne 800 font'); }
  
  try {
    const buffer = fs.readFileSync(syncopateFontPath);
    syncopateFont = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  } catch (e) { console.warn('Failed to load Syncopate font'); }

  let CardComponent;
  switch (cardType) {
    case "1": case "games": CardComponent = <Card1 stats={stats} />; break;
    case "2": case "time": CardComponent = <Card2 stats={stats} />; break;
    case "3": case "wizard": CardComponent = <Card3 stats={stats} />; break;
    case "4": case "journey": CardComponent = <Card4 stats={stats} />; break;
    case "5": case "rating": CardComponent = <Card5 stats={stats} />; break;
    case "6": case "totalOpenings": CardComponent = <Card6 stats={stats} />; break;
    case "6b": case "bestwin": case "bestWin": CardComponent = <Card6b stats={stats} />; break;
    case "7": case "streaks": CardComponent = <Card7 stats={stats} />; break;
    case "8": case "nemesis": CardComponent = <Card8 stats={stats} />; break;
    case "9": case "personality": CardComponent = <Card9 stats={stats} />; break;
    case "11": case "openings": CardComponent = <Card11 stats={stats} />; break;
    case "12": case "activity": CardComponent = <Card12 stats={stats} />; break;
    default: CardComponent = <Card1 stats={stats} />;
  }

  const fontOptions = [];
  if (syneFont700) fontOptions.push({ name: "Syne", data: syneFont700, weight: 700 as const, style: "normal" as const });
  if (syneFont800) fontOptions.push({ name: "Syne", data: syneFont800, weight: 800 as const, style: "normal" as const });
  if (syncopateFont) fontOptions.push({ name: "Syncopate", data: syncopateFont, weight: 700 as const, style: "normal" as const });

  const svg = await satori(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {CardComponent}
    </div>,
    { width, height, fonts: fontOptions }
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
    "1": "Background 1.png", "2": "Background 2.png", "3": "Background 3.png",
    "4": "Background 4.png", "5": "Background 5.png", "6": "Background 4.png",
    "6b": "Background 8.png", "bestwin": "Background 8.png", "bestWin": "Background 8.png",
    "7": "Background 7.png", "8": "Background 9.png", "9": "Background 10.png",
    "11": "Background 4.png", "12": "Background 6.png", 
    "totalOpenings": "Background 4.png", "openings": "Background 4.png",
  };
  return path.join(process.cwd(), "public", "base", backgrounds[cardType] || "Background 1.png");
}
