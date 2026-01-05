import type {
  Game,
  GameResult,
  PlayerProfile,
  WrappedStats,
  RatingHistory,
  RatingDataPoint,
  OpeningStats,
  OpponentStats,
  TimeControlStats,
  GameResultStats,
  TimeClass,
} from "../types";

const WIN_RESULTS: GameResult[] = ["win"];
const LOSS_RESULTS: GameResult[] = [
  "checkmated",
  "timeout",
  "resigned",
  "lose",
  "abandoned",
  "kingofthehill",
  "threecheck",
  "bughousepartnerlose",
];
const DRAW_RESULTS: GameResult[] = [
  "agreed",
  "repetition",
  "stalemate",
  "insufficient",
  "50move",
  "timevsinsufficient",
];
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function isWin(result: GameResult): boolean {
  return WIN_RESULTS.includes(result);
}
function isLoss(result: GameResult): boolean {
  return LOSS_RESULTS.includes(result);
}
function isDraw(result: GameResult): boolean {
  return DRAW_RESULTS.includes(result);
}

function extractOpeningName(ecoUrl: string | undefined): string {
  if (!ecoUrl) return "Unknown";
  const match = ecoUrl.match(/\/openings\/(.+)$/);
  return match
    ? match[1].replace(/-/g, " ").replace(/\.\.\./g, "")
    : "Unknown";
}

function extractEcoCode(pgn: string): string {
  const match = pgn.match(/\[ECO "([A-E]\d{2})"\]/);
  return match ? match[1] : "Unknown";
}

function countMoves(pgn: string): number {
  const moveSection = pgn
    .replace(/\[.*?\]/g, "")
    .replace(/\{.*?\}/g, "")
    .trim();
  const moveNumbers = moveSection.match(/\d+\./g);
  return moveNumbers ? moveNumbers.length : 0;
}

function parseTimeControl(
  timeControl: string
): { baseTime: number; increment: number } {
  if (timeControl.includes("/")) {
    const parts = timeControl.split("/");
    return { baseTime: parseInt(parts[1]) || 0, increment: 0 };
  }
  if (timeControl.includes("+")) {
    const parts = timeControl.split("+");
    return { baseTime: parseInt(parts[0]) || 0, increment: parseInt(parts[1]) || 0 };
  }
  return { baseTime: parseInt(timeControl) || 0, increment: 0 };
}

function estimateGameDuration(game: Game, moves: number): number {
  const { baseTime, increment } = parseTimeControl(game.timeControl);
  if (game.timeClass === "daily") return 0;
  const avgMoveTime = baseTime / 40 + increment;
  return Math.min(moves * avgMoveTime * 0.7, baseTime * 2);
}

function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getFormatTag(format: string, winRate: number): string {
  const tags: Record<string, string[]> = {
    bullet: ["Speed Demon", "Bullet Master", "Lightning Fast"],
    blitz: ["Blitz King", "Quick Thinker", "Blitz Warrior"],
    rapid: ["Rapid Strategist", "Calculated Player", "Rapid Champion"],
    daily: ["Correspondence Master", "Patient Thinker", "Daily Grinder"],
  };
  const formatTags = tags[format] || ["Chess Enthusiast"];
  if (winRate >= 60) return formatTags[0];
  if (winRate >= 50) return formatTags[1];
  return formatTags[2] || formatTags[0];
}

function getTimeTag(hour: number): string {
  if (hour >= 5 && hour < 9) return "Early Bird";
  if (hour >= 9 && hour < 12) return "Morning Player";
  if (hour >= 12 && hour < 17) return "Afternoon Warrior";
  if (hour >= 17 && hour < 21) return "Evening Competitor";
  if (hour >= 21 || hour < 5) return "Night Owl";
  return "All-Day Player";
}

