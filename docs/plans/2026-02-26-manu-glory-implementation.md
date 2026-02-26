# Man Utd Voting Microsite — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a viral single-page microsite where fans vote on Man Utd match outcomes, featuring an animated unbeaten streak counter with a cinematic "broadcast night" aesthetic.

**Architecture:** Next.js 15 App Router with ISR (1hr revalidation). Server components fetch football data + vote counts in parallel. Vote section is a lazy-loaded client component. Edge API route handles vote submissions to Supabase.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Motion (Framer Motion), Supabase, football-data.org API, @vercel/og, Vercel deployment.

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: project root via `create-next-app`
- Modify: `package.json` (verify deps)
- Modify: `tailwind.config.ts` (will be created by scaffolding)

**Step 1: Create Next.js 15 project**

```bash
cd /Users/ohmmingrath/Projects/manu-glory
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted for Turbopack, say yes.

**Step 2: Install additional dependencies**

```bash
cd /Users/ohmmingrath/Projects/manu-glory
npm install motion @supabase/supabase-js @supabase/ssr
```

**Step 3: Install Google Fonts (already available via `next/font`)**

No install needed — Next.js has built-in Google Font support via `next/font/google`.

**Step 4: Create environment file**

Create `.env.local`:

```env
FOOTBALL_DATA_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Create `.env.example` (same without values, for git):

```env
FOOTBALL_DATA_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with deps"
```

---

## Task 2: Theme, Fonts & CSS Variables

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Set up font configuration**

Create `src/app/fonts.ts`:

```typescript
import { Anton, Oswald, DM_Sans, JetBrains_Mono } from "next/font/google";

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

export const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});
```

**Step 2: Update layout.tsx with fonts, meta, color-scheme**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { anton, oswald, dmSans, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glory Glory Man United — Unbeaten Streak Tracker",
  description:
    "Vote on whether Manchester United will win their next match. Track the unbeaten streak. Glory Glory.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body className="font-body bg-bg text-text-primary antialiased">
        <a
          href="#vote"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-red focus:px-4 focus:py-2 focus:text-text-primary"
        >
          Skip to vote
        </a>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**Step 3: Replace globals.css with theme**

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0A0A0F;
  --color-surface: #141420;
  --color-red: #E31B23;
  --color-red-glow: #FF2D37;
  --color-gold: #D4A843;
  --color-text-primary: #F0EDE6;
  --color-text-secondary: #6B6B7B;
  --color-win: #22C55E;
  --color-draw: #F59E0B;
  --color-loss: #EF4444;

  --font-display: var(--font-anton), sans-serif;
  --font-heading: var(--font-oswald), sans-serif;
  --font-body: var(--font-dm-sans), sans-serif;
  --font-mono: var(--font-jetbrains), monospace;
}

/* Atmosphere: noise texture overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.03;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Atmosphere: scan lines */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.02;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(240, 237, 230, 0.5) 2px,
    rgba(240, 237, 230, 0.5) 4px
  );
}

/* Disable atmosphere for reduced motion */
@media (prefers-reduced-motion: reduce) {
  body::before,
  body::after {
    display: none;
  }
}
```

**Step 4: Verify dev server starts**

```bash
cd /Users/ohmmingrath/Projects/manu-glory
npm run dev
```

Expected: Dev server on http://localhost:3000 with dark background (#0A0A0F).

**Step 5: Commit**

```bash
git add src/app/fonts.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat: add theme system with fonts, colors, and atmosphere layers"
```

---

## Task 3: Floating Particles Component

**Files:**
- Create: `src/components/particles.tsx`

**Step 1: Create CSS-only particles component**

Create `src/components/particles.tsx`:

```tsx
import styles from "./particles.module.css";

const PARTICLE_COUNT = 12;

export function Particles() {
  return (
    <div className={styles.container} aria-hidden="true">
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  );
}
```

Create `src/components/particles.module.css`:

```css
.container {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #F0EDE6;
  opacity: 0;
  animation: drift linear infinite;
}

