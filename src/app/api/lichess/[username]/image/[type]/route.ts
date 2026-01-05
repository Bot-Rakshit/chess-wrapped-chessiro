import { NextRequest, NextResponse } from "next/server";
import { generateWrapped, createDefaultPeriod } from "@/lib/services/wrapped";
import { generateCardImage, getBackgroundImagePath } from "@/lib/services/images/card-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; type: string }> }
) {
  try {
    const { username, type } = await params;
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const startYear = yearParam ? parseInt(yearParam) : 2025;
    const endYear = searchParams.get("endYear") ? parseInt(searchParams.get("endYear")!) : undefined;
    const backgroundIndex = parseInt(searchParams.get("bg") || "0");
    const token = searchParams.get("token") || request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!username || username.length < 2) {
      return new Response("Invalid username", { status: 400 });
    }

    if (!token) {
      return new Response("Lichess API token is required", { status: 401 });
    }

    const validTypes = [
      "stats", "wins", "format", "rating", "streaks", 
      "bestWin", "openings", "nemesis", "playTime", "victory"
    ];
    
    if (!validTypes.includes(type)) {
      return new Response("Invalid card type", { status: 400 });
    }

    const period = createDefaultPeriod(startYear, endYear);
    const stats = await generateWrapped(username, {
      platform: "lichess",
      period,
      lichessToken: token,
    });

    const backgroundPath = getBackgroundImagePath(backgroundIndex);
    const imageBuffer = await generateCardImage(stats, backgroundPath, type);

    return new Response(imageBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
