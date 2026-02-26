import { NextRequest, NextResponse } from "next/server";
import { castVote } from "@/lib/votes";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { matchId, vote } = await request.json();

    if (!matchId || !["yes", "no"].includes(vote)) {
      return NextResponse.json(
        { error: "Invalid matchId or vote" },
        { status: 400 }
      );
    }

    const counts = await castVote(matchId, vote);
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json(
      { error: "Failed to register vote" },
      { status: 500 }
    );
  }
}