@keyframes drift {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0);
  }
  20% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
    transform: translate3d(-30px, -80px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle {
    animation: none;
    display: none;
  }
}
```

**Step 2: Commit**

```bash
git add src/components/particles.tsx src/components/particles.module.css
git commit -m "feat: add floating particles with reduced-motion support"
```

---

## Task 4: Football API Integration

**Files:**
- Create: `src/lib/football-api.ts`
- Create: `src/lib/types.ts`

**Step 1: Create shared types**

Create `src/lib/types.ts`:

```typescript
export interface Match {
  id: number;
  utcDate: string;
  status: "FINISHED" | "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "POSTPONED" | "CANCELLED";
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

export interface StreakData {
  streak: number;
  matches: MatchDisplay[];
  nextMatch: {
    opponent: string;
    opponentTla: string;
    date: string;
    homeOrAway: "H" | "A";
  } | null;
  lastUpdated: string;
}
```

**Step 2: Create football API client with streak calculation**

Create `src/lib/football-api.ts`:

```typescript
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
```

**Step 3: Commit**

```bash
git add src/lib/types.ts src/lib/football-api.ts
git commit -m "feat: add football API client with streak calculation"
```

---

## Task 5: Supabase Client & Vote API

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/votes.ts`
- Create: `src/app/api/vote/route.ts`

**Step 1: Create Supabase server client**

Create `src/lib/supabase/server.ts`:

```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Note: We use the base client, not the SSR one, because we don't need auth/cookies. This is a simple anonymous vote counter.

**Step 2: Create votes helper**

Create `src/lib/votes.ts`:

```typescript
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
```

**Step 3: Create vote API route (Edge)**

Create `src/app/api/vote/route.ts`:

```typescript
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
```

**Step 4: Commit**

```bash
git add src/lib/supabase/ src/lib/votes.ts src/app/api/vote/route.ts
git commit -m "feat: add Supabase client and vote API edge route"
```

---

## Task 6: Hero — Streak Counter Component

**Files:**
- Create: `src/components/streak-counter.tsx`

**Step 1: Build the hero section**

Create `src/components/streak-counter.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "motion/react";

interface StreakCounterProps {
  streak: number;
  tagline?: string;
}

export function StreakCounter({ streak, tagline }: StreakCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      count.set(streak);
      return;
    }

