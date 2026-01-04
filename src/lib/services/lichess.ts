import pLimit from "p-limit";
import type { PlayerProfile, PlayerStats, Game, TimeClass } from "../types";

const BASE_URL = "https://lichess.org/api";
const USER_AGENT = "Chessiro/1.0 (github.com/Bot-Rakshit/chess-wrapped-chessiro)";
const limit = pLimit(5);

interface FetchOptions {
  retries?: number;
  retryDelay?: number;
  token?: string;
}

async function fetchWithRetry<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { retries = 3, retryDelay = 1000, token } = options;

  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { headers });

      if (response.status === 429) {
        const waitTime = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.status === 404) throw new Error(`Not found: ${url}`);
      if (response.status === 401) throw new Error(`Unauthorized: Invalid token`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const text = await response.text();
      if (!text.trim()) {
        return {} as T;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function getPlayerProfile(username: string, token?: string): Promise<PlayerProfile> {
  const data = await fetchWithRetry<{
    id: string;
    username: string;
    title?: string;
    profile?: {
      country?: string;
      location?: string;
      bio?: string;
      firstName?: string;
      lastName?: string;
      links?: string;
    };
    seenAt?: number;
    createdAt?: number;
    online?: boolean;
    streaming?: boolean;
    nbFollowers?: number;
    nbFollowing?: number;
  }>(`${BASE_URL}/user/${username}`, { token });

  return {
    username: data.username,
    title: data.title,
    country: data.profile?.country,
    joined: data.createdAt,
    lastOnline: data.seenAt,
    followers: data.nbFollowers,
  };
}

export async function getPlayerStats(username: string, token?: string): Promise<PlayerStats> {
  const perfTypes = ["bullet", "blitz", "rapid", "daily", "chess960"];
  const stats: any = {};

  for (const perf of perfTypes) {
    try {
      const data = await fetchWithRetry<{
        perfs: Record<string, {
          games: number;
          rating: number;
          rd: number;
          prog: number;
          prov?: boolean;
        }>;
      }>(`${BASE_URL}/user/${username}/perf/${perf}`, { token });

      if (data.perfs && data.perfs[perf]) {
        const p = data.perfs[perf];
        const formatKey = `chess${perf.charAt(0).toUpperCase() + perf.slice(1)}` as keyof PlayerStats;
        stats[formatKey] = {
          last: { rating: p.rating, date: Date.now(), rd: p.rd },
          record: {
            win: 0,
            loss: 0,
            draw: 0,
          },
        };
      }
    } catch {
      // Skip if perf type doesn't exist
    }
  }

  return stats;
}

export async function getPlayerGames(
  username: string,
  since: number,
  until: number,
  token?: string
): Promise<Game[]> {
  const games: Game[] = [];
  const url = `${BASE_URL}/games/user/${username}?since=${since}&until=${until}&moves=true&tags=true&evals=false&clocks=false&literate=true`;

  const text = await fetchWithRetryText(url, { token });
  
  // Parse PGN format - games are separated by double newlines
  const gameBlocks = text.split(/\n\n+/).filter((block) => block.trim());

  for (const block of gameBlocks) {
    try {
      const game = parsePgnGame(block, username);
      if (game) {
        games.push(game);
      }
    } catch (e) {
      // Skip invalid game blocks
    }
  }

  return games;
}

interface PgnGameData {
  id?: string;
  site?: string;
  event?: string;
  date?: string;
  white?: string;
  black?: string;
  result?: string;
  whiteElo?: string;
  blackElo?: string;
  timeControl?: string;
  eco?: string;
  utcDate?: string;
  utctime?: string;
}

function parsePgnGame(pgn: string, currentUsername: string): Game | null {
  const data: PgnGameData = {};
  const lines = pgn.split("\n");
  let movesSection = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const match = trimmed.match(/\[(\w+)\s+"([^"]*)"\]/);
      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2];
        switch (key) {
          case "site": data.site = value; break;
          case "gameid": data.id = value; break;
          case "event": data.event = value; break;
          case "date": data.date = value; break;
          case "white": data.white = value; break;
          case "black": data.black = value; break;
          case "result": data.result = value; break;
          case "whiteelo": data.whiteElo = value; break;
          case "blackelo": data.blackElo = value; break;
          case "timecontrol": data.timeControl = value; break;
          case "eco": data.eco = value; break;
          case "utcdate": data.utcDate = value; break;
          case "utctime": data.utctime = value; break;
        }
      }
    } else if (trimmed && !trimmed.startsWith("%")) {
      movesSection = trimmed;
    }
  }

  if (!data.white || !data.black || !data.result) {
    return null;
  }

  const isWhite = data.white.toLowerCase() === currentUsername.toLowerCase();
  const playerName = isWhite ? data.white : data.black;
  const opponentName = isWhite ? data.black : data.white;
  const playerElo = isWhite ? parseInt(data.whiteElo || "0") : parseInt(data.blackElo || "0");
  const opponentElo = isWhite ? parseInt(data.blackElo || "0") : parseInt(data.whiteElo || "0");

  let result: any;
  if (data.result === "1-0") {
    result = isWhite ? "win" : "lose";
  } else if (data.result === "0-1") {
    result = isWhite ? "lose" : "win";
  } else {
    result = "agreed";
  }

  // Parse time control
  let timeControl = data.timeControl || "unknown";
  let timeClass: TimeClass = "bullet";
  if (timeControl.includes("+")) {
    const [base, inc] = timeControl.split("+");
    const baseTime = parseInt(base) || 0;
    if (baseTime <= 60) timeClass = "bullet";
    else if (baseTime <= 180) timeClass = "blitz";
    else if (baseTime <= 600) timeClass = "rapid";
    else timeClass = "daily";
  } else if (timeControl.includes("/")) {
    timeClass = "daily";
  }

  // Parse date
  let endTime = Date.now();
  if (data.utcDate) {
    const dateParts = data.utcDate.split(".");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      const time = data.utctime || "00:00:00";
      const timeParts = time.split(":");
      const hour = parseInt(timeParts[0]) || 0;
      const min = parseInt(timeParts[1]) || 0;
      const sec = parseInt(timeParts[2]) || 0;
      endTime = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), hour, min, sec) / 1000;
    }
  }

  return {
    id: data.id || data.site?.split("/").pop() || "",
    url: data.site,
    pgn: movesSection,
    timeControl,
    timeClass,
    rated: data.event?.includes("rated") || false,
    endTime,
    eco: data.eco,
    white: {
      username: data.white,
      rating: parseInt(data.whiteElo || "0"),
      result: isWhite ? result : (data.result === "1-0" ? "lose" : data.result === "0-1" ? "win" : "agreed"),
    },
    black: {
      username: data.black,
      rating: parseInt(data.blackElo || "0"),
      result: !isWhite ? result : (data.result === "1-0" ? "lose" : data.result === "0-1" ? "win" : "agreed"),
    },
  };
}

