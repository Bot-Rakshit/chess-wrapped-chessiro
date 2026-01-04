import { getPlayerProfile as getChessComProfile, getPlayerStats as getChessComStats, getGamesFor2025 as getChessComGamesFor2025, getGamesForCustomPeriod as getChessComGamesForCustomPeriod } from "./chess-com";
import { getPlayerProfile as getLichessProfile, getPlayerStats as getLichessStats, getGamesFor2025 as getLichessGamesFor2025, getGamesForCustomPeriod as getLichessGamesForCustomPeriod } from "./lichess";
import { analyzeGames } from "./analyzer";
import type { WrappedStats, Platform } from "../types";
import { DEFAULT_PERIOD_START, DEFAULT_PERIOD_END } from "../types";

export interface UnifiedWrappedOptions {
  platform: Platform;
  period?: {
    start: Date;
    end: Date;
  };
  lichessToken?: string;
}

export async function generateWrapped(
  username: string,
  options: UnifiedWrappedOptions
): Promise<WrappedStats> {
  const { platform, period, lichessToken } = options;

  const periodStart = period?.start || DEFAULT_PERIOD_START;
  const periodEnd = period?.end || DEFAULT_PERIOD_END;

  console.log(`Generating wrapped for ${username} on ${platform}...`);

  if (platform === "chess.com") {
    const [profile, stats] = await Promise.all([
      getChessComProfile(username),
      getChessComStats(username),
    ]);

    console.log(`Profile loaded for ${profile.username} on Chess.com`);

    const games = period
      ? await getChessComGamesForCustomPeriod(username, periodStart, periodEnd)
      : await getChessComGamesFor2025(username);

    console.log(`Analyzing ${games.length} games...`);
    return analyzeGames(games, username, profile, "chess.com", periodStart, periodEnd);
  } else {
    const [profile, stats] = await Promise.all([
      getLichessProfile(username, lichessToken),
      getLichessStats(username, lichessToken),
    ]);

    console.log(`Profile loaded for ${profile.username} on Lichess`);

    const games = period
      ? await getLichessGamesForCustomPeriod(username, periodStart, periodEnd, lichessToken)
      : await getLichessGamesFor2025(username, lichessToken);

    console.log(`Analyzing ${games.length} games...`);
    return analyzeGames(games, username, profile, "lichess", periodStart, periodEnd);
  }
}

export function createDefaultPeriod(startYear: number = 2025, endYear?: number): { start: Date; end: Date } {
  const start = new Date(`${startYear}-01-01T00:00:00Z`);
  const end = endYear ? new Date(`${endYear}-12-31T23:59:59Z`) : new Date();
  return { start, end };
}

export function createLastNMonthsPeriod(months: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  return { start, end };
}

export function createLastYearPeriod(): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  return { start, end };
}
