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
    // localStorage unavailable
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

  return (
    <section
      id="vote"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16"
    >
      <p className="mb-2 font-heading text-xs uppercase tracking-[0.2em] text-text-secondary md:text-sm">
        Next Match — {dateFormatter.format(new Date(matchDate))}
      </p>

      <h2
        className="mb-8 text-center font-heading text-2xl font-bold uppercase text-text-primary md:text-3xl"
        style={{ textWrap: "balance" }}
      >
        Will United Beat {opponent}?
      </h2>

      {isEmptyState ? (
        <p className="mb-6 text-center font-heading text-sm uppercase tracking-wider text-gold">
          Be the first to vote
        </p>
      ) : null}

      <AnimatePresence mode="wait">
        {state !== "voted" ? (
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
                  Voting…
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
              Share Your Vote →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {state === "error" ? (
        <p className="mt-4 text-center font-body text-sm text-text-secondary">
          Couldn't register your vote. Tap to try again.
        </p>
      ) : null}
    </section>
  );
}