    const controls = animate(count, streak, {
      duration: 1.5,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [count, streak]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = String(v);
      }
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Floodlight haze */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(227,27,35,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <h1 className="relative z-10 text-center">
        <span className="block font-heading text-sm uppercase tracking-[0.3em] text-text-secondary md:text-base">
          Unbeaten Streak
        </span>
        <motion.span
          ref={displayRef}
          className="mt-2 block font-display text-[96px] leading-none text-text-primary md:text-[180px]"
          style={{
            textShadow: "0 0 120px rgba(227,27,35,0.3)",
            fontVariantNumeric: "tabular-nums",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {streak}
        </motion.span>
        <span className="block font-heading text-sm uppercase tracking-[0.3em] text-text-secondary md:text-base">
          Matches
        </span>
      </h1>

      {tagline ? (
        <p className="relative z-10 mt-6 rounded-full border border-gold/30 px-4 py-1.5 font-body text-xs text-text-secondary md:text-sm">
          {tagline}
        </p>
      ) : null}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-secondary/50"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/streak-counter.tsx
git commit -m "feat: add streak counter hero with counting animation"
```

---

## Task 7: Vote Section Component

**Files:**
- Create: `src/components/vote-section.tsx`
- Create: `src/components/vote-result-bar.tsx`

**Step 1: Create the result bar**

Create `src/components/vote-result-bar.tsx`:

```tsx
"use client";

import { motion } from "motion/react";

interface VoteResultBarProps {
  yes: number;
  no: number;
}

export function VoteResultBar({ yes, no }: VoteResultBarProps) {
  const total = yes + no;
  const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;
  const noPercent = total > 0 ? 100 - yesPercent : 0;

  const formatter = new Intl.NumberFormat("en-GB");

  return (
    <div aria-live="polite" className="w-full max-w-md space-y-3">
      <div className="relative h-10 w-full overflow-hidden rounded-lg bg-surface">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg bg-red"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: yesPercent / 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "left", width: "100%" }}
        />
        <div className="relative z-10 flex h-full items-center justify-between px-3">
          <span className="font-mono text-sm font-medium text-text-primary">
            YES {yesPercent}%
          </span>
          <span className="font-mono text-sm font-medium text-text-primary">
            NO {noPercent}%
          </span>
        </div>
      </div>
      <p className="text-center font-body text-sm text-text-secondary">
        {formatter.format(total)} fans have voted
      </p>
    </div>
  );
}
```

**Step 2: Create the vote section**

Create `src/components/vote-section.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VoteResultBar } from "./vote-result-bar";

interface VoteSectionProps {
  matchId: string;
  opponent: string;
  matchDate: string;
  homeOrAway: "H" | "A";
  initialVotes: { yes: number; no: number };
}

type VoteState = "idle" | "voting" | "voted" | "error";

const STORAGE_KEY = "manu-glory-votes-v1";

function hasVoted(matchId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return stored[matchId] ?? null;
  } catch {
    return null;
  }
}

function saveVote(matchId: string, vote: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    stored[matchId] = vote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage unavailable — silent fail
  }
}

export function VoteSection({
  matchId,
  opponent,
  matchDate,
  homeOrAway,
  initialVotes,
}: VoteSectionProps) {
  const existingVote = hasVoted(matchId);
  const [state, setState] = useState<VoteState>(
    existingVote ? "voted" : "idle"
  );
  const [userVote, setUserVote] = useState<string | null>(existingVote);
  const [votes, setVotes] = useState(initialVotes);

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const handleVote = useCallback(
    async (vote: "yes" | "no") => {
      setState("voting");
      try {
        const res = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId, vote }),
        });

        if (!res.ok) throw new Error("Vote failed");

        const counts = await res.json();
        setVotes(counts);
        setUserVote(vote);
        saveVote(matchId, vote);
        setState("voted");
      } catch {
        setState("error");
      }
    },
    [matchId]
  );

  const total = votes.yes + votes.no;
  const isEmptyState = total === 0 && state === "idle";
  const prefix = homeOrAway === "H" ? "Beat" : "Beat";

  return (
    <section
      id="vote"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16"
    >
      <p className="mb-2 font-heading text-xs uppercase tracking-[0.2em] text-text-secondary md:text-sm">
        Next Match \u2014 {dateFormatter.format(new Date(matchDate))}
      </p>

      <h2
        className="mb-8 text-center font-heading text-2xl font-bold uppercase text-text-primary md:text-3xl"
        style={{ textWrap: "balance" }}
      >
        Will United {prefix} {opponent}?
      </h2>

      {isEmptyState ? (
        <p className="mb-6 text-center font-heading text-sm uppercase tracking-wider text-gold">
          Be the first to vote
        </p>
      ) : null}

      <AnimatePresence mode="wait">
        {state === "idle" || state === "voting" || state === "error" ? (
          <motion.div
            key="buttons"
            className="flex w-full max-w-md flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => handleVote("yes")}
              disabled={state === "voting"}
              aria-label={`Vote yes, United will beat ${opponent}`}
              className="flex-1 rounded-xl bg-red px-8 py-5 font-heading text-lg font-semibold uppercase tracking-wider text-text-primary transition-[transform,box-shadow] duration-200 hover:shadow-[0_0_40px_rgba(227,27,35,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.97] disabled:opacity-60"
              style={{ touchAction: "manipulation" }}
            >
              {state === "voting" ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Voting\u2026
                </span>
              ) : (
                "Yes, We Win"
              )}
            </button>
            <button
              onClick={() => handleVote("no")}
              disabled={state === "voting"}
              aria-label={`Vote no, United will not beat ${opponent}`}
              className="flex-1 rounded-xl border border-text-secondary/20 bg-surface px-8 py-5 font-heading text-lg font-semibold uppercase tracking-wider text-text-primary transition-[transform,box-shadow] duration-200 hover:border-text-secondary/40 hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.97] disabled:opacity-60"
              style={{ touchAction: "manipulation" }}
            >
              Not Today
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="flex w-full flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-heading text-sm uppercase tracking-wider text-gold">
              You voted: {userVote === "yes" ? "Yes, We Win" : "Not Today"}
            </p>
            <VoteResultBar yes={votes.yes} no={votes.no} />
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("vote", userVote || "yes");
                navigator.clipboard.writeText(url.toString());
              }}
              className="mt-2 rounded-lg border border-text-secondary/20 px-6 py-2.5 font-body text-sm text-text-secondary transition-[transform,border-color] duration-200 hover:border-text-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.97]"
              style={{ touchAction: "manipulation" }}
            >
              Share Your Vote \u2192
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {state === "error" ? (
        <p className="mt-4 text-center font-body text-sm text-text-secondary">
          Couldn\u2019t register your vote. Tap to try again.
        </p>
      ) : null}
    </section>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/vote-section.tsx src/components/vote-result-bar.tsx