async function fetchWithRetryText(url: string, options: FetchOptions = {}): Promise<string> {
  const { retries = 3, retryDelay = 1000, token } = options;

  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { headers });

      if (response.status === 429) {
        const waitTime = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.status === 404) throw new Error(`Not found: ${url}`);
      if (response.status === 401) throw new Error(`Unauthorized: Invalid token`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      return response.text();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

function parseLichessGame(game: any, currentUsername: string): Game | null {
  const white = game.players?.white;
  const black = game.players?.black;

  if (!white || !black) return null;

  const isWhite = white.user?.name?.toLowerCase() === currentUsername.toLowerCase();
  const player = isWhite ? white : black;
  const opponent = isWhite ? black : white;

  let result: any;
  if (game.status === "mate") {
    result = player.mate ? "checkmated" : "win";
  } else if (game.status === "resign") {
    result = isWhite ? "resigned" : "win";
  } else if (game.status === "draw") {
    result = "agreed";
  } else if (game.status === "outoftime") {
    result = "timeout";
  } else if (game.status === "abandoned") {
    result = "abandoned";
  } else {
    result = isWhite ? "win" : "lose";
  }

  const timeClass = getTimeClass(game.clock?.initial || 0);
  const timeControl = game.clock
    ? `${game.clock.initial}+${game.clock.increment}`
    : game.speed || "unknown";

  return {
    id: game.id,
    url: `https://lichess.org/${game.id}`,
    pgn: game.pgn || "",
    timeControl,
    timeClass,
    rated: game.rated || false,
    endTime: Math.floor(game.createdAt / 1000),
    eco: game.opening?.eco,
    white: {
      username: white.user?.name || "Unknown",
      rating: white.rating || 0,
      result: isWhite ? result : getOpponentResult(result),
    },
    black: {
      username: black.user?.name || "Unknown",
      rating: black.rating || 0,
      result: !isWhite ? result : getOpponentResult(result),
    },
  };
}

function getOpponentResult(result: string): string {
  if (result === "win") return "lose";
  if (result === "lose") return "win";
  return result;
}

function getTimeClass(initialSeconds: number): TimeClass {
  if (initialSeconds <= 60) return "bullet";
  if (initialSeconds <= 300) return "blitz";
  if (initialSeconds <= 600) return "rapid";
  return "daily";
}

export async function getGamesForPeriod(
  username: string,
  startDate: Date,
  endDate: Date,
  token?: string
): Promise<Game[]> {
  const since = Math.floor(startDate.getTime());
  const until = Math.floor(endDate.getTime());

  return getPlayerGames(username, since, until, token);
}

export async function getGamesFor2025(username: string, token?: string): Promise<Game[]> {
  const startDate = new Date("2025-01-01T00:00:00Z");
  const endDate = new Date();
  return getGamesForPeriod(username, startDate, endDate, token);
}

export async function getGamesForCustomPeriod(
  username: string,
  startDate: Date,
  endDate: Date,
  token?: string
): Promise<Game[]> {
  return getGamesForPeriod(username, startDate, endDate, token);
}
