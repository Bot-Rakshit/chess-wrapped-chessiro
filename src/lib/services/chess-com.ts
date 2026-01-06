import pLimit from "p-limit";
import type { PlayerProfile, PlayerStats, Game, WrappedOptions } from "../types";
import { DEFAULT_PERIOD_START, DEFAULT_PERIOD_END } from "../types";

const BASE_URL = "https://api.chess.com/pub";
const USER_AGENT = "Chessiro/1.0 (github.com/Bot-Rakshit/chess-wrapped-chessiro)";
const limit = pLimit(5);

interface FetchOptions {
  retries?: number;
  retryDelay?: number;
}

async function fetchWithRetry<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { retries = 3, retryDelay = 1000 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      });

      if (response.status === 429) {
        const waitTime = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.status === 404) throw new Error(`Not found: ${url}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      return response.json() as Promise<T>;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function getPlayerProfile(username: string): Promise<PlayerProfile> {
  const data = await fetchWithRetry<{
    "@id": string;
    url: string;
    username: string;
    player_id: number;
    title?: string;
    status: string;
    name?: string;
    avatar?: string;
    location?: string;
    country: string;
    joined: number;
    last_online: number;
    followers: number;
    is_streamer?: boolean;
    twitch_url?: string;
    fide?: number;
  }>(`${BASE_URL}/player/${username.toLowerCase()}`);

  return {
    username: data.username,
    title: data.title,
    avatar: data.avatar,
    country: data.country,
    joined: data.joined,
    lastOnline: data.last_online,
    followers: data.followers,
    isStreamer: data.is_streamer,
    twitchUrl: data.twitch_url,
    name: data.name,
  };
}

export async function getPlayerStats(username: string): Promise<PlayerStats> {
  return fetchWithRetry<PlayerStats>(`${BASE_URL}/player/${username.toLowerCase()}/stats`);
}

export async function getPlayerArchives(username: string): Promise<string[]> {
  const data = await fetchWithRetry<{ archives: string[] }>(`${BASE_URL}/player/${username.toLowerCase()}/games/archives`);
  return data.archives;
}

export async function getMonthlyGames(archiveUrl: string): Promise<Game[]> {
  const data = await fetchWithRetry<{ games: Game[] }>(archiveUrl);
  return data.games || [];
}

function chessComToGame(game: any): Game {
  return {
    id: game.uuid,
    url: game.url,
    pgn: game.pgn,
    fen: game.fen,
    timeControl: game.time_control,
    timeClass: game.time_class as any,
    rated: game.rated,
    endTime: game.end_time,
    eco: game.eco,
    white: {
      username: game.white.username,
      rating: game.white.rating,
      result: game.white.result as any,
      uuid: game.white.uuid,
    },
    black: {
      username: game.black.username,
      rating: game.black.rating,
      result: game.black.result as any,
      uuid: game.black.uuid,
    },
    accuracies: game.accuracies,
  };
}

export async function getGamesForPeriod(
  username: string,
  startDate: Date,
  endDate: Date
): Promise<Game[]> {
  const archives = await getPlayerArchives(username);

  const relevantArchives = archives.filter((url) => {
    const match = url.match(/\/(\d{4})\/(\d{2})$/);
    if (!match) return false;
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const archiveDate = new Date(year, month, 1);
    const archiveEndDate = new Date(year, month + 1, 0);
    return archiveEndDate >= startDate && archiveDate <= endDate;
  });

  const gamesArrays = await Promise.all(
    relevantArchives.map((url) => limit(() => getMonthlyGames(url)))
  );

  const allGames = gamesArrays
    .flat()
    .map(chessComToGame)
    .filter((game) => {
      const gameDate = new Date(game.endTime * 1000);
      return gameDate >= startDate && gameDate <= endDate;
    });

  return allGames;
}

export async function getGamesFor2025(username: string): Promise<Game[]> {
  return getGamesForPeriod(username, DEFAULT_PERIOD_START, DEFAULT_PERIOD_END);
}

export async function getGamesForCustomPeriod(
  username: string,
  startDate: Date,
  endDate: Date
): Promise<Game[]> {
  return getGamesForPeriod(username, startDate, endDate);
}