git commit -m "feat: add vote section with all states (idle, voting, voted, error, empty)"
```

---

## Task 8: Match History Component

**Files:**
- Create: `src/components/match-history.tsx`

**Step 1: Build the match history list**

Create `src/components/match-history.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MatchDisplay } from "@/lib/types";

interface MatchHistoryProps {
  matches: MatchDisplay[];
  lastUpdated: string;
}

const INITIAL_SHOW = 3;

const resultColors: Record<string, string> = {
  W: "border-l-win",
  D: "border-l-draw",
  L: "border-l-loss",
};

const resultLabels: Record<string, string> = {
  W: "W",
  D: "D",
  L: "L",
};

export function MatchHistory({ matches, lastUpdated }: MatchHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? matches : matches.slice(0, INITIAL_SHOW);

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  });

  const updatedDate = new Date(lastUpdated);
  const hoursAgo = Math.floor(
    (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60)
  );
  const isStale = hoursAgo >= 2;

  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    style: "long",
  });

  return (
    <section className="mx-auto w-full max-w-md px-4 py-16">
      <h3 className="mb-6 text-center font-heading text-sm uppercase tracking-[0.3em] text-text-secondary">
        The Streak
      </h3>

      {isStale ? (
        <p className="mb-4 text-center font-body text-xs text-text-secondary">
          \u23F1 Updated {relativeFormatter.format(-hoursAgo, "hour")}
        </p>
      ) : null}

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visible.map((match) => (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-3 rounded-lg border-l-4 bg-surface px-4 py-3 ${resultColors[match.result]}`}
            >
              <span
                className={`font-mono text-xs font-bold ${
                  match.result === "W"
                    ? "text-win"
                    : match.result === "D"
                      ? "text-draw"
                      : "text-loss"
                }`}
              >
                {resultLabels[match.result]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm text-text-primary">
                  {match.homeOrAway === "A" ? `${match.opponent} ` : ""}
                  {match.scoreHome}-{match.scoreAway}
                  {match.homeOrAway === "H" ? ` ${match.opponent}` : ""}
                </p>
              </div>
              <span className="shrink-0 font-body text-xs text-text-secondary">
                {dateFormatter.format(new Date(match.date))}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {matches.length > INITIAL_SHOW ? (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mx-auto mt-4 block font-body text-sm text-text-secondary transition-[color] duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          style={{ touchAction: "manipulation" }}
        >
          {expanded
            ? "Show Less \u25B4"
            : `Show All ${matches.length} Matches \u25BE`}
        </button>
      ) : null}
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/match-history.tsx
git commit -m "feat: add match history with expand/collapse and stale data badge"
```

---

## Task 9: Footer Component

**Files:**
- Create: `src/components/footer.tsx`

**Step 1: Build the footer**

Create `src/components/footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="pb-[env(safe-area-inset-bottom)] pt-16">
      <div className="flex flex-col items-center gap-3 px-4 pb-8">
        <p className="font-heading text-sm uppercase tracking-[0.3em] text-text-secondary/40">
          Glory Glory Man United
        </p>
        <p className="font-body text-xs text-text-secondary">
          Built for the faithful.
        </p>
        <p className="font-body text-xs text-text-secondary">
          Data from{" "}
          <a
            href="https://www.football-data.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-[color] duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            football-data.org
          </a>
        </p>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/footer.tsx
git commit -m "feat: add footer with safe-area-inset support"
```

---

## Task 10: Main Page — Wire Everything Together

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build the main page as a server component**

Replace `src/app/page.tsx`:

```tsx
import { Suspense } from "react";
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

export default async function Home() {
  let streakData;
  try {
    streakData = await getStreakData();
  } catch {
    // Fallback: show a static message if API is down
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
```

**Step 2: Verify dev server works**

```bash
cd /Users/ohmmingrath/Projects/manu-glory
npm run dev
```

Expected: http://localhost:3000 renders the full page (may show API errors without valid keys — that's fine).

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up main page with parallel data fetching and suspense"
```

---

## Task 11: OG Image Generation

**Files:**
- Create: `src/app/api/og/route.tsx`
- Modify: `src/app/page.tsx` (add dynamic OG metadata)

**Step 1: Create OG image endpoint**

Create `src/app/api/og/route.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const vote = searchParams.get("vote") || "yes";
  const streak = searchParams.get("streak") || "0";
  const opponent = searchParams.get("opponent") || "their next opponent";
  const pct = searchParams.get("pct") || "50";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0F",
          backgroundImage:
            "radial-gradient(ellipse at 50% 30%, rgba(227,27,35,0.08) 0%, transparent 70%)",
          fontFamily: "sans-serif",
          color: "#F0EDE6",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "#6B6B7B",
            marginBottom: 8,
          }}
        >
          Unbeaten Streak
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 8,
            textShadow: "0 0 80px rgba(227,27,35,0.3)",
          }}
        >
          {streak}
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "#6B6B7B",
            marginBottom: 32,
          }}
        >
          Matches
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#D4A843",
            marginBottom: 8,
          }}
        >
          I voted {vote === "yes" ? "YES" : "NO"} \u2014
        </div>
        <div
          style={{
            fontSize: 28,
          }}
        >
          United will {vote === "yes" ? "beat" : "not beat"} {opponent}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#6B6B7B",
            marginTop: 24,
          }}
        >
          {pct}% of fans agree
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Step 2: Add dynamic metadata to page.tsx**

