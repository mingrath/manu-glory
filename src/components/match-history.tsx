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

export function MatchHistory({ matches, lastUpdated }: MatchHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? matches : matches.slice(0, INITIAL_SHOW);

  const wins = matches.filter((m) => m.result === "W").length;
  const draws = matches.filter((m) => m.result === "D").length;

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
    <section className="mx-auto w-full max-w-lg px-4 py-16">
      <h3 className="mb-2 text-center font-heading text-sm uppercase tracking-[0.3em] text-text-secondary">
        The Streak
      </h3>

      {/* Stats summary bar */}
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="text-center">
          <span className="block font-display text-3xl text-text-primary">
            {matches.length}
          </span>
          <span className="font-body text-[10px] uppercase tracking-wider text-text-secondary">
            Unbeaten
          </span>
        </div>
        <div className="h-8 w-px bg-text-secondary/20" />
        <div className="text-center">
          <span className="block font-display text-3xl text-win">
            {wins}
          </span>
          <span className="font-body text-[10px] uppercase tracking-wider text-text-secondary">
            Wins
          </span>
        </div>
        <div className="h-8 w-px bg-text-secondary/20" />
        <div className="text-center">
          <span className="block font-display text-3xl text-draw">
            {draws}
          </span>
          <span className="font-body text-[10px] uppercase tracking-wider text-text-secondary">
            Draws
          </span>
        </div>
        <div className="h-8 w-px bg-text-secondary/20" />
        <div className="text-center">
          <span className="block font-display text-3xl text-text-primary">
            0
          </span>
          <span className="font-body text-[10px] uppercase tracking-wider text-text-secondary">
            Losses
          </span>
        </div>
      </div>

      {/* Win rate visual bar */}
      <div className="mb-8">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-win"
            initial={{ width: 0 }}
            animate={{ width: `${(wins / matches.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          <motion.div
            className="bg-draw"
            initial={{ width: 0 }}
            animate={{ width: `${(draws / matches.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="font-mono text-[10px] text-win">
            {Math.round((wins / matches.length) * 100)}% win rate
          </span>
          <span className="font-mono text-[10px] text-text-secondary">
            0% lost
          </span>
        </div>
      </div>

      {isStale ? (
        <p className="mb-4 text-center font-body text-xs text-text-secondary">
          \u23F1 Updated {relativeFormatter.format(-hoursAgo, "hour")}
        </p>
      ) : null}

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visible.map((match, i) => (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className={`group flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 ${resultColors[match.result]} ${
                match.result === "W"
                  ? "bg-win/[0.06] hover:bg-win/[0.1]"
                  : "bg-surface hover:bg-surface/80"
              } transition-[background-color] duration-200`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                  match.result === "W"
                    ? "bg-win/20 text-win"
                    : match.result === "D"
                      ? "bg-draw/20 text-draw"
                      : "bg-loss/20 text-loss"
                }`}
              >
                {match.result}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-medium text-text-primary">
                  {match.homeOrAway === "A" ? `${match.opponent} ` : ""}
                  <span className="font-mono">
                    {match.scoreHome}-{match.scoreAway}
                  </span>
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
