export interface Match {
  id: number;
  utcDate: string;
  status:
    | "FINISHED"
    | "SCHEDULED"
    | "TIMED"
    | "IN_PLAY"
    | "PAUSED"
    | "POSTPONED"
    | "CANCELLED";
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  score: {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    name: string;
    code: string;
  };
}

export interface MatchDisplay {
  id: number;
  opponent: string;
  opponentTla: string;
  homeOrAway: "H" | "A";
  result: "W" | "D" | "L";
  scoreHome: number;
  scoreAway: number;
  date: string;
  competition: string;
}

export interface CarrickEra {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  startDate: string;
}

export interface StreakData {
  streak: number;
  matches: MatchDisplay[];
  nextMatch: {
    opponent: string;
    opponentTla: string;
    date: string;
    homeOrAway: "H" | "A";
  } | null;
  carrickEra: CarrickEra;
  lastUpdated: string;
}