Add a `generateMetadata` export at the top of `src/app/page.tsx` (after imports, before the component):

```typescript
import type { Metadata } from "next";

// Add this function before the Home component:
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
    description: `Manchester United are ${streak} matches unbeaten. Vote on whether they'll beat ${opponent}.`,
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
```

**Step 3: Commit**

```bash
git add src/app/api/og/route.tsx src/app/page.tsx
git commit -m "feat: add dynamic OG image generation and page metadata"
```

---

## Task 12: Supabase Table Setup

**Step 1: Create the votes table in Supabase**

Go to your Supabase project dashboard → SQL Editor → run:

```sql
CREATE TABLE votes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   TEXT NOT NULL,
  vote       TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_votes_match ON votes(match_id);
```

**Step 2: Set environment variables**

Update `.env.local` with your actual Supabase URL and anon key from the Supabase dashboard (Settings → API).

Also register at https://www.football-data.org/client/register and add the API key.

---

## Task 13: Build Verification & Polish

**Step 1: Run production build**

```bash
cd /Users/ohmmingrath/Projects/manu-glory
npm run build
```

Fix any TypeScript or build errors.

**Step 2: Run production server locally**

```bash
npm run start
```

Visit http://localhost:3000 and verify:
- Dark background loads with noise texture and scan lines
- Particles float (check prefers-reduced-motion by toggling in DevTools)
- Streak counter animates from 0 → N
- Vote buttons are tappable, show spinner during API call
- Result bar animates after voting
- Match history shows 3 matches, expands to all
- Footer renders at bottom
- OG image at /api/og renders correctly
- View source has correct meta tags

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: build verification and polish"
```

---

## Task 14: Deploy to Vercel

**Step 1: Push to GitHub**

```bash
cd /Users/ohmmingrath/Projects/manu-glory
gh repo create manu-glory --public --source=. --push
```

**Step 2: Deploy via Vercel CLI or Dashboard**

```bash
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `FOOTBALL_DATA_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

**Step 3: Verify production deployment**

Visit the Vercel URL and run through the same checklist from Task 13.
