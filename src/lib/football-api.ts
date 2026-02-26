import { Match, MatchDisplay, StreakData } from "./types";

const MUFC_ID = 66;
const API_BASE = "https://api.football-data.org/v4";

async function fetchFromAPI(endpoint: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Football API error: ${res.status}`);
  }

  return res.json();
}

function getResult(match: Match): "W" | "D" | "L" {
  const isHome = match.homeTeam.id === MUFC_ID;
  if (match.score.winner === "DRAW") return "D";
  if (match.score.winner === "HOME_TEAM") return isHome ? "W" : "L";
  return isHome ? "L" : "W";
}

function toMatchDisplay(match: Match): MatchDisplay {
  const isHome = match.homeTeam.id === MUFC_ID;
  return {
    id: match.id,
    opponent: isHome ? match.awayTeam.shortName : match.homeTeam.shortName,
    opponentTla: isHome ? match.awayTeam.tla : match.homeTeam.tla,
    homeOrAway: isHome ? "H" : "A",
    result: getResult(match),
    scoreHome: match.score.fullTime.home ?? 0,
    scoreAway: match.score.fullTime.away ?? 0,
    date: match.utcDate,
    competition: match.competition.name,
  };
}

function calculateStreak(matches: MatchDisplay[]): MatchDisplay[] {
  const sorted = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const streakMatches: MatchDisplay[] = [];
  for (const match of sorted) {
    if (match.result === "L") break;
    streakMatches.push(match);
  }

  return streakMatches;
}

export async function getStreakData(): Promise<StreakData> {
  const data = (await fetchFromAPI(
    `/teams/${MUFC_ID}/matches?limit=30`
  )) as { matches: Match[] };

  const finished = data.matches
    .filter((m) => m.status === "FINISHED")
    .map(toMatchDisplay);

  const scheduled = data.matches
    .filter((m) => m.status === "SCHEDULED" || m.status === "TIMED")
    .sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    );

  const streakMatches = calculateStreak(finished);

  const nextRaw = scheduled[0] ?? null;
  const nextMatch = nextRaw
    ? {
        opponent:
          nextRaw.homeTeam.id === MUFC_ID
            ? nextRaw.awayTeam.shortName
            : nextRaw.homeTeam.shortName,
        opponentTla:
          nextRaw.homeTeam.id === MUFC_ID
            ? nextRaw.awayTeam.tla
            : nextRaw.homeTeam.tla,
        date: nextRaw.utcDate,
        homeOrAway: (nextRaw.homeTeam.id === MUFC_ID ? "H" : "A") as
          | "H"
          | "A",
      }
    : null;

  return {
    streak: streakMatches.length,
    matches: streakMatches,
    nextMatch,
    lastUpdated: new Date().toISOString(),
  };
}

export function generateMatchId(opponent: string, date: string): string {
  const d = new Date(date);
  const dateStr = d.toISOString().split("T")[0];
  return `MUN-${opponent}-${dateStr}`;
}
