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

    if (!username || username.length < 2) {
      return new Response("Invalid username", { status: 400 });
    }

    const validTypes = [
      "1", "2", "3", "4", "5", "6", "6b", "7", "8", "9", "10", "11", "12",
      "games", "time", "stats", "wins", "format", "rating", "streaks", 
      "bestWin", "openings", "nemesis", "playTime", "victory", "activity",
      "totalOpenings", "openingsDetail"
    ];
    
    if (!validTypes.includes(type)) {
      return new Response("Invalid card type", { status: 400 });
    }

    const period = createDefaultPeriod(startYear, endYear);
    const stats = await generateWrapped(username, {
      platform: "chess.com",
      period,
    });

    // Card type to background mapping (reusing existing backgrounds 1-10)
    // Card 1 (games) -> BG 1, Card 2 (time) -> BG 2, Card 3 (wizard) -> BG 3
    // Card 4 (journey) -> BG 4, Card 5 (rating) -> BG 5
    // Card 6 (totalOpenings) -> BG 4, Card 6b (bestwin) -> BG 8
    // Card 7 (streaks) -> BG 7, Card 8 (nemesis) -> BG 9, Card 9 (personality) -> BG 10
    // Card 10 (summary) -> BG 6, Card 11 (openingsDetail) -> BG 4, Card 12 (activity) -> BG 6
    const cardToBackground: Record<string, number> = {
      "1": 0, "games": 0,
      "2": 1, "time": 1,
      "3": 2, "wizard": 2,
      "4": 3, "journey": 3,
      "5": 4, "rating": 4,
      "6": 3, "totalOpenings": 3,  // BG 4 (index 3) - amber/gold theme
      "6b": 7, "bestwin": 7,        // BG 8 (index 7)
      "7": 6, "streaks": 6,         // BG 7 (index 6)
      "8": 8, "nemesis": 8,         // BG 9 (index 8)
      "9": 9, "personality": 9,     // BG 10 (index 9)
      "10": 5, "summary": 5,        // BG 6 (index 5)
      "11": 3, "openingsDetail": 3, // BG 4 (index 3) - reuse journey bg
      "12": 5, "activity": 5,       // BG 6 (index 5)
    };
    
    const bgIndex = cardToBackground[type] ?? backgroundIndex;
    const backgroundPath = getBackgroundImagePath(type);
    const imageBuffer = await generateCardImage(stats, backgroundPath, type);

    return new Response(imageBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    return new Response(`Failed to generate image: ${errorMessage}\n${errorStack}`, { status: 500 });
  }
}
