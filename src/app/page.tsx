import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getStreakData, generateMatchId } from "@/lib/football-api";
import { getVoteCounts } from "@/lib/votes";
import { Footer } from "@/components/footer";

const StreakCounter = dynamic(
  () =>
    import("@/components/streak-counter").then((mod) => ({
      default: mod.StreakCounter,
    })),
  { ssr: false }
);

const VoteSection = dynamic(
  () =>
    import("@/components/vote-section").then((mod) => ({
      default: mod.VoteSection,
    })),
  { ssr: false }
);

const MatchHistory = dynamic(
  () =>
    import("@/components/match-history").then((mod) => ({
      default: mod.MatchHistory,
    })),
  { ssr: false }
);

const Particles = dynamic(
  () =>
    import("@/components/particles").then((mod) => ({
      default: mod.Particles,
    })),
  { ssr: false }
);

function VoteSkeleton() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="h-4 w-32 animate-pulse rounded bg-surface" />
      <div className="mt-4 h-8 w-64 animate-pulse rounded bg-surface" />
      <div className="mt-8 flex w-full max-w-md gap-4">
        <div className="h-16 flex-1 animate-pulse rounded-xl bg-surface" />
        <div className="h-16 flex-1 animate-pulse rounded-xl bg-surface" />
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  let streak = "0";
  let opponent = "their next opponent";

  try {
    const data = await getStreakData();
    streak = String(data.streak);
    opponent = data.nextMatch?.opponent || "their next opponent";
  } catch {
    // Use defaults
  }

  const ogUrl = `/api/og?streak=${streak}&opponent=${encodeURIComponent(opponent)}&vote=yes&pct=50`;

  return {
    title: `${streak} Matches Unbeaten — Glory Glory Man United`,
    description: `Manchester United are ${streak} matches unbeaten. Vote on whether they\u2019ll beat ${opponent}.`,
    openGraph: {
      title: `${streak} Matches Unbeaten — Glory Glory Man United`,
      description: `Vote now: Will United beat ${opponent}?`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${streak} Matches Unbeaten`,
      images: [ogUrl],
    },
  };
}

export default async function Home() {
  let streakData;
  try {
    streakData = await getStreakData();
  } catch {
    return (
      <>
        <Particles />
        <section className="flex min-h-screen flex-col items-center justify-center px-4">
          <h1 className="font-heading text-2xl uppercase text-text-primary">
            Glory Glory Man United
          </h1>
          <p className="mt-4 font-body text-text-secondary">
            Match data temporarily unavailable. Check back soon.
          </p>
        </section>
        <Footer />
      </>
    );
  }

  const matchId = streakData.nextMatch
    ? generateMatchId(
        streakData.nextMatch.opponentTla,
        streakData.nextMatch.date
      )
    : null;

  let initialVotes = { yes: 0, no: 0 };
  if (matchId) {
    try {
      initialVotes = await getVoteCounts(matchId);
    } catch {
      // Votes unavailable — start with zeros
    }
  }

  const tagline =
    streakData.streak > 0
      ? `Only unbeaten side in the Premier League in ${new Date().getFullYear()}`
      : undefined;

  return (
    <>
      <Particles />
      <StreakCounter streak={streakData.streak} tagline={tagline} />

      {streakData.nextMatch && matchId ? (
        <Suspense fallback={<VoteSkeleton />}>
          <VoteSection
            matchId={matchId}
            opponent={streakData.nextMatch.opponent}
            matchDate={streakData.nextMatch.date}
            homeOrAway={streakData.nextMatch.homeOrAway}
            initialVotes={initialVotes}
          />
        </Suspense>
      ) : null}

      {streakData.matches.length > 0 ? (
        <MatchHistory
          matches={streakData.matches}
          lastUpdated={streakData.lastUpdated}
        />
      ) : null}

      <Footer />
    </>
  );
}
