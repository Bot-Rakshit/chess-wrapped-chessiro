export type Platform = "chess.com" | "lichess";

export type TimeClass = "daily" | "rapid" | "blitz" | "bullet";

export type GameResult = 
  | "win" | "checkmated" | "agreed" | "repetition" | "timeout"
  | "resigned" | "stalemate" | "lose" | "insufficient" | "50move"
  | "abandoned" | "kingofthehill" | "threecheck" | "timevsinsufficient"
  | "bughousepartnerlose";

export interface PlayerProfile {
  username: string;
  title?: string;
  avatar?: string;
  country?: string;
  joined?: number;
  lastOnline?: number;
  followers?: number;
  isStreamer?: boolean;
  twitchUrl?: string;
  name?: string;
}

export interface GamePlayer {
  username: string;
  rating: number;
  result: GameResult;
  uuid?: string;
}

export interface Game {
  id: string;
  url?: string;
  pgn: string;
  fen?: string;
  timeControl: string;
  timeClass: TimeClass;
  rated: boolean;
  endTime: number;
  eco?: string;
  white: GamePlayer;
  black: GamePlayer;
  accuracies?: { white: number; black: number };
}

export interface FormatStats {
  last: { rating: number; date: number; rd: number };
  best?: { rating: number; date: number; game: string };
  record: { win: number; loss: number; draw: number };
}

export interface PlayerStats {
  chessDaily?: FormatStats;
  chess960Daily?: FormatStats;
  chessRapid?: FormatStats;
  chessBlitz?: FormatStats;
  chessBullet?: FormatStats;
}

export interface RatingDataPoint {
  date: string;
  rating: number;
  timestamp: number;
}

export interface RatingHistory {
  format: string;
  startRating: number;
  endRating: number;
  change: number;
  peak: number;
  peakDate: string;
  lowest: number;
  lowestDate: string;
  dataPoints: RatingDataPoint[];
}

export interface OpeningStats {
  eco: string;
  name: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface OpponentStats {
  username: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  avatar?: string;
  rating?: number;
}

export interface TimeControlStats {
  timeControl: string;
  timeClass: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface GameResultStats {
  checkmates: number;
  resignations: number;
  timeouts: number;
  stalemates: number;
  draws: number;
  otherWins: number;
}

export interface WrappedStats {
  platform: Platform;
  username: string;
  profile: {
    avatar?: string;
    title?: string;
    country?: string;
    joined?: number;
    name?: string;
  };
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalGames: number;
    totalWins: number;
    totalLosses: number;
    totalDraws: number;
    overallWinRate: number;
    mostPlayedFormat: string;
    mostPlayedTimeControl: string;
    formatTag: string;
  };
  ratings: {
    current: Record<string, number>;
    history: RatingHistory[];
  };
  results: GameResultStats;
  checkmates: {
    given: number;
    received: number;
  };
  openings: {
    totalUnique: number;
    asWhite: OpeningStats[];
    asBlack: OpeningStats[];
    bestAsWhite: OpeningStats | null;
    bestAsBlack: OpeningStats | null;
  };
  opponents: {
    mostPlayed: OpponentStats[];
    topOpponent: OpponentStats | null;
    highestRatedDefeated: { username: string; rating: number; game: string } | null;
    nemesis: OpponentStats | null;
  };
  timeControls: TimeControlStats[];
  playTime: {
    hourOfDay: Record<number, number>;
    dayOfWeek: Record<number, number>;
    mostActiveHour: number;
    mostActiveDay: string;
  };
  streaks: {
    longestWinStreak: number;
    longestLoseStreak: number;
    currentStreak: { type: "win" | "loss" | "draw"; count: number };
  };
  activity: {
    totalMoves: number;
    totalTimePlayedSeconds: number;
    totalTimePlayedFormatted: string;
    averageGameLengthMoves: number;
    sessions: { total: number };
    longestPlayStreak: number;
  };
  notableGames: {
    bestWin: { opponent: string; opponentRating: number; moves: number } | null;
    quickestWin: { opponent: string; moves: number } | null;
  };
  insights: {
    timeTag: string;
    playStyle: string;
  };
}

export interface WrappedOptions {
  period?: {
    start: Date;
    end: Date;
  };
  lichessToken?: string;
}

export const DEFAULT_PERIOD_START = new Date("2025-01-01T00:00:00Z");
export const DEFAULT_PERIOD_END = new Date();
