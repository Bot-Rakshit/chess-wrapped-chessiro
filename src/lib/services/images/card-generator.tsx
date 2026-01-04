import sharp from "sharp";
import type { WrappedStats } from "../../types";
import path from "path";

interface CardOptions {
  stats: WrappedStats;
  backgroundPath: string;
  cardType: string;
}

function getCardTitle(type: string): string {
  const titles: Record<string, string> = {
    stats: "Your 2025 Chess Wrapped",
    wins: "Total Wins",
    format: "Most Played Format",
    rating: "Rating Journey",
    streaks: "Win Streaks",
    bestWin: "Best Victory",
    openings: "Top Openings",
    nemesis: "Your Rival",
    playTime: "When You Play",
    victory: "How You Win",
  };
  return titles[type] || "Chess Wrapped 2025";
}

export async function generateCardImage(
  stats: WrappedStats,
  backgroundPath: string,
  cardType: string
): Promise<Buffer> {
  const width = 1080;
  const height = 1920;

  const title = getCardTitle(cardType);
  const subtitle = `${stats.profile.title || ""} ${stats.username}`.trim();
  const ratingChange = stats.ratings.history[0]?.change || 0;
  const changePrefix = ratingChange >= 0 ? "+" : "";
  const primaryColor = "rgba(255, 255, 255, 0.95)";
  const accentColor = "#FFFFFF";

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:1" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      
      <style>
        .title { font: bold 56px Inter, sans-serif; fill: white; letter-spacing: 3px; }
        .subtitle { font: 36px Inter, sans-serif; fill: rgba(255,255,255,0.85); }
        .stat-label { font: 32px Inter, sans-serif; fill: rgba(255,255,255,0.9); }
        .stat-value { font: bold 42px Inter, sans-serif; fill: white; }
        .footer { font: 28px Inter, sans-serif; fill: rgba(255,255,255,0.7); }
        .stat-row-bg { fill: rgba(0,0,0,0.35); rx: 20; }
      </style>
      
      <image href="${backgroundPath}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
      <rect width="${width}" height="${height}" fill="url(#overlay)" />
      
      <g transform="translate(60, 80)">
        <text x="0" y="0" class="title">${title}</text>
        <text x="0" y="60" class="subtitle">${subtitle}</text>
      </g>
      
      <g transform="translate(60, 350)">
        <rect x="0" y="0" width="960" height="120" class="stat-row-bg" />
        <text x="40" y="75" class="stat-label">Games Played</text>
        <text x="920" y="75" class="stat-value" text-anchor="end">${stats.summary.totalGames.toLocaleString()}</text>
        
        <rect x="0" y="140" width="960" height="120" class="stat-row-bg" />
        <text x="40" y="215" class="stat-label">Wins</text>
        <text x="920" y="215" class="stat-value" text-anchor="end">${stats.summary.totalWins.toLocaleString()}</text>
        
        <rect x="0" y="280" width="960" height="120" class="stat-row-bg" />
        <text x="40" y="355" class="stat-label">Win Rate</text>
        <text x="920" y="355" class="stat-value" text-anchor="end">${stats.summary.overallWinRate.toFixed(1)}%</text>
        
        <rect x="0" y="420" width="960" height="120" class="stat-row-bg" />
        <text x="40" y="495" class="stat-label">Most Played</text>
        <text x="920" y="495" class="stat-value" text-anchor="end">${stats.summary.mostPlayedFormat.toUpperCase()}</text>
        
        <rect x="0" y="560" width="960" height="120" class="stat-row-bg" />
        <text x="40" y="635" class="stat-label">Rating Change</text>
        <text x="920" y="635" class="stat-value" text-anchor="end">${changePrefix}${ratingChange}</text>
      </g>
      
      <g transform="translate(60, 1720)">
        <line x1="0" y1="0" x2="960" y2="0" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
        <text x="0" y="60" class="footer">chessiro.ai</text>
        <text x="960" y="60" class="footer" text-anchor="end">2025</text>
      </g>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);
  
  const image = sharp(svgBuffer)
    .png()
    .toBuffer();

  return image;
}

export function getBackgroundImagePath(index: number): string {
  const backgrounds = [
    "Background 1.png",
    "Background 2.png",
    "Background 3.png",
    "Background 4.png",
    "Background 5.png",
    "Background 6.png",
    "Background 7.png",
    "Background 8.png",
    "Background 9.png",
    "Background 10.png",
  ];
  return path.join(process.cwd(), "public", "base", backgrounds[index % backgrounds.length]);
}
