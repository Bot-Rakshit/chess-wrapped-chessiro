import { NextRequest, NextResponse } from "next/server";
import { generateWrapped, createDefaultPeriod } from "@/lib/services/wrapped";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const startYear = yearParam ? parseInt(yearParam) : 2025;
    const endYear = searchParams.get("endYear") ? parseInt(searchParams.get("endYear")!) : undefined;
    const oauth = searchParams.get("oauth");

    if (!username || username.length < 2) {
      return NextResponse.json(
        { error: "Invalid username", message: "Username must be at least 2 characters" },
        { status: 400 }
      );
    }

    const period = createDefaultPeriod(startYear, endYear);
    
    // Detect platform based on oauth presence
    // If oauth param exists = Lichess, if absent = Chess.com
    const platform = oauth ? "lichess" : "chess.com";
    
    const stats = await generateWrapped(username, {
      platform,
      period,
      lichessToken: oauth || undefined,
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error generating wrapped:", error);
    const searchParams = request.nextUrl.searchParams;
    const oauth = searchParams.get("oauth");
    const platform = oauth ? "Lichess" : "Chess.com";
    
    if (error instanceof Error && error.message.includes("Not found")) {
      return NextResponse.json(
        { error: "User not found", message: `Player not found on ${platform}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to generate wrapped stats" },
      { status: 500 }
    );
  }
}
