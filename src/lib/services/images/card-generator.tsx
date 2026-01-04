import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "fs/promises";
import type { WrappedStats } from "../../types";
import path from "path";

interface CardOptions {
  stats: WrappedStats;
  backgroundPath: string;
  cardType: string;
}

async function loadFont(): Promise<ArrayBuffer> {
  const response = await fetch("https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf");
  return response.arrayBuffer();
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
  const backgroundBuffer = await readFile(backgroundPath);
  const backgroundBase64 = `data:image/png;base64,${backgroundBuffer.toString("base64")}`;
  
  const width = 1080;
  const height = 1920;
  const fontData = await loadFont();

  const title = getCardTitle(cardType);
  const subtitle = `${stats.profile.title || ""} ${stats.username}`.trim();
  const ratingChange = stats.ratings.history[0]?.change || 0;
  const changePrefix = ratingChange >= 0 ? "+" : "";

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundImage: `url(${backgroundBase64})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "60px 50px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              letterSpacing: "2px",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: "32px",
              color: "rgba(255,255,255,0.8)",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Games Played</span>
            <span style={{ fontSize: "36px", color: "#FFFFFF", fontWeight: 700 }}>{stats.summary.totalGames.toLocaleString()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Wins</span>
            <span style={{ fontSize: "36px", color: "#FFFFFF", fontWeight: 700 }}>{stats.summary.totalWins.toLocaleString()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Win Rate</span>
            <span style={{ fontSize: "36px", color: "#FFFFFF", fontWeight: 700 }}>{stats.summary.overallWinRate.toFixed(1)}%</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Most Played</span>
            <span style={{ fontSize: "36px", color: "#FFFFFF", fontWeight: 700 }}>{stats.summary.mostPlayedFormat.toUpperCase()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Rating Change</span>
            <span style={{ fontSize: "36px", color: "#FFFFFF", fontWeight: 700 }}>{changePrefix}{ratingChange}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "40px",
            borderTop: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span style={{ fontSize: "24px", color: "rgba(255,255,255,0.7)" }}>chessiro.ai</span>
          <span style={{ fontSize: "24px", color: "rgba(255,255,255,0.7)" }}>2025</span>
        </div>
      </div>
    </div>
  );

  const svg = await satori(element, {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        style: "normal",
        weight: 700,
      },
      {
        name: "Inter",
        data: fontData,
        style: "normal",
        weight: 500,
      },
    ],
  });

  const resvg = new Resvg(svg);
  return resvg.render().asPng();
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
