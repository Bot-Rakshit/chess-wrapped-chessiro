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
    const token = searchParams.get("token") || request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!username || username.length < 2) {
      return NextResponse.json(
        { error: "Invalid username", message: "Username must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Lichess API token is required. Provide via ?token= query param or Authorization header." },
        { status: 401 }
      );
    }

    const period = createDefaultPeriod(startYear, endYear);
    const stats = await generateWrapped(username, {
      platform: "lichess",
      period,
      lichessToken: token,
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error generating wrapped:", error);
    if (error instanceof Error) {
      if (error.message.includes("Not found")) {
        return NextResponse.json(
          { error: "User not found", message: "Player not found on Lichess" },
          { status: 404 }
        );
      }
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Invalid Lichess API token" },
          { status: 401 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to generate wrapped stats" },
      { status: 500 }
    );
  }
}