export function analyzeGames(
  games: Game[],
  username: string,
  profile: PlayerProfile,
  platform: "chess.com" | "lichess",
  periodStart: Date,
  periodEnd: Date
): WrappedStats {
  const lowerUsername = username.toLowerCase();
  let totalWins = 0,
    totalLosses = 0,
    totalDraws = 0;

  const gameResults: GameResultStats = {
    checkmates: 0,
    resignations: 0,
    timeouts: 0,
    stalemates: 0,
    draws: 0,
    otherWins: 0,
  };
  let checkmatesGiven = 0,
    checkmatesReceived = 0;

  const openingsWhite = new Map<string, OpeningStats>();
  const openingsBlack = new Map<string, OpeningStats>();
  const allOpenings = new Set<string>();
  const opponents = new Map<string, OpponentStats>();
  const timeControls = new Map<string, TimeControlStats>();
  const playTimeHours: Record<number, number> = {};
  const playTimeDays: Record<number, number> = {};
  for (let i = 0; i < 24; i++) playTimeHours[i] = 0;
  for (let i = 0; i < 7; i++) playTimeDays[i] = 0;

  const ratingsByFormat = new Map<
    string,
    { ratings: RatingDataPoint[]; format: TimeClass }
  >();
  let highestRatedDefeated: {
    username: string;
    rating: number;
    game: string;
  } | null = null;
  let bestWinGame: {
    opponent: string;
    opponentRating: number;
    moves: number;
  } | null = null;
  let quickestWin: { opponent: string; moves: number } | null = null;
  let currentStreak: { type: "win" | "loss" | "draw"; count: number } = {
    type: "win",
    count: 0,
  };
  let longestWinStreak = 0,
    longestLoseStreak = 0,
    tempWinStreak = 0,
    tempLoseStreak = 0;
  let totalMoves = 0,
    totalTimePlayedSeconds = 0;

  const sortedGames = [...games].sort((a, b) => a.endTime - b.endTime);

  for (const game of sortedGames) {
    const isWhite = game.white.username.toLowerCase() === lowerUsername;
    const playerData = isWhite ? game.white : game.black;
    const opponentData = isWhite ? game.black : game.white;
    const result = playerData.result;
    const gameDate = new Date(game.endTime * 1000);
    const dateStr = gameDate.toISOString().split("T")[0];

    const format = game.timeClass;
    if (!ratingsByFormat.has(format))
      ratingsByFormat.set(format, { ratings: [], format });
    ratingsByFormat
      .get(format)!
      .ratings.push({
        date: dateStr,
        rating: playerData.rating,
        timestamp: game.endTime,
      });

    const moves = countMoves(game.pgn);
    const openingName = extractOpeningName(game.eco);

    if (isWin(result)) {
      totalWins++;
      tempWinStreak++;
      tempLoseStreak = 0;
      if (tempWinStreak > longestWinStreak) longestWinStreak = tempWinStreak;
      currentStreak = { type: "win", count: tempWinStreak };

      if (
        !bestWinGame ||
        opponentData.rating > bestWinGame.opponentRating
      ) {
        bestWinGame = {
          opponent: opponentData.username,
          opponentRating: opponentData.rating,
          moves,
        };
      }
      if (moves > 0 && moves < 20 && (!quickestWin || moves < quickestWin.moves)) {
        quickestWin = { opponent: opponentData.username, moves };
      }
      if (
        !highestRatedDefeated ||
        opponentData.rating > highestRatedDefeated.rating
      ) {
        highestRatedDefeated = {
          username: opponentData.username,
          rating: opponentData.rating,
          game: game.url || `https://lichess.org/${game.id}`,
        };
      }

      if (opponentData.result === "checkmated") {
        checkmatesGiven++;
        gameResults.checkmates++;
      } else if (opponentData.result === "resigned") gameResults.resignations++;
      else if (opponentData.result === "timeout") gameResults.timeouts++;
      else gameResults.otherWins++;
    } else if (isLoss(result)) {
      totalLosses++;
      tempLoseStreak++;
      tempWinStreak = 0;
      if (tempLoseStreak > longestLoseStreak) longestLoseStreak = tempLoseStreak;
      currentStreak = { type: "loss", count: tempLoseStreak };
      if (result === "checkmated") checkmatesReceived++;
    } else if (isDraw(result)) {
      totalDraws++;
      tempWinStreak = 0;
      tempLoseStreak = 0;
      currentStreak = { type: "draw", count: 1 };
      gameResults.draws++;
      if (result === "stalemate") gameResults.stalemates++;
    }

    const ecoCode = extractEcoCode(game.pgn);
    const openingKey = `${ecoCode}:${openingName}`;
    allOpenings.add(openingKey);
    const openingsMap = isWhite ? openingsWhite : openingsBlack;
    if (!openingsMap.has(openingKey)) {
      openingsMap.set(openingKey, {
        eco: ecoCode,
        name: openingName,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
      });
    }
    const openingStats = openingsMap.get(openingKey)!;
    openingStats.games++;
    if (isWin(result)) openingStats.wins++;
    else if (isLoss(result)) openingStats.losses++;
    else openingStats.draws++;

    const opponentKey = opponentData.username.toLowerCase();
    if (!opponents.has(opponentKey)) {
      opponents.set(opponentKey, {
        username: opponentData.username,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        rating: opponentData.rating,
      });
    }
    const oppStats = opponents.get(opponentKey)!;
    oppStats.games++;
    oppStats.rating = opponentData.rating;
    if (isWin(result)) oppStats.wins++;
    else if (isLoss(result)) oppStats.losses++;
    else oppStats.draws++;

    const tcKey = `${game.timeControl}:${game.timeClass}`;
    if (!timeControls.has(tcKey)) {
      timeControls.set(tcKey, {
        timeControl: game.timeControl,
        timeClass: game.timeClass,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
      });
    }
    const tcStats = timeControls.get(tcKey)!;
    tcStats.games++;
    if (isWin(result)) tcStats.wins++;
    else if (isLoss(result)) tcStats.losses++;
    else tcStats.draws++;

    playTimeHours[gameDate.getUTCHours()]++;
    playTimeDays[gameDate.getUTCDay()]++;
    totalMoves += moves;
    totalTimePlayedSeconds += estimateGameDuration(game, moves);
  }

  for (const opening of openingsWhite.values())
    opening.winRate =
      opening.games > 0 ? (opening.wins / opening.games) * 100 : 0;
  for (const opening of openingsBlack.values())
    opening.winRate =
      opening.games > 0 ? (opening.wins / opening.games) * 100 : 0;
  for (const opp of opponents.values())
    opp.winRate = opp.games > 0 ? (opp.wins / opp.games) * 100 : 0;
  for (const tc of timeControls.values())
    tc.winRate = tc.games > 0 ? (tc.wins / tc.games) * 100 : 0;

  const sortedOpeningsWhite = [...openingsWhite.values()]
    .filter((o) => o.games >= 3)
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);
  const sortedOpeningsBlack = [...openingsBlack.values()]
    .filter((o) => o.games >= 3)
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);
  const bestOpeningWhite = [...openingsWhite.values()]
    .filter((o) => o.games >= 5)
    .sort((a, b) => b.winRate - a.winRate)[0] || null;
  const bestOpeningBlack = [...openingsBlack.values()]
    .filter((o) => o.games >= 5)
    .sort((a, b) => b.winRate - a.winRate)[0] || null;
  const sortedOpponents = [...opponents.values()]
    .sort((a, b) => b.games - a.games)
    .slice(0, 10);
  const nemesis =
    [...opponents.values()]
      .filter((o) => o.games >= 3 && o.losses > o.wins)
      .sort((a, b) => b.losses - b.wins - (a.losses - a.wins))[0] || null;
  const sortedTimeControls = [...timeControls.values()].sort(
    (a, b) => b.games - a.games
  );

  let mostActiveHour = 0,
    maxHourGames = 0;
  for (const [hour, count] of Object.entries(playTimeHours)) {
    if (count > maxHourGames) {
      maxHourGames = count;
      mostActiveHour = parseInt(hour);
    }
  }
  let mostActiveDay = 0,
    maxDayGames = 0;
  for (const [day, count] of Object.entries(playTimeDays)) {
    if (count > maxDayGames) {
      maxDayGames = count;
      mostActiveDay = parseInt(day);
    }
  }

  const ratingHistories: RatingHistory[] = [];
  const currentRatings: Record<string, number> = {};

  for (const [format, data] of ratingsByFormat) {
    const ratings = data.ratings.sort((a, b) => a.timestamp - b.timestamp);
    if (ratings.length === 0) continue;
    const ratingsByDate = new Map(ratings.map((r) => [r.date, r]));
    const dedupedRatings = [...ratingsByDate.values()].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const startRating = dedupedRatings[0].rating;
    const endRating = dedupedRatings[dedupedRatings.length - 1].rating;
    let peak = startRating,
      peakDate = dedupedRatings[0].date,
      lowest = startRating,
      lowestDate = dedupedRatings[0].date;
    for (const r of dedupedRatings) {
      if (r.rating > peak) {
        peak = r.rating;
        peakDate = r.date;
      }
      if (r.rating < lowest) {
        lowest = r.rating;
        lowestDate = r.date;
      }
    }
    currentRatings[format] = endRating;
    ratingHistories.push({
      format,
      startRating,
      endRating,
      change: endRating - startRating,
      peak,
      peakDate,
      lowest,
      lowestDate,
      dataPoints: dedupedRatings,
    });
  }

  const formatCounts: Record<string, number> = {};
  for (const game of games) {
    formatCounts[game.timeClass] = (formatCounts[game.timeClass] || 0) + 1;
  }
  const mostPlayedFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "none";
  const mostPlayedTimeControl = sortedTimeControls[0]?.timeControl || "none";
  const totalGames = totalWins + totalLosses + totalDraws;
  const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

  return {
    platform,
    username,
    profile: {
      avatar: profile.avatar,
      title: profile.title,
      country: profile.country,
      joined: profile.joined,
      name: profile.username,
    },
    period: {
      start: periodStart.toISOString().split("T")[0],
      end: periodEnd.toISOString().split("T")[0],
    },
    summary: {
      totalGames,
      totalWins,
      totalLosses,
      totalDraws,
      overallWinRate: winRate,
      mostPlayedFormat,
      mostPlayedTimeControl,
      formatTag: getFormatTag(mostPlayedFormat, winRate),
    },
    ratings: { current: currentRatings, history: ratingHistories },
    results: gameResults,
    checkmates: { given: checkmatesGiven, received: checkmatesReceived },
    openings: {
      totalUnique: allOpenings.size,
      asWhite: sortedOpeningsWhite,
      asBlack: sortedOpeningsBlack,
      bestAsWhite: bestOpeningWhite,
      bestAsBlack: bestOpeningBlack,
    },
    opponents: {
      mostPlayed: sortedOpponents,
      topOpponent: sortedOpponents[0] || null,
      highestRatedDefeated,
      nemesis,
    },
    timeControls: sortedTimeControls,
    playTime: {
      hourOfDay: playTimeHours,
      dayOfWeek: playTimeDays,
      mostActiveHour,
      mostActiveDay: DAYS_OF_WEEK[mostActiveDay],
    },
    streaks: {
      longestWinStreak,
      longestLoseStreak,
      currentStreak,
    },
    activity: {
      totalMoves,
      totalTimePlayedSeconds,
      totalTimePlayedFormatted: formatDuration(totalTimePlayedSeconds),
      averageGameLengthMoves: totalGames > 0 ? Math.round(totalMoves / totalGames) : 0,
      sessions: { total: 0 },
    },
    notableGames: { bestWin: bestWinGame, quickestWin },
    insights: { timeTag: getTimeTag(mostActiveHour), playStyle: "grinder" },
  };
}
