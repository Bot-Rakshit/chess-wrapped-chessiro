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

    if (!username || username.length < 2) {
      return NextResponse.json(
        { error: "Invalid username", message: "Username must be at least 2 characters" },
        { status: 400 }
      );
    }

    const period = createDefaultPeriod(startYear, endYear);
    const stats = await generateWrapped(username, {
      platform: "chess.com",
      period,
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error generating wrapped:", error);
    if (error instanceof Error && error.message.includes("Not found")) {
      return NextResponse.json(
        { error: "User not found", message: "Player not found on Chess.com" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to generate wrapped stats" },
      { status: 500 }
    );
  }
}
