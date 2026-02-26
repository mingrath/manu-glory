import { createClient } from "./supabase/server";

export interface VoteCounts {
  yes: number;
  no: number;
}

export async function getVoteCounts(matchId: string): Promise<VoteCounts> {
  const supabase = createClient();

  const [yesResult, noResult] = await Promise.all([
    supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("match_id", matchId)
      .eq("vote", "yes"),
    supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("match_id", matchId)
      .eq("vote", "no"),
  ]);

  return {
    yes: yesResult.count ?? 0,
    no: noResult.count ?? 0,
  };
}

export async function castVote(
  matchId: string,
  vote: "yes" | "no"
): Promise<VoteCounts> {
  const supabase = createClient();

  const { error } = await supabase.from("votes").insert({
    match_id: matchId,
    vote,
  });

  if (error) {
    throw new Error(`Vote failed: ${error.message}`);
  }

  return getVoteCounts(matchId);
}
